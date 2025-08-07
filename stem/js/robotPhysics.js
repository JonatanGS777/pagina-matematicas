/**
 * RobotPhysics Module - Sistema de física independiente para Robot3D
 * Módulo separado que maneja toda la lógica de física del robot
 */

class RobotPhysics {
    constructor(robotInstance) {
        this.robot3D = robotInstance;
        this.scene = robotInstance.scene;
        this.robotObject = robotInstance.robot;
        
        // Physics state
        this.enabled = false;
        this.gravity = -9.81;
        this.friction = 0.8;
        this.mass = 1.0;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.isGrounded = true;
        this.groundY = 0;
        
        // Collision and obstacles
        this.obstacles = [];
        this.boundarySize = 15;
        
        // Physics loop control
        this.physicsLoopId = null;
        this.lastTime = 0;
        
        // Event listeners
        this.eventListeners = {
            onCollision: null,
            onFall: null,
            onStuck: null,
            onJump: null,
            onLand: null
        };
        
        this.log('⚡ Módulo de física inicializado');
    }
    
    // Event system
    setEventListeners(listeners) {
        this.eventListeners = { ...this.eventListeners, ...listeners };
    }
    
    emit(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event](data);
        }
    }
    
    // Core physics methods
    enablePhysics() {
        if (this.enabled) {
            this.log('⚠️ La física ya está activada');
            return;
        }
        
        this.enabled = true;
        this.startPhysicsLoop();
        this.log('⚡ Sistema de física ACTIVADO');
    }
    
    disablePhysics() {
        if (!this.enabled) {
            this.log('⚠️ La física ya está desactivada');
            return;
        }
        
        this.enabled = false;
        this.stopPhysicsLoop();
        
        // Reset physics state
        this.velocity.set(0, 0, 0);
        this.robotObject.position.y = this.groundY;
        this.isGrounded = true;
        
        this.log('🔄 Sistema de física DESACTIVADO');
    }
    
    startPhysicsLoop() {
        if (this.physicsLoopId) {
            this.stopPhysicsLoop();
        }
        
        this.lastTime = performance.now();
        
        const physicsUpdate = (currentTime) => {
            if (!this.enabled) return;
            
            const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
            this.lastTime = currentTime;
            
            // Limit delta time to prevent large jumps
            const clampedDeltaTime = Math.min(deltaTime, 1/30); // Max 30 FPS minimum
            
            this.update(clampedDeltaTime);
            
            this.physicsLoopId = requestAnimationFrame(physicsUpdate);
        };
        
        this.physicsLoopId = requestAnimationFrame(physicsUpdate);
        this.log('🔄 Bucle de física INICIADO');
    }
    
    stopPhysicsLoop() {
        if (this.physicsLoopId) {
            cancelAnimationFrame(this.physicsLoopId);
            this.physicsLoopId = null;
            this.log('⏹️ Bucle de física DETENIDO');
        }
    }
    
    // Main physics update
    update(deltaTime) {
        if (!this.enabled || !this.robotObject) return;
        
        // Apply gravity
        if (!this.isGrounded) {
            this.velocity.y += this.gravity * deltaTime;
        }
        
        // Apply velocity to position
        const movement = this.velocity.clone().multiplyScalar(deltaTime);
        this.robotObject.position.add(movement);
        
        // Ground collision
        this.handleGroundCollision();
        
        // Obstacle collisions
        this.checkObstacleCollisions();
        
        // Boundary enforcement
        this.enforceBoundaries();
        
        // Apply friction
        this.applyFriction(deltaTime);
        
        // Update robot position tracking
        this.updateRobotPosition();
    }
    
    handleGroundCollision() {
        if (this.robotObject.position.y <= this.groundY) {
            if (!this.isGrounded && this.velocity.y < 0) {
                // Just landed
                this.robotObject.position.y = this.groundY;
                this.isGrounded = true;
                this.velocity.y = 0;
                
                this.emit('onLand', { position: this.robotObject.position.clone() });
                this.robot3D.createLandingEffect();
                this.log('🛬 Robot aterrizó');
            }
        } else {
            this.isGrounded = false;
        }
    }
    
    checkObstacleCollisions() {
        const robotPos = this.robotObject.position;
        const robotRadius = 1.5; // Approximate robot radius
        
        for (const obstacle of this.obstacles) {
            const distance = robotPos.distanceTo(obstacle.position);
            const obstacleRadius = obstacle.size.x; // Assuming spherical collision
            const minDistance = robotRadius + obstacleRadius;
            
            if (distance < minDistance) {
                this.handleObstacleCollision(obstacle);
            }
        }
    }
    
    handleObstacleCollision(obstacle) {
        // Calculate push direction
        const pushDirection = this.robotObject.position.clone()
            .sub(obstacle.position)
            .normalize();
        
        // Apply separation force
        const separationDistance = 0.1;
        this.robotObject.position.copy(
            obstacle.position.clone().add(
                pushDirection.multiplyScalar(obstacle.size.x + 1.5 + separationDistance)
            )
        );
        
        // Apply bounce force
        const bounceForce = pushDirection.multiplyScalar(8);
        this.applyForce(bounceForce);
        
        // Create collision effect
        this.robot3D.createCollisionEffect(obstacle.position);
        this.emit('onCollision', { obstacle: obstacle, position: obstacle.position });
        
        this.log(`💥 Colisión con obstáculo ${obstacle.type}`);
    }
    
    enforceBoundaries() {
        const pos = this.robotObject.position;
        let hitBoundary = false;
        
        // X boundaries
        if (pos.x > this.boundarySize) {
            pos.x = this.boundarySize;
            this.velocity.x = -Math.abs(this.velocity.x) * 0.5; // Bounce back
            hitBoundary = true;
        } else if (pos.x < -this.boundarySize) {
            pos.x = -this.boundarySize;
            this.velocity.x = Math.abs(this.velocity.x) * 0.5; // Bounce back
            hitBoundary = true;
        }
        
        // Z boundaries
        if (pos.z > this.boundarySize) {
            pos.z = this.boundarySize;
            this.velocity.z = -Math.abs(this.velocity.z) * 0.5; // Bounce back
            hitBoundary = true;
        } else if (pos.z < -this.boundarySize) {
            pos.z = -this.boundarySize;
            this.velocity.z = Math.abs(this.velocity.z) * 0.5; // Bounce back
            hitBoundary = true;
        }
        
        if (hitBoundary) {
            this.robot3D.createBoundaryEffect(pos.clone());
            this.log('🚧 Robot rebotó en el límite');
        }
    }
    
    applyFriction(deltaTime) {
        // Ground friction
        if (this.isGrounded) {
            const frictionForce = Math.pow(this.friction, deltaTime * 60); // Frame-rate independent
            this.velocity.x *= frictionForce;
            this.velocity.z *= frictionForce;
        }
        
        // Air resistance
        const airResistance = 0.98;
        this.velocity.multiplyScalar(Math.pow(airResistance, deltaTime * 60));
    }
    
    updateRobotPosition() {
        // Update Robot3D position tracking
        if (this.robot3D) {
            this.robot3D.robotPosition.x = Math.round(this.robotObject.position.x);
            this.robot3D.robotPosition.z = Math.round(this.robotObject.position.z);
        }
    }
    
    // Physics actions
    jump(force = 50) {
        if (!this.enabled) {
            this.log('❌ Física no activada - No se puede saltar');
            return false;
        }
        
        if (!this.isGrounded) {
            this.log('⚠️ Robot en el aire - No se puede saltar');
            return false;
        }
        
        // Apply jump force
        this.velocity.y = force * 0.15;
        this.isGrounded = false;
        
        // Create visual effect
        this.robot3D.createJumpEffect();
        this.emit('onJump', { force: force, position: this.robotObject.position.clone() });
        
        this.log(`🦘 Robot saltó con fuerza ${force}`);
        return true;
    }
    
    applyForce(force) {
        if (!this.enabled) return;
        
        const scaledForce = force.clone().divideScalar(this.mass);
        this.velocity.add(scaledForce);
    }
    
    // Movement with physics
    moveForwardPhysics(distance = 1) {
        if (!this.enabled) return false;
        
        // Calculate forward direction based on robot rotation
        const direction = new THREE.Vector3(0, 0, distance);
        direction.applyQuaternion(this.robotObject.quaternion);
        
        // Apply movement force
        const force = direction.multiplyScalar(15);
        this.applyForce(force);
        
        this.log(`🚀 Movimiento físico: fuerza ${force.length().toFixed(2)}`);
        return true;
    }
    
    rotatePhysics(degrees) {
        if (!this.enabled) return false;
        
        // Immediate rotation (physics doesn't affect rotation in this implementation)
        const radians = (degrees * Math.PI) / 180;
        this.robotObject.rotation.y += radians;
        
        // Update Robot3D rotation tracking
        if (this.robot3D) {
            this.robot3D.robotRotation = (this.robot3D.robotRotation + degrees) % 360;
            if (this.robot3D.robotRotation < 0) this.robot3D.robotRotation += 360;
        }
        
        this.log(`🔄 Rotación física: ${degrees}°`);
        return true;
    }
    
    // Physics configuration
    setGravity(gravity) {
        this.gravity = gravity;
        this.log(`🌍 Gravedad establecida: ${gravity} m/s²`);
    }
    
    setFriction(friction) {
        this.friction = Math.max(0, Math.min(1, friction));
        this.log(`🛞 Fricción establecida: ${this.friction}`);
    }
    
    setMass(mass) {
        this.mass = Math.max(0.1, mass);
        this.log(`⚖️ Masa establecida: ${this.mass} kg`);
    }
    
    setBoundarySize(size) {
        this.boundarySize = size;
        this.log(`🚧 Límites establecidos: ${size}x${size}`);
    }
    
    // Obstacle management
    addObstacle(type, position, options = {}) {
        const obstacle = {
            id: Math.random().toString(36).substr(2, 9),
            type: type,
            position: position.clone(),
            size: options.size || new THREE.Vector3(1, 1, 1),
            material: options.material || 'default'
        };
        
        this.obstacles.push(obstacle);
        this.robot3D.createVisualObstacle(obstacle);
        
        this.log(`📦 Obstáculo ${type} añadido (${this.obstacles.length} total)`);
        return obstacle;
    }
    
    removeObstacle(obstacle) {
        const index = this.obstacles.findIndex(obs => obs.id === obstacle.id);
        if (index !== -1) {
            this.obstacles.splice(index, 1);
            this.robot3D.removeVisualObstacle(obstacle);
            this.log(`🗑️ Obstáculo removido (${this.obstacles.length} restantes)`);
            return true;
        }
        return false;
    }
    
    clearAllObstacles() {
        this.obstacles.forEach(obstacle => {
            this.robot3D.removeVisualObstacle(obstacle);
        });
        this.obstacles = [];
        this.log('🧹 Todos los obstáculos removidos');
    }
    
    // Physics information
    getPhysicsStats() {
        return {
            enabled: this.enabled,
            velocity: this.velocity.clone(),
            speed: this.velocity.length(),
            mass: this.mass,
            gravity: this.gravity,
            friction: this.friction,
            isGrounded: this.isGrounded,
            energy: this.velocity.lengthSq() * this.mass * 0.5,
            obstacleCount: this.obstacles.length,
            position: this.robotObject.position.clone()
        };
    }
    
    getVelocityMagnitude() {
        return this.velocity.length();
    }
    
    isMoving() {
        return this.velocity.length() > 0.01;
    }
    
    // Utility methods
    log(message) {
        if (this.robot3D && this.robot3D.log) {
            this.robot3D.log(message);
        } else {
            console.log(`[RobotPhysics] ${message}`);
        }
    }
    
    // Reset physics state
    reset() {
        this.velocity.set(0, 0, 0);
        this.isGrounded = true;
        this.robotObject.position.set(0, this.groundY, 0);
        this.robotObject.rotation.set(0, 0, 0);
        
        if (this.robot3D) {
            this.robot3D.robotPosition.x = 0;
            this.robot3D.robotPosition.z = 0;
            this.robot3D.robotRotation = 0;
        }
        
        this.log('🔄 Estado de física reiniciado');
    }
    
    // Cleanup
    dispose() {
        this.disablePhysics();
        this.clearAllObstacles();
        this.log('🧹 Módulo de física eliminado');
    }
    
    // Debug information
    getDebugInfo() {
        return {
            enabled: this.enabled,
            velocity: {
                x: this.velocity.x.toFixed(3),
                y: this.velocity.y.toFixed(3),
                z: this.velocity.z.toFixed(3),
                magnitude: this.velocity.length().toFixed(3)
            },
            physics: {
                gravity: this.gravity,
                friction: this.friction,
                mass: this.mass,
                isGrounded: this.isGrounded
            },
            obstacles: this.obstacles.length,
            loopActive: this.physicsLoopId !== null
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RobotPhysics;
} else {
    window.RobotPhysics = RobotPhysics;
}