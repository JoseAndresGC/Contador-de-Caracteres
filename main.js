const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const createWindow = () => {
    const win = new BrowserWindow ({
        width: 1600,
        height: 1200,
        minHeight: 800,
        minWidth: 600,
        maxHeight: 1600,
        maxWidth: 1200,
        
    });

    win.loadFile('index.html');
    
    // Check for updates
    autoUpdater.checkForUpdatesAndNotify();
    
    return win;
}

function setupAutoUpdater(win) {
    // Configure logging
    autoUpdater.logger = require('electron-log');
    autoUpdater.logger.transports.file.level = 'info';
    
    // Event: update available
    autoUpdater.on('update-available', (info) => {
        dialog.showMessageBox(win, {
            type: 'info',
            title: 'Actualización disponible',
            message: `Se ha encontrado la versión ${info.version}. Se descargará automáticamente.`,
            buttons: ['OK']
        });
    });
    
    // Event: update downloaded
    autoUpdater.on('update-downloaded', (info) => {
        dialog.showMessageBox(win, {
            type: 'info',
            title: 'Actualización lista',
            message: `La versión ${info.version} se ha descargado y se instalará al reiniciar la aplicación.`,
            buttons: ['Reiniciar ahora', 'Más tarde']
        }).then((result) => {
            if (result.response === 0) {
                autoUpdater.quitAndInstall();
            }
        });
    });
    
    // Event: error during update
    autoUpdater.on('error', (err) => {
        dialog.showMessageBox(win, {
            type: 'error',
            title: 'Error en la actualización',
            message: 'Ocurrió un error al actualizar la aplicación.',
            detail: err.toString(),
            buttons: ['OK']
        });
    });
    
    // Check for updates periodically (every hour)
    setInterval(() => {
        autoUpdater.checkForUpdates();
    }, 60 * 60 * 1000);
}
app.whenReady().then(() => {
    const mainWindow = createWindow();
    setupAutoUpdater(mainWindow);
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            const newWindow = createWindow();
            setupAutoUpdater(newWindow);
        }
    });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
