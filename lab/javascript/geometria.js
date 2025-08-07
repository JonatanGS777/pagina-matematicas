/**
 * MÓDULO DE GEOMETRÍA Y TRIGONOMETRÍA
 * Explorador interactivo del círculo unitario
 * Prof. Yonatan Guerrero Soriano - Matemáticas Digitales
 */

class GeometriaModule {
    constructor() {
        this.currentAngle = 0;
        this.isAnimating = false;
        this.animationSpeed = 2;
        this.animationInterval = null;
        this.showingSpecialAngles = false;
        this.specialAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];
        
        this.init();
    }

    init() {
        console.log('Módulo de Geometría inicializado');
        this.setupEventListeners();
        this.injectStyles();
        this.updateAngle(0);
        this.createSpecialAnglesMarkers();
    }

    setupEventListeners() {
        // Slider de ángulo
        const angleSlider = document.getElementById('angleSlider');
        if (angleSlider) {
            angleSlider.addEventListener('input', (e) => {
                if (!this.isAnimating) {
                    this.updateAngle(parseFloat(e.target.value));
                }
            });
        }

        // Input directo de ángulo
        const angleInput = document.getElementById('angleInput');
        if (angleInput) {
            angleInput.addEventListener('input', (e) => {
                if (!this.isAnimating) {
                    let value = parseFloat(e.target.value);
                    value = Math.max(0, Math.min(360, value || 0));
                    this.updateAngleFromInput(value);
                }
            });

            angleInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    let value = parseFloat(e.target.value);
                    value = Math.max(0, Math.min(360, value || 0));
                    this.updateAngleFromInput(value);
                }
            });
        }

        // Eventos de teclado para navegación
        document.addEventListener('keydown', (e) => {
            if (this.isModalOpen() && !this.isAnimating) {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.updateAngle(Math.max(0, this.currentAngle - 1));
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.updateAngle(Math.min(360, this.currentAngle + 1));
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.updateAngle(Math.min(360, this.currentAngle + 5));
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.updateAngle(Math.max(0, this.currentAngle - 5));
                        break;
                    case ' ':
                        e.preventDefault();
                        this.toggleAnimation();
                        break;
                }
            }
        });
    }

    isModalOpen() {
        const modal = document.getElementById('geometryModal');
        return modal && modal.style.display === 'block';
    }

    updateAngle(degrees) {
        // Normalizar ángulo
        this.currentAngle = ((degrees % 360) + 360) % 360;
        const radians = this.currentAngle * Math.PI / 180;
        
        // Actualizar displays
        this.updateDisplays(degrees);
        
        // Calcular valores trigonométricos
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const tan = Math.abs(cos) < 1e-10 ? (sin > 0 ? Infinity : -Infinity) : sin / cos;
        
        // Actualizar valores trigonométricos con animación
        this.updateTrigValues(cos, sin, tan);
        
        // Actualizar visualización del círculo
        this.updateCircleVisualization(degrees, radians, cos, sin);
        
        // Mostrar información adicional para ángulos especiales
        this.checkSpecialAngle(degrees);
    }

    updateDisplays(degrees) {
        const radians = degrees * Math.PI / 180;
        
        // Actualizar elementos del DOM
        const elements = {
            'angleValue': `${degrees.toFixed(1)}°`,
            'angleSlider': degrees,
            'angleInput': degrees.toFixed(1),
            'radiansDisplay': `Radianes: ${radians.toFixed(4)} rad`
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                if (id === 'angleSlider') {
                    element.value = value;
                } else {
                    element.textContent = value;
                }
            }
        });
    }

    updateTrigValues(cos, sin, tan) {
        const cosElement = document.getElementById('cosValue');
        const sinElement = document.getElementById('sinValue');
        const tanElement = document.getElementById('tanValue');
        
        if (cosElement) {
            cosElement.textContent = this.formatTrigValue(cos);
            this.animateValueChange(cosElement);
        }
        
        if (sinElement) {
            sinElement.textContent = this.formatTrigValue(sin);
            this.animateValueChange(sinElement);
        }
        
        if (tanElement) {
            const tanText = Math.abs(tan) > 1000 ? '∞' : this.formatTrigValue(tan);
            tanElement.textContent = tanText;
            this.animateValueChange(tanElement);
        }
    }

    formatTrigValue(value) {
        if (Math.abs(value) < 1e-10) return '0.000';
        if (Math.abs(value - 1) < 1e-10) return '1.000';
        if (Math.abs(value + 1) < 1e-10) return '-1.000';
        return value.toFixed(3);
    }

    animateValueChange(element) {
        element.style.transform = 'scale(1.1)';
        element.style.transition = 'transform 0.1s ease';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 100);
    }

    updateCircleVisualization(degrees, radians, cos, sin) {
        const radiusLine = document.getElementById('radiusLine');
        const angleArc = document.getElementById('angleArc');
        
        if (radiusLine) {
            // Rotar línea del radio
            radiusLine.style.transform = `rotate(${-degrees}deg)`;
            
            // Cambiar color según cuadrante
            const quadrant = Math.floor(degrees / 90) % 4;
            const colors = ['#4ecdc4', '#ff6b6b', '#ffa726', '#667eea'];
            radiusLine.style.background = colors[quadrant];
            radiusLine.style.boxShadow = `0 0 10px ${colors[quadrant]}`;
        }
        
        if (angleArc) {
            // Mostrar arco del ángulo
            angleArc.style.transform = `translate(-50%, -50%) rotate(${-degrees}deg)`;
            angleArc.style.borderColor = this.getQuadrantColor(degrees);
        }
        
        // Actualizar puntos de coordenadas
        this.updateCoordinatePoints(cos, sin);
        
        // Actualizar líneas de proyección
        this.updateProjectionLines(cos, sin);
    }

    getQuadrantColor(degrees) {
        const quadrant = Math.floor(degrees / 90) % 4;
        const colors = ['#4ecdc4', '#ff6b6b', '#ffa726', '#667eea'];
        return colors[quadrant];
    }

    updateCoordinatePoints(cos, sin) {
        // Crear o actualizar punto en el círculo
        this.updateCirclePoint(cos, sin);
        
        // Crear o actualizar proyecciones en los ejes
        this.updateAxisProjections(cos, sin);
    }

    updateCirclePoint(cos, sin) {
        const circleDisplay = document.querySelector('.circle-display');
        if (!circleDisplay) return;
        
        let point = document.getElementById('circlePoint');
        if (!point) {
            point = document.createElement('div');
            point.id = 'circlePoint';
            point.className = 'circle-point';
            circleDisplay.appendChild(point);
        }
        
        // Posicionar punto en el círculo (150px es el radio)
        const x = 150 + cos * 147; // 147 para estar dentro del borde
        const y = 150 - sin * 147; // negativo porque Y aumenta hacia abajo
        
        point.style.left = `${x}px`;
        point.style.top = `${y}px`;
        point.style.background = this.getQuadrantColor(this.currentAngle);
    }

    updateAxisProjections(cos, sin) {
        const circleDisplay = document.querySelector('.circle-display');
        if (!circleDisplay) return;
        
        // Proyección X (coseno)
        this.updateProjection('xProjection', 'x-projection', 150 + cos * 147, 150, '#ff6b6b');
        
        // Proyección Y (seno)
        this.updateProjection('yProjection', 'y-projection', 150, 150 - sin * 147, '#4ecdc4');
    }

    updateProjection(id, className, x, y, color) {
        const circleDisplay = document.querySelector('.circle-display');
        if (!circleDisplay) return;
        
        let projection = document.getElementById(id);
        if (!projection) {
            projection = document.createElement('div');
            projection.id = id;
            projection.className = className;
            circleDisplay.appendChild(projection);
        }
        
        projection.style.left = `${x}px`;
        projection.style.top = `${y}px`;
        projection.style.background = color;
    }

    updateProjectionLines(cos, sin) {
        const circleDisplay = document.querySelector('.circle-display');
        if (!circleDisplay) return;
        
        // Línea vertical (proyección del seno)
        this.updateLine('verticalLine', 'projection-line vertical', 
            150 + cos * 147, 150, 0, -sin * 147, '#4ecdc4');
        
        // Línea horizontal (proyección del coseno)
        this.updateLine('horizontalLine', 'projection-line horizontal',
            150, 150 - sin * 147, cos * 147, 0, '#ff6b6b');
    }

    updateLine(id, className, x, y, dx, dy, color) {
        const circleDisplay = document.querySelector('.circle-display');
        if (!circleDisplay) return;
        
        let line = document.getElementById(id);
        if (!line) {
            line = document.createElement('div');
            line.id = id;
            line.className = className;
            circleDisplay.appendChild(line);
        }
        
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        line.style.left = `${x}px`;
        line.style.top = `${y}px`;
        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.background = color;
    }

    checkSpecialAngle(degrees) {
        const tolerance = 0.5;
        const specialAngle = this.specialAngles.find(angle => Math.abs(degrees - angle) < tolerance);
        
        if (specialAngle !== undefined) {
            this.showSpecialAngleInfo(specialAngle);
        } else {
            this.hideSpecialAngleInfo();
        }
    }

    showSpecialAngleInfo(angle) {
        let infoDiv = document.getElementById('specialAngleInfo');
        if (!infoDiv) {
            infoDiv = document.createElement('div');
            infoDiv.id = 'specialAngleInfo';
            infoDiv.className = 'special-angle-info';
            
            const container = document.querySelector('.unit-circle-container');
            if (container) {
                container.appendChild(infoDiv);
            }
        }
        
        const radians = angle * Math.PI / 180;
        const specialValues = this.getSpecialAngleValues(angle);
        
        infoDiv.innerHTML = `
            <div class="special-angle-header">
                <i class="fas fa-star"></i>
                <span>Ángulo Especial: ${angle}°</span>
            </div>
            <div class="special-angle-details">
                <div>Radianes: ${specialValues.radians}</div>
                <div>sen(${angle}°) = ${specialValues.sin}</div>
                <div>cos(${angle}°) = ${specialValues.cos}</div>
                <div>tan(${angle}°) = ${specialValues.tan}</div>
            </div>
        `;
        
        infoDiv.style.display = 'block';
    }

    getSpecialAngleValues(angle) {
        const specialValues = {
            0: { radians: '0', sin: '0', cos: '1', tan: '0' },
            30: { radians: 'π/6', sin: '1/2', cos: '√3/2', tan: '√3/3' },
            45: { radians: 'π/4', sin: '√2/2', cos: '√2/2', tan: '1' },
            60: { radians: 'π/3', sin: '√3/2', cos: '1/2', tan: '√3' },
            90: { radians: 'π/2', sin: '1', cos: '0', tan: '∞' },
            120: { radians: '2π/3', sin: '√3/2', cos: '-1/2', tan: '-√3' },
            135: { radians: '3π/4', sin: '√2/2', cos: '-√2/2', tan: '-1' },
            150: { radians: '5π/6', sin: '1/2', cos: '-√3/2', tan: '-√3/3' },
            180: { radians: 'π', sin: '0', cos: '-1', tan: '0' },
            210: { radians: '7π/6', sin: '-1/2', cos: '-√3/2', tan: '√3/3' },
            225: { radians: '5π/4', sin: '-√2/2', cos: '-√2/2', tan: '1' },
            240: { radians: '4π/3', sin: '-√3/2', cos: '-1/2', tan: '√3' },
            270: { radians: '3π/2', sin: '-1', cos: '0', tan: '∞' },
            300: { radians: '5π/3', sin: '-√3/2', cos: '1/2', tan: '-√3' },
            315: { radians: '7π/4', sin: '-√2/2', cos: '√2/2', tan: '-1' },
            330: { radians: '11π/6', sin: '-1/2', cos: '√3/2', tan: '-√3/3' },
            360: { radians: '2π', sin: '0', cos: '1', tan: '0' }
        };
        
        return specialValues[angle] || { radians: '', sin: '', cos: '', tan: '' };
    }

    hideSpecialAngleInfo() {
        const infoDiv = document.getElementById('specialAngleInfo');
        if (infoDiv) {
            infoDiv.style.display = 'none';
        }
    }

    createSpecialAnglesMarkers() {
        const unitCircle = document.querySelector('.unit-circle');
        if (!unitCircle) return;
        
        // Limpiar marcadores existentes
        const existingMarkers = unitCircle.querySelectorAll('.angle-marker');
        existingMarkers.forEach(marker => marker.remove());
        
        // Crear marcadores para ángulos especiales
        this.specialAngles.forEach(angle => {
            if (angle === 360) return; // Evitar duplicar 0°
            
            const marker = document.createElement('div');
            marker.className = 'angle-marker';
            marker.style.position = 'absolute';
            marker.style.width = '8px';
            marker.style.height = '8px';
            marker.style.background = '#667eea';
            marker.style.borderRadius = '50%';
            marker.style.border = '2px solid white';
            marker.style.cursor = 'pointer';
            marker.title = `${angle}°`;
            
            // Posicionar marcador
            const radians = angle * Math.PI / 180;
            const x = 150 + Math.cos(radians) * 147 - 4; // -4 para centrar
            const y = 150 - Math.sin(radians) * 147 - 4; // -4 para centrar
            
            marker.style.left = `${x}px`;
            marker.style.top = `${y}px`;
            
            // Evento click para ir a este ángulo
            marker.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.updateAngle(angle);
                }
            });
            
            unitCircle.appendChild(marker);
        });
    }

    updateAngleFromInput(degrees) {
        this.updateAngle(degrees);
    }

    animateFullCircle() {
        if (this.isAnimating) {
            this.stopAnimation();
            return;
        }
        
        this.startAnimation();
    }

    startAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const button = document.querySelector('[onclick="geometriaModule.animateFullCircle()"]');
        if (button) {
            button.innerHTML = '<i class="fas fa-stop"></i> Detener Animación';
            button.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        }
        
        let currentAngle = this.currentAngle;
        
        this.animationInterval = setInterval(() => {
            currentAngle += this.animationSpeed;
            if (currentAngle >= 360) {
                currentAngle = 0;
            }
            this.updateAngle(currentAngle);
        }, 50);
    }

    stopAnimation() {
        this.isAnimating = false;
        
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        
        const button = document.querySelector('[onclick="geometriaModule.animateFullCircle()"]');
        if (button) {
            button.innerHTML = '<i class="fas fa-play"></i> Animación Completa';
            button.style.background = 'var(--gradient-main)';
        }
    }

    toggleAnimation() {
        if (this.isAnimating) {
            this.stopAnimation();
        } else {
            this.startAnimation();
        }
    }

    setAnimationSpeed(speed) {
        this.animationSpeed = Math.max(0.5, Math.min(10, speed));
    }

    goToSpecialAngle(angle) {
        if (!this.isAnimating) {
            this.updateAngle(angle);
        }
    }

    // Métodos de utilidad para funciones trigonométricas inversas
    calculateInverseTrig(value, func) {
        try {
            let result;
            switch(func) {
                case 'arcsin':
                    if (value < -1 || value > 1) throw new Error('Valor fuera del dominio');
                    result = Math.asin(value) * 180 / Math.PI;
                    break;
                case 'arccos':
                    if (value < -1 || value > 1) throw new Error('Valor fuera del dominio');
                    result = Math.acos(value) * 180 / Math.PI;
                    break;
                case 'arctan':
                    result = Math.atan(value) * 180 / Math.PI;
                    break;
                default:
                    throw new Error('Función no reconocida');
            }
            
            this.updateAngle(result);
            return result;
        } catch (error) {
            console.error('Error en cálculo de función inversa:', error);
            return null;
        }
    }

    // Exportar datos para análisis
    exportTrigData() {
        const data = [];
        for (let angle = 0; angle <= 360; angle += 5) {
            const radians = angle * Math.PI / 180;
            const cos = Math.cos(radians);
            const sin = Math.sin(radians);
            const tan = Math.abs(cos) < 1e-10 ? 'undefined' : sin / cos;
            
            data.push({
                degrees: angle,
                radians: radians.toFixed(6),
                sin: sin.toFixed(6),
                cos: cos.toFixed(6),
                tan: typeof tan === 'number' ? tan.toFixed(6) : tan
            });
        }
        
        const csvContent = "Grados,Radianes,Seno,Coseno,Tangente\n" +
            data.map(row => `${row.degrees},${row.radians},${row.sin},${row.cos},${row.tan}`).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'datos_trigonometricos.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    injectStyles() {
        if (document.getElementById('geometria-styles')) return;

        const style = document.createElement('style');
        style.id = 'geometria-styles';
        style.textContent = `
            .circle-point {
                position: absolute;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 3px solid white;
                z-index: 10;
                transform: translate(-50%, -50%);
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                transition: all 0.1s ease;
            }
            
            .circle-point:hover {
                transform: translate(-50%, -50%) scale(1.3);
            }
            
            .x-projection, .y-projection {
                position: absolute;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                border: 2px solid white;
                z-index: 8;
                transform: translate(-50%, -50%);
                opacity: 0.8;
            }
            
            .projection-line {
                position: absolute;
                height: 2px;
                z-index: 7;
                opacity: 0.6;
                transform-origin: 0 50%;
                transition: all 0.1s ease;
            }
            
            .projection-line.vertical {
                border-left: 2px dashed #4ecdc4;
                height: 1px;
            }
            
            .projection-line.horizontal {
                border-top: 2px dashed #ff6b6b;
            }
            
            .angle-marker {
                transition: all 0.2s ease;
                z-index: 5;
            }
            
            .angle-marker:hover {
                transform: scale(1.5);
                background: #ffa726 !important;
                z-index: 15;
            }
            
            .special-angle-info {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 15px;
                padding: 1.5rem;
                margin-top: 1rem;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                animation: slideInUp 0.3s ease;
                display: none;
            }
            
            .special-angle-header {
                display: flex;
                align-items: center;
                font-size: 1.2rem;
                font-weight: 600;
                margin-bottom: 1rem;
            }
            
            .special-angle-header i {
                margin-right: 0.5rem;
                color: #ffa726;
            }
            
            .special-angle-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.5rem;
                font-family: 'Space Grotesk', monospace;
                font-size: 0.95rem;
            }
            
            .special-angle-details div {
                background: rgba(255,255,255,0.1);
                padding: 0.5rem;
                border-radius: 8px;
                text-align: center;
            }
            
            .trig-value {
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .trig-value:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }
            
            .trig-value::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s ease;
            }
            
            .trig-value:hover::before {
                left: 100%;
            }
            
            .unit-circle {
                transition: all 0.3s ease;
                position: relative;
            }
            
            .unit-circle:hover {
                box-shadow: 0 0 30px rgba(102, 126, 234, 0.4);
            }
            
            .radius-line {
                transition: all 0.1s ease;
                box-shadow: 0 0 5px currentColor;
            }
            
            .angle-arc {
                transition: all 0.1s ease;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes pulseGlow {
                0%, 100% {
                    box-shadow: 0 0 5px currentColor;
                }
                50% {
                    box-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
                }
            }
            
            .radius-line.special-angle {
                animation: pulseGlow 2s infinite;
            }
            
            /* Estilos responsivos */
            @media (max-width: 768px) {
                .circle-display {
                    width: 250px;
                    height: 250px;
                }
                
                .unit-circle {
                    width: 100%;
                    height: 100%;
                }
                
                .circle-point {
                    width: 10px;
                    height: 10px;
                }
                
                .angle-marker {
                    width: 6px;
                    height: 6px;
                }
                
                .special-angle-details {
                    grid-template-columns: 1fr;
                    gap: 0.3rem;
                }
                
                .special-angle-details div {
                    font-size: 0.85rem;
                    padding: 0.4rem;
                }
            }
            
            /* Mejoras de accesibilidad */
            .angle-marker:focus {
                outline: 3px solid #ffa726;
                outline-offset: 2px;
            }
            
            .trig-value[aria-selected="true"] {
                border: 3px solid #667eea;
                background: rgba(102, 126, 234, 0.1);
            }
            
            /* Indicador de cuadrante */
            .quadrant-indicator {
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 0.5rem;
                border-radius: 8px;
                font-size: 0.9rem;
                font-weight: 600;
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Crear instancia global del módulo
window.GeometriaModule = GeometriaModule;