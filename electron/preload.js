const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations for design systems
  openDesignSystemFile: () => ipcRenderer.invoke('open-design-system-file'),
  saveDesignSystemFile: (data, suggestedName) =>
    ipcRenderer.invoke('save-design-system-file', { data, suggestedName }),
  openDesignSystemFolder: () => ipcRenderer.invoke('open-design-system-folder'),

  // App info
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),

  // MCP Server management
  getMcpStatus: () => ipcRenderer.invoke('get-mcp-status'),
  restartMcpServer: () => ipcRenderer.invoke('restart-mcp-server'),

  // Check if running in Electron
  isElectron: true,
});

// Log that preload script has loaded
console.log('Electron preload script loaded');
