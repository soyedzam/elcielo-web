/* EL CIELO EN MI CIUDAD · encuesta de evaluación.

   Una pregunta a la vez, en la misma hoja de Apps Script que ya recibe
   los registros (hoja aparte, "Evaluación"). El patrón es el mismo del
   registro: si no hay urlRegistro configurada, la encuesta no promete
   nada que no pueda cumplir — avisa y manda al WhatsApp de siempre.

   Por qué una pregunta por pantalla y no un formulario largo: casi todo
   se contesta desde el teléfono, saliendo del congreso. Un muro de 15
   campos se abandona; ocho pantallas de un toque, no. */

const cfgE = window.ELCIELO || {};

const PASOS = 9;                 // 0 portada · 1-8 preguntas · 9 gracias
const PASO_GRACIAS = 9;
const CAMPOS_ESTRELLA = ['alabanza', 'conferencias', 'acceso', 'lugar', 'info'];
const CLAVE_LOCAL = 'elcielo-encuesta-enviada';

const fill = document.getElementById('js-enc-fill');
const botonEnviar = document.getElementById('js-enc-enviar');
const errorEnvio = document.getElementById('js-error-envio');

let pasoActual = 0;

/* ── Estrellas ────────────────────────────────────────────────────
   Se pintan desde JS y no en el HTML para no repetir 25 veces el mismo
   bloque a mano. Son radios de verdad (teclado y lector de pantalla
   funcionan); el relleno visual lo lleva data-valor en el contenedor. */
const ESTRELLA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.4l-5.8 3.06 1.1-6.46-4.69-4.58 6.49-.94L12 2.6z"/></svg>';
const ETIQUETA = { 1: 'Muy mal', 2: 'Regular', 3: 'Bien', 4: 'Muy bien', 5: 'Excelente' };

function pintarEstrellas() {
  document.querySelectorAll('.enc-fila').forEach(function (fila) {
    const campo = fila.getAttribute('data-campo');
    const caja = fila.querySelector('.enc-estrellas');
    if (!caja) return;
    let html = '';
    for (let n = 1; n <= 5; n++) {
      html +=
        '<label class="enc-estrella" title="' + ETIQUETA[n] + '">' +
          '<input type="radio" name="est-' + campo + '" value="' + n + '" aria-label="' + n + ' de 5 — ' + ETIQUETA[n] + '">' +
          ESTRELLA +
        '</label>';
    }
    caja.innerHTML = html;
    caja.addEventListener('change', function (ev) {
      caja.setAttribute('data-valor', ev.target.value);
    });
  });
}

/* ── Navegación ──────────────────────────────────────────────────── */

function seccion(n) {
  return document.querySelector('.enc-paso[data-paso="' + n + '"]');
}

function irA(n) {
  const desde = seccion(pasoActual);
  const hacia = seccion(n);
  if (!hacia) return;
  if (desde) { desde.hidden = true; desde.classList.remove('is-activo'); }
  hacia.hidden = false;
  // El siguiente cuadro deja que el navegador registre el hidden=false
  // antes de animar; sin esto la transición no corre y aparece de golpe.
  requestAnimationFrame(function () { hacia.classList.add('is-activo'); });
  pasoActual = n;
  actualizarProgreso();

  // Al principio de la pantalla, siempre — si la pregunta anterior era
  // larga, la siguiente aparecería a media altura.
  window.scrollTo({ top: 0, behavior: 'auto' });

  // El foco viaja con la pregunta: quien usa teclado o lector de
  // pantalla no se queda atrás en el paso anterior.
  const titulo = hacia.querySelector('.enc-preg, .lx-h1, .lx-h2');
  if (titulo) {
    titulo.setAttribute('tabindex', '-1');
    titulo.focus({ preventScroll: true });
  }
}

function actualizarProgreso() {
  if (!fill) return;
  // La portada no cuenta como avance, y "gracias" es el 100%.
  const pct = Math.min(Math.max(pasoActual, 0) / PASOS, 1) * 100;
  fill.style.width = pct + '%';
}

/* Las dos únicas preguntas que no dejamos pasar en blanco: sin día no
   se puede segmentar nada, y sin recomendación no hay métrica. Todo lo
   demás es opcional a propósito — pedir de más cuesta respuestas. */
function validarPaso(n) {
  if (n === 1) {
    const marcados = document.querySelectorAll('input[name="dias"]:checked').length;
    mostrarError('js-error-dias', marcados === 0);
    return marcados > 0;
  }
  if (n === 2) {
    const elegido = document.querySelector('input[name="recomienda"]:checked');
    mostrarError('js-error-reco', !elegido);
    return Boolean(elegido);
  }
  return true;
}

