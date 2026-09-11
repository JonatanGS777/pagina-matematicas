/* Modelos ideales en unidades SI. Compartidos por la escena, las gráficas y el cuaderno. */
(function (root) {
'use strict';
const g = 9.81;
const range = (key, label, min, max, step, value, unit) => ({key,label,min,max,step,value,unit});
const labs = [
 {id:'vectores',short:'Indagación',unit:'F.1',title:'Vectores y medición',experiment:'Del dato al vector',subtitle:'La dirección también cuenta.',question:'¿Dos recorridos distintos pueden terminar en el mismo punto?',color:'#cee890',standard:'ES.F.IT1.2 · ES.F.IT1.3',
 parameters:[range('x','Desplazamiento al este',0,8,.5,3,'m'),range('y','Desplazamiento al norte',0,8,.5,4,'m')],
 objective:'Distingue distancia y desplazamiento; calcula la magnitud y dirección de un vector usando unidades SI.',
 predict:'Si caminas 3 m al este y 4 m al norte, ¿tu desplazamiento tiene magnitud de 7 m? Explica tu predicción.',
 steps:['Configura 3 m al este y 4 m al norte. Inicia y registra el resultado.','Compara la ruta por los dos ejes con la flecha que une el inicio y el final.','Cambia una componente. Registra un segundo ensayo y explica qué cambió.'],
 explain:'La distancia suma el camino recorrido. El desplazamiento une la posición inicial y final: su magnitud se obtiene con Pitágoras. El ángulo se mide desde el este hacia el norte. Si ambas componentes son cero, no hay dirección definida.',
 formula:'|Δr| = √(x² + y²)',assumption:'Recorrido en un plano, con ejes perpendiculares. Las mediciones son ideales, sin incertidumbre instrumental; los decimales mostrados son redondeos.',
 extension:'Diseña dos rutas de distinta distancia con el mismo desplazamiento. Explica cómo reportarías una medición real de 3.0 ± 0.1 m.',
 quiz:{question:'Caminas 3 m al este y 4 m al norte. ¿Cuál es la magnitud del desplazamiento?',options:['7 m','5 m','1 m'],answer:1,feedback:'√(3² + 4²) = 5 m. Los 7 m corresponden a la distancia recorrida, no a la magnitud del desplazamiento.'},
 graphLabel:'Componente norte (m) frente a componente este (m)',axes:['este (m)','norte (m)'],duration:()=>4,
 calculate:p=>({distance:p.x+p.y,magnitude:Math.hypot(p.x,p.y),angle:p.x||p.y?Math.atan2(p.y,p.x)*180/Math.PI:0}),
 metrics:(p,r)=>[['Distancia',r.distance,'m'],['Magnitud',r.magnitude,'m'],['Dirección',p.x||p.y?r.angle:null,'°']],
 curve:p=>[[0,0],[p.x,p.y]],
 },
 {id:'proyectiles',short:'Cinemática',unit:'F.2',title:'Movimiento de proyectiles',experiment:'El ángulo del alcance',subtitle:'Una trayectoria. Dos movimientos.',question:'¿Qué ángulo permite llegar más lejos con la misma rapidez?',color:'#e9bd75',standard:'ES.F1.1 · ES.F1.7',
 parameters:[range('v','Rapidez inicial',5,25,1,12,'m/s'),range('angle','Ángulo de lanzamiento',10,80,1,45,'°')],
 objective:'Relaciona las componentes de la velocidad con la trayectoria y el alcance de un proyectil.',
 predict:'Compara 30°, 45° y 60°. ¿Cuál llegará más lejos si mantienes la rapidez inicial?',
 steps:['Lanza a 30° y registra el alcance y el tiempo de vuelo.','Repite a 45° y 60° sin cambiar la rapidez inicial.','Usa las mediciones para explicar qué ángulo maximiza el alcance.'],
 explain:'La velocidad horizontal permanece constante. La gravedad cambia la velocidad vertical. Ángulos complementarios tienen el mismo alcance si la salida y la llegada están a la misma altura; 45° maximiza el alcance en este modelo.',formula:'R = v₀² sen(2θ) / g',assumption:'Sin resistencia del aire; g = 9.81 m/s² constante. Lanzamiento y aterrizaje a la misma altura. El tamaño del montaje 3D se adapta; usa las mediciones y la gráfica para comparar distancias.',extension:'Justifica matemáticamente por qué 30° y 60° tienen igual alcance pero diferente altura máxima.',
 quiz:{question:'Con la misma rapidez y sin aire, ¿qué ocurre al comparar 30° y 60°?',options:['Igual alcance y distinta altura','Igual altura y distinto alcance','El alcance a 60° es el doble'],answer:0,feedback:'sen(60°) = sen(120°). El alcance es igual; a 60° la componente vertical inicial y la altura máxima son mayores.'},
 graphLabel:'Altura y (m) frente a distancia horizontal x (m)',axes:['x (m)','y (m)'],
 duration:p=>2*p.v*Math.sin(p.angle*Math.PI/180)/g,
 calculate:p=>{const a=p.angle*Math.PI/180;return {range:p.v*p.v*Math.sin(2*a)/g,height:(p.v*Math.sin(a))**2/(2*g),flight:2*p.v*Math.sin(a)/g};},
 metrics:(p,r)=>[['Alcance',r.range,'m'],['Altura máx.',r.height,'m'],['Vuelo',r.flight,'s']],
 curve:p=>Array.from({length:81},(_,i)=>{const a=p.angle*Math.PI/180,t=2*p.v*Math.sin(a)/g*i/80;return [p.v*Math.cos(a)*t,Math.max(0,p.v*Math.sin(a)*t-.5*g*t*t)];})
 },
 {id:'newton',short:'Dinámica',unit:'F.3',title:'Fuerzas en movimiento',experiment:'El carrito de Newton',subtitle:'Cambiar el movimiento requiere una fuerza neta.',question:'¿Cómo cambia la aceleración cuando duplicas la masa?',color:'#8fcabb',standard:'F.3 · objetivos A1, A2 y A3',
 parameters:[range('force','Fuerza horizontal',0,20,1,8,'N'),range('mass','Masa del carrito',1,10,.5,2,'kg')],
 objective:'Predice la aceleración con la segunda ley de Newton e identifica fuerzas equilibradas en el eje vertical.',predict:'Aplica la misma fuerza a 2 kg y 4 kg. ¿Qué esperas que ocurra con la aceleración?',steps:['Mantén la fuerza en 8 N y ensaya con 2 kg de masa.','Repite con 4 kg. Registra ambos resultados.','Prueba fuerza cero. Explica por qué el carrito permanece en reposo en este ensayo.'],
 explain:'La fuerza neta horizontal produce aceleración. A fuerza constante, duplicar la masa reduce la aceleración a la mitad. El peso hacia abajo y la fuerza normal hacia arriba se equilibran. Fuerza neta cero implica velocidad constante, que aquí comienza en cero.',formula:'ΣF = ma',assumption:'Pista horizontal sin fricción, fuerza constante, velocidad inicial cero. Ensayo de 2 s; el montaje representa el recorrido a escala variable.',extension:'Dibuja el diagrama de cuerpo libre. ¿Cómo cambiaría el modelo si hubiera una fuerza de fricción de 2 N?',
 quiz:{question:'Si duplicas la masa manteniendo la fuerza neta, la aceleración…',options:['Se duplica','No cambia','Se reduce a la mitad'],answer:2,feedback:'a = F/m. Con F constante, si m se duplica, a se reduce a la mitad.'},
 graphLabel:'Velocidad v (m/s) frente a tiempo t (s)',axes:['t (s)','v (m/s)'],duration:()=>2,
 calculate:p=>({a:p.force/p.mass,v:2*p.force/p.mass,x:2*p.force/p.mass}),metrics:(p,r)=>[['Aceleración',r.a,'m/s²'],['v a 2 s',r.v,'m/s'],['x a 2 s',r.x,'m']],curve:p=>[[0,0],[2,2*p.force/p.mass]]
 },
 {id:'energia',short:'Energía',unit:'F.4',title:'La energía se transforma',experiment:'De altura a rapidez',subtitle:'La energía cambia de forma, no desaparece.',question:'¿La masa cambia la rapidez al final de una rampa ideal?',color:'#e69772',standard:'F.4 · objetivo A3 · ES.F2.2 (F.6)',
 parameters:[range('height','Altura inicial',.5,4,.1,2,'m'),range('mass','Masa del bloque',.5,5,.5,1,'kg')],
 objective:'Relaciona energía potencial y cinética con la conservación de la energía mecánica.',predict:'Dos bloques de distinta masa parten de la misma altura. ¿Llegarán con distinta rapidez?',steps:['Usa una altura de 2 m y masa de 1 kg. Inicia y registra.','Repite con 3 kg y la misma altura. Compara energía y rapidez final.','Duplica la altura. ¿La rapidez también se duplica? Sustenta con datos.'],
 explain:'La gravedad realiza trabajo y transforma energía potencial en cinética. La energía mecánica permanece constante sin fricción. La masa cambia la energía disponible, pero se cancela al despejar la rapidez final.',formula:'mgh = ½mv² → v = √(2gh)',assumption:'Bloque que desliza sin fricción ni rotación, desde el reposo, rampa de 30°. Energía potencial cero en la base; g = 9.81 m/s².',extension:'Si el 20 % de la energía inicial se transforma en calor, calcula la rapidez de llegada y explica dónde quedó esa energía.',
 quiz:{question:'Si cuadruplicas la altura inicial en la rampa ideal, la rapidez final…',options:['Se duplica','Se cuadruplica','No cambia'],answer:0,feedback:'v = √(2gh). Al multiplicar h por 4, la rapidez se multiplica por √4 = 2.'},
 graphLabel:'Energía potencial (verde) y cinética (naranja) frente al descenso (%)',axes:['descenso (%)','E (J)'],duration:p=>Math.sqrt(8*p.height/g),
 calculate:p=>({energy:p.mass*g*p.height,v:Math.sqrt(2*g*p.height),flight:Math.sqrt(8*p.height/g)}),metrics:(p,r)=>[['E inicial',r.energy,'J'],['v final',r.v,'m/s'],['Descenso',r.flight,'s']],curve:p=>[[0,p.mass*g*p.height],[100,0]],secondCurve:p=>[[0,0],[100,p.mass*g*p.height]]
 },
 {id:'ondas',short:'Ondas',unit:'F.5',title:'Una onda, muchas preguntas',experiment:'La cuerda vibrante',subtitle:'Viaja la perturbación; el medio oscila.',question:'Si la frecuencia aumenta, ¿qué ocurre con la longitud de onda?',color:'#a5c4dc',standard:'ES.F3.8',
 parameters:[range('frequency','Frecuencia',.5,3,.1,1,'Hz'),range('amplitude','Amplitud',.1,.8,.1,.4,'m'),range('speed','Rapidez de propagación',1,4,.5,2,'m/s')],
 objective:'Explica la relación entre frecuencia, longitud de onda y rapidez de propagación.',predict:'Mantén la rapidez en 2 m/s. ¿Cómo cambia la longitud de onda al pasar de 1 Hz a 2 Hz?',steps:['Inicia con 1 Hz y 2 m/s. Observa el punto naranja del medio y registra.','Duplica la frecuencia manteniendo la rapidez. Compara la separación entre crestas.','Cambia solo la amplitud. Comprueba si cambian la longitud de onda y el periodo.'],
 explain:'La frecuencia cuenta oscilaciones por segundo. El periodo mide cuánto dura una oscilación. A rapidez fija, una frecuencia mayor implica menor longitud de onda. El punto naranja oscila verticalmente mientras la perturbación avanza.',formula:'v = λf     T = 1/f',assumption:'Onda transversal sinusoidal en un medio uniforme, sin disipación ni reflexión. La animación y el reloj usan segundos simulados.',extension:'Compara una onda de sonido longitudinal con esta onda transversal: ¿en qué dirección vibraría el medio?',
 quiz:{question:'Una onda viaja a 2 m/s con frecuencia de 2 Hz. Su longitud de onda es…',options:['4 m','0.5 m','1 m'],answer:2,feedback:'λ = v/f = (2 m/s)/(2 Hz) = 1 m. Un hercio equivale a un ciclo por segundo.'},
 graphLabel:'Desplazamiento del medio y (m) frente a posición x (m), en t = 0',axes:['x (m)','y (m)'],duration:()=>6,
 calculate:p=>({lambda:p.speed/p.frequency,period:1/p.frequency,frequency:p.frequency}),metrics:(p,r)=>[['Longitud λ',r.lambda,'m'],['Periodo',r.period,'s'],['Frecuencia',r.frequency,'Hz']],curve:p=>Array.from({length:161},(_,i)=>{const x=i/20;return [x,p.amplitude*Math.sin(2*Math.PI*x*p.frequency/p.speed)];})
 },
 {id:'circuitos',short:'Electricidad',unit:'F.6',title:'Conecta tus ideas',experiment:'Circuitos en equilibrio',subtitle:'Una fuente. Dos maneras de conectar.',question:'¿Qué cambia al conectar dos resistencias en paralelo?',color:'#d5c18a',standard:'ES.F4.6 · ES.F4.7',
 parameters:[range('voltage','Voltaje de la fuente',1,12,1,6,'V'),range('resistance','Cada resistencia (R₁ = R₂)',10,100,5,20,'Ω'),{key:'connection',label:'Conexión',value:'series',options:[['series','En serie'],['parallel','En paralelo']]}],
 objective:'Compara resistencia equivalente, corriente total y potencia en circuitos en serie y paralelo.',predict:'Con la misma fuente y dos resistencias iguales, ¿qué conexión exige más corriente total?',steps:['Conecta dos resistencias de 20 Ω en serie a una fuente de 6 V. Registra.','Cambia únicamente a paralelo y registra el nuevo resultado.','Compara la corriente total. Explica la diferencia usando la resistencia equivalente.'],
 explain:'En serie, las resistencias se suman y circula la misma corriente por ambas. En paralelo, ambas tienen el voltaje de la fuente y la corriente total suma las corrientes de las ramas. Los puntos representan corriente convencional de manera esquemática, no la velocidad real de los electrones.',formula:'I = V/Rₑq     P = VI',assumption:'Fuente ideal de corriente continua, cables sin resistencia y dos resistores óhmicos idénticos. No se simulan calentamiento, transitorios ni límites de la fuente.',extension:'Calcula el voltaje y la corriente en cada resistor para ambas conexiones. Relaciona tu explicación con el alumbrado de un salón.',
 quiz:{question:'Dos resistencias de 20 Ω en paralelo tienen resistencia equivalente de…',options:['40 Ω','10 Ω','20 Ω'],answer:1,feedback:'1/Rₑq = 1/20 + 1/20, así que Rₑq = 10 Ω. En serie serían 40 Ω.'},
 graphLabel:'Corriente total I (A) frente a voltaje V (V)',axes:['V (V)','I (A)'],duration:()=>5,
 calculate:p=>{const resistance=p.connection==='series'?2*p.resistance:p.resistance/2,current=p.voltage/resistance;return {resistance,current,power:p.voltage*current};},metrics:(p,r)=>[['R equivalente',r.resistance,'Ω'],['Corriente',r.current,'A'],['Potencia',r.power,'W']],curve:p=>[[0,0],[12,12/(p.connection==='series'?2*p.resistance:p.resistance/2)]]
 }
];
function defaults(lab){return Object.fromEntries(lab.parameters.map(p=>[p.key,p.value]));}
const api={labs,g,defaults};
root.PhysicsLab=api;
if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
