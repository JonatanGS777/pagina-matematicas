/*!
 * CRECE 10 · Matemáticas
 * © 2026 Dr. Yonatan Guerrero, creador y desarrollador de CRECE 10.
 * Todos los derechos reservados.
 */
/* Videos cortos por idea (v1.6): videos de Khan Academy en español.
   Cada entrada: yt = id del video en YouTube (canal KhanAcademyEspañol),
   khan = ruta del video en es.khanacademy.org, t = título en Khan.
   Clave: ruta → idea («iN») o fórmula («fN») de datos/modulos.js.
   Verificados el 22 de noviembre de 2026: cada id se sacó de la página del video en
   Khan Academy y se comprobó con YouTube (existe y es del canal KhanAcademyEspañol).
   Los videos son de Khan Academy (licencia CC BY-NC-SA); aquí solo se enlazan e incrustan. */
window.CRECE_VIDEOS = {
  M0: {
    i0: [{ yt: "tne5rDg27GE", khan: "pre-algebra/pre-algebra-negative-numbers/pre-algebra-sub-neg-intro/v/adding-and-subtracting-negative-number-examples", t: "Sumar y restar números negativos" }],
    i1: [{ yt: "DueDueD5nCo", khan: "pre-algebra/pre-algebra-arith-prop/pre-algebra-order-of-operations/v/introduction-to-order-of-operations", t: "Introducción al orden de las operaciones" }],
    i2: [{ yt: "5dWg3jf--5U", khan: "pre-algebra/pre-algebra-fractions/pre-algebra-add-sub-fractions/v/adding-small-fractions-with-unlike-denominators", t: "Sumar fracciones con denominadores diferentes" }, { yt: "ZE_hGpHOhOA", khan: "pre-algebra/pre-algebra-fractions/pre-algebra-dividing-fractions/v/dividing-fractions-example", t: "Dividir fracciones: 3/5 ÷ 1/2" }, { yt: "9CwbwpXNx0M", khan: "pre-algebra/pre-algebra-ratios-rates/pre-algebra-intro-percents/v/describing-the-meaning-of-percent", t: "El significado del porcentaje" }],
    i3: [{ yt: "iDUCbPLvibQ", khan: "pre-algebra/pre-algebra-ratios-rates/pre-algebra-write-and-solve-proportions/v/find-an-unknown-in-a-proportion", t: "Ejemplo resuelto: resolver proporciones" }],
    i4: [{ yt: "LAxRd5XQIBs", khan: "pre-algebra/pre-algebra-equations-expressions/pre-algebra-2-step-equations-intro/v/why-we-do-the-same-thing-to-both-sides-two-step-equations", t: "Introducción a las ecuaciones de dos pasos" }],
    i5: [{ yt: "b_YsrpisGTQ", khan: "pre-algebra/pre-algebra-negative-numbers/pre-algebra-coordinate-plane/v/the-coordinate-plane", t: "Ejemplos de puntos en el plano coordenado" }],
    f3: [{ yt: "dJRLTKrI_OQ", khan: "basic-geo/basic-geo-area-and-perimeter/area-triangle/v/intuition-for-area-of-a-triangle", t: "Área de un triángulo" }]
  },
  M1: {
    i0: [{ yt: "QGf_tbOZTpI", khan: "geometry/hs-geo-transformations/hs-geo-intro-euclid/v/language-and-notation-of-basic-geometry", t: "Términos y clasificaciones en geometría" }],
    i2: [{ yt: "0--MC9zuLdY", khan: "geometry/hs-geo-congruence/hs-geo-bisectors/v/geometric-constructions-congruent-angles", t: "Construcciones geométricas: ángulos congruentes" }],
    i3: [{ yt: "Mbj22p1dj9Q", khan: "geometry/hs-geo-congruence/hs-geo-bisectors/v/constructing-a-perpendicular-bisector-using-a-compass-and-straightedge", t: "Construcciones geométricas: bisectriz perpendicular" }, { yt: "m6wGnNo3cxs", khan: "geometry/hs-geo-congruence/hs-geo-bisectors/v/constructing-an-angle-bisector-using-a-compass-and-straightedge", t: "Construcciones geométricas: bisectriz de un ángulo" }]
  },
  M2: {
    i0: [{ yt: "KNSiqEDyxQA", khan: "geometry/hs-geo-congruence/xff63fac4:hs-geo-congruent-triangles/v/other-triangle-congruence-postulates", t: "Criterio de congruencia de triángulos" }],
    i1: [{ yt: "QQFkYdGROc8", khan: "geometry/hs-geo-congruence/hs-geo-working-with-triangles/v/figuring-out-all-the-angles-for-congruent-triangles-example", t: "Ángulos correspondientes en triángulos congruentes" }],
    i2: [{ yt: "E4og36kitUM", khan: "geometry/hs-geo-congruence/xff63fac4:hs-geo-congruent-triangles/v/congruent-triangles-and-sss", t: "Partes correspondientes de triángulos congruentes" }],
    i3: [{ yt: "DvL3gNBkFeE", khan: "geometry/hs-geo-congruence/hs-geo-triangle-congruence/v/more-on-why-ssa-is-not-a-postulate", t: "¿Por qué LLA no es un criterio de congruencia?" }],
    i4: [{ yt: "xRMA0b7trTQ", khan: "basic-geo/basic-geo-angle/angles-between-lines/v/angles-formed-by-parallel-lines-and-transversals", t: "Ángulos, rectas paralelas y transversales" }, { yt: "4KLnSvc5dJI", khan: "basic-geo/basic-geo-angle/vert-comp-supp-angles/v/angles-at-the-intersection-of-two-lines", t: "Ángulos opuestos por el vértice" }],
    i5: [{ yt: "5ThbO2EqoIo", khan: "geometry/hs-geo-congruence/hs-geo-triangle-theorems/v/congruent-triangle-example-2", t: "Problema de demostración geométrica" }]
  },
  M3: {
    i0: [{ yt: "1-zCAS4drzI", khan: "geometry/hs-geo-similarity/hs-geo-similarity-definitions/v/testing-similarity-through-transformations", t: "Figuras semejantes y transformaciones" }],
    i1: [{ yt: "rp1ilWKKGu4", khan: "geometry/hs-geo-similarity/hs-geo-solving-similar-triangles/v/similarity-example-problems", t: "Resolver triángulos semejantes" }],
    i2: [{ yt: "QUsrV1tCEyU", khan: "geometry/hs-geo-similarity/hs-geo-triangle-similarity-intro/v/similarity-postulates", t: "Criterios para semejanza de triángulos" }],
    i3: [{ yt: "Azf-dWI-g_M", khan: "geometry/hs-geo-similarity/xff63fac4:hs-geo-proving-relationships-using-similarity/v/proof-parallel-lines-divide-triangle-sides-proportionally", t: "Rectas paralelas dividen los lados en proporción" }]
  },
  M4: {
    i0: [{ yt: "kXCH4JfwME0", khan: "geometry/hs-geo-transformations/hs-geo-translations/v/translating-points", t: "Trasladar puntos" }],
    i1: [{ yt: "zTYeEon1Wms", khan: "geometry/hs-geo-transformations/hs-geo-reflections/v/reflecting-points", t: "Reflejar puntos" }],
    i2: [{ yt: "F5hKGoUSVyU", khan: "geometry/hs-geo-transformations/hs-geo-rotations/v/rotating-points", t: "Rotar puntos" }],
    i3: [{ yt: "-3Y4J7rtDYQ", khan: "geometry/xff63fac4:hs-geo-transformation-properties-and-proofs/hs-geo-transformations-definitions/v/sequences-of-transformations", t: "Secuencias de transformaciones" }]
  },
  M5: {
    i0: [{ yt: "NfTMj3DktbA", khan: "geometry/hs-geo-circles/hs-geo-arc-measures/v/intro-arc-measure", t: "Introducción a la medición de arcos" }],
    i1: [{ yt: "pxrrywcZeXw", khan: "geometry/hs-geo-circles/hs-geo-inscribed-angles/v/inscribed-angles-exercise-example", t: "Ángulos inscritos" }],
    i3: [{ yt: "ijH7nJBDtSs", khan: "geometry/hs-geo-circles/hs-geo-tangents/v/tangents-of-circles-exercise-examples", t: "Problema sobre tangentes de círculos" }],
    i4: [{ yt: "yhSGoGllD84", khan: "geometry/hs-geo-solids/hs-geo-solids-intro/v/cylinder-volume-and-surface-area", t: "Volumen y área de la superficie de un cilindro" }, { yt: "OhI20TC2MVc", khan: "geometry/hs-geo-solids/hs-geo-solids-intro/v/volume-of-a-sphere", t: "Volumen de una esfera" }],
    i5: [{ yt: "wYTunl4omzI", khan: "geometry/hs-geo-circles/xff63fac4:hs-geo-proofs-with-inscribed-shapes/v/perpendicular-radius-bisects-chord", t: "Radio perpendicular biseca una cuerda" }]
  },
  M6: {
    i0: [{ yt: "OS2UhXETv8E", khan: "pre-algebra/pre-algebra-arith-prop/pre-algebra-ditributive-property/v/the-distributive-property", t: "Propiedad distributiva" }],
    i1: [{ yt: "1aDcwjmjeRo", khan: "algebra/x2f8bb11595b61c86:systems-of-equations/x2f8bb11595b61c86:solving-systems-of-equations-with-substitution/v/solving-systems-with-substitution", t: "Sistemas de ecuaciones por sustitución" }, { yt: "4yYt9gtgr0w", khan: "algebra/x2f8bb11595b61c86:systems-of-equations/x2f8bb11595b61c86:solving-systems-elimination/v/king-s-cupcakes-solving-systems-by-elimination", t: "Sistemas de ecuaciones por eliminación" }],
    i2: [{ yt: "3iHxrb4sy8s", khan: "precalculus/x9e81a4f98389efdf:matrices/x9e81a4f98389efdf:adding-and-subtracting-matrices/v/matrix-addition-and-subtraction-1", t: "Sumar y restar matrices" }, { yt: "Rz4XWN4eJ-Q", khan: "precalculus/x9e81a4f98389efdf:matrices/x9e81a4f98389efdf:multiplying-matrices-by-matrices/v/matrix-multiplication-intro", t: "Introducción a la multiplicación de matrices" }],
    i3: [{ yt: "JDP3mGgBp68", khan: "statistics-probability/probability-library/basic-theoretical-probability/v/basic-probability", t: "Introducción a la probabilidad teórica" }, { yt: "qO7qSC7BK8s", khan: "precalculus/x9e81a4f98389efdf:prob-comb/x9e81a4f98389efdf:expected-value/v/expected-value-of-a-discrete-random-variable", t: "Valor esperado de una variable aleatoria" }],
    i4: [{ yt: "EoABWierj_w", khan: "pre-algebra/pre-algebra-equations-expressions/pre-algebra-substitution/v/evaluating-expressions-in-two-variables", t: "Evaluar expresiones con dos variables" }]
  }
};
