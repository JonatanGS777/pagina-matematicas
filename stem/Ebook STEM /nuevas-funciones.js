// Función de crecimiento logístico añadida explícitamente
function logisticGrowth(initialPopulation, growthRate, carryingCapacity, time) {
    return carryingCapacity / (1 + ((carryingCapacity - initialPopulation) / initialPopulation) * Math.exp(-growthRate * time));
}

// ==========================================
// Casos de Estudio
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Botones de casos de estudio
    const caseStudyButtons = document.querySelectorAll('.case-study-btn');
    
    if (caseStudyButtons.length > 0) {
        caseStudyButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Obtener los parámetros del caso de estudio
                const p0 = this.getAttribute('data-p0');
                const r = this.getAttribute('data-r');
                const k = this.getAttribute('data-k');
                
                // Establecer los valores en los controles de simulación
                if (initialPopulationInput && growthRateInput && carryingCapacityInput) {
                    initialPopulationInput.value = p0;
                    initialPopulationSlider.value = p0;
                    growthRateInput.value = r;
                    growthRateSlider.value = r;
                    carryingCapacityInput.value = k;
                    carryingCapacitySlider.value = k;
                    
                    // Desplazarse a la sección de simulación
                    const simulacionSection = document.getElementById('simulacion');
                    window.scrollTo({
                        top: simulacionSection.offsetTop - 20,
                        behavior: 'smooth'
                    });
                    
                    // Ejecutar la simulación después de un breve retraso
                    setTimeout(() => {
                        runSimulationBtn.click();
                    }, 1000);
                }
            });
        });
    }
});

