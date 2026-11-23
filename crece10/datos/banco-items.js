/*!
 * CRECE 10 · Matemáticas
 * © 2026 Dr. Yonatan Guerrero, creador y desarrollador de CRECE 10.
 * Todos los derechos reservados.
 */
/* Banco de ítems originales — Proyecto CRECE 10 · Matemáticas
   120 ítems fijos: 104 alineados a los indicadores de la planilla CRECE 2023-24
   y 16 de la ruta Base (M0, repaso de grados anteriores)
   (incluye 8 demostraciones de dos columnas, 4 respuestas abiertas e ítems
   con opciones que son figuras). Las variantes con números aleatorios están
   en datos/generadores.js.
   Tipos: "sm" (selección múltiple), "num" (respuesta numérica), "abierta" (2 puntos).
   `distractores`: un texto por opción (null en la correcta) que explica el error
   de quien elige esa opción. Si falta, se muestra `error`.
   Las respuestas y explicaciones fueron verificadas a mano. */

window.CRECE_BANCO = [
  /* ================= M1 · FUNDAMENTOS Y CONSTRUCCIONES ================= */
  {
    id: "M1-01", modulo: "M1", indicador: "ES.G.36", tipo: "sm", nivel: 1,
    repaso: "i0",
    enunciado: "Luis observa la tapa de su pupitre. ¿Cuál concepto geométrico representa <strong>mejor</strong> esa superficie?",
    opciones: ["Una recta", "Un plano", "Un punto", "El espacio"],
    respuesta: 1,
    explicacion: "La tapa del pupitre tiene largo y ancho, y su grosor no se considera: modela una superficie plana, es decir, un plano.",
    pista: "Piensa en cuántas dimensiones necesitas para describir la tapa: largo y ancho.",
    error: "Elegir «recta» porque el borde de la tapa es recto. El borde es una recta; la superficie completa es un plano.",
    distractores: ["Una recta tiene una sola dimensión: largo. La tapa tiene largo y ancho; solo su borde se parece a una recta.", null, "Un punto no tiene dimensiones: solo marca una posición. La tapa ocupa una superficie.", "El espacio tiene tres dimensiones. En el modelo, el grosor de la tapa no cuenta: solo largo y ancho."],
    etiquetas: ["vocabulario", "modelos"]
  },
  {
    id: "M1-02", modulo: "M1", indicador: "ES.G.36", tipo: "sm", nivel: 1,
    repaso: "i0",
    enunciado: "En un mapa de Puerto Rico, la ubicación de cada pueblo se marca con la punta de un alfiler. ¿Cuál concepto geométrico representa mejor cada marca?",
    opciones: ["Recta", "Plano", "Punto", "Espacio"],
    respuesta: 2,
    explicacion: "La marca del alfiler indica una posición y no se le considera tamaño: se modela con un punto.",
    pista: "¿La marca tiene largo o ancho que importe, o solo indica dónde está el pueblo?",
    error: "Elegir «plano» porque el mapa es una superficie. El mapa es el plano; cada marca es un punto en él.",
    distractores: ["Una recta tiene largo y se extiende en una dirección. La marca solo indica una posición.", "El mapa completo es el plano. La pregunta es sobre cada marca, que es una posición: un punto.", null, "El espacio tiene tres dimensiones. La marca no tiene tamaño: es un punto."],
    etiquetas: ["vocabulario", "modelos"]
  },
  {
    id: "M1-03", modulo: "M1", indicador: "ES.G.36", tipo: "sm", nivel: 2,
    repaso: "i1",
    enunciado: "Los puntos A, B y C están en el piso del salón y no están en una misma recta. El punto D está en el techo. ¿Cuál afirmación es verdadera?",
    opciones: ["A, B, C y D son coplanares.", "A, B, C y D no son coplanares.", "A, B y D tienen que ser colineales.", "D está en el plano del piso."],
    respuesta: 1,
    explicacion: "A, B y C determinan un solo plano: el del piso. D está en el techo, fuera de ese plano, así que los cuatro puntos no están en un mismo plano: no son coplanares.",
    pista: "Tres puntos que no están en una recta determinan un plano. ¿D está en ese plano?",
    error: "Pensar que cuatro puntos cualesquiera siempre caben en un mismo plano.",
    distractores: ["Para ser coplanares, los cuatro tendrían que estar en un mismo plano. D está en el techo, fuera del plano del piso.", null, "Nada obliga a que A, B y D estén en una recta: A y B están en el piso y D en el techo.", "D está en el techo, no en el piso."],
    etiquetas: ["vocabulario", "coplanar"]
  },
  {
    id: "M1-04", modulo: "M1", indicador: "ES.G.44", tipo: "sm", nivel: 1,
    repaso: "i2",
    enunciado: "¿Cuál instrumento se usa para trazar un círculo con un radio fijo?",
    opciones: ["Regla", "Compás", "Escuadra", "Transportador"],
    respuesta: 1,
    explicacion: "El compás mantiene fija la distancia entre la punta y el lápiz; esa distancia es el radio.",
    pista: "¿Qué instrumento mantiene una distancia constante mientras gira?",
    error: "Elegir la regla porque sirve para medir. La regla no traza curvas.",
    distractores: ["La regla traza rectas y mide longitudes, pero no traza curvas.", null, "La escuadra sirve para trazar perpendiculares y paralelas, no curvas.", "El transportador mide ángulos. Tiene forma de semicírculo, pero no traza círculos de un radio dado."],
    etiquetas: ["construcciones", "instrumentos"]
  },
  {
    id: "M1-05", modulo: "M1", indicador: "ES.G.44", tipo: "sm", nivel: 1,
    repaso: "i2",
    enunciado: "Para construir un ángulo de 65° con precisión, ¿cuál instrumento es el más adecuado?",
    opciones: ["Regla", "Compás", "Escuadra", "Transportador"],
    respuesta: 3,
    explicacion: "El transportador tiene una escala en grados y permite medir y trazar el ángulo pedido.",
    pista: "Busca el instrumento cuya escala está en grados.",
    error: "Elegir la escuadra: solo permite 30°, 45°, 60° y 90°.",
    distractores: ["La regla mide longitudes, no ángulos.", "Con compás se construyen ángulos como 60° o 90°, pero no uno de 65° con precisión.", "La escuadra solo da ángulos fijos (30°, 45°, 60°, 90°); 65° no es uno de ellos.", null],
    etiquetas: ["construcciones", "instrumentos"]
  },
  {
    id: "M1-06", modulo: "M1", indicador: "ES.G.44", tipo: "sm", nivel: 2,
    repaso: "i3",
    figura: "incentro",
    enunciado: "Al construir el círculo inscrito en un triángulo, las tres bisectrices se cortan en un punto. ¿Cómo se llama ese punto?",
    opciones: ["Circuncentro", "Ortocentro", "Centroide", "Incentro"],
    respuesta: 3,
    explicacion: "El incentro es el punto donde se cortan las bisectrices y equidista de los tres lados; es el centro del círculo inscrito.",
    pista: "«Inscrito» e «incentro» comparten la idea de estar dentro.",
    error: "Confundir con el circuncentro, que se forma con las mediatrices y es el centro del círculo circunscrito.",
    distractores: ["El circuncentro es donde se cortan las mediatrices; es el centro del círculo circunscrito, el de afuera.", "El ortocentro es donde se cortan las alturas, no las bisectrices.", "El centroide es donde se cortan las medianas (de cada vértice al punto medio del lado opuesto).", null],
    etiquetas: ["construcciones", "vocabulario"]
  },
  {
    id: "M1-07", modulo: "M1", indicador: "ES.G.44", tipo: "sm", nivel: 1,
    repaso: "i3",
    enunciado: "En una construcción clásica con regla y compás, ¿qué instrumentos se utilizan?",
    opciones: [
      "Una regla sin marcas y un compás",
      "Una regla graduada y un transportador",
      "Una escuadra y un transportador",
      "Un compás y un transportador"
    ],
    respuesta: 0,
    explicacion: "La construcción euclidiana usa una regla sin marcas (solo para trazar rectas) y un compás (para copiar distancias y trazar arcos).",
    pista: "La regla clásica no mide: solo traza rectas.",
    error: "Usar la regla graduada para «copiar» medidas, lo que rompe la construcción con regla y compás.",
    distractores: [null, "La regla graduada y el transportador miden. La construcción clásica no usa medidas: solo regla sin marcas y compás.", "La escuadra y el transportador dan ángulos fijos o miden; no forman parte de la construcción clásica.", "El compás sí se usa, pero el transportador no: la construcción clásica no mide ángulos."],
    etiquetas: ["construcciones"]
  },

  /* ================= M2 · CONGRUENCIA Y PRUEBA ================= */
  {
    id: "M2-01", modulo: "M2", indicador: "ES.G.40", tipo: "sm", nivel: 2,
    repaso: "i0",
    enunciado: "En los triángulos ΔOMN y ΔXYZ se sabe que OM ≅ XY, ON ≅ XZ y ∠O ≅ ∠X. ¿Cuál postulado justifica que ΔOMN ≅ ΔXYZ?",
    opciones: ["LLL", "LAL", "ALA", "AAL"],
    respuesta: 1,
    explicacion: "Hay dos pares de lados congruentes y el ángulo entre ellos (∠O y ∠X) también es congruente: es LAL.",
    pista: "Localiza el ángulo: ¿está entre los dos lados marcados?",
    error: "Elegir LLL: falta el tercer par de lados.",
    distractores: ["LLL necesita tres pares de lados. Aquí hay solo dos pares de lados y un ángulo.", null, "ALA necesita dos pares de ángulos. Aquí hay dos lados y un solo ángulo.", "AAL también necesita dos pares de ángulos. Aquí solo se da un ángulo."],
    etiquetas: ["congruencia", "criterios"]
  },
  {
    id: "M2-02", modulo: "M2", indicador: "ES.G.40", tipo: "sm", nivel: 2,
    repaso: "i0",
    enunciado: "Se sabe que ∠O ≅ ∠X, ∠M ≅ ∠Y y OM ≅ XY. ¿Cuál postulado justifica la congruencia de los triángulos?",
    opciones: ["LLL", "LAL", "ALA", "AAL"],
    respuesta: 2,
    explicacion: "El lado OM está entre los ángulos O y M, que son los congruentes: dos ángulos y el lado comprendido → ALA.",
    pista: "Dibuja el lado OM y mira qué ángulos lo tocan.",
    error: "Elegir AAL: el lado sí está entre los dos ángulos.",
    distractores: ["LLL usa tres pares de lados; aquí se dan dos ángulos y un solo lado.", "LAL usa dos lados y el ángulo entre ellos; aquí hay dos ángulos y un solo lado.", null, "AAL es cuando el lado NO está entre los ángulos. OM une los vértices O y M, así que está entre ∠O y ∠M: es ALA."],
    etiquetas: ["congruencia", "criterios"]
  },
  {
    id: "M2-03", modulo: "M2", indicador: "ES.G.46", tipo: "sm", nivel: 2,
    repaso: "i2",
    enunciado: "Después de demostrar que dos triángulos son congruentes, ¿qué permite afirmar CPCTC?",
    opciones: [
      "Que los triángulos son semejantes",
      "Que sus áreas son iguales",
      "Que sus perímetros suman 180°",
      "Que cada par de partes correspondientes es congruente"
    ],
    respuesta: 3,
    explicacion: "CPCTC significa «partes correspondientes de triángulos congruentes son congruentes». Es el puente para concluir sobre un lado o ángulo específico.",
    pista: "Lee las siglas en inglés: Corresponding Parts of Congruent Triangles are Congruent.",
    error: "Usar CPCTC antes de haber demostrado la congruencia de los triángulos.",
    distractores: ["Los triángulos congruentes también son semejantes, pero eso no es lo que dice CPCTC. CPCTC habla de las partes correspondientes.", "Las áreas sí son iguales, pero CPCTC no trata de áreas: dice que cada par de lados y ángulos correspondientes es congruente.", "Los perímetros son longitudes y no se miden en grados. Lo que suma 180° son los ángulos de un triángulo.", null],
    etiquetas: ["prueba", "cpctc"]
  },
  {
    id: "M2-04", modulo: "M2", indicador: "ES.G.39", tipo: "sm", nivel: 3,
    repaso: "i3",
    enunciado: "Considera: «Si un cuadrilátero tiene dos pares de lados paralelos, entonces es un rectángulo». ¿Cuál figura es un contraejemplo que demuestra que la proposición es falsa?",
    opciones: ["Un cuadrado", "Un rectángulo", "Un trapecio", "Un paralelogramo con ángulos de 70° y 110°"],
    respuesta: 3,
    explicacion: "Ese paralelogramo tiene dos pares de lados paralelos (cumple la hipótesis), pero sus ángulos no son rectos, así que no es un rectángulo (falla la conclusión).",
    pista: "El contraejemplo debe cumplir la hipótesis (dos pares de lados paralelos) y fallar la conclusión (ser rectángulo).",
    error: "Elegir una figura que cumple la proposición (cuadrado o rectángulo) en lugar de una que la refute.",
    distractores: ["Un cuadrado tiene dos pares de lados paralelos y también es un rectángulo: confirma la proposición, no la refuta.", "Un rectángulo cumple la hipótesis y la conclusión: confirma la proposición.", "Un trapecio tiene un solo par de lados paralelos, así que no cumple la hipótesis. Un contraejemplo tiene que cumplirla.", null],
    etiquetas: ["contraejemplo", "cuadriláteros"]
  },
  {
    id: "M2-05", modulo: "M2", indicador: "ES.G.39", tipo: "sm", nivel: 3,
    repaso: "i3",
    enunciado: "«Si dos ángulos son suplementarios, entonces son adyacentes». ¿Cuál par de ángulos refuta esta proposición?",
    opciones: ["Dos ángulos de 90° que forman un par lineal", "Un ángulo de 130° en un triángulo y uno de 50° en otro triángulo", "Dos ángulos de 45° que comparten un lado", "Dos ángulos de 100° separados"],
    respuesta: 1,
    explicacion: "130° + 50° = 180°, así que son suplementarios (cumplen la hipótesis), pero están en figuras distintas y no comparten vértice ni lado: no son adyacentes.",
    pista: "Busca un par que sume 180° y que NO comparta vértice ni lado.",
    error: "Elegir un par lineal: cumple la hipótesis y la conclusión, así que confirma la proposición.",
    distractores: ["Un par lineal es suplementario y además adyacente: confirma la proposición, no la refuta.", null, "45° + 45° = 90°: no son suplementarios, así que no cumplen la hipótesis.", "100° + 100° = 200°: no son suplementarios, así que no cumplen la hipótesis."],
    etiquetas: ["contraejemplo", "ángulos"]
  },
  {
    id: "M2-06", modulo: "M2", indicador: "ES.G.40", tipo: "sm", nivel: 2,
    repaso: "i0",
    figura: "triangulosTics",
    enunciado: "Observa los triángulos. Los tres pares de lados correspondientes están marcados como congruentes. ¿Cuál postulado justifica la congruencia?",
    opciones: ["LLL", "LAL", "ALA", "AAL"],
    respuesta: 0,
    explicacion: "Se conocen los tres pares de lados correspondientes congruentes; no se necesita ningún ángulo: LLL.",
    pista: "Cuenta los pares de lados marcados. ¿Hay algún ángulo marcado?",
    error: "Buscar un ángulo marcado que no existe y elegir LAL o ALA.",
    distractores: [null, "LAL necesita un ángulo marcado entre dos lados. En la figura no hay ángulos marcados.", "ALA necesita dos ángulos marcados. En la figura solo hay marcas en los lados.", "AAL necesita dos ángulos marcados. Aquí lo que está marcado son los tres pares de lados."],
    etiquetas: ["congruencia", "figura"]
  },
  {
    id: "M2-07", modulo: "M2", indicador: "ES.G.46", tipo: "sm", nivel: 2,
    repaso: "i4",
    enunciado: "Dos rectas se cortan y forman cuatro ángulos. Los ángulos ∠1 y ∠2 son opuestos por el vértice. ¿Qué justifica que ∠1 ≅ ∠2?",
    opciones: [
      "La definición de ángulo recto",
      "El teorema de los ángulos opuestos por el vértice",
      "El postulado de la suma de segmentos",
      "La definición de bisectriz"
    ],
    respuesta: 1,
    explicacion: "Los ángulos opuestos por el vértice siempre son congruentes; es un teorema que se usa como justificación directa.",
    pista: "No hace falta medir: es una propiedad de las rectas que se cruzan.",
    error: "Justificar con «son suplementarios»: los opuestos por el vértice son congruentes, no suplementarios.",
    distractores: ["Nada indica que los ángulos sean rectos. Los opuestos por el vértice son congruentes midan lo que midan.", null, "El postulado de la suma de segmentos trata de longitudes de segmentos, no de ángulos.", "Una bisectriz divide un ángulo en dos partes iguales. Aquí no hay un ángulo dividido: hay dos rectas que se cruzan."],
    etiquetas: ["prueba", "ángulos"]
  },
  {
    id: "M2-08", modulo: "M2", indicador: "ES.G.39", tipo: "sm", nivel: 3,
    repaso: "i4",
    figura: "paralelas",
    enunciado: "En la figura, p ∥ q y t es una transversal. ¿Cuál afirmación es <strong>FALSA</strong>?",
    opciones: [
      "Los ángulos alternos internos son congruentes.",
      "Los ángulos correspondientes son congruentes.",
      "Los ángulos internos del mismo lado son suplementarios.",
      "Los ángulos opuestos por el vértice son suplementarios."
    ],
    respuesta: 3,
    explicacion: "Los ángulos opuestos por el vértice son congruentes, no suplementarios. Las otras tres afirmaciones son consecuencias de p ∥ q.",
    pista: "Piensa en dos rectas que se cruzan: los ángulos «enfrentados» miden lo mismo.",
    error: "Marcar la opción de alternos internos por no recordar que son congruentes cuando las rectas son paralelas.",
    distractores: ["Esa afirmación es verdadera: con p ∥ q, los alternos internos son congruentes. Buscas la falsa.", "Esa afirmación es verdadera: con rectas paralelas, los ángulos correspondientes son congruentes.", "Esa afirmación es verdadera: los internos del mismo lado suman 180° cuando las rectas son paralelas.", null],
    etiquetas: ["paralelas", "ángulos", "figura"]
  },

  /* ================= M3 · SEMEJANZA ================= */
  {
    id: "M3-01", modulo: "M3", indicador: "ES.G.42", tipo: "sm", nivel: 2,
    repaso: "i2",
    enunciado: "Dos triángulos tienen dos pares de ángulos congruentes. ¿Cuál criterio garantiza que son semejantes?",
    opciones: ["LLL", "LAL", "ALA", "AA"],
    respuesta: 3,
    explicacion: "Si dos ángulos son congruentes, el tercero también lo es (suman 180°). Basta AA para la semejanza.",
    pista: "¿Qué pasa con el tercer ángulo si los otros dos ya coinciden?",
    error: "Elegir ALA, que es un criterio de congruencia, no de semejanza.",
    distractores: ["LLL de semejanza necesita los tres pares de lados proporcionales; aquí solo se conocen ángulos.", "LAL necesita información de lados; aquí solo hay ángulos.", "ALA es un criterio de congruencia y además necesita un lado. Para semejanza bastan dos ángulos: AA.", null],
    etiquetas: ["semejanza", "criterios"]
  },
  {
    id: "M3-02", modulo: "M3", indicador: "ES.G.42", tipo: "sm", nivel: 3,
    repaso: "f0",
    figura: "trianguloEscala",
    enunciado: "ΔOMN ~ ΔXYZ con razón de semejanza 2/3. Si los lados de ΔOMN miden 18, 30 y 36, ¿cuáles son los lados correspondientes de ΔXYZ?",
    opciones: ["12, 20 y 24", "27, 45 y 54", "6, 10 y 12", "24, 40 y 48"],
    respuesta: 0,
    explicacion: "Multiplica cada lado por 2/3: 18(2/3) = 12; 30(2/3) = 20; 36(2/3) = 24.",
    pista: "La razón 2/3 significa que la imagen es más pequeña: multiplica, no dividas entre 2/3.",
    error: "Multiplicar por 3/2 e invertir la razón (opción 27, 45, 54).",
    distractores: [null, "Multiplicaste por 3/2: invertiste la razón. Con razón 2/3, ΔXYZ es más pequeño que ΔOMN.", "Dividiste entre 3, pero faltó multiplicar por 2. La razón 2/3 significa: entre 3 y luego por 2.", "Multiplicaste por 4/3. Cada lado se multiplica por 2/3: 18 × 2/3 = 12."],
    etiquetas: ["semejanza", "proporción"]
  },
  {
    id: "M3-03", modulo: "M3", indicador: "ES.G.42", tipo: "num", nivel: 2,
    repaso: "i1",
    enunciado: "ΔABC ~ ΔDEF. En ΔABC, AB = 6 cm, BC = 6 cm y AC = 4 cm. En ΔDEF, DE = 9 cm y DF = 6 cm. ¿Cuánto mide EF, en centímetros?",
    respuesta: 9, tolerancia: 0.01, unidad: "cm",
    explicacion: "La razón es DE/AB = 9/6 = 1.5. El lado EF corresponde a BC, que mide 6: EF = 6 × 1.5 = 9 cm.",
    pista: "Alinea los vértices: A↔D, B↔E, C↔F. El lado BC corresponde a EF.",
    error: "Usar la razón invertida (2/3) y obtener 4 cm.",
    etiquetas: ["semejanza", "proporción"]
  },
  {
    id: "M3-04", modulo: "M3", indicador: "ES.G.42", tipo: "sm", nivel: 2,
    repaso: "i0",
    enunciado: "¿Cuál par de figuras es semejante pero <strong>no</strong> congruente?",
    opciones: [
      "Dos cuadrados de 3 cm de lado",
      "Dos triángulos equiláteros de 5 cm de lado",
      "Dos círculos de 4 cm de radio",
      "Dos triángulos equiláteros, uno de 3 cm y otro de 4 cm de lado"
    ],
    respuesta: 3,
    explicacion: "Los dos triángulos equiláteros tienen la misma forma (todos sus ángulos miden 60°) pero distinto tamaño: son semejantes y no congruentes.",
    pista: "Busca misma forma y distinto tamaño.",
    error: "Elegir figuras iguales: esas son congruentes (razón 1).",
    distractores: ["Dos cuadrados de 3 cm son iguales: son congruentes, no solo semejantes.", "Mismo lado y misma forma: son congruentes.", "Dos círculos del mismo radio son congruentes.", null],
    etiquetas: ["semejanza", "vocabulario"]
  },
  {
    id: "M3-05", modulo: "M3", indicador: "ES.G.47", tipo: "sm", nivel: 3,
    repaso: "i3",
    enunciado: "En ΔABC, DE ∥ BC, con D sobre AB y E sobre AC. Si AD = 4, DB = 6 y AE = 6, ¿cuánto mide EC?",
    opciones: ["4", "6", "9", "15"],
    respuesta: 2,
    explicacion: "Por el teorema de Tales: AD/DB = AE/EC → 4/6 = 6/EC → 4·EC = 36 → EC = 9.",
    pista: "Escribe la proporción con los segmentos del mismo lado del triángulo.",
    error: "Colocar 6 en el lugar de EC sin plantear la proporción.",
    distractores: ["Copiaste AD = 4. EC hay que calcularlo con la proporción AD/DB = AE/EC.", "Copiaste un 6 de los datos. Plantea 4/6 = 6/EC y despeja: EC = 9.", null, "Usaste el lado completo AB = 10 en lugar de DB: 4/10 = 6/EC da 15. Tales compara AD/DB con AE/EC."],
    etiquetas: ["semejanza", "tales"]
  },
  {
    id: "M3-06", modulo: "M3", indicador: "ES.G.42", tipo: "sm", nivel: 3,
    repaso: "i1",
    figura: "trianguloAnidado",
    enunciado: "En la figura, ON ∥ XZ y los segmentos OX y NZ se cortan en M. Se sabe que OM = 12, ON = 20 y XZ = 5. ¿Cuál es la medida de XM?",
    opciones: ["3", "6", "40", "48"],
    respuesta: 0,
    explicacion: "ΔOMN ~ ΔXMZ por ángulos alternos internos entre paralelas. Entonces OM/XM = ON/XZ → 12/XM = 20/5 = 4 → XM = 3.",
    pista: "Identifica el triángulo pequeño dentro del grande y escribe la razón entre los lados que se corresponden.",
    error: "Usar 20 como si fuera el lado homólogo de XZ y plantear 12/XM = 5/20.",
    distractores: [null, "La razón es ON/XZ = 20/5 = 4, no 2. Divide OM entre 4: 12 ÷ 4 = 3.", "ΔXMZ es el triángulo pequeño (XZ = 5 es menor que ON = 20), así que XM tiene que ser menor que OM = 12.", "Invertiste la razón: 12/XM = 5/20 da 48. El lado homólogo de XZ es ON, así que OM/XM = ON/XZ = 4."],
    etiquetas: ["semejanza", "figura"]
  },
  {
    id: "M3-07", modulo: "M3", indicador: "ES.G.47", tipo: "sm", nivel: 3,
    repaso: "i1",
    figura: "rayosProporcion",
    enunciado: "En la figura, ¿cuál semejanza justifica la proporción OT/OW = OP/OB?",
    opciones: ["ΔOTP ~ ΔOWB", "ΔOTP ~ ΔOYR", "ΔOTP ~ ΔOZS", "ΔOWB ~ ΔOYR"],
    respuesta: 0,
    explicacion: "La proporción compara lados del triángulo pequeño OTP con los del triángulo OWB; esos triángulos comparten el ángulo en O y tienen lados paralelos, así que son semejantes.",
    pista: "Mira qué triángulos contienen los cuatro segmentos de la proporción.",
    error: "Elegir una semejanza que incluye puntos que no aparecen en la proporción.",
    distractores: [null, "La proporción usa OW y OB; el triángulo OYR no contiene esos segmentos.", "ΔOZS no contiene OW ni OB, que son segmentos de la proporción.", "La proporción usa OT y OP, que están en ΔOTP, no en ΔOYR."],
    etiquetas: ["semejanza", "proporción"]
  },
  {
    id: "M3-08", modulo: "M3", indicador: "ES.G.42", tipo: "sm", nivel: 3,
    repaso: "f2",
    enunciado: "Dos figuras semejantes tienen razón de semejanza 3. Si el área de la figura pequeña es 5 cm², ¿cuál es el área de la figura grande?",
    opciones: ["8 cm²", "15 cm²", "45 cm²", "125 cm²"],
    respuesta: 2,
    explicacion: "La razón de áreas es el cuadrado de la razón de semejanza: 3² = 9. Entonces 5 × 9 = 45 cm².",
    pista: "El área no crece al mismo ritmo que los lados.",
    error: "Multiplicar el área por 3 en vez de por 9.",
    distractores: ["Sumaste 5 + 3. La razón de semejanza multiplica, y en áreas se eleva al cuadrado.", "Multiplicaste por 3, pero las áreas cambian con el cuadrado de la razón: 3² = 9.", null, "125 es 5³. El cubo se usa para volúmenes; en áreas se multiplica por la razón al cuadrado: 5 × 9 = 45."],
    etiquetas: ["semejanza", "área"]
  },

  /* ================= M4 · TRANSFORMACIONES ================= */
  {
    id: "M4-01", modulo: "M4", indicador: "ES.G.41", tipo: "sm", nivel: 2,
    repaso: "i1",
    enunciado: "El punto P(3, 2) se refleja respecto al eje y. ¿Cuáles son las coordenadas de su imagen?",
    opciones: ["(3, −2)", "(−3, 2)", "(−3, −2)", "(2, 3)"],
    respuesta: 1,
    explicacion: "Reflejar sobre el eje y cambia el signo de x y conserva y: (3, 2) → (−3, 2).",
    pista: "El eje y es la línea vertical; el punto salta al lado opuesto sin subir ni bajar.",
    error: "Cambiar el signo de y (eso sería reflexión sobre el eje x).",
    distractores: ["Cambiaste el signo de y: eso es reflejar sobre el eje x.", null, "Cambiaste los dos signos: eso es una rotación de 180°.", "Intercambiaste x y y: eso es reflejar sobre la recta y = x."],
    etiquetas: ["transformaciones", "coordenadas"]
  },
  {
    id: "M4-02", modulo: "M4", indicador: "ES.G.41", tipo: "sm", nivel: 2,
    repaso: "i0",
    figura: "gridTraslacion",
    enunciado: "El triángulo tiene un vértice en A(−2, −3). Si se traslada 2 unidades a la derecha y 3 unidades hacia arriba, ¿cuáles son las coordenadas de A′?",
    opciones: ["(0, 0)", "(−4, 0)", "(0, −6)", "(−4, −6)"],
    respuesta: 0,
    explicacion: "Derecha suma a x: −2 + 2 = 0. Arriba suma a y: −3 + 3 = 0. A′(0, 0).",
    pista: "Haz los dos movimientos por separado y escribe el par ordenado al final.",
    error: "Restar en lugar de sumar, o intercambiar los movimientos de x y y.",
    distractores: [null, "Moviste x hacia la izquierda: −2 − 2 = −4. Moverse a la derecha suma a x.", "Moviste y hacia abajo: −3 − 3 = −6. Moverse hacia arriba suma a y.", "Restaste en los dos movimientos. Derecha y arriba suman."],
    etiquetas: ["transformaciones", "traslación"]
  },
  {
    id: "M4-03", modulo: "M4", indicador: "ES.G.41", tipo: "sm", nivel: 3,
    repaso: "i2",
    enunciado: "El punto Q(2, 1) se rota 90° en sentido contrario al reloj alrededor del origen. ¿Cuál es su imagen?",
    opciones: ["(−1, 2)", "(1, −2)", "(−2, 1)", "(2, −1)"],
    respuesta: 0,
    explicacion: "La regla de rotación 90° antihoraria es (x, y) → (−y, x). Entonces (2, 1) → (−1, 2).",
    pista: "Intercambia las coordenadas y cambia el signo de la nueva x.",
    error: "Aplicar (y, −x), que corresponde a 90° en sentido horario.",
    distractores: [null, "(y, −x) es la rotación de 90° en sentido horario. La antihoraria es (−y, x).", "Solo cambiaste el signo de x: eso es reflejar sobre el eje y, no rotar.", "Solo cambiaste el signo de y: eso es reflejar sobre el eje x."],
    etiquetas: ["transformaciones", "rotación"]
  },
  {
    id: "M4-04", modulo: "M4", indicador: "ES.G.40", tipo: "sm", nivel: 2,
    repaso: "i1",
    enunciado: "¿Cuál transformación <strong>no</strong> conserva la orientación de la figura?",
    opciones: ["Traslación", "Rotación", "Reflexión", "Ninguna de las anteriores"],
    respuesta: 2,
    explicacion: "La reflexión produce una imagen especular: conserva distancias y ángulos, pero invierte la orientación.",
    pista: "Piensa en tu imagen en un espejo: la izquierda y la derecha se intercambian.",
    error: "Pensar que la rotación invierte la orientación; solo la gira.",
    distractores: ["La traslación desliza la figura sin girarla ni voltearla: conserva la orientación.", "La rotación gira la figura, pero no la voltea: el orden de los vértices se mantiene.", null, "Sí hay una: la reflexión voltea la figura como un espejo e invierte la orientación."],
    etiquetas: ["transformaciones", "orientación"]
  },
  {
    id: "M4-05", modulo: "M4", indicador: "ES.G.41", tipo: "sm", nivel: 2,
    repaso: "i1",
    figura: "planoReflexion",
    enunciado: "La figura A se transformó en la figura B. ¿Cuál transformación se aplicó?",
    opciones: ["Reflexión sobre el eje x", "Reflexión sobre el eje y", "Rotación de 90°", "Traslación de 6 unidades"],
    respuesta: 0,
    explicacion: "La figura B es la imagen especular de A por debajo del eje x, con la misma x y la y opuesta: reflexión sobre el eje x.",
    pista: "Compara un vértice de A con su correspondiente en B: ¿cambia x o cambia y?",
    error: "Elegir reflexión sobre el eje y porque «se ve al revés».",
    distractores: [null, "Reflejar sobre el eje y cambia el signo de x: la figura pasaría al otro lado del eje y. Aquí B quedó debajo del eje x, con las mismas x.", "Una rotación de 90° cambia la posición de la figura girándola; aquí cada vértice conserva su x y solo cambia el signo de y.", "Una traslación conserva la orientación. B está volteada respecto de A: es su imagen en el espejo."],
    etiquetas: ["transformaciones", "figura"]
  },
  {
    id: "M4-06", modulo: "M4", indicador: "ES.G.41", tipo: "num", nivel: 2,
    repaso: "i2",
    enunciado: "El punto R(4, −1) se rota 180° alrededor del origen. ¿Cuál es la coordenada x de su imagen?",
    respuesta: -4, tolerancia: 0.01,
    explicacion: "Una rotación de 180° aplica (x, y) → (−x, −y). La imagen es (−4, 1); su coordenada x es −4.",
    pista: "180° es media vuelta: ambos signos cambian.",
    error: "Escribir 4 porque solo se cambió el signo de y.",
    etiquetas: ["transformaciones", "rotación"]
  },
  {
    id: "M4-07", modulo: "M4", indicador: "ES.G.41", tipo: "sm", nivel: 3,
    repaso: "i3",
    enunciado: "Al punto S(1, 2) se le aplica una traslación de 3 unidades a la derecha y luego una reflexión sobre el eje x. ¿Cuál es la imagen final?",
    opciones: ["(4, 2)", "(4, −2)", "(−4, −2)", "(1, −2)"],
    respuesta: 1,
    explicacion: "Primero: (1 + 3, 2) = (4, 2). Luego, reflexión sobre el eje x: (4, −2).",
    pista: "Respeta el orden: primero la traslación, después la reflexión.",
    error: "Aplicar solo una de las dos transformaciones, o cambiar el signo de x al reflejar sobre el eje x.",
    distractores: ["Hiciste la traslación, pero olvidaste la reflexión sobre el eje x.", null, "Cambiaste también el signo de x. Reflejar sobre el eje x solo cambia el signo de y.", "Hiciste la reflexión, pero olvidaste trasladar 3 unidades a la derecha."],
    etiquetas: ["transformaciones", "composición"]
  },

  /* ================= M5 · CÍRCULOS Y MEDICIÓN ================= */
  {
    id: "M5-01", modulo: "M5", indicador: "ES.G.43", tipo: "sm", nivel: 2,
    repaso: "i1",
    enunciado: "Un ángulo central mide 80°. ¿Cuánto mide un ángulo inscrito que abarca el mismo arco?",
    opciones: ["160°", "40°", "80°", "20°"],
    respuesta: 1,
    explicacion: "El ángulo inscrito mide la mitad del ángulo central que abarca el mismo arco: 80 ÷ 2 = 40°.",
    pista: "Inscrito = mitad del central.",
    error: "Duplicar en vez de dividir.",
    distractores: ["Duplicaste. El inscrito mide la mitad del central, no el doble.", null, "80° es el ángulo central. El inscrito que abarca el mismo arco mide la mitad.", "Dividiste entre 4. Basta dividir una vez entre 2."],
    etiquetas: ["círculos", "ángulos"]
  },
  {
    id: "M5-02", modulo: "M5", indicador: "ES.G.43", tipo: "abierta", nivel: 3,
    repaso: "i2",
    figura: "circuloSecantes",
    enunciado: "Dos secantes se cortan en el punto K, fuera del círculo. Los arcos interceptados miden 95° y 25°. Clasifica el ∠JKL como central, exterior o interior y calcula su medida en grados. <em>Contesta ambas partes.</em>",
    rubrica: [
      "Clasifica correctamente el ángulo como exterior (1 punto).",
      "Calcula (95 − 25) ÷ 2 = 35° y muestra el procedimiento (1 punto)."
    ],
    respuestaModelo: "El ∠JKL es un ángulo exterior porque su vértice está fuera del círculo. Su medida es (95° − 25°) ÷ 2 = 70° ÷ 2 = 35°.",
    explicacion: "Un ángulo exterior formado por dos secantes mide la mitad de la diferencia de los arcos interceptados: (95 − 25)/2 = 35°.",
    pista: "Vértice fuera del círculo → exterior. Usa la diferencia de los arcos, no la suma.",
    error: "Sumar los arcos (120/2 = 60°) o contestar solo la medida sin clasificar.",
    etiquetas: ["círculos", "respuesta abierta"]
  },
  {
    id: "M5-03", modulo: "M5", indicador: "ES.G.43", tipo: "sm", nivel: 2,
    repaso: "i1",
    enunciado: "Un ángulo inscrito mide 35°. ¿Cuánto mide el ángulo central que abarca el mismo arco?",
    opciones: ["70°", "35°", "17.5°", "145°"],
    respuesta: 0,
    explicacion: "El central es el doble del inscrito: 35 × 2 = 70°.",
    pista: "Si el inscrito es la mitad, el central es el doble.",
    error: "Dividir entre 2 en lugar de multiplicar.",
    distractores: [null, "35° es el inscrito. El central que abarca el mismo arco mide el doble.", "Dividiste entre 2. El central es el doble del inscrito, no la mitad.", "145° es el suplemento de 35° (180 − 35). Aquí no hay suplementos: el central es el doble del inscrito."],
    etiquetas: ["círculos", "ángulos"]
  },
  {
    id: "M5-04", modulo: "M5", indicador: "ES.G.43", tipo: "sm", nivel: 1,
    repaso: "i3",
    enunciado: "Una recta es tangente a un círculo en el punto T. ¿Qué ángulo forma la tangente con el radio que termina en T?",
    opciones: ["45°", "60°", "180°", "90°"],
    respuesta: 3,
    explicacion: "El radio trazado al punto de tangencia es perpendicular a la tangente; por eso el ángulo mide 90°.",
    pista: "La tangente «roza» el círculo: el radio llega perpendicular.",
    error: "Elegir 180° porque la recta es continua; el ángulo con el radio es recto.",
    distractores: ["45° no tiene relación con la tangente. El radio al punto de tangencia es perpendicular: 90°.", "60° no aparece aquí. El radio y la tangente son perpendiculares.", "180° sería una línea recta. El radio llega a la tangente formando un ángulo recto.", null],
    etiquetas: ["círculos", "tangente"]
  },
  {
    id: "M5-05", modulo: "M5", indicador: "ES.M.56", tipo: "sm", nivel: 1,
    repaso: "f0",
    enunciado: "¿Cuál es la circunferencia de un círculo con radio 7 cm?",
    opciones: ["7π cm", "14π cm", "49π cm", "14 cm"],
    respuesta: 1,
    explicacion: "C = 2πr = 2π(7) = 14π cm.",
    pista: "Circunferencia es el borde: 2πr.",
    error: "Usar πr² (área) o confundir el diámetro con el radio.",
    distractores: ["Usaste C = πr. La circunferencia es 2πr, o sea, π por el diámetro.", null, "49π es πr², el área del círculo, no su borde.", "Olvidaste π. C = 2πr = 14π cm."],
    etiquetas: ["medición", "círculo"]
  },
  {
    id: "M5-06", modulo: "M5", indicador: "ES.M.56", tipo: "sm", nivel: 2,
    repaso: "f2",
    figura: "cilindro",
    enunciado: "Un barril para recoger agua de lluvia tiene forma de cilindro, con 16 pulgadas de diámetro y 30 pulgadas de altura. ¿Cuál es su volumen?",
    opciones: ["480π pulg³", "1,920π pulg³", "7,680π pulg³", "3,840π pulg³"],
    respuesta: 1,
    explicacion: "El radio es 8 pulgadas (la mitad del diámetro). V = πr²h = π(8²)(30) = π(64)(30) = 1,920π pulg³.",
    pista: "Primero convierte el diámetro en radio.",
    error: "Usar 16 como radio: daría 7,680π.",
    distractores: ["Calculaste 2πrh (o π × diámetro × altura), que es el área lateral, no el volumen.", null, "Usaste 16 como radio. El radio es la mitad del diámetro: 8 pulgadas.", "Multiplicaste por 2 de más: el volumen es πr²h, sin el 2."],
    etiquetas: ["medición", "volumen"]
  },
  {
    id: "M5-07", modulo: "M5", indicador: "ES.M.56", tipo: "sm", nivel: 2,
    repaso: "f3",
    figura: "esfera",
    enunciado: "Un globo terráqueo tiene forma de esfera con un radio de 6 pulgadas. ¿Cuál es su volumen?",
    opciones: ["144π pulg³", "288π pulg³", "864π pulg³", "48π pulg³"],
    respuesta: 1,
    explicacion: "V = (4/3)πr³ = (4/3)π(6³) = (4/3)π(216) = 288π pulg³.",
    pista: "El volumen de la esfera es (4/3)πr³; no olvides elevar al cubo.",
    error: "Usar 4πr² (área de la superficie) o elevar al cuadrado.",
    distractores: ["144π es 4πr², el área de la superficie, no el volumen.", null, "864π es 4πr³: olvidaste dividir entre 3.", "Elevaste el radio al cuadrado: (4/3)π(36) = 48π. En volumen el radio va al cubo."],
    etiquetas: ["medición", "volumen"]
  },
  {
    id: "M5-08", modulo: "M5", indicador: "ES.M.56", tipo: "sm", nivel: 2,
    repaso: "f4",
    figura: "prisma",
    enunciado: "Marcos necesita una caja de herramientas con forma de prisma rectangular y un volumen de al menos 90 pulg³. ¿Cuáles dimensiones cumplen el requisito?",
    opciones: ["3 pulg × 4 pulg × 6 pulg", "2 pulg × 5 pulg × 8 pulg", "4 pulg × 5 pulg × 5 pulg", "3 pulg × 3 pulg × 9 pulg"],
    respuesta: 2,
    explicacion: "4 × 5 × 5 = 100 pulg³, que es mayor o igual que 90. Las otras opciones dan 72, 80 y 81 pulg³.",
    pista: "Multiplica las tres dimensiones de cada opción y compara con 90.",
    error: "Elegir la opción con la dimensión más grande sin calcular el volumen.",
    distractores: ["3 × 4 × 6 = 72 pulg³, menos de 90.", "2 × 5 × 8 = 80 pulg³, menos de 90. Tener un lado largo no garantiza volumen suficiente.", null, "3 × 3 × 9 = 81 pulg³, menos de 90. El 9 es grande, pero el volumen no alcanza."],
    etiquetas: ["medición", "volumen"]
  },
  {
    id: "M5-09", modulo: "M5", indicador: "ES.G.45", tipo: "sm", nivel: 2,
    repaso: "i4",
    enunciado: "Un plano interseca una esfera. ¿Qué figura se forma en la intersección?",
    opciones: ["Un punto", "Una elipse", "Un círculo", "Un paralelogramo"],
    respuesta: 2,
    explicacion: "La intersección de un plano y una esfera es un círculo (o un punto si el plano es tangente).",
    pista: "Corta una naranja con un cuchillo plano: la cara del corte es redonda.",
    error: "Elegir elipse: una esfera no es un cono; sus cortes planos son círculos.",
    distractores: ["Solo da un punto si el plano apenas toca la esfera (tangente). Si la corta, se forma un círculo.", "Las elipses salen al cortar un cilindro o un cono de forma inclinada. Todo corte plano de una esfera es un círculo.", null, "La esfera no tiene caras planas ni aristas; su corte no puede tener lados rectos."],
    etiquetas: ["geometría del espacio", "sólidos"]
  },

  /* ================= M6 · ÁLGEBRA, MATRICES Y DATOS ================= */
  {
    id: "M6-01", modulo: "M6", indicador: "ES.N.9", tipo: "sm", nivel: 2,
    repaso: "i0",
    enunciado: "Al simplificar 5(x + 3y) + 7x − 8y, el primer paso es 5x + 15y + 7x − 8y. ¿Cuál propiedad se aplicó?",
    opciones: ["Conmutativa de la suma", "Asociativa de la suma", "Distributiva", "Inverso aditivo"],
    respuesta: 2,
    explicacion: "Se multiplicó 5 por cada término del paréntesis: 5(x + 3y) = 5x + 15y. Es la propiedad distributiva.",
    pista: "El 5 «entra» a multiplicar a los dos términos del paréntesis.",
    error: "Elegir conmutativa porque cambiaron el orden de los términos en el paso 2.",
    distractores: ["La conmutativa cambia el orden. Aquí no se cambió el orden: el 5 multiplicó a cada término.", "La asociativa cambia la agrupación (dónde van los paréntesis) sin multiplicar. Aquí el 5 se repartió.", null, "El inverso aditivo es sumar el opuesto para obtener 0. No aparece en este paso."],
    etiquetas: ["propiedades", "álgebra"]
  },
  {
    id: "M6-02", modulo: "M6", indicador: "ES.N.9", tipo: "num", nivel: 2,
    repaso: "i4",
    enunciado: "Si x = −3, ¿cuál es el valor de 2(x + 1)² − 5x?",
    respuesta: 23, tolerancia: 0.01,
    explicacion: "x + 1 = −2; (−2)² = 4; 2(4) = 8; −5(−3) = 15; 8 + 15 = 23.",
    pista: "Resuelve el paréntesis, eleva al cuadrado y cuida el signo de −5x cuando x es negativo.",
    error: "Calcular −5(−3) como −15 y obtener 8 − 15 = −7.",
    etiquetas: ["evaluación", "signos"]
  },
  {
    id: "M6-03", modulo: "M6", indicador: "ES.A.11", tipo: "sm", nivel: 2,
    repaso: "i1",
    enunciado: "¿Cuál es la solución del sistema 2x − y = 5 y 5x − 4y = 8?",
    opciones: ["(1, 3)", "(4, 3)", "(5, 5)", "(7, 6)"],
    respuesta: 1,
    explicacion: "De la primera, y = 2x − 5. Sustituye: 5x − 4(2x − 5) = 8 → 5x − 8x + 20 = 8 → −3x = −12 → x = 4; y = 3.",
    pista: "Despeja y en la primera y sustitúyela en la segunda.",
    error: "Probar solo la primera ecuación: (5, 5) la cumple, pero no la segunda.",
    distractores: ["(1, 3) no cumple la primera ecuación: 2(1) − 3 = −1, no 5.", null, "(5, 5) cumple la primera (10 − 5 = 5), pero no la segunda: 25 − 20 = 5, no 8. Verifica siempre las dos ecuaciones.", "(7, 6) no cumple la primera: 14 − 6 = 8, no 5."],
    etiquetas: ["sistemas", "sustitución"]
  },
  {
    id: "M6-04", modulo: "M6", indicador: "ES.A.11", tipo: "sm", nivel: 3,
    repaso: "i1",
    enunciado: "¿Cuántas soluciones tiene el sistema 2x − y = 5 y −6x + 3y = −15?",
    opciones: ["Una solución", "Dos soluciones", "Ninguna solución", "Infinitas soluciones"],
    respuesta: 3,
    explicacion: "La segunda ecuación es −3 veces la primera: −3(2x − y) = −6x + 3y = −15. Representan la misma recta, así que todo punto de ella es solución.",
    pista: "Compara las ecuaciones: ¿una es múltiplo de la otra?",
    error: "Resolver y obtener 0 = 0, entonces concluir «ninguna solución».",
    distractores: ["Para tener una sola solución, las rectas deben cortarse en un punto. La segunda ecuación es −3 veces la primera: es la misma recta.", "Dos rectas no se cortan en exactamente dos puntos: se cortan en uno, en ninguno o son la misma recta.", "«Ninguna solución» ocurre si al resolver queda algo falso, como 0 = 7. Aquí queda 0 = 0, que siempre es verdadero.", null],
    etiquetas: ["sistemas", "interpretación"]
  },
  {
    id: "M6-05", modulo: "M6", indicador: "ES.A.11", tipo: "sm", nivel: 2,
    repaso: "i2",
    enunciado: "Si K = [[2, −5], [−1, 3]], ¿cuál matriz corresponde a −3K?",
    opciones: [
      "[[6, 15], [3, 9]]",
      "[[6, −15], [−3, 9]]",
      "[[−6, 15], [3, −9]]",
      "[[−6, −15], [−3, −9]]"
    ],
    respuesta: 2,
    explicacion: "Multiplica cada entrada por −3: 2(−3) = −6; (−5)(−3) = 15; (−1)(−3) = 3; 3(−3) = −9.",
    pista: "El escalar negativo cambia el signo de todas las entradas.",
    error: "Cambiar el signo solo de algunas entradas.",
    distractores: ["Tomaste valores absolutos. Al multiplicar por −3, cada entrada cambia de signo: 2 se vuelve −6.", "Multiplicaste por 3, no por −3: los signos quedaron igual que en K.", null, "Pusiste todo negativo. Negativo por negativo es positivo: (−5)(−3) = 15."],
    etiquetas: ["matrices", "escalar"]
  },
  {
    id: "M6-06", modulo: "M6", indicador: "ES.A.11", tipo: "sm", nivel: 3,
    repaso: "i2",
    enunciado: "Si A = [[2, −1], [3, 4]] y v = [[5], [−2]], ¿cuál es el producto Av?",
    opciones: ["[[10], [−8]]", "[[4], [−13]]", "[[8], [23]]", "[[12], [7]]"],
    respuesta: 3,
    explicacion: "Fila 1: 2(5) + (−1)(−2) = 10 + 2 = 12. Fila 2: 3(5) + 4(−2) = 15 − 8 = 7.",
    pista: "Multiplica fila por columna y suma los productos.",
    error: "Multiplicar entrada por entrada sin sumar los productos de cada fila.",
    distractores: ["Multiplicaste una sola entrada por fila (2 × 5 y 4 × (−2)). Cada fila tiene dos productos que se suman.", "Multiplicaste las columnas de A por v. Se multiplica cada FILA por la columna.", "Revisa los signos: (−1)(−2) = +2 y 4(−2) = −8. Fila 1: 10 + 2 = 12; fila 2: 15 − 8 = 7.", null],
    etiquetas: ["matrices", "producto"]
  },
  {
    id: "M6-07", modulo: "M6", indicador: "ES.N.9", tipo: "sm", nivel: 2,
    repaso: "f1",
    enunciado: "Un bloque de aluminio tiene una masa de 540 g y un volumen de 200 cm³. ¿Cuál es su densidad?",
    opciones: ["0.37 g/cm³", "2.7 g/cm³", "340 g/cm³", "108,000 g/cm³"],
    respuesta: 1,
    explicacion: "d = m/V = 540 ÷ 200 = 2.7 g/cm³.",
    pista: "La densidad es masa entre volumen: d = m/V.",
    error: "Invertir la fórmula y dividir el volumen entre la masa.",
    distractores: ["Dividiste 200 ÷ 540: invertiste la fórmula. La densidad es masa entre volumen.", null, "Restaste 540 − 200. La densidad se obtiene dividiendo, no restando.", "Multiplicaste 540 × 200. La densidad es la masa DIVIDIDA entre el volumen."],
    etiquetas: ["fórmulas", "densidad"]
  },
  {
    id: "M6-08", modulo: "M6", indicador: "ES.E.58", tipo: "sm", nivel: 2,
    repaso: "i3",
    enunciado: "Una ruleta tiene 4 secciones iguales: 1 roja y 3 azules. Se gira dos veces. ¿Cuál es la probabilidad de que salga rojo al menos una vez?",
    opciones: ["0.0625", "0.4375", "0.50", "0.5625"],
    respuesta: 1,
    explicacion: "P(al menos un rojo) = 1 − P(ningún rojo) = 1 − (3/4)² = 1 − 9/16 = 7/16 = 0.4375.",
    pista: "Calcula el complemento: «ningún rojo» significa azul en los dos giros.",
    error: "Sumar 1/4 + 1/4 = 0.50, que cuenta dos veces el caso de rojo en ambos giros.",
    distractores: ["0.0625 = 1/16 es la probabilidad de rojo en los DOS giros. «Al menos una vez» también incluye un solo rojo.", null, "Sumaste 1/4 + 1/4. Así se cuenta dos veces el caso en que salen dos rojos.", "0.5625 = 9/16 es la probabilidad de ningún rojo. Lo pedido es el complemento: 1 − 9/16."],
    etiquetas: ["probabilidad", "complemento"]
  },
  {
    id: "M6-09", modulo: "M6", indicador: "ES.E.58", tipo: "sm", nivel: 3,
    repaso: "i3",
    enunciado: "Una variable X toma los valores 0, 1 y 2 con probabilidades 0.5, 0.3 y 0.2, respectivamente. ¿Cuál es el valor esperado E(X)?",
    opciones: ["0.5", "0.7", "1.0", "1.2"],
    respuesta: 1,
    explicacion: "E(X) = 0(0.5) + 1(0.3) + 2(0.2) = 0 + 0.3 + 0.4 = 0.7.",
    pista: "Multiplica cada valor por su probabilidad y suma.",
    error: "Sumar solo las probabilidades (1.0) o promediar los valores sin ponderar.",
    distractores: ["0.5 es solo la probabilidad de X = 0. El valor esperado multiplica cada valor por su probabilidad y suma.", null, "1.0 es la suma de las probabilidades, que siempre da 1. Hay que multiplicar cada valor por su probabilidad.", "Revisa la suma: 0(0.5) + 1(0.3) + 2(0.2) = 0 + 0.3 + 0.4 = 0.7."],
    etiquetas: ["probabilidad", "valor esperado"]
  },


  /* ================= ÍTEMS CON FIGURA (M1 y M2) ================= */
  {
    id: "M1-08", modulo: "M1", indicador: "ES.G.44", tipo: "sm", nivel: 2,
    repaso: "f0",
    enunciado: "¿Cuál figura muestra la construcción de la <strong>mediatriz</strong> del segmento AB con regla y compás?",
    opciones: [
      "Una recta perpendicular a AB que no pasa por su punto medio",
      "Arcos del mismo radio desde A y desde B que se cortan arriba y abajo de AB, y la recta que une esos cortes",
      "Una recta que pasa por el punto medio de AB pero no es perpendicular",
      "Un círculo cuyo diámetro es AB"
    ],
    opcionesFigura: ["medNoMedio", "medCorrecta", "medInclinada", "medCirculo"],
    respuesta: 1,
    explicacion: "Con el compás se trazan arcos del mismo radio desde A y desde B. Los dos puntos donde se cortan están a la misma distancia de A y de B; la recta que los une es perpendicular a AB y pasa por su punto medio: es la mediatriz.",
    pista: "La mediatriz cumple dos condiciones a la vez: es perpendicular a AB y pasa por su punto medio.",
    error: "Elegir una recta que cumple solo una de las dos condiciones.",
    distractores: ["Esa recta es perpendicular, pero está más cerca de A que de B: no pasa por el punto medio.", null, "Esa recta pasa por el punto medio, pero no es perpendicular a AB.", "Ese círculo tiene a AB como diámetro, pero no traza ninguna recta. La mediatriz es una recta."],
    etiquetas: ["construcciones", "figura"]
  },
  {
    id: "M1-09", modulo: "M1", indicador: "ES.G.36", tipo: "sm", nivel: 1,
    repaso: "i1",
    figura: "colineales",
    enunciado: "En la figura, A, B y C están sobre la recta ℓ, que está en el plano. D está en el plano, fuera de ℓ, y E está fuera del plano. ¿Cuáles tres puntos son <strong>colineales</strong>?",
    opciones: ["A, B y C", "A, B y D", "A, D y E", "B, C y E"],
    respuesta: 0,
    explicacion: "Colineales significa que están en una misma recta. A, B y C están los tres sobre la recta ℓ.",
    pista: "Busca tres puntos que estén sobre la misma recta, no solo en el mismo plano.",
    error: "Confundir colineal (misma recta) con coplanar (mismo plano).",
    distractores: [null, "A, B y D son coplanares (los tres están en el plano), pero D no está sobre la recta ℓ.", "E está fuera del plano y D está fuera de ℓ: esos tres puntos no están en una misma recta.", "E está fuera del plano, así que no está sobre la recta ℓ."],
    etiquetas: ["vocabulario", "figura", "colineal"]
  },
  {
    id: "M2-14", modulo: "M2", indicador: "ES.G.40", tipo: "sm", nivel: 2,
    repaso: "i0",
    enunciado: "¿En cuál par de triángulos las marcas <strong>garantizan</strong> que los triángulos son congruentes?",
    opciones: [
      "Los tres pares de ángulos están marcados",
      "Dos pares de lados y un ángulo que no está entre ellos están marcados",
      "Dos pares de lados y el ángulo comprendido entre ellos están marcados",
      "Solo dos pares de lados están marcados"
    ],
    opcionesFigura: ["congAAA", "congLLA", "congLAL", "congLL"],
    respuesta: 2,
    explicacion: "En la opción C están marcados dos pares de lados y el ángulo que forman esos lados: es el criterio LAL, que garantiza la congruencia.",
    pista: "Busca un criterio completo: LLL, LAL, ALA o AAL. Fíjate si el ángulo marcado está entre los lados marcados.",
    error: "Creer que tres pares de ángulos iguales bastan para la congruencia.",
    distractores: ["Tres ángulos iguales garantizan la misma forma, no el mismo tamaño. Esos triángulos son de distinto tamaño: son semejantes, no congruentes.", "El ángulo marcado no está entre los dos lados marcados. Lado-lado-ángulo no es un criterio de congruencia.", null, "Dos pares de lados no bastan: si el ángulo entre ellos cambia, el tercer lado también cambia."],
    etiquetas: ["congruencia", "figura", "criterios"]
  },
  {
    id: "M2-15", modulo: "M2", indicador: "ES.G.40", tipo: "sm", nivel: 2,
    repaso: "i0",
    figura: "triangulosAAL",
    enunciado: "Observa las marcas en ΔABC y ΔDEF. ¿Cuál criterio justifica que los triángulos son congruentes?",
    opciones: ["LLL", "LAL", "ALA", "AAL"],
    respuesta: 3,
    explicacion: "Están marcados dos pares de ángulos (A con D y B con E) y un par de lados (BC con EF). El lado BC no está entre los ángulos A y B (el lado entre ellos sería AB), así que el criterio es AAL.",
    pista: "Primero cuenta cuántos ángulos y cuántos lados están marcados. Luego mira si el lado está entre los dos ángulos.",
    error: "Elegir ALA sin comprobar si el lado marcado está entre los ángulos marcados.",
    distractores: ["LLL necesita tres pares de lados; en la figura solo hay un lado marcado.", "LAL necesita dos pares de lados y aquí solo hay uno. Además hay dos ángulos marcados.", "Para ALA, el lado marcado tendría que ser AB, el que une los vértices de los ángulos marcados. El lado marcado es BC.", null],
    etiquetas: ["congruencia", "figura", "criterios"]
  },

  /* ================= RESPUESTA ABIERTA (2 puntos) ================= */
  {
    id: "M3-10", modulo: "M3", indicador: "ES.G.42", tipo: "abierta", nivel: 3,
    repaso: "i1",
    enunciado: "ΔPQR ~ ΔSTU. En ΔPQR, PQ = 8 cm y QR = 12 cm. En ΔSTU, ST = 10 cm.<br>a) Escribe la razón de semejanza de ΔSTU a ΔPQR.<br>b) Calcula TU y muestra la proporción que usaste. <em>Contesta ambas partes.</em>",
    rubrica: [
      "a) Escribe la razón 10/8 = 5/4 (o 1.25) en el orden correcto (1 punto).",
      "b) Plantea TU/12 = 10/8 y obtiene TU = 15 cm (1 punto)."
    ],
    respuestaModelo: "a) La razón de ΔSTU a ΔPQR es ST/PQ = 10/8 = 5/4 = 1.25. b) TU corresponde a QR: TU/12 = 10/8, así que TU = 12 × 1.25 = 15 cm.",
    explicacion: "Los vértices se corresponden en orden: P↔S, Q↔T, R↔U. Por eso ST corresponde a PQ y TU corresponde a QR. La razón es 10/8 = 1.25 y TU = 12 × 1.25 = 15 cm.",
    pista: "Alinea los vértices: P↔S, Q↔T, R↔U. ¿Qué lado de ΔPQR corresponde a TU?",
    error: "Escribir la razón al revés (8/10) y obtener TU = 9.6 cm, o dar solo el número sin la proporción.",
    etiquetas: ["semejanza", "respuesta abierta"]
  },
  {
    id: "M4-08", modulo: "M4", indicador: "ES.G.41", tipo: "abierta", nivel: 3,
    repaso: "i1",
    enunciado: "El triángulo con vértices A(1, 2), B(4, 2) y C(1, 5) se refleja sobre el eje y.<br>a) Escribe las coordenadas de A′, B′ y C′.<br>b) Explica si ΔA′B′C′ es congruente con ΔABC y por qué. <em>Contesta ambas partes.</em>",
    rubrica: [
      "a) A′(−1, 2), B′(−4, 2) y C′(−1, 5) (1 punto).",
      "b) Dice que sí son congruentes porque la reflexión es una transformación rígida: conserva distancias y ángulos (1 punto)."
    ],
    respuestaModelo: "a) Al reflejar sobre el eje y se cambia el signo de x: A′(−1, 2), B′(−4, 2), C′(−1, 5). b) Sí, son congruentes. La reflexión es una transformación rígida: conserva las longitudes de los lados y las medidas de los ángulos. Solo cambia la orientación.",
    explicacion: "Reflejar sobre el eje y: (x, y) → (−x, y). Las transformaciones rígidas (traslación, rotación y reflexión) producen figuras congruentes.",
    pista: "El eje y es el espejo: cambia el signo de x. Para la parte b, piensa si la reflexión cambia el tamaño o la forma.",
    error: "Cambiar el signo de y, o decir que no son congruentes porque la figura quedó «al revés».",
    etiquetas: ["transformaciones", "respuesta abierta"]
  },
  {
    id: "M6-11", modulo: "M6", indicador: "ES.A.11", tipo: "abierta", nivel: 2,
    repaso: "i1",
    enunciado: "Resuelve el sistema x + y = 7 y 2x − y = 5.<br>a) Muestra el método que usaste.<br>b) Verifica tu solución en las dos ecuaciones. <em>Contesta ambas partes.</em>",
    rubrica: [
      "a) Muestra un método válido (suma, sustitución o matrices) y obtiene x = 4, y = 3 (1 punto).",
      "b) Sustituye (4, 3) en las dos ecuaciones: 4 + 3 = 7 y 2(4) − 3 = 5 (1 punto)."
    ],
    respuestaModelo: "a) Sumo las ecuaciones: (x + y) + (2x − y) = 7 + 5, entonces 3x = 12 y x = 4. Sustituyo en la primera: 4 + y = 7, entonces y = 3. b) Verifico: 4 + 3 = 7 y 2(4) − 3 = 8 − 3 = 5. La solución es (4, 3).",
    explicacion: "Al sumar las ecuaciones se elimina y. Verificar en las dos ecuaciones confirma que el punto está en ambas rectas.",
    pista: "Si sumas las dos ecuaciones, la y desaparece.",
    error: "Verificar en una sola ecuación, o no mostrar el método.",
    etiquetas: ["sistemas", "respuesta abierta"]
  },

  /* ================= DEMOSTRACIONES DE DOS COLUMNAS =================
     Arquetipo «¿cuál es la razón del paso N?» (G.39, G.46, G.47, G.43).
     Campo `demostracion`: dado, probar, pasos [[afirmación, razón]] y
     `falta` (índice desde 0 del paso cuya razón se pregunta). */
  {
    id: "M2-09", modulo: "M2", indicador: "ES.G.46", tipo: "sm", nivel: 3,
    repaso: "i5",
    figura: "triangulosBD",
    enunciado: "Lee la demostración. ¿Cuál es la razón del paso 3?",
    demostracion: {
      dado: "AB ≅ CB; D es el punto medio de AC.",
      probar: "ΔABD ≅ ΔCBD",
      pasos: [
        ["AB ≅ CB", "Dado"],
        ["D es el punto medio de AC", "Dado"],
        ["AD ≅ CD", "Definición de punto medio"],
        ["BD ≅ BD", "Propiedad reflexiva"],
        ["ΔABD ≅ ΔCBD", "LLL"]
      ],
      falta: 2
    },
    opciones: ["Definición de punto medio", "Propiedad reflexiva", "LLL", "Definición de bisectriz"],
    respuesta: 0,
    explicacion: "El paso 3 sale del paso 2: un punto medio divide un segmento en dos partes congruentes. Por eso AD ≅ CD se justifica con la definición de punto medio.",
    pista: "Mira el paso anterior. ¿Qué dato acabas de escribir y qué te dice sobre AD y CD?",
    error: "Elegir LLL: LLL justifica que los triángulos son congruentes (paso 5), no que dos segmentos lo sean.",
    distractores: [null, "La propiedad reflexiva dice que un segmento es congruente consigo mismo, como BD ≅ BD en el paso 4. AD y CD son segmentos distintos.", "LLL es un criterio para concluir que dos triángulos son congruentes. Se usa en el paso 5, no para dos segmentos.", "Una bisectriz divide un ángulo. Aquí se divide un segmento, AC, por su punto medio."],
    etiquetas: ["prueba", "dos columnas", "congruencia"]
  },
  {
    id: "M2-10", modulo: "M2", indicador: "ES.G.40", tipo: "sm", nivel: 3,
    repaso: "i0",
    figura: "triangulosBD",
    enunciado: "Lee la demostración. ¿Cuál es la razón del paso 5?",
    demostracion: {
      dado: "BD biseca ∠ABC; AB ≅ CB.",
      probar: "ΔABD ≅ ΔCBD",
      pasos: [
        ["BD biseca ∠ABC", "Dado"],
        ["∠ABD ≅ ∠CBD", "Definición de bisectriz"],
        ["AB ≅ CB", "Dado"],
        ["BD ≅ BD", "Propiedad reflexiva"],
        ["ΔABD ≅ ΔCBD", "LAL"]
      ],
      falta: 4
    },
    opciones: ["LLL", "LAL", "ALA", "AAL"],
    respuesta: 1,
    explicacion: "Hay dos pares de lados congruentes (AB ≅ CB y BD ≅ BD) y el ángulo entre ellos (∠ABD ≅ ∠CBD), en el vértice B donde se unen esos lados. Dos lados y el ángulo comprendido: LAL.",
    pista: "Cuenta los lados y los ángulos de los pasos 2, 3 y 4. ¿El ángulo está entre los dos lados?",
    error: "Elegir LLL: solo se demostraron dos pares de lados, no tres.",
    distractores: ["LLL necesita tres pares de lados. La demostración tiene dos pares de lados (pasos 3 y 4) y un par de ángulos (paso 2).", null, "ALA necesita dos pares de ángulos. Aquí solo hay uno: ∠ABD ≅ ∠CBD.", "AAL también necesita dos pares de ángulos; la demostración solo tiene uno."],
    etiquetas: ["prueba", "dos columnas", "criterios"]
  },
  {
    id: "M2-11", modulo: "M2", indicador: "ES.G.46", tipo: "sm", nivel: 3,
    repaso: "i2",
    figura: "triangulosBD",
    enunciado: "Lee la demostración. ¿Cuál es la razón del paso 6?",
    demostracion: {
      dado: "BD biseca ∠ABC; AB ≅ CB.",
      probar: "AD ≅ CD",
      pasos: [
        ["BD biseca ∠ABC", "Dado"],
        ["∠ABD ≅ ∠CBD", "Definición de bisectriz"],
        ["AB ≅ CB", "Dado"],
        ["BD ≅ BD", "Propiedad reflexiva"],
        ["ΔABD ≅ ΔCBD", "LAL"],
        ["AD ≅ CD", "CPCTC"]
      ],
      falta: 5
    },
    opciones: [
      "Definición de punto medio",
      "LAL",
      "CPCTC (partes correspondientes de triángulos congruentes son congruentes)",
      "Propiedad reflexiva"
    ],
    respuesta: 2,
    explicacion: "En el paso 5 ya se demostró que los triángulos son congruentes. AD y CD son partes correspondientes de esos triángulos, así que son congruentes por CPCTC.",
    pista: "¿Qué ya sabes en el paso 5? Usa ese resultado para hablar de una parte de los triángulos.",
    error: "Repetir LAL: LAL prueba que los triángulos son congruentes; para pasar a una parte específica se usa CPCTC.",
    distractores: ["Que D sea el punto medio de AC no es un dato. De hecho, eso es lo que la demostración concluye al probar AD ≅ CD.", "LAL ya se usó en el paso 5 para los triángulos completos. No concluye nada sobre un lado por sí solo.", null, "La propiedad reflexiva solo dice que algo es congruente consigo mismo. AD y CD son segmentos distintos."],
    etiquetas: ["prueba", "dos columnas", "cpctc"]
  },
  {
    id: "M2-12", modulo: "M2", indicador: "ES.G.39", tipo: "sm", nivel: 3,
    repaso: "i4",
    figura: "corbata",
    enunciado: "En la figura, AD y BC se cortan en E. Lee la demostración. ¿Cuál es la razón del paso 2?",
    demostracion: {
      dado: "AB ∥ CD; E es el punto medio de BC.",
      probar: "ΔABE ≅ ΔDCE",
      pasos: [
        ["AB ∥ CD", "Dado"],
        ["∠ABE ≅ ∠DCE", "Alternos internos entre paralelas"],
        ["E es el punto medio de BC", "Dado"],
        ["BE ≅ CE", "Definición de punto medio"],
        ["∠AEB ≅ ∠DEC", "Los ángulos opuestos por el vértice son congruentes"],
        ["ΔABE ≅ ΔDCE", "ALA"]
      ],
      falta: 1
    },
    opciones: [
      "Si dos rectas paralelas son cortadas por una transversal, los ángulos alternos internos son congruentes",
      "Si dos rectas paralelas son cortadas por una transversal, los ángulos correspondientes son congruentes",
      "Los ángulos opuestos por el vértice son congruentes",
      "Definición de punto medio"
    ],
    respuesta: 0,
    explicacion: "BC es una transversal que corta las paralelas AB y CD. ∠ABE y ∠DCE están entre las paralelas y en lados opuestos de la transversal: son alternos internos, y por eso son congruentes.",
    pista: "Ubica la transversal BC. ¿Los dos ángulos están entre las paralelas? ¿Del mismo lado de BC o en lados opuestos?",
    error: "Elegir «correspondientes»: los correspondientes están del mismo lado de la transversal, uno dentro y otro fuera de las paralelas.",
    distractores: [null, "Los correspondientes están del mismo lado de la transversal y en la misma posición en cada cruce. ∠ABE y ∠DCE están entre las paralelas y en lados opuestos: son alternos internos.", "Esa es la razón del paso 5. ∠ABE y ∠DCE no comparten vértice: uno está en B y el otro en C.", "La definición de punto medio habla de segmentos (paso 4), no de ángulos."],
    etiquetas: ["prueba", "dos columnas", "paralelas"]
  },
  {
    id: "M2-13", modulo: "M2", indicador: "ES.G.40", tipo: "sm", nivel: 3,
    repaso: "i0",
    figura: "corbata",
    enunciado: "En la figura, AD y BC se cortan en E. Lee la demostración. ¿Cuál es la razón del paso 6?",
    demostracion: {
      dado: "AB ∥ CD; E es el punto medio de BC.",
      probar: "ΔABE ≅ ΔDCE",
      pasos: [
        ["AB ∥ CD", "Dado"],
        ["∠ABE ≅ ∠DCE", "Si dos rectas paralelas son cortadas por una transversal, los ángulos alternos internos son congruentes"],
        ["E es el punto medio de BC", "Dado"],
        ["BE ≅ CE", "Definición de punto medio"],
        ["∠AEB ≅ ∠DEC", "Los ángulos opuestos por el vértice son congruentes"],
        ["ΔABE ≅ ΔDCE", "ALA"]
      ],
      falta: 5
    },
    opciones: ["LAL", "ALA", "LLL", "AA"],
    respuesta: 1,
    explicacion: "Los pasos 2, 4 y 5 dan un ángulo en B, el lado BE y un ángulo en E (y sus correspondientes en C). El lado BE está entre los ángulos B y E. Dos ángulos y el lado comprendido: ALA.",
    pista: "Haz una lista: ¿cuántos ángulos y cuántos lados se probaron? Luego mira dónde está el lado respecto de los ángulos.",
    error: "Elegir AA: AA prueba semejanza (misma forma), no congruencia.",
    distractores: ["LAL necesita dos pares de lados. La demostración solo tiene un par de lados (BE ≅ CE) y dos pares de ángulos.", null, "LLL necesita tres pares de lados; aquí solo hay uno.", "AA es un criterio de semejanza: prueba la misma forma, no el mismo tamaño. Con un lado entre los dos ángulos, la congruencia se justifica con ALA."],
    etiquetas: ["prueba", "dos columnas", "criterios"]
  },
  {
    id: "M3-09", modulo: "M3", indicador: "ES.G.47", tipo: "sm", nivel: 3,
    repaso: "i2",
    figura: "trianguloParalela",
    enunciado: "Lee la demostración. ¿Cuál es la razón del paso 4?",
    demostracion: {
      dado: "DE ∥ BC, con D en AB y E en AC.",
      probar: "ΔADE ~ ΔABC",
      pasos: [
        ["DE ∥ BC", "Dado"],
        ["∠ADE ≅ ∠ABC", "Si dos rectas paralelas son cortadas por una transversal, los ángulos correspondientes son congruentes"],
        ["∠A ≅ ∠A", "Propiedad reflexiva"],
        ["ΔADE ~ ΔABC", "AA"]
      ],
      falta: 3
    },
    opciones: ["AA", "ALA", "LLL de semejanza", "Definición de triángulos semejantes"],
    respuesta: 0,
    explicacion: "Los pasos 2 y 3 dan dos pares de ángulos congruentes. Dos pares de ángulos bastan para concluir que los triángulos son semejantes: criterio AA.",
    pista: "Cuenta qué se ha probado: ¿lados o ángulos? ¿Cuántos?",
    error: "Elegir «definición de triángulos semejantes»: la definición exige todos los ángulos congruentes y todos los lados proporcionales, y aquí no se probaron lados.",
    distractores: [null, "ALA es un criterio de congruencia y además necesita un lado. Aquí no se probó ningún lado, y los triángulos no tienen el mismo tamaño.", "LLL de semejanza necesita que los tres pares de lados sean proporcionales. La demostración no menciona lados.", "La definición exige todos los ángulos congruentes y todos los lados proporcionales. Solo se probaron dos ángulos; el criterio que permite concluir con eso es AA."],
    etiquetas: ["prueba", "dos columnas", "semejanza"]
  },
  {
    id: "M5-10", modulo: "M5", indicador: "ES.G.43", tipo: "sm", nivel: 2,
    repaso: "i5",
    figura: "circuloRadios",
    enunciado: "Lee la demostración. ¿Cuál es la razón del paso 2?",
    demostracion: {
      dado: "O es el centro del círculo; A y B son puntos del círculo.",
      probar: "ΔAOB es isósceles",
      pasos: [
        ["O es el centro; A y B están en el círculo", "Dado"],
        ["OA ≅ OB", "Todos los radios de un mismo círculo son congruentes"],
        ["ΔAOB es isósceles", "Definición de triángulo isósceles"]
      ],
      falta: 1
    },
    opciones: [
      "Todos los radios de un mismo círculo son congruentes",
      "Propiedad reflexiva",
      "Definición de cuerda",
      "Un ángulo inscrito mide la mitad de su arco"
    ],
    respuesta: 0,
    explicacion: "OA y OB van del centro a puntos del círculo: los dos son radios. Todos los radios de un mismo círculo miden lo mismo, así que OA ≅ OB.",
    pista: "¿Cómo se llaman los segmentos que van del centro a un punto del círculo?",
    error: "Elegir «definición de cuerda» porque AB es una cuerda; OA y OB son radios, no cuerdas.",
    distractores: [null, "La propiedad reflexiva dice que un segmento es congruente consigo mismo. OA y OB son dos segmentos distintos.", "Una cuerda une dos puntos del círculo, como AB. OA y OB salen del centro: son radios.", "Esa relación es entre ángulos inscritos y arcos. El paso habla de dos segmentos, no de un ángulo."],
    etiquetas: ["prueba", "dos columnas", "círculos"]
  },
  {
    id: "M6-10", modulo: "M6", indicador: "ES.N.9", tipo: "sm", nivel: 2,
    repaso: "i5",
    enunciado: "Lee la demostración algebraica. ¿Cuál es la razón del paso 3?",
    demostracion: {
      dado: "3(x − 2) = 12",
      probar: "x = 6",
      pasos: [
        ["3(x − 2) = 12", "Dado"],
        ["3x − 6 = 12", "Propiedad distributiva"],
        ["3x = 18", "Propiedad de suma de la igualdad"],
        ["x = 6", "Propiedad de división de la igualdad"]
      ],
      falta: 2
    },
    opciones: ["Propiedad de suma de la igualdad", "Propiedad distributiva", "Propiedad de división de la igualdad", "Propiedad conmutativa"],
    respuesta: 0,
    explicacion: "Del paso 2 al 3 se sumó 6 a ambos lados: 3x − 6 + 6 = 12 + 6. Sumar el mismo número a los dos lados conserva la igualdad: propiedad de suma de la igualdad.",
    pista: "Compara el paso 2 con el 3: ¿qué número desapareció y qué operación se hizo en los dos lados?",
    error: "Decir que el −6 «pasó al otro lado» sin nombrar la operación: lo que se hizo fue sumar 6 a ambos lados.",
    distractores: [null, "La distributiva se usó en el paso 2 para quitar el paréntesis. Del paso 2 al 3 ya no hay paréntesis: se sumó 6 a ambos lados.", "La división de la igualdad se usa en el paso 4, al dividir ambos lados entre 3.", "La conmutativa cambia el orden de los términos. Aquí no se reordenó nada: se sumó 6 a ambos lados."],
    etiquetas: ["prueba", "dos columnas", "propiedades"]
  },

  /* ================= M0 · BASE (repaso de grados anteriores) =================
     No cuenta en la prueba: no entra en la mezcla, el diagnóstico ni el simulacro. */
  {
    id: "M0-01", modulo: "M0", indicador: "Base · Enteros", tipo: "sm", nivel: 1,
    repaso: "i0",
    enunciado: "¿Cuánto es −7 + 12?",
    opciones: ["5", "−5", "19", "−19"],
    respuesta: 0,
    explicacion: "Los signos son distintos: resta los valores absolutos (12 − 7 = 5) y usa el signo del número con mayor valor absoluto. Ese es 12, que es positivo. Resultado: 5.",
    pista: "En una recta numérica, empieza en −7 y camina 12 pasos hacia la derecha.",
    error: "Usar el signo del primer número aunque el otro tenga mayor valor absoluto.",
    distractores: [null, "Usaste el signo de −7, pero 12 tiene mayor valor absoluto: el resultado es positivo.", "Sumaste 7 + 12 como si los dos fueran positivos. Con signos distintos, los valores absolutos se restan.", "Sumaste los valores absolutos y pusiste signo negativo. Con signos distintos, los valores absolutos se restan."],
    etiquetas: ["base", "enteros"]
  },
  {
    id: "M0-02", modulo: "M0", indicador: "Base · Enteros", tipo: "sm", nivel: 2,
    repaso: "i0",
    enunciado: "¿Cuánto es (−6) · (−4) ÷ (−3)?",
    opciones: ["−8", "8", "−72", "−13"],
    respuesta: 0,
    explicacion: "De izquierda a derecha: (−6) · (−4) = 24, porque los signos son iguales. Luego 24 ÷ (−3) = −8, porque los signos son distintos.",
    pista: "Ve de izquierda a derecha y decide el signo en cada paso: signos iguales dan positivo; distintos, negativo.",
    error: "Perder el signo en el segundo paso: 24 ÷ (−3) es negativo.",
    distractores: [null, "El 8 está bien, pero el signo no: 24 es positivo y −3 es negativo, así que 24 ÷ (−3) es negativo.", "Multiplicaste por −3 en lugar de dividir: 24 · (−3) = −72.", "Sumaste los tres números: −6 − 4 − 3 = −13. El ítem pide multiplicar y luego dividir."],
    etiquetas: ["base", "enteros"]
  },
  {
    id: "M0-03", modulo: "M0", indicador: "Base · Operaciones", tipo: "num", nivel: 1,
    repaso: "i1",
    enunciado: "Calcula: 18 − 4 · 3 + 6 ÷ 2",
    respuesta: 9, tolerancia: 0.01, unidad: "",
    explicacion: "Primero multiplicación y división: 4 · 3 = 12 y 6 ÷ 2 = 3. Luego suma y resta de izquierda a derecha: 18 − 12 + 3 = 9.",
    pista: "Antes de sumar o restar, resuelve 4 · 3 y 6 ÷ 2.",
    error: "Operar de izquierda a derecha sin prioridad: 18 − 4 = 14, · 3 = 42, + 6 = 48, ÷ 2 = 24.",
    etiquetas: ["base", "orden de operaciones"]
  },
  {
    id: "M0-04", modulo: "M0", indicador: "Base · Operaciones", tipo: "sm", nivel: 2,
    repaso: "i1",
    enunciado: "¿Cuál es el valor de 2 · (5 − 3)² + 1?",
    opciones: ["9", "17", "5", "33"],
    respuesta: 0,
    explicacion: "Paréntesis: 5 − 3 = 2. Potencia: 2² = 4. Multiplicación: 2 · 4 = 8. Suma: 8 + 1 = 9.",
    pista: "Orden: paréntesis, potencia, multiplicación y, al final, la suma.",
    error: "Multiplicar antes de elevar al cuadrado.",
    distractores: [null, "Multiplicaste 2 · 2 = 4 y luego elevaste al cuadrado. La potencia va antes que la multiplicación: 2² = 4 y después 2 · 4 = 8.", "Olvidaste el exponente: (5 − 3)² = 2² = 4, no 2.", "Elevaste cada número por separado: 5² − 3² = 16. Primero se resuelve el paréntesis (5 − 3 = 2) y después se eleva: 2² = 4."],
    etiquetas: ["base", "orden de operaciones"]
  },
  {
    id: "M0-05", modulo: "M0", indicador: "Base · Fracciones", tipo: "sm", nivel: 2,
    repaso: "i2",
    enunciado: "¿Cuánto es 2/3 + 1/4?",
    opciones: ["11/12", "3/7", "3/12", "1/6"],
    respuesta: 0,
    explicacion: "El denominador común de 3 y 4 es 12. 2/3 = 8/12 y 1/4 = 3/12. Entonces 8/12 + 3/12 = 11/12.",
    pista: "Escribe las dos fracciones con denominador 12 antes de sumar.",
    error: "Sumar numeradores con numeradores y denominadores con denominadores.",
    distractores: [null, "Sumaste numeradores (2 + 1) y denominadores (3 + 4). Las fracciones solo se suman cuando tienen el mismo denominador.", "Usaste el denominador común 12, pero no convertiste los numeradores: 2/3 = 8/12 y 1/4 = 3/12.", "Multiplicaste: 2/3 · 1/4 = 2/12 = 1/6. El ítem pide sumar."],
    etiquetas: ["base", "fracciones"]
  },
  {
    id: "M0-06", modulo: "M0", indicador: "Base · Por cientos", tipo: "num", nivel: 1,
    repaso: "f1",
    enunciado: "Un par de tenis cuesta $80 y tiene 15 % de descuento. ¿Cuántos dólares se descuentan?",
    respuesta: 12, tolerancia: 0.01, unidad: "dólares",
    explicacion: "15 % = 15 ÷ 100 = 0.15. Entonces 0.15 · 80 = 12. Se descuentan $12, y el precio final es $68.",
    pista: "Convierte 15 % a decimal (divide entre 100) y multiplícalo por 80.",
    error: "Restar 80 − 15 = 65, como si el 15 % fueran $15.",
    etiquetas: ["base", "por cientos"]
  },
  {
    id: "M0-07", modulo: "M0", indicador: "Base · Fracciones", tipo: "sm", nivel: 1,
    repaso: "i2",
    enunciado: "¿Cuál número <strong>no</strong> es igual a 3/5?",
    opciones: ["0.6", "60 %", "6/10", "0.35"],
    respuesta: 3,
    explicacion: "3/5 = 3 ÷ 5 = 0.6 = 60 % = 6/10. El número 0.35 tiene los dígitos 3 y 5, pero 0.35 = 35/100 = 7/20, que no es 3/5.",
    pista: "Divide 3 ÷ 5 y compara cada opción con ese decimal.",
    error: "Pensar que 3/5 se escribe 0.35 porque tiene los dígitos 3 y 5.",
    distractores: ["0.6 sí es igual: 3 ÷ 5 = 0.6.", "60 % sí es igual: 0.6 · 100 = 60 %.", "6/10 sí es igual: es 3/5 con numerador y denominador multiplicados por 2.", null],
    etiquetas: ["base", "fracciones", "decimales"]
  },
  {
    id: "M0-08", modulo: "M0", indicador: "Base · Proporciones", tipo: "num", nivel: 1,
    repaso: "f0",
    enunciado: "Resuelve la proporción: x/8 = 15/24",
    respuesta: 5, tolerancia: 0.01, unidad: "",
    explicacion: "Productos cruzados: 24 · x = 8 · 15 = 120. Divide entre 24: x = 5. Comprueba: 5/8 = 0.625 y 15/24 = 0.625.",
    pista: "Multiplica en cruz: x por 24, y 8 por 15.",
    error: "Multiplicar en línea recta (x · 15 = 8 · 24) y obtener 12.8.",
    etiquetas: ["base", "proporciones"]
  },
  {
    id: "M0-09", modulo: "M0", indicador: "Base · Proporciones", tipo: "sm", nivel: 2,
    repaso: "i3",
    enunciado: "En un mapa, 2 cm representan 5 km. Dos pueblos están a 7 cm en el mapa. ¿Cuál es la distancia real entre ellos?",
    opciones: ["17.5 km", "14 km", "35 km", "2.8 km"],
    respuesta: 0,
    explicacion: "Plantea 2/5 = 7/x (centímetros sobre kilómetros). Productos cruzados: 2x = 35, así que x = 17.5 km. Otra forma: 1 cm son 2.5 km, y 7 · 2.5 = 17.5.",
    pista: "Escribe dos razones con las unidades en el mismo lugar: cm/km = cm/km.",
    error: "Invertir la razón o ignorar uno de los datos de la escala.",
    distractores: [null, "Multiplicaste 7 · 2. El 2 son centímetros del mapa, no kilómetros.", "Multiplicaste 7 · 5 como si 1 cm fueran 5 km. La escala dice que 2 cm son 5 km, así que 1 cm son 2.5 km.", "Invertiste la razón: 7 · 2 ÷ 5. Pon los centímetros arriba en las dos razones: 2/5 = 7/x."],
    etiquetas: ["base", "proporciones", "escala"]
  },
  {
    id: "M0-10", modulo: "M0", indicador: "Base · Ecuaciones", tipo: "sm", nivel: 1,
    repaso: "i4",
    enunciado: "Resuelve: 4x − 7 = 21",
    opciones: ["7", "3.5", "112", "28"],
    respuesta: 0,
    explicacion: "Suma 7 a los dos lados: 4x = 28. Divide entre 4: x = 7. Comprueba: 4 · 7 − 7 = 21.",
    pista: "Deshaz primero la resta (suma 7) y después la multiplicación (divide entre 4).",
    error: "Deshacer la resta restando en vez de sumando.",
    distractores: [null, "Restaste 7 en los dos lados, pero un −7 se deshace sumando 7: queda 4x = 28.", "Multiplicaste 28 por 4. Para deshacer «4 por x» se divide entre 4.", "Llegaste a 4x = 28, pero faltó dividir entre 4."],
    etiquetas: ["base", "ecuaciones"]
  },
  {
    id: "M0-11", modulo: "M0", indicador: "Base · Ecuaciones", tipo: "num", nivel: 2,
    repaso: "i4",
    enunciado: "Resuelve: 5x + 3 = 2x + 18",
    respuesta: 5, tolerancia: 0.01, unidad: "",
    explicacion: "Resta 2x a los dos lados: 3x + 3 = 18. Resta 3: 3x = 15. Divide entre 3: x = 5. Comprueba: 5 · 5 + 3 = 28 y 2 · 5 + 18 = 28.",
    pista: "Junta las x en un solo lado: resta 2x a los dos lados.",
    error: "Sumar 2x en vez de restarlo y llegar a 7x + 3 = 18.",
    etiquetas: ["base", "ecuaciones"]
  },
  {
    id: "M0-12", modulo: "M0", indicador: "Base · Plano cartesiano", tipo: "sm", nivel: 1,
    repaso: "i5",
    enunciado: "¿En cuál cuadrante está el punto (−4, 3)?",
    opciones: ["I", "II", "III", "IV"],
    respuesta: 1,
    explicacion: "x = −4: cuatro unidades a la izquierda. y = 3: tres unidades hacia arriba. Izquierda y arriba es el cuadrante II, con signos (−, +).",
    pista: "x dice izquierda o derecha; y dice arriba o abajo. El cuadrante I está arriba a la derecha y se cuenta en sentido contrario a las manecillas del reloj.",
    error: "Confundir los cuadrantes II y IV.",
    distractores: ["En el cuadrante I las dos coordenadas son positivas. Aquí x = −4 es negativa.", null, "En el cuadrante III las dos coordenadas son negativas. Aquí y = 3 es positiva.", "El cuadrante IV es (+, −): x positiva y y negativa. Aquí es al revés."],
    etiquetas: ["base", "plano cartesiano"]
  },
  {
    id: "M0-13", modulo: "M0", indicador: "Base · Plano cartesiano", tipo: "sm", nivel: 1,
    repaso: "i5",
    enunciado: "Un punto está 2 unidades a la derecha del origen y 5 unidades hacia abajo. ¿Cuál par ordenado lo describe?",
    opciones: ["(2, −5)", "(−5, 2)", "(−2, 5)", "(5, −2)"],
    respuesta: 0,
    explicacion: "Derecha es x positiva: x = 2. Abajo es y negativa: y = −5. El par es (2, −5).",
    pista: "El par ordenado es (horizontal, vertical).",
    error: "Escribir primero el movimiento vertical.",
    distractores: [null, "Invertiste el orden: primero va x (horizontal) y después y (vertical).", "Los signos están al revés: derecha es x positiva y abajo es y negativa.", "Intercambiaste las distancias: 2 es la horizontal (x) y 5 la vertical (y)."],
    etiquetas: ["base", "plano cartesiano"]
  },
  {
    id: "M0-14", modulo: "M0", indicador: "Base · Área", tipo: "num", nivel: 1,
    repaso: "f3",
    enunciado: "Un triángulo tiene base 10 cm y altura 7 cm. ¿Cuál es su área?",
    respuesta: 35, tolerancia: 0.01, unidad: "cm²",
    explicacion: "Área del triángulo = b · h ÷ 2 = 10 · 7 ÷ 2 = 70 ÷ 2 = 35 cm².",
    pista: "Un triángulo es la mitad de un rectángulo con la misma base y la misma altura.",
    error: "Olvidar dividir entre 2 y obtener 70 cm².",
    etiquetas: ["base", "área"]
  },

  /* ============ v1.4: ítems para completar 4 por destreza ============ */
  {
    id: "M0-15", modulo: "M0", indicador: "Base · Fracciones", tipo: "sm", nivel: 2,
    repaso: "f2",
    enunciado: "¿Cuánto es 3/4 ÷ 1/2?",
    opciones: ["3/2", "3/8", "2/3", "1/4"],
    respuesta: 0,
    explicacion: "Dividir entre 1/2 es multiplicar por su recíproco, 2/1: 3/4 · 2/1 = 6/4 = 3/2 (o 1.5). Tiene sentido: en 3/4 caben más de un medio.",
    pista: "Cambia la división por una multiplicación y voltea la segunda fracción.",
    error: "Multiplicar sin voltear la segunda fracción.",
    distractores: [null, "Multiplicaste 3/4 · 1/2 sin voltear la segunda fracción. Para dividir, se multiplica por el recíproco: 2/1.", "Volteaste la primera fracción (4/3 · 1/2 = 2/3). La que se voltea es la segunda.", "Restaste: 3/4 − 1/2 = 1/4. El ítem pide dividir."],
    etiquetas: ["base", "fracciones"]
  },
  {
    id: "M0-16", modulo: "M0", indicador: "Base · Plano cartesiano", tipo: "num", nivel: 2,
    repaso: "f3",
    enunciado: "Un rectángulo tiene vértices en (1, 2), (6, 2), (6, 5) y (1, 5). ¿Cuál es su área?",
    respuesta: 15, tolerancia: 0.01, unidad: "u²",
    explicacion: "Base: de x = 1 a x = 6 hay 6 − 1 = 5 unidades. Altura: de y = 2 a y = 5 hay 5 − 2 = 3 unidades. Área = b · h = 5 · 3 = 15 u².",
    pista: "La base es la diferencia de las x y la altura es la diferencia de las y.",
    error: "Sumar los lados: 2(5 + 3) = 16 es el perímetro, no el área.",
    etiquetas: ["base", "plano cartesiano", "área"]
  },
  {
    id: "M2-16", modulo: "M2", indicador: "ES.G.39", tipo: "num", nivel: 2,
    repaso: "i4",
    enunciado: "Dos rectas paralelas son cortadas por una transversal. Un ángulo mide (3x + 10)° y su ángulo alterno interno mide (5x − 30)°. ¿Cuántos grados mide cada uno de esos ángulos?",
    respuesta: 70, tolerancia: 0.01, unidad: "°",
    explicacion: "Entre paralelas, los ángulos alternos internos son congruentes: 3x + 10 = 5x − 30. Resta 3x y suma 30: 40 = 2x, así que x = 20. Cada ángulo mide 3(20) + 10 = 70°. Comprueba: 5(20) − 30 = 70°.",
    pista: "Los alternos internos entre paralelas miden lo mismo: iguala las dos expresiones.",
    error: "Contestar x = 20 en vez de la medida del ángulo, o sumar las expresiones a 180° como si fueran suplementarios.",
    etiquetas: ["paralelas", "ángulos", "ecuaciones"]
  },
  {
    id: "M5-11", modulo: "M5", indicador: "ES.G.43", tipo: "sm", nivel: 2,
    repaso: "i3",
    enunciado: "Desde un punto P fuera de un círculo de centro O se traza el segmento tangente PT. El radio mide 5 cm y PT mide 12 cm. ¿Cuál es la distancia OP?",
    opciones: ["13 cm", "17 cm", "7 cm", "√119 cm"],
    respuesta: 0,
    explicacion: "La tangente es perpendicular al radio en T, así que OTP es un triángulo rectángulo con hipotenusa OP. OP² = 5² + 12² = 25 + 144 = 169, y OP = 13 cm.",
    pista: "¿Qué ángulo forman la tangente y el radio en T? Con ese ángulo, usa el teorema de Pitágoras.",
    error: "Sumar o restar los lados en lugar de usar el teorema de Pitágoras.",
    distractores: [null, "Sumaste 5 + 12. Los lados de un triángulo rectángulo se relacionan con Pitágoras, no con una suma.", "Restaste 12 − 5. OP es la hipotenusa: es el lado más largo.", "Restaste los cuadrados: 12² − 5² = 119. OP es la hipotenusa, así que los cuadrados de los catetos se suman."],
    etiquetas: ["tangente", "pitágoras"]
  },
  {
    id: "M6-12", modulo: "M6", indicador: "ES.N.9", tipo: "num", nivel: 2,
    repaso: "i4",
    enunciado: "Evalúa 3a² − 2ab si a = −2 y b = 5.",
    respuesta: 32, tolerancia: 0.01, unidad: "",
    explicacion: "Sustituye con paréntesis: 3(−2)² − 2(−2)(5). (−2)² = 4, así que 3 · 4 = 12. 2(−2)(5) = −20. Entonces 12 − (−20) = 12 + 20 = 32.",
    pista: "Escribe cada valor entre paréntesis: 3(−2)² − 2(−2)(5).",
    error: "Elevar sin paréntesis: −2² = −4 en vez de (−2)² = 4, y obtener 8.",
    etiquetas: ["expresiones", "sustitución"]
  },
  {
    id: "M6-13", modulo: "M6", indicador: "ES.E.58", tipo: "sm", nivel: 1,
    repaso: "i3",
    enunciado: "En una bolsa hay 5 canicas rojas, 3 verdes y 2 azules. Se saca una canica al azar. ¿Cuál es la probabilidad de que <strong>no</strong> sea roja?",
    opciones: ["1/2", "3/10", "1/5", "1/3"],
    respuesta: 0,
    explicacion: "Las que no son rojas son 3 verdes + 2 azules = 5 de 10 canicas. P = 5/10 = 1/2. También: 1 − P(roja) = 1 − 5/10 = 1/2.",
    pista: "Cuenta todas las canicas que no son rojas y divide entre el total.",
    error: "Contar solo un color, o contar colores en vez de canicas.",
    distractores: [null, "3/10 cuenta solo las verdes. «No roja» incluye las verdes y las azules: 3 + 2 = 5.", "1/5 = 2/10 cuenta solo las azules. «No roja» incluye las verdes y las azules.", "Contaste colores (1 de 3), no canicas. Cada color tiene una cantidad distinta de canicas."],
    etiquetas: ["probabilidad", "complemento"]
  },

  /* ================= v1.7 · 37 ÍTEMS NUEVOS =================
     Prioridad: nivel 1 en M2, M3 y M4, y destrezas que tenían menos de
     4 ítems fijos (M3b, M4b, M5a, M6b, M6c). Verificados a mano. */

  /* ---------- M1 ---------- */
  {
    id: "M1-10", modulo: "M1", indicador: "ES.G.44", tipo: "sm", nivel: 2,
    repaso: "i3",
    enunciado: "Para construir el círculo que pasa por los tres vértices de un triángulo (el círculo circunscrito), ¿dónde se coloca la punta del compás?",
    opciones: ["En el punto donde se cortan las bisectrices de los ángulos", "En el punto donde se cortan las mediatrices de los lados", "En el punto medio del lado más largo", "En uno de los tres vértices"],
    respuesta: 1,
    explicacion: "El centro tiene que estar a la misma distancia de los tres vértices. Cada punto de la mediatriz de un lado equidista de los extremos de ese lado. Por eso el punto donde se cortan las tres mediatrices (el circuncentro) equidista de los tres vértices y es el centro del círculo circunscrito.",
    pista: "El centro debe quedar a la misma distancia de los tres vértices. ¿Qué recta reúne los puntos que equidistan de los extremos de un segmento?",
    error: "Confundir el incentro (bisectrices, círculo inscrito) con el circuncentro (mediatrices, círculo circunscrito).",
    distractores: ["Ese punto es el incentro. Equidista de los tres lados, no de los tres vértices: es el centro del círculo inscrito, el que queda por dentro tocando los lados.", null, "El punto medio del lado más largo solo sirve en un triángulo rectángulo. En general, no queda a la misma distancia del tercer vértice.", "Si la punta está en un vértice, ese vértice es el centro: el círculo queda alrededor de él y no pasa por él."],
    etiquetas: ["construcciones", "circuncentro"]
  },
  {
    id: "M1-11", modulo: "M1", indicador: "ES.G.36", tipo: "sm", nivel: 1,
    repaso: "i0",
    enunciado: "¿Cuál objeto representa mejor una recta?",
    opciones: ["La esquina de una mesa, donde se unen tres bordes", "Un hilo bien estirado entre dos postes", "La superficie de un espejo", "El interior de una caja"],
    respuesta: 1,
    explicacion: "Una recta tiene una sola dimensión: el largo. Un hilo estirado es delgado y derecho, así que modela una recta (en realidad, un pedazo de recta: un segmento).",
    pista: "Piensa en las dimensiones: ¿cuál objeto tiene largo, pero casi nada de ancho ni de alto?",
    error: "Confundir recta (una dimensión) con plano (dos) o con espacio (tres).",
    distractores: ["La esquina es un lugar sin tamaño: modela un punto, que no tiene dimensiones.", null, "Una superficie lisa tiene largo y ancho: modela un plano, que tiene dos dimensiones.", "El interior de una caja tiene largo, ancho y alto: modela el espacio, que tiene tres dimensiones."],
    etiquetas: ["vocabulario", "recta"]
  },

  /* ---------- M2 ---------- */
  {
    id: "M2-17", modulo: "M2", indicador: "ES.G.40", tipo: "sm", nivel: 1,
    repaso: "i1",
    enunciado: "Si ΔABC ≅ ΔDEF, ¿cuál lado de ΔDEF es congruente con BC?",
    opciones: ["DE", "DF", "EF", "AC"],
    respuesta: 2,
    explicacion: "El orden de las letras dice qué vértices se corresponden: A↔D, B↔E y C↔F. El lado BC une la segunda y la tercera letra de ΔABC, así que corresponde al lado que une la segunda y la tercera letra de ΔDEF: EF.",
    pista: "Alinea las letras: A↔D, B↔E, C↔F. ¿Qué letras de ΔDEF corresponden a B y a C?",
    error: "Emparejar los lados por su posición en el dibujo y no por el orden de las letras.",
    distractores: ["DE corresponde a AB (primera y segunda letra de cada triángulo).", "DF corresponde a AC (primera y tercera letra).", null, "AC es un lado del mismo ΔABC. La pregunta pide un lado de ΔDEF."],
    etiquetas: ["congruencia", "correspondencia"]
  },
  {
    id: "M2-18", modulo: "M2", indicador: "ES.G.40", tipo: "sm", nivel: 1,
    repaso: "i1",
    enunciado: "Dos triángulos son congruentes. ¿Qué significa eso?",
    opciones: ["Tienen la misma forma, pero pueden tener distinto tamaño", "Tienen la misma forma y el mismo tamaño", "Tienen el mismo perímetro, aunque sus lados sean distintos", "Tienen por lo menos un ángulo igual"],
    respuesta: 1,
    explicacion: "Congruentes quiere decir que uno se puede colocar exactamente sobre el otro: todos los lados correspondientes miden lo mismo y todos los ángulos correspondientes también. Misma forma y mismo tamaño.",
    pista: "Si recortas uno de los triángulos, ¿tiene que caber exactamente encima del otro?",
    error: "Confundir congruencia (misma forma y tamaño) con semejanza (solo misma forma).",
    distractores: ["Eso describe figuras semejantes. Las congruentes, además, tienen el mismo tamaño.", null, "Dos triángulos pueden tener el mismo perímetro con lados distintos, por ejemplo 3, 4, 5 y 4, 4, 4. Congruentes exige que cada par de lados correspondientes sea igual.", "Un ángulo igual no basta: dos triángulos muy distintos pueden compartir un ángulo de 90°."],
    etiquetas: ["congruencia", "vocabulario"]
  },
  {
    id: "M2-19", modulo: "M2", indicador: "ES.G.40", tipo: "sm", nivel: 1,
    repaso: "i1",
    figura: "isoscelesTics",
    enunciado: "En la figura, los lados AB y AC tienen una marca cada uno. ¿Qué indican esas marcas?",
    opciones: ["Que AB y AC son paralelos", "Que AB y AC son perpendiculares", "Que AB mide el doble que AC", "Que AB y AC miden lo mismo"],
    respuesta: 3,
    explicacion: "Las rayitas cortas sobre un lado (tics) indican congruencia: los lados con la misma cantidad de marcas miden lo mismo. Aquí AB y AC tienen una marca cada uno, así que AB ≅ AC y el triángulo es isósceles.",
    pista: "En una figura, las flechas marcan paralelas, el cuadradito marca un ángulo recto y las rayitas marcan otra cosa. ¿Qué?",
    error: "Leer las marcas de congruencia como si fueran flechas de paralelas o símbolos de ángulo recto.",
    distractores: ["Las paralelas se marcan con flechas sobre las rectas. Además, AB y AC se cortan en A: no pueden ser paralelas.", "Un ángulo recto se marca con un cuadradito en el vértice. En A no hay ese símbolo.", "Una marca en cada lado quiere decir que miden lo mismo. Las marcas no indican el doble.", null],
    etiquetas: ["congruencia", "figura", "marcas"]
  },
  {
    id: "M2-20", modulo: "M2", indicador: "ES.G.39", tipo: "sm", nivel: 3,
    repaso: "i3",
    enunciado: "Considera: «Si un cuadrilátero tiene sus cuatro lados congruentes, entonces es un cuadrado». ¿Cuál figura es un contraejemplo?",
    opciones: ["Un cuadrado de 5 cm de lado", "Un rectángulo de 4 cm por 6 cm", "Un rombo con ángulos de 60° y 120°", "Un trapecio isósceles"],
    respuesta: 2,
    explicacion: "Un contraejemplo cumple la condición (cuatro lados congruentes) y NO cumple la conclusión (no es cuadrado). El rombo con ángulos de 60° y 120° tiene cuatro lados iguales, pero sus ángulos no son rectos: no es un cuadrado. Eso refuta la proposición.",
    pista: "Busca una figura que SÍ tenga cuatro lados iguales y que, aun así, NO sea un cuadrado.",
    error: "Elegir una figura que confirma la proposición, o una que ni siquiera cumple la condición.",
    distractores: ["El cuadrado cumple la condición y también la conclusión: confirma la proposición, no la refuta.", "El rectángulo de 4 por 6 no tiene cuatro lados congruentes, así que no pone a prueba la proposición.", null, "El trapecio isósceles no tiene cuatro lados congruentes: no cumple la condición."],
    etiquetas: ["lógica", "contraejemplo", "cuadriláteros"]
  },
  {
    id: "M2-21", modulo: "M2", indicador: "ES.G.39", tipo: "num", nivel: 2,
    repaso: "i4",
    enunciado: "Dos rectas paralelas son cortadas por una transversal. Dos ángulos internos del mismo lado de la transversal miden (2x + 20)° y (4x − 20)°. ¿Cuántos grados mide el ángulo mayor?",
    respuesta: 100, tolerancia: 0.01, unidad: "°",
    explicacion: "Entre paralelas, los ángulos internos del mismo lado suman 180°: (2x + 20) + (4x − 20) = 180, así que 6x = 180 y x = 30. Los ángulos miden 2(30) + 20 = 80° y 4(30) − 20 = 100°. El mayor mide 100°.",
    pista: "Los internos del mismo lado no son iguales: son suplementarios. Suma las expresiones e iguala a 180.",
    error: "Igualar las dos expresiones como si fueran alternos internos, o contestar x = 30 en vez de la medida del ángulo.",
    etiquetas: ["paralelas", "ángulos", "ecuaciones"]
  },
  {
    id: "M2-22", modulo: "M2", indicador: "ES.G.39", tipo: "sm", nivel: 2,
    repaso: "i4",
    enunciado: "Una transversal corta dos rectas paralelas. Los ángulos ∠1 y ∠5 son correspondientes, y ∠5 y ∠8 forman un par lineal (están uno al lado del otro sobre una recta). Si m∠1 = 115°, ¿cuánto mide ∠8?",
    opciones: ["115°", "65°", "25°", "245°"],
    respuesta: 1,
    explicacion: "Los correspondientes entre paralelas son congruentes: m∠5 = 115°. Un par lineal suma 180°: m∠8 = 180° − 115° = 65°.",
    pista: "Ve paso a paso: primero halla ∠5 con los correspondientes y luego usa que un par lineal suma 180°.",
    error: "Quedarse en el primer paso y contestar 115°, o restar de 90° en lugar de 180°.",
    distractores: ["115° es la medida de ∠5. Falta el segundo paso: ∠8 y ∠5 suman 180°.", null, "Restaste de 90°: 115 − 90 = 25. Un par lineal suma 180°, no 90°.", "Restaste de 360°: 360 − 115 = 245. Un par lineal está sobre una recta y suma 180°."],
    etiquetas: ["paralelas", "ángulos"]
  },
  {
    id: "M2-23", modulo: "M2", indicador: "ES.G.40", tipo: "sm", nivel: 2,
    repaso: "i0",
    enunciado: "En ΔPQR y ΔSTU se sabe que PQ ≅ ST, QR ≅ TU y ∠R ≅ ∠U. ¿Qué se puede concluir?",
    opciones: ["Son congruentes por LAL", "Son congruentes por LLL", "No se puede asegurar que sean congruentes", "Son congruentes por AAL"],
    respuesta: 2,
    explicacion: "El ángulo que está entre PQ y QR es ∠Q, no ∠R. Dos lados y un ángulo que no está entre ellos (lado-lado-ángulo) no es un criterio de congruencia: con esos datos pueden formarse dos triángulos distintos. No se puede asegurar la congruencia.",
    pista: "Busca el vértice que comparten los dos lados dados. ¿Ese es el ángulo marcado?",
    error: "Ver dos lados y un ángulo y elegir LAL sin comprobar que el ángulo esté entre los lados.",
    distractores: ["LAL necesita el ángulo comprendido entre los dos lados. Entre PQ y QR está ∠Q, pero el dato es ∠R.", "LLL necesita los tres pares de lados. Solo se conocen dos (falta PR con SU).", null, "AAL necesita dos pares de ángulos. Aquí solo se conoce un par (∠R y ∠U)."],
    etiquetas: ["congruencia", "criterios"]
  },
  {
    id: "M2-24", modulo: "M2", indicador: "ES.G.46", tipo: "sm", nivel: 3,
    repaso: "i2",
    figura: "paralelogramoAC",
    enunciado: "Lee la demostración. ¿Cuál es la razón del paso 6?",
    demostracion: {
      dado: "ABCD es un paralelogramo: AB ∥ DC y AD ∥ BC.",
      probar: "AB ≅ CD",
      pasos: [
        ["AB ∥ DC y AD ∥ BC", "Dado"],
        ["∠BAC ≅ ∠DCA", "Ángulos alternos internos (AB ∥ DC)"],
        ["∠BCA ≅ ∠DAC", "Ángulos alternos internos (AD ∥ BC)"],
        ["AC ≅ AC", "Propiedad reflexiva"],
        ["ΔABC ≅ ΔCDA", "ALA"],
        ["AB ≅ CD", "CPCTC"]
      ],
      falta: 5
    },
    opciones: ["ALA", "CPCTC", "Propiedad reflexiva", "Definición de paralelogramo"],
    respuesta: 1,
    explicacion: "En el paso 5 ya se demostró que ΔABC ≅ ΔCDA. AB y CD son partes correspondientes de esos triángulos (A↔C y B↔D), así que son congruentes por CPCTC: partes correspondientes de triángulos congruentes son congruentes.",
    pista: "Mira el paso 5. Si los triángulos ya son congruentes, ¿qué razón permite decir que un par de sus lados también lo es?",
    error: "Repetir el criterio del paso anterior (ALA) para justificar que dos lados son congruentes.",
    distractores: ["ALA justifica que los TRIÁNGULOS son congruentes (paso 5). Para concluir algo sobre un par de lados se usa CPCTC.", null, "La propiedad reflexiva dice que un segmento es congruente consigo mismo, como AC ≅ AC en el paso 4. AB y CD son lados distintos.", "La definición de paralelogramo habla de lados paralelos, no de lados congruentes. Que los lados opuestos miden lo mismo es justo lo que se está demostrando."],
    etiquetas: ["demostración", "cpctc", "paralelogramo"]
  },

  /* ---------- M3 ---------- */
  {
    id: "M3-11", modulo: "M3", indicador: "ES.G.42", tipo: "sm", nivel: 1,
    repaso: "i0",
    enunciado: "Si dos figuras son semejantes, ¿qué se conserva siempre?",
    opciones: ["Las medidas de los ángulos", "Las longitudes de los lados", "El área", "El perímetro"],
    respuesta: 0,
    explicacion: "Semejantes significa misma forma. La forma la dan los ángulos: los ángulos correspondientes son congruentes. Los lados cambian por la razón de semejanza, y con ellos cambian el perímetro y el área.",
    pista: "Una foto ampliada se ve igual pero más grande. ¿Qué no cambia al ampliarla?",
    error: "Creer que semejante conserva las medidas de los lados.",
    distractores: [null, "Los lados se multiplican por la razón de semejanza. Solo miden lo mismo si la razón es 1 (figuras congruentes).", "El área se multiplica por k² (el cuadrado de la razón). Solo se conserva si la razón es 1.", "El perímetro se multiplica por la razón de semejanza. Solo se conserva si la razón es 1."],
    etiquetas: ["semejanza", "vocabulario"]
  },
  {
    id: "M3-12", modulo: "M3", indicador: "ES.G.42", tipo: "sm", nivel: 1,
    repaso: "i0",
    enunciado: "Una foto de 4 × 6 pulgadas se amplía a 8 × 12 pulgadas. ¿Cómo son las dos fotos?",
    opciones: ["Congruentes", "Semejantes, pero no congruentes", "Ni semejantes ni congruentes", "Iguales en área"],
    respuesta: 1,
    explicacion: "Los dos lados se multiplicaron por el mismo número: 8 ÷ 4 = 2 y 12 ÷ 6 = 2. Misma forma (semejantes) con razón 2. Como la razón no es 1, el tamaño cambió: no son congruentes.",
    pista: "Divide cada lado nuevo entre el lado viejo. ¿Da el mismo número las dos veces?",
    error: "Pensar que «se ve igual» quiere decir congruente.",
    distractores: ["Congruentes exige el mismo tamaño. La foto nueva mide el doble en cada lado.", null, "Sí son semejantes: 8 ÷ 4 = 2 y 12 ÷ 6 = 2. La razón es la misma en los dos lados.", "Las áreas son 24 y 96 pulg²: con razón 2, el área se multiplica por 2² = 4."],
    etiquetas: ["semejanza", "vocabulario"]
  },
  {
    id: "M3-13", modulo: "M3", indicador: "ES.G.42", tipo: "sm", nivel: 1,
    repaso: "f0",
    enunciado: "Un triángulo tiene un lado de 5 cm. En un triángulo semejante más grande, el lado correspondiente mide 15 cm. ¿Cuál es la razón de semejanza del triángulo grande al pequeño?",
    opciones: ["10", "1/3", "3", "15"],
    respuesta: 2,
    explicacion: "La razón del grande al pequeño es lado del grande ÷ lado correspondiente del pequeño: 15 ÷ 5 = 3. Cada lado del triángulo grande mide 3 veces su lado correspondiente.",
    pista: "Del grande al pequeño: pon el lado del grande arriba y el del pequeño abajo.",
    error: "Restar los lados en vez de dividirlos, o invertir la razón.",
    distractores: ["Restaste 15 − 5. La razón de semejanza compara con una división, no con una resta.", "1/3 es la razón del pequeño al grande (5 ÷ 15). La pregunta pide del grande al pequeño.", null, "15 es la medida del lado grande, no la razón. Divide entre el lado correspondiente."],
    etiquetas: ["semejanza", "razón"]
  },
  {
    id: "M3-14", modulo: "M3", indicador: "ES.G.42", tipo: "sm", nivel: 2,
    repaso: "i2",
    figura: "semejanzaAA",
    enunciado: "En ΔABC, m∠A = 50° y m∠B = 70°. En ΔDEF, m∠D = 50° y m∠F = 60°. ¿Cuál afirmación es verdadera?",
    opciones: ["ΔABC ~ ΔDEF por AA", "ΔABC ~ ΔDFE por AA", "No son semejantes, porque solo coincide un ángulo dado", "ΔABC ≅ ΔDEF por ALA"],
    respuesta: 0,
    explicacion: "Halla el tercer ángulo de cada triángulo: m∠C = 180° − 50° − 70° = 60° y m∠E = 180° − 50° − 60° = 70°. Entonces A↔D (50°), B↔E (70°) y C↔F (60°). Dos pares de ángulos congruentes bastan: ΔABC ~ ΔDEF por AA.",
    pista: "Los ángulos de un triángulo suman 180°. Calcula el ángulo que falta en cada uno y compara.",
    error: "No calcular el tercer ángulo y concluir que no son semejantes.",
    distractores: [null, "El orden importa: ΔDFE emparejaría B con F, pero ∠B mide 70° y ∠F mide 60°.", "Calcula los terceros ángulos: ∠C = 60° y ∠E = 70°. Así coinciden los tres pares.", "No se conoce ningún lado y los triángulos son de distinto tamaño. Ángulos iguales dan semejanza, no congruencia."],
    etiquetas: ["semejanza", "criterio AA", "figura"]
  },
  {
    id: "M3-15", modulo: "M3", indicador: "ES.G.47", tipo: "num", nivel: 2,
    repaso: "f3",
    figura: "trianguloParalela",
    enunciado: "En ΔABC, DE ∥ BC, con D sobre AB y E sobre AC. Si AD = 5, DB = 10 y EC = 12, ¿cuánto mide AE?",
    respuesta: 6, tolerancia: 0.01, unidad: "",
    explicacion: "Por el teorema de Tales: AD/DB = AE/EC → 5/10 = AE/12. Multiplica en cruz: 10 · AE = 60, así que AE = 6.",
    pista: "Escribe la proporción con los segmentos del mismo lado: AD/DB = AE/EC.",
    error: "Invertir la proporción (5/10 = 12/AE) y obtener AE = 24.",
    etiquetas: ["semejanza", "tales"]
  },
  {
    id: "M3-16", modulo: "M3", indicador: "ES.G.42", tipo: "sm", nivel: 3,
    repaso: "f0",
    enunciado: "Los lados de ΔABC miden 4, 5 y 6. ¿Cuál de estos triángulos es semejante a ΔABC?",
    opciones: ["Lados 6, 7 y 8", "Lados 8, 10 y 12", "Lados 4, 5 y 7", "Lados 5, 6 y 7"],
    respuesta: 1,
    explicacion: "Para ser semejantes, los tres lados se multiplican por el mismo número. 8 ÷ 4 = 2, 10 ÷ 5 = 2 y 12 ÷ 6 = 2: la razón es 2 en los tres pares.",
    pista: "Divide cada lado del otro triángulo entre el lado correspondiente de ΔABC. ¿Da siempre lo mismo?",
    error: "Sumar el mismo número a cada lado en vez de multiplicar por el mismo número.",
    distractores: ["Sumaste 2 a cada lado. La semejanza multiplica: 6 ÷ 4 = 1.5, pero 8 ÷ 6 ≈ 1.33.", null, "Solo cambió un lado. 4/4 = 1 y 5/5 = 1, pero 7/6 no es 1: la razón no es la misma.", "Sumaste 1 a cada lado. Las razones 5/4, 6/5 y 7/6 no son iguales."],
    etiquetas: ["semejanza", "razón"]
  },
  {
    id: "M3-17", modulo: "M3", indicador: "ES.G.47", tipo: "sm", nivel: 3,
    repaso: "i3",
    enunciado: "Tres rectas paralelas cortan dos transversales. En la primera transversal, los segmentos entre las paralelas miden 4 cm y 6 cm. En la segunda, el primer segmento mide 6 cm. ¿Cuánto mide el segundo?",
    opciones: ["9 cm", "8 cm", "4 cm", "12 cm"],
    respuesta: 0,
    explicacion: "Las paralelas dividen las transversales en segmentos proporcionales: 4/6 = 6/x. Multiplica en cruz: 4x = 36, así que x = 9 cm.",
    pista: "Plantea la proporción con los segmentos en el mismo orden en las dos transversales: primero/segundo = primero/segundo.",
    error: "Sumar la diferencia (6 − 4 = 2) en lugar de usar la proporción.",
    distractores: [null, "Sumaste 2 porque de 4 a 6 hay 2. Las paralelas conservan la razón, no la diferencia: 4/6 = 6/x.", "Planteaste la proporción al revés, 4/6 = x/6, y eso da 4. Alinea primero con primero y segundo con segundo: 4/6 = 6/x.", "Duplicaste el 6. La razón entre los segmentos es 6/4 = 1.5, así que el segundo mide 6 × 1.5 = 9."],
    etiquetas: ["semejanza", "tales", "paralelas"]
  },

  /* ---------- M4 ---------- */
  {
    id: "M4-09", modulo: "M4", indicador: "ES.G.41", tipo: "sm", nivel: 1,
    repaso: "i0",
    enunciado: "¿Cuál transformación desliza una figura a otro lugar sin girarla ni voltearla?",
    opciones: ["Reflexión", "Rotación", "Traslación", "Dilatación"],
    respuesta: 2,
    explicacion: "La traslación mueve cada punto la misma distancia en la misma dirección. La figura conserva su tamaño, su forma y su orientación: solo cambia de lugar.",
    pista: "Imagina empujar un libro sobre la mesa sin darle vueltas. ¿Cómo se llama ese movimiento?",
    error: "Confundir los nombres de las transformaciones.",
    distractores: ["La reflexión voltea la figura como en un espejo: invierte su orientación.", "La rotación gira la figura alrededor de un punto.", null, "La dilatación agranda o achica la figura. No es un deslizamiento."],
    etiquetas: ["transformaciones", "vocabulario"]
  },
  {
    id: "M4-10", modulo: "M4", indicador: "ES.G.41", tipo: "sm", nivel: 1,
    repaso: "i1",
    enunciado: "¿Cuál de estas transformaciones cambia el tamaño de la figura?",
    opciones: ["Una traslación", "Una reflexión", "Una rotación", "Una dilatación con factor 2"],
    respuesta: 3,
    explicacion: "La traslación, la reflexión y la rotación son transformaciones rígidas: conservan las distancias, así que la imagen es congruente con la figura. La dilatación con factor 2 multiplica cada distancia por 2: la imagen es semejante, pero más grande.",
    pista: "Tres de estas son transformaciones rígidas: mueven la figura sin estirarla. ¿Cuál la estira?",
    error: "Pensar que la reflexión o la rotación cambian el tamaño porque la figura «se ve distinta».",
    distractores: ["La traslación solo cambia de lugar la figura; su tamaño queda igual.", "La reflexión invierte la orientación, pero conserva el tamaño.", "La rotación gira la figura, pero conserva el tamaño.", null],
    etiquetas: ["transformaciones", "transformaciones rígidas"]
  },
  {
    id: "M4-11", modulo: "M4", indicador: "ES.G.41", tipo: "sm", nivel: 1,
    repaso: "f1",
    enunciado: "El punto P(5, 3) se refleja sobre el eje x. ¿Cuáles son las coordenadas de su imagen?",
    opciones: ["(5, −3)", "(−5, 3)", "(−5, −3)", "(3, 5)"],
    respuesta: 0,
    explicacion: "Reflejar sobre el eje x: (x, y) → (x, −y). La x se queda igual y la y cambia de signo: P′(5, −3).",
    pista: "El eje x es el espejo. Al reflejar sobre él, ¿cambia la distancia hacia la izquierda o la derecha, o la de arriba y abajo?",
    error: "Cambiar el signo de x (eso es reflejar sobre el eje y).",
    distractores: [null, "Cambiaste el signo de x: eso es reflejar sobre el eje y.", "Cambiaste los dos signos: eso es una rotación de 180° alrededor del origen.", "Intercambiaste las coordenadas: eso es reflejar sobre la recta y = x."],
    etiquetas: ["transformaciones", "reflexión", "coordenadas"]
  },
  {
    id: "M4-12", modulo: "M4", indicador: "ES.G.41", tipo: "sm", nivel: 2,
    repaso: "i2",
    enunciado: "El punto A(3, 1) se rota 90° en el sentido de las manecillas del reloj alrededor del origen. ¿Cuál es su imagen?",
    opciones: ["(−1, 3)", "(1, −3)", "(−3, −1)", "(3, −1)"],
    respuesta: 1,
    explicacion: "Girar 90° en el sentido del reloj es lo mismo que girar 270° en sentido contrario: (x, y) → (y, −x). Con A(3, 1): A′(1, −3). Comprueba: A está en el cuadrante I y, al girar a favor del reloj, pasa al cuadrante IV.",
    pista: "La regla de la guía es para 90° en sentido CONTRARIO al reloj. A favor del reloj, el punto va hacia el otro lado: ¿a qué cuadrante llega?",
    error: "Aplicar la regla de 90° en sentido contrario al reloj, (x, y) → (−y, x).",
    distractores: ["(−1, 3) es la rotación de 90° en sentido CONTRARIO al reloj. A favor del reloj, A baja al cuadrante IV.", null, "Cambiaste los dos signos: (−3, −1) es la rotación de 180°.", "(3, −1) es la reflexión sobre el eje x, no una rotación."],
    etiquetas: ["transformaciones", "rotación", "coordenadas"]
  },
  {
    id: "M4-13", modulo: "M4", indicador: "ES.G.41", tipo: "sm", nivel: 3,
    repaso: "f3",
    enunciado: "El punto B(−2, 4) se rota 270° en sentido contrario al reloj alrededor del origen. ¿Cuál es su imagen?",
    opciones: ["(−4, −2)", "(2, −4)", "(4, 2)", "(−2, −4)"],
    respuesta: 2,
    explicacion: "270° en sentido contrario al reloj son tres giros de 90°: (−2, 4) → (−4, −2) → (2, −4) → (4, 2). También se puede usar el atajo: 270° en sentido contrario = 90° a favor del reloj, (x, y) → (y, −x) = (4, 2).",
    pista: "Aplica tres veces la regla de 90°, (x, y) → (−y, x), o piensa que 270° en un sentido es 90° en el otro.",
    error: "Aplicar solo un giro de 90°, o confundir 270° con 180°.",
    distractores: ["Ese es un solo giro de 90°. Faltan dos giros más.", "Ese es un giro de 180° (dos giros de 90°). Falta uno más.", null, "Cambiaste solo el signo de y: eso es una reflexión sobre el eje x."],
    etiquetas: ["transformaciones", "rotación", "coordenadas"]
  },
  {
    id: "M4-14", modulo: "M4", indicador: "ES.G.41", tipo: "sm", nivel: 3,
    repaso: "i3",
    enunciado: "Al punto C(2, 5) se le aplica una reflexión sobre el eje x y luego una reflexión sobre el eje y. ¿A cuál transformación única equivale esa composición?",
    opciones: ["Una rotación de 180° alrededor del origen", "Una traslación", "Una reflexión sobre la recta y = x", "Una rotación de 90° en sentido contrario al reloj"],
    respuesta: 0,
    explicacion: "Sobre el eje x: (2, 5) → (2, −5). Luego sobre el eje y: (2, −5) → (−2, −5). Los dos signos cambiaron: (x, y) → (−x, −y), que es la regla de la rotación de 180° alrededor del origen.",
    pista: "Aplica las dos reflexiones al punto, en orden, y compara el resultado con las reglas de la guía.",
    error: "Pensar que dos reflexiones dan otra reflexión.",
    distractores: [null, "Una traslación suma lo mismo a todos los puntos. Aquí cada coordenada cambió de signo, y eso no es sumar un número fijo.", "Reflejar sobre y = x intercambia las coordenadas: daría (5, 2), no (−2, −5).", "90° en sentido contrario daría (−5, 2). El resultado es (−2, −5)."],
    etiquetas: ["transformaciones", "composición"]
  },
  {
    id: "M4-15", modulo: "M4", indicador: "ES.G.41", tipo: "sm", nivel: 2,
    repaso: "i2",
    figura: "gridRotacion",
    enunciado: "La figura A se transformó en la figura B. El vértice P(4, 1) pasó a P′(−1, 4). ¿Cuál transformación se aplicó?",
    opciones: ["Una reflexión sobre el eje y", "Una rotación de 90° en sentido contrario al reloj alrededor del origen", "Una rotación de 180° alrededor del origen", "Una traslación de 5 unidades a la izquierda y 3 hacia arriba"],
    respuesta: 1,
    explicacion: "Con la regla de 90° en sentido contrario al reloj, (x, y) → (−y, x): P(4, 1) → (−1, 4) = P′. Los otros vértices también cumplen la regla: (1, 1) → (−1, 1) y (1, 3) → (−3, 1).",
    pista: "Prueba cada regla con el punto P(4, 1) y mira cuál da (−1, 4). Después compruébala con otro vértice.",
    error: "Ver que la figura pasó al lado izquierdo y elegir la reflexión sobre el eje y sin probar las coordenadas.",
    distractores: ["Reflejar sobre el eje y daría P(4, 1) → (−4, 1), no (−1, 4).", null, "Girar 180° daría P(4, 1) → (−4, −1), en el cuadrante III.", "Esa traslación lleva P a P′, pero también tendría que llevar (1, 1) a (−4, 4). En la figura B, ese vértice está en (−1, 1): la figura giró, no solo se movió."],
    etiquetas: ["transformaciones", "rotación", "figura"]
  },

  /* ---------- M5 ---------- */
  {
    id: "M5-12", modulo: "M5", indicador: "ES.G.43", tipo: "sm", nivel: 2,
    repaso: "i1",
    figura: "semicirculoInscrito",
    enunciado: "En la figura, AB es un diámetro del círculo de centro O y C es un punto del círculo. ¿Cuánto mide ∠ACB?",
    opciones: ["90°", "180°", "45°", "60°"],
    respuesta: 0,
    explicacion: "∠ACB es un ángulo inscrito (su vértice C está en el círculo) que abarca el arco AB. Como AB es un diámetro, ese arco es medio círculo: 180°. El ángulo inscrito mide la mitad de su arco: 180° ÷ 2 = 90°.",
    pista: "¿Cuánto mide el arco que abarca el ángulo, si AB pasa por el centro? Un ángulo inscrito mide la mitad de su arco.",
    error: "Dar la medida del arco (180°) en vez de la del ángulo inscrito.",
    distractores: [null, "180° es la medida del arco AB (medio círculo). El ángulo inscrito mide la mitad.", "Dividiste dos veces. El arco mide 180° y el ángulo inscrito, la mitad: 90°.", "60° sería si el triángulo fuera equilátero, pero AB es un diámetro y no mide lo mismo que AC."],
    etiquetas: ["círculos", "ángulo inscrito", "figura"]
  },
  {
    id: "M5-13", modulo: "M5", indicador: "ES.G.43", tipo: "sm", nivel: 2,
    repaso: "f5",
    figura: "tangenteSecante",
    enunciado: "Desde el punto P, fuera del círculo, salen la tangente PT y una secante que corta el círculo en B y en C. El arco TB mide 60° y el arco TC (el más lejano) mide 160°. ¿Cuánto mide ∠P?",
    opciones: ["110°", "50°", "100°", "80°"],
    respuesta: 1,
    explicacion: "∠P es un ángulo exterior: su vértice está fuera del círculo. Mide la mitad de la diferencia de los arcos que intercepta: (160° − 60°) ÷ 2 = 100° ÷ 2 = 50°.",
    pista: "Vértice fuera del círculo: resta el arco menor al mayor y divide entre 2.",
    error: "Sumar los arcos (fórmula del ángulo interior) u olvidar dividir entre 2.",
    distractores: ["Sumaste los arcos y dividiste: (160 + 60) ÷ 2. Esa es la regla cuando el vértice está DENTRO del círculo.", null, "Restaste bien (160 − 60 = 100), pero faltó dividir entre 2.", "Tomaste la mitad del arco mayor solamente. Hay que restar primero el arco menor."],
    etiquetas: ["círculos", "ángulo exterior", "tangente", "figura"]
  },
  {
    id: "M5-14", modulo: "M5", indicador: "ES.G.43", tipo: "num", nivel: 3,
    repaso: "i1",
    enunciado: "En un círculo de centro O, el ángulo central ∠AOB mide (3x − 10)° y el ángulo inscrito ∠ACB, que abarca el mismo arco AB, mide (x + 10)°. ¿Cuántos grados mide el arco AB?",
    respuesta: 80, tolerancia: 0.01, unidad: "°",
    explicacion: "El central mide lo mismo que el arco y el inscrito mide la mitad. Entonces el central es el doble del inscrito: 3x − 10 = 2(x + 10) = 2x + 20, así que x = 30. El central mide 3(30) − 10 = 80°, y el arco AB también: 80°. Comprueba: el inscrito mide 30 + 10 = 40°, la mitad de 80°.",
    pista: "El ángulo central es el doble del inscrito que abarca el mismo arco. Plantea 3x − 10 = 2(x + 10).",
    error: "Igualar las dos expresiones (3x − 10 = x + 10) como si los ángulos midieran lo mismo, o contestar x = 30.",
    etiquetas: ["círculos", "ángulo central", "ángulo inscrito", "ecuaciones"]
  },
  {
    id: "M5-15", modulo: "M5", indicador: "ES.M.56", tipo: "sm", nivel: 2,
    repaso: "f1",
    enunciado: "Una pizza tiene 14 pulgadas de diámetro. ¿Cuál es su área? (Usa π ≈ 3.14).",
    opciones: ["615.44 pulg²", "43.96 pulg²", "153.86 pulg²", "21.98 pulg²"],
    respuesta: 2,
    explicacion: "El radio es la mitad del diámetro: r = 14 ÷ 2 = 7 pulg. A = πr² = 3.14 × 7² = 3.14 × 49 = 153.86 pulg².",
    pista: "Antes de sustituir, marca el radio: el diámetro es 14, ¿cuánto es el radio?",
    error: "Usar el diámetro como radio.",
    distractores: ["Usaste el diámetro como radio: 3.14 × 14² = 615.44. El radio es 7.", "Calculaste la circunferencia, 2πr = 3.14 × 14. El área usa πr².", null, "Multiplicaste π × 7 sin elevar al cuadrado. El área es π × 7 × 7."],
    etiquetas: ["medición", "área del círculo"]
  },
  {
    id: "M5-16", modulo: "M5", indicador: "ES.M.56", tipo: "sm", nivel: 2,
    repaso: "f2",
    enunciado: "Un cilindro se puede ver como una pila de discos iguales. ¿Cuál razón explica que su volumen sea V = πr²h?",
    opciones: ["Se multiplica la circunferencia de la base (2πr) por la altura", "Se multiplica el área de cada disco (πr²) por la altura de la pila (h)", "Se suma el área de la base con la altura", "Se toma la mitad del área de la base por la altura"],
    respuesta: 1,
    explicacion: "Cada disco tiene como cara un círculo de área πr². Al apilar discos hasta la altura h, el volumen es el área de la base por la altura: V = πr² · h. Es la misma idea del prisma: área de la base × altura.",
    pista: "El volumen de cualquier prisma o cilindro es (área de la base) × (altura). ¿Cuál es el área de la base de un cilindro?",
    error: "Confundir la circunferencia (2πr, una longitud) con el área de la base (πr²).",
    distractores: ["2πr es la circunferencia: mide el borde del disco, no su superficie. 2πr · h da el área lateral, no el volumen.", null, "No se suman un área y una longitud. El volumen se obtiene al multiplicar el área de la base por la altura.", "La mitad aparece en el área del triángulo, no en el cilindro. Los discos se apilan completos."],
    etiquetas: ["medición", "cilindro", "argumento"]
  },
  {
    id: "M5-17", modulo: "M5", indicador: "ES.M.56", tipo: "sm", nivel: 2,
    repaso: "f3",
    enunciado: "Una bola tiene forma de esfera con 10 cm de diámetro. ¿Cuál es su volumen, redondeado a la décima? (Usa π ≈ 3.14).",
    opciones: ["4186.7 cm³", "314.0 cm³", "523.3 cm³", "392.5 cm³"],
    respuesta: 2,
    explicacion: "El radio es 10 ÷ 2 = 5 cm. V = 4/3 πr³ = 4/3 × 3.14 × 5³ = 4/3 × 3.14 × 125 = 523.33… ≈ 523.3 cm³.",
    pista: "Marca el radio antes de sustituir. Luego eleva al cubo: 5³ = 5 × 5 × 5.",
    error: "Usar el diámetro como radio, o usar la fórmula del área de la superficie (4πr²).",
    distractores: ["Usaste el diámetro como radio: 4/3 × 3.14 × 10³. El radio es 5.", "Esa es el área de la superficie, 4πr² = 4 × 3.14 × 25. El volumen usa 4/3 πr³.", null, "Olvidaste el 4/3: 3.14 × 125 = 392.5. Multiplica por 4 y divide entre 3."],
    etiquetas: ["medición", "esfera", "volumen"]
  },
  {
    id: "M5-18", modulo: "M5", indicador: "ES.M.56", tipo: "num", nivel: 2,
    repaso: "f4",
    enunciado: "Una pecera con forma de prisma rectangular mide 50 cm de largo, 30 cm de ancho y 40 cm de alto. ¿Cuántos litros de agua le caben cuando está llena? (1 litro = 1000 cm³).",
    respuesta: 60, tolerancia: 0.01, unidad: "litros",
    explicacion: "V = l × a × h = 50 × 30 × 40 = 60,000 cm³. Cada litro son 1000 cm³: 60,000 ÷ 1000 = 60 litros.",
    pista: "Primero calcula el volumen en cm³ y después divide entre 1000 para pasarlo a litros.",
    error: "Contestar 60,000 sin pasar a litros, o sumar las dimensiones en vez de multiplicarlas.",
    etiquetas: ["medición", "prisma", "volumen", "unidades"]
  },

  /* ---------- M6 ---------- */
  {
    id: "M6-14", modulo: "M6", indicador: "ES.A.11", tipo: "sm", nivel: 2,
    repaso: "i1",
    enunciado: "¿Cuántas soluciones tiene el sistema x + 2y = 6 y 2x + 4y = 10?",
    opciones: ["Una solución: (2, 2)", "Ninguna solución", "Infinitas soluciones", "Una solución: (6, 0)"],
    respuesta: 1,
    explicacion: "Divide la segunda ecuación entre 2: x + 2y = 5. La primera dice x + 2y = 6. La misma expresión no puede valer 6 y 5 a la vez: las rectas son paralelas (misma pendiente, distinto intercepto) y el sistema no tiene solución.",
    pista: "Compara las dos ecuaciones: ¿la segunda es un múltiplo de la primera? Revisa los coeficientes y también el número de la derecha.",
    error: "Ver coeficientes proporcionales y contestar «infinitas» sin revisar el término de la derecha.",
    distractores: ["(2, 2) cumple la primera (2 + 4 = 6), pero no la segunda: 4 + 8 = 12, no 10. Hay que verificar en las dos.", null, "Para infinitas, TODA la ecuación tendría que ser múltiplo: 2 × 6 = 12, pero la segunda dice 10.", "(6, 0) cumple la primera, pero en la segunda da 12, no 10."],
    etiquetas: ["sistemas", "sin solución"]
  },
  {
    id: "M6-15", modulo: "M6", indicador: "ES.A.11", tipo: "num", nivel: 2,
    repaso: "i1",
    enunciado: "En la cafetería, 2 empanadillas y 1 jugo cuestan $5. Una empanadilla y 3 jugos también cuestan $5. ¿Cuánto cuesta una empanadilla, en dólares?",
    respuesta: 2, tolerancia: 0.01, unidad: "dólares",
    explicacion: "Sea e el precio de una empanadilla y j el de un jugo: 2e + j = 5 y e + 3j = 5. De la primera, j = 5 − 2e. Sustituye: e + 3(5 − 2e) = 5 → e + 15 − 6e = 5 → −5e = −10 → e = 2. Entonces j = 1. Comprueba: 2(2) + 1 = 5 y 2 + 3(1) = 5.",
    pista: "Escribe una ecuación para cada compra. Despeja j en la primera y sustitúyela en la segunda.",
    error: "Contestar el precio del jugo ($1) o usar una sola de las compras.",
    etiquetas: ["sistemas", "contexto"]
  },
  {
    id: "M6-16", modulo: "M6", indicador: "ES.A.11", tipo: "sm", nivel: 3,
    repaso: "f2",
    enunciado: "Si A = [[1, 2], [3, −1]] y B = [[2, 0], [1, 4]], ¿cuál es el producto AB?",
    opciones: ["[[2, 0], [3, −4]]", "[[2, 4], [13, −2]]", "[[4, 8], [7, −4]]", "[[4, 8], [5, −4]]"],
    respuesta: 3,
    explicacion: "Cada entrada es fila de A por columna de B. Fila 1: 1(2) + 2(1) = 4 y 1(0) + 2(4) = 8. Fila 2: 3(2) + (−1)(1) = 5 y 3(0) + (−1)(4) = −4. AB = [[4, 8], [5, −4]].",
    pista: "Para la entrada de la fila 2, columna 1: toma la fila 2 de A, (3, −1), y la columna 1 de B, (2, 1). Multiplica pareja por pareja y suma.",
    error: "Multiplicar entrada por entrada, o calcular BA en vez de AB.",
    distractores: ["Multiplicaste entrada por entrada (1 × 2, 2 × 0, …). El producto de matrices es fila por columna.", "Ese es BA: multiplicaste en el orden contrario. En matrices, el orden importa.", "Revisa el signo en la fila 2: 3(2) + (−1)(1) = 6 − 1 = 5, no 7.", null],
    etiquetas: ["matrices", "producto"]
  },
  {
    id: "M6-17", modulo: "M6", indicador: "ES.A.11", tipo: "num", nivel: 2,
    repaso: "i2",
    enunciado: "Si −2 · [[x, 6], [−1, 4]] = [[10, −12], [2, −8]], ¿cuál es el valor de x?",
    respuesta: -5, tolerancia: 0.01, unidad: "",
    explicacion: "El escalar multiplica cada entrada: −2 · x = 10. Divide entre −2: x = 10 ÷ (−2) = −5. Comprueba con otra entrada: −2 · 6 = −12. ✓",
    pista: "Mira solo la entrada de arriba a la izquierda: −2 por x da 10.",
    error: "Dividir sin el signo y contestar 5.",
    etiquetas: ["matrices", "escalar"]
  },
  {
    id: "M6-18", modulo: "M6", indicador: "ES.N.9", tipo: "sm", nivel: 1,
    repaso: "i0",
    enunciado: "¿Cuál propiedad muestra que (4 + 7) + 3 = 4 + (7 + 3)?",
    opciones: ["Conmutativa", "Asociativa", "Distributiva", "Inverso aditivo"],
    respuesta: 1,
    explicacion: "Los números están en el mismo orden (4, 7, 3); solo cambian los paréntesis, es decir, cómo se agrupan. Cambiar la agrupación es la propiedad asociativa.",
    pista: "Compara los dos lados: ¿cambió el orden de los números o cambió dónde están los paréntesis?",
    error: "Confundir asociativa (agrupación) con conmutativa (orden).",
    distractores: ["La conmutativa cambia el orden, como 4 + 7 = 7 + 4. Aquí el orden es el mismo.", null, "La distributiva multiplica un número por una suma, como 2(4 + 7) = 8 + 14. Aquí no hay multiplicación.", "El inverso aditivo suma un número con su opuesto para dar 0, como 7 + (−7) = 0."],
    etiquetas: ["propiedades"]
  },
  {
    id: "M6-19", modulo: "M6", indicador: "ES.E.58", tipo: "sm", nivel: 2,
    repaso: "f3",
    enunciado: "En un juego de feria, el premio es $10 con probabilidad 0.1, $3 con probabilidad 0.3 y $0 con probabilidad 0.6. ¿Cuál es el valor esperado del premio?",
    opciones: ["$4.33", "$1.90", "$13.00", "$1.00"],
    respuesta: 1,
    explicacion: "E = Σ (valor × probabilidad) = 10(0.1) + 3(0.3) + 0(0.6) = 1 + 0.9 + 0 = $1.90. Es lo que se gana, en promedio, por juego si se juega muchas veces.",
    pista: "Multiplica cada premio por su probabilidad y suma los resultados.",
    error: "Promediar los premios sin usar las probabilidades.",
    distractores: ["Promediaste los premios: (10 + 3 + 0) ÷ 3. El valor esperado pesa cada premio por su probabilidad.", null, "Sumaste los premios. Cada uno tiene que multiplicarse por su probabilidad.", "Solo contaste el premio de $10: 10 × 0.1. Falta sumar 3 × 0.3 = 0.9."],
    etiquetas: ["probabilidad", "valor esperado"]
  }
];
