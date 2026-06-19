const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // Configuración de la ventana nativa
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "Streaming Manager - Sampix",
    icon: path.join(__dirname, 'build', 'icon.ico'), 
    webPreferences: {
      nodeIntegration: true,     // Permite usar require en las vistas si lo necesitas
      contextIsolation: false,   // Facilita la comunicación con scripts locales
    }
  });

  // Maximizar al arrancar para ver el panel completo
  mainWindow.maximize();

  // CARGA DIRECTA: Busca el index.html en la raíz de tu proyecto
 // En lugar de loadFile o loadURL antiguo, pon la dirección local de Vite:
mainWindow.loadURL('http://localhost:5173');
  // Quita la barra de menús de arriba para diseño limpio de app nativa
  mainWindow.setMenu(null);

  // Abre la consola de desarrollo automáticamente por si hay errores visuales de Vue
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Ciclo de vida de Electron
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});