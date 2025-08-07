// Script específico para solucionar los casos reales
document.addEventListener('DOMContentLoaded', function() {
    console.log("Inicializando corrección para casos de estudio");
    
    // Botones de casos de estudio
    const caseStudyButtons = document.querySelectorAll('.case-study-btn');
    
    if (caseStudyButtons.length > 0) {
        console.log("Encontrados botones de casos de estudio:", caseStudyButtons.length);
        
        // Eliminar eventListeners anteriores para evitar duplicados
        caseStudyButtons.forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
        });
        
        // Volver a seleccionar los botones después de clonarlos
        const newCaseStudyButtons = document.querySelectorAll('.case-study-btn');
        
        newCaseStudyButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                // Detener propagación para evitar conflictos
                event.preventDefault();
                event.stopPropagation();
                
                // Obtener los parámetros del caso de estudio
                const p0 = this.getAttribute('data-p0');
                const r = this.getAttribute('data-r');
                const k = this.getAttribute('data-k');
                
                console.log("Caso de estudio seleccionado:", p0, r, k);
                
                // Acceder a los controles directamente
                const initialPopulationInput = document.getElementById('initial-population');
                const initialPopulationSlider = document.getElementById('initial-population-slider');
                const growthRateInput = document.getElementById('growth-rate');
                const growthRateSlider = document.getElementById('growth-rate-slider');
                const carryingCapacityInput = document.getElementById('carrying-capacity');
                const carryingCapacitySlider = document.getElementById('carrying-capacity-slider');
                const runSimulationBtn = document.getElementById('runSimulation');
                
                if (initialPopulationInput && growthRateInput && carryingCapacityInput && runSimulationBtn) {
                    console.log("Estableciendo valores para la simulación");
                    
                    // Establecer valores
                    initialPopulationInput.value = p0;
                    initialPopulationSlider.value = p0;
                    growthRateInput.value = r;
                    growthRateSlider.value = r;
                    carryingCapacityInput.value = k;
                    carryingCapacitySlider.value = k;
                    
                    // Desplazarse a la sección de simulación
                    const simulacionSection = document.getElementById('simulacion');
                    if (simulacionSection) {
                        window.scrollTo({
                            top: simulacionSection.offsetTop - 20,
                            behavior: 'smooth'
                        });
                        
                        // Ejecutar la simulación después de un retraso
                        setTimeout(() => {
                            console.log("Ejecutando simulación");
                            // Disparar evento de cambio en los inputs para asegurar que los valores se actualizan
                            const changeEvent = new Event('change', { bubbles: true });
                            initialPopulationInput.dispatchEvent(changeEvent);
                            growthRateInput.dispatchEvent(changeEvent);
                            carryingCapacityInput.dispatchEvent(changeEvent);
                            
                            // Ejecutar simulación
                            runSimulationBtn.click();
                        }, 1000);
                    } else {
                        console.error("No se encontró la sección de simulación");
                    }
                } else {
                    console.error("No se pudieron encontrar todos los elementos de control necesarios");
                }
            });
        });
    } else {
        console.warn("No se encontraron botones de casos de estudio");
    }
});