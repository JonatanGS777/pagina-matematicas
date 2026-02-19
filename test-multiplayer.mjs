/**
 * test-multiplayer.mjs
 * Prueba de integración multijugador para MathBattle
 * Simula 1 host + 3 jugadores con Socket.IO client real
 *
 * Uso: node test-multiplayer.mjs
 */

import { io } from '/tmp/puppeteer-test/node_modules/socket.io-client/build/esm/index.js';

const SERVER = 'http://localhost:3002';
const ANSWER_DELAY = 1000; // ms antes de responder

const PLAYERS = [
    { name: 'AlgebraKing', isHost: true  },
    { name: 'MathNinja',   isHost: false },
    { name: 'PiMaster',    isHost: false },
    { name: 'CalcWizard',  isHost: false },
];

const SETTINGS = {
    totalQuestions: 5,
    questionTime  : 15,
    difficulty    : 'easy',
    categories    : ['arithmetic'],
};

// ─── Colores terminal ───
const C = {
    reset:'\\x1b[0m', bold:'\\x1b[1m', cyan:'\\x1b[36m', yellow:'\\x1b[33m',
    green:'\\x1b[32m', red:'\\x1b[31m', magenta:'\\x1b[35m', gray:'\\x1b[90m',
};
const pad = (s, n=12) => String(s).padEnd(n);
const ts  = () => new Date().toLocaleTimeString('es',{ hour12:false });
const log = (tag, msg, c=C.gray) =>
    console.log(`${C.gray}${ts()}${C.reset} ${c}[${pad(tag)}]${C.reset} ${msg}`);

// ─── Conectar jugador ───
function connect(name) {
    return new Promise((resolve, reject) => {
        const socket = io(SERVER, { transports: ['websocket'] });
        const timer  = setTimeout(() => reject(new Error(`${name}: timeout de conexión`)), 8000);
        socket.on('connect', () => {
            clearTimeout(timer);
            log(name, `Conectado (${socket.id.slice(0,8)}…)`, C.cyan);
            resolve({ socket, name, score:0, correct:0, answers:0 });
        });
        socket.on('connect_error', e => reject(new Error(`${name}: ${e.message}`)));
    });
}

// ─── Esperar evento con timeout ───
function waitFor(socket, event, ms=15000) {
    return new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error(`Timeout esperando '${event}'`)), ms);
        socket.once(event, data => { clearTimeout(t); resolve(data); });
    });
}

// ─── MAIN ───
async function main() {
    console.log(`\n${C.bold}${C.cyan}🎮  MathBattle — Test Multijugador${C.reset}`);
    console.log(`${C.gray}📍  ${SERVER}  👥  ${PLAYERS.map(p=>p.name).join(' · ')}${C.reset}\n`);

    // 1. Conectar todos
    let players;
    try {
        players = await Promise.all(PLAYERS.map(p => connect(p.name)));
    } catch(e) {
        console.error(`\n${C.red}❌ ${e.message}${C.reset}`);
        console.error(`   Verifica que el servidor esté corriendo en ${SERVER}`);
        process.exit(1);
    }

    const host = players[0];
    const roomCode = await (async () => {
        // 2. Host crea sala
        log(host.name, 'Creando sala…', C.yellow);
        host.socket.emit('create-room', { playerName: host.name, gameSettings: SETTINGS });
        const d = await waitFor(host.socket, 'room-created');
        log(host.name, `✅ Sala: ${C.bold}${d.roomCode}${C.reset}`, C.green);
        return d.roomCode;
    })();

    // 3. Jugadores se unen secuencialmente
    for (const p of players.slice(1)) {
        p.socket.emit('join-room', { playerName: p.name, roomCode });
        await waitFor(p.socket, 'room-joined');
        log(p.name, `✅ Unido a ${roomCode}`, C.green);
        await new Promise(r => setTimeout(r, 200));
    }

    log('LOBBY', `4 jugadores listos — iniciando en 1s…`, C.yellow);
    await new Promise(r => setTimeout(r, 1000));

    // 4. Host inicia juego
    host.socket.emit('start-game', { roomCode });
    const startData = await waitFor(host.socket, 'game-started');
    log('JUEGO', `🎮 Iniciado! Preguntas: ${startData.totalQuestions}`, C.magenta);

    // 5. Loop de preguntas — cada jugador responde de forma independiente
    const done = await Promise.all(players.map(p => new Promise(resolve => {

        p.socket.on('new-question', async ({ question: q, questionNumber, timeLimit }) => {
            log(p.name, `❓ P${questionNumber}: ${String(q.question).substring(0,50)}`, C.cyan);

            await new Promise(r => setTimeout(r, ANSWER_DELAY + Math.random()*600));

            // 70% elige correcta, 30% aleatoria
            const opts = q.options || [];
            const answer = (Math.random() < 0.70 && q.correctAnswer)
                ? q.correctAnswer
                : (opts[Math.floor(Math.random()*opts.length)] ?? q.correctAnswer);

            p.socket.emit('submit-answer', { roomCode, answer, timeRemaining: timeLimit - 1 });
        });

        p.socket.on('answer-result', ({ correct, pointsEarned, totalScore }) => {
            p.answers++;
            if (correct) p.correct++;
            const sym = correct ? '✅' : '❌';
            log(p.name, `${sym} +${pointsEarned} pts  →  total: ${totalScore}`,
                correct ? C.green : C.red);
        });

        p.socket.on('game-finished', data => resolve(data));
        setTimeout(() => resolve(null), 180000); // safety
    })));

    // 6. Resultados
    const final = done.find(d => d?.finalRanking);
    console.log(`\n${C.bold}${'━'.repeat(52)}${C.reset}`);
    console.log(`${C.bold}${C.yellow}           🏆  RESULTADOS FINALES${C.reset}`);
    console.log(`${C.bold}${'━'.repeat(52)}${C.reset}`);

    if (final?.finalRanking) {
        final.finalRanking.forEach((r, i) => {
            const medal = ['🥇','🥈','🥉'][i] || `${i+1}.`;
            console.log(`  ${medal}  ${C.bold}${pad(r.playerName,14)}${C.reset} ${C.yellow}${String(r.totalScore).padStart(6)} pts${C.reset}`);
        });
    }

    console.log(`\n${C.gray}  Precisión individual:${C.reset}`);
    players.forEach(p => {
        const pct = p.answers ? Math.round(p.correct/p.answers*100) : 0;
        const bar = '▓'.repeat(Math.floor(pct/10))+'░'.repeat(10-Math.floor(pct/10));
        console.log(`  ${pad(p.name,14)} ${bar}  ${pct}%  (${p.correct}/${p.answers})`);
    });

    console.log(`\n${'━'.repeat(52)}`);
    console.log(`${C.green}✅ Test completado exitosamente${C.reset}\n`);

    players.forEach(p => p.socket.disconnect());
    process.exit(0);
}

main().catch(e => {
    console.error(`\n${C.red}❌ Error: ${e.message}${C.reset}`);
    process.exit(1);
});
