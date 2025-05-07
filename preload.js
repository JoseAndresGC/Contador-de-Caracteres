const { contextBridge, ipcRenderer, nativeTheme } = require('electron');

contextBridge.exposeInMainWorld("electron", {
    ipcRenderer: {
        send: (...args) => ipcRenderer.send(...args),
        invoke: (...args) => ipcRenderer.invoke(...args),
        on: (...args) => ipcRenderer.on(...args),
        once: (...args) => ipcRenderer.once(...args),
        removeListener: (...args) => ipcRenderer.removeListener(...args),
        removeAllListeners: (...args) => ipcRenderer.removeAllListeners(...args)
    }
});

contextBridge.exposeInMainWorld("darkMode", {
    toggle: () => ipcRenderer.invoke("dark-mode:toggle"),
    // system: () => ipcRenderer.invoke("dark-mode:system"),
    isDarkMode: () => nativeTheme.shouldUseDarkColors
});