function mostrarError(id, mostrar) {
  const el = document.getElementById(id);
  if (el) el.hidden = !mostrar;
}

function siguiente() {
  if (!validarPaso(pasoActual)) return;
  irA(pasoActual + 1);
}

/* ── Lectura de respuestas ───────────────────────────────────────── */

function valorRadio(nombre) {
  const el = document.querySelector('input[name="' + nombre + '"]:checked');
  return el ? el.value : '';
}

function valorTexto(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function respuestas() {
  const dias = Array.from(document.querySelectorAll('input[name="dias"]:checked'))
    .map(function (c) { return c.value; });

  const notas = {};
  CAMPOS_ESTRELLA.forEach(function (campo) {
    notas[campo] = valorRadio('est-' + campo);
  });

  return {
    accion: 'evaluacion',
    sitio: valorTexto('f-sitio-enc'),          // trampa de robots
    dias: dias,
    recomienda: valorRadio('recomienda'),
    notas: notas,
    entero: valorRadio('entero'),
    cambiar: valorTexto('f-cambiar'),
    faltar: valorTexto('f-faltar'),
    volver: valorRadio('volver'),
    palabra: valorTexto('f-palabra'),
    nombre: valorTexto('f-nombre-enc'),
    contacto: valorTexto('f-contacto')
  };
}

/* ── Envío ───────────────────────────────────────────────────────── */

async function enviar() {
  if (!cfgE.urlRegistro) {
    if (errorEnvio) {
      errorEnvio.textContent = 'La encuesta no está recibiendo respuestas en este momento. Escríbenos por WhatsApp y con gusto te leemos.';
      errorEnvio.hidden = false;
    }
    return;
  }

  botonEnviar.disabled = true;
  botonEnviar.textContent = 'Enviando…';
  mostrarError('js-error-envio', false);

  try {
    /* text/plain a propósito: con application/json el navegador manda
       antes una petición de permiso que Apps Script no contesta, y la
       respuesta nunca sale. Misma razón que en registro.js. */
    const resp = await fetch(cfgE.urlRegistro, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(respuestas())
    });
    const r = await resp.json();
    if (!r.ok) throw new Error(r.error || 'falló');

    try { localStorage.setItem(CLAVE_LOCAL, '1'); } catch (errLS) { /* modo privado: da igual */ }
    irA(PASO_GRACIAS);

  } catch (err) {
    botonEnviar.disabled = false;
    botonEnviar.textContent = 'Enviar mis respuestas';
    if (errorEnvio) {
      errorEnvio.textContent = 'No pudimos enviar tus respuestas. Revisa tu conexión e inténtalo otra vez — no se perdió nada de lo que escribiste.';
      errorEnvio.hidden = false;
    }
  }
}

/* ── Arranque ────────────────────────────────────────────────────── */

pintarEstrellas();
actualizarProgreso();

document.querySelectorAll('[data-siguiente]').forEach(function (b) {
  b.addEventListener('click', siguiente);
});
document.querySelectorAll('[data-atras]').forEach(function (b) {
  b.addEventListener('click', function () { irA(Math.max(pasoActual - 1, 0)); });
});

/* Las preguntas de una sola respuesta avanzan solas al tocar: en el
   teléfono, tocar y luego buscar "Continuar" es un paso de más. Se deja
   un respiro para que se vea la opción marcada antes de cambiar. */
document.querySelectorAll('.enc-opciones[data-auto]').forEach(function (grupo) {
  grupo.addEventListener('change', function () {
    mostrarError('js-error-reco', false);
    setTimeout(function () {
      if (grupo.closest('.enc-paso') === seccion(pasoActual)) siguiente();
    }, 260);
  });
});

document.querySelectorAll('input[name="dias"]').forEach(function (c) {
  c.addEventListener('change', function () { mostrarError('js-error-dias', false); });
});

if (botonEnviar) botonEnviar.addEventListener('click', enviar);

/* Ya respondió antes en este teléfono: se le dice, sin bloquearlo — hay
   parejas y familias que comparten el mismo aparato. */
try {
  if (localStorage.getItem(CLAVE_LOCAL) === '1') {
    const portada = seccion(0);
    const nota = portada && portada.querySelector('.enc-nota');
    if (nota) {
      nota.innerHTML = 'Ya nos respondiste desde este teléfono — <strong>gracias</strong>. Si quieres contestar por alguien más, adelante.';
      nota.classList.add('enc-nota-aviso');
    }
  }
} catch (errLS) { /* modo privado: seguimos igual */ }
