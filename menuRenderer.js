const ipcRenderer = window.electron.ipcRenderer;

// Botón para cerrar la ventana de opciones
document.getElementById("close-options-menu").addEventListener("click", () => {
    ipcRenderer.send("close-options-menu");
});
