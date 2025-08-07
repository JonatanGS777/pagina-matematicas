// Indicador de progreso personalizado
const progressSections = document.querySelectorAll('.progress-section');
const introSections = ['introduccion', 'relevancia', 'nivel-educativo', 'objetivos'];
const contentSections = ['contenido', 'integracion', 'metodologia'];
const simulationSections = ['simulacion', 'visualizacion-avanzada'];
const activitiesSections = ['casos-reales', 'laboratorio-virtual', 'quiz'];
const evaluationSections = ['adaptaciones', 'evaluacion', 'reflexion', 'glosario', 'referencias'];

function updateProgressOverview() {
    const scrollPosition = window.scrollY + 100;
    
    // Determinar qué sección principal está activa
    let activeMainSection = null;
    
    allSections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Determinar a qué categoría principal pertenece
            if (introSections.includes(sectionId)) {
                activeMainSection = 'intro';
            } else if (contentSections.includes(sectionId)) {
                activeMainSection = 'content';
            } else if (simulationSections.includes(sectionId)) {
                activeMainSection = 'simulation';
            } else if (activitiesSections.includes(sectionId)) {
                activeMainSection = 'activities';
            } else if (evaluationSections.includes(sectionId)) {
                activeMainSection = 'evaluation';
            }
        }
    });
    
    // Actualizar indicador de progreso
    if (activeMainSection) {
        progressSections.forEach(section => {
            section.classList.remove('active');
            
            if (section.getAttribute('data-section') === activeMainSection) {
                section.classList.add('active');
            }
            
            // Marcar las secciones completadas
            const sectionName = section.getAttribute('data-section');
            const sectionIndex = ['intro', 'content', 'simulation', 'activities', 'evaluation'].indexOf(sectionName);
            const activeIndex = ['intro', 'content', 'simulation', 'activities', 'evaluation'].indexOf(activeMainSection);
            
            if (sectionIndex < activeIndex) {
                section.classList.add('completed');
            } else if (sectionIndex > activeIndex) {
                section.classList.remove('completed');
            }
        });
    }
}

// Actualizar el indicador de progreso al desplazarse
window.addEventListener('scroll', debounce(updateProgressOverview, 100));

