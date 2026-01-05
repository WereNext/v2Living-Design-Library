const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Navigation events
  onNewDesignSystem: (callback) => {
    ipcRenderer.on('new-design-system', callback);
  },
  onImportDesignSystem: (callback) => {
    ipcRenderer.on('import-design-system', callback);
  },
  onExportDesignSystem: (callback) => {
    ipcRenderer.on('export-design-system', callback);
  },
  onOpenPreferences: (callback) => {
    ipcRenderer.on('open-preferences', callback);
  },
  onOpenDocumentation: (callback) => {
    ipcRenderer.on('open-documentation', callback);
  },
  onOpenFile: (callback) => {
    ipcRenderer.on('open-file', callback);
  },
  
  // Platform info
  platform: process.platform,
  isElectron: true
});
