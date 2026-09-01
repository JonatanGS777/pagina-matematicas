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
        setTimeout(() => {
            loader.remove();
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
    const LINK_DIST = 130;

    if (reducedMotion) return;

    let colors = { dot: '#f2f0e8', accent: '#d7ff3d', accent2: '#ff2e63' };

    function readThemeColors() {
        const style = getComputedStyle(document.documentElement);
        colors.dot     = style.getPropertyValue('--text').trim()    || colors.dot;
        colors.accent  = style.getPropertyValue('--accent').trim()  || colors.accent;
        colors.accent2 = style.getPropertyValue('--accent-2').trim()|| colors.accent2;
    }

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        const types = [
            { key: 'dot',     prob: 0.70, minSize: 0.4, maxSize: 1.8 },
            { key: 'accent',  prob: 0.20, minSize: 0.6, maxSize: 2.6 },
            { key: 'accent2', prob: 0.10, minSize: 0.6, maxSize: 2.2 },
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
            colorKey:   type.key,
            phase:      Math.random() * Math.PI * 2,
            phaseSpeed: 0.005 + Math.random() * 0.025,
        };
    }

    function initParticlePool() {
        const count = Math.min(160, Math.floor((canvas.width * canvas.height) / 8000));
        particles = Array.from({ length: count }, createParticle);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const t = performance.now() * 0.001;

        // Líneas de constelación entre nodos cercanos
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i];
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINK_DIST) {
                    ctx.globalAlpha = (1 - dist / LINK_DIST) * 0.35;
                    ctx.strokeStyle = colors.accent;
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        for (const p of particles) {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0)             p.x = canvas.width;
            if (p.x > canvas.width)  p.x = 0;
            if (p.y < 0)             p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            const twinkle = (Math.sin(t * p.phaseSpeed * 10 + p.phase) + 1) * 0.5;
            const alpha   = p.opacity * (0.4 + twinkle * 0.6);
            const fill    = colors[p.colorKey];

            ctx.globalAlpha = alpha;

            if (p.colorKey !== 'dot' && p.size > 1) {
                ctx.shadowBlur  = 6;
                ctx.shadowColor = fill;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = fill;
            ctx.fill();

            ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = 1;
        animId = requestAnimationFrame(draw);
    }

    function start() {
        resize();
        readThemeColors();
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

    // Recolorear nodos al cambiar de tema
    new MutationObserver(readThemeColors).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
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

    const phrasesES = [
        'Fomentar la excelencia matemática y el pensamiento crítico',
        'Preparando líderes en carreras STEM',
        'Donde los números cobran vida',
        'Tu aventura matemática comienza aquí',
        'Competencias · Investigación · Colaboración',
    ];

    const phrasesEN = [
        'Fostering mathematical excellence and critical thinking',
        'Training future STEM leaders',
        'Where numbers come to life',
        'Your mathematical adventure starts here',
        'Competitions · Research · Collaboration',
    ];

    function getPhrases() {
        const lang = (typeof I18n !== 'undefined') ? I18n.getCurrentLang() : 'es';
        return lang === 'en' ? phrasesEN : phrasesES;
    }

    let phraseIdx = 0;
    let charIdx   = 0;
    let deleting  = false;
    let paused    = false;

    el.classList.add('typing');

    function tick() {
        if (paused) return;

        const current = getPhrases()[phraseIdx];

        if (deleting) {
            charIdx--;
            el.textContent = current.substring(0, charIdx);
            if (charIdx <= 0) {
                deleting  = false;
                phraseIdx = (phraseIdx + 1) % getPhrases().length;
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

    // Restart typewriter when language changes
    document.addEventListener('i18n:langChange', () => {
        paused    = true;
        el.textContent = '';
        phraseIdx = 0;
        charIdx   = 0;
        deleting  = false;
        paused    = false;
        setTimeout(tick, 400);
    });
})();

// =====================================================
// CURSOR PARTICLE TRAIL — Desktop
// =====================================================
(function initCursorTrail() {
    if (window.innerWidth <= 768) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const colors = ['rgba(215,255,61,0.8)', 'rgba(255,46,99,0.7)'];
    let lastTime = 0;

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTime < 55) return;
        lastTime = now;

        const dot = document.createElement('div');
        dot.style.cssText = `
            position: fixed;
            width: 5px;
            height: 5px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
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

    const bg = {
        success: '#d7ff3d',
        info:    '#f2f0e8',
        error:   '#ff2e63',
    };

    note.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${bg[type] ?? bg.success};
        color: #0a0a0a;
        padding: 1rem 1.5rem;
        border: 3px solid #0a0a0a;
        box-shadow: 6px 6px 0 #0a0a0a;
        z-index: 10000;
        font-weight: 700;
        font-family: 'Space Grotesk', sans-serif;
        max-width: min(400px, calc(100vw - 40px));
        opacity: 0;
        transform: translateX(30px);
        transition: opacity 0.3s ease, transform 0.3s ease;
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
        showNotification('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', 'success');
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
        showNotification(`Accediendo a "${title}"...`, 'info');
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

const THEME_ICON_PATHS = {
    sun: '<circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />',
    moon: '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />',
};

function updateThemeIcon(theme) {
    const icon = themeToggle?.querySelector('.theme-icon');
    if (!icon) return;
    icon.innerHTML = theme === 'dark' ? THEME_ICON_PATHS.moon : THEME_ICON_PATHS.sun;
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
    'font-size:22px;color:#d7ff3d;font-weight:bold;'
);
console.log('%cClub de Matemáticas · EMTP · 2024-2025', 'font-size:13px;color:#ff2e63;');
console.log('%c¡Prepárate para la aventura matemática!', 'font-size:12px;color:#8f8d83;');
