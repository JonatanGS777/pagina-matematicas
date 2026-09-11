// SI units. Ideal, frictionless models; pendulum uses the small-angle approximation.
export const GRAVITY = 9.81;
export function calculate(id, p, t = 0) {
  if (id === 'pendulum') {
    const omega = Math.sqrt(GRAVITY / p.length);
    const amplitude = p.angle * Math.PI / 180;
    return { period: 2 * Math.PI / omega, frequency: omega / (2 * Math.PI), theta: amplitude * Math.cos(omega * t), velocity: -p.length * amplitude * omega * Math.sin(omega * t) };
  }
  if (id === 'projectile') {
    const angle = p.angle * Math.PI / 180;
    const vx = p.speed * Math.cos(angle), vy = p.speed * Math.sin(angle);
    const flight = 2 * vy / GRAVITY, time = Math.min(Math.max(t, 0), flight);
    return { range: vx * flight, height: vy * vy / (2 * GRAVITY), flight, x: vx * time, y: Math.max(0, vy * time - .5 * GRAVITY * time * time), vx, vy: vy - GRAVITY * time };
  }
  if (id === 'spring') {
    const omega = Math.sqrt(p.stiffness / p.mass), x = p.amplitude * Math.cos(omega * t);
    const velocity = -p.amplitude * omega * Math.sin(omega * t);
    return { period: 2 * Math.PI / omega, x, velocity, force: -p.stiffness * x, energy: .5 * p.stiffness * p.amplitude ** 2, kinetic: .5 * p.mass * velocity ** 2, potential: .5 * p.stiffness * x ** 2 };
  }
  if (id === 'circuit') return { current: p.voltage / p.resistance, power: p.voltage ** 2 / p.resistance, voltage: p.voltage };
  throw new Error('Experimento desconocido');
}
export const experiments = [
  {
    id: 'pendulum', number: '01', name: 'El péndulo', topic: 'Movimiento y tiempo', color: '#77dfcb', icon: '◷', duration: '12–15 min',
    question: '¿Qué hace que un péndulo tarde más en oscilar?', objective: 'Relacionar la longitud del péndulo con su período y reconocer que la masa no lo modifica.',
    formula: 'T = 2π √(L / g)', description: 'El período T es el tiempo de una oscilación completa. Un péndulo más largo oscila más lentamente.',
    assumptions: 'Ángulo pequeño (hasta 15°), cuerda sin masa, sin rozamiento; g = 9.81 m/s². El movimiento usa la aproximación de ángulo pequeño.',
    params: [{ key: 'length', label: 'Longitud', unit: 'm', min: .5, max: 2, step: .1, value: 1.2 }, { key: 'mass', label: 'Masa', unit: 'kg', min: .1, max: 1, step: .1, value: .4 }, { key: 'angle', label: 'Ángulo inicial', unit: '°', min: 3, max: 15, step: 1, value: 12 }],
    readings: [['period', 'Período', 's'], ['frequency', 'Frecuencia', 'Hz']],
    steps: ['Predice qué pasará al duplicar la longitud.', 'Inicia y registra un ensayo. Cambia solo la longitud y registra otro.', 'Compara los períodos. Después prueba cambiar solo la masa.'],
    quiz: 'Si multiplicas por 4 la longitud, el período…', options: ['se multiplica por 4.', 'se multiplica por 2.', 'se mantiene igual.'], answer: 1,
    feedback: 'T depende de la raíz cuadrada de L: √4 = 2. La masa no aparece en la expresión del período.',
    challenge: 'Compara L = 0.5 m y L = 2 m, manteniendo masa y ángulo constantes.', graph: 'Ángulo (°) · tiempo (s)', graphKey: 'theta', graphUnit: '°'
  },
  {
    id: 'projectile', number: '02', name: 'Lanzamiento', topic: 'Movimiento en dos ejes', color: '#ffbf7c', icon: '↗', duration: '15–20 min',
    question: '¿Qué ángulo permite llegar más lejos?', objective: 'Explorar la independencia del movimiento horizontal y vertical y determinar el ángulo de alcance máximo.',
    formula: 'R = v₀² sen(2θ) / g', description: 'La velocidad horizontal es constante. La gravedad cambia la velocidad vertical durante todo el vuelo.',
    assumptions: 'Sin resistencia del aire; lanzamiento y aterrizaje a la misma altura; g = 9.81 m/s². La maqueta representa 0.16 unidades del salón por metro físico.',
    params: [{ key: 'speed', label: 'Rapidez inicial', unit: 'm/s', min: 3, max: 15, step: .5, value: 10 }, { key: 'angle', label: 'Ángulo', unit: '°', min: 15, max: 75, step: 1, value: 45 }],
    readings: [['range', 'Alcance', 'm'], ['height', 'Altura máxima', 'm'], ['flight', 'Tiempo de vuelo', 's']],
    steps: ['Predice cuál ángulo produce mayor alcance.', 'Con la misma rapidez, compara 30°, 45° y 60°.', 'Registra al menos dos lanzamientos y justifica tu conclusión.'],
    quiz: 'Con igual rapidez y alturas de salida y llegada iguales, el mayor alcance ocurre a…', options: ['30°', '45°', '75°'], answer: 1,
    feedback: 'sen(2θ) alcanza su máximo cuando 2θ = 90°. Por eso θ = 45° da el mayor alcance en este modelo.',
    challenge: 'Compara 30° y 60°: ¿cambia el alcance? ¿Y la altura?', graph: 'Altura (m) · distancia (m)', graphKey: 'y', graphUnit: 'm'
  },
  {
    id: 'spring', number: '03', name: 'Masa y resorte', topic: 'Fuerza y energía', color: '#bdacf7', icon: '∿', duration: '12–15 min',
    question: '¿Cómo cambia el movimiento con un resorte más rígido?', objective: 'Relacionar fuerza y deformación mediante la ley de Hooke y observar el intercambio de energía.',
    formula: 'F = −kx   ·   T = 2π √(m / k)', description: 'La fuerza siempre apunta hacia el equilibrio. La energía se intercambia entre potencial elástica y cinética.',
    assumptions: 'Resorte ideal horizontal sin masa ni rozamiento. La amplitud se mantiene constante; se trabaja dentro del régimen elástico ideal.',
    params: [{ key: 'stiffness', label: 'Constante elástica', unit: 'N/m', min: 5, max: 50, step: 1, value: 15 }, { key: 'mass', label: 'Masa', unit: 'kg', min: .2, max: 2, step: .1, value: 1 }, { key: 'amplitude', label: 'Amplitud', unit: 'm', min: .1, max: .5, step: .05, value: .3 }],
    readings: [['period', 'Período', 's'], ['energy', 'Energía total', 'J'], ['kinetic', 'Energía cinética', 'J'], ['potential', 'Energía elástica', 'J'], ['force', 'Fuerza actual', 'N']],
    steps: ['Predice qué pasará al aumentar la rigidez k.', 'Registra un ensayo y repite cambiando solo k.', 'Observa la fuerza: su signo cambia al cruzar el equilibrio.'],
    quiz: 'Al aumentar k y mantener la masa, el sistema…', options: ['oscila más lentamente.', 'oscila más rápidamente.', 'pierde toda su energía.'], answer: 1,
    feedback: 'Al crecer k, disminuye T = 2π√(m/k). Sin rozamiento, la energía mecánica total se conserva.',
    challenge: 'Duplica la amplitud. ¿Qué sucede con la energía total?', graph: 'Posición (m) · tiempo (s)', graphKey: 'x', graphUnit: 'm'
  },
  {
    id: 'circuit', number: '04', name: 'Circuito eléctrico', topic: 'Electricidad', color: '#aade8f', icon: 'ϟ', duration: '12–15 min',
    question: '¿Cómo puedes controlar la corriente eléctrica?', objective: 'Aplicar la ley de Ohm y distinguir voltaje, corriente, resistencia y potencia.',
    formula: 'I = V / R   ·   P = VI', description: 'El voltaje impulsa la corriente. Una resistencia mayor reduce la corriente cuando el voltaje se mantiene constante.',
    assumptions: 'Fuente ideal de corriente continua y resistor óhmico a temperatura constante. La luz indica potencia de forma cualitativa; los puntos muestran corriente convencional, no velocidad real de electrones.',
    params: [{ key: 'voltage', label: 'Voltaje', unit: 'V', min: 1, max: 12, step: .5, value: 6 }, { key: 'resistance', label: 'Resistencia', unit: 'Ω', min: 10, max: 100, step: 5, value: 30 }],
    readings: [['current', 'Corriente', 'A'], ['power', 'Potencia', 'W']],
    steps: ['Predice qué pasará si duplicas la resistencia.', 'Mantén el voltaje y compara dos resistencias.', 'Registra los ensayos y verifica I = V/R con tus datos.'],
    quiz: 'Con el voltaje fijo, duplicar la resistencia hace que la corriente…', options: ['se duplique.', 'se reduzca a la mitad.', 'no cambie.'], answer: 1,
    feedback: 'I = V/R: al duplicar el denominador y mantener V, la corriente es la mitad.',
    challenge: 'Busca dos combinaciones distintas de V y R que produzcan la misma corriente.', graph: 'Corriente (A) · voltaje (V)', graphKey: 'current', graphUnit: 'A'
  }
];
