/**
 * Robotics Lab UI
 * Contextual navigation, mission feedback, clock and accessible editor helpers.
 * The 3D engine remains isolated in robot3d.js.
 */
(function () {
    'use strict';

    const modes = {
        operate: {
            deckTitle: 'Control manual',
            stageLabel: 'Control manual',
            panelId: 'A',
            missionCode: 'OP-01',
            missionTitle: 'Calibración inicial',
            objective: 'Mueve el robot, cambia su orientación y regresa al punto de origen.',
            target: 6
        },
        program: {
            deckTitle: 'Secuenciador',
            stageLabel: 'Ejecución programada',
            panelId: 'B',
            missionCode: 'PG-02',
            missionTitle: 'Ruta de inspección',
            objective: 'Construye una secuencia con movimiento, giro, espera y una acción final.',
            target: 10
        },
        simulate: {
            deckTitle: 'Simulación',
            stageLabel: 'Entorno dinámico',
            panelId: 'C',
            missionCode: 'SM-03',
            missionTitle: 'Prueba de estabilidad',
            objective: 'Activa la física, modifica el entorno y observa el comportamiento del robot.',
            target: 4
        },
        diagnose: {
            deckTitle: 'Diagnóstico',
            stageLabel: 'Telemetría en vivo',
            panelId: 'D',
            missionCode: 'DG-04',
            missionTitle: 'Informe de rendimiento',
            objective: 'Revisa FPS, objetos y llamadas de dibujo; después ejecuta la optimización.',
            target: 3
        }
    };

    let activeMode = 'operate';

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    function setMode(mode, options = {}) {
        if (!modes[mode]) return;

        activeMode = mode;
        document.body.dataset.labMode = mode;

        document.querySelectorAll('[data-lab-mode-target]').forEach((button) => {
            const isActive = button.dataset.labModeTarget === mode;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-selected', String(isActive));
            button.tabIndex = isActive ? 0 : -1;
        });

        document.querySelectorAll('[data-lab-panel]').forEach((panel) => {
            const isActive = panel.dataset.labPanel === mode;
            panel.hidden = !isActive;
            panel.classList.toggle('is-active', isActive);
            panel.toggleAttribute('inert', !isActive);
            panel.setAttribute('aria-hidden', String(!isActive));
        });

        document.querySelectorAll('[data-lab-link]').forEach((link) => {
            link.classList.toggle('is-active', link.dataset.labLink === mode);
        });

        const config = modes[mode];
        setText('deckTitle', config.deckTitle);
        setText('stageModeLabel', config.stageLabel);
        setText('missionCode', config.missionCode);
        setText('missionTitle', config.missionTitle);
        setText('missionObjective', config.objective);

        const deckId = document.querySelector('.deck-id');
        if (deckId) deckId.textContent = `PANEL / ${config.panelId}`;

        if (options.updateHash !== false) {
            const hash = mode === 'operate' ? '#robot-3d' : mode === 'program' ? '#programming' : '#advanced';
            history.replaceState(null, '', hash);
        }

        updateMissionProgress();
        document.dispatchEvent(new CustomEvent('lab:modechange', { detail: { mode } }));

        if (options.focusPanel) {
            const panel = document.querySelector(`[data-lab-panel="${mode}"]`);
            const focusTarget = panel?.querySelector('textarea, button, input');
            focusTarget?.focus({ preventScroll: true });
        }
    }

    function readNumber(id, fallback = 0) {
        const value = Number.parseFloat(document.getElementById(id)?.textContent || '');
        return Number.isFinite(value) ? value : fallback;
    }

    function updateMissionProgress() {
        const config = modes[activeMode];
        const commandCount = readNumber('commandCount');
        const physicsOn = document.getElementById('physicsStatus')?.textContent === 'ON';
        const fps = readNumber('fpsCounter', 60);

        let completedUnits = commandCount;
        if (activeMode === 'simulate') completedUnits = Math.min(commandCount, 2) + (physicsOn ? 2 : 0);
        if (activeMode === 'diagnose') completedUnits = (fps > 0 ? 1 : 0) + (readNumber('objectCount') > 0 ? 1 : 0) + (readNumber('drawCalls') > 0 ? 1 : 0);

        const percentage = Math.min(100, Math.round((completedUnits / config.target) * 100));
        const bar = document.getElementById('missionProgressBar');
        if (bar) bar.style.width = `${percentage}%`;
        setText('missionProgressText', `${percentage}%`);

        document.querySelectorAll('[data-command-mirror]').forEach((element) => {
            element.textContent = String(commandCount);
        });

        document.body.classList.toggle('physics-active', physicsOn);
    }

    function updateClock() {
        const clock = document.getElementById('labClock');
        if (!clock) return;
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], { hour12: false });
        clock.dateTime = now.toISOString();
    }

    function installModeNavigation() {
        const buttons = Array.from(document.querySelectorAll('[data-lab-mode-target]'));

        buttons.forEach((button, index) => {
            button.addEventListener('click', () => setMode(button.dataset.labModeTarget));
            button.addEventListener('keydown', (event) => {
                if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
                event.preventDefault();

                let nextIndex = index;
                if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % buttons.length;
                if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + buttons.length) % buttons.length;
                if (event.key === 'Home') nextIndex = 0;
                if (event.key === 'End') nextIndex = buttons.length - 1;

                const nextButton = buttons[nextIndex];
                setMode(nextButton.dataset.labModeTarget, { focusPanel: false });
                nextButton.focus();
            });
        });

        document.querySelectorAll('[data-lab-link]').forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopImmediatePropagation();
                setMode(link.dataset.labLink);
                if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();
            }, true);
        });
    }

    function installEditorHelpers() {
        const editor = document.getElementById('codeInput');
        if (!editor) return;

        editor.addEventListener('keydown', (event) => {
            if (event.key !== 'Tab') return;
            event.preventDefault();

            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            editor.setRangeText('    ', start, end, 'end');
        });
    }

    function observeTelemetry() {
        const telemetryIds = ['commandCount', 'physicsStatus', 'fpsCounter', 'objectCount', 'drawCalls'];
        const observer = new MutationObserver(updateMissionProgress);
        telemetryIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element, { childList: true, characterData: true, subtree: true });
        });
    }

    function installQuickModeKeys() {
        document.addEventListener('keydown', (event) => {
            const target = event.target;
            if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable) return;
            if (!event.altKey) return;

            const keyMap = { Digit1: 'operate', Digit2: 'program', Digit3: 'simulate', Digit4: 'diagnose' };
            const mode = keyMap[event.code];
            if (!mode) return;

            event.preventDefault();
            setMode(mode);
        });
    }

    function initialize() {
        document.querySelectorAll('i.fas').forEach((icon) => icon.setAttribute('aria-hidden', 'true'));
        installModeNavigation();
        installEditorHelpers();
        observeTelemetry();
        installQuickModeKeys();

        const modeFromHash = location.hash === '#programming' ? 'program' : location.hash === '#advanced' ? 'simulate' : 'operate';
        setMode(modeFromHash, { updateHash: false });

        updateClock();
        window.setInterval(updateClock, 1000);
    }

    window.RoboticsLabUI = { setMode };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();
