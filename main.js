const { app, BrowserWindow, ipcMain, dialog, nativeTheme } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const path = require('path');

const createWindow = () => {
    const win = new BrowserWindow ({
        width: 800,
        height: 839.676,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
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

ipcMain.on("open-options-menu", () => {
    const menuWindow = new BrowserWindow ({
        width: 400,
        height: 300,
        frame: false,
        resizable: false,
        minimizable: false,
        maximizable: false,
        fullscreenable: false,
        parent: BrowserWindow.getFocusedWindow(),
        modal: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        }
    });
    menuWindow.loadFile("menu.html");

    // menuWindow.once("ready-to-show", () => {
    //     menuWindow.setBounds ({
    //         x: 0,
    //         y: 0,
    //         width: 400,
    //         height: 300
    //     });
    // });
});

ipcMain.on("close-options-menu", (event) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        win.close();
    }
});

// autoUpdater configuracion

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

// modo oscuro

ipcMain.handle("dark-mode:toggle", (event) => {
    if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = "light"; // Cambia a modo claro
    } else { 
        nativeTheme.themeSource = "dark"; // Cambia a modo oscuro
    }
    return nativeTheme.shouldUseDarkColors; // Devuelve el estado actual del modo oscuro
});

ipcMain.handle("dark-mode:system", () => {
    nativeTheme.themeSource = "system"; // Cambia al modo del sistema 
});

// Inicializar la app

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

// Quit cuando todas las ventanas están cerradas (excepto en macOS)
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
});

// controlar el boton de cerrar
ipcMain.on("control-button-close", (event) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        win.close();
    }
});

console.log('Iniciando verificación de actualizaciones...');
autoUpdater.checkForUpdates().then((result) => {
    console.log('Resultado de la verificación de actualizaciones:', result);
}).catch((error) => {
    console.error('Error al verificar actualizaciones:', error);
});

// iniciar la app sin el modo oscuro del sistema 

nativeTheme.themeSource = "light"; 