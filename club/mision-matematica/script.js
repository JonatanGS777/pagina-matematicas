/* =====================================================
   MISIÓN MATEMÁTICA — JS Moderno 2025
   ===================================================== */

'use strict';

// =====================================================
// LOADER
// =====================================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (!loader) return;

    setTimeout(() => {
        loader.classList.add('fade-out');
        // Re-inicializar Lucide después del loader
        setTimeout(() => {
            loader.remove();
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 750);
    }, 1000);
});

// =====================================================
// CANVAS PARTICLE SYSTEM
// =====================================================
(function initParticles() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) return;

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        const types = [
            { color: '#ffffff', prob: 0.70, minSize: 0.3, maxSize: 1.8 },
            { color: '#00ff88', prob: 0.20, minSize: 0.5, maxSize: 2.5 },
            { color: '#ff6b2c', prob: 0.07, minSize: 0.5, maxSize: 2.0 },
            { color: '#ffd700', prob: 0.03, minSize: 0.5, maxSize: 2.0 },
        ];

        let r = Math.random();
        let type = types[0];
        let cumulative = 0;
        for (const t of types) {
            cumulative += t.prob;
            if (r <= cumulative) { type = t; break; }
        }

        return {
            x:          Math.random() * canvas.width,
            y:          Math.random() * canvas.height,
            size:       type.minSize + Math.random() * (type.maxSize - type.minSize),
            speedX:     (Math.random() - 0.5) * 0.18,
            speedY:     (Math.random() - 0.5) * 0.18 - 0.06,
            opacity:    0.3 + Math.random() * 0.7,
            color:      type.color,
            phase:      Math.random() * Math.PI * 2,
            phaseSpeed: 0.005 + Math.random() * 0.025,
        };
    }

    function initParticlePool() {
        const count = Math.min(220, Math.floor((canvas.width * canvas.height) / 5500));
        particles = Array.from({ length: count }, createParticle);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const t = performance.now() * 0.001;

        for (const p of particles) {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0)             p.x = canvas.width;
            if (p.x > canvas.width)  p.x = 0;
            if (p.y < 0)             p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            const twinkle = (Math.sin(t * p.phaseSpeed * 10 + p.phase) + 1) * 0.5;
            const alpha   = p.opacity * (0.4 + twinkle * 0.6);

            ctx.globalAlpha = alpha;

            if (p.color !== '#ffffff' && p.size > 1) {
                ctx.shadowBlur  = 8;
                ctx.shadowColor = p.color;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = 1;
        animId = requestAnimationFrame(draw);
    }

    function start() {
        resize();
        initParticlePool();
        draw();
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            cancelAnimationFrame(animId);
            start();
        }, 200);
    });

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animId);
        } else {
            animId = requestAnimationFrame(draw);
        }
    });

    start();
})();

// =====================================================
// SCROLL PROGRESS BAR — fallback for older browsers
// =====================================================
(function initScrollProgress() {
    if (CSS.supports('animation-timeline: scroll(root block)')) return; // nativo soportado

    const bar = document.getElementById('progress-bar');
    if (!bar) return;

    bar.style.width = '0%';
    bar.style.transform = 'none';
    bar.style.transformOrigin = 'unset';

    function update() {
        const scrolled = window.scrollY;
        const max      = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = `${(scrolled / max) * 100}%`;
    }

    window.addEventListener('scroll', update, { passive: true });
})();

// =====================================================
// NAVEGACIÓN MÓVIL
// =====================================================
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// =====================================================
// SCROLL SPY — Active nav link
// =====================================================
(function initScrollSpy() {
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-menu a[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        });
    }, { threshold: 0.25, rootMargin: '-10% 0px -60% 0px' });

    sections.forEach(s => spy.observe(s));
})();

