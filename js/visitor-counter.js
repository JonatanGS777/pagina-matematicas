// visitor-counter.js - Sistema de Contador de Visitas con Votación de Roles

// Animated Counter System
class AnimatedCounter {
    constructor() {
        this.counters = document.querySelectorAll('.counter');
        this.hasAnimated = false;
        this.init();
    }
    
    init() {
        // Create intersection observer for stats section
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.hasAnimated = true;
                    this.startCounting();
                }
            });
        }, { threshold: 0.5 });
        
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    }
    
    startCounting() {
        this.counters.forEach((counter, index) => {
            setTimeout(() => {
                this.animateCounter(counter);
            }, index * 200); // Stagger the animations
        });
    }
    
    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const startValue = 0;
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
            
            counter.textContent = this.formatNumber(currentValue);
            counter.classList.add('counting');
            
            // Add random pulse effect during counting
            if (Math.random() > 0.9) {
                setTimeout(() => {
                    counter.classList.remove('counting');
                }, 100);
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = this.formatNumber(target);
                counter.classList.remove('counting');
                this.createCounterCompleteEffect(counter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace('.0', '') + 'k';
        }
        return num.toString();
    }
    
    createCounterCompleteEffect(counter) {
        // Create sparkle effect when counter completes
        const rect = counter.getBoundingClientRect();
        const sparkles = ['✨', '⭐', '💫', '🌟'];
        
        for (let i = 0; i < 4; i++) {
            const sparkle = document.createElement('div');
            sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.position = 'fixed';
            sparkle.style.left = (rect.left + rect.width / 2) + 'px';
            sparkle.style.top = (rect.top + rect.height / 2) + 'px';
            sparkle.style.fontSize = '1rem';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1000';
            sparkle.style.animation = `sparkleFloat 1.5s ease-out forwards`;
            sparkle.style.animationDelay = i * 0.1 + 's';
            
            // Random direction
            const angle = (Math.PI * 2 * i) / 4;
            const distance = 40;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            sparkle.style.setProperty('--end-x', endX + 'px');
            sparkle.style.setProperty('--end-y', endY + 'px');
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 1500);
        }
        
        // Add number completion glow
        const statNumber = counter.closest('.stat-number');
        if (statNumber) {
            statNumber.style.textShadow = '0 0 20px rgba(102, 126, 234, 0.6)';
            setTimeout(() => {
                statNumber.style.textShadow = 'none';
            }, 1000);
        }
    }
}

// Live Visitor Counter Simulation (mantiene tu lógica original)
class LiveVisitorCounter {
    constructor() {
        this.visitorCounter = document.querySelector('.visitors .counter');
        this.baseCount = 0; // Empezar en 0
        this.currentCount = this.baseCount;
        this.init();
    }
    
    init() {
        // Start live updates after initial animation completes
        setTimeout(() => {
            this.startLiveUpdates();
        }, 5000);
    }
    
    startLiveUpdates() {
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every interval
                this.incrementVisitor();
            }
        }, 8000 + Math.random() * 12000); // Random interval between 8-20 seconds
    }
    
    incrementVisitor() {
        this.currentCount++;
        this.updateVisitorDisplay();
        this.createVisitorNotification();
    }
    
    updateVisitorDisplay() {
        if (this.visitorCounter) {
            this.visitorCounter.textContent = this.formatNumber(this.currentCount);
            
            // Add highlight effect
            this.visitorCounter.style.color = '#4ecdc4';
            this.visitorCounter.style.transform = 'scale(1.1)';
            this.visitorCounter.style.textShadow = '0 0 15px rgba(78, 205, 196, 0.8)';
            
            setTimeout(() => {
                this.visitorCounter.style.color = '';
                this.visitorCounter.style.transform = '';
                this.visitorCounter.style.textShadow = '';
            }, 1000);
        }
    }
    
    createVisitorNotification() {
        // Create a subtle notification
        const notification = document.createElement('div');
        notification.innerHTML = '<i class="fas fa-user-plus"></i> +1 visitante';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #4ecdc4, #44a08d);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            font-size: 0.9rem;
            font-weight: 500;
            box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
            z-index: 1000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
            pointer-events: none;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace('.0', '') + 'k';
        }
        return num.toString();
    }
}

// === NUEVO: Sistema de Votación de Roles ===
class RoleVoting {
    constructor() {
        this.UID_COOKIE = 'site_uid';
        this.animatedCounter = null;
        this.init();
    }

    getUID() {
        const match = document.cookie.match(/(?:^|;\s*)site_uid=([^;]+)/);
        if (match) return match[1];
        
        const uid = (crypto && crypto.randomUUID) ? crypto.randomUUID() : 
                    String(Date.now()) + Math.random().toString(36);
        document.cookie = `${this.UID_COOKIE}=${uid};path=/;max-age=${60*60*24*365*5}`;
        return uid;
    }

    async fetchCounts() {
        try {
            const response = await fetch('/api/role', { method: 'GET' });
            return response.ok ? await response.json() : 
                   { estudiantes: 0, maestros: 0, padres: 0, otros: 0, voted: false };
        } catch (error) {
            console.error('Error fetching counts:', error);
            return { estudiantes: 0, maestros: 0, padres: 0, otros: 0, voted: false };
        }
    }

