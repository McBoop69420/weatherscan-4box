const { app, BrowserWindow, globalShortcut } = require('electron');

function triggerSlideAdvance(win) {
  if (!win || win.isDestroyed()) {
    return;
  }

  win.webContents.executeJavaScript(`
    (() => {
      if (window.advanceSlidesNow && window.advanceSlidesNow()) {
        return true;
      }
      return false;
    })();
  `).catch(() => {});
}

function createWindow () {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    frame: false,
    resizable: true,
    transparent: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.loadURL('http://localhost:8080');

  win.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') {
      return;
    }

    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Left', 'Right', 'Up', 'Down'].includes(input.key)) {
      return;
    }

    event.preventDefault();
    triggerSlideAdvance(win);
  });

  const shortcutKeys = ['Left', 'Right', 'Up', 'Down'];

  win.on('focus', () => {
    shortcutKeys.forEach((key) => {
      globalShortcut.register(key, () => triggerSlideAdvance(win));
    });
  });

  win.on('blur', () => {
    shortcutKeys.forEach((key) => globalShortcut.unregister(key));
  });

  win.on('closed', () => {
    shortcutKeys.forEach((key) => globalShortcut.unregister(key));
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
