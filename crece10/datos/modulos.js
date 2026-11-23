/*!
 * CRECE 10 · Matemáticas
 * © 2026 Dr. Yonatan Guerrero, creador y desarrollador de CRECE 10.
 * Todos los derechos reservados.
 */
/* Proyecto CRECE 10 · Matemáticas
   Rutas de destreza alineadas a la planilla CRECE 2023-24 y a los
   Estándares de Contenido de Puerto Rico 2022.
   Contenido original. No reproduce ítems ni figuras de Pearson/TestNav. */

window.CRECE_MODULOS = [
  {
    // Ruta de preparación: no es contenido de la prueba, pero la prueba la da por sabida.
    // `base: true` la saca de la mezcla, del simulacro, del diagnóstico y del plan.
    id: "M0",
    base: true,
    nombre: "Base: lo que la geometría da por sabido",
    corto: "Base",
    indicadores: ["Repaso de grados anteriores"],
    color: "#4A5A6A",
    peso: "No cuenta en la prueba; la sostiene",
    gancho: "Enteros, fracciones, proporciones, ecuaciones y el plano",
    proposito:
      "Repasar las destrezas de grados anteriores que aparecen dentro de casi todos los ítems de la prueba: operar con signos, fracciones y por cientos, resolver proporciones y ecuaciones, y ubicar puntos en el plano. Si una ruta se te hace cuesta arriba, empieza aquí.",
    ideas: [
      {
        t: "Enteros y signos",
        d: "Al sumar números con signos distintos, resta sus valores absolutos y usa el signo del de mayor valor absoluto: −7 + 12 = 5. Restar un negativo es sumar su opuesto: 5 − (−3) = 8. Al multiplicar o dividir, signos iguales dan positivo y signos distintos dan negativo."
      },
      {
        t: "Orden de las operaciones",
        d: "Primero los paréntesis; luego las potencias y raíces; después multiplicación y división, de izquierda a derecha; al final suma y resta, de izquierda a derecha. Por eso 2 + 3 · 4 = 14, no 20."
      },
      {
        t: "Fracciones, decimales y por cientos",
        d: "Una fracción es una división: 3/5 = 3 ÷ 5 = 0.6 = 60 %. Para sumar fracciones necesitas el mismo denominador. Para multiplicar, multiplica numeradores y denominadores. El x % de una cantidad es (x ÷ 100) por la cantidad."
      },
      {
        t: "Razones y proporciones",
        d: "Una proporción dice que dos razones son iguales: a/b = c/d. Se resuelve con productos cruzados: a · d = b · c. Coloca las mismas unidades en el mismo lugar de cada razón. Es la base de la semejanza y de las escalas."
      },
      {
        t: "Ecuaciones",
        d: "Despejar es deshacer las operaciones en orden inverso, haciendo lo mismo en los dos lados. En 3x + 5 = 20: resta 5 (3x = 15) y divide entre 3 (x = 5). Comprueba siempre sustituyendo."
      },
      {
        t: "El plano cartesiano",
        d: "En el punto (x, y), x dice cuánto a la derecha (+) o a la izquierda (−) y y dice cuánto arriba (+) o abajo (−). Cuadrantes: I (+, +), II (−, +), III (−, −), IV (+, −), contados en sentido contrario a las manecillas del reloj. Es la base de las transformaciones."
      }
    ],
    formulas: [
      { f: "a/b = c/d → a · d = b · c", d: "Productos cruzados para resolver una proporción." },
      { f: "x % de N = (x ÷ 100) · N", d: "Ejemplo: 15 % de 80 = 0.15 · 80 = 12." },
      { f: "a/b ÷ c/d = a/b · d/c", d: "Para dividir fracciones, multiplica por el recíproco de la segunda." },
      { f: "Rectángulo: A = b · h · Triángulo: A = b · h ÷ 2", d: "El triángulo es la mitad del rectángulo con la misma base y altura." }
    ],
    ejemplo: {
      titulo: "Resolver la proporción x/6 = 10/15",
      pasos: [
        "Multiplica en cruz: 15 · x = 6 · 10.",
        "Calcula: 15x = 60.",
        "Divide los dos lados entre 15: x = 4.",
        "Comprueba: 4/6 = 2/3 y 10/15 = 2/3. Las razones son iguales."
      ],
      respuesta: "x = 4."
    },
    errores: [
      { e: "Sumar antes de multiplicar", c: "2 + 3 · 4 es 14: la multiplicación va primero." },
      { e: "Sumar numeradores y denominadores", c: "1/2 + 1/3 no es 2/5. Con denominador común: 3/6 + 2/6 = 5/6." },
      { e: "Cambiar el orden en (x, y)", c: "El primer número siempre es el horizontal. (2, 5) y (5, 2) son puntos distintos." },
      { e: "Hacer una operación en un solo lado", c: "Lo que le haces a un lado de la ecuación se lo haces al otro." }
    ]
  },
  {
    id: "M1",
    nombre: "Fundamentos y construcciones",
    corto: "Fundamentos",
    indicadores: ["ES.G.36", "ES.G.44", "ES.G.45"],
    color: "#0E6B63",
    peso: "≈ 12% de la prueba",
    gancho: "Leer el plano antes de resolver",
    proposito:
      "Reconocer punto, recta, plano y espacio, interpretar una figura y elegir el instrumento o la construcción correcta. Es la puerta de entrada al 71% de geometría.",
    ideas: [
      {
        t: "Punto, recta, plano, espacio",
        d: "El punto no tiene dimensiones; la recta tiene una; el plano tiene dos; el espacio tiene tres. Un objeto cotidiano se usa como modelo: una estrella → punto, una pared → plano, una cancha → plano, un jugador → punto."
      },
      {
        t: "Colineal y coplanar",
        d: "Puntos colineales están en la misma recta. Puntos coplanares están en el mismo plano. Cuatro puntos no colineales ni coplanares solo caben en el espacio."
      },
      {
        t: "Instrumentos",
        d: "Regla: traza segmentos y mide longitud. Compás: traza círculos y copia distancias. Transportador: mide y construye ángulos. Escuadra: traza perpendiculares y paralelas."
      },
      {
        t: "Construcciones clásicas",
        d: "Con regla sin marcas y compás se construyen mediatriz, bisectriz, perpendiculares, triángulos inscritos y tangentes. El punto donde se cruzan las bisectrices es el incentro; el de las mediatrices, el circuncentro."
      }
    ],
    formulas: [
      { f: "Mediatriz", d: "Recta perpendicular al segmento por su punto medio. Todo punto de ella equidista de los extremos." },
      { f: "Bisectriz", d: "Divide un ángulo en dos ángulos iguales. El incentro equidista de los tres lados." },
      { f: "Círculo inscrito", d: "Su centro es el incentro; su radio es la distancia del incentro a un lado." }
    ],
    ejemplo: {
      titulo: "Una pared del salón, ¿qué concepto representa?",
      pasos: [
        "Una pared tiene largo y ancho, pero su espesor no se considera: es una superficie.",
        "Una superficie plana que se extiende sin límite es un plano.",
        "No es una recta (solo largo) ni un punto (sin dimensiones)."
      ],
      respuesta: "Plano."
    },
    errores: [
      { e: "Confundir recta con plano", c: "La recta tiene una sola dirección; el plano se extiende en dos." },
      { e: "Usar el transportador para trazar un círculo", c: "El círculo se traza con compás; el transportador mide ángulos." },
      { e: "Llamar «circuncentro» al centro del círculo inscrito", c: "Inscrito → incentro (bisectrices). Circunscrito → circuncentro (mediatrices)." }
    ]
  },
  {
    id: "M2",
    nombre: "Congruencia y prueba",
    corto: "Congruencia",
    indicadores: ["ES.G.39", "ES.G.40", "ES.G.46"],
    color: "#C2412D",
    peso: "≈ 18% de la prueba",
    gancho: "Demostrar sin perderse en el paso 7",
    proposito:
      "Decidir cuándo dos figuras son congruentes, leer una demostración de dos columnas y elegir la definición, postulado o propiedad que autoriza cada paso.",
    ideas: [
      {
        t: "Criterios mínimos",
        d: "LLL: tres lados. LAL: dos lados y el ángulo entre ellos. ALA: dos ángulos y el lado entre ellos. AAL: dos ángulos y un lado no incluido. Si el ángulo no está entre los lados, no es LAL."
      },
      {
        t: "Correspondencia",
        d: "El orden de las letras importa: ΔABC ≅ ΔDEF significa A↔D, B↔E, C↔F. Un lado marcado en una figura debe corresponder con el marcado en la otra."
      },
      {
        t: "CPCTC",
        d: "Una vez demostrada la congruencia de dos triángulos, cualquier par de partes correspondientes es congruente. Es el puente entre «los triángulos son congruentes» y «este lado o ángulo lo es»."
      },
      {
        t: "Contraejemplo",
        d: "Para refutar «todo A es B» basta un A que no sea B. Un rombo tiene cuatro lados iguales y no es cuadrado; un trapecio rectángulo tiene dos ángulos rectos y no es rectángulo."
      },
      {
        t: "Paralelas y ángulos",
        d: "Si dos rectas paralelas son cortadas por una transversal: los alternos internos son congruentes, los correspondientes son congruentes y los internos del mismo lado suman 180°. Los opuestos por el vértice siempre son congruentes, haya paralelas o no."
      },
      {
        t: "Razones más usadas en una demostración",
        d: "Dado: lo que dice el problema. Definición de punto medio: divide un segmento en dos partes congruentes. Definición de bisectriz: divide un ángulo en dos partes congruentes. Propiedad reflexiva: un lado o ángulo compartido es congruente consigo mismo. Para los triángulos se usa un criterio (LLL, LAL, ALA, AAL) y, después, CPCTC para sus partes."
      }
    ],
    formulas: [
      { f: "LLL", d: "Lado–Lado–Lado: los tres pares de lados correspondientes son congruentes." },
      { f: "LAL", d: "Lado–Ángulo–Lado: dos lados y el ángulo comprendido." },
      { f: "ALA", d: "Ángulo–Lado–Ángulo: dos ángulos y el lado entre ellos." },
      { f: "AAL", d: "Ángulo–Ángulo–Lado: dos ángulos y un lado no comprendido." }
    ],
    ejemplo: {
      titulo: "Justificar el paso final de una demostración",
      pasos: [
        "La tabla ya demostró que los dos triángulos son congruentes (paso 6).",
        "El paso 7 afirma que dos lados correspondientes son congruentes.",
        "La razón que conecta ambos hechos es CPCTC: partes correspondientes de triángulos congruentes son congruentes."
      ],
      respuesta: "Las partes correspondientes de triángulos congruentes son congruentes (CPCTC)."
    },
    errores: [
      { e: "Usar LAL cuando el ángulo no está entre los lados", c: "Marca primero el ángulo; si no toca ambos lados, no es LAL." },
      { e: "Elegir un contraejemplo que confirma la proposición", c: "El contraejemplo debe cumplir la hipótesis y fallar la conclusión." },
      { e: "Justificar con «definición» cualquier paso", c: "Distingue definición (qué es), postulado (se acepta) y teorema (se demuestra)." }
    ]
  },
  {
    id: "M3",
    nombre: "Semejanza",
    corto: "Semejanza",
    indicadores: ["ES.G.42", "ES.G.47"],
    color: "#3A4E8C",
    peso: "≈ 16% de la prueba",
    gancho: "La razón manda",
    proposito:
      "Identificar figuras semejantes, escribir proporciones con los lados correspondientes y usar los criterios AA, LAL y LLL para resolver medidas.",
    ideas: [
      {
        t: "Semejante ≠ congruente",
        d: "Semejantes tienen la misma forma; congruentes tienen la misma forma y el mismo tamaño. Una razón de semejanza distinta de 1 produce figuras semejantes no congruentes."
      },
      {
        t: "Correspondencia",
        d: "Si ΔOMN ~ ΔXYZ, entonces O↔X, M↔Y, N↔Z. La proporción se escribe alineando los vértices: OM/XY = MN/YZ = ON/XZ."
      },
      {
        t: "Criterio AA",
        d: "Dos pares de ángulos congruentes bastan para la semejanza, porque el tercer par queda determinado."
      },
      {
        t: "Teorema de Tales",
        d: "Si una recta es paralela a un lado de un triángulo y corta los otros dos, divide esos lados en segmentos proporcionales."
      }
    ],
    formulas: [
      { f: "Razón de semejanza", d: "k = lado de la imagen / lado correspondiente de la figura original." },
      { f: "Proporción", d: "a/b = c/d ⇒ ad = bc (producto cruzado)." },
      { f: "Áreas", d: "Si la razón de semejanza es k, la razón de áreas es k²." },
      { f: "Tales", d: "AD/DB = AE/EC cuando DE ∥ BC." }
    ],
    ejemplo: {
      titulo: "Lado faltante con razón 2/3",
      pasos: [
        "Identifica la razón: 2/3 significa que cada lado de la imagen mide 2/3 del original.",
        "Multiplica cada lado original por 2/3: 18 → 12; 30 → 20; 36 → 24.",
        "Verifica que la proporción se mantenga: 18/12 = 30/20 = 36/24 = 3/2."
      ],
      respuesta: "12, 20 y 24."
    },
    errores: [
      { e: "Invertir la razón", c: "Escribe la proporción con los vértices alineados antes de sustituir." },
      { e: "Emparejar lados por posición visual, no por correspondencia", c: "Busca los ángulos congruentes: los lados opuestos a ellos se corresponden." },
      { e: "Aplicar k a las áreas", c: "Las áreas cambian por k², no por k." }
    ]
  },
  {
    id: "M4",
    nombre: "Transformaciones",
    corto: "Transformaciones",
    indicadores: ["ES.G.40", "ES.G.41"],
    color: "#9A6B00",
    peso: "≈ 12% de la prueba",
    gancho: "Mover sin deformar",
    proposito:
      "Aplicar traslaciones, reflexiones y rotaciones en el plano cartesiano, identificar la transformación que lleva de A a B y reconocer cuáles conservan la congruencia y la orientación.",
    ideas: [
      {
        t: "Traslación",
        d: "Suma el mismo vector a cada punto: (x, y) → (x + a, y + b). Conserva forma, tamaño y orientación."
      },
      {
        t: "Reflexión",
        d: "Espejo respecto a un eje. Sobre el eje x: (x, y) → (x, −y). Sobre el eje y: (x, y) → (−x, y). Conserva tamaño, pero invierte la orientación."
      },
      {
        t: "Rotación",
        d: "Gira alrededor de un centro. 90° en sentido contrario al reloj: (x, y) → (−y, x). 180°: (x, y) → (−x, −y). Conserva orientación."
      },
      {
        t: "Composición",
        d: "Aplica una transformación y luego la otra, en orden. El resultado puede ser equivalente a una sola transformación."
      }
    ],
    formulas: [
      { f: "Traslación (a, b)", d: "(x, y) → (x + a, y + b)" },
      { f: "Reflexión eje x", d: "(x, y) → (x, −y)" },
      { f: "Reflexión eje y", d: "(x, y) → (−x, y)" },
      { f: "Rotación 90° antihoraria", d: "(x, y) → (−y, x)" },
      { f: "Rotación 180°", d: "(x, y) → (−x, −y)" }
    ],
    ejemplo: {
      titulo: "Trasladar A(−3, −4) dos a la derecha y tres arriba",
      pasos: [
        "Derecha suma a x: −3 + 2 = −1.",
        "Arriba suma a y: −4 + 3 = −1.",
        "La imagen es (−1, −1)."
      ],
      respuesta: "A′(−1, −1)."
    },
    errores: [
      { e: "Mover el eje equivocado", c: "Horizontal cambia x; vertical cambia y." },
      { e: "Rotar 90° en el sentido contrario", c: "Antihorario: (−y, x); horario: (y, −x)." },
      { e: "Decir que una reflexión conserva la orientación", c: "La reflexión es la única transformación rígida que invierte la orientación." }
    ]
  },
  {
    id: "M5",
    nombre: "Círculos y medición",
    corto: "Círculos y sólidos",
    indicadores: ["ES.G.43", "ES.G.45", "ES.M.56"],
    color: "#7A3E65",
    peso: "≈ 16% de la prueba",
    gancho: "Ángulos, arcos y volumen",
    proposito:
      "Relacionar ángulos y arcos en un círculo, usar tangentes y resolver problemas de perímetro, área y volumen de figuras bidimensionales y tridimensionales.",
    ideas: [
      {
        t: "Ángulo central",
        d: "Su vértice está en el centro; mide lo mismo que su arco."
      },
      {
        t: "Ángulo inscrito",
        d: "Su vértice está en la circunferencia; mide la mitad del arco que abarca."
      },
      {
        t: "Ángulo exterior",
        d: "Vértice fuera del círculo, formado por dos secantes o tangentes: mide la mitad de la diferencia de los arcos."
      },
      {
        t: "Tangente",
        d: "Toca la circunferencia en un solo punto y es perpendicular al radio en ese punto."
      },
      {
        t: "Sólidos",
        d: "El volumen se mide en unidades cúbicas. Cilindro: área de la base × altura. Esfera: 4/3 πr³. Prisma: largo × ancho × alto."
      },
      {
        t: "Radios y cuerdas",
        d: "Todos los radios de un mismo círculo son congruentes. Una cuerda une dos puntos del círculo; el diámetro es la cuerda que pasa por el centro y mide dos radios."
      }
    ],
    formulas: [
      { f: "Circunferencia", d: "C = 2πr = πd" },
      { f: "Área del círculo", d: "A = πr²" },
      { f: "Cilindro", d: "V = πr²h" },
      { f: "Esfera", d: "V = 4/3 πr³" },
      { f: "Prisma rectangular", d: "V = l × a × h" },
      { f: "Ángulo exterior", d: "m∠ = (arco mayor − arco menor) / 2" }
    ],
    ejemplo: {
      titulo: "Dos secantes desde un punto exterior",
      pasos: [
        "Identifica los arcos interceptados: 95° y 25°.",
        "Resta: 95 − 25 = 70.",
        "Divide entre 2: 70 ÷ 2 = 35°.",
        "El vértice está fuera del círculo: es un ángulo exterior."
      ],
      respuesta: "Exterior; 35°."
    },
    errores: [
      { e: "Usar el diámetro como radio", c: "r = d ÷ 2. Hazlo antes de sustituir." },
      { e: "Confundir área con volumen", c: "Área: unidades². Volumen: unidades³." },
      { e: "Sumar los arcos en un ángulo exterior", c: "El ángulo exterior usa la diferencia, no la suma." }
    ]
  },
  {
    id: "M6",
    nombre: "Álgebra, matrices y datos",
    corto: "Álgebra y datos",
    indicadores: ["ES.N.9", "ES.A.10", "ES.A.11", "ES.E.58"],
    color: "#3F6B2E",
    peso: "≈ 21% de la prueba",
    gancho: "Propiedades, sistemas y matrices",
    proposito:
      "Simplificar expresiones justificando cada propiedad, resolver sistemas 2×2, operar con matrices, despejar fórmulas y calcular probabilidades y valores esperados.",
    ideas: [
      {
        t: "Propiedades",
        d: "Conmutativa cambia el orden; asociativa cambia la agrupación; distributiva multiplica sobre una suma; inverso produce el elemento neutro."
      },
      {
        t: "Sistemas 2×2",
        d: "Solución única: las rectas se cortan. Sin solución: son paralelas. Infinitas: son la misma recta (una ecuación es múltiplo de la otra)."
      },
      {
        t: "Matrices",
        d: "El escalar multiplica cada entrada. El producto fila × columna suma los productos; solo existe si el número de columnas de la primera coincide con el de filas de la segunda."
      },
      {
        t: "Probabilidad",
        d: "P(al menos uno) = 1 − P(ninguno). El valor esperado es Σ (valor × probabilidad)."
      },
      {
        t: "Evaluar expresiones",
        d: "Sustituye la variable entre paréntesis y sigue el orden: paréntesis, potencias, multiplicación y división, suma y resta. Un número negativo al cuadrado es positivo: (−2)² = 4. Menos por menos es más: −5(−3) = 15."
      },
      {
        t: "Propiedades de la igualdad",
        d: "Si sumas, restas, multiplicas o divides los dos lados de una ecuación por el mismo número (distinto de cero al dividir), la igualdad se conserva. En una demostración algebraica, cada paso se justifica con una de estas propiedades o con la distributiva."
      }
    ],
    formulas: [
      { f: "Distributiva", d: "a(b + c) = ab + ac" },
      { f: "Densidad", d: "d = m/V ⇒ m = dV; V = m/d" },
      { f: "Producto de matrices", d: "(AB)ᵢⱼ = fila i de A · columna j de B" },
      { f: "Valor esperado", d: "E(X) = Σ xᵢ · P(xᵢ)" }
    ],
    ejemplo: {
      titulo: "¿Cuántas soluciones tiene el sistema?",
      pasos: [
        "2x − y = 5.",
        "−6x + 3y = −15. Divide entre −3: 2x − y = 5.",
        "Las dos ecuaciones son la misma recta.",
        "Todo punto de la recta es solución: infinitas soluciones."
      ],
      respuesta: "Infinitas soluciones."
    },
    errores: [
      { e: "Multiplicar matrices elemento a elemento", c: "Es fila × columna, sumando los productos." },
      { e: "Perder el signo al multiplicar por un escalar negativo", c: "Escribe el signo antes de multiplicar cada entrada." },
      { e: "Calcular P(al menos uno) sumando", c: "Usa el complemento: 1 − P(ninguno)." }
    ]
  }
];
