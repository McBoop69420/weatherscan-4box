const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const os = require('os');

// Paths
const projectRoot = __dirname;
const serverScript = path.join(projectRoot, 'app.js');
const electronPath = path.join(projectRoot, 'electron-wrapper');

// Get node executable path
const nodePath = process.execPath;

// Get electron executable path
const electronExec = path.join(electronPath, 'node_modules', '.bin', 'electron.cmd');

let serverProcess = null;
let electronProcess = null;

// Check if server is ready
function checkServer(retries = 30) {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get('http://localhost:8080', (res) => {
        console.log('Server is ready!');
        resolve();
      });

      req.on('error', (err) => {
        if (retries > 0) {
          console.log(`Waiting for server... (${retries} retries left)`);
          setTimeout(() => {
            retries--;
            attempt();
          }, 1000);
        } else {
          reject(new Error('Server failed to start'));
        }
      });
    };

    attempt();
  });
}

// Start Express server
async function startServer() {
  console.log('Starting Weatherscan Express server...');

  serverProcess = spawn(nodePath, [serverScript], {
    cwd: projectRoot,
    stdio: 'inherit'
  });

  serverProcess.on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

  // Wait for server to be ready
  await checkServer();
}

// Start Electron app
function startElectron() {
  console.log('Launching Electron app...');

  // Add Node.js to PATH for Electron
  const nodeDir = path.dirname(nodePath);
  const env = Object.assign({}, process.env);
  env.PATH = `${nodeDir};${env.PATH || ''}`;

  electronProcess = spawn(electronExec, ['.'], {
    cwd: electronPath,
    stdio: 'inherit',
    shell: true,
    env: env
  });

  electronProcess.on('error', (err) => {
    console.error('Failed to start Electron:', err);
    cleanup();
  });

  electronProcess.on('exit', (code) => {
    console.log(`Electron exited with code ${code}`);
    cleanup();
  });
}

// Cleanup and exit
function cleanup() {
  console.log('Shutting down...');

  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }

  process.exit(0);
}

// Handle termination signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Main execution
async function main() {
  console.log('=================================');
  console.log('Weatherscan XL Standalone Launcher');
  console.log('by Mist Weather Media');
  console.log('=================================\n');

  try {
    await startServer();
    startElectron();
  } catch (err) {
    console.error('Error:', err.message);
    cleanup();
  }
}

main();
