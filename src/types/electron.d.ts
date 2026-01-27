/**
 * Electron API type definitions
 *
 * These types define the API exposed by the Electron preload script.
 * Available via window.electronAPI when running in Electron.
 */

interface ElectronFileResult {
  canceled: boolean;
  filePath?: string;
  fileName?: string;
  data?: unknown;
  error?: string;
}

interface ElectronFolderResult {
  canceled: boolean;
  folderPath?: string;
  files?: Array<{
    fileName: string;
    filePath: string;
    data: unknown;
  }>;
  error?: string;
}

interface ElectronSaveResult {
  canceled: boolean;
  filePath?: string;
  fileName?: string;
  error?: string;
}

interface ElectronAppInfo {
  version: string;
  name: string;
  platform: string;
  isDev: boolean;
}

interface ElectronAPI {
  // File operations
  openDesignSystemFile: () => Promise<ElectronFileResult>;
  saveDesignSystemFile: (data: unknown, suggestedName?: string) => Promise<ElectronSaveResult>;
  openDesignSystemFolder: () => Promise<ElectronFolderResult>;

  // App info
  getAppInfo: () => Promise<ElectronAppInfo>;

  // Environment check
  isElectron: boolean;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
