// typewriter-effects.js - Módulo del Sistema de Efectos Typewriter

// Typewriter Effect System
class TypewriterEffect {
    constructor() {
        this.texts = [
            {
                element: document.getElementById('mainTitle'),
                text: 'Matemáticas Digitales',
                speed: 80,
                delay: 300,
                sound: true
            },
            {
                element: document.getElementById('subtitle'),
                text: 'Departamento de Educación',
                speed: 70,
                delay: 1000,
                sound: true
            },
            {
                element: document.getElementById('professorName'),
                text: 'Prof. Yonatan Guerrero Soriano',
                speed: 75,
                delay: 1800,
                sound: true
            },
            {
                element: document.getElementById('description'),
                text: 'Bienvenidos a mi aula digital donde las matemáticas cobran vida a través de la tecnología, la innovación y el aprendizaje interactivo.',
                speed: 35,
                delay: 2800,
                sound: false
            }
        ];
        
        this.currentIndex = 0;
        this.init();
    }
    
    init() {
        // Validate all elements exist
        if (!this.validateElements()) {
            console.warn('Typewriter elements not found, skipping initialization');
            return;
        }
        
        // Start the typewriter sequence
        this.startSequence();
    }
    
    validateElements() {
        return this.texts.every(config => config.element !== null);
    }
    
    async startSequence() {
        for (let i = 0; i < this.texts.length; i++) {
            await this.wait(this.texts[i].delay);
            await this.typeText(this.texts[i]);
            this.createCompletionEffect(this.texts[i].element);
            await this.wait(200); // Reduced pause between texts
        }
    }
    
    typeText(config) {
        return new Promise((resolve) => {
            const { element, text, speed } = config;
            let index = 0;
            
            if (!element) {
                resolve();
                return;
            }
            
            element.classList.add('typing');
            element.innerHTML = '';
            
            const typeInterval = setInterval(() => {
                if (index < text.length) {
                    const char = text.charAt(index);
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.classList.add('text-reveal');
                    element.appendChild(span);
                    
                    // Add random typing variations (reduced frequency)
                    if (Math.random() > 0.98) {
                        clearInterval(typeInterval);
                        setTimeout(() => {
                            this.continueTyping(element, text, index + 1, speed, resolve);
                        }, speed * 1.5);
                        return;
                    }
                    
                    index++;
                } else {
                    clearInterval(typeInterval);
                    element.classList.remove('typing');
                    element.classList.add('finished');
                    
                    // Remove cursor after a delay for last element
                    if (element.id === 'description') {
                        setTimeout(() => {
                            element.classList.remove('typewriter');
                        }, 2000);
                    }
                    
                    resolve();
                }
            }, speed + Math.random() * 20 - 10); // Reduced speed variation
        });
    }
    
    continueTyping(element, text, startIndex, speed, resolve) {
        let index = startIndex;
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                const char = text.charAt(index);
                const span = document.createElement('span');
                span.textContent = char;
                span.classList.add('text-reveal');
                element.appendChild(span);
                index++;
            } else {
                clearInterval(typeInterval);
                element.classList.remove('typing');
                element.classList.add('finished');
                
                if (element.id === 'description') {
                    setTimeout(() => {
                        element.classList.remove('typewriter');
                    }, 2000);
                }
                
                resolve();
            }
        }, speed + Math.random() * 20 - 10);
    }
    
    createCompletionEffect(element) {
        if (!element) return;
        
        // Create a brief glow effect when text is completed
        element.style.textShadow = '0 0 20px rgba(102, 126, 234, 0.8), 0 0 40px rgba(102, 126, 234, 0.4)';
        
        setTimeout(() => {
            element.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
        }, 400);
        
        // Create mini math particles at completion
        this.createMiniParticles(element);
    }
    
    createMiniParticles(element) {
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const symbols = ['✓', '★', '∞', '∑', 'π', '√'];
        
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            particle.style.position = 'fixed';
            particle.style.left = rect.right + 'px';
            particle.style.top = (rect.top + rect.height / 2) + 'px';
            particle.style.color = '#4ecdc4';
            particle.style.fontSize = '1.2rem';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            particle.style.animation = `miniParticleFloat 1s ease-out forwards`;
            particle.style.animationDelay = i * 0.05 + 's';
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Method to restart typewriter effect
    restart() {
        this.currentIndex = 0;
        this.texts.forEach(config => {
            if (config.element) {
                config.element.classList.remove('typing', 'finished', 'typewriter');
                config.element.innerHTML = '';
            }
        });
        
        setTimeout(() => {
            this.init();
        }, 500);
    }
    
    // Method to skip to final state
    skipToEnd() {
        this.texts.forEach(config => {
            if (config.element) {
                config.element.classList.remove('typing', 'typewriter');
                config.element.classList.add('finished');
                config.element.innerHTML = config.text;
            }
        });
    }
}

// Add required CSS animations
function addTypewriterAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes miniParticleFloat {
            0% {
                transform: translate(0, 0) scale(0.5);
                opacity: 1;
            }
            100% {
                transform: translate(30px, -50px) scale(1.2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize Typewriter Effect System
function initTypewriterEffect() {
    // Add required CSS animations
    addTypewriterAnimations();
    
    // Start typewriter effect when page loads
    const startTypewriter = () => {
        setTimeout(() => {
            new TypewriterEffect();
        }, 600); // Reduced wait time
    };
    
    if (document.readyState === 'loading') {
        window.addEventListener('load', startTypewriter);
    } else {
        startTypewriter();
    }
}

// Export for use in main file
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initTypewriterEffect, TypewriterEffect };
} else {
    // Browser environment
    window.TypewriterEffects = { initTypewriterEffect, TypewriterEffect };
}