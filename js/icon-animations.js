// icon-animations.js - Módulo del Sistema de Animaciones de Iconos

// Icon Animations System
class IconAnimationsSystem {
    constructor() {
        this.animationsLoaded = false;
        this.init();
    }
    
    init() {
        this.addIconAnimationStyles();
        this.attachEventListeners();
        this.animationsLoaded = true;
    }
    
    addIconAnimationStyles() {
        const style = document.createElement('style');
        style.id = 'icon-animations-styles';
        style.textContent = `
            /* Icon Base Transitions */
            .nav-link i {
                margin-right: 0.5rem;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* Main Menu Icon Transformations on Hover */
            .nav-link:hover .fa-chalkboard-teacher {
                transform: scale(1.2) rotate(5deg);
                color: #667eea;
            }

            .nav-link:hover .fa-atom {
                animation: atomSpin 1s ease-in-out;
                color: #ff6b6b;
            }

            .nav-link:hover .fa-users {
                transform: scale(1.1);
                animation: usersBounce 0.6s ease-in-out;
                color: #4ecdc4;
            }

            .nav-link:hover .fa-flask {
                animation: flaskBubble 0.8s ease-in-out;
                color: #667eea;
            }

            .nav-link:hover .fa-calculator {
                animation: calculatorWork 1s ease-in-out;
                color: #667eea;
            }

            /* Dropdown Icon Transformations */
            .dropdown-item:hover .fa-book {
                transform: rotateY(180deg) scale(1.1);
                color: #667eea;
            }

            .dropdown-item:hover .fa-link {
                animation: linkConnect 0.6s ease-in-out;
                color: #667eea;
            }

            .dropdown-item:hover .fa-folder {
                animation: folderOpen 0.5s ease-in-out;
                color: #667eea;
            }

            .dropdown-item:hover .fa-images {
                animation: imageSlideshow 0.8s ease-in-out;
                color: #667eea;
            }

            .dropdown-item:hover .fa-chart-bar {
                animation: chartGrow 0.7s ease-in-out;
                color: #ff6b6b;
            }

            .dropdown-item:hover .fa-robot {
                animation: robotMove 1s ease-in-out;
                color: #ff6b6b;
            }

            .dropdown-item:hover .fa-code {
                animation: codeType 1.2s ease-in-out;
                color: #ff6b6b;
            }

            .dropdown-item:hover .fa-cogs {
                animation: cogsRotate 1.5s linear;
                color: #ff6b6b;
            }

            .dropdown-item:hover .fa-trophy {
                animation: trophyShine 0.8s ease-in-out;
                color: #ffd700;
            }

            .dropdown-item:hover .fa-lightbulb {
                animation: lightbulbGlow 1s ease-in-out;
                color: #ffe066;
            }

            .dropdown-item:hover .fa-medal {
                animation: medalSpin 0.6s ease-in-out;
                color: #ff8c42;
            }

            .dropdown-item:hover .fa-search {
                animation: searchScan 1s ease-in-out;
                color: #4ecdc4;
            }

            .dropdown-item:hover .fa-play-circle {
                animation: playPulse 0.8s ease-in-out;
                color: #667eea;
            }

            .dropdown-item:hover .fa-chart-line {
                animation: chartRise 1s ease-in-out;
                color: #667eea;
            }

            .dropdown-item:hover .fa-cube {
                animation: cubeRotate 1.2s ease-in-out;
                color: #667eea;
            }

            /* Keyframe Animations */
            @keyframes atomSpin {
                0% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(1.3) rotate(180deg); }
                100% { transform: scale(1) rotate(360deg); }
            }

            @keyframes usersBounce {
                0%, 100% { transform: scale(1.1) translateY(0); }
                50% { transform: scale(1.2) translateY(-3px); }
            }

            @keyframes flaskBubble {
                0%, 100% { transform: scale(1) rotate(0deg); }
                25% { transform: scale(1.1) rotate(-5deg); }
                75% { transform: scale(1.15) rotate(5deg); }
            }

            @keyframes calculatorWork {
                0% { transform: scale(1); }
                25% { transform: scale(1.1) rotate(-2deg); }
                50% { transform: scale(1.2) rotate(2deg); }
                75% { transform: scale(1.1) rotate(-1deg); }
                100% { transform: scale(1) rotate(0deg); }
            }

            @keyframes linkConnect {
                0%, 100% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(1.2) rotate(45deg); }
            }

            @keyframes folderOpen {
                0% { transform: scale(1) rotateX(0deg); }
                50% { transform: scale(1.1) rotateX(15deg); }
                100% { transform: scale(1) rotateX(0deg); }
            }

            @keyframes imageSlideshow {
                0%, 100% { transform: scale(1) translateX(0); }
                33% { transform: scale(1.1) translateX(-2px); }
                66% { transform: scale(1.1) translateX(2px); }
            }

            @keyframes chartGrow {
                0% { transform: scale(1) scaleY(1); }
                50% { transform: scale(1.1) scaleY(1.3); }
                100% { transform: scale(1) scaleY(1); }
            }

            @keyframes robotMove {
                0%, 100% { transform: scale(1) translateY(0) rotate(0deg); }
                25% { transform: scale(1.1) translateY(-2px) rotate(-5deg); }
                75% { transform: scale(1.1) translateY(-2px) rotate(5deg); }
            }

            @keyframes codeType {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.7; }
            }

            @keyframes cogsRotate {
                0% { transform: rotate(0deg) scale(1); }
                50% { transform: rotate(180deg) scale(1.1); }
                100% { transform: rotate(360deg) scale(1); }
            }

            @keyframes trophyShine {
                0%, 100% { transform: scale(1); filter: brightness(1); }
                50% { transform: scale(1.2); filter: brightness(1.5) drop-shadow(0 0 10px #ffd700); }
            }

            @keyframes lightbulbGlow {
                0%, 100% { transform: scale(1); filter: brightness(1); }
                50% { transform: scale(1.2); filter: brightness(1.8) drop-shadow(0 0 8px #ffe066); }
            }

            @keyframes medalSpin {
                0% { transform: scale(1) rotateY(0deg); }
                50% { transform: scale(1.2) rotateY(180deg); }
                100% { transform: scale(1) rotateY(360deg); }
            }

            @keyframes searchScan {
                0%, 100% { transform: scale(1) rotate(0deg); }
                25% { transform: scale(1.1) rotate(-15deg); }
                75% { transform: scale(1.1) rotate(15deg); }
            }

            @keyframes playPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.3); }
            }

            @keyframes chartRise {
                0% { transform: scale(1) scaleY(1); }
                50% { transform: scale(1.1) scaleY(1.4); }
                100% { transform: scale(1) scaleY(1); }
            }

            @keyframes cubeRotate {
                0% { transform: scale(1) rotateX(0deg) rotateY(0deg); }
                50% { transform: scale(1.2) rotateX(45deg) rotateY(45deg); }
                100% { transform: scale(1) rotateX(0deg) rotateY(0deg); }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    attachEventListeners() {
        // Add special effects for specific icons
        this.addSpecialEffects();
        
        // Monitor for dynamically added icons
        this.observeIconChanges();
    }
    
    addSpecialEffects() {
        // Add extra glow effect to trophy icons
        document.addEventListener('mouseenter', (e) => {
            if (e.target.classList.contains('fa-trophy')) {
                this.createGlowEffect(e.target, '#ffd700');
            } else if (e.target.classList.contains('fa-lightbulb')) {
                this.createGlowEffect(e.target, '#ffe066');
            }
        }, true);
        
        // Remove glow effects
        document.addEventListener('mouseleave', (e) => {
            if (e.target.classList.contains('fa-trophy') || e.target.classList.contains('fa-lightbulb')) {
                this.removeGlowEffect(e.target);
            }
        }, true);
    }
    
    createGlowEffect(element, color) {
        const glowElement = document.createElement('div');
        glowElement.className = 'icon-glow-effect';
        glowElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: radial-gradient(circle, ${color}30, transparent);
            pointer-events: none;
            animation: iconGlow 1s ease-in-out infinite alternate;
            z-index: -1;
        `;
        
        const parent = element.closest('.nav-link, .dropdown-item');
        if (parent) {
            parent.style.position = 'relative';
            parent.appendChild(glowElement);
        }
        
        // Add glow animation if not exists
        if (!document.getElementById('icon-glow-animation')) {
            const glowStyle = document.createElement('style');
            glowStyle.id = 'icon-glow-animation';
            glowStyle.textContent = `
                @keyframes iconGlow {
                    from { opacity: 0.3; transform: translate(-50%, -50%) scale(0.8); }
                    to { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
                }
            `;
            document.head.appendChild(glowStyle);
        }
    }
    
