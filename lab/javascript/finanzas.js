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
                color: '#35526B',
                width: 3,
                shape: 'linear'
            },
            marker: {
                size: 8,
                color: '#35526B',
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
                color: '#2E8B6F',
                width: 3,
                shape: 'spline'
            },
            marker: {
                size: 8,
                color: '#2E8B6F',
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
                font: { family: 'Space Grotesk, sans-serif', size: 18, color: '#1E2530' }
            },
            xaxis: {
                title: 'Años',
                gridcolor: '#DDE3E6',
                zeroline: false
            },
            yaxis: {
                title: 'Monto ($)',
                gridcolor: '#DDE3E6',
                zeroline: false,
                tickformat: '$,.0f'
            },
            showlegend: true,
            legend: {
                x: 0.02,
                y: 0.98,
                bgcolor: 'rgba(255,255,255,0.8)',
                bordercolor: '#DDE3E6',
                borderwidth: 1
            },
            font: { family: 'Syne, sans-serif', color: '#1E2530' },
            plot_bgcolor: '#F4F6F7',
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
                    <div class="result-icon"><svg style="width:1em;height:1em;display:inline-block;" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 7h6v6" /> <path d="m22 7-8.5 8.5-5-5L2 17" /></svg></div>
                    <h4>Interés Simple</h4>
                    <div class="result-amount">$${this.formatNumber(finalSimple)}</div>
                    <div class="result-gain">Ganancia: $${this.formatNumber(finalSimple - this.currentData.principal)}</div>
                </div>
                <div class="result-card compound">
                    <div class="result-icon"><svg style="width:1em;height:1em;display:inline-block;" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /> <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09" /> <path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z" /> <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05" /></svg></div>
                    <h4>Interés Compuesto</h4>
                    <div class="result-amount">$${this.formatNumber(finalCompound)}</div>
                    <div class="result-gain">Ganancia: $${this.formatNumber(finalCompound - this.currentData.principal)}</div>
                </div>
            </div>
            <div class="result-card difference">
                <div class="result-icon"><svg style="width:1em;height:1em;display:inline-block;" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.744 17.736a6 6 0 1 1-7.48-7.48" /> <path d="M15 6h1v4" /> <path d="m6.134 14.768.866-.5 2 3.464" /> <circle cx="16" cy="8" r="6" /></svg></div>
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
                <h3 style="margin-bottom: 1rem; text-align: center; color: #1E2530;">Tabla Comparativa Detallada</h3>
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
                background: linear-gradient(135deg, #35526B 0%, #22344A 100%);
                color: white;
            }

            .result-card.compound {
                background: linear-gradient(135deg, #2E8B6F 0%, #1F6B52 100%);
                color: white;
            }

            .result-card.difference {
                background: linear-gradient(135deg, #2FA6A0 0%, #1E7A75 100%);
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
                <div style="background: rgba(178, 58, 58, 0.1); color: #B23A3A; padding: 1rem; border-radius: 10px; text-align: center; border: 1px solid rgba(178, 58, 58, 0.3);">
                    <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.4em;flex-shrink:0;display:inline-block;" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /> <path d="M12 9v4" /> <path d="M12 17h.01" /></svg> ${message}
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