// Permitir clic en las secciones de progreso
progressSections.forEach(section => {
    section.addEventListener('click', function() {
        const sectionName = this.getAttribute('data-section');
        let targetSectionId;
        
        switch (sectionName) {
            case 'intro':
                targetSectionId = 'introduccion';
                break;
            case 'content':
                targetSectionId = 'contenido';
                break;
            case 'simulation':
                targetSectionId = 'simulacion';
                break;
            case 'activities':
                targetSectionId = 'casos-reales';
                break;
            case 'evaluation':
                targetSectionId = 'evaluacion';
                break;
            default:
                targetSectionId = 'introduccion';
        }
        
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 20,
                behavior: 'smooth'
            });
        }
    });
});    // Detectar interacción con los controles de la simulación
const simulationControls = document.querySelectorAll('[data-section="simulacion"]');
simulationControls.forEach(control => {
    control.addEventListener('focus', function() {
        // Cuando un usuario interactúa con los controles de simulación,
        // forzar la activación del enlace de simulación
        const simulacionLink = document.querySelector('.nav-links a[href="#simulacion"]');
        if (simulacionLink) {
            navLinks.forEach(link => link.classList.remove('active'));
            simulacionLink.classList.add('active');
        }
    });
    
    // También detectar clics para inputs y sliders
    control.addEventListener('click', function() {
        const simulacionLink = document.querySelector('.nav-links a[href="#simulacion"]');
        if (simulacionLink) {
            navLinks.forEach(link => link.classList.remove('active'));
            simulacionLink.classList.add('active');
        }
    });
});    // Asegurar que la sección de simulación se detecte correctamente
document.addEventListener('DOMContentLoaded', function() {
    // Añadir un ID específico al encabezado de la simulación si no lo tiene
    const simulacionHeader = document.querySelector('#simulacion .section-header');
    if (simulacionHeader) {
        simulacionHeader.id = 'simulacion-header';
    }
    
    // Añadir un observador para la sección de simulación
    const simulacionSection = document.getElementById('simulacion');
    if (simulacionSection) {
        const simulacionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Si la sección de simulación está visible, forzar la activación del enlace correspondiente
                    const simulacionLink = document.querySelector('.nav-links a[href="#simulacion"]');
                    if (simulacionLink) {
                        navLinks.forEach(link => link.classList.remove('active'));
                        simulacionLink.classList.add('active');
                        
                        // Actualizar la posición de la barra lateral
                        const linkTop = simulacionLink.offsetTop;
                        sidebar.scrollTo({
                            top: linkTop - sidebar.clientHeight / 3,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        }, { threshold: 0.3 }); // Detectar cuando al menos el 30% de la sección está visible
        
        simulacionObserver.observe(simulacionSection);
    }
});    // Navegación activa (scroll spy) - Versión mejorada
function updateActiveNavigation() {
    // Obtener todas las secciones
    const sections = Array.from(document.querySelectorAll('.section, .hero'));
    const scrollPosition = window.scrollY;
    
    // Determinar qué sección está actualmente en la vista
    let currentSectionId = null;
    let minDistance = Infinity;
    
    // Utilizamos un enfoque de distancia mínima para mayor precisión
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionMiddle = sectionTop + (sectionHeight / 2);
        const distance = Math.abs(scrollPosition + window.innerHeight/3 - sectionMiddle);
        
        if (distance < minDistance) {
            minDistance = distance;
            currentSectionId = section.getAttribute('id');
        }
    });
    
    // Si encontramos una sección activa, actualizar la navegación
    if (currentSectionId) {
        // Primero, desactivar todos los enlaces
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Luego, activar el enlace correspondiente a la sección actual
        const activeLink = document.querySelector(`.nav-links a[href="#${currentSectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            
            // Asegurar que el enlace activo sea visible en la barra lateral
            const sidebarHeight = sidebar.clientHeight;
            const linkTop = activeLink.offsetTop;
            const linkHeight = activeLink.clientHeight;
            
            // Si el enlace está fuera de la vista visible de la barra lateral
            if (linkTop < sidebar.scrollTop || linkTop + linkHeight > sidebar.scrollTop + sidebarHeight) {
                // Desplazar la barra lateral para mostrar el enlace
                sidebar.scrollTo({
                    top: linkTop - sidebarHeight / 3,
                    behavior: 'smooth'
                });
            }
        }
    }
}

// Actualizar la navegación en diversos eventos
window.addEventListener('scroll', debounce(updateActiveNavigation, 100));
window.addEventListener('resize', updateActiveNavigation);
document.addEventListener('DOMContentLoaded', updateActiveNavigation);

// Función debounce para mejorar el rendimiento
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// Ejecutar después de que la página esté completamente cargada
window.addEventListener('load', function() {
    // Esperar un poco para asegurar que todo se haya renderizado
    setTimeout(updateActiveNavigation, 500);
});    // Elementos para guardar/exportar simulaciones
const saveSimulationBtn = document.getElementById('saveSimulation');
const exportResultsBtn = document.getElementById('exportResults');
const resetSimulationBtn = document.getElementById('resetSimulation');
const savedSimulationsContainer = document.getElementById('savedSimulations');
const savedSimulationsList = document.querySelector('.saved-simulations-list');

// Objeto para almacenar simulaciones
let currentSimulation = null;
let savedSimulations = JSON.parse(localStorage.getItem('bacterialGrowthSimulations')) || [];

// Mostrar simulaciones guardadas
function renderSavedSimulations() {
    if (savedSimulations.length > 0) {
        savedSimulationsContainer.style.display = 'block';
        savedSimulationsList.innerHTML = '';
        
        savedSimulations.forEach((sim, index) => {
            const simItem = document.createElement('div');
            simItem.className = 'saved-simulation-item';
            simItem.innerHTML = `
                <div class="saved-simulation-info">
                    <strong>Simulación ${index + 1}</strong> - P₀: ${sim.initialPopulation}, 
                    r: ${sim.growthRate}, K: ${sim.carryingCapacity}
                </div>
                <div class="saved-simulation-actions">
                    <button class="btn btn-secondary load-sim" data-index="${index}">Cargar</button>
                    <button class="btn btn-secondary delete-sim" data-index="${index}">Eliminar</button>
                </div>
            `;
            savedSimulationsList.appendChild(simItem);
        });
        
        // Añadir event listeners a los botones
        document.querySelectorAll('.load-sim').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                loadSimulation(savedSimulations[index]);
            });
        });
        
        document.querySelectorAll('.delete-sim').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                savedSimulations.splice(index, 1);
                localStorage.setItem('bacterialGrowthSimulations', JSON.stringify(savedSimulations));
                renderSavedSimulations();
            });
        });
    } else {
        savedSimulationsContainer.style.display = 'none';
    }
}

// Cargar una simulación guardada
function loadSimulation(sim) {
    initialPopulationInput.value = sim.initialPopulation;
    initialPopulationSlider.value = sim.initialPopulation;
    growthRateInput.value = sim.growthRate;
    growthRateSlider.value = sim.growthRate;
    carryingCapacityInput.value = sim.carryingCapacity;
    carryingCapacitySlider.value = sim.carryingCapacity;
    
    runSimulationBtn.click();
}

// Guardar simulación
saveSimulationBtn.addEventListener('click', function() {
    if (currentSimulation) {
        savedSimulations.push(currentSimulation);
        localStorage.setItem('bacterialGrowthSimulations', JSON.stringify(savedSimulations));
        renderSavedSimulations();
        
        // Notificar al usuario
        simulationResults.innerHTML += `
            <div class="card" style="background-color: #d4edda; margin-top: 1rem;">
                <p>Simulación guardada exitosamente.</p>
            </div>
        `;
    }
});

// Exportar resultados
exportResultsBtn.addEventListener('click', function() {
    if (currentSimulation) {
        // Crear CSV de los datos
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Tiempo,Población Exponencial,Población Logística\n";
        
        currentSimulation.timePoints.forEach((time, i) => {
            csvContent += `${time},${currentSimulation.exponentialData[i]},${currentSimulation.logisticData[i]}\n`;
        });
        
        // Crear enlace y descargarlo
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "simulacion_crecimiento_bacteriano.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});

// Resetear simulación
resetSimulationBtn.addEventListener('click', function() {
    initialPopulationInput.value = 10;
    initialPopulationSlider.value = 10;
    growthRateInput.value = 0.5;
    growthRateSlider.value = 0.5;
    carryingCapacityInput.value = 500;
    carryingCapacitySlider.value = 500;
    
    // Limpiar resultados
    simulationResults.innerHTML = '';
    saveSimulationBtn.disabled = true;
    exportResultsBtn.disabled = true;
});

// Cargar simulaciones guardadas al inicio
renderSavedSimulations();    // Funcionalidad del glosario
const glossaryItems = document.querySelectorAll('.glossary-item');
const glossarySearch = document.getElementById('glossarySearch');

// Expandir/colapsar términos del glosario
glossaryItems.forEach(item => {
    const term = item.querySelector('.glossary-term');
    
    term.addEventListener('click', () => {
        // Cierra otros items abiertos
        glossaryItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        // Abre/cierra el item actual
        item.classList.toggle('active');
    });
});

// Búsqueda en el glosario
if (glossarySearch) {
    glossarySearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        glossaryItems.forEach(item => {
            const term = item.querySelector('.glossary-term').textContent.toLowerCase();
            const definition = item.querySelector('.glossary-definition').textContent.toLowerCase();
            
            if (term.includes(searchTerm) || definition.includes(searchTerm)) {
                item.style.display = '';
                
                // Si hay una búsqueda, expandir automáticamente los resultados
                if (searchTerm.length > 2) {
                    item.classList.add('active');
                } else if (searchTerm.length === 0) {
                    item.classList.remove('active');
                }
            } else {
                item.style.display = 'none';
            }
        });
    });
}// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
// Elementos del DOM
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');
const progressBar = document.getElementById('progressBar');
const mobileNavToggle = document.getElementById('mobileNavToggle');
const sidebar = document.getElementById('sidebar');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const backToTopBtn = document.getElementById('backToTop');

// Controles de la simulación - CAMBIO: Convertidas a variables globales
var initialPopulationInput = document.getElementById('initial-population');
var initialPopulationSlider = document.getElementById('initial-population-slider');
var growthRateInput = document.getElementById('growth-rate');
var growthRateSlider = document.getElementById('growth-rate-slider');
var carryingCapacityInput = document.getElementById('carrying-capacity');
var carryingCapacitySlider = document.getElementById('carrying-capacity-slider');
var runSimulationBtn = document.getElementById('runSimulation');
var simulationResults = document.getElementById('simulationResults');

// Barra de progreso y botón volver arriba
window.addEventListener('scroll', function() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = scrollPercentage + '%';
    
    // Mostrar/ocultar botón volver arriba
    if (scrollTop > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

// Función volver arriba
backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Evento para cuando se haga clic directamente en los enlaces
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Desactivar todos los enlaces primero
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Activar este enlace
        this.classList.add('active');
        
        // Obtener el destino
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        // Hacer scroll hasta la sección
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 20,
                behavior: 'smooth'
            });
        }
        
        // Cerrar el menú en móvil
        if (window.innerWidth < 992) {
            sidebar.classList.remove('show');
        }
    });
});

// Menú móvil
mobileNavToggle.addEventListener('click', function() {
    sidebar.classList.toggle('show');
});

// Tabs
tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        tabs.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        this.classList.add('active');
        document.querySelector(`.tab-content[data-tab="${tabId}"]`).classList.add('active');
    });
});

// Sincronizar inputs y sliders
initialPopulationSlider.addEventListener('input', function() {
    initialPopulationInput.value = this.value;
});

initialPopulationInput.addEventListener('input', function() {
    initialPopulationSlider.value = this.value;
});

growthRateSlider.addEventListener('input', function() {
    growthRateInput.value = this.value;
});

growthRateInput.addEventListener('input', function() {
    growthRateSlider.value = this.value;
});

carryingCapacitySlider.addEventListener('input', function() {
    carryingCapacityInput.value = this.value;
});

carryingCapacityInput.addEventListener('input', function() {
    carryingCapacitySlider.value = this.value;
});

// Animación de aparición al hacer scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    observer.observe(section);
});

// Configuración inicial de gráficas
const exponentialChartCtx = document.getElementById('exponentialChart').getContext('2d');
const logisticChartCtx = document.getElementById('logisticChart').getContext('2d');
const comparisonChartCtx = document.getElementById('comparisonChart').getContext('2d');

// Creación de gráficas
const exponentialChart = new Chart(exponentialChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Crecimiento Exponencial',
            data: [],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderWidth: 2,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Población'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Tiempo (horas)'
                }
            }
        }
    }
});

const logisticChart = new Chart(logisticChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Crecimiento Logístico',
            data: [],
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 2,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Población'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Tiempo (horas)'
                }
            }
        }
    }
});

const comparisonChart = new Chart(comparisonChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Crecimiento Exponencial',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'Crecimiento Logístico',
                data: [],
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 2,
                fill: false
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Población'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Tiempo (horas)'
                }
            }
        }
    }
});

// Función para calcular el crecimiento exponencial
function exponentialGrowth(initialPopulation, growthRate, time) {
    return initialPopulation * Math.exp(growthRate * time);
}

// Función para calcular el crecimiento logístico - CAMBIO: Función hecha global
window.logisticGrowth = function(initialPopulation, growthRate, carryingCapacity, time) {
    return carryingCapacity / (1 + ((carryingCapacity - initialPopulation) / initialPopulation) * Math.exp(-growthRate * time));
}

// Ejecutar simulación
runSimulationBtn.addEventListener('click', function() {
    const initialPopulation = parseFloat(initialPopulationInput.value);
    const growthRate = parseFloat(growthRateInput.value);
    const carryingCapacity = parseFloat(carryingCapacityInput.value);
    
    // Validar parámetros
    if (isNaN(initialPopulation) || isNaN(growthRate) || isNaN(carryingCapacity)) {
        simulationResults.innerHTML = '<div class="card" style="background-color: #ffe5e5;"><p>Por favor, ingrese valores numéricos válidos para todos los parámetros.</p></div>';
        return;
    }
    
    // Generar datos para las gráficas
    const timePoints = 100;
    const maxTime = 20;
    const timeStep = maxTime / timePoints;
    
    const timeLabels = [];
    const exponentialData = [];
    const logisticData = [];
    
    for (let i = 0; i <= timePoints; i++) {
        const time = i * timeStep;
        timeLabels.push(time.toFixed(1));
        
        const expValue = exponentialGrowth(initialPopulation, growthRate, time);
        const logValue = logisticGrowth(initialPopulation, growthRate, carryingCapacity, time);
        
        exponentialData.push(expValue);
        logisticData.push(logValue);
    }
    
    // Guardar simulación actual
    currentSimulation = {
        initialPopulation,
        growthRate,
        carryingCapacity,
        timePoints: timeLabels,
        exponentialData,
        logisticData,
        date: new Date().toLocaleString()
    };
    
    // Habilitar botones de guardar y exportar
    saveSimulationBtn.disabled = false;
    exportResultsBtn.disabled = false;
    
    // Actualizar gráficas
    exponentialChart.data.labels = timeLabels;
    exponentialChart.data.datasets[0].data = exponentialData;
    exponentialChart.update();
    
    logisticChart.data.labels = timeLabels;
    logisticChart.data.datasets[0].data = logisticData;
    logisticChart.update();
    
    comparisonChart.data.labels = timeLabels;
    comparisonChart.data.datasets[0].data = exponentialData;
    comparisonChart.data.datasets[1].data = logisticData;
    comparisonChart.update();
    
    // Mostrar resultados
    const halfTime = Math.log(2) / growthRate;
    const timeToCapacity = Math.log((carryingCapacity - initialPopulation) / initialPopulation) / growthRate;
    
    simulationResults.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom: 1rem;">Análisis de Resultados</h3>
            <div class="grid">
                <div>
                    <p><strong>Tiempo de duplicación:</strong> ${halfTime.toFixed(2)} horas</p>
                    <p><strong>Tiempo para alcanzar la mitad de K:</strong> ${(timeToCapacity / 2).toFixed(2)} horas</p>
                </div>
                <div>
                    <p><strong>Población máxima (modelo exponencial):</strong> ${exponentialData[exponentialData.length - 1].toFixed(2)} bacterias</p>
                    <p><strong>Población máxima (modelo logístico):</strong> ${logisticData[logisticData.length - 1].toFixed(2)} bacterias</p>
                </div>
            </div>
            <p style="margin-top: 1rem;"><strong>Observaciones:</strong> En el modelo exponencial, la población crece sin límites, mientras que en el modelo logístico la población se acerca asintóticamente a la capacidad de carga (K = ${carryingCapacity}).</p>
        </div>
    `;
});

// Ejecutar simulación inicial
runSimulationBtn.click();
});