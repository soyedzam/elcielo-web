/* EL CIELO EN MI CIUDAD · tablero de resultados de la encuesta.

   Mismo patrón de seguridad que el tablero de asistencia: la contraseña
   se verifica EN EL SERVIDOR (Apps Script) y los datos solo salen si
   pasa. Esta página no guarda la clave más allá de la sesión ni decide
   nada por su cuenta — si el servidor dice que no, aquí no hay datos.

   Nombre y contacto NUNCA llegan a esta pantalla, aunque estén en la
   hoja: un tablero se proyecta y se comparte, y una respuesta honesta
   deja de serlo si la persona sabe que su nombre viaja pegado a ella. */

(function () {
  'use strict';

  var cfg = window.ELCIELO || {};
  var CLAVE_SESION = 'elcielo-res-clave';
  var REFRESCO_MS = 60000;

  var clave = '';
  var respuestas = [];
  var campoAbierto = 'cambiar';
  var temporizador = null;

  function $(id) { return document.getElementById(id); }
  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ── Datos simulados ──────────────────────────────────────────────
     Solo con ?demo=1 en la URL, y la pantalla lo grita: sirve para
     enseñar cómo se verá el tablero antes de tener respuestas reales.
     Jamás se mezcla con datos de verdad — o es demo, o es real. */
  function esDemo() {
    return /[?&]demo=1/.test(location.search);
  }

  function datosSimulados() {
    var canales = ['Alguien me invitó', 'En la comunidad', 'Redes sociales', 'WhatsApp', 'Otro'];
    var pesos = [10, 7, 5, 3, 1];
    var palabras = ['Renovada', 'Paz', 'Gratitud', 'Esperanza', 'Fuego', 'Paz', 'Gratitud',
                    'Familia', 'Renovada', 'Propósito', 'Paz', 'Alegría', 'Esperanza', 'Gratitud'];
    var cambios = [
      'Que empiece un poco más temprano el viernes, se hizo noche para volver a casa.',
      'Más ventiladores, el calor del sábado pegó fuerte.',
      'La fila de la entrada el primer día estuvo lenta, después ya fluyó.',
      'Nada, de verdad. Tal vez que dure un día más.',
      'Que avisen antes el horario exacto, me confundí con el del domingo.',
      'Más sillas en la parte de atrás.'
    ];
    var quedas = [
      'La alabanza. No cambien eso nunca.',
      'El ambiente de la gente, se sentía distinto.',
      'Las conferencias del pastor Ofir, cada una me dejó algo.',
      'Que sea gratis y abierto para todos.',
      'La cercanía, no se sintió como un evento grande y frío.',
      'El momento de oración del domingo.'
    ];
    var lista = [];
    for (var i = 0; i < 14; i++) {
      var canal = canales[0];
      var r = Math.floor((i * 37) % 26);
      var acc = 0;
      for (var c = 0; c < pesos.length; c++) { acc += pesos[c]; if (r < acc) { canal = canales[c]; break; } }
      lista.push({
        fecha: '17 ago · ' + (9 + (i % 12)) + ':' + (i % 6) + '5',
        dias: ['viernes', 'sábado', 'domingo', 'viernes, sábado', 'sábado, domingo', 'viernes, sábado, domingo'][i % 6],
        recomienda: [5, 5, 4, 5, 4, 5, 3, 5, 4, 5, 5, 4, 5, 2][i],
        notas: {
          alabanza:     [5, 5, 5, 4, 5, 5, 4, 5, 5, 5, 4, 5, 5, 4][i],
          conferencias: [5, 4, 5, 5, 5, 4, 4, 5, 5, 4, 5, 5, 4, 3][i],
          acceso:       [3, 4, 3, 4, 2, 3, 3, 4, 3, 3, 4, 2, 3, 3][i],
          lugar:        [4, 3, 4, 4, 3, 4, 3, 4, 4, 3, 4, 3, 4, 2][i],
          info:         [4, 5, 4, 4, 4, 5, 3, 4, 5, 4, 4, 4, 5, 3][i]
        },
        entero: canal,
        cambiar: i < cambios.length ? cambios[i] : '',
        faltar: i < quedas.length ? quedas[i] : '',
        volver: ['Sí', 'Sí', 'Creo que sí', 'Sí', 'Sí', 'Sí', 'No sé', 'Sí', 'Sí', 'Sí', 'Creo que sí', 'Sí', 'Sí', 'No sé'][i],
        palabra: palabras[i]
      });
    }
    return lista;
  }

  /* ── Entrada ──────────────────────────────────────────────────── */

  /* Entrada pública: sin depender del campo de contraseña (que ni
     siquiera se pinta en este modo). Si Apps Script se desincroniza y
     ya no es público, pedirDatos('') simplemente vuelve con
     error:'clave' — se muestra la puerta normal en vez de romperse. */
  function entrarPublico() {
    pedirDatos('').then(function (r) {
      if (!r.ok) { mostrarPuertaConError('El tablero ya no es público — se necesita la contraseña del equipo.'); return; }
      respuestas = r.respuestas || [];
      abrirPanel();
      pintar();
      arrancarRefresco();
    }).catch(function () {
      mostrarPuertaConError('No se pudieron cargar los resultados. Revisa tu conexión e inténtalo otra vez.');
    });
  }

  function mostrarPuertaConError(msg) {
    $('js-puerta').hidden = false;
    $('js-panel').hidden = true;
    error(msg);
  }

  function entrar(ev) {
    if (ev) ev.preventDefault();

    if (esDemo()) {                       // el demo no pide contraseña: no hay dato real que proteger
      respuestas = datosSimulados();
      abrirPanel();
      pintar();
      return;
    }

    var valor = $('clave').value;
    if (!valor) return;
    var btn = $('js-entrar');
    btn.disabled = true;
    btn.textContent = 'Verificando…';
    error('');

    pedirDatos(valor).then(function (r) {
      btn.disabled = false;
      btn.textContent = 'Entrar';
      if (!r.ok) {
        error(r.error === 'clave'
          ? 'Contraseña incorrecta.'
          : 'No se pudieron leer los resultados. Revisa tu conexión e inténtalo otra vez.');
        return;
      }
      clave = valor;
      try { sessionStorage.setItem(CLAVE_SESION, valor); } catch (e) { /* modo privado */ }
      respuestas = r.respuestas || [];
      abrirPanel();
      pintar();
      arrancarRefresco();
    }).catch(function () {
      btn.disabled = false;
      btn.textContent = 'Entrar';
      /* El backend viejo no conoce datosEvaluacion: en vez de un error
         genérico, se dice exactamente qué falta y qué hacer. */
      error('El servidor todavía no tiene la función de resultados. Hay que publicar la nueva versión del Apps Script (ver el Pase de Sesión) y volver a intentar.');
    });
  }

  /* google.script.run no existe aquí (esto no vive dentro de Apps
     Script), así que se llama por fetch a la misma URL del registro. */
  function pedirDatos(valor) {
    if (!cfg.urlRegistro) return Promise.reject(new Error('sin-url'));
    return fetch(cfg.urlRegistro, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ accion: 'resultados', clave: valor })
    }).then(function (resp) { return resp.json(); });
  }

  function error(msg) {
    var el = $('js-err');
    if (!el) return;
    el.textContent = msg;
    el.hidden = !msg;
  }

  function abrirPanel() {
    $('js-puerta').hidden = true;
    $('js-panel').hidden = false;
    if (esDemo()) marcarDemo();
  }

  function marcarDemo() {
    var vivo = $('js-vivo');
    if (!vivo) return;
    vivo.classList.add('es-demo');
    $('js-vivo-txt').textContent = 'Datos simulados';
    vivo.title = 'Ejemplo para ver el tablero — ninguna cifra es real';
  }

  /* ── Cálculo ──────────────────────────────────────────────────── */

  function promedio(nums) {
    var v = nums.filter(function (n) { return n > 0; });
    if (!v.length) return 0;
    return v.reduce(function (a, b) { return a + b; }, 0) / v.length;
  }

  function conteo(valores) {
    var mapa = {};
    valores.forEach(function (v) {
      var k = String(v || '').trim();
      if (!k) return;
      mapa[k] = (mapa[k] || 0) + 1;
    });
    return Object.keys(mapa)
      .map(function (k) { return { etiqueta: k, n: mapa[k] }; })
      .sort(function (a, b) { return b.n - a.n; });
  }

  var PARTES = [
    { k: 'alabanza', nombre: 'La alabanza' },
    { k: 'conferencias', nombre: 'Las conferencias' },
    { k: 'acceso', nombre: 'Acceso y registro' },
    { k: 'lugar', nombre: 'El lugar' },
    { k: 'info', nombre: 'Información previa' }
  ];

  /* ── Pintado ──────────────────────────────────────────────────── */

  function pintar() {
    if (!respuestas.length) {
      $('js-res-vacio').hidden = false;
      $('js-res-datos').hidden = true;
      return;
    }
    $('js-res-vacio').hidden = true;
    $('js-res-datos').hidden = false;

    pintarKpis();
    pintarPartes();
    pintarCanales();
    pintarDias();
    pintarPalabras();
    pintarCitas();

    $('k-actualizado').textContent = 'Actualizado ' + new Intl.DateTimeFormat('es-MX', {
      hour: 'numeric', minute: '2-digit', timeZone: 'America/Merida'
    }).format(new Date());
  }

  function pintarKpis() {
    var total = respuestas.length;
    $('k-total').textContent = total;
    $('k-total-pie').textContent = total === 1 ? 'persona contestó' : 'personas contestaron';

    // Índice de recomendación 0-100 a partir de la escala 1-5. Se usa un
    // índice y no el NPS clásico porque la pregunta no es de 0 a 10:
    // presentarlo como "NPS" sería comparar contra una vara que no aplica.
    var promReco = promedio(respuestas.map(function (r) { return r.recomienda; }));
    var indice = promReco ? Math.round(((promReco - 1) / 4) * 100) : 0;
    $('k-nps').textContent = indice;
    $('k-nps-fill').style.width = indice + '%';
    $('k-nps-fill').className = 'res-medidor-fill ' + tono(indice);

    var volveria = respuestas.filter(function (r) {
      return r.volver === 'Sí' || r.volver === 'Creo que sí';
    }).length;
    var pctVolver = total ? Math.round(volveria / total * 100) : 0;
    $('k-volver').textContent = pctVolver + '%';
    $('k-volver-pie').textContent = volveria + ' de ' + total + ' dijeron que sí';
    $('k-volver-fill').style.width = pctVolver + '%';
    $('k-volver-fill').className = 'res-medidor-fill ' + tono(pctVolver);

    var todas = [];
    respuestas.forEach(function (r) {
      PARTES.forEach(function (p) { if (r.notas[p.k] > 0) todas.push(r.notas[p.k]); });
    });
    var prom = promedio(todas);
    $('k-prom').textContent = prom ? prom.toFixed(1) : '—';
    $('k-prom-estrellas').innerHTML = estrellasHtml(prom);
  }

  function tono(pct) {
    if (pct >= 75) return 'es-bien';
    if (pct >= 50) return 'es-medio';
    return 'es-mal';
  }

  function estrellasHtml(prom) {
    var html = '';
    for (var n = 1; n <= 5; n++) {
      var llena = prom >= n - 0.25;
      html += '<span class="res-estrella' + (llena ? ' es-llena' : '') + '">' +
        '<svg viewBox="0 0 24 24"><path d="M12 2.6l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.4l-5.8 3.06 1.1-6.46-4.69-4.58 6.49-.94L12 2.6z"/></svg></span>';
    }
    return html;
  }

  function pintarPartes() {
    var datos = PARTES.map(function (p) {
      return { nombre: p.nombre, prom: promedio(respuestas.map(function (r) { return r.notas[p.k]; })) };
    }).filter(function (d) { return d.prom > 0; })
      .sort(function (a, b) { return b.prom - a.prom; });

    $('k-partes').innerHTML = datos.map(function (d) {
      var pct = (d.prom / 5) * 100;
      return '<div class="res-barra-fila">' +
        '<span class="res-barra-l">' + esc(d.nombre) + '</span>' +
        '<div class="res-barra-pista"><div class="res-barra-fill ' + tono(pct) + '" style="width:' + pct + '%"></div></div>' +
        '<b class="res-barra-n tabular">' + d.prom.toFixed(1) + '</b>' +
        '</div>';
    }).join('');

    // La lectura del tablero: qué hacer con esto, no solo qué dice.
    if (datos.length >= 2) {
      var mejor = datos[0], peor = datos[datos.length - 1];
      var txt = '<b>' + esc(mejor.nombre) + '</b> es lo más fuerte (' + mejor.prom.toFixed(1) + ').';
      if (peor.prom < 4) {
        txt += ' <b>' + esc(peor.nombre) + '</b> es lo que más margen tiene (' + peor.prom.toFixed(1) +
               ') — ahí está la mejora más barata para la siguiente edición.';
      } else {
        txt += ' Ninguna parte baja de 4: no hay un punto débil claro que atacar.';
      }
      $('k-partes-lectura').innerHTML = txt;
    } else {
      $('k-partes-lectura').textContent = '';
    }
  }

  function barrasSimples(contenedorId, datos, total) {
    var max = datos.reduce(function (m, d) { return Math.max(m, d.n); }, 0) || 1;
    $(contenedorId).innerHTML = datos.map(function (d) {
      var pct = (d.n / max) * 100;
      var pctReal = total ? Math.round(d.n / total * 100) : 0;
      return '<div class="res-barra-fila">' +
        '<span class="res-barra-l">' + esc(d.etiqueta) + '</span>' +
        '<div class="res-barra-pista"><div class="res-barra-fill es-neutro" style="width:' + pct + '%"></div></div>' +
        '<b class="res-barra-n tabular">' + d.n + ' <span class="res-barra-pct">' + pctReal + '%</span></b>' +
        '</div>';
    }).join('') || '<p class="res-sin">Sin datos todavía.</p>';
  }

  function pintarCanales() {
    barrasSimples('k-canales', conteo(respuestas.map(function (r) { return r.entero; })), respuestas.length);
  }

  function pintarDias() {
    // "dias" viene como texto ("viernes, sábado") — se cuenta cada día
    // por separado, no la combinación, que no diría nada útil.
    var cuenta = { 'Viernes 14': 0, 'Sábado 15': 0, 'Domingo 16': 0 };
    respuestas.forEach(function (r) {
      var t = String(r.dias || '').toLowerCase();
      if (t.indexOf('viernes') > -1) cuenta['Viernes 14']++;
      if (t.indexOf('sábado') > -1 || t.indexOf('sabado') > -1) cuenta['Sábado 15']++;
      if (t.indexOf('domingo') > -1) cuenta['Domingo 16']++;
    });
    var datos = Object.keys(cuenta)
      .map(function (k) { return { etiqueta: k, n: cuenta[k] }; })
      .filter(function (d) { return d.n > 0; });
    barrasSimples('k-dias', datos, respuestas.length);
  }

  function pintarPalabras() {
    var datos = conteo(respuestas.map(function (r) {
      var p = String(r.palabra || '').trim();
      return p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : '';
    }));
    if (!datos.length) {
      $('k-palabras').innerHTML = '<p class="res-sin">Nadie ha dejado su palabra todavía.</p>';
      return;
    }
    var max = datos[0].n;
    $('k-palabras').innerHTML = datos.map(function (d) {
      // Tamaño proporcional, con piso: una palabra dicha una vez sigue
      // siendo legible, no un punto diminuto.
      var escala = 1 + (d.n / max) * 1.4;
      return '<span class="res-palabra" style="font-size:' + escala.toFixed(2) + 'rem' +
        (d.n === max ? ';color:var(--lx-amber)' : '') + '" title="' +
        d.n + (d.n === 1 ? ' vez' : ' veces') + '">' + esc(d.etiqueta) + '</span>';
    }).join('');
  }

  function pintarCitas() {
    var textos = respuestas
      .map(function (r) { return String(r[campoAbierto] || '').trim(); })
      .filter(function (t) { return t.length > 2; });

    if (!textos.length) {
      $('k-citas').innerHTML = '<p class="res-sin">Nadie ha escrito nada en esta pregunta todavía.</p>';
      return;
    }
    $('k-citas').innerHTML = textos.map(function (t) {
      return '<blockquote class="res-cita">' + esc(t) + '</blockquote>';
    }).join('');
  }

  /* ── Refresco en vivo ─────────────────────────────────────────── */

  function arrancarRefresco() {
    if (temporizador) clearInterval(temporizador);
    temporizador = setInterval(function () {
      if (document.hidden) return;         // no gasta batería en segundo plano
      pedirDatos(clave).then(function (r) {
        if (r.ok) { respuestas = r.respuestas || []; pintar(); }
      }).catch(function () { /* un fallo puntual no tumba el tablero */ });
    }, REFRESCO_MS);
  }

  /* ── Arranque ─────────────────────────────────────────────────── */

  $('js-form-clave').addEventListener('submit', entrar);

  $('js-refrescar').addEventListener('click', function () {
    if (esDemo()) { pintar(); return; }
    pedirDatos(clave).then(function (r) {
      if (r.ok) { respuestas = r.respuestas || []; pintar(); }
    }).catch(function () { /* silencioso */ });
  });

  $('js-salir').addEventListener('click', function () {
    try { sessionStorage.removeItem(CLAVE_SESION); } catch (e) { /* nada */ }
    location.href = location.pathname;
  });

  document.querySelectorAll('.res-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      campoAbierto = tab.getAttribute('data-campo');
      document.querySelectorAll('.res-tab').forEach(function (t) {
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      pintarCitas();
    });
  });

  // Demo, o el sitio marcado como público (config.resultadosPublico):
  // entra directo, sin puerta. El público real solo aplica si Apps
  // Script TAMBIÉN trae RESULTADOS_PUBLICO=true — si algún día se
  // desincroniza, el servidor manda y esto simplemente pedirá la clave.
  if (esDemo()) {
    entrar();
  } else if (cfg.resultadosPublico) {
    entrarPublico();
  } else {
    // Sesión ya abierta en esta pestaña: no vuelve a pedir la clave.
    try {
      var guardada = sessionStorage.getItem(CLAVE_SESION);
      if (guardada) { $('clave').value = guardada; entrar(); }
    } catch (e) { /* modo privado */ }
  }
})();
