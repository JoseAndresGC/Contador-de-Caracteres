const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

const createWindow = () => {
    const win = new BrowserWindow ({
        width: 800,
        height: 839.676,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');

    win.once("ready-to-show", () => {
        win.setBounds ({
            x: 0,
            y: 0,
            width: 800,
            height: 839.676
        });
    });
    
    // Check for updates
    autoUpdater.checkForUpdatesAndNotify();
    
    return win;
}

function setupAutoUpdater(win) {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;

    autoUpdater.on('checking-for-update', () => {
        log.info('Buscando actualizaciones...');
    });

    autoUpdater.on('update-available', (info) => {
        log.info('Actualización disponible:', info);
        dialog.showMessageBox(win, {
            type: 'info',
            title: 'Actualización disponible',
            message: `Se ha encontrado la versión ${info.version}. Se descargará automáticamente.`,
            buttons: ['OK']
        });
    });

    autoUpdater.on('update-not-available', (info) => {
        log.info('No hay actualizaciones disponibles:', info);
    });

    autoUpdater.on('error', (err) => {
        log.error('Error en la actualización:', err);
        dialog.showMessageBox(win, {
            type: 'error',
            title: 'Error en la actualización',
            message: 'Ocurrió un error al actualizar la aplicación.',
            detail: err.toString(),
            buttons: ['OK']
        });
    });

    autoUpdater.on('update-downloaded', (info) => {
        log.info('Actualización descargada:', info);
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

    // Verificar actualizaciones periódicamente
    setInterval(() => {
        log.info('Verificando actualizaciones periódicamente...');
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

// controlar el boton de minimizar
ipcMain.on("control-button-minimize", (event) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        win.minimize();
    }
})

// controlar el boton de cerrar
ipcMain.on("control-button-close", (event) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        win.close();
    }
})

console.log('Iniciando verificación de actualizaciones...');
autoUpdater.checkForUpdates().then((result) => {
    console.log('Resultado de la verificación de actualizaciones:', result);
}).catch((error) => {
    console.error('Error al verificar actualizaciones:', error);
});