const { app, BrowserWindow } = require('electron');
const path = require('path');

// Simple démo Electron
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Charger une page simple pour démonstration
  mainWindow.loadURL('https://www.google.com');
  
  // Ou charger votre app locale si elle fonctionne
  // mainWindow.loadURL('http://localhost:5173');
  
  console.log('✅ Electron démarre avec succès !');
  console.log('🖥️  Une fenêtre native s\'est ouverte');
  console.log('🎯 Votre app React pourrait tourner ici');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});