// =====================================================
// NAVBAR HIDE ON SCROLL DOWN
// =====================================================
let lastScroll = 0;
const navbar   = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const current = window.scrollY;

    if (current <= 0) {
        navbar?.classList.remove('scroll-up', 'scroll-down');
        lastScroll = current;
        return;
    }

    if (current > lastScroll && !navbar?.classList.contains('scroll-down')) {
        navbar?.classList.replace('scroll-up', 'scroll-down') || navbar?.classList.add('scroll-down');
    } else if (current < lastScroll && navbar?.classList.contains('scroll-down')) {
        navbar?.classList.replace('scroll-down', 'scroll-up') || navbar?.classList.add('scroll-up');
    }

    lastScroll = current;
}, { passive: true });

// =====================================================
// SMOOTH SCROLL
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;

        const offset = (navbar?.offsetHeight ?? 70) + 8;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// =====================================================
// COUNTER ANIMATION
// =====================================================
function animateCounter(el) {
    const target    = parseInt(el.getAttribute('data-target'), 10);
    const duration  = 2000;
    const startTime = performance.now();

    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

    function tick(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.round(easeOutQuart(progress) * target);
        if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

// =====================================================
// INTERSECTION OBSERVER — Scroll reveal + counters
// =====================================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('visible');

        if (entry.target.classList.contains('hero-stats')) {
            entry.target.querySelectorAll('.stat-number').forEach(counter => {
                if (!counter.dataset.counted) {
                    counter.dataset.counted = '1';
                    animateCounter(counter);
                }
            });
        }

        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.25, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
    '.mission-card, .timeline-item, .competition-card, .resource-card, .hero-stats, .weekly-card, .main-objective'
).forEach(el => {
    el.classList.add('fade-in');
    revealObserver.observe(el);
});

// =====================================================
// 3D CARD TILT — Desktop only
// =====================================================
(function initTilt() {
    if (window.innerWidth <= 768) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = document.querySelectorAll(
        '.mission-card, .competition-card, .resource-card, .weekly-card, .mission-statement'
    );

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x    = (e.clientX - rect.left) / rect.width  - 0.5;
            const y    = (e.clientY - rect.top)  / rect.height - 0.5;

            card.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateZ(12px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();

// =====================================================
// PARALLAX — Hero
// =====================================================
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    if (!heroContent) return;
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
        heroContent.style.opacity   = String(1 - (scrolled / window.innerHeight) * 0.6);
    }
}, { passive: true });

// =====================================================
// TYPEWRITER EFFECT
// =====================================================
(function initTypewriter() {
    const el = document.getElementById('typewriter-target');
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const phrases = [
        'Fomentar la excelencia matemática y el pensamiento crítico',
        'Preparando líderes en carreras STEM',
        'Donde los números cobran vida',
        'Tu aventura matemática comienza aquí',
        'Competencias · Investigación · Colaboración',
    ];

    let phraseIdx = 0;
    let charIdx   = 0;
    let deleting  = false;
    let paused    = false;

    el.classList.add('typing');

    function tick() {
        if (paused) return;

        const current = phrases[phraseIdx];

        if (deleting) {
            charIdx--;
            el.textContent = current.substring(0, charIdx);
            if (charIdx <= 0) {
                deleting  = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                setTimeout(tick, 400);
                return;
            }
            setTimeout(tick, 28);
        } else {
            charIdx++;
            el.textContent = current.substring(0, charIdx);
            if (charIdx >= current.length) {
                deleting = true;
                setTimeout(tick, 2800);
                return;
            }
            setTimeout(tick, 65);
        }
    }

    // Start after a natural delay
    setTimeout(tick, 2200);
})();

// =====================================================
// CURSOR PARTICLE TRAIL — Desktop
// =====================================================
(function initCursorTrail() {
    if (window.innerWidth <= 768) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const colors = ['rgba(0,255,136,0.7)', 'rgba(255,107,44,0.6)', 'rgba(255,215,0,0.5)'];
    let lastTime = 0;

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTime < 55) return;
        lastTime = now;

        const dot = document.createElement('div');
        dot.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9990;
            left: ${e.clientX - 3}px;
            top:  ${e.clientY - 3}px;
            transition: transform 0.9s ease, opacity 0.9s ease;
            will-change: transform, opacity;
        `;
        document.body.appendChild(dot);

        requestAnimationFrame(() => {
            dot.style.transform = `translate(${(Math.random() - 0.5) * 30}px, ${(Math.random() - 0.5) * 30}px) scale(0)`;
            dot.style.opacity   = '0';
        });

        setTimeout(() => dot.remove(), 950);
    });
})();

// =====================================================
// NOTIFICATION SYSTEM
// =====================================================
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    document.querySelectorAll('.app-notification').forEach(n => n.remove());

    const note = document.createElement('div');
    note.className = 'app-notification';

    const gradients = {
        success: 'linear-gradient(135deg, #00ff88, #00cc6a)',
        info:    'linear-gradient(135deg, #4a9eff, #0066cc)',
        error:   'linear-gradient(135deg, #ff6b2c, #cc3300)',
    };

    note.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${gradients[type] ?? gradients.success};
        color: #0a1628;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 32px rgba(0,0,0,0.35);
        z-index: 10000;
        font-weight: 700;
        font-family: 'Exo 2', sans-serif;
        max-width: min(400px, calc(100vw - 40px));
        opacity: 0;
        transform: translateX(30px);
        transition: opacity 0.35s ease, transform 0.35s ease;
        cursor: pointer;
    `;
    note.textContent = message;
    document.body.appendChild(note);

    requestAnimationFrame(() => {
        note.style.opacity   = '1';
        note.style.transform = 'translateX(0)';
    });

    const dismiss = () => {
        note.style.opacity   = '0';
        note.style.transform = 'translateX(30px)';
        setTimeout(() => note.remove(), 380);
    };

    note.addEventListener('click', dismiss);
    setTimeout(dismiss, 4000);
}

// =====================================================
// CONTACTO — Formulario
// =====================================================
const contactForm = document.getElementById('contact-form');

contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('.submit-btn');
    btn.disabled = true;

    // Simulate sending
    setTimeout(() => {
        showNotification('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto. 🚀', 'success');
        contactForm.reset();
        btn.disabled = false;
    }, 800);
});

