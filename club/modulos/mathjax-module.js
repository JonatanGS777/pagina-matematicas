/**
 * MathJax Module - Standalone mathematical expression renderer
 * Handles all MathJax functionality with robust error handling and fallbacks
 * 
 * @version 1.0.0
 * @author Math Competition System
 */

class MathJaxModule {
    constructor(config = {}) {
        this.isReady = false;
        this.isLoading = false;
        this.hasError = false;
        this.readyPromise = null;
        this.renderQueue = [];
        
        // Default configuration
        this.config = {
            useInlineMath: true,
            useDisplayMath: true,
            processingTimeout: 5000,
            cdnUrl: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
            fallbackUrl: null,
            enableDebugLogs: true,
            ...config
        };

        this.log('MathJax Module initialized with config:', this.config);
        this.initialize();
    }

    /**
     * Initialize MathJax with robust error handling
     */
    async initialize() {
        if (this.isLoading || this.isReady) {
            return this.readyPromise;
        }

        this.isLoading = true;
        this.log('Starting MathJax initialization...');

        this.readyPromise = new Promise((resolve) => {
            this.setupMathJaxConfig();
            this.loadMathJaxScript()
                .then(() => {
                    this.isReady = true;
                    this.isLoading = false;
                    this.log('MathJax initialization completed successfully');
                    this.processQueue();
                    resolve(true);
                })
                .catch((error) => {
                    this.hasError = true;
                    this.isLoading = false;
                    this.warn('MathJax initialization failed:', error.message);
                    this.processQueue(); // Process queue without MathJax
                    resolve(false);
                });
        });

        return this.readyPromise;
    }

    /**
     * Setup MathJax configuration
     */
    setupMathJaxConfig() {
        if (window.MathJax) {
            this.log('MathJax config already exists, skipping setup');
            return;
        }

        const inlineMath = this.config.useInlineMath ? [['$', '$'], ['\\(', '\\)']] : [];
        const displayMath = this.config.useDisplayMath ? [['$$', '$$'], ['\\[', '\\]']] : [];

        window.MathJax = {
            tex: {
                inlineMath,
                displayMath,
                processEscapes: true,
                processEnvironments: true,
                packages: {'[+]': ['base', 'ams', 'noerrors', 'noundefined']},
                macros: {
                    // Common macros for mathematical expressions
                    R: "\\mathbb{R}",
                    N: "\\mathbb{N}",
                    Z: "\\mathbb{Z}",
                    Q: "\\mathbb{Q}",
                    C: "\\mathbb{C}",
                    vec: ["\\overrightarrow{#1}", 1],
                    abs: ["\\left|#1\\right|", 1],
                    norm: ["\\left\\|#1\\right\\|", 1]
                }
            },
            options: {
                ignoreHtmlClass: 'no-mathjax',
                processHtmlClass: 'mathjax',
                renderActions: {
                    findScript: [10, function (doc) {
                        for (const node of document.querySelectorAll('script[type^="math/tex"]')) {
                            const display = !!node.type.match(/; *mode=display/);
                            const math = new doc.options.MathItem(node.textContent, doc.inputJax[0], display);
                            const text = document.createTextNode('');
                            node.parentNode.replaceChild(text, node);
                            math.start = {node: text, delim: '', n: 0};
                            math.end = {node: text, delim: '', n: 0};
                            doc.math.push(math);
                        }
                    }, '']
                }
            },
            startup: {
                typeset: false,
                ready: () => {
                    MathJax.startup.defaultReady();
                    this.log('MathJax startup completed');
                }
            },
            loader: {
                load: ['[tex]/ams', '[tex]/noerrors', '[tex]/noundefined']
            }
        };

        this.log('MathJax configuration set up successfully');
    }

