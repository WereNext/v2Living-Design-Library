/**
 * Electron Integration Hook
 *
 * Provides access to Electron APIs when running as a desktop app.
 * Falls back gracefully when running in a browser.
 */

import { useState, useEffect, useCallback } from 'react';

interface ElectronAppInfo {
  version: string;
  name: string;
  platform: string;
  isDev: boolean;
}

interface DesignSystemFile {
  fileName: string;
  filePath: string;
  data: unknown;
}

interface UseElectronResult {
  /** Whether the app is running in Electron */
  isElectron: boolean;

  /** App info (only available in Electron) */
  appInfo: ElectronAppInfo | null;

  /** Open a file picker to select a design system JSON file */
  openDesignSystemFile: () => Promise<{
    success: boolean;
    fileName?: string;
    data?: unknown;
    error?: string;
  }>;

  /** Save a design system to a file */
  saveDesignSystemFile: (data: unknown, suggestedName?: string) => Promise<{
    success: boolean;
    fileName?: string;
    error?: string;
  }>;

  /** Open a folder and load all design system JSON files */
  openDesignSystemFolder: () => Promise<{
    success: boolean;
    files?: DesignSystemFile[];
    error?: string;
  }>;
}

export function useElectron(): UseElectronResult {
  const [isElectron, setIsElectron] = useState(false);
  const [appInfo, setAppInfo] = useState<ElectronAppInfo | null>(null);

  useEffect(() => {
    // Check if we're running in Electron
    const electronAPI = window.electronAPI;
    if (electronAPI?.isElectron) {
      setIsElectron(true);

      // Get app info
      electronAPI.getAppInfo().then(info => {
        setAppInfo(info);
      });
    }
  }, []);

  const openDesignSystemFile = useCallback(async () => {
    if (!window.electronAPI) {
      return { success: false, error: 'Not running in Electron' };
    }

    try {
      const result = await window.electronAPI.openDesignSystemFile();

      if (result.canceled) {
        return { success: false, error: 'File selection canceled' };
      }

      if (result.error) {
        return { success: false, error: result.error };
      }

      return {
        success: true,
        fileName: result.fileName,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }, []);

  const saveDesignSystemFile = useCallback(async (data: unknown, suggestedName?: string) => {
    if (!window.electronAPI) {
      return { success: false, error: 'Not running in Electron' };
    }

    try {
      const result = await window.electronAPI.saveDesignSystemFile(data, suggestedName);

      if (result.canceled) {
        return { success: false, error: 'Save canceled' };
      }

      if (result.error) {
        return { success: false, error: result.error };
      }

      return {
        success: true,
        fileName: result.fileName,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }, []);

  const openDesignSystemFolder = useCallback(async () => {
    if (!window.electronAPI) {
      return { success: false, error: 'Not running in Electron' };
    }

    try {
      const result = await window.electronAPI.openDesignSystemFolder();

      if (result.canceled) {
        return { success: false, error: 'Folder selection canceled' };
      }

      if (result.error) {
        return { success: false, error: result.error };
      }

      return {
        success: true,
        files: result.files as DesignSystemFile[],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }, []);

  return {
    isElectron,
    appInfo,
    openDesignSystemFile,
    saveDesignSystemFile,
    openDesignSystemFolder,
  };
}

/**
 * Simple check if running in Electron (can be used outside of React)
 */
export function isRunningInElectron(): boolean {
  return typeof window !== 'undefined' && !!window.electronAPI?.isElectron;
}
