/**
 * RobotEnvironment Module - Sistema de entorno y pista separado
 * Módulo independiente que maneja toda la creación del entorno 3D
 */

class RobotEnvironment {
    constructor(robotInstance) {
        this.robot3D = robotInstance;
        this.scene = robotInstance.scene;
        
        // Environment components
        this.floor = null;
        this.grids = [];
        this.pillars = [];
        this.energyNodes = [];
        this.platforms = [];
        this.barriers = [];
        this.orbs = [];
        this.particles = null;
        this.ambientDust = null;
        this.energyParticles = null;
        this.quantumField = [];
        this.energyFlows = [];
        
        // Environment settings
        this.floorSize = 200;
        this.boundarySize = 100;
        this.animationSpeed = 1.0;
        
        this.log('🌍 Módulo de entorno inicializado');
    }
    
    // Main environment creation
    async createEnvironment() {
        await this.createFloor();
        this.createGridSystem();
        this.createFloatingParticles();
        this.createEnvironmentProps();
        this.createEnergyBarriers();
        
        this.log('✅ Entorno completo creado');
    }
    
    // Enhanced floor creation
    async createFloor() {
        const floorGeometry = new THREE.PlaneGeometry(this.floorSize, this.floorSize, 64, 64);
        
        // Create surface displacement for detail
        this.addFloorDisplacement(floorGeometry);
        
        // Advanced PBR material
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            metalness: 0.1,
            roughness: 0.8,
            transparent: true,
            opacity: 0.9
        });
        
        this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.floor.rotation.x = -Math.PI / 2;
        this.floor.receiveShadow = true;
        this.floor.name = 'environment_floor';
        
        this.scene.add(this.floor);
        this.log('🏢 Pista avanzada creada');
        
        return Promise.resolve();
    }
    
    addFloorDisplacement(geometry) {
        const vertices = geometry.attributes.position.array;
        
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2];
            
            // Create subtle surface variation
            const displacement = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 0.02 +
                               Math.sin(x * 0.3) * Math.cos(z * 0.3) * 0.01;
            
            vertices[i + 1] = displacement;
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
    }
    
    // Multi-layered grid system
    createGridSystem() {
        const gridConfigs = [
            { 
                size: 30, 
                divisions: 30, 
                color1: 0x667eea, 
                color2: 0x334477, 
                opacity: 0.8, 
                height: 0.01,
                speed: 0.05
            },
            { 
                size: 15, 
                divisions: 15, 
                color1: 0x4ecdc4, 
                color2: 0x226655, 
                opacity: 0.5, 
                height: 0.02,
                speed: -0.03
            },
            { 
                size: 8, 
                divisions: 8, 
                color1: 0xf093fb, 
                color2: 0x775577, 
                opacity: 0.3, 
                height: 0.03,
                speed: 0.02
            }
        ];
        
        this.grids = [];
        
        gridConfigs.forEach((config, index) => {
            const grid = new THREE.GridHelper(config.size, config.divisions, config.color1, config.color2);
            grid.material.transparent = true;
            grid.material.opacity = config.opacity;
            grid.position.y = config.height;
            grid.name = `environment_grid_${index}`;
            
            // Add glow effect
            grid.material.emissive = new THREE.Color(config.color1);
            grid.material.emissiveIntensity = 0.1;
            
            // Store animation data
            grid.userData = {
                speed: config.speed,
                originalOpacity: config.opacity
            };
            
            this.grids.push(grid);
            this.scene.add(grid);
        });
        
        this.log(`📐 Sistema de grillas creado (${this.grids.length} capas)`);
    }
    
    // Floating particle systems
    createFloatingParticles() {
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
            orb.name = `environment_orb_${i}`;
            
            // Animation properties
            orb.userData = {
                initialY: orb.position.y,
                speed: Math.random() * 0.02 + 0.01,
                range: Math.random() * 2 + 1,
                hueShift: Math.random() * 0.01
            };
            
            this.orbs.push(orb);
            this.scene.add(orb);
        }
        
        this.log(`✨ Orbes flotantes creados (${orbCount})`);
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
        this.energyParticles.name = 'environment_energy_particles';
        this.scene.add(this.energyParticles);
        
        this.log('⚡ Partículas de energía creadas');
    }
    
    createAmbientDust() {
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
        this.ambientDust.name = 'environment_ambient_dust';
        this.scene.add(this.ambientDust);
        
        this.log('💫 Polvo ambiental creado');
    }
    
    // Environment props
    createEnvironmentProps() {
        this.createHolographicPillars();
        this.createEnergyNodes();
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
            pillar.name = `environment_pillar_${index}`;
            
            // Add animation data
            pillar.userData = {
                originalEmissiveIntensity: 0.3,
                pulseSpeed: Math.random() * 0.02 + 0.01
            };
            
            this.pillars.push(pillar);
            this.scene.add(pillar);
        });
        
        this.log(`🏛️ Pilares holográficos creados (${this.pillars.length})`);
    }
    
    createEnergyNodes() {
        const nodePositions = [
            [8, 1, 8], [-8, 1, 8], [8, 1, -8], [-8, 1, -8]
        ];
        
        this.energyNodes = [];
        
        nodePositions.forEach((pos, nodeIndex) => {
            const group = new THREE.Group();
            group.name = `environment_energy_node_${nodeIndex}`;
            
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
            
            // Rotating rings
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
                ring.name = `ring_${i}`;
                
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
        
        this.log(`⚛️ Nodos de energía creados (${this.energyNodes.length})`);
    }
    
    createFloatingPlatforms() {
        const platformPositions = [
            [6, 0.2, 6], [-6, 0.2, 6], [6, 0.2, -6], [-6, 0.2, -6]
        ];
        
        this.platforms = [];
        
        platformPositions.forEach((pos, index) => {
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
            platform.name = `environment_platform_${index}`;
            
            // Animation data
            platform.userData = {
                initialY: pos[1],
                floatSpeed: Math.random() * 0.01 + 0.005,
                floatRange: 0.3
            };
            
            this.platforms.push(platform);
            this.scene.add(platform);
        });
        
        this.log(`🛸 Plataformas flotantes creadas (${this.platforms.length})`);
    }
    
    // Energy barriers
    createEnergyBarriers() {
        const barrierPositions = [
            { pos: [0, 2, 20], rot: [0, 0, 0] },
            { pos: [0, 2, -20], rot: [0, 0, 0] },
            { pos: [20, 2, 0], rot: [0, Math.PI/2, 0] },
            { pos: [-20, 2, 0], rot: [0, Math.PI/2, 0] }
        ];
        
        this.barriers = [];
        
        barrierPositions.forEach((config, index) => {
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
            barrier.name = `environment_barrier_${index}`;
            
            this.barriers.push(barrier);
            this.scene.add(barrier);
        });
        
        this.log(`🚧 Barreras de energía creadas (${this.barriers.length})`);
    }
    
    // Advanced particle systems
    createQuantumField() {
        const fieldCount = 50;
        this.quantumField = [];
        
        for (let i = 0; i < fieldCount; i++) {
            const particle = new THREE.Mesh(
                new THREE.OctahedronGeometry(0.02),
                new THREE.MeshStandardMaterial({
                    color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
                    emissive: new THREE.Color().setHSL(Math.random(), 0.8, 0.3),
                    emissiveIntensity: 0.6,
                    transparent: true,
                    opacity: 0.8
                })
            );
            
            particle.position.set(
                (Math.random() - 0.5) * 25,
                Math.random() * 8 + 1,
                (Math.random() - 0.5) * 25
            );
            
            particle.userData = {
                speed: Math.random() * 0.01 + 0.005,
                phase: Math.random() * Math.PI * 2,
                amplitude: Math.random() * 2 + 1
            };
            
            particle.name = `environment_quantum_${i}`;
            this.quantumField.push(particle);
            this.scene.add(particle);
        }
        
        this.log(`⚛️ Campo cuántico generado (${fieldCount} partículas)`);
    }
    
    createEnergyFlow() {
        this.energyFlows = [];
        
        for (let i = 0; i < 8; i++) {
            const points = [];
            const radius = 8 + i;
            
            for (let j = 0; j <= 64; j++) {
                const angle = (j / 64) * Math.PI * 2;
                points.push(new THREE.Vector3(
                    Math.cos(angle) * radius,
                    Math.sin(j * 0.1) * 2,
                    Math.sin(angle) * radius
                ));
            }
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: new THREE.Color().setHSL(i / 8, 0.8, 0.6),
                transparent: true,
                opacity: 0.4
            });
            
            const flow = new THREE.Line(geometry, material);
            flow.userData = { speed: 0.01 + i * 0.002 };
            flow.name = `environment_energy_flow_${i}`;
            
            this.energyFlows.push(flow);
            this.scene.add(flow);
        }
        
        this.log(`🌊 Flujos de energía creados (${this.energyFlows.length})`);
    }
    
    // Animation updates
    updateEnvironment(deltaTime, elapsedTime) {
        this.updateGrids(elapsedTime);
        this.updatePillars(elapsedTime);
        this.updateEnergyNodes(deltaTime);
        this.updatePlatforms(elapsedTime);
        this.updateBarriers(elapsedTime);
        this.updateParticles(deltaTime, elapsedTime);
    }
    
    updateGrids(elapsedTime) {
        this.grids.forEach((grid, index) => {
            grid.rotation.y = elapsedTime * grid.userData.speed;
        });
    }
    
    updatePillars(elapsedTime) {
        this.pillars.forEach((pillar, index) => {
            const time = elapsedTime + index * Math.PI * 0.2;
            const intensity = pillar.userData.originalEmissiveIntensity + 
                           Math.sin(time * pillar.userData.pulseSpeed * 100) * 0.2;
            pillar.material.emissiveIntensity = intensity;
        });
    }
    
    updateEnergyNodes(deltaTime) {
        this.energyNodes.forEach((node) => {
            node.children.forEach((child, ringIndex) => {
                if (ringIndex > 0 && child.userData.rotationSpeed) { // Skip core (index 0)
                    child.rotateOnAxis(child.userData.axis, child.userData.rotationSpeed);
                }
            });
        });
    }
    
    updatePlatforms(elapsedTime) {
        this.platforms.forEach((platform) => {
            const time = elapsedTime * platform.userData.floatSpeed;
            platform.position.y = platform.userData.initialY + 
                                Math.sin(time) * platform.userData.floatRange;
        });
    }
    
    updateBarriers(elapsedTime) {
        this.barriers.forEach((barrier) => {
            if (barrier.material.uniforms) {
                barrier.material.uniforms.time.value = elapsedTime;
            }
        });
    }
    
    updateParticles(deltaTime, elapsedTime) {
        // Update floating orbs
        this.orbs.forEach((orb) => {
            const time = elapsedTime * orb.userData.speed;
            orb.position.y = orb.userData.initialY + 
                           Math.sin(time) * orb.userData.range;
            orb.rotation.y += deltaTime;
            orb.rotation.x += deltaTime * 0.5;
            
            // Color cycling
            if (orb.userData.hueShift) {
                const hue = (elapsedTime * orb.userData.hueShift) % 1;
                orb.material.emissive.setHSL(hue, 0.8, 0.3);
            }
        });
        
        // Update energy particles
        if (this.energyParticles && this.energyParticles.material.uniforms) {
            this.energyParticles.material.uniforms.time.value = elapsedTime;
            this.energyParticles.rotation.y = elapsedTime * 0.02;
        }
        
        // Update ambient dust
        if (this.ambientDust) {
            this.ambientDust.rotation.y = elapsedTime * 0.005;
            
            const positions = this.ambientDust.geometry.attributes.position.array;
            for (let i = 1; i < positions.length; i += 3) {
                positions[i] += Math.sin(elapsedTime + positions[i]) * 0.001;
            }
            this.ambientDust.geometry.attributes.position.needsUpdate = true;
        }
        
        // Update quantum field
        this.quantumField.forEach((particle, index) => {
            const time = elapsedTime + particle.userData.phase;
            particle.position.y += Math.sin(time * particle.userData.speed) * 0.01;
            particle.rotation.x += deltaTime * 0.5;
            particle.rotation.y += deltaTime * 0.3;
        });
        
        // Update energy flows
        this.energyFlows.forEach((flow) => {
            flow.rotation.y += deltaTime * flow.userData.speed;
        });
    }
    
    // Environment control methods
    setFloorSize(size) {
        this.floorSize = size;
        this.recreateFloor();
        this.log(`🏢 Tamaño de pista actualizado: ${size}x${size}`);
    }
    
    setAnimationSpeed(speed) {
        this.animationSpeed = speed;
        this.log(`⚡ Velocidad de animación: ${speed}x`);
    }
    
    toggleGrids() {
        this.grids.forEach(grid => {
            grid.visible = !grid.visible;
        });
        this.log(`📐 Grillas ${this.grids[0].visible ? 'activadas' : 'desactivadas'}`);
    }
    
    toggleParticles() {
        const visible = !this.orbs[0].visible;
        this.orbs.forEach(orb => orb.visible = visible);
        if (this.energyParticles) this.energyParticles.visible = visible;
        if (this.ambientDust) this.ambientDust.visible = visible;
        
        this.log(`✨ Partículas ${visible ? 'activadas' : 'desactivadas'}`);
    }
    
    // Advanced features
    enableAdvancedMode() {
        // Enhance existing elements
        this.grids.forEach(grid => {
            grid.material.emissiveIntensity = 0.2;
        });
        
        this.pillars.forEach(pillar => {
            pillar.material.emissiveIntensity = 0.5;
        });
        
        // Create additional effects
        this.createQuantumField();
        this.createEnergyFlow();
        
        this.log('🚀 Modo avanzado del entorno activado');
    }
    
    recreateFloor() {
        if (this.floor) {
            this.scene.remove(this.floor);
            this.floor.geometry.dispose();
            this.floor.material.dispose();
        }
        this.createFloor();
    }
    
    // Environment presets
    setEnvironmentPreset(preset) {
        switch (preset) {
            case 'minimal':
                this.clearAllEffects();
                this.createFloor();
                this.createGridSystem();
                break;
            case 'standard':
                this.clearAllEffects();
                this.createEnvironment();
                break;
            case 'advanced':
                this.createEnvironment();
                this.enableAdvancedMode();
                break;
            case 'particles':
                this.createEnvironment();
                this.createQuantumField();
                break;
        }
        this.log(`🎨 Preset de entorno: ${preset}`);
    }
    
    // Utility methods
    clearAllEffects() {
        // Remove all environment objects
        const environmentObjects = this.scene.children.filter(child => 
            child.name && child.name.startsWith('environment_')
        );
        
        environmentObjects.forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
        
        // Clear arrays
        this.grids = [];
        this.pillars = [];
        this.energyNodes = [];
        this.platforms = [];
        this.barriers = [];
        this.orbs = [];
        this.quantumField = [];
        this.energyFlows = [];
        
        this.log('🧹 Efectos del entorno limpiados');
    }
    
    // Stats and info
    getEnvironmentStats() {
        return {
            floor: this.floor ? 'active' : 'none',
            grids: this.grids.length,
            pillars: this.pillars.length,
            energyNodes: this.energyNodes.length,
            platforms: this.platforms.length,
            barriers: this.barriers.length,
            orbs: this.orbs.length,
            quantumParticles: this.quantumField.length,
            energyFlows: this.energyFlows.length,
            totalObjects: this.getTotalEnvironmentObjects()
        };
    }
    
    getTotalEnvironmentObjects() {
        return this.grids.length + 
               this.pillars.length + 
               this.energyNodes.length + 
               this.platforms.length + 
               this.barriers.length + 
               this.orbs.length + 
               this.quantumField.length + 
               this.energyFlows.length +
               (this.floor ? 1 : 0) +
               (this.energyParticles ? 1 : 0) +
               (this.ambientDust ? 1 : 0);
    }
    
    log(message) {
        if (this.robot3D && this.robot3D.log) {
            this.robot3D.log(message);
        } else {
            console.log(`[RobotEnvironment] ${message}`);
        }
    }
    
    // Cleanup
    dispose() {
        this.clearAllEffects();
        
        if (this.floor) {
            this.scene.remove(this.floor);
            this.floor.geometry.dispose();
            this.floor.material.dispose();
            this.floor = null;
        }
        
        this.log('🧹 Módulo de entorno eliminado');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RobotEnvironment;
} else {
    window.RobotEnvironment = RobotEnvironment;
}