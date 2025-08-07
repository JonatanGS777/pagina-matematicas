// global-init.js - Inicialización para todas las páginas
function initGlobalFeatures() {
    // Inicializar modo oscuro en todas las páginas
    if (window.DarkMode) {
        window.DarkMode.initDarkMode();
    }
    
    // Aquí puedes añadir otros efectos globales
    // como partículas matemáticas si las quieres en todas las páginas
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalFeatures);
} else {
    initGlobalFeatures();
}