// ==========================================
// Quiz Interactivo
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const startQuizBtn = document.getElementById('startQuiz');
    const quizIntro = document.querySelector('.quiz-intro');
    const quizContainer = document.querySelector('.quiz-container');
    const quizQuestions = document.querySelector('.quiz-questions');
    const quizResults = document.querySelector('.quiz-results');
    const submitAnswerBtn = document.getElementById('submitAnswer');
    const nextQuestionBtn = document.getElementById('nextQuestion');
    const restartQuizBtn = document.getElementById('restartQuiz');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    const totalQuestionsSpan = document.getElementById('totalQuestions');
    const totalQuestionsResultSpan = document.getElementById('totalQuestionsResult');
    const correctAnswersSpan = document.getElementById('correctAnswers');
    const scorePercentageSpan = document.getElementById('scorePercentage');
    const quizFeedback = document.getElementById('quizFeedback');
    const progressBar = document.querySelector('.quiz-progress-bar');
    
    if (!startQuizBtn) return; // Salir si no existe el componente de quiz
    
    // Preguntas del quiz
    const questions = [
        {
            question: "¿Qué representa la capacidad de carga (K) en el modelo logístico?",
            options: [
                "La tasa de crecimiento máxima de la población",
                "El número máximo de individuos que el ambiente puede sostener",
                "La población inicial al tiempo t=0",
                "El tiempo que tarda la población en duplicarse"
            ],
            correctAnswer: 1,
            feedback: "La capacidad de carga (K) representa el número máximo de individuos que el ambiente puede sostener de manera indefinida, debido a limitaciones de recursos como nutrientes, espacio o energía."
        },
        {
            question: "En el modelo logístico, ¿qué sucede cuando la población (P) se acerca a la capacidad de carga (K)?",
            options: [
                "La tasa de crecimiento aumenta exponencialmente",
                "La población comienza a decrecer",
                "La tasa de crecimiento se aproxima a cero",
                "La población se mantiene constante independientemente del tiempo"
            ],
            correctAnswer: 2,
            feedback: "Cuando la población se acerca a la capacidad de carga, la tasa de crecimiento disminuye progresivamente y se aproxima a cero. Esto ocurre porque los recursos disponibles se vuelven limitantes y la competencia entre individuos aumenta."
        },
        {
            question: "¿Cuál es la diferencia fundamental entre el crecimiento exponencial y el crecimiento logístico?",
            options: [
                "El crecimiento exponencial es más rápido que el logístico",
                "El crecimiento logístico considera la capacidad de carga del ambiente",
                "El crecimiento exponencial solo ocurre en bacterias",
                "El crecimiento logístico solo ocurre en ambientes artificiales"
            ],
            correctAnswer: 1,
            feedback: "La diferencia fundamental es que el modelo logístico incorpora la capacidad de carga del ambiente, mientras que el modelo exponencial asume recursos ilimitados. En la naturaleza, casi todos los crecimientos poblacionales eventualmente se comportan de manera logística."
        },
        {
            question: "Si tienes una población bacteriana con tasa de crecimiento r = 0.5 h⁻¹, ¿cuánto tiempo aproximadamente tardaría la población en duplicarse?",
            options: [
                "0.5 horas",
                "1 hora",
                "1.4 horas",
                "2 horas"
            ],
            correctAnswer: 2,
            feedback: "El tiempo de duplicación se calcula con la fórmula: t = ln(2)/r. Siendo r = 0.5, entonces t = ln(2)/0.5 ≈ 1.386 horas, es decir, aproximadamente 1.4 horas."
        },
        {
            question: "¿Qué factor NO afecta la capacidad de carga (K) de un cultivo bacteriano?",
            options: [
                "La cantidad de nutrientes disponibles",
                "El pH del medio",
                "La tasa de crecimiento intrínseca (r)",
                "La acumulación de desechos metabólicos"
            ],
            correctAnswer: 2,
            feedback: "La tasa de crecimiento intrínseca (r) es una característica propia de la especie bacteriana y no afecta directamente la capacidad de carga. La capacidad de carga está determinada por factores ambientales como nutrientes, espacio, temperatura, pH y la acumulación de productos de desecho."
        }
    ];
    
    let currentQuestion = 0;
    let correctAnswers = 0;
    let selectedOption = null;
    
    // Iniciar quiz
    startQuizBtn.addEventListener('click', function() {
        quizIntro.style.display = 'none';
        quizContainer.style.display = 'block';
        
        // Actualizar contadores
        totalQuestionsSpan.textContent = questions.length;
        totalQuestionsResultSpan.textContent = questions.length;
        
        // Mostrar primera pregunta
        showQuestion(0);
    });
    
    // Mostrar pregunta
    function showQuestion(index) {
        currentQuestionSpan.textContent = index + 1;
        progressBar.style.setProperty('--progress', `${((index + 1) / questions.length) * 100}%`);
        
        // Crear elemento de pregunta
        const questionData = questions[index];
        const questionElement = document.createElement('div');
        questionElement.className = 'quiz-question';
        questionElement.innerHTML = `
            <h3>${index + 1}. ${questionData.question}</h3>
            <div class="quiz-options">
                ${questionData.options.map((option, i) => `
                    <div class="quiz-option" data-index="${i}">
                        <label>
                            <input type="radio" name="question${index}" value="${i}" style="display: none;">
                            ${option}
                        </label>
                    </div>
                `).join('')}
            </div>
            <div class="quiz-feedback"></div>
        `;
        
        // Limpiar preguntas anteriores
        quizQuestions.innerHTML = '';
        quizQuestions.appendChild(questionElement);
        
        // Añadir eventos a las opciones
        const optionElements = questionElement.querySelectorAll('.quiz-option');
        optionElements.forEach(option => {
            option.addEventListener('click', function() {
                // Deseleccionar todas las opciones
                optionElements.forEach(opt => opt.classList.remove('selected'));
                
                // Seleccionar la opción actual
                this.classList.add('selected');
                selectedOption = parseInt(this.getAttribute('data-index'));
                
                // Activar el botón de verificar
                submitAnswerBtn.disabled = false;
            });
        });
        
        // Resetear estado
        selectedOption = null;
        submitAnswerBtn.disabled = true;
        submitAnswerBtn.style.display = 'block';
        nextQuestionBtn.style.display = 'none';
    }
    
    // Verificar respuesta
    submitAnswerBtn.addEventListener('click', function() {
        if (selectedOption === null) return;
        
        const questionData = questions[currentQuestion];
        const optionElements = quizQuestions.querySelectorAll('.quiz-option');
        const feedbackElement = quizQuestions.querySelector('.quiz-feedback');
        
        // Marcar respuesta correcta/incorrecta
        optionElements.forEach((option, index) => {
            if (index === questionData.correctAnswer) {
                option.classList.add('correct');
            } else if (index === selectedOption) {
                option.classList.add('incorrect');
            }
            
            // Desactivar opciones
            option.style.pointerEvents = 'none';
        });
        
        // Mostrar feedback
        feedbackElement.textContent = questionData.feedback;
        feedbackElement.style.display = 'block';
        feedbackElement.className = 'quiz-feedback ' + (selectedOption === questionData.correctAnswer ? 'correct' : 'incorrect');
        
        // Actualizar contador de respuestas correctas
        if (selectedOption === questionData.correctAnswer) {
            correctAnswers++;
        }
        
        // Cambiar botones
        submitAnswerBtn.style.display = 'none';
        
        if (currentQuestion < questions.length - 1) {
            nextQuestionBtn.style.display = 'block';
        } else {
            // Mostrar resultados finales
            showResults();
        }
    });
    
    // Siguiente pregunta
    nextQuestionBtn.addEventListener('click', function() {
        currentQuestion++;
        showQuestion(currentQuestion);
    });
    
    // Mostrar resultados
    function showResults() {
        quizContainer.style.display = 'none';
        quizResults.style.display = 'block';
        
        // Actualizar contadores
        correctAnswersSpan.textContent = correctAnswers;
        const percentage = Math.round((correctAnswers / questions.length) * 100);
        scorePercentageSpan.textContent = `${percentage}%`;
        
        // Personalizar feedback según puntuación
        let feedbackMessage = '';
        if (percentage >= 80) {
            feedbackMessage = '¡Excelente! Tienes un gran dominio del tema. Estás listo para aplicar estos conceptos en situaciones reales.';
        } else if (percentage >= 60) {
            feedbackMessage = 'Buen trabajo. Comprendes los conceptos principales, pero podría ser útil repasar algunos detalles.';
        } else {
            feedbackMessage = 'Sigue practicando. Te recomendamos revisar nuevamente el material sobre modelos de crecimiento poblacional.';
        }
        
        quizFeedback.textContent = feedbackMessage;
    }
    
    // Reiniciar quiz
    restartQuizBtn.addEventListener('click', function() {
        currentQuestion = 0;
        correctAnswers = 0;
        quizResults.style.display = 'none';
        showQuestion(0);
        quizContainer.style.display = 'block';
    });
});

