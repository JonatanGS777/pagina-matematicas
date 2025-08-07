/**
 * Robot3D Advanced Module - Sistema de robot 3D ultra-moderno
 * Versión avanzada con PBR, post-processing y efectos visuales de última generación
 */

class Robot3D {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        
        // Scene components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.robot = null;
        this.composer = null; // Post-processing composer
        
        // Advanced rendering
        this.environmentMap = null;
        this.pmremGenerator = null;
        this.renderTarget = null;
        
        // Lighting
        this.lights = {};
        this.lightProbe = null;
        
        // Post-processing effects
        this.bloomPass = null;
        this.ssaoPass = null;
        this.fxaaPass = null;
        this.colorCorrectionPass = null;
        
        // Environment
        this.floor = null;
        this.skybox = null;
        this.particles = [];
        this.trails = [];
        
        // Robot state
        this.robotPosition = { x: 0, z: 0 };
        this.robotRotation = 0;
        this.commandCount = 0;
        this.isAnimating = false;
        this.commandQueue = [];
        
        // Robot parts for animation
        this.robotParts = {};
        this.robotMixers = []; // Animation mixers
        
        // Advanced animation
        this.clock = new THREE.Clock();
        this.animationSpeed = 1000;
        this.rotationSpeed = 500;
        
        // Physics integration
        this.physics = null;
        this.physicsEnabled = false;
        
        // Performance monitoring
        this.stats = null;
        this.frameCount = 0;
        this.lastTime = performance.now();
        
        // Callbacks
        this.onStatsUpdate = null;
        this.onLog = null;
        
