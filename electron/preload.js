const { contextBridge, ipcRenderer } = require('electron');

// Exposer les APIs Electron de manière sécurisée
contextBridge.exposeInMainWorld('electronAPI', {
  // Gestion des fichiers
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  
  // Écouter les événements du menu
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-new-project', callback);
    ipcRenderer.on('menu-open-config', callback);
    ipcRenderer.on('menu-save-config', callback);
    ipcRenderer.on('menu-export-project', callback);
  },
  
  // Supprimer les écouteurs
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // Informations sur l'application
  isElectron: true,
  platform: process.platform,
  version: process.versions.electron
});

// Sécurité: Empêcher l'accès au processus Node.js depuis le renderer
delete window.process;
delete window.global;
delete window.Buffer;