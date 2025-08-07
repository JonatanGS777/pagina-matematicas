// dark-mode.js - Módulo del Sistema de Modo Oscuro/Claro

class DarkModeSystem {
    constructor() {
        this.isDarkMode = false;
        this.toggleButton = null;
        this.isTransitioning = false;
        this.init();
    }
    
    init() {
        this.addDarkModeStyles();
        this.createToggleButton();
        this.loadUserPreference();
        this.addEventListeners();
        this.applyInitialTheme();
    }
    
    addDarkModeStyles() {
        const style = document.createElement('style');
        style.id = 'dark-mode-styles';
        style.textContent = `
            /* Dark Mode CSS Variables */
            :root {
                --transition-speed: 0.3s;
            }
            
            :root.dark-mode {
                --primary: #8b9cf7;
                --secondary: #a482d4;
                --accent: #f4a6ff;
                --success: #6ee7de;
                --warning: #ffe066;
                --dark: #0a0e1a;
                --light: #1a1f2e;
                --white: #2a2f3e;
                --text-primary: #e2e8f0;
                --text-secondary: #94a3b8;
                --glass: rgba(42, 47, 62, 0.25);
                --glass-border: rgba(139, 156, 247, 0.18);
                --shadow-soft: 0 8px 32px 0 rgba(10, 14, 26, 0.6);
                --shadow-hover: 0 15px 35px rgba(10, 14, 26, 0.4);
            }
            
            /* Smooth transitions for all elements */
            *, *::before, *::after {
                transition: background-color var(--transition-speed) ease,
                           color var(--transition-speed) ease,
                           border-color var(--transition-speed) ease,
                           box-shadow var(--transition-speed) ease !important;
            }
            
            /* Dark mode specific adjustments */
            .dark-mode .animated-bg {
                background: 
                    linear-gradient(-45deg, rgba(139, 156, 247, 0.8), rgba(164, 130, 212, 0.8), rgba(244, 166, 255, 0.8), rgba(110, 231, 222, 0.8)),
                    linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 50%, #2a2f3e 100%);
            }
            
            /* Header base styles */
            .header {
                transition: all 0.3s ease !important;
            }
            
            .dark-mode .header {
                background: rgba(42, 47, 62, 0.95);
                border-bottom: 1px solid rgba(139, 156, 247, 0.1);
                transition: all 0.3s ease !important;
            }
            
            .dark-mode .logo {
                background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .dark-mode .nav-link {
                color: var(--text-primary);
            }
            
            .dark-mode .nav-link:hover {
                background: rgba(139, 156, 247, 0.1);
                color: var(--primary);
            }
            
            .dark-mode .dropdown {
                background: var(--white);
                border: 1px solid rgba(139, 156, 247, 0.1);
                box-shadow: 0 10px 30px rgba(10, 14, 26, 0.3);
            }
            
            .dark-mode .dropdown-item {
                color: var(--text-primary);
                border-bottom: 1px solid rgba(139, 156, 247, 0.05);
            }
            
            /* Specific dropdown hover effects for dark mode */
            .dark-mode .dropdown.classroom .dropdown-item:hover {
                background: rgba(139, 156, 247, 0.15);
                color: var(--primary);
            }
            
            .dark-mode .dropdown.stem .dropdown-item:hover {
                background: rgba(255, 107, 107, 0.15);
                color: #ff8a8a;
            }
            
            .dark-mode .dropdown.club .dropdown-item:hover {
                background: rgba(110, 231, 222, 0.15);
                color: var(--success);
            }
            
            .dark-mode .dropdown.lab .dropdown-item:hover {
                background: rgba(139, 156, 247, 0.15);
                color: var(--primary);
            }
            
            /* Dark mode dropdown borders */
            .dark-mode .dropdown.classroom {
                border-top: 3px solid var(--primary);
            }
            
            .dark-mode .dropdown.stem {
                border-top: 3px solid #ff8a8a;
            }
            
            .dark-mode .dropdown.club {
                border-top: 3px solid var(--success);
            }
            
            .dark-mode .dropdown.lab {
                border-top: 3px solid var(--primary);
            }
            
            /* Mobile menu for dark mode */
            .dark-mode .nav-menu {
                background: var(--white);
            }
            
            .dark-mode .nav-item {
                border-bottom: 1px solid rgba(139, 156, 247, 0.1);
            }
            
            .dark-mode .mobile-toggle span {
                background: var(--primary);
            }
            
            .dark-mode .math-particle.equation {
                color: rgba(139, 156, 247, 0.6);
            }
            
            .dark-mode .math-particle.symbol {
                color: rgba(244, 166, 255, 0.7);
            }
            
            .dark-mode .math-particle.number {
                color: rgba(110, 231, 222, 0.6);
            }
            
            .dark-mode .math-particle.greek {
                color: rgba(255, 230, 102, 0.7);
            }
            
            /* Dark Mode Toggle Button */
            .dark-mode-toggle {
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: none;
                cursor: pointer;
                z-index: 9999;
                overflow: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .dark-mode-toggle:hover {
                transform: translateY(-50%) scale(1.1);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
            }
            
            .dark-mode-toggle:active {
                transform: translateY(-50%) scale(0.95);
            }
            
            .dark-mode .dark-mode-toggle {
                background: linear-gradient(135deg, #8b9cf7 0%, #a482d4 100%);
                box-shadow: 0 4px 15px rgba(139, 156, 247, 0.3);
            }
            
            .dark-mode .dark-mode-toggle:hover {
                box-shadow: 0 8px 25px rgba(139, 156, 247, 0.5);
            }
            
            .toggle-icon {
                font-size: 1.5rem;
                color: white;
                transition: all 0.3s ease;
            }
            
            .toggle-icon.sun {
                opacity: 1;
                transform: rotate(0deg);
            }
            
            .toggle-icon.moon {
                opacity: 0;
                transform: rotate(180deg);
                position: absolute;
            }
            
            .dark-mode .toggle-icon.sun {
                opacity: 0;
                transform: rotate(-180deg);
            }
            
            .dark-mode .toggle-icon.moon {
                opacity: 1;
                transform: rotate(0deg);
            }
            
            /* Page transition effect */
            .theme-transition {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle, transparent 0%, currentColor 100%);
                z-index: 9999;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.6s ease;
                color: var(--primary);
            }
            
            .theme-transition.active {
                opacity: 0.3;
            }
            
            /* Adjustments for specific components */
            .dark-mode .profile-card,
            .dark-mode .text-card,
            .dark-mode .stats-section,
            .dark-mode .project-description,
            .dark-mode .gallery-item {
                background: var(--white);
                border: 1px solid rgba(139, 156, 247, 0.1);
            }
            
            .dark-mode .hero-content {
                background: rgba(42, 47, 62, 0.25);
                border: 1px solid rgba(139, 156, 247, 0.18);
            }
            
            .dark-mode .footer {
                background: var(--dark);
            }
            
            .dark-mode .modal {
                background: rgba(10, 14, 26, 0.95);
            }
            
            /* Mobile adjustments */
            @media (max-width: 768px) {
                .dark-mode-toggle {
                    top: auto;
                    bottom: 20px;
                    right: 90px;
                    transform: none;
                }
                
                .dark-mode-toggle:hover {
                    transform: scale(1.1);
                }
                
                .dark-mode-toggle:active {
                    transform: scale(0.95);
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'dark-mode-toggle';
        button.innerHTML = `
            <i class="fas fa-sun toggle-icon sun"></i>
            <i class="fas fa-moon toggle-icon moon"></i>
        `;
        button.setAttribute('aria-label', 'Toggle dark mode');
        button.title = 'Cambiar modo oscuro/claro';
        
        document.body.appendChild(button);
        this.toggleButton = button;
        
        // Create transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'theme-transition';
        document.body.appendChild(overlay);
        this.transitionOverlay = overlay;
    }
    
    addEventListeners() {
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener((e) => {
                if (!this.hasUserPreference()) {
                    this.setTheme(e.matches);
                }
            });
        }
        
        // Keyboard shortcut (Ctrl/Cmd + Shift + D)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
        
        // Header scroll effect with dark mode support
        this.addScrollEffect();
    }
    
    addScrollEffect() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (!header) return;
            
            const isDark = document.documentElement.classList.contains('dark-mode');
            
            if (window.scrollY > 100) {
                if (isDark) {
                    header.style.background = 'rgba(42, 47, 62, 0.98)';
                    header.style.boxShadow = '0 2px 20px rgba(10, 14, 26, 0.3)';
                } else {
                    header.style.background = 'rgba(255, 255, 255, 0.98)';
                    header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
                }
            } else {
                if (isDark) {
                    header.style.background = 'rgba(42, 47, 62, 0.95)';
                    header.style.boxShadow = 'none';
                } else {
                    header.style.background = 'rgba(255, 255, 255, 0.95)';
                    header.style.boxShadow = 'none';
                }
            }
        });
    }
    
    loadUserPreference() {
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme !== null) {
            this.isDarkMode = savedTheme === 'true';
        } else {
            // Check system preference
            this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
    }
    
    hasUserPreference() {
        return localStorage.getItem('darkMode') !== null;
    }
    
    applyInitialTheme() {
        if (this.isDarkMode) {
            document.documentElement.classList.add('dark-mode');
        }
        // Apply initial header state
        this.updateHeaderOnThemeChange();
    }
    
    async toggleTheme() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.isDarkMode = !this.isDarkMode;
        
        // Save preference
        localStorage.setItem('darkMode', this.isDarkMode.toString());
        
        // Create transition effect
        await this.createTransitionEffect();
        
        // Apply theme
        this.setTheme(this.isDarkMode);
        
        // Create completion sparkles
        this.createToggleSparkles();
        
        // Ensure header is updated after transition
        setTimeout(() => {
            this.updateHeaderOnThemeChange();
            this.isTransitioning = false;
        }, 600);
    }
    
    setTheme(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
        this.isDarkMode = isDark;
        
        // Update header immediately based on current scroll position
        this.updateHeaderOnThemeChange();
    }
    
    updateHeaderOnThemeChange() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        const isDark = this.isDarkMode;
        
        if (window.scrollY > 100) {
            if (isDark) {
                header.style.background = 'rgba(42, 47, 62, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(10, 14, 26, 0.3)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            }
        } else {
            if (isDark) {
                header.style.background = 'rgba(42, 47, 62, 0.95)';
                header.style.boxShadow = 'none';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        }
    }
    
    async createTransitionEffect() {
        return new Promise((resolve) => {
            this.transitionOverlay.classList.add('active');
            
            setTimeout(() => {
                this.transitionOverlay.classList.remove('active');
                // Force header update during transition
                this.updateHeaderOnThemeChange();
                resolve();
            }, 300);
        });
    }
    
    createToggleSparkles() {
        const button = this.toggleButton;
        const rect = button.getBoundingClientRect();
        const sparkles = this.isDarkMode ? ['🌙', '⭐', '✨', '🌟'] : ['☀️', '💫', '✨', '🌤️'];
        
        for (let i = 0; i < 6; i++) {
            const sparkle = document.createElement('div');
            sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.position = 'fixed';
            sparkle.style.left = (rect.left + rect.width / 2) + 'px';
            sparkle.style.top = (rect.top + rect.height / 2) + 'px';
            sparkle.style.fontSize = '1.2rem';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '10001';
            sparkle.style.animation = `toggleSparkle 1.5s ease-out forwards`;
            sparkle.style.animationDelay = i * 0.1 + 's';
            
            // Random direction
            const angle = (Math.PI * 2 * i) / 6;
            const distance = 60;
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
        
        // Add sparkle animation if not exists
        if (!document.getElementById('toggle-sparkle-animation')) {
            const sparkleStyle = document.createElement('style');
            sparkleStyle.id = 'toggle-sparkle-animation';
            sparkleStyle.textContent = `
                @keyframes toggleSparkle {
                    0% {
                        transform: translate(0, 0) scale(0.5) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(var(--end-x, 40px), var(--end-y, -40px)) scale(1.2) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(sparkleStyle);
        }
    }
    
    // Method to programmatically set theme
    setDarkMode(isDark) {
        if (this.isDarkMode !== isDark) {
            this.toggleTheme();
        }
    }
    
    // Method to get current theme
    getCurrentTheme() {
        return this.isDarkMode ? 'dark' : 'light';
    }
    
    // Method to remove dark mode functionality
    destroy() {
        if (this.toggleButton) {
            this.toggleButton.remove();
        }
        if (this.transitionOverlay) {
            this.transitionOverlay.remove();
        }
        const styleElement = document.getElementById('dark-mode-styles');
        if (styleElement) {
            styleElement.remove();
        }
        document.documentElement.classList.remove('dark-mode');
    }
}

// Initialize Dark Mode System
function initDarkMode() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new DarkModeSystem();
        });
    } else {
        new DarkModeSystem();
    }
}

// Export for use in main file
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initDarkMode, DarkModeSystem };
} else {
    // Browser environment
    window.DarkMode = { initDarkMode, DarkModeSystem };
}