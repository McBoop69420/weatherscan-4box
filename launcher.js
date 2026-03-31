const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const projectRoot = __dirname;
const serverScript = path.join(projectRoot, 'app.js');
const electronPath = path.join(projectRoot, 'electron-wrapper');
const electronExec = path.join(electronPath, 'node_modules', '.bin', 'electron.cmd');
const nodePath = process.execPath;
const serverUrl = 'http://127.0.0.1:8080';
const outLog = path.join(projectRoot, 'launcher.out.log');
const errLog = path.join(projectRoot, 'launcher.err.log');

let serverProcess = null;
let electronProcess = null;
let startedServer = false;
let shuttingDown = false;

function appendLog(filePath, message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(filePath, `[${timestamp}] ${message}\n`);
}

function logInfo(message) {
  appendLog(outLog, message);
}

function logError(message) {
  appendLog(errLog, message);
}

function checkServer(timeoutMs = 15000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get(serverUrl, (res) => {
        res.resume();
        resolve(true);
      });

      req.on('error', () => {
        if (Date.now() - startedAt >= timeoutMs) {
          reject(new Error('Server did not become ready in time.'));
          return;
        }

        setTimeout(attempt, 500);
      });
    };

    attempt();
  });
}

async function ensureServer() {
  try {
    await checkServer(1000);
    logInfo('Reusing existing server on port 8080.');
    return;
  } catch (_) {
    const outFd = fs.openSync(outLog, 'a');
    const errFd = fs.openSync(errLog, 'a');

    serverProcess = spawn(nodePath, [serverScript], {
      cwd: projectRoot,
      stdio: ['ignore', outFd, errFd],
      windowsHide: true,
    });

    startedServer = true;
    logInfo(`Started server with PID ${serverProcess.pid}.`);

    serverProcess.on('error', (error) => {
      logError(`Server failed to start: ${error.message}`);
    });

    serverProcess.on('exit', (code, signal) => {
      logInfo(`Server exited with code ${code} signal ${signal || 'none'}.`);
      serverProcess = null;
    });

    await checkServer();
  }
}

function startElectron() {
  if (!fs.existsSync(electronExec)) {
    throw new Error(`Electron wrapper not found at ${electronExec}`);
  }

  const nodeDir = path.dirname(nodePath);
  const env = { ...process.env, PATH: `${nodeDir};${process.env.PATH || ''}` };
  const outFd = fs.openSync(outLog, 'a');
  const errFd = fs.openSync(errLog, 'a');

  electronProcess = spawn(electronExec, ['.'], {
    cwd: electronPath,
    env,
    shell: true,
    stdio: ['ignore', outFd, errFd],
    windowsHide: true,
  });

  logInfo(`Started Electron wrapper with PID ${electronProcess.pid}.`);

  electronProcess.on('error', (error) => {
    logError(`Electron failed to start: ${error.message}`);
    cleanup(1);
  });

  electronProcess.on('exit', (code, signal) => {
    logInfo(`Electron exited with code ${code} signal ${signal || 'none'}.`);
    cleanup(code || 0);
  });
}

function cleanup(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  if (startedServer && serverProcess && !serverProcess.killed) {
    serverProcess.kill();
  }

  process.exit(exitCode);
}

process.on('SIGINT', () => cleanup(0));
process.on('SIGTERM', () => cleanup(0));

async function main() {
  try {
    logInfo('Launcher starting.');
    await ensureServer();
    startElectron();
  } catch (error) {
    logError(`Launcher failed: ${error.message}`);
    cleanup(1);
  }
}

main();