        this.init();
    }
    
    // Initialize the advanced 3D environment
    async init() {
        this.clearContainer();
        
        // Show loading
        this.showLoadingScreen();
        
        try {
            await this.setupScene();
            await this.setupCamera();
            await this.setupRenderer();
            await this.setupPostProcessing();
            await this.setupAdvancedLighting();
            await this.initEnvironment(); // 🆕 Usar módulo separado
            await this.createAdvancedRobot();
            this.setupAdvancedAnimations();
            this.startAdvancedAnimation();
            this.setupEventListeners();
            
            this.hideLoadingScreen();
            this.log('🚀 Robot 3D Avanzado iniciado con éxito');
            
            // Initialize physics if available
            this.initPhysics();
        } catch (error) {
            console.error('Error initializing advanced robot:', error);
            this.log('❌ Error al inicializar robot avanzado');
        }
    }
    
    // Initialize environment using separate module
    async initEnvironment() {
        // Check if RobotEnvironment module is available
        if (typeof RobotEnvironment !== 'undefined') {
            try {
                this.environment = new RobotEnvironment(this);
                await this.environment.createEnvironment();
                this.log('🌍 Módulo de entorno cargado correctamente');
            } catch (error) {
                console.error('Error initializing environment:', error);
                this.log('❌ Error al cargar módulo de entorno');
                // Fallback to basic environment
                await this.createBasicEnvironment();
            }
        } else {
            this.log('ℹ️ Módulo RobotEnvironment no encontrado');
            this.log('💡 Carga robotEnvironment.js para entorno avanzado');
            // Fallback to basic environment
            await this.createBasicEnvironment();
        }
    }
    
    // Fallback basic environment if module not available
    async createBasicEnvironment() {
        // Basic floor
        const floorGeometry = new THREE.PlaneGeometry(30, 30);
        const floorMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x1a1a2e,
            transparent: true,
            opacity: 0.9
        });
        
        this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.floor.rotation.x = -Math.PI / 2;
        this.floor.receiveShadow = true;
        this.scene.add(this.floor);
        
        // Basic grid
        const grid = new THREE.GridHelper(20, 20, 0x667eea, 0x334477);
        grid.material.transparent = true;
        grid.material.opacity = 0.6;
        this.scene.add(grid);
        
        this.log('🏢 Entorno básico creado (fallback)');
        return Promise.resolve();
    }
    
    showLoadingScreen() {
        this.container.innerHTML = `
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white;">
                <div style="width: 60px; height: 60px; border: 3px solid rgba(102, 126, 234, 0.3); border-top: 3px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
                <div style="font-size: 18px; font-weight: 600;">Cargando Robot 3D Avanzado...</div>
                <div style="font-size: 14px; opacity: 0.7; margin-top: 10px;">Inicializando motores de renderizado</div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
    }
    
    hideLoadingScreen() {
        // Remove loading screen with fade effect
        const loading = this.container.querySelector('div');
        if (loading) {
            loading.style.transition = 'opacity 0.5s ease';
            loading.style.opacity = '0';
            setTimeout(() => {
                if (loading.parentNode) {
                    loading.remove();
                }
            }, 500);
        }
    }
    
    clearContainer() {
        this.container.innerHTML = '';
    }
    
    async setupScene() {
        this.scene = new THREE.Scene();
        
        // Advanced background with HDR-like gradient
        const bgGeometry = new THREE.SphereGeometry(500, 32, 32);
        const bgMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec3 vWorldPosition;
                
                void main() {
                    vec3 color1 = vec3(0.1, 0.1, 0.4);
                    vec3 color2 = vec3(0.3, 0.1, 0.6);
                    vec3 color3 = vec3(0.6, 0.3, 0.8);
                    
                    float noise = sin(vWorldPosition.x * 0.01 + time) * 
                                 cos(vWorldPosition.y * 0.01 + time * 0.7) * 
                                 sin(vWorldPosition.z * 0.01 + time * 0.5);
                    
                    float factor = (vWorldPosition.y / 500.0 + 1.0) * 0.5;
                    factor += noise * 0.1;
                    
                    vec3 color = mix(color1, color2, factor);
                    color = mix(color, color3, factor * 0.5);
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            side: THREE.BackSide
        });
        
        this.skybox = new THREE.Mesh(bgGeometry, bgMaterial);
        this.scene.add(this.skybox);
        
        // Enhanced fog
        this.scene.fog = new THREE.FogExp2(0x0a0a1a, 0.02);
        
        return Promise.resolve();
    }
    
    async setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
        this.camera.position.set(15, 10, 15);
        this.camera.lookAt(0, 0, 0);
        
        return Promise.resolve();
    }
    
    async setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Advanced rendering settings
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.renderer.physicallyCorrectLights = true;
        
        // Enable extensions
        const gl = this.renderer.getContext();
        if (gl.getExtension('EXT_color_buffer_float')) {
            this.renderer.capabilities.isWebGL2 = true;
        }
        
        this.container.appendChild(this.renderer.domElement);
        
        return Promise.resolve();
    }
    
    async setupPostProcessing() {
        // Import post-processing classes (simulated - in real implementation these would be imported)
        // For this example, we'll simulate the post-processing setup
        this.renderTarget = new THREE.WebGLRenderTarget(
            this.container.clientWidth,
            this.container.clientHeight,
            {
                type: THREE.FloatType,
                format: THREE.RGBAFormat,
                colorSpace: THREE.SRGBColorSpace
            }
        );
        
        // Note: In a real implementation, you would import and use:
        // EffectComposer, RenderPass, BloomPass, SSAOPass, etc.
        // For this example, we'll setup the structure without the actual imports
        
        this.log('📸 Post-processing configurado (modo simulado)');
        return Promise.resolve();
    }
    
    async setupAdvancedLighting() {
        // Enhanced ambient lighting with light probe
        const ambientLight = new THREE.AmbientLight(0x404080, 0.2);
        this.scene.add(ambientLight);
        
        // Main directional light (sun) with realistic settings
        this.lights.sun = new THREE.DirectionalLight(0xffffff, 3.0);
        this.lights.sun.position.set(20, 30, 10);
        this.lights.sun.castShadow = true;
        
        // Ultra-high quality shadows
        this.lights.sun.shadow.mapSize.width = 4096;
        this.lights.sun.shadow.mapSize.height = 4096;
        this.lights.sun.shadow.camera.near = 0.1;
        this.lights.sun.shadow.camera.far = 100;
        this.lights.sun.shadow.camera.left = -30;
        this.lights.sun.shadow.camera.right = 30;
        this.lights.sun.shadow.camera.top = 30;
        this.lights.sun.shadow.camera.bottom = -30;
        this.lights.sun.shadow.bias = -0.0001;
        this.lights.sun.shadow.normalBias = 0.02;
        
        this.scene.add(this.lights.sun);
        
        // Advanced fill lighting setup
        this.lights.fill = new THREE.DirectionalLight(0x667eea, 1.5);
        this.lights.fill.position.set(-15, 20, -10);
        this.scene.add(this.lights.fill);
        
        // Rim light for dramatic effect
        this.lights.rim = new THREE.DirectionalLight(0x4ecdc4, 1.0);
        this.lights.rim.position.set(10, 5, -20);
        this.scene.add(this.lights.rim);
        
        // Dynamic point lights for robot highlighting
        this.lights.robotSpotlight = new THREE.SpotLight(0xffffff, 2.0, 20, Math.PI / 6, 0.1);
        this.lights.robotSpotlight.position.set(0, 15, 0);
        this.lights.robotSpotlight.target.position.set(0, 0, 0);
        this.lights.robotSpotlight.castShadow = true;
        this.lights.robotSpotlight.shadow.mapSize.width = 2048;
        this.lights.robotSpotlight.shadow.mapSize.height = 2048;
        this.scene.add(this.lights.robotSpotlight);
        this.scene.add(this.lights.robotSpotlight.target);
        
        // Accent lights for atmosphere
        this.createAccentLights();
        
        return Promise.resolve();
    }
    
    createAccentLights() {
        // Create multiple colored accent lights
        const accentColors = [0xff6b6b, 0x4ecdc4, 0xffe066, 0xf093fb];
        const positions = [
            [15, 2, 15], [-15, 2, 15], [15, 2, -15], [-15, 2, -15]
        ];
        
        this.lights.accents = [];
        
        positions.forEach((pos, i) => {
            const light = new THREE.PointLight(accentColors[i], 1.0, 25, 2);
            light.position.set(...pos);
            this.lights.accents.push(light);
            this.scene.add(light);
        });
    }
    
    async createAdvancedEnvironment() {
        // Advanced floor with PBR materials
        await this.createAdvancedFloor();
        
        // Enhanced grid system
        this.createAdvancedGrid();
        
        // Atmospheric particles
        this.createAdvancedParticles();
        
        // Environment props
        this.createAdvancedProps();
        
        // Energy barriers/walls
        this.createEnergyBarriers();
        
        return Promise.resolve();
    }
    
    async createAdvancedFloor() {
        const floorGeometry = new THREE.PlaneGeometry(40, 40, 64, 64);
        
        // Create advanced material with normal mapping simulation
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            metalness: 0.1,
            roughness: 0.8,
            transparent: true,
            opacity: 0.9
        });
        
        // Add displacement for surface detail
        const vertices = floorGeometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2];
            vertices[i + 1] = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 0.02;
        }
        floorGeometry.attributes.position.needsUpdate = true;
        floorGeometry.computeVertexNormals();
        
        this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.floor.rotation.x = -Math.PI / 2;
        this.floor.receiveShadow = true;
        this.scene.add(this.floor);
        
        return Promise.resolve();
    }
    
    createAdvancedGrid() {
        // Multi-layered grid system
        const gridConfigs = [
            { size: 30, divisions: 30, color1: 0x667eea, color2: 0x334477, opacity: 0.8, height: 0.01 },
            { size: 15, divisions: 15, color1: 0x4ecdc4, color2: 0x226655, opacity: 0.5, height: 0.02 },
            { size: 8, divisions: 8, color1: 0xf093fb, color2: 0x775577, opacity: 0.3, height: 0.03 }
        ];
        
        this.grids = [];
        
        gridConfigs.forEach((config, index) => {
            const grid = new THREE.GridHelper(config.size, config.divisions, config.color1, config.color2);
            grid.material.transparent = true;
            grid.material.opacity = config.opacity;
            grid.position.y = config.height;
            
            // Add glow effect
            grid.material.emissive = new THREE.Color(config.color1);
            grid.material.emissiveIntensity = 0.1;
            
            this.grids.push(grid);
            this.scene.add(grid);
        });
    }
    
    createAdvancedParticles() {
        // Multiple particle systems
        this.createFloatingOrbs();
        this.createEnergyParticles();
        this.createAmbientDust();
    }
    
    createFloatingOrbs() {
        const orbCount = 20;
        this.orbs = [];
        
        for (let i = 0; i < orbCount; i++) {
            const geometry = new THREE.SphereGeometry(0.05, 16, 12);
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
                emissive: new THREE.Color().setHSL(Math.random(), 0.8, 0.3),
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.8
            });
            
            const orb = new THREE.Mesh(geometry, material);
            orb.position.set(
                (Math.random() - 0.5) * 30,
                Math.random() * 10 + 2,
                (Math.random() - 0.5) * 30
            );
            
            // Add custom properties for animation
            orb.userData = {
                initialY: orb.position.y,
                speed: Math.random() * 0.02 + 0.01,
                range: Math.random() * 2 + 1
            };
            
            this.orbs.push(orb);
            this.scene.add(orb);
        }
    }
    
    createEnergyParticles() {
        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Position
            positions[i3] = (Math.random() - 0.5) * 50;
            positions[i3 + 1] = Math.random() * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 50;
            
            // Color
            const hue = Math.random();
            const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Size
            sizes[i] = Math.random() * 0.2 + 0.1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 }
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + sin(time + position.x) * 0.5);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float r = distance(gl_PointCoord, vec2(0.5, 0.5));
                    if (r > 0.5) discard;
                    
                    float alpha = 1.0 - (r * 2.0);
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        this.energyParticles = new THREE.Points(geometry, material);
        this.scene.add(this.energyParticles);
    }
    
    createAmbientDust() {
        // Similar to energy particles but more subtle
        const dustCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(dustCount * 3);
        
        for (let i = 0; i < dustCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 60;
            positions[i + 1] = Math.random() * 25;
            positions[i + 2] = (Math.random() - 0.5) * 60;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x667eea,
            size: 0.02,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        this.ambientDust = new THREE.Points(geometry, material);
        this.scene.add(this.ambientDust);
    }
    
    createAdvancedProps() {
        // Holographic pillars
        this.createHolographicPillars();
        
        // Energy nodes
        this.createEnergyNodes();
        
        // Floating platforms
        this.createFloatingPlatforms();
    }
    
    createHolographicPillars() {
        const pillarPositions = [
            [12, 0, 12], [-12, 0, 12], [12, 0, -12], [-12, 0, -12],
            [18, 0, 0], [-18, 0, 0], [0, 0, 18], [0, 0, -18]
        ];
        
        this.pillars = [];
        
        pillarPositions.forEach((pos, index) => {
            const geometry = new THREE.CylinderGeometry(0.3, 0.5, 4, 8);
            const material = new THREE.MeshStandardMaterial({
                color: 0x4ecdc4,
                emissive: 0x226655,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.7,
                metalness: 0.8,
                roughness: 0.2
            });
            
            const pillar = new THREE.Mesh(geometry, material);
            pillar.position.set(pos[0], pos[1] + 2, pos[2]);
            pillar.castShadow = true;
            
            // Add holographic effect data
            pillar.userData = {
                originalEmissiveIntensity: 0.3,
                pulseSpeed: Math.random() * 0.02 + 0.01
            };
            
            this.pillars.push(pillar);
            this.scene.add(pillar);
        });
    }
    
    createEnergyNodes() {
        const nodePositions = [
            [8, 1, 8], [-8, 1, 8], [8, 1, -8], [-8, 1, -8]
        ];
        
        this.energyNodes = [];
        
        nodePositions.forEach((pos) => {
            const group = new THREE.Group();
            
            // Core
            const coreGeometry = new THREE.SphereGeometry(0.3, 20, 16);
            const coreMaterial = new THREE.MeshStandardMaterial({
                color: 0xffe066,
                emissive: 0xffaa00,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.9
            });
            const core = new THREE.Mesh(coreGeometry, coreMaterial);
            group.add(core);
            
            // Rings
            for (let i = 0; i < 3; i++) {
                const ringGeometry = new THREE.TorusGeometry(0.5 + i * 0.3, 0.02, 8, 32);
                const ringMaterial = new THREE.MeshStandardMaterial({
                    color: 0x667eea,
                    emissive: 0x334477,
                    emissiveIntensity: 0.5,
                    transparent: true,
                    opacity: 0.6
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.rotation.x = Math.random() * Math.PI;
                ring.rotation.y = Math.random() * Math.PI;
                
                // Animation data
                ring.userData = {
                    rotationSpeed: (Math.random() - 0.5) * 0.02,
                    axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize()
                };
                
                group.add(ring);
            }
            
            group.position.set(...pos);
            this.energyNodes.push(group);
            this.scene.add(group);
        });
    }
    
    createFloatingPlatforms() {
        const platformPositions = [
            [6, 0.2, 6], [-6, 0.2, 6], [6, 0.2, -6], [-6, 0.2, -6]
        ];
        
        this.platforms = [];
        
        platformPositions.forEach((pos) => {
            const geometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 12);
            const material = new THREE.MeshStandardMaterial({
                color: 0x667eea,
                metalness: 0.7,
                roughness: 0.3,
                emissive: 0x223366,
                emissiveIntensity: 0.2
            });
            
            const platform = new THREE.Mesh(geometry, material);
            platform.position.set(...pos);
            platform.castShadow = true;
            platform.receiveShadow = true;
            
            // Add floating animation data
            platform.userData = {
                initialY: pos[1],
                floatSpeed: Math.random() * 0.01 + 0.005,
                floatRange: 0.3
            };
            
            this.platforms.push(platform);
            this.scene.add(platform);
        });
    }
    
    createEnergyBarriers() {
        // Create energy barriers around the play area
        const barrierPositions = [
            { pos: [0, 2, 20], rot: [0, 0, 0] },
            { pos: [0, 2, -20], rot: [0, 0, 0] },
            { pos: [20, 2, 0], rot: [0, Math.PI/2, 0] },
            { pos: [-20, 2, 0], rot: [0, Math.PI/2, 0] }
        ];
        
        this.barriers = [];
        
        barrierPositions.forEach((config) => {
            const geometry = new THREE.PlaneGeometry(40, 4, 32, 8);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0.0 },
                    color1: { value: new THREE.Color(0x667eea) },
                    color2: { value: new THREE.Color(0x4ecdc4) }
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color1;
                    uniform vec3 color2;
                    varying vec2 vUv;
                    
                    void main() {
                        float wave = sin(vUv.x * 10.0 + time * 2.0) * sin(vUv.y * 5.0 + time * 1.5);
                        vec3 color = mix(color1, color2, wave * 0.5 + 0.5);
                        float alpha = 0.3 + wave * 0.2;
                        gl_FragColor = vec4(color, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            const barrier = new THREE.Mesh(geometry, material);
            barrier.position.set(...config.pos);
            barrier.rotation.set(...config.rot);
            
            this.barriers.push(barrier);
            this.scene.add(barrier);
        });
    }
    
    async createAdvancedRobot() {
        this.robot = new THREE.Group();
        
        // Advanced PBR materials
        const materials = this.createAdvancedMaterials();
        
        // Create robot parts with enhanced geometry
        await this.createRobotChassis(materials);
        await this.createRobotHead(materials);
        await this.createRobotLimbs(materials);
        await this.createRobotDetails(materials);
        
        // Position robot at origin
        this.robot.position.set(0, 0, 0);
        this.scene.add(this.robot);
        
        // Create robot trail system
        this.createRobotTrail();
        
        this.updateStats();
        return Promise.resolve();
    }
    
    createAdvancedMaterials() {
        return {
            chassis: new THREE.MeshStandardMaterial({
                color: 0x667eea,
                metalness: 0.8,
                roughness: 0.2,
                emissive: 0x223366,
                emissiveIntensity: 0.1
            }),
            head: new THREE.MeshStandardMaterial({
                color: 0x4ecdc4,
                metalness: 0.6,
                roughness: 0.3,
                emissive: 0x226655,
                emissiveIntensity: 0.15
            }),
            limbs: new THREE.MeshStandardMaterial({
                color: 0xf093fb,
                metalness: 0.7,
                roughness: 0.4,
                emissive: 0x775577,
                emissiveIntensity: 0.1
            }),
            details: new THREE.MeshStandardMaterial({
                color: 0xffe066,
                metalness: 0.9,
                roughness: 0.1,
                emissive: 0xffaa00,
                emissiveIntensity: 0.3
            }),
            eyes: new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0x00ffff,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.9
            }),
            glass: new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                metalness: 0.0,
                roughness: 0.0,
                transmission: 0.9,
                transparent: true,
                opacity: 0.3
            })
        };
    }
    
    async createRobotChassis(materials) {
        // Main chassis with more complex geometry
        const chassisGeometry = new THREE.BoxGeometry(2.2, 1.2, 2.8);
        
        // Add some geometric details
        chassisGeometry.translate(0, 0.6, 0);
        
        const chassis = new THREE.Mesh(chassisGeometry, materials.chassis);
        chassis.castShadow = true;
        chassis.receiveShadow = true;
        this.robot.add(chassis);
        this.robotParts.chassis = chassis;
        
        // Add chassis details
        const detailGeometry = new THREE.BoxGeometry(2.0, 0.15, 0.15);
        
        for (let i = 0; i < 3; i++) {
            const detail = new THREE.Mesh(detailGeometry, materials.details);
            detail.position.set(0, 0.4 + i * 0.3, 1.45);
            this.robot.add(detail);
        }
        
        // Energy core
        const coreGeometry = new THREE.SphereGeometry(0.2, 16, 12);
        const core = new THREE.Mesh(coreGeometry, materials.details);
        core.position.set(0, 0.6, 0);
        this.robot.add(core);
        this.robotParts.energyCore = core;
        
        return Promise.resolve();
    }
    
    async createRobotHead(materials) {
        // More sophisticated head design
        const headGroup = new THREE.Group();
        
        // Main head
        const headGeometry = new THREE.BoxGeometry(1.1, 1.1, 1.1);
        const head = new THREE.Mesh(headGeometry, materials.head);
        head.position.set(0, 1.7, 0.2);
        head.castShadow = true;
        head.receiveShadow = true;
        headGroup.add(head);
        this.robotParts.head = head;
        
        // Face screen
        const screenGeometry = new THREE.PlaneGeometry(0.8, 0.6);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            emissive: 0x004444,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 1.7, 0.76);
        headGroup.add(screen);
        this.robotParts.screen = screen;
        
        // Enhanced eyes
        this.createAdvancedEyes(headGroup, materials);
        
        // Antenna array
        this.createAntennaArray(headGroup, materials);
        
        this.robot.add(headGroup);
        return Promise.resolve();
    }
    
    createAdvancedEyes(headGroup, materials) {
        const eyePositions = [[-0.3, 1.8, 0.7], [0.3, 1.8, 0.7]];
        this.robotParts.eyes = [];
        
        eyePositions.forEach((pos, index) => {
            const eyeGroup = new THREE.Group();
            
            // Eye housing
            const housingGeometry = new THREE.SphereGeometry(0.12, 12, 8);
            const housing = new THREE.Mesh(housingGeometry, materials.details);
            eyeGroup.add(housing);
            
            // Eye lens
            const lensGeometry = new THREE.SphereGeometry(0.08, 16, 12);
            const lens = new THREE.Mesh(lensGeometry, materials.glass);
            lens.position.z = 0.04;
            eyeGroup.add(lens);
            
            // Eye light
            const lightGeometry = new THREE.SphereGeometry(0.05, 12, 8);
            const light = new THREE.Mesh(lightGeometry, materials.eyes);
            light.position.z = 0.08;
            eyeGroup.add(light);
            
            eyeGroup.position.set(...pos);
            headGroup.add(eyeGroup);
            this.robotParts.eyes.push(eyeGroup);
        });
    }
    
    createAntennaArray(headGroup, materials) {
        this.robotParts.antennas = [];
        
        for (let i = 0; i < 3; i++) {
            const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.6 + i * 0.2);
            const antenna = new THREE.Mesh(antennaGeometry, materials.details);
            antenna.position.set((i - 1) * 0.3, 2.5 + i * 0.1, 0);
            
            // Antenna tip
            const tipGeometry = new THREE.SphereGeometry(0.05, 8, 6);
            const tip = new THREE.Mesh(tipGeometry, materials.eyes);
            tip.position.set(0, 0.3 + i * 0.1, 0);
            antenna.add(tip);
            
            headGroup.add(antenna);
            this.robotParts.antennas.push(antenna);
        }
    }
    
    async createRobotLimbs(materials) {
        // Enhanced arms with joints
        this.createAdvancedArms(materials);
        
        // Advanced wheel system
        this.createAdvancedWheels(materials);
        
        return Promise.resolve();
    }
    
    createAdvancedArms(materials) {
        const armPositions = [[-1.4, 1.2, 0], [1.4, 1.2, 0]];
        this.robotParts.arms = [];
        
        armPositions.forEach((pos, index) => {
            const armGroup = new THREE.Group();
            
            // Upper arm
            const upperArmGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.8);
            const upperArm = new THREE.Mesh(upperArmGeometry, materials.limbs);
            upperArm.position.y = -0.2;
            upperArm.castShadow = true;
            armGroup.add(upperArm);
            
            // Shoulder joint
            const shoulderGeometry = new THREE.SphereGeometry(0.2, 12, 8);
            const shoulder = new THREE.Mesh(shoulderGeometry, materials.details);
            shoulder.position.y = 0.2;
            armGroup.add(shoulder);
            
            // Lower arm
            const lowerArmGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.6);
            const lowerArm = new THREE.Mesh(lowerArmGeometry, materials.limbs);
            lowerArm.position.y = -0.7;
            lowerArm.castShadow = true;
            armGroup.add(lowerArm);
            
            // Hand
            const handGeometry = new THREE.SphereGeometry(0.15, 12, 8);
            const hand = new THREE.Mesh(handGeometry, materials.details);
            hand.position.y = -1.0;
            hand.castShadow = true;
            armGroup.add(hand);
            
            armGroup.position.set(...pos);
            this.robot.add(armGroup);
            this.robotParts.arms.push(armGroup);
        });
    }
    
    createAdvancedWheels(materials) {
        const wheelPositions = [
            [-1.2, 0.4, 1.2], [1.2, 0.4, 1.2], 
            [-1.2, 0.4, -1.2], [1.2, 0.4, -1.2]
        ];
        
        this.robotParts.wheels = [];
        
        wheelPositions.forEach((pos) => {
            const wheelGroup = new THREE.Group();
            
            // Main wheel
            const wheelGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.25, 16);
            const wheel = new THREE.Mesh(wheelGeometry, materials.limbs);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            wheelGroup.add(wheel);
            
            // Wheel details (spokes)
            for (let i = 0; i < 6; i++) {
                const spokeGeometry = new THREE.BoxGeometry(0.6, 0.05, 0.05);
                const spoke = new THREE.Mesh(spokeGeometry, materials.details);
                spoke.rotation.z = (i / 6) * Math.PI * 2;
                wheelGroup.add(spoke);
            }
            
            // Hub
            const hubGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 8);
            const hub = new THREE.Mesh(hubGeometry, materials.details);
            hub.rotation.z = Math.PI / 2;
            wheelGroup.add(hub);
            
            wheelGroup.position.set(...pos);
            this.robot.add(wheelGroup);
            this.robotParts.wheels.push(wheelGroup);
        });
    }
    
    async createRobotDetails(materials) {
        // LED strips
        this.createLEDStrips(materials);
        
        // Exhaust vents
        this.createExhaustVents(materials);
        
        // Control panels
        this.createControlPanels(materials);
        
        return Promise.resolve();
    }
    
    createLEDStrips(materials) {
        this.robotParts.ledStrips = [];
        
        const stripPositions = [
            { pos: [0, 0.3, 1.45], rot: [0, 0, 0] },
            { pos: [0, 0.9, 1.45], rot: [0, 0, 0] },
            { pos: [1.15, 0.6, 0], rot: [0, Math.PI/2, 0] },
            { pos: [-1.15, 0.6, 0], rot: [0, Math.PI/2, 0] }
        ];
        
        stripPositions.forEach((config) => {
            const stripGeometry = new THREE.BoxGeometry(1.8, 0.05, 0.05);
            const stripMaterial = new THREE.MeshStandardMaterial({
                color: 0x00ffff,
                emissive: 0x004444,
                emissiveIntensity: 0.8
            });
            const strip = new THREE.Mesh(stripGeometry, stripMaterial);
            strip.position.set(...config.pos);
            strip.rotation.set(...config.rot);
            
            this.robotParts.ledStrips.push(strip);
            this.robot.add(strip);
        });
    }
    
    createExhaustVents(materials) {
        this.robotParts.vents = [];
        
        const ventPositions = [[-0.8, 0.2, -1.4], [0.8, 0.2, -1.4]];
        
        ventPositions.forEach((pos) => {
            const ventGroup = new THREE.Group();
            
            // Vent housing
            const housingGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.3);
            const housing = new THREE.Mesh(housingGeometry, materials.details);
            housing.rotation.x = Math.PI / 2;
            ventGroup.add(housing);
            
            // Vent glow
            const glowGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.31);
            const glowMaterial = new THREE.MeshStandardMaterial({
                color: 0xff6600,
                emissive: 0xff3300,
                emissiveIntensity: 0.6,
                transparent: true,
                opacity: 0.8
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.rotation.x = Math.PI / 2;
            ventGroup.add(glow);
            
            ventGroup.position.set(...pos);
            this.robotParts.vents.push(ventGroup);
            this.robot.add(ventGroup);
        });
    }
    
    createControlPanels(materials) {
        this.robotParts.panels = [];
        
        const panelPositions = [
            { pos: [0.8, 0.8, 1.4], rot: [0, 0, 0] },
            { pos: [-0.8, 0.8, 1.4], rot: [0, 0, 0] }
        ];
        
        panelPositions.forEach((config) => {
            const panelGroup = new THREE.Group();
            
            // Panel base
            const baseGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.05);
            const base = new THREE.Mesh(baseGeometry, materials.details);
            panelGroup.add(base);
            
            // Panel screen
            const screenGeometry = new THREE.PlaneGeometry(0.25, 0.35);
            const screenMaterial = new THREE.MeshStandardMaterial({
                color: 0x000000,
                emissive: 0x003300,
                emissiveIntensity: 0.4
            });
            const screen = new THREE.Mesh(screenGeometry, screenMaterial);
            screen.position.z = 0.026;
            panelGroup.add(screen);
            
            panelGroup.position.set(...config.pos);
            panelGroup.rotation.set(...config.rot);
            this.robotParts.panels.push(panelGroup);
            this.robot.add(panelGroup);
        });
    }
    
    createRobotTrail() {
        // Create trail system for robot movement
        const trailGeometry = new THREE.BufferGeometry();
        const trailMaterial = new THREE.LineBasicMaterial({
            color: 0x667eea,
            transparent: true,
            opacity: 0.6
        });
        
        this.robotTrail = new THREE.Line(trailGeometry, trailMaterial);
        this.trailPoints = [];
        this.scene.add(this.robotTrail);
    }
    
    setupAdvancedAnimations() {
        // Setup animation mixer for complex animations
        this.clock = new THREE.Clock();
        
        // Create custom animation clips if needed
        this.setupIdleAnimations();
    }
    
    setupIdleAnimations() {
        // Idle breathing animation for robot
        this.idleAnimations = {
            breathing: { time: 0, speed: 0.01 },
            eyeGlow: { time: 0, speed: 0.02 },
            antennaGlow: { time: 0, speed: 0.015 }
        };
    }
    
    startAdvancedAnimation() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            const deltaTime = this.clock.getDelta();
            const elapsedTime = this.clock.getElapsedTime();
            
            // ⚡ FIXED: Physics update now uses correct flag
            // La física se actualiza en su propio módulo RobotPhysics
            // No necesitamos llamarla aquí porque tiene su propio requestAnimationFrame loop
            
            this.updateAdvancedScene(deltaTime, elapsedTime);
            this.updateRobotAnimations(deltaTime, elapsedTime);
            this.updateEnvironmentAnimations(deltaTime, elapsedTime);
            this.updateParticleAnimations(deltaTime, elapsedTime);
            this.updatePostProcessing(deltaTime, elapsedTime);
            
            this.render();
            this.updatePerformanceStats();
        };
        animate();
    }
    
    updateAdvancedScene(deltaTime, elapsedTime) {
        // Advanced camera movement
        this.updateAdvancedCamera(elapsedTime);
        
        // Update dynamic lighting
        this.updateDynamicLighting(elapsedTime);
        
        // Update skybox
        if (this.skybox && this.skybox.material.uniforms) {
            this.skybox.material.uniforms.time.value = elapsedTime * 0.1;
        }
    }
    
    updateAdvancedCamera(elapsedTime) {
        const radius = 18;
        const height = 10;
        const speed = 0.15;
        
        // Smooth orbital movement with height variation
        this.camera.position.x = Math.cos(elapsedTime * speed) * radius;
        this.camera.position.z = Math.sin(elapsedTime * speed) * radius;
        this.camera.position.y = height + Math.sin(elapsedTime * speed * 0.5) * 3;
        
        // Look at robot with some offset
        const lookAtTarget = this.robot.position.clone();
        lookAtTarget.y += 1;
        this.camera.lookAt(lookAtTarget);
    }
    
    updateDynamicLighting(elapsedTime) {
        // Animate accent lights
        if (this.lights.accents) {
            this.lights.accents.forEach((light, index) => {
                const time = elapsedTime + index * Math.PI * 0.5;
                light.intensity = 1.0 + Math.sin(time * 2) * 0.5;
                
                // Color cycling
                const hue = (time * 0.1 + index * 0.25) % 1;
                light.color.setHSL(hue, 0.8, 0.6);
            });
        }
        
        // Update robot spotlight to follow robot
        if (this.lights.robotSpotlight) {
            this.lights.robotSpotlight.position.set(
                this.robot.position.x,
                this.robot.position.y + 15,
                this.robot.position.z
            );
            this.lights.robotSpotlight.target.position.copy(this.robot.position);
        }
    }
    
    updateRobotAnimations(deltaTime, elapsedTime) {
        if (!this.robotParts) return;
        
        // Idle breathing animation
        this.updateIdleAnimations(elapsedTime);
        
        // Update robot trails
        this.updateRobotTrail();
        
        // Eye animations
        this.updateEyeAnimations(elapsedTime);
        
        // LED strip animations
        this.updateLEDAnimations(elapsedTime);
    }
    
    updateIdleAnimations(elapsedTime) {
        // Subtle breathing effect on chassis
        if (this.robotParts.chassis) {
            const breathe = Math.sin(elapsedTime * 1.5) * 0.02 + 1;
            this.robotParts.chassis.scale.y = breathe;
        }
        
        // Energy core pulsing
        if (this.robotParts.energyCore) {
            const pulse = Math.sin(elapsedTime * 3) * 0.3 + 1;
            this.robotParts.energyCore.scale.setScalar(pulse);
            
            // Color cycling
            const hue = (elapsedTime * 0.2) % 1;
            this.robotParts.energyCore.material.emissive.setHSL(hue, 0.8, 0.4);
        }
        
        // Antenna animations
        if (this.robotParts.antennas) {
            this.robotParts.antennas.forEach((antenna, index) => {
                const time = elapsedTime + index * Math.PI * 0.3;
                antenna.rotation.y = Math.sin(time) * 0.1;
                antenna.rotation.z = Math.cos(time * 0.7) * 0.05;
            });
        }
    }
    
    updateRobotTrail() {
        // Update trail points
        const currentPos = this.robot.position.clone();
        this.trailPoints.push(currentPos);
        
        // Limit trail length
        if (this.trailPoints.length > 50) {
            this.trailPoints.shift();
        }
        
        // Update trail geometry
        if (this.trailPoints.length > 1) {
            const positions = new Float32Array(this.trailPoints.length * 3);
            this.trailPoints.forEach((point, index) => {
                positions[index * 3] = point.x;
                positions[index * 3 + 1] = point.y + 0.1;
                positions[index * 3 + 2] = point.z;
            });
            
            this.robotTrail.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            this.robotTrail.geometry.computeBoundingSphere();
        }
    }
    
    updateEyeAnimations(elapsedTime) {
        if (this.robotParts.eyes) {
            this.robotParts.eyes.forEach((eyeGroup, index) => {
                const time = elapsedTime + index * Math.PI;
                
                // Eye glow pulsing
                const light = eyeGroup.children[2]; // The light mesh
                if (light && light.material) {
                    const intensity = Math.sin(time * 4) * 0.3 + 0.7;
                    light.material.emissiveIntensity = intensity;
                }
                
                // Subtle eye movement
                eyeGroup.rotation.y = Math.sin(time * 0.5) * 0.05;
            });
        }
    }
    
    updateLEDAnimations(elapsedTime) {
        if (this.robotParts.ledStrips) {
            this.robotParts.ledStrips.forEach((strip, index) => {
                const time = elapsedTime + index * Math.PI * 0.25;
                const intensity = Math.sin(time * 6) * 0.4 + 0.6;
                strip.material.emissiveIntensity = intensity;
                
                // Color shifting
                const hue = (time * 0.1 + index * 0.1) % 1;
                strip.material.emissive.setHSL(hue, 0.8, 0.4);
            });
        }
        
        // Vent animations
        if (this.robotParts.vents) {
            this.robotParts.vents.forEach((ventGroup, index) => {
                const glow = ventGroup.children[1];
                if (glow && glow.material) {
                    const time = elapsedTime + index * Math.PI;
                    const intensity = Math.sin(time * 3) * 0.3 + 0.5;
                    glow.material.emissiveIntensity = intensity;
                }
            });
        }
    }
    
    updateEnvironmentAnimations(deltaTime, elapsedTime) {
        // Use environment module if available
        if (this.environment && this.environment.updateEnvironment) {
            this.environment.updateEnvironment(deltaTime, elapsedTime);
        } else {
            // Fallback basic animations
            this.updateBasicEnvironmentAnimations(elapsedTime);
        }
    }
    
    updateBasicEnvironmentAnimations(elapsedTime) {
        // Basic grid animation if using fallback
        this.scene.children.forEach(child => {
            if (child instanceof THREE.GridHelper) {
                child.rotation.y = elapsedTime * 0.05;
            }
        });
    }
    
    updateParticleAnimations(deltaTime, elapsedTime) {
        // Use environment module for particle updates if available
        if (this.environment) {
            // Environment module handles its own particle updates
            return;
        }
        
        // Fallback basic particle updates
        this.scene.children.forEach(child => {
            if (child instanceof THREE.Points) {
                child.rotation.y = elapsedTime * 0.02;
            }
        });
    }
    
    updatePostProcessing(deltaTime, elapsedTime) {
        // Update post-processing effects
        // In a real implementation, this would update effect parameters
        // For now, we'll just log that post-processing is being updated
        if (this.frameCount % 60 === 0) { // Every second
            // Could update bloom intensity, SSAO parameters, etc.
        }
    }
    
    updatePerformanceStats() {
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) { // Every second
            const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            
            // Update performance info
            if (this.onLog && this.frameCount % 300 === 0) { // Every 5 seconds
                this.log(`⚡ FPS: ${fps} | Objetos: ${this.scene.children.length}`);
            }
            
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
    }
    
    render() {
        if (this.composer) {
            // Use post-processing composer if available
            this.composer.render();
        } else {
            // Fallback to basic rendering
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    // Enhanced movement methods with trail effects
    async animateMovement(deltaX, deltaY, deltaZ) {
        return new Promise((resolve) => {
            if (this.isAnimating) {
                resolve();
                return;
            }
            
            this.isAnimating = true;
            this.commandCount++;
            
            const startPos = this.robot.position.clone();
            const endPos = new THREE.Vector3(
                startPos.x + deltaX,
                startPos.y + deltaY,
                startPos.z + deltaZ
            );
            
            // Enhanced boundary checking
            if (Math.abs(endPos.x) > 15 || Math.abs(endPos.z) > 15) {
                this.log('⚠️ Límite del área de trabajo alcanzado!');
                this.createBoundaryEffect(endPos);
                this.isAnimating = false;
                resolve();
                return;
            }
            
            const startTime = Date.now();
            
            // Create movement particle effect
            this.createMovementEffect(startPos, endPos);
            
            const animateStep = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / this.animationSpeed, 1);
                
                const easeProgress = this.easeOutBounce(progress);
                
                this.robot.position.lerpVectors(startPos, endPos, easeProgress);
                
                // Enhanced wheel animation
                this.animateAdvancedWheels(progress * 15);
                
                // Tilt effect during movement
                const tiltAmount = Math.sin(progress * Math.PI) * 0.05;
                this.robot.rotation.x = tiltAmount * (deltaZ / Math.abs(deltaZ || 1));
                this.robot.rotation.z = -tiltAmount * (deltaX / Math.abs(deltaX || 1));
                
                // Enhanced visual effects during movement
                this.updateMovementEffects(progress);
                
                if (progress < 1) {
                    requestAnimationFrame(animateStep);
                } else {
                    this.robotPosition.x = Math.round(endPos.x);
                    this.robotPosition.z = Math.round(endPos.z);
                    this.robot.rotation.x = 0;
                    this.robot.rotation.z = 0;
                    this.updateStats();
                    this.isAnimating = false;
                    this.log(`🚀 Robot movido a (${this.robotPosition.x}, ${this.robotPosition.z})`);
                    resolve();
                }
            };
            
            animateStep();
        });
    }
    
    createMovementEffect(startPos, endPos) {
        // Create particle burst at start position
        const particleCount = 20;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.02, 8, 6);
            const material = new THREE.MeshStandardMaterial({
                color: 0x667eea,
                emissive: 0x334477,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 1.0
            });
            
            const particle = new THREE.Mesh(geometry, material);
            particle.position.copy(startPos);
            particle.position.y += 0.5;
            
            // Random velocity
            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.1,
                    Math.random() * 0.05,
                    (Math.random() - 0.5) * 0.1
                ),
                life: 1.0,
                decay: 0.02
            };
            
            particles.push(particle);
            this.scene.add(particle);
        }
        
        // Animate particles
        const animateParticles = () => {
            let aliveCount = 0;
            
            particles.forEach(particle => {
                if (particle.userData.life > 0) {
                    particle.position.add(particle.userData.velocity);
                    particle.userData.velocity.y -= 0.001; // Gravity
                    particle.userData.life -= particle.userData.decay;
                    particle.material.opacity = particle.userData.life;
                    aliveCount++;
                } else if (particle.parent) {
                    this.scene.remove(particle);
                }
            });
            
            if (aliveCount > 0) {
                requestAnimationFrame(animateParticles);
            }
        };
        
        animateParticles();
    }
    
    createBoundaryEffect(attemptedPos) {
        // Create visual feedback for boundary collision
        const boundaryEffect = new THREE.Mesh(
            new THREE.RingGeometry(0.5, 1.0, 16),
            new THREE.MeshStandardMaterial({
                color: 0xff6b6b,
                emissive: 0xff3333,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.8
            })
        );
        
        boundaryEffect.position.copy(this.robot.position);
        boundaryEffect.rotation.x = -Math.PI / 2;
        this.scene.add(boundaryEffect);
        
        // Animate boundary effect
        let scale = 1.0;
        let opacity = 0.8;
        
        const animateBoundary = () => {
            scale += 0.05;
            opacity -= 0.02;
            
            boundaryEffect.scale.setScalar(scale);
            boundaryEffect.material.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateBoundary);
            } else {
                this.scene.remove(boundaryEffect);
            }
        };
        
        animateBoundary();
    }
    
    animateAdvancedWheels(rotation) {
        if (this.robotParts.wheels) {
            this.robotParts.wheels.forEach(wheelGroup => {
                // Rotate main wheel
                const wheel = wheelGroup.children[0];
                if (wheel) {
                    wheel.rotation.x = rotation;
                }
                
                // Rotate spokes
                wheelGroup.children.forEach((child, index) => {
                    if (index > 0 && index <= 6) { // Spokes
                        child.rotation.z = rotation + (index * Math.PI / 3);
                    }
                });
            });
        }
    }
    
    updateMovementEffects(progress) {
        // Enhanced visual effects during movement
        if (this.robotParts.ledStrips) {
            this.robotParts.ledStrips.forEach(strip => {
                const intensity = 0.8 + Math.sin(progress * Math.PI * 8) * 0.4;
                strip.material.emissiveIntensity = intensity;
            });
        }
        
        // Exhaust effect during movement
        if (this.robotParts.vents) {
            this.robotParts.vents.forEach(ventGroup => {
                const glow = ventGroup.children[1];
                if (glow) {
                    const intensity = 0.6 + Math.sin(progress * Math.PI * 12) * 0.4;
                    glow.material.emissiveIntensity = intensity;
                }
            });
        }
    }
    
    // Enhanced special actions
    async performDance() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.commandCount++;
        this.log('💃 ¡Espectáculo de baile iniciado!');
        
        // Create dance lighting effect
        this.createDanceLighting();
        
        const danceSequence = [
            () => this.danceMove1(),
            () => this.danceMove2(),
            () => this.danceMove3(),
            () => this.danceMove4(),
            () => this.danceFinale()
        ];
        
        for (const move of danceSequence) {
            await move();
            await this.wait(200);
        }
        
        this.removeDanceLighting();
        this.isAnimating = false;
        this.log('✨ ¡Espectáculo completado con éxito!');
    }
    
    createDanceLighting() {
        // Create disco ball effect
        this.discoLights = [];
        const colors = [0xff6b6b, 0x4ecdc4, 0xffe066, 0xf093fb, 0x667eea];
        
        for (let i = 0; i < 5; i++) {
            const light = new THREE.SpotLight(colors[i], 2.0, 30, Math.PI / 8, 0.2);
            light.position.set(
                Math.cos(i * Math.PI * 2 / 5) * 10,
                8,
                Math.sin(i * Math.PI * 2 / 5) * 10
            );
            light.target.position.copy(this.robot.position);
            
            this.discoLights.push(light);
            this.scene.add(light);
            this.scene.add(light.target);
        }
    }
    
    removeDanceLighting() {
        if (this.discoLights) {
            this.discoLights.forEach(light => {
                this.scene.remove(light);
                this.scene.remove(light.target);
            });
            this.discoLights = null;
        }
    }
    
    async danceMove1() {
        // Synchronized arm and light movement
        return Promise.all([
            this.animateArms(Math.PI / 2, -Math.PI / 2, 400),
            this.animateBodyBounce(400),
            this.animateLightShow(400)
        ]);
    }
    
    async danceMove2() {
        return Promise.all([
            this.animateArms(-Math.PI / 4, Math.PI / 4, 300),
            this.animateRotation(90),
            this.animateLEDPulse(300)
        ]);
    }
    
    async danceMove3() {
        return Promise.all([
            this.animateArms(Math.PI / 3, Math.PI / 3, 250),
            this.animateWheelSpin(500),
            this.animateEyeFlash(250)
        ]);
    }
    
    async danceMove4() {
        return Promise.all([
            this.animateRotation(180),
            this.animateArms(0, Math.PI, 400),
            this.animateAntennaWave(400)
        ]);
    }
    
    async danceFinale() {
        return Promise.all([
            this.animateRotation(360),
            this.animateArms(Math.PI / 2, Math.PI / 2, 600),
            this.animateAllEffects(600)
        ]);
    }
    
    async animateLightShow(duration) {
        return new Promise(resolve => {
            if (!this.discoLights) {
                resolve();
                return;
            }
            
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                this.discoLights.forEach((light, index) => {
                    const time = elapsed * 0.01 + index * Math.PI * 0.4;
                    light.intensity = 1.0 + Math.sin(time * 4) * 1.0;
                    
                    // Rotate lights
                    const angle = time * 0.5;
                    light.position.x = Math.cos(angle + index * Math.PI * 2 / 5) * 10;
                    light.position.z = Math.sin(angle + index * Math.PI * 2 / 5) * 10;
                });
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }
    
    async animateLEDPulse(duration) {
        return new Promise(resolve => {
            if (!this.robotParts.ledStrips) {
                resolve();
                return;
            }
            
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                this.robotParts.ledStrips.forEach((strip, index) => {
                    const time = elapsed * 0.01 + index * Math.PI * 0.25;
                    const intensity = Math.sin(time * 8) * 0.5 + 0.5;
                    strip.material.emissiveIntensity = intensity * 2;
                    
                    // Color cycling
                    const hue = (time * 0.2) % 1;
                    strip.material.emissive.setHSL(hue, 0.8, 0.5);
                });
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }
    
    async animateWheelSpin(duration) {
        return new Promise(resolve => {
            if (!this.robotParts.wheels) {
                resolve();
                return;
            }
            
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                const spinSpeed = progress * 30;
                this.animateAdvancedWheels(spinSpeed);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }
    
    async animateEyeFlash(duration) {
        return new Promise(resolve => {
            if (!this.robotParts.eyes) {
                resolve();
                return;
            }
            
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                this.robotParts.eyes.forEach((eyeGroup, index) => {
                    const light = eyeGroup.children[2];
                    if (light && light.material) {
                        const time = elapsed * 0.02 + index * Math.PI;
                        const intensity = Math.sin(time * 15) * 0.5 + 1.0;
                        light.material.emissiveIntensity = intensity;
                        
                        // Color flash
                        const hue = (time * 0.3) % 1;
                        light.material.emissive.setHSL(hue, 1.0, 0.8);
                    }
                });
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }
    
    async animateAntennaWave(duration) {
        return new Promise(resolve => {
            if (!this.robotParts.antennas) {
                resolve();
                return;
            }
            
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                this.robotParts.antennas.forEach((antenna, index) => {
                    const time = elapsed * 0.01 + index * Math.PI * 0.3;
                    antenna.rotation.y = Math.sin(time * 6) * 0.3;
                    antenna.rotation.z = Math.cos(time * 4) * 0.2;
                    
                    // Glow tip
                    const tip = antenna.children[0];
                    if (tip && tip.material) {
                        const intensity = Math.sin(time * 8) * 0.5 + 1.0;
                        tip.material.emissiveIntensity = intensity;
                    }
                });
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }
    
    async animateAllEffects(duration) {
        return Promise.all([
            this.animateLightShow(duration),
            this.animateLEDPulse(duration),
            this.animateEyeFlash(duration),
            this.animateAntennaWave(duration),
            this.createFireworks(duration)
        ]);
    }
    
    async createFireworks(duration) {
        return new Promise(resolve => {
            const fireworkCount = 10;
            
            for (let i = 0; i < fireworkCount; i++) {
                setTimeout(() => {
                    this.createSingleFirework();
                }, (i / fireworkCount) * duration);
            }
            
            setTimeout(resolve, duration);
        });
    }
    
    createSingleFirework() {
        const position = new THREE.Vector3(
            (Math.random() - 0.5) * 20,
            Math.random() * 10 + 5,
            (Math.random() - 0.5) * 20
        );
        
        const particleCount = 30;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.05, 8, 6);
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
                emissive: new THREE.Color().setHSL(Math.random(), 0.8, 0.4),
                emissiveIntensity: 1.0,
                transparent: true,
                opacity: 1.0
            });
            
            const particle = new THREE.Mesh(geometry, material);
            particle.position.copy(position);
            
            // Random explosion velocity
            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.3,
                    Math.random() * 0.2,
                    (Math.random() - 0.5) * 0.3
                ),
                life: 1.0,
                decay: 0.02
            };
            
            particles.push(particle);
            this.scene.add(particle);
        }
        
        // Animate firework particles
        const animateFirework = () => {
            let aliveCount = 0;
            
            particles.forEach(particle => {
                if (particle.userData.life > 0) {
                    particle.position.add(particle.userData.velocity);
                    particle.userData.velocity.y -= 0.005; // Gravity
                    particle.userData.life -= particle.userData.decay;
                    particle.material.opacity = particle.userData.life;
                    particle.scale.setScalar(particle.userData.life);
                    aliveCount++;
                } else if (particle.parent) {
                    this.scene.remove(particle);
                }
            });
            
            if (aliveCount > 0) {
                requestAnimationFrame(animateFirework);
            }
        };
        
        animateFirework();
    }
    
    // Physics integration (enhanced)
    initPhysics() {
        if (typeof RobotPhysics !== 'undefined') {
            try {
                this.physics = new RobotPhysics(this);
                this.physics.setEventListeners({
                    onCollision: (type, object) => {
                        this.log(`💥 Colisión detectada: ${type}`);
                        this.createCollisionEffect(object);
                    },
                    onFall: () => {
                        this.log('⚠️ Robot en caída libre - Activando sistemas de emergencia');
                        this.createFallEffect();
                    },
                    onStuck: () => {
                        this.log('🚫 Robot bloqueado - Iniciando secuencia de liberación');
                        this.createStuckEffect();
                    }
                });
                this.log('⚡ Sistema de física avanzado cargado');
            } catch (error) {
                console.warn('Advanced physics failed:', error);
                this.log('⚠️ Física avanzada no disponible - Modo estándar');
            }
        } else {
            this.log('ℹ️ Sistema de física no encontrado - Modo visual');
        }
    }
    
    createCollisionEffect(position) {
        // Enhanced collision visual feedback
        const effect = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16, 12),
            new THREE.MeshStandardMaterial({
                color: 0xff6b6b,
                emissive: 0xff3333,
                emissiveIntensity: 1.0,
                transparent: true,
                opacity: 0.8
            })
        );
        
        effect.position.copy(position);
        this.scene.add(effect);
        
        // Animate collision effect
        let scale = 0.1;
        let opacity = 0.8;
        
        const animate = () => {
            scale += 0.1;
            opacity -= 0.05;
            
            effect.scale.setScalar(scale);
            effect.material.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(effect);
            }
        };
        
        animate();
    }
    
    // Enhanced event handling
    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Add performance monitoring
        window.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.log('⏸️ Aplicación pausada');
            } else {
                this.log('▶️ Aplicación reanudada');
            }
        });
    }
    
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        
        // Update post-processing if available
        if (this.composer) {
            this.composer.setSize(width, height);
        }
        
        this.log(`📐 Ventana redimensionada: ${width}x${height}`);
    }
    
    // Enhanced public API
    getAdvancedStats() {
        const basicStats = this.getStats();
        
        // Add advanced stats
        basicStats.renderInfo = this.renderer.info;
        basicStats.sceneObjects = this.scene.children.length;
        basicStats.activeLights = Object.keys(this.lights).length;
        
        if (this.orbs) {
            basicStats.particleCount = this.orbs.length;
        }
        
        return basicStats;
    }
    
    // Enhanced cleanup
    dispose() {
        this.log('🧹 Limpiando recursos avanzados...');
        
        // Stop physics loop
        if (this.physicsLoopId) {
            cancelAnimationFrame(this.physicsLoopId);
            this.physicsLoopId = null;
        }
        
        // Dispose environment module
        if (this.environment && this.environment.dispose) {
            this.environment.dispose();
        }
        
        // Dispose of advanced resources
        if (this.composer) {
            this.composer.dispose();
        }
        
        if (this.renderTarget) {
            this.renderTarget.dispose();
        }
        
        // Clean up trails
        if (this.robotTrail) {
            this.scene.remove(this.robotTrail);
            this.robotTrail.geometry.dispose();
            this.robotTrail.material.dispose();
        }
        
        // Clean up physics
        if (this.physics && this.physics.dispose) {
            this.physics.dispose();
        }
        
        // Standard cleanup
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.scene) {
            this.scene.clear();
        }
        
        window.removeEventListener('resize', this.onWindowResize);
        
        this.log('✅ Limpieza completada');
    }
    
    // Maintain compatibility with existing interface
    moveForward(distance = 1) {
        if (this.physics && this.physicsEnabled) {
            return this.physics.moveForwardPhysics(distance);
        }
        return this.animateMovement(0, 0, distance);
    }
    
    moveBackward(distance = 1) {
        if (this.physics && this.physicsEnabled) {
            return this.physics.moveForwardPhysics(-distance);
        }
        return this.animateMovement(0, 0, -distance);
    }
    
    moveLeft(distance = 1) {
        return this.animateMovement(-distance, 0, 0);
    }
    
    moveRight(distance = 1) {
        return this.animateMovement(distance, 0, 0);
    }
    
    rotateLeft(degrees = 90) {
        if (this.physics && this.physicsEnabled) {
            return this.physics.rotatePhysics(-degrees);
        }
        return this.animateRotation(-degrees);
    }
    
    rotateRight(degrees = 90) {
        if (this.physics && this.physicsEnabled) {
            return this.physics.rotatePhysics(degrees);
        }
        return this.animateRotation(degrees);
    }
    
    async animateRotation(degrees) {
        return new Promise((resolve) => {
            if (this.isAnimating) {
                resolve();
                return;
            }
            
            this.isAnimating = true;
            this.commandCount++;
            
            const startRotation = this.robot.rotation.y;
            const endRotation = startRotation + (degrees * Math.PI / 180);
            const startTime = Date.now();
            
            // Create rotation effect
            this.createRotationEffect();
            
            const animateStep = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / this.rotationSpeed, 1);
                
                const easeProgress = this.easeOutCubic(progress);
                
                this.robot.rotation.y = startRotation + (endRotation - startRotation) * easeProgress;
                
                // Enhanced visual effects during rotation
                this.updateRotationEffects(progress);
                
                if (progress < 1) {
                    requestAnimationFrame(animateStep);
                } else {
                    this.robotRotation = (this.robotRotation + degrees) % 360;
                    if (this.robotRotation < 0) this.robotRotation += 360;
                    this.updateStats();
                    this.isAnimating = false;
                    this.log(`🔄 Rotación ${degrees}° completada (${this.robotRotation}°)`);
                    resolve();
                }
            };
            
            animateStep();
        });
    }
    
    createRotationEffect() {
        // Create swirl effect during rotation
        const swirlGeometry = new THREE.RingGeometry(1.0, 2.0, 16);
        const swirlMaterial = new THREE.MeshStandardMaterial({
            color: 0x667eea,
            emissive: 0x334477,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.6
        });
        
        this.rotationEffect = new THREE.Mesh(swirlGeometry, swirlMaterial);
        this.rotationEffect.position.copy(this.robot.position);
        this.rotationEffect.position.y += 0.1;
        this.rotationEffect.rotation.x = -Math.PI / 2;
        
        this.scene.add(this.rotationEffect);
    }
    
    updateRotationEffects(progress) {
        if (this.rotationEffect) {
            this.rotationEffect.rotation.z = progress * Math.PI * 4;
            this.rotationEffect.scale.setScalar(1 + progress * 0.5);
            this.rotationEffect.material.opacity = 0.6 * (1 - progress);
            
            if (progress >= 1) {
                this.scene.remove(this.rotationEffect);
                this.rotationEffect = null;
            }
        }
        
        // Enhanced LED effects during rotation
        if (this.robotParts.ledStrips) {
            this.robotParts.ledStrips.forEach((strip, index) => {
                const time = progress * Math.PI * 8 + index * Math.PI * 0.25;
                const intensity = Math.sin(time) * 0.5 + 1.0;
                strip.material.emissiveIntensity = intensity;
            });
        }
    }
    
    // Enhanced helper methods
    async performWave() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.commandCount++;
        this.log('👋 Iniciando saludo avanzado');
        
        // Enhanced wave sequence
        await this.animateArms(Math.PI / 2, 0, 400);
        await this.wait(300);
        
        // Wave with particle effects
        for (let i = 0; i < 4; i++) {
            await Promise.all([
                this.animateArms(Math.PI / 3, 0, 250),
                this.createWaveParticles()
            ]);
            await this.animateArms(Math.PI / 2, 0, 250);
        }
        
        await this.animateArms(0, 0, 400);
        
        this.isAnimating = false;
        this.log('✋ Saludo avanzado completado');
    }
    
    async createWaveParticles() {
        const handPosition = this.robotParts.arms[1].position.clone();
        handPosition.add(this.robot.position);
        handPosition.y += 1;
        
        for (let i = 0; i < 5; i++) {
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(0.03, 8, 6),
                new THREE.MeshStandardMaterial({
                    color: 0x4ecdc4,
                    emissive: 0x226655,
                    emissiveIntensity: 0.8,
                    transparent: true,
                    opacity: 1.0
                })
            );
            
            particle.position.copy(handPosition);
            particle.userData = {
                velocity: new THREE.Vector3(
                    Math.random() * 0.1,
                    Math.random() * 0.05 + 0.02,
                    Math.random() * 0.1
                ),
                life: 1.0
            };
            
            this.scene.add(particle);
            
            // Animate particle
            const animateParticle = () => {
                particle.position.add(particle.userData.velocity);
                particle.userData.life -= 0.02;
                particle.material.opacity = particle.userData.life;
                particle.scale.setScalar(particle.userData.life);
                
                if (particle.userData.life > 0) {
                    requestAnimationFrame(animateParticle);
                } else {
                    this.scene.remove(particle);
                }
            };
            
            setTimeout(animateParticle, i * 100);
        }
    }
    
    async reset() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.log('🏠 Iniciando secuencia de reinicio avanzada...');
        
        // Create teleport effect
        await this.createTeleportEffect();
        
        // Reset position with dramatic effect
        const startPos = this.robot.position.clone();
        const endPos = new THREE.Vector3(0, 0, 0);
        const startRot = this.robot.rotation.y;
        const endRot = 0;
        
        const duration = 2000;
        const startTime = Date.now();
        
        const animateStep = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = this.easeOutCubic(progress);
            
            this.robot.position.lerpVectors(startPos, endPos, easeProgress);
            this.robot.rotation.y = startRot + (endRot - startRot) * easeProgress;
            
            // Enhanced reset effects
            this.updateResetEffects(progress);
            
            if (progress < 1) {
                requestAnimationFrame(animateStep);
            } else {
                this.robotPosition = { x: 0, z: 0 };
                this.robotRotation = 0;
                this.resetAllAnimations();
                this.updateStats();
                this.isAnimating = false;
                this.log('✅ Reinicio avanzado completado');
            }
        };
        
        animateStep();
    }
    
    async createTeleportEffect() {
        return new Promise(resolve => {
            // Teleport-out effect
            const teleportOut = new THREE.Mesh(
                new THREE.CylinderGeometry(0, 2, 6, 16),
                new THREE.MeshStandardMaterial({
                    color: 0x4ecdc4,
                    emissive: 0x226655,
                    emissiveIntensity: 1.0,
                    transparent: true,
                    opacity: 0.8
                })
            );
            
            teleportOut.position.copy(this.robot.position);
            teleportOut.position.y = 3;
            this.scene.add(teleportOut);
            
            // Animate teleport out
            let scale = 1;
            let opacity = 0.8;
            
            const animateOut = () => {
                scale += 0.1;
                opacity -= 0.05;
                
                teleportOut.scale.setScalar(scale);
                teleportOut.material.opacity = opacity;
                teleportOut.rotation.y += 0.2;
                
                if (opacity > 0) {
                    requestAnimationFrame(animateOut);
                } else {
                    this.scene.remove(teleportOut);
                    
                    // Create teleport-in effect at origin
                    setTimeout(() => {
                        this.createTeleportInEffect();
                        resolve();
                    }, 500);
                }
            };
            
            animateOut();
        });
    }
    
    createTeleportInEffect() {
        const teleportIn = new THREE.Mesh(
            new THREE.CylinderGeometry(2, 0, 6, 16),
            new THREE.MeshStandardMaterial({
                color: 0x667eea,
                emissive: 0x334477,
                emissiveIntensity: 1.0,
                transparent: true,
                opacity: 0.8
            })
        );
        
        teleportIn.position.set(0, 3, 0);
        this.scene.add(teleportIn);
        
        // Animate teleport in
        let scale = 3;
        let opacity = 0.8;
        
        const animateIn = () => {
            scale -= 0.1;
            opacity -= 0.04;
            
            teleportIn.scale.setScalar(scale);
            teleportIn.material.opacity = opacity;
            teleportIn.rotation.y -= 0.15;
            
            if (scale > 0 && opacity > 0) {
                requestAnimationFrame(animateIn);
            } else {
                this.scene.remove(teleportIn);
            }
        };
        
        animateIn();
    }
    
    updateResetEffects(progress) {
        // Rainbow trail effect during reset
        if (this.robotParts.ledStrips) {
            this.robotParts.ledStrips.forEach((strip, index) => {
                const hue = (progress + index * 0.1) % 1;
                strip.material.emissive.setHSL(hue, 1.0, 0.5);
                strip.material.emissiveIntensity = 1.0 + Math.sin(progress * Math.PI * 8) * 0.5;
            });
        }
        
        // Sparkle effect on robot
        if (Math.random() < 0.3) {
            this.createSparkle();
        }
    }
    
    createSparkle() {
        const sparkle = new THREE.Mesh(
            new THREE.SphereGeometry(0.02, 8, 6),
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 1.0,
                transparent: true,
                opacity: 1.0
            })
        );
        
        sparkle.position.copy(this.robot.position);
        sparkle.position.add(new THREE.Vector3(
            (Math.random() - 0.5) * 3,
            Math.random() * 2,
            (Math.random() - 0.5) * 3
        ));
        
        this.scene.add(sparkle);
        
        // Animate sparkle
        let life = 1.0;
        const animate = () => {
            life -= 0.05;
            sparkle.material.opacity = life;
            sparkle.scale.setScalar(life);
            sparkle.rotation.x += 0.1;
            sparkle.rotation.y += 0.1;
            
            if (life > 0) {
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(sparkle);
            }
        };
        
        animate();
    }
    
    resetAllAnimations() {
        // Reset all robot parts to default state
        if (this.robotParts.arms) {
            this.robotParts.arms.forEach(arm => {
                arm.rotation.set(0, 0, 0);
            });
        }
        
        if (this.robotParts.head) {
            this.robotParts.head.rotation.set(0, 0, 0);
        }
        
        if (this.robotParts.ledStrips) {
            this.robotParts.ledStrips.forEach(strip => {
                strip.material.emissive.setHex(0x004444);
                strip.material.emissiveIntensity = 0.8;
            });
        }
        
        // Reset any ongoing effects
        this.robot.rotation.set(0, 0, 0);
        this.robot.scale.set(1, 1, 1);
    }
    
    // Enhanced helper animation methods
    animateArms(leftAngle, rightAngle, duration = 300) {
        return new Promise((resolve) => {
            if (!this.robotParts.arms) {
                resolve();
                return;
            }
            
            const startTime = Date.now();
            const startAngles = this.robotParts.arms.map(arm => arm.rotation.z);
            const targetAngles = [leftAngle, rightAngle];
            
            const animateStep = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeProgress = this.easeOutCubic(progress);
                
                this.robotParts.arms.forEach((arm, index) => {
                    const startAngle = startAngles[index];
                    const targetAngle = targetAngles[index];
                    arm.rotation.z = startAngle + (targetAngle - startAngle) * easeProgress;
                    
                    // Add joint movement
                    const shoulder = arm.children[1]; // Shoulder joint
                    if (shoulder) {
                        shoulder.rotation.y = Math.sin(progress * Math.PI * 2) * 0.1;
                    }
                });
                
                if (progress < 1) {
                    requestAnimationFrame(animateStep);
                } else {
                    resolve();
                }
            };
            
            animateStep();
        });
    }
    
    animateBodyBounce(duration = 500) {
        return new Promise((resolve) => {
            if (!this.robotParts.chassis) {
                resolve();
                return;
            }
            
            const startTime = Date.now();
            const originalY = this.robotParts.chassis.position.y;
            
            const animateStep = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const bounceHeight = Math.sin(progress * Math.PI * 6) * 0.3;
                this.robotParts.chassis.position.y = originalY + Math.abs(bounceHeight);
                
                // Add scale effect
                const scale = 1 + Math.sin(progress * Math.PI * 6) * 0.05;
                this.robotParts.chassis.scale.set(1, scale, 1);
                
                if (progress < 1) {
                    requestAnimationFrame(animateStep);
                } else {
                    this.robotParts.chassis.position.y = originalY;
                    this.robotParts.chassis.scale.set(1, 1, 1);
                    resolve();
                }
            };
            
            animateStep();
        });
    }
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Enhanced easing functions
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    easeOutBounce(t) {
        const n1 = 7.5625;
        const d1 = 2.75;
        
        if (t < 1 / d1) {
            return n1 * t * t;
        } else if (t < 2 / d1) {
            return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
            return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
            return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
    }
    
    easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    }
    
    easeOutElastic(t) {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }
    
    // Advanced stats and logging
    updateStats() {
        if (this.onStatsUpdate) {
            this.onStatsUpdate({
                x: this.robotPosition.x,
                z: this.robotPosition.z,
                rotation: this.robotRotation,
                commands: this.commandCount,
                physicsEnabled: this.physicsEnabled,
                performance: {
                    fps: this.getCurrentFPS(),
                    objects: this.scene.children.length,
                    drawCalls: this.renderer.info.render.calls
                }
            });
        }
    }
    
    getCurrentFPS() {
        // Simple FPS calculation
        const now = performance.now();
        if (this.lastFPSCheck) {
            const delta = now - this.lastFPSCheck;
            this.currentFPS = Math.round(1000 / delta);
        }
        this.lastFPSCheck = now;
        return this.currentFPS || 60;
    }
    
    log(message) {
        const timestamp = new Date().toLocaleTimeString();
        const formattedMessage = `[${timestamp}] ${message}`;
        
        if (this.onLog) {
            this.onLog(formattedMessage);
        }
        
        console.log(`Robot3D: ${formattedMessage}`);
    }
    
    // Public API methods (enhanced)
    setStatsCallback(callback) {
        this.onStatsUpdate = callback;
    }
    
    setLogCallback(callback) {
        this.onLog = callback;
    }
    
    getStats() {
        const basicStats = {
            x: this.robotPosition.x,
            z: this.robotPosition.z,
            rotation: this.robotRotation,
            commands: this.commandCount,
            physicsEnabled: this.physicsEnabled,
            isAnimating: this.isAnimating,
            performance: {
                fps: this.getCurrentFPS(),
                objects: this.scene.children.length,
                triangles: this.renderer.info.render.triangles,
                drawCalls: this.renderer.info.render.calls,
                memory: this.renderer.info.memory
            }
        };
        
        if (this.physics && this.physicsEnabled) {
            const physicsStats = this.physics.getPhysicsStats();
            if (physicsStats) {
                basicStats.velocity = physicsStats.velocity.length().toFixed(2);
                basicStats.mass = physicsStats.mass;
                basicStats.energy = physicsStats.energy;
            }
        }
        
        return basicStats;
    }
    
    isRobotAnimating() {
        return this.isAnimating;
    }
    
    isPhysicsEnabled() {
        return this.physicsEnabled;
    }
    
    // Command queue system for programming (enhanced)
    async executeCommandQueue(commands) {
        this.commandQueue = [...commands];
        this.log(`📋 Ejecutando programa con ${commands.length} comandos`);
        
        let commandIndex = 0;
        
        while (this.commandQueue.length > 0) {
            const command = this.commandQueue.shift();
            commandIndex++;
            
            this.log(`⚡ Ejecutando comando ${commandIndex}/${commands.length}: ${this.getCommandDescription(command)}`);
            
            try {
                await this.executeCommand(command);
            } catch (error) {
                this.log(`❌ Error en comando ${commandIndex}: ${error.message}`);
                break;
            }
        }
        
        this.log('✅ Programa completado exitosamente');
    }
    
    getCommandDescription(command) {
        switch (command.type) {
            case 'move':
                return `mover ${command.direction} ${command.distance || 1} unidad(es)`;
            case 'rotate':
                return `rotar ${command.angle}°`;
            case 'action':
                return `acción: ${command.action}`;
            case 'wait':
                return `esperar ${command.duration}ms`;
            default:
                return 'comando desconocido';
        }
    }
    
    async executeCommand(command) {
        switch (command.type) {
            case 'move':
                switch (command.direction) {
                    case 'forward':
                        await this.moveForward(command.distance || 1);
                        break;
                    case 'backward':
                        await this.moveBackward(command.distance || 1);
                        break;
                    case 'left':
                        await this.moveLeft(command.distance || 1);
                        break;
                    case 'right':
                        await this.moveRight(command.distance || 1);
                        break;
                    default:
                        throw new Error(`Dirección de movimiento desconocida: ${command.direction}`);
                }
                
                // ⚡ FIXED: Add delay between movements for better visualization
                if (command.distance && command.distance > 1) {
                    await this.wait(300); // Extra pause for multi-step movements
                }
                break;
                
            case 'rotate':
                if (command.angle > 0) {
                    await this.rotateRight(command.angle);
                } else {
                    await this.rotateLeft(Math.abs(command.angle));
                }
                
                // Small delay after rotation
                await this.wait(200);
                break;
                
            case 'action':
                switch (command.action) {
                    case 'dance':
                        await this.performDance();
                        break;
                    case 'wave':
                        await this.performWave();
                        break;
                    case 'reset':
                        await this.reset();
                        break;
                    case 'stop':
                        this.log('🛑 Robot detenido');
                        break;
                    default:
                        throw new Error(`Acción desconocida: ${command.action}`);
                }
                break;
                
            case 'effect':
                switch (command.effect) {
                    case 'fireworks':
                        await this.createFireworks(2000);
                        break;
                    case 'enablePhysics':
                        this.enablePhysics();
                        await this.wait(500); // Time to process physics change
                        break;
                    case 'disablePhysics':
                        this.disablePhysics();
                        await this.wait(500);
                        break;
                    case 'jump':
                        this.jump(50);
                        await this.wait(1500); // Wait for jump to complete
                        break;
                    case 'advancedMode':
                        if (this.enableAdvancedMode) {
                            this.enableAdvancedMode();
                        } else {
                            this.log('🚀 Modo futurista activado (básico)');
                        }
                        await this.wait(800);
                        break;
                    case 'particles':
                        this.createAdditionalParticles();
                        await this.wait(500);
                        break;
                    case 'quantumField':
                        this.createQuantumField();
                        await this.wait(500);
                        break;
                    case 'gravity':
                        if (command.value !== undefined) {
                            this.setGravity(command.value);
                            await this.wait(300);
                        }
                        break;
                    case 'addObstacle':
                        if (command.obstacleType && command.position) {
                            const pos = new THREE.Vector3(
                                command.position.x,
                                command.position.y,
                                command.position.z
                            );
                            this.addObstacle(command.obstacleType, pos);
                            await this.wait(300);
                        }
                        break;
                    default:
                        this.log(`⚠️ Efecto desconocido: ${command.effect}`);
                }
                break;
                
            case 'environment':
                if (this.environment) {
                    switch (command.preset) {
                        case 'minimal':
                        case 'standard':
                        case 'advanced':
                            this.environment.setEnvironmentPreset(command.preset);
                            await this.wait(800);
                            break;
                    }
                    
                    switch (command.action) {
                        case 'toggleGrids':
                            this.environment.toggleGrids();
                            await this.wait(300);
                            break;
                        case 'toggleParticles':
                            this.environment.toggleParticles();
                            await this.wait(300);
                            break;
                    }
                } else {
                    this.log('⚠️ Módulo de entorno no disponible');
                }
                break;
                
            case 'wait':
                await this.wait(command.duration || 1000);
                break;
                
            default:
                throw new Error(`Tipo de comando desconocido: ${command.type}`);
        }
    }
    
    // Advanced features - Now using environment module
    async enableAdvancedMode() {
        this.log('🚀 Activando modo avanzado...');
        
        // Enable all advanced features
        this.advancedMode = true;
        
        // Enhanced lighting
        if (this.lights.accents) {
            this.lights.accents.forEach(light => {
                light.intensity *= 1.5;
            });
        }
        
        // Use environment module for advanced effects
        if (this.environment && this.environment.enableAdvancedMode) {
            this.environment.enableAdvancedMode();
        }
        
        // Enhanced materials
        this.upgradeRobotMaterials();
        
        this.log('✨ Modo avanzado activado');
    }
    
    createQuantumField() {
        if (this.environment && this.environment.createQuantumField) {
            this.environment.createQuantumField();
        } else {
            this.log('⚠️ Módulo de entorno no disponible para campo cuántico');
        }
    }
    
    createAdditionalParticles() {
        if (this.environment) {
            if (this.environment.createQuantumField) {
                this.environment.createQuantumField();
            }
            if (this.environment.createEnergyFlow) {
                this.environment.createEnergyFlow();
            }
        } else {
            this.log('⚠️ Módulo de entorno no disponible para partículas');
        }
    }
    
    upgradeRobotMaterials() {
        // Upgrade robot materials for advanced mode
        if (this.robotParts.chassis) {
            this.robotParts.chassis.material.emissiveIntensity = 0.2;
            this.robotParts.chassis.material.metalness = 0.9;
            this.robotParts.chassis.material.roughness = 0.1;
        }
        
        if (this.robotParts.head) {
            this.robotParts.head.material.emissiveIntensity = 0.25;
        }
        
        if (this.robotParts.arms) {
            this.robotParts.arms.forEach(arm => {
                arm.children.forEach(part => {
                    if (part.material) {
                        part.material.emissiveIntensity = 0.15;
                    }
                });
            });
        }
    }
    
    // Physics loop
    startPhysicsLoop() {
        if (this.physicsLoopId) {
            cancelAnimationFrame(this.physicsLoopId);
        }
        
        const physicsUpdate = () => {
            if (this.physics && this.physics.enabled) {
                const deltaTime = this.clock.getDelta();
                this.physics.update(deltaTime);
                this.physicsLoopId = requestAnimationFrame(physicsUpdate);
            }
        };
        
        physicsUpdate();
    }
    
    // Physics visual effects
    createJumpEffect() {
        const jumpEffect = new THREE.Mesh(
            new THREE.RingGeometry(0.5, 1.5, 16),
            new THREE.MeshStandardMaterial({
                color: 0x4ecdc4,
                emissive: 0x226655,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.8
            })
        );
        
        jumpEffect.position.copy(this.robot.position);
        jumpEffect.rotation.x = -Math.PI / 2;
        this.scene.add(jumpEffect);
        
        // Animate jump effect
        let scale = 1;
        let opacity = 0.8;
        
        const animate = () => {
            scale += 0.1;
            opacity -= 0.05;
            
            jumpEffect.scale.setScalar(scale);
            jumpEffect.material.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(jumpEffect);
            }
        };
        
        animate();
    }
    
    createLandingEffect() {
        const landingEffect = new THREE.Mesh(
            new THREE.CylinderGeometry(0, 1, 0.2, 12),
            new THREE.MeshStandardMaterial({
                color: 0xffe066,
                emissive: 0xffaa00,
                emissiveIntensity: 1.0,
                transparent: true,
                opacity: 0.9
            })
        );
        
        landingEffect.position.copy(this.robot.position);
        landingEffect.position.y = 0.1;
        this.scene.add(landingEffect);
        
        // Animate landing effect
        let scale = 0.1;
        let opacity = 0.9;
        
        const animate = () => {
            scale += 0.2;
            opacity -= 0.1;
            
            landingEffect.scale.setScalar(scale);
            landingEffect.material.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(landingEffect);
            }
        };
        
        animate();
    }
    
    createVisualObstacle(obstacle) {
        let geometry;
        switch (obstacle.type) {
            case 'box':
                geometry = new THREE.BoxGeometry(
                    obstacle.size.x, 
                    obstacle.size.y, 
                    obstacle.size.z
                );
                break;
            case 'sphere':
                geometry = new THREE.SphereGeometry(obstacle.size.x, 16, 12);
                break;
            case 'cylinder':
                geometry = new THREE.CylinderGeometry(
                    obstacle.size.x, 
                    obstacle.size.x, 
                    obstacle.size.y, 
                    16
                );
                break;
            default:
                geometry = new THREE.BoxGeometry(1, 1, 1);
        }
        
        const material = new THREE.MeshStandardMaterial({
            color: 0xff6b6b,
            emissive: 0x331111,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.8
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(obstacle.position);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData.obstacleId = obstacle.id;
        
        this.scene.add(mesh);
    }
    
    removeVisualObstacle(obstacle) {
        const meshToRemove = this.scene.children.find(
            child => child.userData && child.userData.obstacleId === obstacle.id
        );
        
        if (meshToRemove) {
            this.scene.remove(meshToRemove);
            meshToRemove.geometry.dispose();
            meshToRemove.material.dispose();
        }
    }
    
    handleCollision(obstacle) {
        // Create collision effect
        this.createCollisionEffect(obstacle.position);
        
        // Push robot away from obstacle
        const pushDirection = this.robot.position.clone()
            .sub(obstacle.position)
            .normalize()
            .multiplyScalar(2);
        
        if (this.physics && this.physics.enabled) {
            this.physics.applyForce(pushDirection);
        }
        
        this.log(`💥 Colisión con obstáculo ${obstacle.type}`);
    }
    
    checkBoundaries() {
        const boundary = 15;
        const pos = this.robot.position;
        
        if (Math.abs(pos.x) > boundary || Math.abs(pos.z) > boundary) {
            // Push back towards center
            const pushDirection = new THREE.Vector3(-pos.x, 0, -pos.z)
                .normalize()
                .multiplyScalar(5);
            
            if (this.physics && this.physics.enabled) {
                this.physics.applyForce(pushDirection);
            }
            
            this.createBoundaryEffect(pos.clone());
        }
    }
    
    // Enhanced physics control methods
    enablePhysics() {
        if (this.physics) {
            this.physics.enablePhysics();
            this.physicsEnabled = true;
            return true;
        }
        this.log('❌ Sistema de física no inicializado');
        return false;
    }
    
    disablePhysics() {
        if (this.physics) {
            this.physics.disablePhysics();
            this.physicsEnabled = false;
            if (this.physicsLoopId) {
                cancelAnimationFrame(this.physicsLoopId);
                this.physicsLoopId = null;
            }
            return true;
        }
        return false;
    }
    
    jump(force = 50) {
        if (this.physics) {
            this.physics.jump(force);
            return true;
        }
        this.log('❌ Salto requiere sistema de física');
        return false;
    }
    
    setGravity(gravity) {
        if (this.physics) {
            this.physics.setGravity(gravity);
            return true;
        }
        return false;
    }
    
    setFriction(friction) {
        if (this.physics) {
            this.physics.setFriction(friction);
            return true;
        }
        return false;
    }
    
    addObstacle(type, position, options = {}) {
        if (this.physics) {
            return this.physics.addObstacle(type, position, options);
        }
        return null;
    }
    
    removeObstacle(obstacle) {
        if (this.physics) {
            return this.physics.removeObstacle(obstacle);
        }
        return false;
    }
    
    // Maintenance and optimization
    optimizePerformance() {
        this.log('🔧 Optimizando rendimiento...');
        
        // Reduce particle count if FPS is low
        const currentFPS = this.getCurrentFPS();
        if (currentFPS < 30) {
            this.reduceParticleCount();
            this.log('⚡ Partículas reducidas para mejorar rendimiento');
        }
        
        // Optimize shadow quality based on performance
        if (currentFPS < 45) {
            this.optimizeShadows();
            this.log('🌑 Calidad de sombras optimizada');
        }
        
        // Clean up old trails
        if (this.trailPoints.length > 100) {
            this.trailPoints = this.trailPoints.slice(-50);
            this.log('🧹 Cache de rastros limpiado');
        }
    }
    
    reduceParticleCount() {
        if (this.orbs && this.orbs.length > 10) {
            const toRemove = this.orbs.splice(10);
            toRemove.forEach(orb => {
                this.scene.remove(orb);
                orb.geometry.dispose();
                orb.material.dispose();
            });
        }
    }
    
    optimizeShadows() {
        if (this.lights.main) {
            this.lights.main.shadow.mapSize.width = 2048;
            this.lights.main.shadow.mapSize.height = 2048;
        }
    }
    
    // Debug and development tools
    enableDebugMode() {
        this.debugMode = true;
        this.log('🐛 Modo debug activado');
        
        // Add debug helpers
        this.addDebugHelpers();
    }
    
    addDebugHelpers() {
        // Camera helper
        if (this.lights.main) {
            const helper = new THREE.CameraHelper(this.lights.main.shadow.camera);
            this.scene.add(helper);
        }
        
        // Axis helper
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
        
        // Grid helper for debugging
        const debugGrid = new THREE.GridHelper(50, 50, 0xff0000, 0x440000);
        debugGrid.position.y = 0.001;
        this.scene.add(debugGrid);
    }
    
    getDebugInfo() {
        return {
            version: '2.0.0',
            mode: 'advanced',
            renderer: this.renderer.info,
            scene: {
                objects: this.scene.children.length,
                lights: Object.keys(this.lights).length
            },
            robot: {
                position: this.robotPosition,
                rotation: this.robotRotation,
                isAnimating: this.isAnimating,
                parts: Object.keys(this.robotParts).length
            },
            performance: {
                fps: this.getCurrentFPS(),
                memory: this.renderer.info.memory
            }
        };
    }
}