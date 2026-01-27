const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// This is optional - only needed for Windows installers
try {
  if (require('electron-squirrel-startup')) {
    app.quit();
  }
} catch (e) {
  // electron-squirrel-startup not installed, skip
}

let mainWindow;
let mcpServerProcess = null;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// =============================================================================
// MCP SERVER MANAGEMENT
// =============================================================================

function getMcpServerPath() {
  if (isDev) {
    // In development, use the source file
    return path.join(__dirname, '../src/mcp-server/http-server.js');
  } else {
    // In production, use the bundled server
    return path.join(process.resourcesPath, 'mcp-server/http-server.js');
  }
}

async function isMcpServerRunning() {
  try {
    const response = await fetch('http://localhost:3005/health', {
      signal: AbortSignal.timeout(1000)
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function startMcpServer() {
  // Check if MCP server is already running (e.g., from npm run dev)
  if (await isMcpServerRunning()) {
    console.log('[MCP] Server already running on port 3005');
    return;
  }

  const serverPath = getMcpServerPath();

  // Check if server file exists
  if (!fs.existsSync(serverPath)) {
    console.error('MCP Server not found at:', serverPath);
    return;
  }

  console.log('Starting MCP Server from:', serverPath);

  mcpServerProcess = spawn('node', [serverPath], {
    cwd: path.dirname(serverPath),
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, NODE_ENV: isDev ? 'development' : 'production' }
  });

  mcpServerProcess.stdout.on('data', (data) => {
    console.log('[MCP]', data.toString().trim());
  });

  mcpServerProcess.stderr.on('data', (data) => {
    console.log('[MCP]', data.toString().trim());
  });

  mcpServerProcess.on('error', (error) => {
    console.error('[MCP] Failed to start:', error.message);
  });

  mcpServerProcess.on('exit', (code, signal) => {
    console.log(`[MCP] Server exited with code ${code}, signal ${signal}`);
    mcpServerProcess = null;
  });
}

function stopMcpServer() {
  if (mcpServerProcess) {
    console.log('[MCP] Stopping server...');
    mcpServerProcess.kill('SIGTERM');
    mcpServerProcess = null;
  } else {
    console.log('[MCP] Server was not started by Electron (external server)');
  }
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hiddenInset', // Nice macOS style
    show: false, // Don't show until ready
  });

  // Load the app
  if (isDev) {
    // In development, load from Vite dev server
    mainWindow.loadURL('http://localhost:3000');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  // Start MCP server first
  startMcpServer();

  createWindow();

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Clean up MCP server on quit
app.on('will-quit', () => {
  stopMcpServer();
});

app.on('before-quit', () => {
  stopMcpServer();
});

// =============================================================================
// IPC HANDLERS - File System Access for Design System Import/Export
// =============================================================================

// Open file dialog and read JSON file
ipcMain.handle('open-design-system-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Design System Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true };
  }

  try {
    const filePath = result.filePaths[0];
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    return {
      canceled: false,
      filePath,
      fileName: path.basename(filePath),
      data,
    };
  } catch (error) {
    return {
      canceled: false,
      error: error.message,
    };
  }
});

// Save design system to file
ipcMain.handle('save-design-system-file', async (event, { data, suggestedName }) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: suggestedName || 'design-system.json',
    filters: [
      { name: 'Design System Files', extensions: ['json'] },
    ],
  });

  if (result.canceled) {
    return { canceled: true };
  }

  try {
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(result.filePath, content, 'utf-8');
    return {
      canceled: false,
      filePath: result.filePath,
      fileName: path.basename(result.filePath),
    };
  } catch (error) {
    return {
      canceled: false,
      error: error.message,
    };
  }
});

// Read directory of design system files
ipcMain.handle('open-design-system-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true };
  }

  try {
    const folderPath = result.filePaths[0];
    const files = fs.readdirSync(folderPath)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        const filePath = path.join(folderPath, f);
        const content = fs.readFileSync(filePath, 'utf-8');
        try {
          return {
            fileName: f,
            filePath,
            data: JSON.parse(content),
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return {
      canceled: false,
      folderPath,
      files,
    };
  } catch (error) {
    return {
      canceled: false,
      error: error.message,
    };
  }
});

// Get app info
ipcMain.handle('get-app-info', () => {
  return {
    version: app.getVersion(),
    name: app.getName(),
    platform: process.platform,
    isDev,
  };
});

// Get MCP server status
ipcMain.handle('get-mcp-status', async () => {
  try {
    const response = await fetch('http://localhost:3005/health');
    if (response.ok) {
      return await response.json();
    }
    return { status: 'error', message: 'Server not responding' };
  } catch (error) {
    return { status: 'offline', message: error.message };
  }
});

// Restart MCP server
ipcMain.handle('restart-mcp-server', () => {
  stopMcpServer();
  setTimeout(startMcpServer, 500);
  return { success: true };
});