// ==========================================
// Visualización Avanzada
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Pestañas de modelos
    const modelTabs = document.querySelectorAll('.model-tab');
    const modelSettings = document.querySelectorAll('.model-settings-container');
    
    if (modelTabs.length === 0) return; // Salir si no existe la visualización avanzada
    
    // Inicializar configuraciones para Modelo 2 y 3
    if (document.getElementById('model-settings-2')) {
        document.getElementById('model-settings-2').innerHTML = `
            <h3>Configuración Modelo 2</h3>
            <div class="model-param-group">
                <label>Población Inicial (P₀):</label>
                <input type="number" class="model-p0" value="20" min="1" max="100">
                <input type="range" class="model-p0-slider" value="20" min="1" max="100">
            </div>
            <div class="model-param-group">
                <label>Tasa de Crecimiento (r):</label>
                <input type="number" class="model-r" value="0.3" min="0.1" max="2" step="0.1">
                <input type="range" class="model-r-slider" value="0.3" min="0.1" max="2" step="0.1">
            </div>
            <div class="model-param-group">
                <label>Capacidad de Carga (K):</label>
                <input type="number" class="model-k" value="400" min="100" max="1000" step="10">
                <input type="range" class="model-k-slider" value="400" min="100" max="1000" step="10">
            </div>
            <div class="model-color-picker">
                <label>Color del modelo:</label>
                <div class="color-options">
                    <div class="color-option" style="background-color: #FF6384;" data-color="#FF6384"></div>
                    <div class="color-option active" style="background-color: #36A2EB;" data-color="#36A2EB"></div>
                    <div class="color-option" style="background-color: #FFCE56;" data-color="#FFCE56"></div>
                    <div class="color-option" style="background-color: #4BC0C0;" data-color="#4BC0C0"></div>
                </div>
            </div>
            <div class="model-active-toggle">
                <label>Activar modelo:</label>
                <div class="toggle-switch">
                    <input type="checkbox" id="model2-active" checked>
                    <label for="model2-active"></label>
                </div>
            </div>
        `;
    }

    if (document.getElementById('model-settings-3')) {
        document.getElementById('model-settings-3').innerHTML = `
            <h3>Configuración Modelo 3</h3>
            <div class="model-param-group">
                <label>Población Inicial (P₀):</label>
                <input type="number" class="model-p0" value="30" min="1" max="100">
                <input type="range" class="model-p0-slider" value="30" min="1" max="100">
            </div>
            <div class="model-param-group">
                <label>Tasa de Crecimiento (r):</label>
                <input type="number" class="model-r" value="0.7" min="0.1" max="2" step="0.1">
                <input type="range" class="model-r-slider" value="0.7" min="0.1" max="2" step="0.1">
            </div>
            <div class="model-param-group">
                <label>Capacidad de Carga (K):</label>
                <input type="number" class="model-k" value="600" min="100" max="1000" step="10">
                <input type="range" class="model-k-slider" value="600" min="100" max="1000" step="10">
            </div>
            <div class="model-color-picker">
                <label>Color del modelo:</label>
                <div class="color-options">
                    <div class="color-option" style="background-color: #FF6384;" data-color="#FF6384"></div>
                    <div class="color-option" style="background-color: #36A2EB;" data-color="#36A2EB"></div>
                    <div class="color-option active" style="background-color: #FFCE56;" data-color="#FFCE56"></div>
                    <div class="color-option" style="background-color: #4BC0C0;" data-color="#4BC0C0"></div>
                </div>
            </div>
            <div class="model-active-toggle">
                <label>Activar modelo:</label>
                <div class="toggle-switch">
                    <input type="checkbox" id="model3-active" checked>
                    <label for="model3-active"></label>
                </div>
            </div>
        `;
    }
    
    // Cambiar entre pestañas de modelos
    modelTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const modelIndex = this.getAttribute('data-model');
            
            // Actualizar pestañas activas
            modelTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar configuración correspondiente
            modelSettings.forEach(setting => {
                setting.classList.remove('active');
            });
            document.getElementById(`model-settings-${modelIndex}`).classList.add('active');
        });
    });
    
    // Inicializar gráfico avanzado
    const advancedChartCtx = document.getElementById('advancedComparisonChart');
    if (!advancedChartCtx) return;
    
    const advancedChart = new Chart(advancedChartCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
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
    
    // Ejecutar visualización avanzada
    const runAdvancedVisualizationBtn = document.getElementById('runAdvancedVisualization');
    if (!runAdvancedVisualizationBtn) return;
    
    runAdvancedVisualizationBtn.addEventListener('click', function() {
        // Generar datos para las gráficas avanzadas
        const timePoints = 100;
        const maxTime = 20;
        const timeStep = maxTime / timePoints;
        
        const timeLabels = [];
        for (let i = 0; i <= timePoints; i++) {
            const time = i * timeStep;
            timeLabels.push(time.toFixed(1));
        }
        
        // Actualizar etiquetas de tiempo
        advancedChart.data.labels = timeLabels;
        
        // Limpiar datasets anteriores
        advancedChart.data.datasets = [];
        
        // Recopilar datos de cada modelo activo
        for (let modelIndex = 1; modelIndex <= 3; modelIndex++) {
            const modelActive = document.getElementById(`model${modelIndex}-active`);
            if (!modelActive || !modelActive.checked) continue;
            
            // Obtener parámetros del modelo
            const modelSettings = document.getElementById(`model-settings-${modelIndex}`);
            const p0 = parseFloat(modelSettings.querySelector('.model-p0').value);
            const r = parseFloat(modelSettings.querySelector('.model-r').value);
            const k = parseFloat(modelSettings.querySelector('.model-k').value);
            const colorOption = modelSettings.querySelector('.color-option.active');
            const color = colorOption ? colorOption.getAttribute('data-color') : '#FF6384';
            
            // Validar parámetros
            if (isNaN(p0) || isNaN(r) || isNaN(k)) continue;
            
            // Generar datos del modelo
            const modelData = [];
            for (let i = 0; i <= timePoints; i++) {
                const time = i * timeStep;
                const value = logisticGrowth(p0, r, k, time);
                modelData.push(value);
            }
            
            // Añadir dataset al gráfico
            advancedChart.data.datasets.push({
                label: `Modelo ${modelIndex} (P₀=${p0}, r=${r}, K=${k})`,
                data: modelData,
                borderColor: color,
                backgroundColor: color + '20',
                borderWidth: 2,
                fill: false
            });
        }
        
        // Actualizar gráfico
        advancedChart.update();
        
        // Mostrar análisis comparativo
        const resultsContainer = document.getElementById('advancedVisualizationResults');
        if (resultsContainer && advancedChart.data.datasets.length > 0) {
            let comparisonResults = `
                <div class="card">
                    <h3>Análisis Comparativo</h3>
                    <p>Se han comparado ${advancedChart.data.datasets.length} modelos de crecimiento:</p>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Modelo</th>
                                <th>Población Inicial (P₀)</th>
                                <th>Tasa de Crecimiento (r)</th>
                                <th>Capacidad de Carga (K)</th>
                                <th>Tiempo de Duplicación</th>
                                <th>Tiempo para Alcanzar 0.5K</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            advancedChart.data.datasets.forEach((dataset, index) => {
                // Extraer parámetros del modelo del label
                const modelMatch = dataset.label.match(/Modelo \d+ \(P₀=(\d+(\.\d+)?), r=(\d+(\.\d+)?), K=(\d+(\.\d+)?)\)/);
                if (!modelMatch) return;
                
                const p0 = parseFloat(modelMatch[1]);
                const r = parseFloat(modelMatch[3]);
                const k = parseFloat(modelMatch[5]);
                
                // Calcular métricas
                const doubleTime = Math.log(2) / r;
                const timeToHalfK = Math.log((k - p0) / p0) / r;
                
                comparisonResults += `
                    <tr>
                        <td>Modelo ${index + 1}</td>
                        <td>${p0}</td>
                        <td>${r}</td>
                        <td>${k}</td>
                        <td>${doubleTime.toFixed(2)} h</td>
                        <td>${(timeToHalfK / 2).toFixed(2)} h</td>
                    </tr>
                `;
            });
            
            comparisonResults += `
                        </tbody>
                    </table>
                    <div style="margin-top: 1rem;">
                        <p><strong>Observaciones:</strong></p>
                        <ul>
            `;
            
            // Añadir observaciones basadas en los modelos
            if (advancedChart.data.datasets.length > 1) {
                comparisonResults += `
                    <li>Los modelos con mayor tasa de crecimiento (r) alcanzan su fase exponencial más rápidamente.</li>
                    <li>La capacidad de carga (K) determina el nivel máximo que alcanzará la población.</li>
                    <li>La población inicial (P₀) influye principalmente en las etapas tempranas del crecimiento.</li>
                `;
            } else {
                comparisonResults += `
                    <li>Añade más modelos para realizar comparaciones entre diferentes parámetros.</li>
                `;
            }
            
            comparisonResults += `
                        </ul>
                    </div>
                </div>
            `;
            
            resultsContainer.innerHTML = comparisonResults;
        }
    });
    
    // Eventos para los selectores de color
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Encontrar el grupo de colores padre
            const colorGroup = this.closest('.color-options');
            
            // Desactivar todas las opciones en este grupo
            colorGroup.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('active');
            });
            
            // Activar esta opción
            this.classList.add('active');
        });
    });
    
    // Sincronizar inputs numéricos y sliders para los modelos
    const modelP0Inputs = document.querySelectorAll('.model-p0');
    const modelP0Sliders = document.querySelectorAll('.model-p0-slider');
    const modelRInputs = document.querySelectorAll('.model-r');
    const modelRSliders = document.querySelectorAll('.model-r-slider');
    const modelKInputs = document.querySelectorAll('.model-k');
    const modelKSliders = document.querySelectorAll('.model-k-slider');
    
    // Sincronizar P0
    modelP0Inputs.forEach((input, index) => {
        if (index < modelP0Sliders.length) {
            const slider = modelP0Sliders[index];
            
            input.addEventListener('input', function() {
                slider.value = this.value;
            });
            
            slider.addEventListener('input', function() {
                input.value = this.value;
            });
        }
    });
    
    // Sincronizar r
    modelRInputs.forEach((input, index) => {
        if (index < modelRSliders.length) {
            const slider = modelRSliders[index];
            
            input.addEventListener('input', function() {
                slider.value = this.value;
            });
            
            slider.addEventListener('input', function() {
                input.value = this.value;
            });
        }
    });
    
    // Sincronizar K
    modelKInputs.forEach((input, index) => {
        if (index < modelKSliders.length) {
            const slider = modelKSliders[index];
            
            input.addEventListener('input', function() {
                slider.value = this.value;
            });
            
            slider.addEventListener('input', function() {
                input.value = this.value;
            });
        }
    });
});

// ==========================================
// Laboratorio Virtual de Microscopía
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del microscopio
    const microscopeImage = document.getElementById('microscopeImage');
    const zoomSlider = document.getElementById('zoomSlider');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const brightnessSlider = document.getElementById('brightnessSlider');
    const brightenBtn = document.getElementById('brighten');
    const darkenBtn = document.getElementById('darken');
    const sampleOptions = document.querySelectorAll('.sample-option');
    const labTabs = document.querySelectorAll('.lab-tab');
    const labPanels = document.querySelectorAll('.lab-data-panel');
    
    if (!microscopeImage) return; // Salir si no existe el laboratorio virtual
    
    // Datos de muestras
    const sampleData = {
        'fase-lag': {
            title: 'Fase de Latencia',
            observations: `
                <p>En esta fase, las bacterias están adaptándose al nuevo ambiente. No hay un aumento significativo en el número de células, pero están ocurriendo importantes cambios metabólicos:</p>
                <ul>
                    <li>Síntesis de enzimas y ribosomas necesarios para el crecimiento</li>
                    <li>Adaptación al medio de cultivo</li>
                    <li>Las células son de tamaño uniforme y aparecen dispersas</li>
                    <li>Baja actividad metabólica visible</li>
                </ul>
            `,
            analysis: `
                <p>Datos cuantitativos:</p>
                <ul>
                    <li>Densidad celular: 1.2 × 10⁶ células/ml</li>
                    <li>Tasa de crecimiento: cercana a 0</li>
                    <li>Tiempo transcurrido: 0-2 horas</li>
                </ul>
                <div style="margin-top: 1rem;">
                    <p>Mediciones de actividad enzimática:</p>
                    <div style="height: 150px; background-color: #f8f9fa; border-radius: 5px; padding: 10px;">
                        <canvas id="enzymeActivityChart"></canvas>
                    </div>
                </div>
            `,
            modelParams: {
                p0: 10,
                r: 0.1,
                k: 500,
                currentPhase: 'lag'
            }
        },
        'fase-exponencial': {
            title: 'Fase Exponencial',
            observations: `
                <p>Las bacterias se están dividiendo a su máxima velocidad. Características principales:</p>
                <ul>
                    <li>División celular rápida y sincronizada</li>
                    <li>Las células son de tamaño uniforme y más pequeñas que en la fase de latencia</li>
                    <li>Formación de microcolonias visibles</li>
                    <li>Alta actividad metabólica</li>
                    <li>Movimiento bacteriano activo (en especies móviles)</li>
                </ul>
            `,
            analysis: `
                <p>Datos cuantitativos:</p>
                <ul>
                    <li>Densidad celular: 5.7 × 10⁷ células/ml</li>
                    <li>Tasa de crecimiento (r): 0.52 h⁻¹</li>
                    <li>Tiempo de duplicación: 1.33 horas</li>
                    <li>Tiempo transcurrido: 2-6 horas</li>
                </ul>
                <div style="margin-top: 1rem;">
                    <p>Curva de crecimiento:</p>
                    <div style="height: 150px; background-color: #f8f9fa; border-radius: 5px; padding: 10px;">
                        <canvas id="exponentialPhaseChart"></canvas>
                    </div>
                </div>
            `,
            modelParams: {
                p0: 10,
                r: 0.52,
                k: 500,
                currentPhase: 'exponential'
            }
        },
        'fase-estacionaria': {
            title: 'Fase Estacionaria',
            observations: `
                <p>La población ha alcanzado su capacidad de carga. Características observables:</p>
                <ul>
                    <li>Equilibrio entre células que se dividen y células que mueren</li>
                    <li>Alta densidad celular con colonias bien definidas</li>
                    <li>Variación en el tamaño celular (algunas células más pequeñas)</li>
                    <li>Cambios morfológicos como respuesta al estrés</li>
                    <li>Formación de biofilms y estructuras de resistencia</li>
                </ul>
            `,
            analysis: `
                <p>Datos cuantitativos:</p>
                <ul>
                    <li>Densidad celular: 4.9 × 10⁸ células/ml</li>
                    <li>Tasa de crecimiento neta: aproximadamente 0</li>
                    <li>Producción de metabolitos secundarios: alta</li>
                    <li>Tiempo transcurrido: 8-12 horas</li>
                </ul>
                <div style="margin-top: 1rem;">
                    <p>Análisis de metabolitos:</p>
                    <div style="height: 150px; background-color: #f8f9fa; border-radius: 5px; padding: 10px;">
                        <canvas id="metabolitesChart"></canvas>
                    </div>
                </div>
            `,
            modelParams: {
                p0: 10,
                r: 0.52,
                k: 500,
                currentPhase: 'stationary'
            }
        },
        'fase-muerte': {
            title: 'Fase de Muerte',
            observations: `
                <p>La población bacteriana comienza a disminuir. Características observables:</p>
                <ul>
                    <li>Alta proporción de células muertas o dañadas</li>
                    <li>Fragmentación celular y restos celulares visibles</li>
                    <li>Heterogeneidad morfológica (células de diferentes tamaños y formas)</li>
                    <li>Formación de esporas en especies capaces</li>
                    <li>Disminución de la densidad óptica del cultivo</li>
                </ul>
            `,
            analysis: `
                <p>Datos cuantitativos:</p>
                <ul>
                    <li>Densidad celular viable: 1.2 × 10⁸ células/ml</li>
                    <li>Tasa de muerte: 0.15 h⁻¹</li>
                    <li>Proporción células viables/no viables: 1:3</li>
                    <li>Tiempo transcurrido: 24+ horas</li>
                </ul>
                <div style="margin-top: 1rem;">
                    <p>Análisis de viabilidad celular:</p>
                    <div style="height: 150px; background-color: #f8f9fa; border-radius: 5px; padding: 10px;">
                        <canvas id="viabilityChart"></canvas>
                    </div>
                </div>
            `,
            modelParams: {
                p0: 10,
                r: 0.52,
                k: 500,
                currentPhase: 'death'
            }
        }
    };
    
    // Inicializar microscopio
    let currentSample = 'fase-lag';
    let currentZoom = 1;
    let currentBrightness = 1;
    
    // Cambiar muestra
    function changeSample(sampleId) {
        // Actualizar imagen
        microscopeImage.src = `${sampleId}.png`;
        currentSample = sampleId;
        
        // Actualizar información
        updateSampleInfo(sampleId);
        
        // Actualizar opciones activas
        sampleOptions.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-sample') === sampleId) {
                option.classList.add('active');
            }
        });
    }
    
    // Actualizar información de la muestra
    function updateSampleInfo(sampleId) {
        const sampleInfo = sampleData[sampleId];
        if (!sampleInfo) return;
        
        // Actualizar paneles
        const observationsPanel = document.getElementById('sample-observations');
        const analysisPanel = document.getElementById('sample-analysis');
        const modelParamsPanel = document.getElementById('sample-model-params');
        
        if (observationsPanel) {
            observationsPanel.innerHTML = sampleInfo.observations;
        }
        
        if (analysisPanel) {
            analysisPanel.innerHTML = sampleInfo.analysis;
            
            // Inicializar gráficos específicos para cada fase
            initializePhaseSpecificCharts(sampleId);
        }
        
        if (modelParamsPanel) {
            const params = sampleInfo.modelParams;
            modelParamsPanel.innerHTML = `
                <p><strong>Parámetros del modelo:</strong></p>
                <ul>
                    <li>Población inicial (P₀): ${params.p0}</li>
                    <li>Tasa de crecimiento (r): ${params.r}</li>
                    <li>Capacidad de carga (K): ${params.k}</li>
                </ul>
                <p style="margin-top: 0.5rem;"><strong>Fase actual:</strong> ${params.currentPhase.charAt(0).toUpperCase() + params.currentPhase.slice(1)}</p>
            `;
            
            // Actualizar gráfico del modelo
            updateModelChart(params);
        }
    }
    
    // Inicializar gráficos específicos para cada fase
    function initializePhaseSpecificCharts(sampleId) {
        switch (sampleId) {
            case 'fase-lag':
                const enzymeCtx = document.getElementById('enzymeActivityChart');
                if (enzymeCtx) {
                    new Chart(enzymeCtx, {
                        type: 'line',
                        data: {
                            labels: ['0h', '0.5h', '1h', '1.5h', '2h'],
                            datasets: [{
                                label: 'Actividad Enzimática',
                                data: [10, 15, 25, 45, 70],
                                borderColor: '#4a2bac',
                                backgroundColor: 'rgba(74, 43, 172, 0.1)',
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
                                        text: 'Actividad (u.a.)'
                                    }
                                }
                            }
                        }
                    });
                }
                break;
                
            case 'fase-exponencial':
                const expCtx = document.getElementById('exponentialPhaseChart');
                if (expCtx) {
                    new Chart(expCtx, {
                        type: 'line',
                        data: {
                            labels: ['2h', '3h', '4h', '5h', '6h'],
                            datasets: [{
                                label: 'Densidad Celular',
                                data: [10, 50, 250, 1250, 6250],
                                borderColor: '#ef476f',
                                backgroundColor: 'rgba(239, 71, 111, 0.1)',
                                borderWidth: 2,
                                fill: true
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    type: 'logarithmic',
                                    title: {
                                        display: true,
                                        text: 'Células/ml (log)'
                                    }
                                }
                            }
                        }
                    });
                }
                break;
                
            case 'fase-estacionaria':
                const metaCtx = document.getElementById('metabolitesChart');
                if (metaCtx) {
                    new Chart(metaCtx, {
                        type: 'bar',
                        data: {
                            labels: ['Antibióticos', 'Pigmentos', 'Enzimas', 'Toxinas'],
                            datasets: [{
                                label: 'Concentración Relativa',
                                data: [75, 60, 85, 45],
                                backgroundColor: [
                                    'rgba(0, 187, 249, 0.7)',
                                    'rgba(0, 245, 212, 0.7)',
                                    'rgba(6, 214, 160, 0.7)',
                                    'rgba(255, 209, 102, 0.7)'
                                ],
                                borderWidth: 1
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
                                        text: 'Concentración (%)'
                                    }
                                }
                            }
                        }
                    });
                }
                break;
                
            case 'fase-muerte':
                const viabilityCtx = document.getElementById('viabilityChart');
                if (viabilityCtx) {
                    new Chart(viabilityCtx, {
                        type: 'pie',
                        data: {
                            labels: ['Células Viables', 'Células Dañadas', 'Células Muertas'],
                            datasets: [{
                                data: [25, 30, 45],
                                backgroundColor: [
                                    'rgba(6, 214, 160, 0.7)',
                                    'rgba(255, 209, 102, 0.7)',
                                    'rgba(239, 71, 111, 0.7)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    });
                }
                break;
        }
    }
    
    // Actualizar gráfico del modelo
    function updateModelChart(params) {
        const modelChartCtx = document.getElementById('microModelChart');
        if (!modelChartCtx) return;
        
        // Calcular datos para la curva logística
        const timePoints = 50;
        const maxTime = 20;
        const timeStep = maxTime / timePoints;
        
        const timeLabels = [];
        const modelData = [];
        
        for (let i = 0; i <= timePoints; i++) {
            const time = i * timeStep;
            timeLabels.push(time.toFixed(1));
            const value = logisticGrowth(params.p0, params.r, params.k, time);
            modelData.push(value);
        }
        
        // Determinar el punto correspondiente a la fase actual
        let phasePoint = null;
        switch (params.currentPhase) {
            case 'lag':
                phasePoint = { x: 1, y: modelData[Math.floor(timePoints * 0.05)] };
                break;
            case 'exponential':
                phasePoint = { x: 5, y: modelData[Math.floor(timePoints * 0.25)] };
                break;
            case 'stationary':
                phasePoint = { x: 10, y: modelData[Math.floor(timePoints * 0.5)] };
                break;
            case 'death':
                phasePoint = { x: 18, y: modelData[Math.floor(timePoints * 0.9)] };
                break;
        }
        
        // Crear o actualizar gráfico
        if (window.microModelChart) {
            window.microModelChart.data.labels = timeLabels;
            window.microModelChart.data.datasets[0].data = modelData;
            if (window.microModelChart.data.datasets.length > 1) {
                window.microModelChart.data.datasets[1].data = [phasePoint];
            } else {
                window.microModelChart.data.datasets.push({
                    label: 'Fase Actual',
                    data: [phasePoint],
                    backgroundColor: '#ef476f',
                    borderColor: '#ef476f',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    showLine: false
                });
            }
            window.microModelChart.update();
        } else {
            window.microModelChart = new Chart(modelChartCtx, {
                type: 'line',
                data: {
                    labels: timeLabels,
                    datasets: [
                        {
                            label: 'Modelo Logístico',
                            data: modelData,
                            borderColor: '#4a2bac',
                            backgroundColor: 'rgba(74, 43, 172, 0.1)',
                            borderWidth: 2,
                            fill: true
                        },
                        {
                            label: 'Fase Actual',
                            data: [phasePoint],
                            backgroundColor: '#ef476f',
                            borderColor: '#ef476f',
                            pointRadius: 6,
                            pointHoverRadius: 8,
                            showLine: false
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
        }
    }
    
    // Eventos para controles de zoom
    if (zoomSlider) {
        zoomSlider.addEventListener('input', function() {
            currentZoom = parseFloat(this.value);
            microscopeImage.style.transform = `scale(${currentZoom})`;
        });
    }
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', function() {
            currentZoom = Math.min(currentZoom + 0.5, 5);
            zoomSlider.value = currentZoom;
            microscopeImage.style.transform = `scale(${currentZoom})`;
        });
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', function() {
            currentZoom = Math.max(currentZoom - 0.5, 1);
            zoomSlider.value = currentZoom;
            microscopeImage.style.transform = `scale(${currentZoom})`;
        });
    }
    
    // Eventos para controles de brillo
    if (brightnessSlider) {
        brightnessSlider.addEventListener('input', function() {
            currentBrightness = parseFloat(this.value);
            microscopeImage.style.filter = `brightness(${currentBrightness})`;
        });
    }
    
    if (brightenBtn) {
        brightenBtn.addEventListener('click', function() {
            currentBrightness = Math.min(currentBrightness + 0.1, 1.5);
            brightnessSlider.value = currentBrightness;
            microscopeImage.style.filter = `brightness(${currentBrightness})`;
        });
    }
    
    if (darkenBtn) {
        darkenBtn.addEventListener('click', function() {
            currentBrightness = Math.max(currentBrightness - 0.1, 0.5);
            brightnessSlider.value = currentBrightness;
            microscopeImage.style.filter = `brightness(${currentBrightness})`;
        });
    }
    
    // Eventos para cambio de muestra
    sampleOptions.forEach(option => {
        option.addEventListener('click', function() {
            const sampleId = this.getAttribute('data-sample');
            changeSample(sampleId);
        });
    });
    
    // Eventos para pestañas de datos
    labTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Actualizar pestañas activas
            labTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar panel correspondiente
            labPanels.forEach(panel => {
                panel.classList.remove('active');
            });
            document.getElementById(`${tabId}-panel`).classList.add('active');
        });
    });
    
    // Inicializar con la primera muestra
    changeSample('fase-lag');
});

// ==========================================
// Modo Oscuro y Accesibilidad
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const accessibilityToggle = document.getElementById('accessibilityToggle');
    const accessibilityOptions = document.querySelector('.accessibility-options');
    const lightThemeBtn = document.getElementById('lightTheme');
    const darkThemeBtn = document.getElementById('darkTheme');
    const increaseFontSizeBtn = document.getElementById('increaseFontSize');
    const decreaseFontSizeBtn = document.getElementById('decreaseFontSize');
    const currentFontSizeSpan = document.getElementById('currentFontSize');
    const normalContrastBtn = document.getElementById('normalContrast');
    const highContrastBtn = document.getElementById('highContrast');
    const animationToggle = document.getElementById('animationToggle');
    const printVersionBtn = document.getElementById('printVersion');
    
    if (!accessibilityToggle) return; // Salir si no existe el panel de accesibilidad
    
    // Variables para preferencias
    let currentFontSizePercent = 100;
    
    // Abrir/cerrar panel de accesibilidad
    accessibilityToggle.addEventListener('click', function() {
        accessibilityOptions.classList.toggle('active');
    });
    
    // Cerrar panel al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        if (!accessibilityOptions.contains(event.target) && event.target !== accessibilityToggle) {
            accessibilityOptions.classList.remove('active');
        }
    });
    
    // Cambiar tema
    if (lightThemeBtn && darkThemeBtn) {
        lightThemeBtn.addEventListener('click', function() {
            document.body.classList.remove('dark-theme');
            lightThemeBtn.classList.add('active');
            darkThemeBtn.classList.remove('active');
            
            // Guardar preferencia
            localStorage.setItem('theme', 'light');
        });
        
        darkThemeBtn.addEventListener('click', function() {
            document.body.classList.add('dark-theme');
            darkThemeBtn.classList.add('active');
            lightThemeBtn.classList.remove('active');
            
            // Guardar preferencia
            localStorage.setItem('theme', 'dark');
        });
        
        // Cargar preferencia guardada
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            darkThemeBtn.click();
        }
    }
    
    // Cambiar tamaño de fuente
    if (increaseFontSizeBtn && decreaseFontSizeBtn && currentFontSizeSpan) {
        increaseFontSizeBtn.addEventListener('click', function() {
            if (currentFontSizePercent < 200) {
                currentFontSizePercent += 10;
                updateFontSize();
            }
        });
        
        decreaseFontSizeBtn.addEventListener('click', function() {
            if (currentFontSizePercent > 70) {
                currentFontSizePercent -= 10;
                updateFontSize();
            }
        });
        
        function updateFontSize() {
            document.documentElement.style.fontSize = `${currentFontSizePercent}%`;
            currentFontSizeSpan.textContent = `${currentFontSizePercent}%`;
            
            // Guardar preferencia
            localStorage.setItem('fontSize', currentFontSizePercent);
        }
        
        // Cargar preferencia guardada
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            currentFontSizePercent = parseInt(savedFontSize);
            updateFontSize();
        }
    }
    
    // Cambiar contraste
    if (normalContrastBtn && highContrastBtn) {
        normalContrastBtn.addEventListener('click', function() {
            document.body.classList.remove('high-contrast');
            normalContrastBtn.classList.add('active');
            highContrastBtn.classList.remove('active');
            
            // Guardar preferencia
            localStorage.setItem('contrast', 'normal');
        });
        
        highContrastBtn.addEventListener('click', function() {
            document.body.classList.add('high-contrast');
            highContrastBtn.classList.add('active');
            normalContrastBtn.classList.remove('active');
            
            // Guardar preferencia
            localStorage.setItem('contrast', 'high');
        });
        
        // Cargar preferencia guardada
        const savedContrast = localStorage.getItem('contrast');
        if (savedContrast === 'high') {
            highContrastBtn.click();
        }
    }
    
    // Activar/desactivar animaciones
    if (animationToggle) {
        animationToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.remove('reduce-motion');
            } else {
                document.body.classList.add('reduce-motion');
            }
            
            // Guardar preferencia
            localStorage.setItem('animations', this.checked ? 'on' : 'off');
        });
        
        // Cargar preferencia guardada
        const savedAnimations = localStorage.getItem('animations');
        if (savedAnimations === 'off') {
            animationToggle.checked = false;
            document.body.classList.add('reduce-motion');
        }
    }
    
    // Versión para imprimir
    if (printVersionBtn) {
        printVersionBtn.addEventListener('click', function() {
            window.print();
        });
    }
});