    removeGlowEffect(element) {
        const parent = element.closest('.nav-link, .dropdown-item');
        if (parent) {
            const glowEffect = parent.querySelector('.icon-glow-effect');
            if (glowEffect) {
                glowEffect.remove();
            }
        }
    }
    
    observeIconChanges() {
        // Observer for dynamically added icons
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const icons = node.querySelectorAll ? node.querySelectorAll('i[class*="fa-"]') : [];
                        icons.forEach(icon => {
                            this.enhanceIcon(icon);
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    enhanceIcon(icon) {
        // Add subtle entrance animation to new icons
        icon.style.opacity = '0';
        icon.style.transform = 'scale(0.5)';
        icon.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            icon.style.opacity = '1';
            icon.style.transform = 'scale(1)';
        }, 100);
    }
    
    // Method to trigger specific icon animation
    triggerAnimation(iconSelector, animationName) {
        const icon = document.querySelector(iconSelector);
        if (icon) {
            icon.style.animation = `${animationName} 1s ease-in-out`;
            setTimeout(() => {
                icon.style.animation = '';
            }, 1000);
        }
    }
    
    // Method to pause/resume all icon animations
    pauseAnimations() {
        document.body.style.setProperty('--animation-play-state', 'paused');
    }
    
    resumeAnimations() {
        document.body.style.setProperty('--animation-play-state', 'running');
    }
    
    // Method to remove all icon animations
    removeAnimations() {
        const styleElement = document.getElementById('icon-animations-styles');
        if (styleElement) {
            styleElement.remove();
        }
        this.animationsLoaded = false;
    }
}

// Initialize Icon Animations System
function initIconAnimations() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new IconAnimationsSystem();
        });
    } else {
        new IconAnimationsSystem();
    }
}

// Export for use in main file
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initIconAnimations, IconAnimationsSystem };
} else {
    // Browser environment
    window.IconAnimations = { initIconAnimations, IconAnimationsSystem };
}