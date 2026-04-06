// Script para corregir el Laboratorio Virtual
document.addEventListener('DOMContentLoaded', function() {
    console.log("Aplicando corrección para el laboratorio virtual...");
    
    // Obtener elementos del microscopio
    const microscopeImage = document.getElementById('microscopeImage');
    const sampleOptions = document.querySelectorAll('.sample-option');
    
    // Si no existen, salir
    if (!microscopeImage || sampleOptions.length === 0) {
        console.log("No se encontraron elementos del microscopio");
        return;
    }
    
    // Eliminar eventos anteriores y agregar nuevos
    sampleOptions.forEach(option => {
        // Clonar para eliminar event listeners previos
        const newOption = option.cloneNode(true);
        option.parentNode.replaceChild(newOption, option);
    });
    
    // Volver a seleccionar las opciones
    const newSampleOptions = document.querySelectorAll('.sample-option');
    
    // Añadir nuevos event listeners
    newSampleOptions.forEach(option => {
        option.addEventListener('click', function() {
            const sampleId = this.getAttribute('data-sample');
            
            // Actualizar imagen con la ruta correcta
            microscopeImage.src = `images/${sampleId}.png`;
            
            // Actualizar clases de opciones activas
            newSampleOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Actualizar información de la muestra si existe la función
            if (typeof updateSampleInfo === 'function') {
                updateSampleInfo(sampleId);
            } else {
                console.log("Función updateSampleInfo no disponible");
                
                // Intento de actualizar información básica
                const observationsPanel = document.getElementById('sample-observations');
                const sampleData = {
                    'fase-lag': 'Fase de Latencia (0-2h): Las bacterias están adaptándose al medio. Hay poca división celular.',
                    'fase-exponencial': 'Fase Exponencial (2-6h): Las bacterias se dividen rápidamente, duplicando su población constantemente.',
                    'fase-estacionaria': 'Fase Estacionaria (8-12h): La población ha alcanzado su capacidad máxima. El crecimiento se detiene.',
                    'fase-muerte': 'Fase de Muerte (24h+): La población comienza a disminuir debido al agotamiento de recursos.'
                };
                
                if (observationsPanel && sampleData[sampleId]) {
                    observationsPanel.innerHTML = `<p>${sampleData[sampleId]}</p>`;
                }
            }
        });
    });
    
    // Inicializar con la primera muestra
    microscopeImage.src = "images/fase-lag.png";
    console.log("Corrección aplicada para el laboratorio virtual");
});