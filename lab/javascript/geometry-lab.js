/**
 * Geometry Lab - Laboratorio de Figuras Geométricas
 * Módulo completo para crear y manipular figuras 2D, 3D y poliedros
 */

window.GeometryLab = (function() {
    'use strict';

    // Estado global del laboratorio
    const state = {
        currentTab: '2d',
        selectedShape: null,
        selectedTool: null,
        currentFigure: null,
        isAnimating: false,
        drawingPath: [],
        undoStack: []
    };

    // Configuración de colores y estilos
    const config = {
        colors: {
            primary: '#667eea',
            secondary: '#764ba2',
            accent: '#f093fb',
            success: '#4ecdc4',
            warning: '#ffe066',
            danger: '#ff6b6b'
        },
        animations: {
            duration: 1000,
            easing: 'easeInOutQuad'
        }
    };

    // Referencias a elementos DOM
    let elements = {};

    // Contextos de canvas y Three.js
    let contexts = {
        canvas2d: null,
        ctx2d: null,
        canvasCustom: null,
        ctxCustom: null,
        scene3d: null,
        camera3d: null,
        renderer3d: null,
        scenePolyhedra: null,
        cameraPolyhedra: null,
        rendererPolyhedra: null,
        controls3d: null,
        controlsPolyhedra: null
    };

    /**
     * Inicialización principal del laboratorio
     */
    function init() {
        console.log('🧮 Inicializando Geometry Lab...');
        
        try {
            initializeElements();
            initializeTabs();
            initialize2D();
            initialize3D();
            initializePolyhedra();
            initializeCustom();
            initializeEventListeners();
            
            console.log('✅ Geometry Lab inicializado correctamente');
        } catch (error) {
            console.error('❌ Error inicializando Geometry Lab:', error);
        }
    }

    /**
     * Inicializar referencias a elementos DOM
     */
    function initializeElements() {
        elements = {
            // Tabs
            tabButtons: document.querySelectorAll('.tab-btn'),
            tabContents: document.querySelectorAll('.tab-content'),
            
            // 2D Elements
            canvas2d: document.getElementById('canvas2d'),
            shapeButtons2d: document.querySelectorAll('#tab-2d .shape-btn'),
            size2d: document.getElementById('size2d'),
            rotation2d: document.getElementById('rotation2d'),
            fillColor: document.getElementById('fillColor'),
            strokeColor: document.getElementById('strokeColor'),
            clear2d: document.getElementById('clear2d'),
            save2d: document.getElementById('save2d'),
            
            // 3D Elements
            canvas3d: document.getElementById('canvas3d'),
            shapeButtons3d: document.querySelectorAll('#tab-3d .shape-btn'),
            scale3d: document.getElementById('scale3d'),
            rotationX: document.getElementById('rotationX'),
            rotationY: document.getElementById('rotationY'),
            color3d: document.getElementById('color3d'),
            reset3d: document.getElementById('reset3d'),
            animate3d: document.getElementById('animate3d'),
            
            // Polyhedra Elements
            canvasPolyhedra: document.getElementById('canvasPolyhedra'),
            shapeButtonsPolyhedra: document.querySelectorAll('#tab-polyhedra .shape-btn'),
            showWireframe: document.getElementById('showWireframe'),
            showVertices: document.getElementById('showVertices'),
            showEdges: document.getElementById('showEdges'),
            autoRotate: document.getElementById('autoRotate'),
            explodeView: document.getElementById('explodeView'),
            captureImage: document.getElementById('captureImage'),
            
            // Custom Elements
            canvasCustom: document.getElementById('canvasCustom'),
            toolButtons: document.querySelectorAll('#tab-custom .shape-btn'),
            lineWidth: document.getElementById('lineWidth'),
            opacity: document.getElementById('opacity'),
            drawColor: document.getElementById('drawColor'),
            clearCustom: document.getElementById('clearCustom'),
            undoCustom: document.getElementById('undoCustom'),
            analyzeCustom: document.getElementById('analyzeCustom'),
            exportCustom: document.getElementById('exportCustom')
        };
    }

    /**
     * Inicializar sistema de tabs
     */
    function initializeTabs() {
        elements.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                switchTab(tabId);
            });
        });
    }

    /**
     * Cambiar tab activo
     */
    function switchTab(tabId) {
        // Actualizar botones
        elements.tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        
        // Actualizar contenido
        elements.tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(`tab-${tabId}`).classList.add('active');
        
        state.currentTab = tabId;
        
        // Reinicializar contextos según el tab
        setTimeout(() => {
            if (tabId === '3d') {
                resize3D();
            } else if (tabId === 'polyhedra') {
                resizePolyhedra();
            }
        }, 100);
    }

    /**
     * ==================== SECCIÓN 2D ====================
     */
    function initialize2D() {
        if (!elements.canvas2d) return;
        
        const canvas = elements.canvas2d;
        const container = canvas.parentElement;
        
        // Configurar canvas
        canvas.width = container.clientWidth - 40;
        canvas.height = container.clientHeight - 40;
        
        contexts.ctx2d = canvas.getContext('2d');
        
        // Event listeners para figuras 2D
        elements.shapeButtons2d.forEach(button => {
            button.addEventListener('click', () => {
                selectShape2D(button.dataset.shape);
                updateActiveButton(button, elements.shapeButtons2d);
            });
        });
        
        // Canvas click event
        canvas.addEventListener('click', (e) => {
            if (state.selectedShape) {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                createFigure2D(x, y);
            }
        });
        
        // Control listeners
        if (elements.size2d) elements.size2d.addEventListener('input', updateFigure2D);
        if (elements.rotation2d) elements.rotation2d.addEventListener('input', updateFigure2D);
        if (elements.fillColor) elements.fillColor.addEventListener('change', updateFigure2D);
        if (elements.strokeColor) elements.strokeColor.addEventListener('change', updateFigure2D);
        
        // Action buttons
        if (elements.clear2d) elements.clear2d.addEventListener('click', clear2D);
        if (elements.save2d) elements.save2d.addEventListener('click', save2D);
    }

    function selectShape2D(shape) {
        state.selectedShape = shape;
        console.log(`🔷 Figura 2D seleccionada: ${shape}`);
    }

    function createFigure2D(x, y) {
        const canvas = elements.canvas2d;
        const ctx = contexts.ctx2d;
        const size = parseInt(elements.size2d.value);
        const rotation = parseInt(elements.rotation2d.value) * Math.PI / 180;
        const fillColor = elements.fillColor.value;
        const strokeColor = elements.strokeColor.value;
        
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Configurar estilos
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        
        // Guardar contexto y aplicar transformaciones
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Dibujar figura según el tipo
        switch (state.selectedShape) {
            case 'circle':
                drawCircle(ctx, size);
                break;
            case 'square':
                drawSquare(ctx, size);
                break;
            case 'triangle':
                drawTriangle(ctx, size);
                break;
            case 'rectangle':
                drawRectangle(ctx, size);
                break;
            case 'pentagon':
                drawRegularPolygon(ctx, size, 5);
                break;
            case 'hexagon':
                drawRegularPolygon(ctx, size, 6);
                break;
        }
        
        ctx.restore();
        
        // Actualizar propiedades
        updateProperties2D(x, y, size);
    }

    function drawCircle(ctx, radius) {
        ctx.beginPath();
        ctx.arc(0, 0, radius/2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    function drawSquare(ctx, size) {
        const half = size / 2;
        ctx.fillRect(-half, -half, size, size);
        ctx.strokeRect(-half, -half, size, size);
    }

    function drawTriangle(ctx, size) {
        const height = size * Math.sqrt(3) / 2;
        ctx.beginPath();
        ctx.moveTo(0, -height/2);
        ctx.lineTo(-size/2, height/2);
        ctx.lineTo(size/2, height/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function drawRectangle(ctx, size) {
        const width = size * 1.5;
        const height = size;
        ctx.fillRect(-width/2, -height/2, width, height);
        ctx.strokeRect(-width/2, -height/2, width, height);
    }

    function drawRegularPolygon(ctx, size, sides) {
        const radius = size / 2;
        ctx.beginPath();
        
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function updateFigure2D() {
        // Redibujar la figura actual si existe
        if (state.currentFigure) {
            createFigure2D(state.currentFigure.x, state.currentFigure.y);
        }
    }

    function updateProperties2D(x, y, size) {
        const type = state.selectedShape;
        let area = 0;
        let perimeter = 0;
        
        // Calcular área y perímetro según la figura
        switch (type) {
            case 'circle':
                const radius = size / 2;
                area = Math.PI * radius * radius;
                perimeter = 2 * Math.PI * radius;
                break;
            case 'square':
                area = size * size;
                perimeter = 4 * size;
                break;
            case 'triangle':
                area = (size * size * Math.sqrt(3)) / 4;
                perimeter = 3 * size;
                break;
            case 'rectangle':
                const width = size * 1.5;
                const height = size;
                area = width * height;
                perimeter = 2 * (width + height);
                break;
            case 'pentagon':
                area = (size * size * Math.sqrt(25 + 10 * Math.sqrt(5))) / 4;
                perimeter = 5 * size;
                break;
            case 'hexagon':
                area = (3 * Math.sqrt(3) * size * size) / 2;
                perimeter = 6 * size;
                break;
        }
        
        // Actualizar UI
        updatePropertyValue('figureType', type.charAt(0).toUpperCase() + type.slice(1));
        updatePropertyValue('figureArea', area.toFixed(2) + ' px²');
        updatePropertyValue('figurePerimeter', perimeter.toFixed(2) + ' px');
        updatePropertyValue('figureCoords', `(${x.toFixed(0)}, ${y.toFixed(0)})`);
        
        // Guardar figura actual
        state.currentFigure = { x, y, type, size };
    }

    function clear2D() {
        const canvas = elements.canvas2d;
        const ctx = contexts.ctx2d;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Resetear propiedades
        updatePropertyValue('figureType', 'Ninguno');
        updatePropertyValue('figureArea', '0');
        updatePropertyValue('figurePerimeter', '0');
        updatePropertyValue('figureCoords', '(0, 0)');
        
        state.currentFigure = null;
    }

    function save2D() {
        const canvas = elements.canvas2d;
        const link = document.createElement('a');
        link.download = 'figura-2d.png';
        link.href = canvas.toDataURL();
        link.click();
        
        showNotification('✅ Figura 2D guardada correctamente', 'success');
    }

    /**
     * ==================== SECCIÓN 3D ====================
     */
    function initialize3D() {
        if (!elements.canvas3d || typeof THREE === 'undefined') {
            console.warn('Three.js no está disponible o elemento canvas3d no encontrado');
            return;
        }
        
        const container = elements.canvas3d;
        
        // Crear escena 3D
        contexts.scene3d = new THREE.Scene();
        contexts.scene3d.background = new THREE.Color(0xf7fafc);
        
        // Crear cámara
        contexts.camera3d = new THREE.PerspectiveCamera(
            75, 
            container.clientWidth / container.clientHeight, 
            0.1, 
            1000
        );
        contexts.camera3d.position.set(5, 5, 5);
        
        // Crear renderer
        contexts.renderer3d = new THREE.WebGLRenderer({ antialias: true });
        contexts.renderer3d.setSize(container.clientWidth, container.clientHeight);
        contexts.renderer3d.setClearColor(0xf7fafc);
        contexts.renderer3d.shadowMap.enabled = true;
        contexts.renderer3d.shadowMap.type = THREE.PCFSoftShadowMap;
        
        container.appendChild(contexts.renderer3d.domElement);
        
        // Controles de órbita (implementación básica sin OrbitControls)
        setupBasic3DControls();
        
        // Iluminación
        setup3DLighting();
        
        // Event listeners
        elements.shapeButtons3d.forEach(button => {
            button.addEventListener('click', () => {
                create3DShape(button.dataset.shape);
                updateActiveButton(button, elements.shapeButtons3d);
            });
        });
        
        // Control listeners
        if (elements.scale3d) elements.scale3d.addEventListener('input', update3DTransforms);
        if (elements.rotationX) elements.rotationX.addEventListener('input', update3DTransforms);
        if (elements.rotationY) elements.rotationY.addEventListener('input', update3DTransforms);
        if (elements.color3d) elements.color3d.addEventListener('change', update3DColor);
        
        // Action buttons
        if (elements.reset3d) elements.reset3d.addEventListener('click', reset3D);
        if (elements.animate3d) elements.animate3d.addEventListener('click', toggle3DAnimation);
        
        // Iniciar loop de renderizado
        animate3D();
    }

    function setupBasic3DControls() {
        let isMouseDown = false;
        let mouseX = 0;
        let mouseY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;
        
        const canvas = contexts.renderer3d.domElement;
        
        canvas.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            
            const deltaX = e.clientX - mouseX;
            const deltaY = e.clientY - mouseY;
            
            targetRotationY += deltaX * 0.01;
            targetRotationX += deltaY * 0.01;
            
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        canvas.addEventListener('mouseup', () => {
            isMouseDown = false;
        });
        
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const scale = e.deltaY > 0 ? 1.1 : 0.9;
            contexts.camera3d.position.multiplyScalar(scale);
        });
        
        // Aplicar rotaciones suaves
        function updateCameraRotation() {
            if (contexts.scene3d.children.length > 2) { // Más que solo las luces
                const object = contexts.scene3d.children.find(child => 
                    child.type === 'Mesh' || child.type === 'Group'
                );
                if (object) {
                    object.rotation.x += (targetRotationX - object.rotation.x) * 0.1;
                    object.rotation.y += (targetRotationY - object.rotation.y) * 0.1;
                }
            }
            requestAnimationFrame(updateCameraRotation);
        }
        updateCameraRotation();
    }

    function setup3DLighting() {
        // Luz ambiental
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        contexts.scene3d.add(ambientLight);
        
        // Luz direccional
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        contexts.scene3d.add(directionalLight);
    }

    function create3DShape(shape) {
        // Limpiar objetos previos (excepto luces)
        const objectsToRemove = contexts.scene3d.children.filter(child => 
            child.type === 'Mesh' || child.type === 'Group'
        );
        objectsToRemove.forEach(obj => contexts.scene3d.remove(obj));
        
        let geometry, material, mesh;
        const color = elements.color3d.value;
        
        material = new THREE.MeshPhongMaterial({ 
            color: color,
            shininess: 100
        });
        
        switch (shape) {
            case 'sphere':
                geometry = new THREE.SphereGeometry(1, 32, 32);
                break;
            case 'cube':
                geometry = new THREE.BoxGeometry(2, 2, 2);
                break;
            case 'cylinder':
                geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
                break;
            case 'cone':
                geometry = new THREE.ConeGeometry(1, 2, 32);
                break;
            case 'pyramid':
                geometry = new THREE.ConeGeometry(1, 2, 4);
                break;
            case 'torus':
                geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
                break;
        }
        
        mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        contexts.scene3d.add(mesh);
        
        state.currentFigure = { shape, mesh };
        update3DProperties(shape, geometry);
    }

    function update3DTransforms() {
        if (!state.currentFigure || !state.currentFigure.mesh) return;
        
        const mesh = state.currentFigure.mesh;
        const scale = parseFloat(elements.scale3d.value);
        const rotX = parseFloat(elements.rotationX.value) * Math.PI / 180;
        const rotY = parseFloat(elements.rotationY.value) * Math.PI / 180;
        
        mesh.scale.setScalar(scale);
        mesh.rotation.x = rotX;
        mesh.rotation.y = rotY;
        
        // Actualizar propiedades con la nueva escala
        update3DProperties(state.currentFigure.shape, mesh.geometry, scale);
    }

    function update3DColor() {
        if (!state.currentFigure || !state.currentFigure.mesh) return;
        
        const mesh = state.currentFigure.mesh;
        mesh.material.color.setHex(elements.color3d.value.replace('#', '0x'));
    }

    function update3DProperties(shape, geometry, scale = 1) {
        let volume = 0;
        let surface = 0;
        let vertices = 0;
        let edges = 0;
        let faces = 0;
        
        // Obtener datos de la geometría
        if (geometry.attributes && geometry.attributes.position) {
            vertices = geometry.attributes.position.count;
        }
        
        if (geometry.index) {
            faces = geometry.index.count / 3;
        }
        
        // Calcular propiedades según la forma
        const scaleFactor = scale * scale * scale;
        const surfaceScale = scale * scale;
        
        switch (shape) {
            case 'sphere':
                const radius = 1 * scale;
                volume = (4/3) * Math.PI * Math.pow(radius, 3);
                surface = 4 * Math.PI * Math.pow(radius, 2);
                edges = 0; // Una esfera no tiene aristas
                break;
            case 'cube':
                const side = 2 * scale;
                volume = Math.pow(side, 3);
                surface = 6 * Math.pow(side, 2);
                vertices = 8;
                edges = 12;
                faces = 6;
                break;
            case 'cylinder':
                const cylRadius = 1 * scale;
                const height = 2 * scale;
                volume = Math.PI * Math.pow(cylRadius, 2) * height;
                surface = 2 * Math.PI * cylRadius * (cylRadius + height);
                break;
            case 'cone':
                const coneRadius = 1 * scale;
                const coneHeight = 2 * scale;
                volume = (1/3) * Math.PI * Math.pow(coneRadius, 2) * coneHeight;
                const slantHeight = Math.sqrt(Math.pow(coneRadius, 2) + Math.pow(coneHeight, 2));
                surface = Math.PI * coneRadius * (coneRadius + slantHeight);
                break;
            case 'pyramid':
                const baseArea = 2 * scale; // Para una pirámide cuadrada
                const pyrHeight = 2 * scale;
                volume = (1/3) * Math.pow(baseArea, 2) * pyrHeight;
                vertices = 5;
                edges = 8;
                faces = 5;
                break;
            case 'torus':
                const majorRadius = 1 * scale;
                const minorRadius = 0.4 * scale;
                volume = 2 * Math.pow(Math.PI, 2) * Math.pow(minorRadius, 2) * majorRadius;
                surface = 4 * Math.pow(Math.PI, 2) * minorRadius * majorRadius;
                break;
        }
        
        // Actualizar UI
        updatePropertyValue('figure3dType', shape.charAt(0).toUpperCase() + shape.slice(1));
        updatePropertyValue('figure3dVolume', volume.toFixed(2) + ' u³');
        updatePropertyValue('figure3dSurface', surface.toFixed(2) + ' u²');
        updatePropertyValue('figure3dVertices', vertices.toString());
        updatePropertyValue('figure3dEdges', edges.toString());
        updatePropertyValue('figure3dFaces', faces.toString());
    }

    function reset3D() {
        // Resetear controles
        if (elements.scale3d) elements.scale3d.value = 1;
        if (elements.rotationX) elements.rotationX.value = 0;
        if (elements.rotationY) elements.rotationY.value = 0;
        
        // Resetear transformaciones del objeto
        if (state.currentFigure && state.currentFigure.mesh) {
            const mesh = state.currentFigure.mesh;
            mesh.scale.setScalar(1);
            mesh.rotation.set(0, 0, 0);
            update3DProperties(state.currentFigure.shape, mesh.geometry, 1);
        }
        
        // Resetear cámara
        contexts.camera3d.position.set(5, 5, 5);
        contexts.camera3d.lookAt(0, 0, 0);
    }

    function toggle3DAnimation() {
        state.isAnimating = !state.isAnimating;
        const button = elements.animate3d;
        
        if (state.isAnimating) {
            button.innerHTML = '<i class="fas fa-pause"></i> Pausar';
            button.classList.remove('btn-primary');
            button.classList.add('btn-danger');
        } else {
            button.innerHTML = '<i class="fas fa-play"></i> Animar';
            button.classList.remove('btn-danger');
            button.classList.add('btn-primary');
        }
    }

    function animate3D() {
        requestAnimationFrame(animate3D);
        
        // Rotación automática si está animando
        if (state.isAnimating && state.currentFigure && state.currentFigure.mesh) {
            state.currentFigure.mesh.rotation.x += 0.01;
            state.currentFigure.mesh.rotation.y += 0.01;
        }
        
        contexts.renderer3d.render(contexts.scene3d, contexts.camera3d);
    }

    function resize3D() {
        if (!contexts.renderer3d || !contexts.camera3d) return;
        
        const container = elements.canvas3d;
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        contexts.camera3d.aspect = width / height;
        contexts.camera3d.updateProjectionMatrix();
        contexts.renderer3d.setSize(width, height);
    }

    /**
     * ==================== SECCIÓN POLIEDROS ====================
     */
    function initializePolyhedra() {
        if (!elements.canvasPolyhedra || typeof THREE === 'undefined') {
            console.warn('Three.js no está disponible o elemento canvasPolyhedra no encontrado');
            return;
        }
        
        const container = elements.canvasPolyhedra;
        
        // Crear escena para poliedros
        contexts.scenePolyhedra = new THREE.Scene();
        contexts.scenePolyhedra.background = new THREE.Color(0xf7fafc);
        
        // Crear cámara
        contexts.cameraPolyhedra = new THREE.PerspectiveCamera(
            75, 
            container.clientWidth / container.clientHeight, 
            0.1, 
            1000
        );
        contexts.cameraPolyhedra.position.set(4, 4, 4);
        
        // Crear renderer
        contexts.rendererPolyhedra = new THREE.WebGLRenderer({ antialias: true });
        contexts.rendererPolyhedra.setSize(container.clientWidth, container.clientHeight);
        contexts.rendererPolyhedra.setClearColor(0xf7fafc);
        
        container.appendChild(contexts.rendererPolyhedra.domElement);
        
        // Iluminación
        setupPolyhedraLighting();
        
        // Event listeners
        elements.shapeButtonsPolyhedra.forEach(button => {
            button.addEventListener('click', () => {
                createPolyhedron(button.dataset.shape);
                updateActiveButton(button, elements.shapeButtonsPolyhedra);
            });
        });
        
        // Controles de visualización
        if (elements.showWireframe) elements.showWireframe.addEventListener('change', updatePolyhedraDisplay);
        if (elements.showVertices) elements.showVertices.addEventListener('change', updatePolyhedraDisplay);
        if (elements.showEdges) elements.showEdges.addEventListener('change', updatePolyhedraDisplay);
        if (elements.autoRotate) elements.autoRotate.addEventListener('change', toggleAutoRotate);
        
        // Action buttons
        if (elements.explodeView) elements.explodeView.addEventListener('click', toggleExplodeView);
        if (elements.captureImage) elements.captureImage.addEventListener('click', capturePolyhedraImage);
        
        // Iniciar loop de renderizado
        animatePolyhedra();
    }

    function setupPolyhedraLighting() {
        // Luz ambiental
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        contexts.scenePolyhedra.add(ambientLight);
        
        // Múltiples luces direccionales para mejor visualización
        const light1 = new THREE.DirectionalLight(0xffffff, 0.6);
        light1.position.set(10, 10, 5);
        contexts.scenePolyhedra.add(light1);
        
        const light2 = new THREE.DirectionalLight(0xffffff, 0.3);
        light2.position.set(-10, -10, -5);
        contexts.scenePolyhedra.add(light2);
    }

    function createPolyhedron(type) {
        // Limpiar objetos previos
        const objectsToRemove = contexts.scenePolyhedra.children.filter(child => 
            child.type === 'Mesh' || child.type === 'Group'
        );
        objectsToRemove.forEach(obj => contexts.scenePolyhedra.remove(obj));
        
        let geometry;
        
        switch (type) {
            case 'tetrahedron':
                geometry = new THREE.TetrahedronGeometry(2);
                break;
            case 'octahedron':
                geometry = new THREE.OctahedronGeometry(2);
                break;
            case 'icosahedron':
                geometry = new THREE.IcosahedronGeometry(2);
                break;
            case 'dodecahedron':
                geometry = new THREE.DodecahedronGeometry(2);
                break;
        }
        
        const material = new THREE.MeshPhongMaterial({ 
            color: config.colors.primary,
            transparent: true,
            opacity: 0.8
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        contexts.scenePolyhedra.add(mesh);
        
        state.currentFigure = { type, mesh, geometry };
        updatePolyhedronProperties(type, geometry);
        updatePolyhedraDisplay();
    }

    function updatePolyhedronProperties(type, geometry) {
        const properties = getPolyhedronProperties(type);
        
        updatePropertyValue('polyhedronName', properties.name);
        updatePropertyValue('polyhedronVertices', properties.vertices.toString());
        updatePropertyValue('polyhedronEdges', properties.edges.toString());
        updatePropertyValue('polyhedronFaces', properties.faces.toString());
        updatePropertyValue('eulerCharacteristic', (properties.vertices - properties.edges + properties.faces).toString());
        updatePropertyValue('faceType', properties.faceType);
    }

    function getPolyhedronProperties(type) {
        const properties = {
            tetrahedron: {
                name: 'Tetraedro',
                vertices: 4,
                edges: 6,
                faces: 4,
                faceType: 'Triángulos'
            },
            octahedron: {
                name: 'Octaedro',
                vertices: 6,
                edges: 12,
                faces: 8,
                faceType: 'Triángulos'
            },
            icosahedron: {
                name: 'Icosaedro',
                vertices: 12,
                edges: 30,
                faces: 20,
                faceType: 'Triángulos'
            },
            dodecahedron: {
                name: 'Dodecaedro',
                vertices: 20,
                edges: 30,
                faces: 12,
                faceType: 'Pentágonos'
            }
        };
        
        return properties[type] || {};
    }

    function updatePolyhedraDisplay() {
        if (!state.currentFigure || !state.currentFigure.mesh) return;
        
        const mesh = state.currentFigure.mesh;
        const showWireframe = elements.showWireframe && elements.showWireframe.checked;
        
        // Actualizar material
        mesh.material.wireframe = showWireframe;
        
        // TODO: Implementar visualización de vértices y aristas
        // Esto requeriría crear geometrías adicionales para puntos y líneas
    }

    function toggleAutoRotate() {
        // La rotación automática se maneja en el loop de animación
    }

    function toggleExplodeView() {
        // TODO: Implementar vista explosiva
        showNotification('🚧 Vista explosiva en desarrollo', 'info');
    }

    function capturePolyhedraImage() {
        const dataURL = contexts.rendererPolyhedra.domElement.toDataURL();
        const link = document.createElement('a');
        link.download = 'poliedro.png';
        link.href = dataURL;
        link.click();
        
        showNotification('📸 Imagen capturada correctamente', 'success');
    }

    function animatePolyhedra() {
        requestAnimationFrame(animatePolyhedra);
        
        // Auto rotación si está habilitada
        if (elements.autoRotate && elements.autoRotate.checked && 
            state.currentFigure && state.currentFigure.mesh) {
            state.currentFigure.mesh.rotation.x += 0.005;
            state.currentFigure.mesh.rotation.y += 0.01;
        }
        
        contexts.rendererPolyhedra.render(contexts.scenePolyhedra, contexts.cameraPolyhedra);
    }

    function resizePolyhedra() {
        if (!contexts.rendererPolyhedra || !contexts.cameraPolyhedra) return;
        
        const container = elements.canvasPolyhedra;
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        contexts.cameraPolyhedra.aspect = width / height;
        contexts.cameraPolyhedra.updateProjectionMatrix();
        contexts.rendererPolyhedra.setSize(width, height);
    }

    /**
     * ==================== SECCIÓN PERSONALIZADO ====================
     */
    function initializeCustom() {
        if (!elements.canvasCustom) return;
        
        const canvas = elements.canvasCustom;
        const container = canvas.parentElement;
        
        // Configurar canvas
        canvas.width = container.clientWidth - 40;
        canvas.height = container.clientHeight - 40;
        
        contexts.ctxCustom = canvas.getContext('2d');
        
        // Event listeners para herramientas
        elements.toolButtons.forEach(button => {
            button.addEventListener('click', () => {
                selectCustomTool(button.dataset.tool);
                updateActiveButton(button, elements.toolButtons);
            });
        });
        
        // Canvas events
        setupCustomCanvasEvents();
        
        // Control listeners
        if (elements.lineWidth) elements.lineWidth.addEventListener('input', updateCustomStyle);
        if (elements.opacity) elements.opacity.addEventListener('input', updateCustomStyle);
        if (elements.drawColor) elements.drawColor.addEventListener('change', updateCustomStyle);
        
        // Action buttons
        if (elements.clearCustom) elements.clearCustom.addEventListener('click', clearCustom);
        if (elements.undoCustom) elements.undoCustom.addEventListener('click', undoCustom);
        if (elements.analyzeCustom) elements.analyzeCustom.addEventListener('click', analyzeCustom);
        if (elements.exportCustom) elements.exportCustom.addEventListener('click', exportCustom);
    }

    function selectCustomTool(tool) {
        state.selectedTool = tool;
        console.log(`🖊️ Herramienta seleccionada: ${tool}`);
    }

    function setupCustomCanvasEvents() {
        const canvas = elements.canvasCustom;
        let isDrawing = false;
        let currentPath = [];
        
        canvas.addEventListener('mousedown', (e) => {
            if (!state.selectedTool) return;
            
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            currentPath = [{ x, y }];
            
            if (state.selectedTool === 'freehand') {
                startFreehandDrawing(x, y);
            }
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing || !state.selectedTool) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            currentPath.push({ x, y });
            
            if (state.selectedTool === 'freehand') {
                continueFreehandDrawing(x, y);
            }
        });
        
        canvas.addEventListener('mouseup', () => {
            if (isDrawing && currentPath.length > 0) {
                // Guardar el trazo en el stack de deshacer
                state.undoStack.push({
                    tool: state.selectedTool,
                    path: [...currentPath],
                    style: getCustomStyle()
                });
                
                updateCustomProperties();
            }
            
            isDrawing = false;
            currentPath = [];
        });
    }

    function startFreehandDrawing(x, y) {
        const ctx = contexts.ctxCustom;
        const style = getCustomStyle();
        
        ctx.globalAlpha = style.opacity;
        ctx.strokeStyle = style.color;
        ctx.lineWidth = style.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function continueFreehandDrawing(x, y) {
        const ctx = contexts.ctxCustom;
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    function getCustomStyle() {
        return {
            lineWidth: parseInt(elements.lineWidth.value),
            opacity: parseFloat(elements.opacity.value),
            color: elements.drawColor.value
        };
    }

    function updateCustomStyle() {
        // Los estilos se aplican en tiempo real durante el dibujo
    }

    function clearCustom() {
        const canvas = elements.canvasCustom;
        const ctx = contexts.ctxCustom;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        state.undoStack = [];
        updateCustomProperties();
    }

    function undoCustom() {
        if (state.undoStack.length === 0) return;
        
        // Quitar el último elemento
        state.undoStack.pop();
        
        // Redibujar todo
        redrawCustomCanvas();
        updateCustomProperties();
    }

    function redrawCustomCanvas() {
        const canvas = elements.canvasCustom;
        const ctx = contexts.ctxCustom;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        state.undoStack.forEach(item => {
            ctx.globalAlpha = item.style.opacity;
            ctx.strokeStyle = item.style.color;
            ctx.lineWidth = item.style.lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            ctx.beginPath();
            item.path.forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            });
            ctx.stroke();
        });
    }

    function updateCustomProperties() {
        const elements = state.undoStack.length;
        let totalLength = 0;
        
        state.undoStack.forEach(item => {
            for (let i = 1; i < item.path.length; i++) {
                const prev = item.path[i - 1];
                const curr = item.path[i];
                totalLength += Math.sqrt(
                    Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
                );
            }
        });
        
        updatePropertyValue('customElements', elements.toString());
        updatePropertyValue('customLength', totalLength.toFixed(0) + ' px');
    }

    function analyzeCustom() {
        showNotification('🔍 Análisis de dibujo personalizado en desarrollo', 'info');
    }

    function exportCustom() {
        const canvas = elements.canvasCustom;
        const link = document.createElement('a');
        link.download = 'dibujo-personalizado.png';
        link.href = canvas.toDataURL();
        link.click();
        
        showNotification('💾 Dibujo exportado correctamente', 'success');
    }

    /**
     * ==================== UTILIDADES ====================
     */
    function updateActiveButton(selectedButton, allButtons) {
        allButtons.forEach(btn => btn.classList.remove('active'));
        selectedButton.classList.add('active');
    }

    function updatePropertyValue(propertyId, value) {
        const element = document.getElementById(propertyId);
        if (element) {
            element.textContent = value;
        }
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4ecdc4' : type === 'danger' ? '#ff6b6b' : '#667eea'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-remove
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
        // Botón de cerrar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    // Manejar redimensionamiento de ventana
    function handleResize() {
        if (state.currentTab === '3d') {
            resize3D();
        } else if (state.currentTab === 'polyhedra') {
            resizePolyhedra();
        }
    }

    function initializeEventListeners() {
        window.addEventListener('resize', handleResize);
    }

    /**
     * API pública del módulo
     */
    return {
        init,
        switchTab,
        showNotification
    };
})();