    /**
     * Load MathJax script with fallback handling
     */
    loadMathJaxScript() {
        return new Promise((resolve, reject) => {
            // Check if script already exists
            let script = document.getElementById('MathJax-script');
            
            if (script) {
                this.log('MathJax script already exists');
                this.waitForMathJaxReady().then(resolve).catch(reject);
                return;
            }

            // Create new script element
            script = document.createElement('script');
            script.id = 'MathJax-script';
            script.async = true;
            script.src = this.config.cdnUrl;

            let resolved = false;
            const finish = (success, error = null) => {
                if (resolved) return;
                resolved = true;
                
                if (success) {
                    this.waitForMathJaxReady().then(resolve).catch(reject);
                } else {
                    reject(error || new Error('Failed to load MathJax script'));
                }
            };

            // Success handler
            script.onload = () => {
                this.log('MathJax script loaded successfully from CDN');
                finish(true);
            };

            // Error handler with fallback
            script.onerror = () => {
                this.warn('Failed to load MathJax from primary CDN');
                
                if (this.config.fallbackUrl) {
                    this.log('Attempting to load from fallback URL...');
                    script.src = this.config.fallbackUrl;
                    script.onload = () => {
                        this.log('MathJax loaded successfully from fallback');
                        finish(true);
                    };
                    script.onerror = () => {
                        this.warn('Fallback URL also failed');
                        finish(false, new Error('Both primary and fallback CDN failed'));
                    };
                } else {
                    finish(false, new Error('Primary CDN failed and no fallback configured'));
                }
            };

            // Timeout handler
            setTimeout(() => {
                if (!resolved) {
                    this.warn('MathJax loading timeout reached');
                    finish(false, new Error('Loading timeout'));
                }
            }, this.config.processingTimeout);

            // Append script to document
            document.head.appendChild(script);
            this.log('MathJax script element created and appended');
        });
    }

    /**
     * Wait for MathJax to be fully ready
     */
    waitForMathJaxReady() {
        return new Promise((resolve, reject) => {
            const maxAttempts = 50;
            let attempts = 0;

            const checkReady = () => {
                attempts++;
                
                if (window.MathJax && 
                    window.MathJax.startup && 
                    window.MathJax.startup.promise) {
                    
                    window.MathJax.startup.promise
                        .then(() => {
                            this.log('MathJax startup promise resolved');
                            resolve();
                        })
                        .catch((error) => {
                            this.warn('MathJax startup promise rejected:', error);
                            reject(error);
                        });
                } else if (attempts >= maxAttempts) {
                    reject(new Error('MathJax failed to initialize within expected time'));
                } else {
                    setTimeout(checkReady, 100);
                }
            };

            checkReady();
        });
    }

