const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
app.disableHardwareAcceleration(); // <-- ADD THIS


let mainWindow = null;

function createWindow() {
  const preloadPath = path.resolve(__dirname, 'preload.cjs');
  console.log('Looking for preload at:', preloadPath); // <-- ADD THIS LINE

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: preloadPath, // <-- USE THE RESOLVED PATH
      nodeIntegration: false,
      contextIsolation: true,
    },
    frame: true,
  });
  // ...

  // Load the built React app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => (mainWindow = null));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());

// --- Open File Dialog ---
ipcMain.handle('open-file', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  });
  if (result.canceled) return '';
  return result.filePaths[0];
});

// --- Read PDF as ArrayBuffer ---
ipcMain.handle('read-pdf', async (_, filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    // Return as Uint8Array (react-pdf prefers this)
    return new Uint8Array(buffer);
  } catch (error) {
    console.error('Error reading PDF:', error);
    throw error;
  }
});