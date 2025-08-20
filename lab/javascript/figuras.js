import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class GeoExplorer {
    constructor() {
        this.canvasContainer = document.getElementById('main-canvas');
        this.currentFigure = null;
        this.currentTab = '2d';
        this.animationId = null;
        this.size = 100;
        this.rotation = 0;
        this.color = '#4c51bf';
        this.time = 0;
        this.mathJax = null;
        this.fractalDepth = 4;

        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.controls = null;
        this.current3DObject = null;
        this.is3DMode = false;
        
        this.canvas2D = document.createElement('canvas');
        this.ctx = this.canvas2D.getContext('2d');
        
        this.setupEventListeners();
        this.initializeMathJax();
        this.setupScene();
        this.switchTab('2d');
    }
    
    async initializeMathJax() {
        try {
            this.mathJax = new MathJaxModule({
                useInlineMath: true,
                useDisplayMath: true,
                enableDebugLogs: false
            });
            await this.mathJax.initialize();
        } catch (error) {
            console.warn('⚠️ Error al inicializar MathJax:', error);
        }
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xfafafa);
        
        this.camera = new THREE.PerspectiveCamera(75, this.canvasContainer.clientWidth / this.canvasContainer.clientHeight, 0.1, 1000);
        this.camera.position.z = 200;
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 10, 7.5);
        this.scene.add(directionalLight);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 50;
        this.controls.maxDistance = 500;

        this.canvasContainer.appendChild(this.canvas2D);
        
        const resize = () => {
            const rect = this.canvasContainer.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            
            this.canvas2D.width = width;
            this.canvas2D.height = height;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
            
            this.redraw();
        };
        
        new ResizeObserver(resize).observe(this.canvasContainer);
        resize();
    }
    
    setupEventListeners() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        document.querySelectorAll('.figure-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectFigure(e.target.dataset.figure));
        });
        
        document.getElementById('size-slider').addEventListener('input', (e) => {
            this.size = parseInt(e.target.value);
            this.updateProperties();
        });
        
        document.getElementById('rotation-slider').addEventListener('input', (e) => {
            this.rotation = parseInt(e.target.value);
            this.updateProperties();
        });
        
        document.getElementById('color-picker').addEventListener('input', (e) => {
            this.color = e.target.value;
            this.updateProperties();
        });

        document.getElementById('depth-slider').addEventListener('input', (e) => {
            this.fractalDepth = parseInt(e.target.value);
            this.redraw();
            this.updateProperties();
        });
    }
    
    switchTab(tabName) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        document.querySelectorAll('.figure-section').forEach(section => section.classList.remove('active'));
        document.getElementById(`section-${tabName}`).classList.add('active');
        
        this.currentTab = tabName;
        this.currentFigure = null;
        this.is3DMode = (tabName === '3d' || tabName === 'polyhedra');

        const fractalControls = document.getElementById('fractal-controls');
        const rotationControl = document.getElementById('rotation-control');

        if (tabName === 'fractals') {
            fractalControls.style.display = 'block';
            rotationControl.style.display = 'none';
        } else {
            fractalControls.style.display = 'none';
            rotationControl.style.display = 'block';
        }

        if (this.current3DObject) {
            this.scene.remove(this.current3DObject);
            this.current3DObject = null;
        }
        
        if (this.is3DMode) {
            if (!this.renderer.domElement.parentNode) {
                this.canvasContainer.appendChild(this.renderer.domElement);
            }
            this.renderer.domElement.style.display = 'block';
            this.canvas2D.style.display = 'none';
        } else {
            this.renderer.domElement.style.display = 'none';
            this.canvas2D.style.display = 'block';
        }
        
        document.querySelectorAll('.figure-btn').forEach(btn => btn.classList.remove('active'));
        
        this.showWelcomeMessage();
        this.startAnimation();
    }

    selectFigure(figureName) {
        document.querySelectorAll('.figure-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-figure="${figureName}"]`)?.classList.add('active');
        
        this.currentFigure = figureName;
        
        if (this.current3DObject) {
            this.scene.remove(this.current3DObject);
        }

        if (this.is3DMode) {
            const geometry = this.get3DGeometry(figureName);
            const material = new THREE.MeshStandardMaterial({ 
                color: this.color,
                roughness: 0.5,
                metalness: 0.1 
            });
            this.current3DObject = new THREE.Mesh(geometry, material);
            this.scene.add(this.current3DObject);
            this.update3DObjectProperties();
        } else {
            this.redraw(); // Redibuja para 2D y fractales
        }
        
        this.showFigureInfo(figureName);
        this.startAnimation();
    }

    showWelcomeMessage() {
        if (this.is3DMode) {
            if (this.current3DObject) this.scene.remove(this.current3DObject);
        } else if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas2D.width, this.canvas2D.height);
            const centerX = this.canvas2D.width / 2;
            const centerY = this.canvas2D.height / 2;
            const baseFontSize = Math.min(this.canvas2D.width, this.canvas2D.height) / 20;
            this.ctx.fillStyle = '#667eea';
            this.ctx.font = `bold ${Math.max(16, baseFontSize)}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Selecciona una figura para comenzar', centerX, centerY);
        }
        document.getElementById('info-panel').style.display = 'none';
    }
    
    startAnimation() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.animate();
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (this.is3DMode) {
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        } else if (this.currentTab === '2d') { // La animación de tiempo solo para 2D
            this.time += 0.02;
            this.redraw();
        }
    }
    
    redraw() {
        if (this.is3DMode || !this.ctx || !this.currentFigure) return;
        
        this.ctx.clearRect(0, 0, this.canvas2D.width, this.canvas2D.height);
        const centerX = this.canvas2D.width / 2;
        const centerY = this.canvas2D.height / 2;
        
        const canvasSize = Math.min(this.canvas2D.width, this.canvas2D.height);
        const scaleFactor = Math.max(0.5, canvasSize / 400);
        const adjustedSize = this.size * scaleFactor * 0.8;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        
        if (this.currentTab === '2d') {
            this.ctx.rotate((this.rotation * Math.PI / 180) + Math.sin(this.time) * 0.1);
        }
        
        const originalSize = this.size;
        this.size = adjustedSize;
        
        this.drawFigure(this.currentFigure);
        
        this.size = originalSize;
        this.ctx.restore();
    }
    
    update3DObjectProperties() {
        if (!this.current3DObject) return;
        
        this.current3DObject.material.color.set(this.color);
        const scale = this.size / 100;
        this.current3DObject.scale.set(scale, scale, scale);
        const rotRad = this.rotation * (Math.PI / 180);
        this.current3DObject.rotation.set(0, rotRad, 0);
    }
    
    get3DGeometry(figure) {
        const size = 80;
        switch (figure) {
            case 'sphere': return new THREE.SphereGeometry(size * 0.8, 32, 16);
            case 'cube': return new THREE.BoxGeometry(size, size, size);
            case 'cylinder': return new THREE.CylinderGeometry(size * 0.6, size * 0.6, size * 1.5, 32);
            case 'cone': return new THREE.ConeGeometry(size * 0.7, size * 1.5, 32);
            case 'torus': return new THREE.TorusGeometry(size * 0.7, size * 0.25, 16, 100);
            case 'tetrahedron': return new THREE.TetrahedronGeometry(size);
            case 'octahedron': return new THREE.OctahedronGeometry(size);
            case 'dodecahedron': return new THREE.DodecahedronGeometry(size);
            case 'icosahedron': return new THREE.IcosahedronGeometry(size);
            case 'pyramid': return new THREE.ConeGeometry(size, size * 1.2, 4);
            case 'triangular-prism': return new THREE.CylinderGeometry(size * 0.8, size * 0.8, size * 1.2, 3);
            case 'hexagonal-prism': return new THREE.CylinderGeometry(size * 0.8, size * 0.8, size * 1.5, 6);
            default: return new THREE.BoxGeometry(size, size, size);
        }
    }
    
    drawFigure(figure) {
        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = this.darkenColor(this.color, 20);
        this.ctx.lineWidth = 1.5;
        
        switch (figure) {
            case 'circle': this.drawCircle(this.size); break;
            case 'triangle': this.drawTriangle(this.size); break;
            case 'square': this.drawSquare(this.size); break;
            case 'rectangle': this.drawRectangle(this.size * 1.5, this.size); break;
            case 'pentagon': this.drawPolygon(5, this.size); break;
            case 'hexagon': this.drawPolygon(6, this.size); break;
            case 'octagon': this.drawPolygon(8, this.size); break;
            case 'star': this.drawStar(5, this.size * 0.5, this.size); break;
            case 'sierpinski': this.drawSierpinski(); break;
            case 'koch': this.drawKochCurve(); break;
        }
    }
    
    drawCircle(radius) { this.ctx.beginPath(); this.ctx.arc(0, 0, radius, 0, 2 * Math.PI); this.ctx.fill(); this.ctx.stroke(); }
    drawTriangle(size) { this.ctx.beginPath(); const h = size * Math.sqrt(3) / 2; this.ctx.moveTo(0, -h / 2); this.ctx.lineTo(-size / 2, h / 2); this.ctx.lineTo(size / 2, h / 2); this.ctx.closePath(); this.ctx.fill(); this.ctx.stroke(); }
    drawSquare(size) { this.ctx.fillRect(-size / 2, -size / 2, size, size); this.ctx.strokeRect(-size / 2, -size / 2, size, size); }
    drawRectangle(width, height) { this.ctx.fillRect(-width / 2, -height / 2, width, height); this.ctx.strokeRect(-width / 2, -height / 2, width, height); }
    drawPolygon(sides, radius) { this.ctx.beginPath(); for (let i = 0; i < sides; i++) { const a = (i * 2 * Math.PI) / sides - Math.PI / 2; const x = radius * Math.cos(a); const y = radius * Math.sin(a); if (i === 0) this.ctx.moveTo(x, y); else this.ctx.lineTo(x, y); } this.ctx.closePath(); this.ctx.fill(); this.ctx.stroke(); }
    drawStar(points, innerRadius, outerRadius) { this.ctx.beginPath(); for (let i = 0; i < points * 2; i++) { const a = (i * Math.PI) / points - Math.PI / 2; const r = i % 2 === 0 ? outerRadius : innerRadius; const x = r * Math.cos(a); const y = r * Math.sin(a); if (i === 0) this.ctx.moveTo(x, y); else this.ctx.lineTo(x, y); } this.ctx.closePath(); this.ctx.fill(); this.ctx.stroke(); }
    
    drawSierpinski() { const size = this.size * 1.8; const h = size * (Math.sqrt(3) / 2); this.sierpinskiRecursive({ x: 0, y: -h / 2 }, { x: -size / 2, y: h / 2 }, { x: size / 2, y: h / 2 }, this.fractalDepth); }
    sierpinskiRecursive(p1, p2, p3, depth) { if (depth === 0) { this.ctx.beginPath(); this.ctx.moveTo(p1.x, p1.y); this.ctx.lineTo(p2.x, p2.y); this.ctx.lineTo(p3.x, p3.y); this.ctx.closePath(); this.ctx.fill(); return; } const m12 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }; const m23 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 }; const m31 = { x: (p3.x + p1.x) / 2, y: (p3.y + p1.y) / 2 }; this.sierpinskiRecursive(p1, m12, m31, depth - 1); this.sierpinskiRecursive(m12, p2, m23, depth - 1); this.sierpinskiRecursive(m31, m23, p3, depth - 1); }
    drawKochCurve() { const size = this.size * 1.6; const yOff = this.size * 0.3; const p1 = { x: 0, y: -size * Math.sqrt(3) / 3 + yOff }; const p2 = { x: -size / 2, y: size * Math.sqrt(3) / 6 + yOff }; const p3 = { x: size / 2, y: size * Math.sqrt(3) / 6 + yOff }; this.ctx.beginPath(); this.ctx.moveTo(p1.x, p1.y); this.kochRecursive(p1, p2, this.fractalDepth); this.kochRecursive(p2, p3, this.fractalDepth); this.kochRecursive(p3, p1, this.fractalDepth); this.ctx.closePath(); this.ctx.fill(); this.ctx.stroke(); }
    kochRecursive(p1, p2, depth) { if (depth === 0) { this.ctx.lineTo(p2.x, p2.y); return; } const dx = p2.x - p1.x; const dy = p2.y - p1.y; const pA = { x: p1.x + dx / 3, y: p1.y + dy / 3 }; const pB = { x: p1.x + 2 * dx / 3, y: p1.y + 2 * dy / 3 }; const a = -Math.PI / 3; const pC = { x: pA.x + (pB.x - pA.x) * Math.cos(a) - (pB.y - pA.y) * Math.sin(a), y: pA.y + (pB.x - pA.x) * Math.sin(a) + (pB.y - pA.y) * Math.cos(a) }; this.kochRecursive(p1, pA, depth - 1); this.kochRecursive(pA, pC, depth - 1); this.kochRecursive(pC, pB, depth - 1); this.kochRecursive(pB, p2, depth - 1); }

    darkenColor(color, percent) { const num = parseInt(color.slice(1), 16), amt = Math.round(2.55 * percent), R = (num >> 16) - amt, G = (num >> 8 & 0x00FF) - amt, B = (num & 0x0000FF) - amt; return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1); }
    
    async updateProperties() {
        if (this.is3DMode) {
            this.update3DObjectProperties();
        } else {
            this.redraw();
        }
        
        if (!this.currentFigure) return;
        
        const properties = document.getElementById('figure-properties');
        properties.innerHTML = this.calculateProperties(this.currentFigure);
        
        if (this.mathJax && this.mathJax.isMathjaxReady()) {
            await this.mathJax.render(properties);
        }
    }
    
    async showFigureInfo(figure) {
        const infoPanel = document.getElementById('info-panel');
        const figureData = this.getFigureData(figure);
        
        document.getElementById('figure-title').textContent = figureData.name;
        document.getElementById('figure-formulas').innerHTML = figureData.formulas;
        
        infoPanel.style.display = 'block';
        await this.updateProperties();
        
        if (this.mathJax && this.mathJax.isMathjaxReady()) {
            await this.mathJax.render(infoPanel);
        }
    }
    
    getFigureData(figure) {
        const data = {
            circle: { name: 'Círculo', formulas: `<div class="formula-item">Área: $A = \\pi r^2$</div><div class="formula-item">Perímetro: $P = 2\\pi r$</div>` },
            triangle: { name: 'Triángulo Equilátero', formulas: `<div class="formula-item">Área: $A = \\frac{\\sqrt{3}}{4} a^2$</div><div class="formula-item">Perímetro: $P = 3a$</div>` },
            square: { name: 'Cuadrado', formulas: `<div class="formula-item">Área: $A = a^2$</div><div class="formula-item">Perímetro: $P = 4a$</div>` },
            rectangle: { name: 'Rectángulo', formulas: `<div class="formula-item">Área: $A = a \\times b$</div><div class="formula-item">Perímetro: $P = 2(a + b)$</div>` },
            pentagon: { name: 'Pentágono Regular', formulas: `<div class="formula-item">Área: $A = \\frac{5}{4} a^2 \\cot(\\frac{\\pi}{5})$</div><div class="formula-item">Perímetro: $P = 5a$</div>` },
            hexagon: { name: 'Hexágono Regular', formulas: `<div class="formula-item">Área: $A = \\frac{3\\sqrt{3}}{2} a^2$</div><div class="formula-item">Perímetro: $P = 6a$</div>` },
            octagon: { name: 'Octágono Regular', formulas: `<div class="formula-item">Área: $A = 2(1 + \\sqrt{2}) a^2$</div><div class="formula-item">Perímetro: $P = 8a$</div>` },
            star: { name: 'Estrella de 5 Puntas', formulas: `<div class="formula-item">Relación áurea: $\\phi$</div><div class="formula-item">Ángulo interno: $36°$</div>` },
            sphere: { name: 'Esfera', formulas: `<div class="formula-item">Volumen: $V = \\frac{4}{3}\\pi r^3$</div><div class="formula-item">Superficie: $S = 4\\pi r^2$</div>` },
            cube: { name: 'Cubo', formulas: `<div class="formula-item">Volumen: $V = a^3$</div><div class="formula-item">Superficie: $S = 6a^2$</div>` },
            cylinder: { name: 'Cilindro', formulas: `<div class="formula-item">Volumen: $V = \\pi r^2 h$</div><div class="formula-item">Superficie: $S = 2\\pi r(r + h)$</div>` },
            cone: { name: 'Cono', formulas: `<div class="formula-item">Volumen: $V = \\frac{1}{3}\\pi r^2 h$</div><div class="formula-item">Superficie: $S = \\pi r(r + l)$</div>` },
            'triangular-prism': { name: 'Prisma Triangular', formulas: `<div class="formula-item">Volumen: $V = A_{base} \\times h$</div><div class="formula-item">Superficie: $S = 2A_{base} + P_{base}h$</div>` },
            'hexagonal-prism': { name: 'Prisma Hexagonal', formulas: `<div class="formula-item">Volumen: $V = A_{base} \\times h$</div><div class="formula-item">Superficie: $S = 2A_{base} + P_{base}h$</div>` },
            pyramid: { name: 'Pirámide Cuadrada', formulas: `<div class="formula-item">Volumen: $V = \\frac{1}{3}a^2 h$</div><div class="formula-item">Superficie: $S = a^2 + 2al$</div>` },
            torus: { name: 'Toro', formulas: `<div class="formula-item">Volumen: $V = 2\\pi^2 R r^2$</div><div class="formula-item">Superficie: $S = 4\\pi^2 R r$</div>` },
            tetrahedron: { name: 'Tetraedro Regular', formulas: `<div class="formula-item">Volumen: $V = \\frac{\\sqrt{2}}{12} a^3$</div><div class="formula-item">Superficie: $S = \\sqrt{3} a^2$</div>` },
            octahedron: { name: 'Octaedro Regular', formulas: `<div class="formula-item">Volumen: $V = \\frac{\\sqrt{2}}{3} a^3$</div><div class="formula-item">Superficie: $S = 2\\sqrt{3} a^2$</div>` },
            dodecahedron: { name: 'Dodecaedro Regular', formulas: `<div class="formula-item">Volumen: $V = \\frac{15+7\\sqrt{5}}{4} a^3$</div><div class="formula-item">Superficie: $S = 3\\sqrt{25+10\\sqrt{5}} a^2$</div>` },
            icosahedron: { name: 'Icosaedro Regular', formulas: `<div class="formula-item">Volumen: $V = \\frac{5(3+\\sqrt{5})}{12} a^3$</div><div class="formula-item">Superficie: $S = 5\\sqrt{3} a^2$</div>` },
            sierpinski: { name: 'Triángulo de Sierpinski', formulas: `<div class="formula-item">Dimensión Fractal: $D = \\frac{\\log(3)}{\\log(2)} \\approx 1.585$</div><div class="formula-item">Construcción: Auto-similaridad recursiva</div>` },
            koch: { name: 'Copo de Nieve de Koch', formulas: `<div class="formula-item">Dimensión Fractal: $D = \\frac{\\log(4)}{\\log(3)} \\approx 1.262$</div><div class="formula-item">Propiedad: Curva continua no diferenciable</div>` },
        };
        return data[figure] || { name: 'Figura', formulas: '' };
    }
    
    calculateProperties(figure) {
        const size = this.size;
        let props = '';
        const s = size * 0.8;
        
        if (this.currentTab === 'fractals') {
            const count = figure === 'sierpinski' ? Math.pow(3, this.fractalDepth) : 3 * Math.pow(4, this.fractalDepth);
            const label = figure === 'sierpinski' ? 'Triángulos' : 'Segmentos';
            props = `<div class="property"><div class="label">Iteraciones</div><div class="value">${this.fractalDepth}</div></div><div class="property"><div class="label">${label}</div><div class="value">${count}</div></div>`;
        } else {
            switch (figure) {
                case 'circle': props = `<div class="property"><div class="label">Área</div><div class="value">${(Math.PI * s * s).toFixed(1)}</div></div><div class="property"><div class="label">Perímetro</div><div class="value">${(2 * Math.PI * s).toFixed(1)}</div></div>`; break;
                case 'square': props = `<div class="property"><div class="label">Área</div><div class="value">${(s * s).toFixed(1)}</div></div><div class="property"><div class="label">Perímetro</div><div class="value">${(4 * s).toFixed(1)}</div></div>`; break;
                case 'cube': props = `<div class="property"><div class="label">Volumen</div><div class="value">${(s * s * s).toFixed(1)}</div></div><div class="property"><div class="label">Superficie</div><div class="value">${(6 * s * s).toFixed(1)}</div></div>`; break;
                case 'sphere': props = `<div class="property"><div class="label">Volumen</div><div class="value">${((4/3) * Math.PI * s*s*s).toFixed(1)}</div></div><div class="property"><div class="label">Superficie</div><div class="value">${(4 * Math.PI * s*s).toFixed(1)}</div></div>`; break;
                default: props = `<div class="property"><div class="label">Factor</div><div class="value">${size}</div></div><div class="property"><div class="label">Rotación</div><div class="value">${this.rotation}°</div></div>`;
            }
        }
        return props;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        window.geoExplorer = new GeoExplorer();
        console.log('✅ GeoExplorer con Fractales iniciado correctamente');
    } catch (error) {
        console.error('❌ Error iniciando GeoExplorer:', error);
    }
});