    /**
     * Render mathematical expressions in given element(s)
     * @param {Element|NodeList|string} target - Element(s) to render or selector
     * @param {Object} options - Rendering options
     */
    async render(target, options = {}) {
        const renderOptions = {
            force: false,
            timeout: 3000,
            ...options
        };

        this.log('🎯 Render request received for target:', target);
        this.log('📊 Current status:', this.getStatus());

        if (!this.isReady && !this.hasError) {
            // Add to queue if MathJax is still loading
            this.renderQueue.push({ target, options: renderOptions });
            this.log('⏳ Added render request to queue (MathJax not ready)');
            return false;
        }

        if (this.hasError) {
            this.warn('❌ Cannot render - MathJax failed to load');
            return false;
        }

        try {
            const elements = this.normalizeTarget(target);
            if (elements.length === 0) {
                this.warn('⚠️ No elements found for rendering');
                return false;
            }

            this.log(`🔄 Rendering MathJax for ${elements.length} element(s)...`);

            // Verify MathJax is actually available
            if (!window.MathJax) {
                throw new Error('window.MathJax is not available');
            }

            if (typeof window.MathJax.typesetPromise !== 'function') {
                throw new Error('MathJax.typesetPromise is not a function');
            }

            await Promise.race([
                window.MathJax.typesetPromise(elements),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Render timeout')), renderOptions.timeout)
                )
            ]);

            this.log('✅ MathJax rendering completed successfully');
            return true;

        } catch (error) {
            this.warn('❌ Error during MathJax rendering:', error.message);
            return false;
        }
    }

    /**
     * Render inline mathematical expression
     * @param {string} expression - Mathematical expression
     * @param {Element} container - Container element
     */
    renderInline(expression, container) {
        if (!container) {
            this.warn('No container provided for inline rendering');
            return false;
        }

        const wrappedExpression = expression.includes('$') ? expression : `$${expression}$`;
        container.innerHTML = wrappedExpression;
        return this.render(container);
    }

    /**
     * Render display mathematical expression
     * @param {string} expression - Mathematical expression
     * @param {Element} container - Container element
     */
    renderDisplay(expression, container) {
        if (!container) {
            this.warn('No container provided for display rendering');
            return false;
        }

        const wrappedExpression = expression.includes('$$') ? expression : `$$${expression}$$`;
        container.innerHTML = wrappedExpression;
        return this.render(container);
    }

    /**
     * Process queued render requests
     */
    async processQueue() {
        if (this.renderQueue.length === 0) return;

        this.log(`Processing ${this.renderQueue.length} queued render requests...`);

        const queue = [...this.renderQueue];
        this.renderQueue = [];

        for (const item of queue) {
            await this.render(item.target, item.options);
        }

        this.log('Finished processing render queue');
    }

    /**
     * Normalize target to array of elements
     */
    normalizeTarget(target) {
        if (typeof target === 'string') {
            return Array.from(document.querySelectorAll(target));
        }
        
        if (target instanceof Element) {
            return [target];
        }
        
        if (target instanceof NodeList || Array.isArray(target)) {
            return Array.from(target);
        }
        
        return [];
    }

    /**
     * Check if MathJax is ready
     */
    isMathjaxReady() {
        const basicReady = this.isReady && !this.hasError;
        const mathJaxAvailable = window.MathJax && 
                                 window.MathJax.startup && 
                                 window.MathJax.startup.document &&
                                 typeof window.MathJax.typesetPromise === 'function';
        
        const fullyReady = basicReady && mathJaxAvailable;
        
        if (this.config.enableDebugLogs && !fullyReady) {
            this.log('🔍 MathJax readiness check:', {
                basicReady,
                mathJaxAvailable,
                windowMathJax: !!window.MathJax,
                startup: !!(window.MathJax && window.MathJax.startup),
                document: !!(window.MathJax && window.MathJax.startup && window.MathJax.startup.document),
                typesetPromise: !!(window.MathJax && typeof window.MathJax.typesetPromise === 'function')
            });
        }
        
        return fullyReady;
    }

    /**
     * Check if MathJax failed to load
     */
    hasMathjaxError() {
        return this.hasError;
    }

    /**
     * Get MathJax status
     */
    getStatus() {
        return {
            isReady: this.isReady,
            isLoading: this.isLoading,
            hasError: this.hasError,
            queueLength: this.renderQueue.length
        };
    }

    /**
     * Reset module state (useful for testing)
     */
    reset() {
        this.isReady = false;
        this.isLoading = false;
        this.hasError = false;
        this.readyPromise = null;
        this.renderQueue = [];
        this.log('MathJax module reset');
    }

    /**
     * Destroy module and cleanup
     */
    destroy() {
        this.renderQueue = [];
        
        const script = document.getElementById('MathJax-script');
        if (script) {
            script.remove();
        }

        if (window.MathJax) {
            delete window.MathJax;
        }

        this.log('MathJax module destroyed');
    }

    /**
     * Logging utilities
     */
    log(...args) {
        if (this.config.enableDebugLogs) {
            console.log('[MathJax Module]', ...args);
        }
    }

    warn(...args) {
        console.warn('[MathJax Module]', ...args);
    }

    error(...args) {
        console.error('[MathJax Module]', ...args);
    }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MathJaxModule;
} else if (typeof define === 'function' && define.amd) {
    define([], () => MathJaxModule);
} else {
    window.MathJaxModule = MathJaxModule;
}

// Auto-initialize with default config if not in module environment
if (typeof module === 'undefined' && !window.mathJaxModuleInstance) {
    window.mathJaxModuleInstance = new MathJaxModule();
}