    async sendVote(role) {
        try {
            const response = await fetch('/api/role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role })
            });
            return await response.json();
        } catch (error) {
            console.error('Error sending vote:', error);
            return { error: 'NETWORK_ERROR' };
        }
    }

    updateStatCard(labelText, value) {
        const cards = document.querySelectorAll('.stat-item');
        for (const card of cards) {
            const label = card.querySelector('.stat-label');
            if (!label) continue;
            
            const labelMatch = label.textContent.trim().toLowerCase();
            const searchText = labelText.toLowerCase();
            
            if (labelMatch === searchText || labelMatch.includes(searchText.slice(0, -1))) {
                const counter = card.querySelector('.stat-number .counter');
                if (counter) {
                    counter.dataset.target = String(value);
                    counter.textContent = String(value);
                    
                    // Re-animar si es necesario
                    if (this.animatedCounter && !this.animatedCounter.hasAnimated) {
                        // Esperará a que la animación principal se ejecute
                    }
                }
                break;
            }
        }
    }

    disableRoleButtons() {
        document.querySelectorAll('.role-btn').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        });
    }

    async init() {
        // Asegurar UID
        this.getUID();
        
        // Esperar a que el DOM esté listo
        await new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });

        const status = document.getElementById('role-status');
        const buttons = document.querySelectorAll('.role-btn');

        // Cargar conteos iniciales
        try {
            const counts = await this.fetchCounts();
            
            // Actualizar contadores
            this.updateStatCard('estudiantes', counts.estudiantes || 0);
            this.updateStatCard('maestros', counts.maestros || 0);
            this.updateStatCard('padres', counts.padres || 0);
            this.updateStatCard('otros', counts.otros || 0);

            // Si ya votó, deshabilitar
            if (counts.voted && status) {
                status.textContent = '✅ Ya registraste tu respuesta. ¡Gracias!';
                this.disableRoleButtons();
            }
        } catch (error) {
            console.error('Error loading initial counts:', error);
        }

        // Event listeners para botones
        buttons.forEach(button => {
            button.addEventListener('click', async () => {
                const role = button.dataset.role;
                if (!role) return;

                // Deshabilitar todos los botones
                this.disableRoleButtons();
                button.classList.add('selected');
                
                if (status) status.textContent = 'Guardando tu respuesta...';

                const result = await this.sendVote(role);
                
                if (result.error === 'ALREADY_VOTED') {
                    if (status) status.textContent = '✅ Ya habías respondido antes. Solo se permite un registro.';
                    return;
                }

                if (result.ok) {
                    if (status) status.textContent = '✅ ¡Respuesta registrada correctamente!';
                    
                    // Actualizar contadores con animación
                    this.updateStatCard('estudiantes', result.estudiantes || 0);
                    this.updateStatCard('maestros', result.maestros || 0);
                    this.updateStatCard('padres', result.padres || 0);
                    this.updateStatCard('otros', result.otros || 0);
                    
                    // Crear efecto de celebración
                    this.createVoteSuccessEffect(button);
                } else {
                    if (status) status.textContent = '⚠️ Hubo un problema. Intenta más tarde.';
                }
            });
        });
    }

    createVoteSuccessEffect(button) {
        // Efecto de partículas de celebración
        const rect = button.getBoundingClientRect();
        const particles = ['🎉', '✨', '🌟', '💫'];
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            particle.style.position = 'fixed';
            particle.style.left = (rect.left + rect.width / 2) + 'px';
            particle.style.top = (rect.top + rect.height / 2) + 'px';
            particle.style.fontSize = '1.5rem';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1001';
            particle.style.animation = `voteParticle 2s ease-out forwards`;
            particle.style.animationDelay = i * 0.1 + 's';
            
            // Dirección aleatoria
            const angle = (Math.PI * 2 * i) / 6;
            const distance = 60;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            particle.style.setProperty('--end-x', endX + 'px');
            particle.style.setProperty('--end-y', endY + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }
    }
}

// CSS Animations
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkleFloat {
            0% {
                transform: translate(0, 0) scale(0.5) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translate(var(--end-x, 30px), var(--end-y, -30px)) scale(1.2) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes voteParticle {
            0% {
                transform: translate(0, 0) scale(0.3) rotate(0deg);
                opacity: 1;
            }
            50% {
                transform: translate(calc(var(--end-x, 30px) * 0.7), calc(var(--end-y, -30px) * 0.7)) scale(1) rotate(180deg);
                opacity: 1;
            }
            100% {
                transform: translate(var(--end-x, 30px), var(--end-y, -30px)) scale(0.3) rotate(360deg);
                opacity: 0;
            }
        }
        
        .counter.counting {
            color: #4ecdc4;
            text-shadow: 0 0 10px rgba(78, 205, 196, 0.5);
        }
    `;
    document.head.appendChild(style);
}

// Initialize Complete System
function initVisitorCounter() {
    // Add CSS animations
    addAnimations();
    
    // Initialize animated counters
    const animatedCounter = new AnimatedCounter();
    
    // Initialize live visitor counter
    new LiveVisitorCounter();
    
    // Initialize role voting system
    const roleVoting = new RoleVoting();
    roleVoting.animatedCounter = animatedCounter; // Referencia para coordinación
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initVisitorCounter };
} else {
    window.VisitorCounter = { initVisitorCounter };
}