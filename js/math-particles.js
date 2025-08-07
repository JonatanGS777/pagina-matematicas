// math-particles.js - Módulo del Sistema de Partículas Matemáticas

// Mathematical Particles System
class MathParticleSystem {
    constructor() {
        this.container = document.getElementById('mathParticles');
        this.particles = [];
        this.maxParticles = window.innerWidth < 768 ? 15 : 25;
        
        // Mathematical symbols and equations
        this.mathContent = {
            equations: [
                'E = mc²',
                'a² + b² = c²',
                'f(x) = x²',
                'π ≈ 3.14159',
                '∫ f(x)dx',
                'lim x→∞',
                'Σ(x₁...xₙ)',
                '∂f/∂x',
                'log₂(8) = 3',
                'sin²θ + cos²θ = 1',
                '√(-1) = i',
                'e^(iπ) + 1 = 0'
            ],
            symbols: [
                '∞', '∑', '∫', '∂', '√', '±', '≠', '≈', '≤', '≥',
                '∝', '∅', '∈', '∉', '⊂', '⊆', '∪', '∩', '×', '÷',
                '⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹',
                '₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'
            ],
            numbers: [
                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                '10', '100', '1000', '0.5', '1.41', '2.71', '3.14'
            ],
            greek: [
                'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'λ', 'μ',
                'π', 'ρ', 'σ', 'τ', 'φ', 'χ', 'ψ', 'ω', 'Δ', 'Σ',
                'Π', 'Ω', 'Φ', 'Ψ'
            ]
        };
        
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.warn('Math particles container not found');
            return;
        }
        
        this.createParticles();
        this.startAnimation();
        
        // Responsive adjustment
        window.addEventListener('resize', () => {
            this.maxParticles = window.innerWidth < 768 ? 15 : 25;
            this.adjustParticleCount();
        });
    }
    
    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            setTimeout(() => {
                this.addParticle();
            }, i * 200);
        }
    }
    
    addParticle() {
        if (!this.container) return;
        
        const particle = document.createElement('div');
        particle.className = 'math-particle';
        
        // Random content type
        const types = ['equation', 'symbol', 'number', 'greek'];
        const type = types[Math.floor(Math.random() * types.length)];
        const content = this.mathContent[type + 's'][Math.floor(Math.random() * this.mathContent[type + 's'].length)];
        
        particle.textContent = content;
        particle.classList.add(type);
        
        // Random speed class
        const speeds = ['slow', 'medium', 'fast', 'ultra-slow'];
        const speed = speeds[Math.floor(Math.random() * speeds.length)];
        particle.classList.add(speed);
        
        // Random starting position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        
        // Random horizontal drift
        const drift = (Math.random() - 0.5) * 200;
        particle.style.setProperty('--drift', drift + 'px');
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        // Remove particle when animation ends
        particle.addEventListener('animationend', () => {
            this.removeParticle(particle);
        });
    }
    
    removeParticle(particle) {
        const index = this.particles.indexOf(particle);
        if (index > -1) {
            this.particles.splice(index, 1);
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }
    }
    
    adjustParticleCount() {
        const currentCount = this.particles.length;
        if (currentCount < this.maxParticles) {
            for (let i = currentCount; i < this.maxParticles; i++) {
                setTimeout(() => {
                    this.addParticle();
                }, i * 100);
            }
        } else if (currentCount > this.maxParticles) {
            const excess = currentCount - this.maxParticles;
            for (let i = 0; i < excess; i++) {
                if (this.particles[i]) {
                    this.removeParticle(this.particles[i]);
                }
            }
        }
    }
    
    startAnimation() {
        setInterval(() => {
            if (this.particles.length < this.maxParticles && this.container) {
                this.addParticle();
            }
        }, 2000 + Math.random() * 3000);
    }
    
    // Method to pause/resume particles
    pauseParticles() {
        if (this.container) {
            this.container.style.animationPlayState = 'paused';
        }
    }
    
    resumeParticles() {
        if (this.container) {
            this.container.style.animationPlayState = 'running';
        }
    }
    
    // Method to destroy all particles
    destroyParticles() {
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        this.particles = [];
    }
}

// Initialize Math Particles System
function initMathParticles() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new MathParticleSystem();
        });
    } else {
        new MathParticleSystem();
    }
}

// Export for use in main file
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initMathParticles, MathParticleSystem };
} else {
    // Browser environment
    window.MathParticles = { initMathParticles, MathParticleSystem };
}