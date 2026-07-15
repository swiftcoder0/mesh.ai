const { contextBridge, ipcRenderer } = require('electron');

console.log('✅ Preload script is executing!');

try {
  contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke('open-file'),
    readPdf: (path) => ipcRenderer.invoke('read-pdf', path),
  });
  console.log('✅ electronAPI successfully exposed to window!');
} catch (error) {
  console.error('❌ Failed to expose electronAPI:', error);
}