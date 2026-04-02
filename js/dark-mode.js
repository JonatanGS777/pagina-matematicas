// dark-mode.js - Módulo del Sistema de Modo Oscuro/Claro

class DarkModeSystem {
    constructor() {
        this.isDarkMode = false;
        this.toggleButton = null;
        this.isTransitioning = false;
        this.mediaQuery = null;
        this.projectRootUrl = this.getProjectRootUrl();
        this.init();
    }

    getProjectRootUrl() {
        // Resolve a stable project root from the actual dark-mode.js script URL.
        const scriptEl = document.currentScript || Array.from(document.scripts).find((s) =>
            typeof s.src === 'string' && s.src.includes('dark-mode.js')
        );

        if (!scriptEl || !scriptEl.src) {
            return new URL('./', window.location.href);
        }

        // dark-mode.js lives in /js/, so one level up is the site root.
        return new URL('../', new URL(scriptEl.src, window.location.href));
    }

    resolveAssetUrl(relativePath) {
        return new URL(String(relativePath).replace(/^\/+/, ''), this.projectRootUrl).href;
    }

    detectPageBackgroundImage() {
        const animatedBg = document.querySelector('.animated-bg');
        if (!animatedBg) return this.resolveAssetUrl('imagenes/fondo2.jpg');

        const computedBg = window.getComputedStyle(animatedBg).backgroundImage || '';
        const matches = Array.from(computedBg.matchAll(/url\((['"]?)(.*?)\1\)/g));
        if (matches.length > 0) {
            return matches[matches.length - 1][2];
        }

        return this.resolveAssetUrl('imagenes/fondo2.jpg');
    }

    refreshDarkBackgroundImageVariable() {
        const pageBgImage = this.detectPageBackgroundImage();
        document.documentElement.style.setProperty('--dark-mode-bg-image', `url("${pageBgImage}")`);
    }
    
    init() {
        this.addDarkModeStyles();
        this.refreshDarkBackgroundImageVariable();
        this.createToggleButton();
        this.loadUserPreference();
        this.addEventListeners();
        this.applyInitialTheme();
    }
    
    addDarkModeStyles() {
        const style = document.createElement('style');
        style.id = 'dark-mode-styles';
        const darkBackgroundImage = this.resolveAssetUrl('imagenes/fondo2.jpg');
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
                    linear-gradient(-45deg, rgba(10, 14, 26, 0.65), rgba(26, 31, 46, 0.72), rgba(42, 47, 62, 0.65), rgba(10, 14, 26, 0.70)),
                    var(--dark-mode-bg-image, url('${darkBackgroundImage}'));
                background-size: 400% 400%, cover;
                background-position: 0% 50%, center;
                background-repeat: no-repeat;
                animation: gradientShift 18s ease infinite;
            }
            
            /* Header base styles */
            .header {
                transition: all 0.3s ease !important;
            }
            
            .dark-mode .header,
            .dark-mode .navbar {
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

            .dark-mode .project-description::after {
                color: rgba(139, 156, 247, 0.08);
            }

            .dark-mode .project-meta-tag {
                background: rgba(139, 156, 247, 0.1);
                color: var(--primary);
                border-color: rgba(139, 156, 247, 0.2);
            }

            .dark-mode .project-meta-tag.accent {
                background: rgba(110, 231, 222, 0.1);
                color: var(--success);
                border-color: rgba(110, 231, 222, 0.2);
            }

            .dark-mode .project-description-lead {
                color: var(--text-primary);
            }

            .dark-mode .project-description-body {
                color: var(--text-secondary);
            }

            .dark-mode .project-description-body strong {
                color: var(--primary);
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
            
            /* ========== ANÁLISIS EN TIEMPO REAL - DARK MODE ========== */
            .dark-mode .stat-card {
                background: rgba(42, 47, 62, 0.95);
                border: 1px solid rgba(139, 156, 247, 0.15);
                box-shadow: 0 8px 32px rgba(10, 14, 26, 0.4);
            }
            
            .dark-mode .stat-card:hover {
                box-shadow: 0 16px 48px rgba(10, 14, 26, 0.5);
                border-color: rgba(139, 156, 247, 0.25);
            }
            
            .dark-mode .stat-card .card-title,
            .dark-mode .stat-card .stat-label,
            .dark-mode .stat-card .country-name {
                color: var(--text-primary);
            }
            
            .dark-mode .stat-card .stat-value {
                color: var(--primary);
            }
            
            .dark-mode .stat-card .stat-sublabel,
            .dark-mode .stat-card .country-percentage,
            .dark-mode .stat-card .device-name,
            .dark-mode .stat-card .page-name {
                color: var(--text-secondary);
            }
            
            .dark-mode .stat-card .trend {
                color: var(--success);
            }
            
            .dark-mode .stat-card .trend.down {
                color: #ff8a8a;
            }
            
            .dark-mode .progress-bar {
                background: rgba(139, 156, 247, 0.15);
            }
            
            .dark-mode .country-bar {
                background: rgba(139, 156, 247, 0.2);
            }
            
            .dark-mode .country-item:hover .country-name {
                color: var(--primary);
            }
            
            .dark-mode .device-item:hover,
            .dark-mode .page-item:hover {
                background: rgba(139, 156, 247, 0.1);
            }
            
            .dark-mode .insights-section {
                background: rgba(42, 47, 62, 0.6);
                border: 1px solid rgba(139, 156, 247, 0.1);
            }

            .dark-mode .insights-title {
                color: var(--text-primary);
            }

            .dark-mode .insights-list li {
                color: var(--text-secondary);
            }

            .dark-mode .insights-list li::before {
                color: var(--primary);
            }

            /* Poll card */
            .dark-mode .poll-option {
                background: rgba(139, 156, 247, 0.06);
                border-color: rgba(139, 156, 247, 0.2);
                color: var(--text-secondary);
            }

            .dark-mode .poll-option:hover {
                background: rgba(139, 156, 247, 0.15);
                border-color: var(--primary);
                color: var(--primary);
            }

            .dark-mode .poll-title {
                color: var(--text-primary);
            }

            .dark-mode .poll-voted-text {
                color: var(--text-primary);
            }

            .dark-mode .poll-voted-choice {
                background: rgba(139, 156, 247, 0.1);
                border-color: rgba(139, 156, 247, 0.2);
                color: var(--primary);
            }

            /* Insight cards */
            .dark-mode .insight-card {
                background: rgba(42, 47, 62, 0.85);
            }

            .dark-mode .insight-card.positive {
                background: rgba(0, 212, 170, 0.12);
            }

            .dark-mode .insight-card.info {
                background: rgba(139, 156, 247, 0.1);
            }

            .dark-mode .insight-card.neutral {
                background: rgba(255, 230, 102, 0.1);
            }

            .dark-mode .insight-content p {
                color: var(--text-secondary);
            }
            
            /* ========== CHATBOT - DARK MODE ========== */
            .dark-mode .chatbot-window {
                background: var(--white);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            }
            
            .dark-mode .chatbot-messages {
                background: linear-gradient(to bottom, #1a1f2e, #2a2f3e);
            }
            
            .dark-mode .chatbot-container .message.bot .message-bubble {
                background: rgba(42, 47, 62, 0.95);
                border: 1px solid rgba(139, 156, 247, 0.2);
                color: var(--text-primary);
            }
            
            .dark-mode .chatbot-container .message-card {
                background: rgba(26, 31, 46, 0.8);
                border: 1px solid rgba(139, 156, 247, 0.15);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }
            
            .dark-mode .chatbot-container .message-card-title {
                color: var(--text-primary);
            }
            
            .dark-mode .chatbot-container .quick-action-chip {
                background: rgba(42, 47, 62, 0.8);
                border: 1px solid rgba(139, 156, 247, 0.3);
                color: var(--primary);
            }
            
            .dark-mode .chatbot-container .quick-action-chip:hover {
                background: rgba(139, 156, 247, 0.15);
                color: #a4b3ff;
            }
            
            .dark-mode .chatbot-container .period-card {
                background: linear-gradient(135deg, #1a1f2e, #2a2f3e);
                border: 1px solid rgba(139, 156, 247, 0.2);
                color: var(--text-primary);
            }
            
            .dark-mode .chatbot-container .period-card:hover {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }
            
            .dark-mode .chatbot-container .nav-link {
                background: rgba(42, 47, 62, 0.8);
                border: 1px solid rgba(139, 156, 247, 0.15);
                color: var(--text-primary);
            }
            
            .dark-mode .chatbot-container .nav-link:hover {
                background: rgba(139, 156, 247, 0.1);
                border-color: rgba(139, 156, 247, 0.3);
            }
            
            .dark-mode .chatbot-container .nav-link-title {
                color: var(--text-primary);
            }
            
            .dark-mode .chatbot-container .nav-link-desc {
                color: var(--text-secondary);
            }
            
            .dark-mode .chatbot-input-container {
                background: var(--white);
                border-top: 1px solid rgba(139, 156, 247, 0.15);
            }
            
            .dark-mode .chatbot-input {
                background: rgba(26, 31, 46, 0.8);
                border: 1px solid rgba(139, 156, 247, 0.2);
                color: var(--text-primary);
            }
            
            .dark-mode .chatbot-input::placeholder {
                color: var(--text-secondary);
            }
            
            .dark-mode .chatbot-input:focus {
                border-color: rgba(139, 156, 247, 0.5);
                background: rgba(26, 31, 46, 0.95);
            }
            
            .dark-mode .chatbot-container .typing-indicator {
                background: rgba(42, 47, 62, 0.95);
                border: 1px solid rgba(139, 156, 247, 0.2);
            }
            
            .dark-mode .typing-dot {
                background: var(--primary);
            }
            
            .dark-mode .chatbot-container .welcome-title {
                color: var(--text-primary);
            }
            
            .dark-mode .chatbot-container .welcome-subtitle {
                color: var(--text-secondary);
            }
            
            .dark-mode .chatbot-container .category-title {
                color: var(--text-secondary);
            }
            
            .dark-mode .chatbot-header {
                background: linear-gradient(135deg, #5a6fd6 0%, #6a4fa8 100%);
            }
            
            /* Chatbot - elementos faltantes */
            .dark-mode .search-input {
                background: rgba(26, 31, 46, 0.8);
                border: 1px solid rgba(139, 156, 247, 0.2);
                color: var(--text-primary);
            }
            
            .dark-mode .search-input::placeholder {
                color: var(--text-secondary);
            }
            
            .dark-mode .search-input:focus {
                border-color: rgba(139, 156, 247, 0.5);
                background: rgba(26, 31, 46, 0.95);
            }
            
            .dark-mode .search-result {
                background: rgba(42, 47, 62, 0.9);
                border-left: 3px solid var(--primary);
            }
            
            .dark-mode .search-result-period {
                color: var(--primary);
            }
            
            .dark-mode .search-result-text {
                color: var(--text-primary);
            }
            
            .dark-mode .chatbot-container .form-label {
                color: var(--text-secondary);
            }
            
            .dark-mode .chatbot-container .form-input,
            .dark-mode .chatbot-container .form-select,
            .dark-mode .chatbot-container .form-textarea {
                background: rgba(26, 31, 46, 0.8);
                border: 1px solid rgba(139, 156, 247, 0.2);
                color: var(--text-primary);
            }
            
            .dark-mode .chatbot-container .form-input:focus,
            .dark-mode .chatbot-container .form-select:focus,
            .dark-mode .chatbot-container .form-textarea:focus {
                border-color: rgba(139, 156, 247, 0.5);
                background: rgba(26, 31, 46, 0.95);
            }
            
            .dark-mode .chatbot-container .form-input::placeholder,
            .dark-mode .chatbot-container .form-textarea::placeholder {
                color: var(--text-secondary);
            }
            
            .dark-mode .tip-card {
                background: linear-gradient(135deg, rgba(120, 53, 15, 0.3), rgba(180, 83, 9, 0.2));
                border: 1px solid rgba(251, 191, 36, 0.3);
            }
            
            .dark-mode .tip-card-text {
                color: #fcd34d;
            }
            
            .dark-mode .chatbot-container .message-text {
                color: var(--text-primary);
            }
            
            .dark-mode .chatbot-container .stat-value {
                color: var(--primary);
            }
            
            .dark-mode .chatbot-container .stat-label {
                color: var(--text-secondary);
            }
            
            .dark-mode .chatbot-container .stat-item {
                background: rgba(42, 47, 62, 0.6);
                border: 1px solid rgba(139, 156, 247, 0.1);
            }
            
            .dark-mode .chatbot-messages::-webkit-scrollbar-thumb {
                background: rgba(139, 156, 247, 0.3);
            }
            
            .dark-mode .chatbot-container .quick-actions-title,
            .dark-mode .chatbot-container .section-title {
                color: var(--text-secondary);
            }
            
            .dark-mode .favorites-indicator {
                border-color: var(--white);
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

        // Keyboard shortcut (Ctrl/Cmd + Shift + D)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleTheme();
            }
        });

        window.addEventListener('load', () => {
            this.refreshDarkBackgroundImageVariable();
        });
    }
    
    addScrollEffect() {
        // Intentionally unused.
        // Each page already controls header scroll states with its own CSS/JS.
    }
    
    loadUserPreference() {
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme !== null) {
            this.isDarkMode = savedTheme === 'true';
        } else {
            // Default to light mode until the user explicitly chooses.
            // This avoids mismatches between PC and mobile caused by OS theme.
            this.isDarkMode = false;
            localStorage.setItem('darkMode', 'false');
        }
    }
    
    hasUserPreference() {
        return localStorage.getItem('darkMode') !== null;
    }
    
    applyInitialTheme() {
        if (this.isDarkMode) {
            document.documentElement.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
            document.body.classList.remove('dark-mode');
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
        this.refreshDarkBackgroundImageVariable();

        if (isDark) {
            document.documentElement.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
            document.body.classList.remove('dark-mode');
        }
        this.isDarkMode = isDark;
        
        // Update header immediately based on current scroll position
        this.updateHeaderOnThemeChange();
    }
    
    updateHeaderOnThemeChange() {
        // Keep header visuals controlled by each page's own CSS/scroll logic.
        document.querySelectorAll('.header, .navbar').forEach((el) => {
            el.style.background = '';
            el.style.boxShadow = '';
        });
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
        if (document.body) {
            document.body.classList.remove('dark-mode');
        }
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