// =====================================================
// RESOURCE LINKS
// =====================================================
document.querySelectorAll('.resource-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const title = link.closest('.resource-card')?.querySelector('h3')?.textContent ?? 'Recurso';
        showNotification(`Accediendo a "${title}"... 📚`, 'info');
    });
});

// =====================================================
// GALLERY CLICK HINT
// =====================================================
document.querySelectorAll('.gallery-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const title = item.querySelector('.gallery-overlay h3')?.textContent ?? '';
            showNotification(`Galería: ${title}`, 'info');
        }
    });
});

// =====================================================
// DARK MODE TOGGLE
// =====================================================
const themeToggle = document.getElementById('theme-toggle');
const htmlEl      = document.documentElement;

function updateThemeIcon(theme) {
    const icon = themeToggle?.querySelector('.theme-icon');
    if (!icon) return;
    icon.setAttribute('data-lucide', theme === 'dark' ? 'moon' : 'sun');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('clubmath-theme', theme);
    updateThemeIcon(theme);
}

// Load saved or system preference
const savedTheme  = localStorage.getItem('clubmath-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(savedTheme ?? (prefersDark ? 'dark' : 'light'));

themeToggle?.addEventListener('click', () => {
    const current  = htmlEl.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    // Spin animation
    if (themeToggle) {
        themeToggle.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
        themeToggle.style.transform  = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 400);
    }
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('clubmath-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// =====================================================
// CONSOLE BRANDING
// =====================================================
console.log(
    '%c∑ Misión Matemática ∑',
    'font-size:22px;color:#00ff88;font-weight:bold;text-shadow:0 0 12px rgba(0,255,136,0.8);'
);
console.log('%cClub de Matemáticas · EMTP · 2024-2025', 'font-size:13px;color:#ff6b2c;');
console.log('%c¡Prepárate para la aventura matemática!', 'font-size:12px;color:#b8c5db;');
