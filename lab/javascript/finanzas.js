/**
 * MÓDULO DE FINANZAS PERSONALES
 * Simulador comparativo de interés simple y compuesto
 * Prof. Yonatan Guerrero Soriano - Matemáticas Digitales
 */

class FinanzasModule {
    constructor() {
        this.currentData = {
            principal: 1000,
            rate: 0.05,
            time: 10,
            simpleData: [],
            compoundData: [],
            years: []
        };
        
        this.init();
    }

    init() {
        console.log('Módulo de Finanzas inicializado');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Escuchar cambios en los inputs para actualización en tiempo real
        const inputs = ['principal', 'rate', 'time'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => {
                    this.debounceCalculation();
                });
            }
        });
    }

    // Evitar cálculos excesivos durante la escritura
    debounceCalculation() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.calculateInterest();
        }, 300);
    }

    calculateInterest() {
        try {
            // Obtener valores de los inputs
            this.currentData.principal = parseFloat(document.getElementById('principal').value) || 1000;
            this.currentData.rate = parseFloat(document.getElementById('rate').value) / 100 || 0.05;
            this.currentData.time = parseInt(document.getElementById('time').value) || 10;

            // Validar inputs
            if (!this.validateInputs()) {
                return;
            }

            // Calcular datos para ambos tipos de interés
            this.calculateInterestData();
            
            // Crear visualizaciones
            this.createInterestChart();
            this.displayResults();
            this.createInterestTable();

        } catch (error) {
            console.error('Error en cálculo de interés:', error);
            this.showError('Error en los cálculos. Por favor, verifique los valores ingresados.');
        }
    }

    validateInputs() {
        const { principal, rate, time } = this.currentData;
        
        if (principal <= 0) {
            this.showError('El monto inicial debe ser mayor que 0');
            return false;
        }
        
        if (rate < 0) {
            this.showError('La tasa de interés no puede ser negativa');
            return false;
        }
        
        if (time <= 0 || time > 100) {
            this.showError('El tiempo debe estar entre 1 y 100 años');
            return false;
        }
        
        return true;
    }

    calculateInterestData() {
        const { principal, rate, time } = this.currentData;
        
        // Limpiar datos anteriores
        this.currentData.simpleData = [];
        this.currentData.compoundData = [];
        this.currentData.years = [];

        // Calcular para cada año
        for (let t = 0; t <= time; t++) {
            this.currentData.years.push(t);
            
            // Fórmula de interés simple: A = P(1 + rt)
            const simple = principal * (1 + rate * t);
            
            // Fórmula de interés compuesto: A = P(1 + r)^t
            const compound = principal * Math.pow(1 + rate, t);
            
            this.currentData.simpleData.push(simple);
            this.currentData.compoundData.push(compound);
        }
    }

    createInterestChart() {
        const { years, simpleData, compoundData } = this.currentData;

        // Configurar trazas para la gráfica
        const trace1 = {
            x: years,
            y: simpleData,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Interés Simple',
            line: { 
                color: '#4ecdc4', 
                width: 3,
                shape: 'linear'
            },
            marker: { 
                size: 8,
                color: '#4ecdc4',
                line: { color: '#fff', width: 2 }
            },
            hovertemplate: '<b>Año %{x}</b><br>' +
                         'Monto: $%{y:,.2f}<br>' +
                         '<extra></extra>'
        };

        const trace2 = {
            x: years,
            y: compoundData,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Interés Compuesto',
            line: { 
                color: '#ff6b6b', 
                width: 3,
                shape: 'spline'
            },
            marker: { 
                size: 8,
                color: '#ff6b6b',
                line: { color: '#fff', width: 2 }
            },
            hovertemplate: '<b>Año %{x}</b><br>' +
                         'Monto: $%{y:,.2f}<br>' +
                         '<extra></extra>'
        };

        // Configuración del layout
        const layout = {
            title: {
                text: 'Comparación: Interés Simple vs Compuesto',
                font: { family: 'Space Grotesk, sans-serif', size: 18, color: '#2d3748' }
            },
            xaxis: { 
                title: 'Años',
                gridcolor: '#e2e8f0',
                zeroline: false
            },
            yaxis: { 
                title: 'Monto ($)',
                gridcolor: '#e2e8f0',
                zeroline: false,
                tickformat: '$,.0f'
            },
            showlegend: true,
            legend: {
                x: 0.02,
                y: 0.98,
                bgcolor: 'rgba(255,255,255,0.8)',
                bordercolor: '#e2e8f0',
                borderwidth: 1
            },
            font: { family: 'Inter, sans-serif', color: '#2d3748' },
            plot_bgcolor: '#f8f9fa',
            paper_bgcolor: '#ffffff',
            margin: { l: 60, r: 40, t: 60, b: 60 }
        };

        // Configuración responsiva
        const config = {
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
            displaylogo: false
        };

        // Crear la gráfica
        Plotly.newPlot('interestChart', [trace1, trace2], layout, config);
    }

    displayResults() {
        const { time, simpleData, compoundData } = this.currentData;
        
        const finalSimple = simpleData[time];
        const finalCompound = compoundData[time];
        const difference = finalCompound - finalSimple;
        const percentageDifference = ((difference / finalSimple) * 100);

        const resultsHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                <div class="result-card simple">
                    <div class="result-icon">📈</div>
                    <h4>Interés Simple</h4>
                    <div class="result-amount">$${this.formatNumber(finalSimple)}</div>
                    <div class="result-gain">Ganancia: $${this.formatNumber(finalSimple - this.currentData.principal)}</div>
                </div>
                <div class="result-card compound">
                    <div class="result-icon">🚀</div>
                    <h4>Interés Compuesto</h4>
                    <div class="result-amount">$${this.formatNumber(finalCompound)}</div>
                    <div class="result-gain">Ganancia: $${this.formatNumber(finalCompound - this.currentData.principal)}</div>
                </div>
            </div>
            <div class="result-card difference">
                <div class="result-icon">💰</div>
                <h4>Diferencia a favor del Interés Compuesto</h4>
                <div class="result-amount">$${this.formatNumber(difference)}</div>
                <div class="result-percentage">${percentageDifference.toFixed(1)}% más ganancia</div>
            </div>
        `;

        // Inyectar estilos para las tarjetas de resultados
        this.injectResultStyles();
        
        document.getElementById('resultsContainer').innerHTML = resultsHTML;
    }

    createInterestTable() {
        const { years, simpleData, compoundData } = this.currentData;
        
        let tableHTML = `
            <div class="table-container">
                <h3 style="margin-bottom: 1rem; text-align: center; color: #2d3748;">Tabla Comparativa Detallada</h3>
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>Año</th>
                            <th>Interés Simple</th>
                            <th>Interés Compuesto</th>
                            <th>Diferencia</th>
                            <th>% Diferencia</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Mostrar solo cada 2 años si hay muchos datos para mejor legibilidad
        const step = years.length > 20 ? 2 : 1;
        
        for (let i = 0; i < years.length; i += step) {
            const year = years[i];
            const simple = simpleData[i];
            const compound = compoundData[i];
            const difference = compound - simple;
            const percentDiff = simple > 0 ? ((difference / simple) * 100) : 0;
            
            tableHTML += `
                <tr>
                    <td><strong>${year}</strong></td>
                    <td>$${this.formatNumber(simple)}</td>
                    <td>$${this.formatNumber(compound)}</td>
                    <td class="${difference > 0 ? 'positive' : ''}">$${this.formatNumber(difference)}</td>
                    <td class="${percentDiff > 0 ? 'positive' : ''}">${percentDiff.toFixed(1)}%</td>
                </tr>
            `;
        }

        tableHTML += '</tbody></table></div>';
        document.getElementById('interestTable').innerHTML = tableHTML;
    }

    formatNumber(num) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    }

    injectResultStyles() {
        // Verificar si los estilos ya fueron inyectados
        if (document.getElementById('finanzas-result-styles')) return;

        const style = document.createElement('style');
        style.id = 'finanzas-result-styles';
        style.textContent = `
            .result-card {
                padding: 1.5rem;
                border-radius: 15px;
                text-align: center;
                margin: 0.5rem 0;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
            }
            
            .result-card:hover {
                transform: translateY(-3px);
            }
            
            .result-card.simple {
                background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
                color: white;
            }
            
            .result-card.compound {
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                color: white;
            }
            
            .result-card.difference {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                grid-column: 1 / -1;
                margin-top: 1rem;
            }
            
            .result-icon {
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }
            
            .result-card h4 {
                margin: 0.5rem 0;
                font-size: 1.1rem;
                opacity: 0.9;
            }
            
            .result-amount {
                font-size: 2rem;
                font-weight: bold;
                font-family: 'Space Grotesk', sans-serif;
                margin: 0.5rem 0;
            }
            
            .result-gain, .result-percentage {
                font-size: 0.9rem;
                opacity: 0.8;
            }
            
            .table-container {
                background: white;
                border-radius: 15px;
                padding: 1.5rem;
                margin-top: 2rem;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            
            .results-table td.positive {
                color: #22c55e;
                font-weight: 600;
            }
            
            @media (max-width: 768px) {
                .result-amount {
                    font-size: 1.5rem;
                }
                
                .result-card {
                    padding: 1rem;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    showError(message) {
        const errorDiv = document.getElementById('resultsContainer');
        if (errorDiv) {
            errorDiv.innerHTML = `
                <div style="background: #fed7d7; color: #c53030; padding: 1rem; border-radius: 10px; text-align: center; border: 1px solid #feb2b2;">
                    <i class="fas fa-exclamation-triangle"></i> ${message}
                </div>
            `;
        }
    }

    // Método para exportar datos (funcionalidad adicional)
    exportData() {
        const { years, simpleData, compoundData } = this.currentData;
        
        let csvContent = "Año,Interés Simple,Interés Compuesto,Diferencia\n";
        
        for (let i = 0; i < years.length; i++) {
            const difference = compoundData[i] - simpleData[i];
            csvContent += `${years[i]},${simpleData[i].toFixed(2)},${compoundData[i].toFixed(2)},${difference.toFixed(2)}\n`;
        }
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'comparacion_intereses.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // Método para resetear a valores por defecto
    reset() {
        document.getElementById('principal').value = 1000;
        document.getElementById('rate').value = 5;
        document.getElementById('time').value = 10;
        this.calculateInterest();
    }
}

// Crear instancia global del módulo
window.FinanzasModule = FinanzasModule;