/*
 * Laboratorio de Física 3D - Descargas para el profesor
 *
 * Cuatro salidas:
 *   1. CSV con las mediciones tomadas en una estación
 *   2. Reporte del estudiante listo para imprimir o guardar como PDF
 *   3. Guía didáctica para el profesor, generada desde las mismas
 *      definiciones de las estaciones para que nunca se desincronice
 *   4. El laboratorio completo en un solo archivo HTML que funciona
 *      sin conexión
 */
(function (global) {
  'use strict';

  var URL_THREE = 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js';

  /* ------------------------------------------------------------------ *
   * Descarga genérica de un archivo de texto
   * ------------------------------------------------------------------ */

  function descargarTexto(nombre, contenido, tipo) {
    var blob = new Blob([contenido], { type: (tipo || 'text/plain') + ';charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  function fechaCorta() {
    var d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function escapar(texto) {
    return String(texto)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ------------------------------------------------------------------ *
   * 1. CSV de mediciones
   * ------------------------------------------------------------------ */

  function celdaCSV(valor) {
    var s = String(valor == null ? '' : valor);
    if (s.indexOf(';') >= 0 || s.indexOf('"') >= 0 || s.indexOf('\n') >= 0) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  // Se usa punto y coma como separador porque es lo que abre bien Excel
  // en configuración regional de español sin pedir importar nada.
  function csvDeEstacion(estacion, estudiante) {
    var columnas = estacion.columnas();
    var lineas = [];

    lineas.push(celdaCSV('Laboratorio de Física 3D'));
    lineas.push(celdaCSV('Estación') + ';' + celdaCSV(estacion.numero + '. ' + estacion.titulo));
    lineas.push(celdaCSV('Estudiante') + ';' + celdaCSV(estudiante.nombre || 'sin nombre'));
    lineas.push(celdaCSV('Grupo') + ';' + celdaCSV(estudiante.grupo || 'sin grupo'));
    lineas.push(celdaCSV('Fecha') + ';' + celdaCSV(new Date().toLocaleString('es')));
    lineas.push('');

    lineas.push(columnas.map(function (c) { return celdaCSV(c.etiqueta); }).join(';'));

    estacion.historial.forEach(function (fila) {
      lineas.push(columnas.map(function (c) {
        var v = fila[c.clave];
        if (typeof v === 'number' && c.decimales != null) {
          // Coma decimal para que Excel en español lo lea como número.
          return celdaCSV(v.toFixed(c.decimales).replace('.', ','));
        }
        return celdaCSV(v);
      }).join(';'));
    });

    return lineas.join('\n');
  }

  function descargarCSV(estacion, estudiante) {
    if (!estacion.historial.length) {
      return { ok: false, mensaje: 'Todavía no hay mediciones en esta estación. Corre el experimento al menos una vez.' };
    }
    // El BOM hace que Excel reconozca los acentos.
    descargarTexto(
      'datos-' + estacion.id + '-' + fechaCorta() + '.csv',
      '﻿' + csvDeEstacion(estacion, estudiante),
      'text/csv'
    );
    return { ok: true, mensaje: 'Se descargaron ' + estacion.historial.length + ' mediciones en formato CSV.' };
  }

  // CSV con todas las estaciones que tengan datos, una tabla tras otra.
  function descargarCSVCompleto(estaciones, estudiante) {
    var conDatos = estaciones.filter(function (e) { return e.historial.length; });
    if (!conDatos.length) {
      return { ok: false, mensaje: 'Todavía no hay mediciones en ninguna estación.' };
    }
    var partes = conDatos.map(function (e) { return csvDeEstacion(e, estudiante); });
    descargarTexto(
      'datos-laboratorio-completo-' + fechaCorta() + '.csv',
      '﻿' + partes.join('\n\n\n'),
      'text/csv'
    );
    return { ok: true, mensaje: 'Se descargaron los datos de ' + conDatos.length + ' estaciones.' };
  }

  /* ------------------------------------------------------------------ *
   * Hoja de estilos compartida por el reporte y la guía
   * ------------------------------------------------------------------ */

  var ESTILO_IMPRESION = [
    '@page { margin: 18mm 16mm; }',
    'body { font-family: "Iowan Old Style", Georgia, "Times New Roman", serif;',
    '  color: #16202c; line-height: 1.55; max-width: 800px; margin: 0 auto; padding: 24px; }',
    'h1 { font-size: 25px; margin: 0 0 4px; letter-spacing: -0.01em; }',
    'h2 { font-size: 17px; margin: 26px 0 8px; padding-bottom: 5px;',
    '  border-bottom: 2px solid #16202c; page-break-after: avoid; }',
    'h3 { font-size: 14px; margin: 16px 0 6px; page-break-after: avoid; }',
    '.sub { color: #5a6675; font-size: 13px; margin: 0 0 18px; }',
    '.cabecera { border-bottom: 3px double #16202c; padding-bottom: 12px; margin-bottom: 18px; }',
    '.ficha { display: flex; flex-wrap: wrap; gap: 10px 28px; font-size: 13px; margin: 12px 0 0; }',
    '.ficha div { min-width: 150px; }',
    '.ficha b { display: block; font-size: 10px; text-transform: uppercase;',
    '  letter-spacing: 0.09em; color: #6b7887; font-weight: 600; }',
    'table { width: 100%; border-collapse: collapse; font-size: 11.5px; margin: 10px 0 18px;',
    '  font-family: "SF Mono", Menlo, Consolas, monospace; page-break-inside: avoid; }',
    'th { background: #eef1f5; text-align: left; padding: 6px 8px; border: 1px solid #c3ccd7;',
    '  font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; }',
    'td { padding: 5px 8px; border: 1px solid #d5dce4; }',
    'tr:nth-child(even) td { background: #f8fafc; }',
    '.ok { color: #1b7a3d; font-weight: 700; }',
    '.no { color: #a8452f; }',
    '.caja { border: 1px solid #c3ccd7; border-left: 4px solid #16202c;',
    '  padding: 10px 14px; margin: 10px 0; page-break-inside: avoid; background: #fbfcfd; }',
    '.formula { font-family: "SF Mono", Menlo, Consolas, monospace; background: #eef1f5;',
    '  padding: 2px 6px; border-radius: 3px; font-size: 12px; }',
    '.respuesta { font-family: "SF Mono", Menlo, Consolas, monospace; font-size: 12px;',
    '  background: #f2f7f3; border: 1px dashed #7fa88c; padding: 8px 12px; margin: 6px 0; }',
    '.lineas { border-bottom: 1px solid #aab5c2; height: 22px; margin: 4px 0; }',
    '.pie { margin-top: 28px; padding-top: 10px; border-top: 1px solid #c3ccd7;',
    '  font-size: 10.5px; color: #6b7887; }',
    '@media print { .noimprimir { display: none !important; } body { padding: 0; } }',
    '.noimprimir { position: fixed; top: 14px; right: 14px; display: flex; gap: 8px; }',
    '.noimprimir button { font: 600 13px system-ui, sans-serif; padding: 9px 16px;',
    '  border: 0; border-radius: 7px; background: #16202c; color: #fff; cursor: pointer; }',
    '.noimprimir button.alt { background: #fff; color: #16202c; border: 1px solid #c3ccd7; }'
  ].join('\n');

  function abrirParaImprimir(titulo, cuerpo) {
    var ventana = window.open('', '_blank');
    if (!ventana) {
      return { ok: false, mensaje: 'El navegador bloqueó la ventana. Permite las ventanas emergentes de este sitio y vuelve a intentarlo.' };
    }
    ventana.document.write(
      '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">' +
      '<title>' + escapar(titulo) + '</title><style>' + ESTILO_IMPRESION + '</style></head><body>' +
      '<div class="noimprimir">' +
      '<button onclick="window.print()">Guardar como PDF o imprimir</button>' +
      '<button class="alt" onclick="window.close()">Cerrar</button></div>' +
      cuerpo + '</body></html>'
    );
    ventana.document.close();
    return { ok: true, mensaje: 'Se abrió el documento en una pestaña nueva. Usa el botón de imprimir y elige "Guardar como PDF".' };
  }

  /* ------------------------------------------------------------------ *
   * 2. Reporte del estudiante
   * ------------------------------------------------------------------ */

  function reporteEstudiante(estaciones, progreso) {
    var est = progreso.estudiante;
    var filas = progreso.resumen();
    var hechas = progreso.totalCompletadas();
    var total = progreso.totalMisiones();
    var nivel = progreso.nivel();

    var h = [];
    h.push('<div class="cabecera">');
    h.push('<h1>Reporte de laboratorio de física</h1>');
    h.push('<p class="sub">Laboratorio virtual en tres dimensiones</p>');
    h.push('<div class="ficha">');
    h.push('<div><b>Estudiante</b>' + escapar(est.nombre || '_______________________') + '</div>');
    h.push('<div><b>Grupo</b>' + escapar(est.grupo || '____________') + '</div>');
    h.push('<div><b>Fecha</b>' + new Date().toLocaleDateString('es') + '</div>');
    h.push('<div><b>Misiones resueltas</b>' + hechas + ' de ' + total + '</div>');
    h.push('<div><b>Puntaje</b>' + progreso.puntajeTotal() + ' de ' + progreso.puntajeMaximo() + '</div>');
    h.push('<div><b>Nivel alcanzado</b>' + nivel.nombre + '</div>');
    h.push('</div></div>');

    // Desempeño por misión.
    h.push('<h2>Misiones</h2>');
    h.push('<table><thead><tr><th>Estación</th><th>Tipo</th><th>Estado</th>' +
           '<th>Intentos</th><th>Respuesta</th><th>Valor correcto</th><th>Puntos</th></tr></thead><tbody>');
    filas.forEach(function (f) {
      h.push('<tr>' +
        '<td>' + escapar(f.estacion) + '</td>' +
        '<td>' + f.tipo + '</td>' +
        '<td class="' + (f.completada ? 'ok' : 'no') + '">' + (f.completada ? 'Resuelta' : 'Pendiente') + '</td>' +
        '<td>' + f.intentos + '</td>' +
        '<td>' + (f.respuesta != null ? global.Progreso.formatear(f.respuesta) : '') + '</td>' +
        '<td>' + (f.valorCorrecto != null ? global.Progreso.formatear(f.valorCorrecto) : '') + '</td>' +
        '<td>' + f.puntos + '</td>' +
        '</tr>');
    });
    h.push('</tbody></table>');

    // Mediciones tomadas en cada estación.
    var conDatos = estaciones.filter(function (e) { return e.historial.length; });
    if (conDatos.length) {
      h.push('<h2>Mediciones registradas</h2>');
      conDatos.forEach(function (e) {
        h.push('<h3>' + e.numero + '. ' + escapar(e.titulo) + '</h3>');
        var cols = e.columnas();
        h.push('<table><thead><tr>');
        cols.forEach(function (c) { h.push('<th>' + escapar(c.etiqueta) + '</th>'); });
        h.push('</tr></thead><tbody>');
        e.historial.forEach(function (fila) {
          h.push('<tr>');
          cols.forEach(function (c) {
            var v = fila[c.clave];
            if (typeof v === 'number' && c.decimales != null) v = v.toFixed(c.decimales);
            h.push('<td>' + escapar(v == null ? '' : v) + '</td>');
          });
          h.push('</tr>');
        });
        h.push('</tbody></table>');
      });
    } else {
      h.push('<h2>Mediciones registradas</h2>');
      h.push('<div class="caja">No se registraron mediciones en esta sesión.</div>');
    }

    // Espacio para las conclusiones escritas a mano.
    h.push('<h2>Conclusiones del estudiante</h2>');
    h.push('<div class="caja"><b>Qué ley física comprobaste y con qué evidencia?</b>');
    for (var i = 0; i < 4; i++) h.push('<div class="lineas"></div>');
    h.push('</div>');
    h.push('<div class="caja"><b>Dónde no coincidió la teoría con la medición y por qué?</b>');
    for (var j = 0; j < 4; j++) h.push('<div class="lineas"></div>');
    h.push('</div>');

    h.push('<div class="pie">Generado por el laboratorio virtual de física en 3D. ' +
           'El puntaje descuenta 15 puntos por cada intento fallido, con un mínimo de 40 puntos por misión resuelta.</div>');

    return abrirParaImprimir('Reporte de laboratorio', h.join('\n'));
  }

  /* ------------------------------------------------------------------ *
   * 3. Guia didactica del profesor
   * ------------------------------------------------------------------ */

  function guiaDocente(estaciones) {
    var h = [];
    h.push('<div class="cabecera">');
    h.push('<h1>Guía didáctica del laboratorio de física 3D</h1>');
    h.push('<p class="sub">Material para el profesor, con respuestas. Generado el ' +
           new Date().toLocaleDateString('es') + '</p>');
    h.push('</div>');

    h.push('<h2>Cómo se usa en clase</h2>');
    h.push('<div class="caja">');
    h.push('<p><b>Movimiento:</b> el estudiante hace clic en el salón para entrar, camina con ' +
           'las teclas W, A, S y D, mira con el mouse y corre con shift. La tecla E abre la ' +
           'estación que tenga enfrente y la tecla escape libera el cursor.</p>');
    h.push('<p><b>Ritmo sugerido:</b> una estación por sesión de 50 minutos, o dos si el grupo ' +
           'ya domina el tema. Las misiones están en orden de dificultad y cada una se desbloquea ' +
           'al resolver la anterior.</p>');
    h.push('<p><b>Evaluación:</b> al final de la clase cada estudiante descarga su reporte en PDF ' +
           'y el archivo CSV con sus mediciones. El reporte trae el puntaje, los intentos por ' +
           'misión y espacio para conclusiones escritas a mano.</p>');
    h.push('<p><b>Sin internet:</b> descarga el laboratorio completo en un archivo HTML y cópialo ' +
           'a las computadoras del salón. Funciona con doble clic, sin instalar nada.</p>');
    h.push('</div>');

    estaciones.forEach(function (e) {
      h.push('<h2>' + e.numero + '. ' + escapar(e.titulo) + '</h2>');
      h.push('<p class="sub">' + escapar(e.subtitulo) + '</p>');
      h.push('<p>' + escapar(e.descripcion) + '</p>');

      h.push('<h3>Ecuaciones que se trabajan</h3><p>');
      e.ecuaciones.forEach(function (f) {
        h.push('<span class="formula">' + escapar(f) + '</span> ');
      });
      h.push('</p>');

      h.push('<h3>Controles disponibles</h3><table><thead><tr>' +
             '<th>Control</th><th>Rango</th><th>Unidad</th></tr></thead><tbody>');
      e.parametros.forEach(function (par) {
        var rango = par.tipo === 'opciones'
          ? par.opciones.map(function (o) { return o.etiqueta; }).join(', ')
          : par.min + ' a ' + par.max;
        h.push('<tr><td>' + escapar(par.etiqueta) + '</td><td>' + escapar(rango) +
               '</td><td>' + escapar(par.unidad || '') + '</td></tr>');
      });
      h.push('</tbody></table>');

      h.push('<h3>Misiones y respuestas</h3>');
      e.misiones.forEach(function (m, i) {
        h.push('<div class="caja">');
        h.push('<p><b>Misión ' + (i + 1) + ' (' + (m.tipo === 'prediccion' ? 'predicción numérica' : 'reto práctico') + ').</b> ' +
               escapar(m.enunciado) + '</p>');
        h.push('<p><b>Pista que ve el estudiante:</b> ' + escapar(m.pista || '') + '</p>');
        if (m.tipo === 'prediccion') {
          var valor = null;
          try { valor = m.objetivo(e); } catch (err) { valor = null; }
          h.push('<div class="respuesta"><b>Respuesta con los valores que trae el panel al abrirse:</b> ' +
                 (valor != null ? global.Progreso.formatear(valor) : 'depende de los controles') +
                 ' ' + escapar(m.entrada.unidad) +
                 '. Se acepta con ' + Math.round((m.tolerancia || 0.05) * 100) + ' por ciento de tolerancia.</div>');
          if (m.condicionPrevia) {
            h.push('<p><b>Condición previa:</b> ' + escapar(m.avisoPrevio || '') + '</p>');
          }
        } else {
          h.push('<div class="respuesta"><b>Cómo se logra:</b> ' + escapar(m.pista || '') + '</div>');
        }
        h.push('</div>');
      });

      h.push('<h3>Preguntas para discutir en voz alta</h3>');
      h.push('<div class="caja">' + preguntasDeDiscusion(e.id).map(function (q) {
        return '<p>' + escapar(q) + '</p>';
      }).join('') + '</div>');
    });

    h.push('<div class="pie">Guía generada automáticamente desde las definiciones de cada ' +
           'estación, por lo que siempre coincide con lo que ve el estudiante en pantalla.</div>');

    return abrirParaImprimir('Guía didáctica del laboratorio', h.join('\n'));
  }

  // Preguntas de cierre por estacion, pensadas para conversar en clase.
  function preguntasDeDiscusion(id) {
    var banco = {
      'caida-libre': [
        'Si la masa no aparece en la fórmula del tiempo de caída, ¿por qué en la vida real una pluma cae más lento que una piedra?',
        'En la Luna no hay aire. ¿Qué pasaría allí con la pluma y la piedra?',
        '¿Por qué el tiempo de caída crece con la raíz de la altura y no de forma proporcional?'
      ],
      'plano-inclinado': [
        '¿Por qué el bloque de 8 kg acelera igual que el de 0.5 kg si pesa dieciséis veces más?',
        '¿Qué información útil da el ángulo justo en el que el bloque empieza a moverse?',
        '¿Dónde se usa en la vida diaria el hecho de que una rampa reduzca la fuerza necesaria?'
      ],
      'pendulo': [
        'La fórmula del libro da un valor menor que el periodo real. ¿Eso significa que la fórmula está mal?',
        '¿Qué error aceptarían ustedes en un reloj de péndulo de una casa?',
        '¿Cómo usarían un péndulo para medir la gravedad del lugar donde están?'
      ],
      'colisiones': [
        'El momento se conservó incluso cuando se perdió energía. ¿A dónde se fue esa energía?',
        '¿Por qué los autos modernos se diseñan para deformarse en un choque en vez de rebotar?',
        '¿Qué pasa si un carro muy pesado choca con uno muy liviano que está quieto?'
      ],
      'proyectiles': [
        '¿Por qué 30 y 60 grados dan el mismo alcance, pero no el mismo tiempo de vuelo?',
        'Con resistencia del aire el ángulo óptimo baja de 45 grados. ¿Por qué?',
        '¿Cómo afecta al tiro el hecho de que el cañón esté a 1.2 m de altura y no en el piso?'
      ],
      'campo-electrico': [
        '¿Por qué las líneas de campo nunca se cruzan entre sí?',
        'En el punto medio entre dos cargas iguales el campo es cero, pero el potencial no. ¿Cómo se explica?',
        '¿Si el campo cae con el cuadrado de la distancia, a diez veces la distancia en cuánto queda?'
      ],
      'lorentz': [
        'La fuerza magnética no cambia la rapidez de la partícula. ¿Cómo puede entonces cambiar su movimiento?',
        '¿Por qué el periodo de giro no depende de qué tan rápido entre la partícula?',
        '¿Qué relación tiene esto con las auroras boreales y con un acelerador de partículas?'
      ]
    };
    return banco[id] || [];
  }

  /* ------------------------------------------------------------------ *
   * 4. Laboratorio completo en un archivo, para usar sin conexion
   *
   * Se descargan los mismos archivos que usa la pagina, se inserta el
   * contenido de cada uno dentro del HTML y se entrega un solo archivo.
   * ------------------------------------------------------------------ */

  function generarPortable(alProgresar) {
    var avisar = alProgresar || function () {};

    function traer(url) {
      return fetch(url, { cache: 'no-cache' }).then(function (r) {
        if (!r.ok) throw new Error('No se pudo leer ' + url + ' (código ' + r.status + ')');
        return r.text();
      });
    }

    avisar('Leyendo el laboratorio...');

    return traer('index.html').then(function (html) {
      // Lista de scripts propios en el mismo orden en que los carga la página.
      var scripts = [];
      var re = /<script\s+src="(js\/[^"]+)"><\/script>/g;
      var m;
      while ((m = re.exec(html)) !== null) scripts.push(m[1]);

      avisar('Descargando el motor 3D...');
      return Promise.all([
        traer(URL_THREE),
        traer('css/lab.css'),
        Promise.all(scripts.map(traer))
      ]).then(function (partes) {
        var three = partes[0];
        var css = partes[1];
        var codigos = partes[2];

        avisar('Armando el archivo...');

        // La hoja de estilos pasa a estar dentro del documento.
        var salida = html.replace(
          /<link rel="stylesheet" href="css\/lab\.css">/,
          '<style>\n' + css + '\n</style>'
        );

        // Fuera todo lo que necesite internet: tipografías y el CDN.
        salida = salida.replace(/<link[^>]+fonts\.(googleapis|gstatic)\.com[^>]*>/g, '');
        salida = salida.replace(/<script src="https:\/\/cdn\.jsdelivr\.net[^"]*"><\/script>/,
          '<script>\n' + three + '\n<\/script>');

        // Cada script propio se reemplaza por su contenido.
        scripts.forEach(function (ruta, i) {
          salida = salida.replace(
            '<script src="' + ruta + '"><\/script>',
            '<script>\n' + codigos[i] + '\n<\/script>'
          );
        });

        // Marca para que el laboratorio sepa que corre sin conexión.
        salida = salida.replace('<body>', '<body data-portable="1">');

        descargarTexto('laboratorio-fisica-3d-offline.html', salida, 'text/html');
        return {
          ok: true,
          mensaje: 'Listo. Se descargó el laboratorio completo en un archivo de ' +
            Math.round(salida.length / 1024) + ' KB. Funciona con doble clic, sin internet.'
        };
      });
    }).catch(function (err) {
      return {
        ok: false,
        mensaje: 'No se pudo generar el archivo: ' + err.message +
          '. Esta descarga necesita que la página esté abierta desde un servidor web, no desde un archivo local.'
      };
    });
  }

  global.Exportar = {
    descargarCSV: descargarCSV,
    descargarCSVCompleto: descargarCSVCompleto,
    reporteEstudiante: reporteEstudiante,
    guiaDocente: guiaDocente,
    generarPortable: generarPortable,
    descargarTexto: descargarTexto
  };
})(window);
