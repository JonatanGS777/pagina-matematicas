class GeoExplorer {
    constructor() {
        this.canvas = document.getElementById('main-canvas');
        this.ctx = null;
        this.currentFigure = null;
        this.currentTab = '2d';
        this.animationId = null;
        this.size = 100;
        this.rotation = 0;
        this.color = '#4c51bf';
        this.time = 0;
        this.mathJax = null;
        
        // Inicializar en orden
        this.setupCanvas();
        this.setupEventListeners();
        this.initializeMathJax();
        this.showWelcomeMessage();
    }
    
    async initializeMathJax() {
        try {
            this.mathJax = new MathJaxModule({
                useInlineMath: true,
                useDisplayMath: true,
                enableDebugLogs: false
            });
            await this.mathJax.initialize();
            console.log('✅ MathJax inicializado correctamente para GeoExplorer');
        } catch (error) {
            console.warn('⚠️ Error al inicializar MathJax:', error);
        }
    }
    
    setupCanvas() {
        // Crear canvas dinámicamente
        const canvasElement = document.createElement('canvas');
        
        // Función para redimensionar el canvas
        const resizeCanvas = () => {
            const rect = this.canvas.getBoundingClientRect();
            const width = Math.max(300, rect.width - 4); // Mínimo 300px
            const height = Math.max(200, rect.height - 4); // Mínimo 200px
            
            canvasElement.width = width;
            canvasElement.height = height;
            canvasElement.style.width = '100%';
            canvasElement.style.height = '100%';
            
            if (this.currentFigure) {
                this.redraw();
            } else {
                this.showWelcomeMessage();
            }
        };
        
        this.canvas.innerHTML = '';
        this.canvas.appendChild(canvasElement);
        this.ctx = canvasElement.getContext('2d');
        
        // Redimensionar inicialmente con un pequeño delay
        setTimeout(() => {
            resizeCanvas();
        }, 100);
        
        // Redimensionar canvas cuando cambie el tamaño de la ventana
        window.addEventListener('resize', () => {
            setTimeout(resizeCanvas, 50);
        });
        
        // Observer para detectar cambios en el tamaño del contenedor (si está disponible)
        if (window.ResizeObserver) {
            try {
                const resizeObserver = new ResizeObserver(() => {
                    setTimeout(resizeCanvas, 50);
                });
                resizeObserver.observe(this.canvas);
            } catch (error) {
                console.warn('ResizeObserver no pudo iniciarse:', error);
            }
        }
    }
    
    setupEventListeners() {
        try {
            // Pestañas
            document.querySelectorAll('.tab').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchTab(e.target.dataset.tab);
                });
            });
            
            // Botones de figuras
            document.querySelectorAll('.figure-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.selectFigure(e.target.dataset.figure);
                });
            });
            
            // Controles deslizantes
            const sizeSlider = document.getElementById('size-slider');
            if (sizeSlider) {
                sizeSlider.addEventListener('input', (e) => {
                    this.size = parseInt(e.target.value);
                    const sizeValue = document.getElementById('size-value');
                    if (sizeValue) {
                        sizeValue.textContent = this.size;
                    }
                    this.redraw();
                    this.updateProperties();
                });
            }
            
            const rotationSlider = document.getElementById('rotation-slider');
            if (rotationSlider) {
                rotationSlider.addEventListener('input', (e) => {
                    this.rotation = parseInt(e.target.value);
                    const rotationValue = document.getElementById('rotation-value');
                    if (rotationValue) {
                        rotationValue.textContent = this.rotation + '°';
                    }
                    this.redraw();
                    this.updateProperties();
                });
            }
            
            const colorPicker = document.getElementById('color-picker');
            if (colorPicker) {
                colorPicker.addEventListener('input', (e) => {
                    this.color = e.target.value;
                    this.redraw();
                    this.updateProperties();
                });
            }
            
            console.log('✅ Event listeners configurados correctamente');
        } catch (error) {
            console.error('❌ Error configurando event listeners:', error);
        }
    }
    
    switchTab(tabName) {
        // Actualizar pestañas
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Mostrar sección correspondiente
        document.querySelectorAll('.figure-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`section-${tabName}`).classList.add('active');
        
        this.currentTab = tabName;
        this.currentFigure = null;
        
        // Limpiar selecciones
        document.querySelectorAll('.figure-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Mostrar mensaje de bienvenida
        setTimeout(() => {
            this.showWelcomeMessage();
        }, 50);
    }
    
    selectFigure(figureName) {
        try {
            // Actualizar botón activo
            document.querySelectorAll('.figure-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const selectedBtn = document.querySelector(`[data-figure="${figureName}"]`);
            if (selectedBtn) {
                selectedBtn.classList.add('active');
            }
            
            this.currentFigure = figureName;
            this.startAnimation();
            this.showFigureInfo(figureName);
            
            console.log('✅ Figura seleccionada:', figureName);
        } catch (error) {
            console.error('❌ Error seleccionando figura:', error);
        }
    }
    
    showWelcomeMessage() {
        if (!this.ctx || !this.ctx.canvas) return;
        
        try {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            const centerX = this.ctx.canvas.width / 2;
            const centerY = this.ctx.canvas.height / 2;
            
            // Ajustar tamaño de texto según el tamaño del canvas
            const baseFontSize = Math.min(this.ctx.canvas.width, this.ctx.canvas.height) / 20;
            
            this.ctx.fillStyle = '#667eea';
            this.ctx.font = `bold ${Math.max(16, baseFontSize)}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Selecciona una figura para comenzar', centerX, centerY);
            
            this.ctx.font = `${Math.max(12, baseFontSize * 0.7)}px Arial`;
            this.ctx.fillStyle = '#666';
            this.ctx.fillText(`Sección: ${this.currentTab.toUpperCase()}`, centerX, centerY + 40);
            
            // Ocultar panel de información
            const infoPanel = document.getElementById('info-panel');
            if (infoPanel) {
                infoPanel.style.display = 'none';
            }
        } catch (error) {
            console.warn('Error en showWelcomeMessage:', error);
        }
    }
    
    startAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.animate();
    }
    
    animate() {
        this.time += 0.02;
        this.redraw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    redraw() {
        if (!this.currentFigure || !this.ctx || !this.ctx.canvas) return;
        
        try {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            const centerX = this.ctx.canvas.width / 2;
            const centerY = this.ctx.canvas.height / 2;
            
            // Ajustar el tamaño base según el tamaño del canvas
            const canvasSize = Math.min(this.ctx.canvas.width, this.ctx.canvas.height);
            const scaleFactor = Math.max(0.8, canvasSize / 500); // Factor de escala con mínimo de 0.8
            const adjustedSize = this.size * scaleFactor;
            
            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate((this.rotation * Math.PI / 180) + Math.sin(this.time) * 0.1);
            
            // Usar el tamaño ajustado temporalmente
            const originalSize = this.size;
            this.size = adjustedSize;
            
            if (this.currentTab === '2d') {
                this.draw2DFigure(this.currentFigure);
            } else if (this.currentTab === '3d') {
                this.draw3DFigure(this.currentFigure);
            } else if (this.currentTab === 'polyhedra') {
                this.drawPolyhedron(this.currentFigure);
            }
            
            // Restaurar el tamaño original
            this.size = originalSize;
            
            this.ctx.restore();
        } catch (error) {
            console.warn('Error en redraw:', error);
        }
    }
    
    draw2DFigure(figure) {
        const baseSize = this.size;
        
        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = this.darkenColor(this.color, 20);
        this.ctx.lineWidth = 3;
        
        switch (figure) {
            case 'circle':
                this.drawCircle(baseSize);
                break;
            case 'triangle':
                this.drawTriangle(baseSize);
                break;
            case 'square':
                this.drawSquare(baseSize);
                break;
            case 'rectangle':
                this.drawRectangle(baseSize, baseSize * 1.5);
                break;
            case 'pentagon':
                this.drawPolygon(5, baseSize);
                break;
            case 'hexagon':
                this.drawPolygon(6, baseSize);
                break;
            case 'octagon':
                this.drawPolygon(8, baseSize);
                break;
            case 'star':
                this.drawStar(5, baseSize * 0.5, baseSize);
                break;
        }
    }
    
    draw3DFigure(figure) {
        const baseSize = this.size;
        
        switch (figure) {
            case 'sphere':
                this.drawSphere(baseSize);
                break;
            case 'cube':
                this.drawCube(baseSize);
                break;
            case 'cylinder':
                this.drawCylinder(baseSize, baseSize * 1.5);
                break;
            case 'cone':
                this.drawCone(baseSize, baseSize * 1.5);
                break;
            case 'triangular-prism':
                this.drawTriangularPrism(baseSize);
                break;
            case 'hexagonal-prism':
                this.drawHexagonalPrism(baseSize);
                break;
            case 'pyramid':
                this.drawPyramid(baseSize);
                break;
            case 'torus':
                this.drawTorus(baseSize);
                break;
        }
    }
    
    drawPolyhedron(figure) {
        const baseSize = this.size;
        
        switch (figure) {
            case 'tetrahedron':
                this.drawTetrahedron(baseSize);
                break;
            case 'octahedron':
                this.drawOctahedron(baseSize);
                break;
            case 'dodecahedron':
                this.drawDodecahedron(baseSize);
                break;
            case 'icosahedron':
                this.drawIcosahedron(baseSize);
                break;
            case 'truncated-cube':
                this.drawTruncatedCube(baseSize);
                break;
            case 'rhombicuboctahedron':
                this.drawRhombicuboctahedron(baseSize);
                break;
            case 'stella-octangula':
                this.drawStellaOctangula(baseSize);
                break;
            case 'geodesic':
                this.drawGeodesicSphere(baseSize);
                break;
        }
    }
    
    // Métodos de dibujo para figuras 2D
    drawCircle(radius) {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Añadir brillo
        const gradient = this.ctx.createRadialGradient(-radius/3, -radius/3, 0, 0, 0, radius);
        gradient.addColorStop(0, this.lightenColor(this.color, 30));
        gradient.addColorStop(1, this.color);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }
    
    drawTriangle(size) {
        this.ctx.beginPath();
        const height = size * Math.sqrt(3) / 2;
        this.ctx.moveTo(0, -height * 2/3);
        this.ctx.lineTo(-size/2, height/3);
        this.ctx.lineTo(size/2, height/3);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawSquare(size) {
        this.ctx.fillRect(-size/2, -size/2, size, size);
        this.ctx.strokeRect(-size/2, -size/2, size, size);
    }
    
    drawRectangle(width, height) {
        this.ctx.fillRect(-width/2, -height/2, width, height);
        this.ctx.strokeRect(-width/2, -height/2, width, height);
    }
    
    drawPolygon(sides, radius) {
        this.ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawStar(points, innerRadius, outerRadius) {
        this.ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const angle = (i * Math.PI) / points - Math.PI / 2;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    // Métodos de dibujo para figuras 3D (proyección isométrica)
    drawSphere(radius) {
        // Dibujar esfera con múltiples círculos
        this.ctx.globalAlpha = 0.8;
        
        for (let i = 0; i < 8; i++) {
            const lat = (i - 3.5) * Math.PI / 7;
            const circleRadius = radius * Math.cos(lat);
            const y = radius * Math.sin(lat) * 0.5;
            
            this.ctx.strokeStyle = this.lightenColor(this.color, i * 5);
            this.ctx.beginPath();
            this.ctx.ellipse(0, y, circleRadius, circleRadius * 0.3, 0, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
        
        // Círculo principal
        this.ctx.globalAlpha = 0.6;
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.globalAlpha = 1;
    }
    
    drawCube(size) {
        const s = size / 2;
        const offset = size * 0.3;
        
        // Cara frontal
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(-s, -s, size, size);
        this.ctx.strokeRect(-s, -s, size, size);
        
        // Cara superior
        this.ctx.fillStyle = this.lightenColor(this.color, 20);
        this.ctx.beginPath();
        this.ctx.moveTo(-s, -s);
        this.ctx.lineTo(-s + offset, -s - offset);
        this.ctx.lineTo(s + offset, -s - offset);
        this.ctx.lineTo(s, -s);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Cara derecha
        this.ctx.fillStyle = this.darkenColor(this.color, 20);
        this.ctx.beginPath();
        this.ctx.moveTo(s, -s);
        this.ctx.lineTo(s + offset, -s - offset);
        this.ctx.lineTo(s + offset, s - offset);
        this.ctx.lineTo(s, s);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawCylinder(radius, height) {
        const h = height / 2;
        const offset = radius * 0.3;
        
        // Base inferior
        this.ctx.fillStyle = this.darkenColor(this.color, 20);
        this.ctx.beginPath();
        this.ctx.ellipse(0, h, radius, radius * 0.3, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Cuerpo
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(-radius, -h, radius * 2, height);
        this.ctx.strokeRect(-radius, -h, radius * 2, height);
        
        // Base superior
        this.ctx.fillStyle = this.lightenColor(this.color, 20);
        this.ctx.beginPath();
        this.ctx.ellipse(0, -h, radius, radius * 0.3, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawCone(radius, height) {
        const h = height / 2;
        
        // Base
        this.ctx.fillStyle = this.darkenColor(this.color, 20);
        this.ctx.beginPath();
        this.ctx.ellipse(0, h, radius, radius * 0.3, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Cuerpo
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(-radius, h);
        this.ctx.lineTo(0, -h);
        this.ctx.lineTo(radius, h);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawTriangularPrism(size) {
        const h = size;
        const w = size * 0.866;
        const depth = size * 0.5;
        
        // Cara frontal (triángulo)
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -h/2);
        this.ctx.lineTo(-w/2, h/2);
        this.ctx.lineTo(w/2, h/2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Caras laterales
        this.ctx.fillStyle = this.darkenColor(this.color, 15);
        
        // Lateral derecha
        this.ctx.beginPath();
        this.ctx.moveTo(w/2, h/2);
        this.ctx.lineTo(w/2 + depth, h/2 - depth);
        this.ctx.lineTo(depth, -h/2 - depth);
        this.ctx.lineTo(0, -h/2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Base superior
        this.ctx.fillStyle = this.lightenColor(this.color, 20);
        this.ctx.beginPath();
        this.ctx.moveTo(0, -h/2);
        this.ctx.lineTo(depth, -h/2 - depth);
        this.ctx.lineTo(w/2 + depth, h/2 - depth);
        this.ctx.lineTo(w/2, h/2);
        this.ctx.lineTo(-w/2, h/2);
        this.ctx.lineTo(-w/2 + depth, h/2 - depth);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawHexagonalPrism(size) {
        const radius = size * 0.8;
        const height = size;
        const depth = size * 0.3;
        
        // Base inferior (hexágono)
        this.ctx.fillStyle = this.color;
        this.drawPolygon(6, radius);
        
        // Caras laterales
        this.ctx.fillStyle = this.darkenColor(this.color, 20);
        for (let i = 0; i < 6; i++) {
            const angle1 = (i * 2 * Math.PI) / 6 - Math.PI / 2;
            const angle2 = ((i + 1) * 2 * Math.PI) / 6 - Math.PI / 2;
            
            const x1 = radius * Math.cos(angle1);
            const y1 = radius * Math.sin(angle1);
            const x2 = radius * Math.cos(angle2);
            const y2 = radius * Math.sin(angle2);
            
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x1 + depth, y1 - depth);
            this.ctx.lineTo(x2 + depth, y2 - depth);
            this.ctx.lineTo(x2, y2);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }
    }
    
    drawPyramid(size) {
        const base = size;
        const height = size;
        const depth = size * 0.3;
        
        // Base
        this.ctx.fillStyle = this.darkenColor(this.color, 20);
        this.ctx.fillRect(-base/2, base/2 - base, base, base);
        this.ctx.strokeRect(-base/2, base/2 - base, base, base);
        
        // Caras
        this.ctx.fillStyle = this.color;
        
        // Cara frontal
        this.ctx.beginPath();
        this.ctx.moveTo(-base/2, base/2);
        this.ctx.lineTo(base/2, base/2);
        this.ctx.lineTo(0, -height/2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Cara derecha
        this.ctx.fillStyle = this.darkenColor(this.color, 10);
        this.ctx.beginPath();
        this.ctx.moveTo(base/2, base/2);
        this.ctx.lineTo(base/2 + depth, base/2 - depth);
        this.ctx.lineTo(depth, -height/2 - depth);
        this.ctx.lineTo(0, -height/2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawTorus(size) {
        const majorRadius = size * 0.8;
        const minorRadius = size * 0.3;
        
        // Dibujar toro como múltiples elipses
        this.ctx.globalAlpha = 0.7;
        
        for (let i = 0; i < 12; i++) {
            const angle = (i * 2 * Math.PI) / 12;
            const x = majorRadius * Math.cos(angle) * 0.5;
            const y = majorRadius * Math.sin(angle) * 0.2;
            
            this.ctx.strokeStyle = this.lightenColor(this.color, i * 3);
            this.ctx.lineWidth = minorRadius * 0.3;
            this.ctx.beginPath();
            this.ctx.ellipse(x, y, minorRadius, minorRadius * 0.3, angle, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1;
        this.ctx.lineWidth = 3;
    }
    
    // Métodos para poliedros (versiones simplificadas)
    drawTetrahedron(size) {
        const h = size * 0.816;
        
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -h/2);
        this.ctx.lineTo(-size/2, h/3);
        this.ctx.lineTo(size/2, h/3);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Cara posterior
        this.ctx.fillStyle = this.darkenColor(this.color, 20);
        this.ctx.beginPath();
        this.ctx.moveTo(size/2, h/3);
        this.ctx.lineTo(size * 0.25, h/3 - size * 0.25);
        this.ctx.lineTo(0, -h/2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawOctahedron(size) {
        const s = size * 0.7;
        
        // Cara frontal
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -s);
        this.ctx.lineTo(-s/2, 0);
        this.ctx.lineTo(0, s);
        this.ctx.lineTo(s/2, 0);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Caras laterales
        this.ctx.fillStyle = this.lightenColor(this.color, 15);
        this.ctx.beginPath();
        this.ctx.moveTo(s/2, 0);
        this.ctx.lineTo(s, -s/2);
        this.ctx.lineTo(s/2, -s);
        this.ctx.lineTo(0, -s);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawDodecahedron(size) {
        // Representación simplificada como dodecágono
        this.drawPolygon(12, size * 0.8);
        
        // Añadir profundidad
        const offset = size * 0.2;
        this.ctx.fillStyle = this.darkenColor(this.color, 20);
        this.ctx.strokeStyle = this.darkenColor(this.color, 30);
        
        for (let i = 0; i < 12; i += 2) {
            const angle1 = (i * 2 * Math.PI) / 12 - Math.PI / 2;
            const angle2 = ((i + 2) * 2 * Math.PI) / 12 - Math.PI / 2;
            
            const x1 = size * 0.8 * Math.cos(angle1);
            const y1 = size * 0.8 * Math.sin(angle1);
            const x2 = size * 0.8 * Math.cos(angle2);
            const y2 = size * 0.8 * Math.sin(angle2);
            
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x1 + offset, y1 - offset);
            this.ctx.lineTo(x2 + offset, y2 - offset);
            this.ctx.lineTo(x2, y2);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }
    }
    
    drawIcosahedron(size) {
        // Representación como triángulos entrelazados
        const s = size * 0.6;
        
        // Triángulo frontal
        this.ctx.fillStyle = this.color;
        this.drawTriangle(s * 1.2);
        
        // Triángulos laterales
        this.ctx.fillStyle = this.lightenColor(this.color, 15);
        for (let i = 0; i < 3; i++) {
            const angle = (i * 2 * Math.PI) / 3;
            const x = s * 0.4 * Math.cos(angle);
            const y = s * 0.4 * Math.sin(angle);
            
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(angle + Math.PI);
            this.ctx.scale(0.7, 0.7);
            this.drawTriangle(s);
            this.ctx.restore();
        }
    }
    
    drawTruncatedCube(size) {
        // Cubo con esquinas cortadas
        const s = size * 0.6;
        const cut = s * 0.2;
        
        this.ctx.fillStyle = this.color;
        
        // Octágono central
        const points = [];
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const radius = i % 2 === 0 ? s : s * 0.8;
            points.push({
                x: radius * Math.cos(angle),
                y: radius * Math.sin(angle)
            });
        }
        
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawRhombicuboctahedron(size) {
        // Forma compleja simplificada
        this.ctx.fillStyle = this.color;
        this.drawPolygon(8, size * 0.7);
        
        // Cuadrados en las esquinas
        this.ctx.fillStyle = this.lightenColor(this.color, 20);
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            const x = size * 0.5 * Math.cos(angle);
            const y = size * 0.5 * Math.sin(angle);
            
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(angle);
            this.ctx.fillRect(-size * 0.1, -size * 0.1, size * 0.2, size * 0.2);
            this.ctx.strokeRect(-size * 0.1, -size * 0.1, size * 0.2, size * 0.2);
            this.ctx.restore();
        }
    }
    
    drawStellaOctangula(size) {
        // Dos tetraedros entrelazados
        this.ctx.fillStyle = this.color;
        this.drawTetrahedron(size);
        
        this.ctx.fillStyle = this.lightenColor(this.color, 30);
        this.ctx.save();
        this.ctx.rotate(Math.PI);
        this.drawTetrahedron(size * 0.8);
        this.ctx.restore();
    }
    
    drawGeodesicSphere(size) {
        // Esfera geodésica simplificada
        const radius = size * 0.8;
        
        // Base esférica
        this.ctx.fillStyle = this.color;
        this.ctx.globalAlpha = 0.3;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.globalAlpha = 1;
        
        // Red geodésica
        this.ctx.strokeStyle = this.darkenColor(this.color, 30);
        this.ctx.lineWidth = 2;
        
        // Líneas horizontales
        for (let i = 1; i < 6; i++) {
            const y = (i - 3) * radius / 3;
            const r = Math.sqrt(radius * radius - y * y);
            this.ctx.beginPath();
            this.ctx.ellipse(0, y, r, r * 0.3, 0, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
        
        // Líneas verticales
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            this.ctx.beginPath();
            this.ctx.moveTo(
                radius * Math.cos(angle) * 0.2,
                -radius
            );
            this.ctx.quadraticCurveTo(
                radius * Math.cos(angle),
                0,
                radius * Math.cos(angle) * 0.2,
                radius
            );
            this.ctx.stroke();
        }
    }
    
    // Funciones de utilidad para colores
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
            (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
            (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
    }
    
    
    async updateProperties() {
        if (!this.currentFigure) return;
        
        const properties = document.getElementById('figure-properties');
        const calculatedProps = this.calculateProperties(this.currentFigure);
        properties.innerHTML = calculatedProps;
        
        // Re-renderizar MathJax en las propiedades actualizadas
        if (this.mathJax && this.mathJax.isMathjaxReady()) {
            try {
                await this.mathJax.render(properties);
            } catch (error) {
                console.warn('Error re-renderizando MathJax en propiedades:', error);
            }
        }
    }
    
    // Mostrar información de la figura
    async showFigureInfo(figure) {
        const infoPanel = document.getElementById('info-panel');
        const title = document.getElementById('figure-title');
        const formulas = document.getElementById('figure-formulas');
        const properties = document.getElementById('figure-properties');
        
        const figureData = this.getFigureData(figure);
        
        title.textContent = figureData.name;
        formulas.innerHTML = figureData.formulas;
        
        // Calcular propiedades con valores actuales
        const calculatedProps = this.calculateProperties(figure);
        properties.innerHTML = calculatedProps;
        
        infoPanel.style.display = 'block';
        
        // Renderizar fórmulas con MathJax
        if (this.mathJax && this.mathJax.isMathjaxReady()) {
            try {
                await this.mathJax.render(formulas);
                await this.mathJax.render(properties);
            } catch (error) {
                console.warn('Error renderizando MathJax:', error);
            }
        }
    }
    
    getFigureData(figure) {
        const data = {
            // Figuras 2D
            circle: {
                name: 'Círculo',
                formulas: `
                    <div class="formula-item">Área: $A = \\pi r^2$</div>
                    <div class="formula-item">Perímetro: $P = 2\\pi r$</div>
                    <div class="formula-item">Diámetro: $d = 2r$</div>
                    <div class="formula-item">Circunferencia: $C = \\pi d$</div>
                `
            },
            triangle: {
                name: 'Triángulo Equilátero',
                formulas: `
                    <div class="formula-item">Área: $A = \\frac{\\sqrt{3}}{4} a^2$</div>
                    <div class="formula-item">Perímetro: $P = 3a$</div>
                    <div class="formula-item">Altura: $h = \\frac{\\sqrt{3}}{2} a$</div>
                    <div class="formula-item">Radio inscrito: $r = \\frac{a\\sqrt{3}}{6}$</div>
                `
            },
            square: {
                name: 'Cuadrado',
                formulas: `
                    <div class="formula-item">Área: $A = a^2$</div>
                    <div class="formula-item">Perímetro: $P = 4a$</div>
                    <div class="formula-item">Diagonal: $d = a\\sqrt{2}$</div>
                    <div class="formula-item">Radio circunscrito: $R = \\frac{a\\sqrt{2}}{2}$</div>
                `
            },
            rectangle: {
                name: 'Rectángulo',
                formulas: `
                    <div class="formula-item">Área: $A = a \\times b$</div>
                    <div class="formula-item">Perímetro: $P = 2(a + b)$</div>
                    <div class="formula-item">Diagonal: $d = \\sqrt{a^2 + b^2}$</div>
                    <div class="formula-item">Aspecto: $r = \\frac{a}{b}$</div>
                `
            },
            pentagon: {
                name: 'Pentágono Regular',
                formulas: `
                    <div class="formula-item">Área: $A = \\frac{5}{4} a^2 \\cot\\left(\\frac{\\pi}{5}\\right)$</div>
                    <div class="formula-item">Perímetro: $P = 5a$</div>
                    <div class="formula-item">Apotema: $ap = \\frac{a}{2\\tan\\left(\\frac{\\pi}{5}\\right)}$</div>
                    <div class="formula-item">Radio: $R = \\frac{a}{2\\sin\\left(\\frac{\\pi}{5}\\right)}$</div>
                `
            },
            hexagon: {
                name: 'Hexágono Regular',
                formulas: `
                    <div class="formula-item">Área: $A = \\frac{3\\sqrt{3}}{2} a^2$</div>
                    <div class="formula-item">Perímetro: $P = 6a$</div>
                    <div class="formula-item">Apotema: $ap = \\frac{a\\sqrt{3}}{2}$</div>
                    <div class="formula-item">Radio: $R = a$</div>
                `
            },
            octagon: {
                name: 'Octágono Regular',
                formulas: `
                    <div class="formula-item">Área: $A = 2(1 + \\sqrt{2}) a^2$</div>
                    <div class="formula-item">Perímetro: $P = 8a$</div>
                    <div class="formula-item">Apotema: $ap = a\\frac{1 + \\sqrt{2}}{2}$</div>
                    <div class="formula-item">Radio: $R = \\frac{a}{2\\sin\\left(\\frac{\\pi}{8}\\right)}$</div>
                `
            },
            star: {
                name: 'Estrella de 5 Puntas',
                formulas: `
                    <div class="formula-item">Estrella pentagonal regular</div>
                    <div class="formula-item">Relación áurea: $\\phi = \\frac{1 + \\sqrt{5}}{2}$</div>
                    <div class="formula-item">Ángulo interno: $36°$</div>
                    <div class="formula-item">Simetría: $5$ ejes de reflexión</div>
                `
            },
            
            // Figuras 3D
            sphere: {
                name: 'Esfera',
                formulas: `
                    <div class="formula-item">Volumen: $V = \\frac{4}{3}\\pi r^3$</div>
                    <div class="formula-item">Superficie: $S = 4\\pi r^2$</div>
                    <div class="formula-item">Diámetro: $d = 2r$</div>
                    <div class="formula-item">Área gran círculo: $A = \\pi r^2$</div>
                `
            },
            cube: {
                name: 'Cubo',
                formulas: `
                    <div class="formula-item">Volumen: $V = a^3$</div>
                    <div class="formula-item">Superficie: $S = 6a^2$</div>
                    <div class="formula-item">Diagonal espacial: $d = a\\sqrt{3}$</div>
                    <div class="formula-item">Diagonal cara: $d_f = a\\sqrt{2}$</div>
                `
            },
            cylinder: {
                name: 'Cilindro',
                formulas: `
                    <div class="formula-item">Volumen: $V = \\pi r^2 h$</div>
                    <div class="formula-item">Superficie: $S = 2\\pi r(r + h)$</div>
                    <div class="formula-item">Área lateral: $A_L = 2\\pi rh$</div>
                    <div class="formula-item">Área bases: $A_B = 2\\pi r^2$</div>
                `
            },
            cone: {
                name: 'Cono',
                formulas: `
                    <div class="formula-item">Volumen: $V = \\frac{1}{3}\\pi r^2 h$</div>
                    <div class="formula-item">Superficie: $S = \\pi r(r + l)$</div>
                    <div class="formula-item">Área lateral: $A_L = \\pi rl$</div>
                    <div class="formula-item">Generatriz: $l = \\sqrt{r^2 + h^2}$</div>
                `
            },
            'triangular-prism': {
                name: 'Prisma Triangular',
                formulas: `
                    <div class="formula-item">Volumen: $V = A_{base} \\times h$</div>
                    <div class="formula-item">Superficie: $S = 2A_{base} + P_{base} \\times h$</div>
                    <div class="formula-item">Área base: $A_{base} = \\frac{\\sqrt{3}}{4}a^2$</div>
                    <div class="formula-item">Perímetro base: $P_{base} = 3a$</div>
                `
            },
            'hexagonal-prism': {
                name: 'Prisma Hexagonal',
                formulas: `
                    <div class="formula-item">Volumen: $V = A_{base} \\times h$</div>
                    <div class="formula-item">Superficie: $S = 2A_{base} + P_{base} \\times h$</div>
                    <div class="formula-item">Área base: $A_{base} = \\frac{3\\sqrt{3}}{2}a^2$</div>
                    <div class="formula-item">Perímetro base: $P_{base} = 6a$</div>
                `
            },
            pyramid: {
                name: 'Pirámide Cuadrada',
                formulas: `
                    <div class="formula-item">Volumen: $V = \\frac{1}{3}a^2 h$</div>
                    <div class="formula-item">Superficie: $S = a^2 + 2a\\sqrt{\\frac{a^2}{4} + h^2}$</div>
                    <div class="formula-item">Área base: $A_{base} = a^2$</div>
                    <div class="formula-item">Apotema: $ap = \\sqrt{\\frac{a^2}{4} + h^2}$</div>
                `
            },
            torus: {
                name: 'Toro',
                formulas: `
                    <div class="formula-item">Volumen: $V = 2\\pi^2 R r^2$</div>
                    <div class="formula-item">Superficie: $S = 4\\pi^2 R r$</div>
                    <div class="formula-item">Radio mayor: $R$</div>
                    <div class="formula-item">Radio menor: $r$</div>
                `
            },
            
            // Poliedros
            tetrahedron: {
                name: 'Tetraedro Regular',
                formulas: `
                    <div class="formula-item">Volumen: $V = \\frac{\\sqrt{2}}{12} a^3$</div>
                    <div class="formula-item">Superficie: $S = \\sqrt{3} a^2$</div>
                    <div class="formula-item">Altura: $h = \\sqrt{\\frac{2}{3}} a$</div>
                    <div class="formula-item">Radio inscrito: $r = \\frac{a}{2\\sqrt{6}}$</div>
                `
            },
            octahedron: {
                name: 'Octaedro Regular',
                formulas: `
                    <div class="formula-item">Volumen: $V = \\frac{\\sqrt{2}}{3} a^3$</div>
                    <div class="formula-item">Superficie: $S = 2\\sqrt{3} a^2$</div>
                    <div class="formula-item">Radio circunscrito: $R = \\frac{a}{\\sqrt{2}}$</div>
                    <div class="formula-item">Radio inscrito: $r = \\frac{a}{\\sqrt{6}}$</div>
                `
            },
            dodecahedron: {
                name: 'Dodecaedro Regular',
                formulas: `
                    <div class="formula-item">Volumen: $V = \\frac{15 + 7\\sqrt{5}}{4} a^3$</div>
                    <div class="formula-item">Superficie: $S = 3\\sqrt{25 + 10\\sqrt{5}} a^2$</div>
                    <div class="formula-item">Caras: $12$ pentágonos</div>
                    <div class="formula-item">Vértices: $20$, Aristas: $30$</div>
                `
            },
            icosahedron: {
                name: 'Icosaedro Regular',
                formulas: `
                    <div class="formula-item">Volumen: $V = \\frac{5(3 + \\sqrt{5})}{12} a^3$</div>
                    <div class="formula-item">Superficie: $S = 5\\sqrt{3} a^2$</div>
                    <div class="formula-item">Caras: $20$ triángulos</div>
                    <div class="formula-item">Vértices: $12$, Aristas: $30$</div>
                `
            },
            'truncated-cube': {
                name: 'Cubo Truncado',
                formulas: `
                    <div class="formula-item">Volumen: $V = (21 + 14\\sqrt{2}) a^3$</div>
                    <div class="formula-item">Superficie: $S = 2(6 + 6\\sqrt{2} + \\sqrt{3}) a^2$</div>
                    <div class="formula-item">Caras: $8$ triángulos + $6$ octágonos</div>
                    <div class="formula-item">Vértices: $24$, Aristas: $36$</div>
                `
            },
            rhombicuboctahedron: {
                name: 'Rombicuboctaedro',
                formulas: `
                    <div class="formula-item">Volumen: $V = (12 + 18\\sqrt{2}) a^3$</div>
                    <div class="formula-item">Superficie: $S = 2(6 + \\sqrt{3}) a^2$</div>
                    <div class="formula-item">Caras: $8$ triángulos + $18$ cuadrados</div>
                    <div class="formula-item">Vértices: $24$, Aristas: $48$</div>
                `
            },
            'stella-octangula': {
                name: 'Stella Octangula',
                formulas: `
                    <div class="formula-item">Compuesto de $2$ tetraedros</div>
                    <div class="formula-item">Volumen: $V = 2 \\times \\frac{\\sqrt{2}}{12} a^3$</div>
                    <div class="formula-item">Intersección: Octaedro regular</div>
                    <div class="formula-item">Simetría: Grupo octaédrico</div>
                `
            },
            geodesic: {
                name: 'Esfera Geodésica',
                formulas: `
                    <div class="formula-item">Aproximación esférica poliédrica</div>
                    <div class="formula-item">Volumen: $V \\approx \\frac{4}{3}\\pi r^3$</div>
                    <div class="formula-item">Superficie: $S \\approx 4\\pi r^2$</div>
                    <div class="formula-item">Frecuencia: $f$ (subdivisiones)</div>
                `
            }
        };
        
        return data[figure] || { name: 'Figura', formulas: '<div class="formula-item">Información no disponible</div>' };
    }
    
    calculateProperties(figure) {
        const size = this.size;
        let props = '';
        
        if (['circle'].includes(figure)) {
            const radius = size;
            const area = Math.PI * radius * radius;
            const perimeter = 2 * Math.PI * radius;
            props = `
                <div class="property">
                    <div class="label">Radio ($r$)</div>
                    <div class="value">${radius.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Área ($A$)</div>
                    <div class="value">${area.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Perímetro ($P$)</div>
                    <div class="value">${perimeter.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Diámetro ($d$)</div>
                    <div class="value">${(radius * 2).toFixed(1)}</div>
                </div>
            `;
        } else if (['square'].includes(figure)) {
            const side = size;
            const area = side * side;
            const perimeter = 4 * side;
            const diagonal = side * Math.sqrt(2);
            props = `
                <div class="property">
                    <div class="label">Lado ($a$)</div>
                    <div class="value">${side.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Área ($A$)</div>
                    <div class="value">${area.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Perímetro ($P$)</div>
                    <div class="value">${perimeter.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Diagonal ($d$)</div>
                    <div class="value">${diagonal.toFixed(1)}</div>
                </div>
            `;
        } else if (['triangle'].includes(figure)) {
            const side = size;
            const area = (Math.sqrt(3) / 4) * side * side;
            const perimeter = 3 * side;
            const height = (Math.sqrt(3) / 2) * side;
            props = `
                <div class="property">
                    <div class="label">Lado ($a$)</div>
                    <div class="value">${side.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Área ($A$)</div>
                    <div class="value">${area.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Perímetro ($P$)</div>
                    <div class="value">${perimeter.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Altura ($h$)</div>
                    <div class="value">${height.toFixed(1)}</div>
                </div>
            `;
        } else if (['sphere'].includes(figure)) {
            const radius = size;
            const volume = (4/3) * Math.PI * radius * radius * radius;
            const surface = 4 * Math.PI * radius * radius;
            props = `
                <div class="property">
                    <div class="label">Radio ($r$)</div>
                    <div class="value">${radius.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Volumen ($V$)</div>
                    <div class="value">${volume.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Superficie ($S$)</div>
                    <div class="value">${surface.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Diámetro ($d$)</div>
                    <div class="value">${(radius * 2).toFixed(1)}</div>
                </div>
            `;
        } else if (['cube'].includes(figure)) {
            const side = size;
            const volume = side * side * side;
            const surface = 6 * side * side;
            const diagonal = side * Math.sqrt(3);
            props = `
                <div class="property">
                    <div class="label">Arista ($a$)</div>
                    <div class="value">${side.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Volumen ($V$)</div>
                    <div class="value">${volume.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Superficie ($S$)</div>
                    <div class="value">${surface.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Diagonal ($d$)</div>
                    <div class="value">${diagonal.toFixed(1)}</div>
                </div>
            `;
        } else if (['hexagon'].includes(figure)) {
            const side = size * 0.8; // Ajustado al tamaño visual
            const area = (3 * Math.sqrt(3) / 2) * side * side;
            const perimeter = 6 * side;
            const apothem = (side * Math.sqrt(3)) / 2;
            props = `
                <div class="property">
                    <div class="label">Lado ($a$)</div>
                    <div class="value">${side.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Área ($A$)</div>
                    <div class="value">${area.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Perímetro ($P$)</div>
                    <div class="value">${perimeter.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Apotema ($ap$)</div>
                    <div class="value">${apothem.toFixed(1)}</div>
                </div>
            `;
        } else if (['cylinder'].includes(figure)) {
            const radius = size;
            const height = size * 1.5;
            const volume = Math.PI * radius * radius * height;
            const surface = 2 * Math.PI * radius * (radius + height);
            props = `
                <div class="property">
                    <div class="label">Radio ($r$)</div>
                    <div class="value">${radius.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Altura ($h$)</div>
                    <div class="value">${height.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Volumen ($V$)</div>
                    <div class="value">${volume.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Superficie ($S$)</div>
                    <div class="value">${surface.toFixed(1)}</div>
                </div>
            `;
        } else {
            props = `
                <div class="property">
                    <div class="label">Tamaño</div>
                    <div class="value">${size.toFixed(1)}</div>
                </div>
                <div class="property">
                    <div class="label">Rotación</div>
                    <div class="value">${this.rotation}°</div>
                </div>
                <div class="property">
                    <div class="label">Color</div>
                    <div class="value" style="background: ${this.color}; width: 20px; height: 20px; border-radius: 50%; border: 1px solid #ccc;"></div>
                </div>
                <div class="property">
                    <div class="label">Tipo</div>
                    <div class="value">${this.currentTab.toUpperCase()}</div>
                </div>
            `;
        }
        
        return props;
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('🚀 Iniciando GeoExplorer...');
        const geoExplorer = new GeoExplorer();
        
        // Hacer accesible globalmente para debugging
        window.geoExplorer = geoExplorer;
        
        console.log('✅ GeoExplorer iniciado correctamente');
    } catch (error) {
        console.error('❌ Error iniciando GeoExplorer:', error);
    }
});