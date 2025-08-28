import { app, BrowserWindow, Menu, ipcMain, dialog, shell } from 'electron';
import { join, dirname } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Gérer la création de la fenêtre principale
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: join(__dirname, 'preload.js')
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    icon: process.platform !== 'darwin' ? join(__dirname, 'assets/icon.png') : undefined
  });

  // Charger l'application
  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // Ouvrir les DevTools en développement
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'));
  }

  // Ouvrir les liens externes dans le navigateur par défaut
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  return mainWindow;
};

// Cette méthode sera appelée quand Electron aura fini de s'initialiser
app.whenReady().then(() => {
  createWindow();

  // Créer le menu de l'application
  createMenu();

  app.on('activate', () => {
    // Sur macOS, re-créer une fenêtre quand l'icône du dock est cliquée
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quitter quand toutes les fenêtres sont fermées (sauf sur macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Gestionnaires IPC pour les fonctionnalités de fichiers
ipcMain.handle('save-config', async (event, config) => {
  try {
    const { filePath } = await dialog.showSaveDialog({
      defaultPath: `${config.microserviceName || 'config'}.json`,
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (filePath) {
      await writeFile(filePath, JSON.stringify(config, null, 2));
      return { success: true, path: filePath };
    }
    return { success: false, cancelled: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-config', async () => {
  try {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (filePaths && filePaths.length > 0) {
      const content = await readFile(filePaths[0], 'utf8');
      return { success: true, data: JSON.parse(content), path: filePaths[0] };
    }
    return { success: false, cancelled: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Créer le menu de l'application
function createMenu() {
  // Menu vide pour supprimer tous les boutons
  Menu.setApplicationMenu(null);
  return;
  
  const template = [
    {
      label: 'Fichier',
      submenu: [
        {
          label: 'Nouveau projet',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.send('menu-new-project');
          }
        },
        {
          label: 'Ouvrir configuration',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.send('menu-open-config');
          }
        },
        {
          label: 'Sauvegarder configuration',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.send('menu-save-config');
          }
        },
        { type: 'separator' },
        {
          label: 'Exporter projet',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.send('menu-export-project');
          }
        },
        { type: 'separator' },
        process.platform === 'darwin' ? { role: 'close' } : { role: 'quit' }
      ]
    },
    {
      label: 'Edition',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'Affichage',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Fenêtre',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'À propos de Clean Architecture Starter Kit',
          click: () => {
            dialog.showMessageBox({
              type: 'info',
              title: 'À propos',
              message: 'Clean Architecture Starter Kit',
              detail: 'Générateur de microservices avec architecture hexagonale\n\nVersion: 1.0.0'
            });
          }
        },
        {
          label: 'Documentation',
          click: () => {
            shell.openExternal('https://github.com/votre-org/clean-archi-starter');
          }
        }
      ]
    }
  ];

  // Ajustements spécifiques à macOS
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });

    // Fenêtre menu sur macOS
    template[4].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ];
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Sécurité: Empêcher la navigation vers des URLs externes
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (navigationEvent, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    // Autoriser seulement localhost en développement
    if (parsedUrl.origin !== 'http://localhost:5173' && !app.isPackaged) {
      navigationEvent.preventDefault();
    }
  });
});