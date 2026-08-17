/* EL CIELO EN MI CIUDAD · "Así lo vivimos" — la memoria del congreso.

   La página entera se arma desde config.js (window.ELCIELO.asiVivimos).
   Cada bloque se oculta solo si viene vacío, así que se puede publicar
   con 3 reels y sin recap, y el recap entra después cambiando un ID.

   Dos fuentes de video conviviendo a propósito:
   · Reels (9:16, cortos)  → .mp4 propio en Cloudflare Pages. Reproducen
     dentro del sitio, sin marca ajena y sin cargar scripts de terceros.
   · Recap y teaser (largos) → YouTube-nocookie, y solo cuando se abren:
     pesan más de lo que Pages admite por archivo, y ahí sí compensa la
     calidad adaptativa y que vivan en el canal de la comunidad.
   El reproductor modal es UNO solo y sabe tratar a los dos. */

const cfg = (window.ELCIELO && window.ELCIELO.asiVivimos) || {};

const DIAS = ['viernes', 'sabado', 'domingo'];
const NOMBRE_DIA = { viernes: 'Viernes 14', sabado: 'Sábado 15', domingo: 'Domingo 16' };
const RUTA_FOTOS = 'assets/fotos/asi-lo-vivimos/';

/* Lista única de todo lo reproducible, en el orden en que aparece: el
   modal navega con ‹ › sobre esta lista, sin importar de dónde salga
   cada pieza. */
const piezas = [];

/* ── Utilidades ──────────────────────────────────────────────────── */

const $ = (id) => document.getElementById(id);

function mostrar(id) {
  const el = $(id);
  if (el) el.hidden = false;
}

/* Miniatura de un archivo de foto: mismo nombre + "-t" antes de la
   extensión (v-01.webp → v-01-t.webp). Es la convención que ya usa
   assets/fotos/ desde la primera versión del sitio. */
function miniatura(nombre) {
  const punto = nombre.lastIndexOf('.');
  if (punto < 0) return nombre;
  return nombre.slice(0, punto) + '-t' + nombre.slice(punto);
}

function escapar(t) {
  return String(t == null ? '' : t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const ICONO_RELOJ =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
  '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg>';

/* Bloque "Próximamente" genérico — reemplaza el silencio de una sección
   vacía por una promesa concreta. Solo se usa cuando YA hay algo más en
   la página (si todo está vacío, manda el mensaje único de #js-viv-vacio;
   ver el cierre de este archivo). */
function proximamente(seccionId, contenedorId, texto) {
  const cont = $(contenedorId);
  if (!cont) return;
  cont.innerHTML =
    '<div class="viv-proximamente">' +
      '<span class="viv-proximamente-ico" aria-hidden="true">' + ICONO_RELOJ + '</span>' +
      '<p>' + escapar(texto) + '</p>' +
    '</div>';
  mostrar(seccionId);
}

/* ── Bloques de YouTube (recap y teaser) ─────────────────────────── */

/* Fachada: se pinta la miniatura de YouTube y el iframe solo entra al
   tocar. Así la página no carga nada de Google hasta que alguien de
   verdad quiere ver el video. */
function pintarYouTube(cajaId, seccionId, dato) {
  if (!dato || !dato.id) return false;
  const caja = $(cajaId);
  if (!caja) return false;

  const i = piezas.length;
  piezas.push({ tipo: 'youtube', id: dato.id, titulo: dato.titulo || '' });

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'viv-facade';
  btn.setAttribute('aria-label', 'Reproducir: ' + (dato.titulo || 'video'));
  btn.innerHTML =
    '<img src="https://i.ytimg.com/vi/' + encodeURIComponent(dato.id) + '/maxresdefault.jpg" alt="" loading="lazy" decoding="async">' +
    '<span class="viv-play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>';
  btn.addEventListener('click', () => abrir(i));
  caja.appendChild(btn);
  mostrar(seccionId);
  return true;
}

/* ── Carril de reels ─────────────────────────────────────────────── */

const ICONO_CANDADO =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
  '<rect x="4" y="10.5" width="16" height="10" rx="2"/><path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5"/></svg>';

function pintarReels() {
  const reels = Array.isArray(cfg.reels) ? cfg.reels : [];
  if (!reels.length) return;
  const rail = $('js-viv-rail');
  if (!rail) return;

  const base = cfg.baseMedia || '';
  const frag = document.createDocumentFragment();
  let indice = 0;

  reels.forEach(function (r) {
    if (!r || !r.archivo) return;
    const i = piezas.length;
    piezas.push({
      tipo: 'video',
      src: base + r.archivo,
      titulo: r.titulo || '',
      ig: r.ig || ''
    });

    const item = document.createElement('div');
    item.className = 'viv-reel';
    item.style.setProperty('--i', indice++);
    item.setAttribute('role', 'listitem');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'viv-reel-btn';
    btn.setAttribute('aria-label', 'Reproducir: ' + (r.titulo || 'reel'));

    /* El póster es una imagen, no el video: nueve <video> cargando a la
       vez en un teléfono es la forma más rápida de fundir la batería y
       la conexión. El .mp4 solo entra al abrir el modal. */
    const poster = r.poster ? base + r.poster : '';
    btn.innerHTML =
      (poster
        ? '<img src="' + escapar(poster) + '" alt="" loading="lazy" decoding="async">'
        : '<span class="viv-reel-sinposter" aria-hidden="true"></span>') +
      '<span class="viv-play viv-play-sm" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>' +
      (r.dia && NOMBRE_DIA[r.dia] ? '<span class="viv-reel-dia">' + escapar(NOMBRE_DIA[r.dia]) + '</span>' : '');
    btn.addEventListener('click', () => abrir(i));
    item.appendChild(btn);

    if (r.titulo) {
      const t = document.createElement('span');
      t.className = 'viv-reel-t';
      t.textContent = r.titulo;
      item.appendChild(t);
    }
    frag.appendChild(item);
  });

  /* Tarjetas "Próximamente": el resto de los reels que aún no llegan.
     No son clicables — prometen sin fingir que ya se puede ver algo. */
  const total = Number(cfg.reelsTotal) || 0;
  const faltan = Math.max(0, total - reels.length);
  for (let n = 0; n < faltan; n++) {
    const item = document.createElement('div');
    item.className = 'viv-reel';
    item.style.setProperty('--i', indice++);
    item.setAttribute('role', 'listitem');
    item.innerHTML =
      '<div class="viv-reel-proximo" aria-label="Momento en camino">' +
        ICONO_CANDADO + '<span>Próximamente</span>' +
      '</div>';
    frag.appendChild(item);
  }

  rail.appendChild(frag);

  /* Barra "X de N momentos ya están aquí" — solo si config.js trae un
     total y de verdad falta algo; se retira sola en cuanto se completa,
     nunca se queda prometiendo algo que ya pasó. */
  if (total > 0 && reels.length < total) {
    const prog = $('js-viv-progreso');
    const txt = $('js-viv-progreso-txt');
    const fill = $('js-viv-progreso-fill');
    if (prog && txt && fill) {
      txt.innerHTML = '<b>' + reels.length + ' de ' + total + '</b> momentos ya están aquí — el resto llega estos días';
      fill.style.width = Math.round((reels.length / total) * 100) + '%';
      prog.hidden = false;
    }
  }

  mostrar('js-viv-reels');
}

/* ── Galería de fotos, por día ───────────────────────────────────── */

function pintarFotos() {
  const fotos = cfg.fotos || {};
  const conFotos = DIAS.filter(function (d) {
    return Array.isArray(fotos[d]) && fotos[d].length;
  });
  if (!conFotos.length) return false;

  const tabs = $('js-viv-tabs');
  const galeria = $('js-viv-galeria');
  if (!tabs || !galeria) return false;

  // Solo se ponen pestañas si hay más de un día con fotos: una sola
  // pestaña es un botón que no decide nada.
  conFotos.forEach(function (d, n) {
    if (conFotos.length > 1) {
      const tab = document.createElement('button');
      tab.className = 'lx-dia-tab';
      tab.type = 'button';
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', n === 0 ? 'true' : 'false');
      tab.setAttribute('aria-controls', 'js-viv-panel-' + d);
      tab.textContent = NOMBRE_DIA[d];
      tab.addEventListener('click', function () { seleccionarDia(d, conFotos); });
      tabs.appendChild(tab);
    }

    const panel = document.createElement('div');
    panel.className = 'viv-grid';
    panel.id = 'js-viv-panel-' + d;
    panel.setAttribute('role', 'tabpanel');
    panel.hidden = n !== 0;

    fotos[d].forEach(function (f, iFoto) {
      if (!f || !f.n) return;
      const i = piezas.length;
      piezas.push({ tipo: 'foto', src: RUTA_FOTOS + f.n, titulo: f.alt || '' });

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'viv-foto';
      btn.style.setProperty('--i', iFoto);
      btn.setAttribute('aria-label', 'Ver más grande: ' + (f.alt || 'foto del congreso'));
      const img = document.createElement('img');
      img.src = RUTA_FOTOS + miniatura(f.n);
      img.alt = f.alt || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      btn.appendChild(img);
      btn.addEventListener('click', () => abrir(i));
      panel.appendChild(btn);
    });

    galeria.appendChild(panel);
  });

  mostrar('js-viv-fotos');
}

function seleccionarDia(dia, conFotos) {
  conFotos.forEach(function (d) {
    const panel = $('js-viv-panel-' + d);
    if (panel) panel.hidden = d !== dia;
  });
  Array.from($('js-viv-tabs').children).forEach(function (tab) {
    tab.setAttribute('aria-selected', tab.textContent === NOMBRE_DIA[dia] ? 'true' : 'false');
  });
}

/* ── Reproductor modal ───────────────────────────────────────────── */

const teatro = $('js-viv-teatro');
const frame = $('js-viv-frame');
const cap = $('js-viv-cap');
const cuenta = $('js-viv-count');
let idx = 0;

function pintarPieza(i) {
  if (!piezas.length) return;
  idx = (i + piezas.length) % piezas.length;
  const p = piezas[idx];
  frame.innerHTML = '';
  frame.className = 'viv-teatro-caja es-' + p.tipo;

  if (p.tipo === 'youtube') {
    const f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(p.id) +
      '?autoplay=1&rel=0&playsinline=1&modestbranding=1';
    f.title = p.titulo || 'Video del congreso';
    f.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
    f.setAttribute('allowfullscreen', '');
    frame.appendChild(f);

  } else if (p.tipo === 'video') {
    const v = document.createElement('video');
    v.src = p.src;
    v.controls = true;
    v.autoplay = true;
    v.playsInline = true;
    v.preload = 'auto';
    frame.appendChild(v);
    if (p.ig) {
      const a = document.createElement('a');
      a.className = 'viv-ig-link';
      a.href = p.ig;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Ver en Instagram';
      frame.appendChild(a);
    }

  } else {
    const img = document.createElement('img');
    img.src = p.src;
    img.alt = p.titulo || '';
    frame.appendChild(img);
  }

  if (cap) cap.textContent = p.titulo || '';
  if (cuenta) cuenta.textContent = (idx + 1) + ' / ' + piezas.length;
}

let disparador = null;   // qué botón abrió el modal, para devolverle el foco al cerrar

function abrir(i) {
  disparador = document.activeElement;
  pintarPieza(i);
  teatro.classList.add('abierto');
  teatro.setAttribute('aria-hidden', 'false');
  document.documentElement.classList.add('viv-lock');
  // El foco viaja con el modal: quien navega con teclado o lector de
  // pantalla no se queda "atrás", en la página, sin saber que algo se abrió.
  const cerrarBtn = $('js-viv-cerrar');
  if (cerrarBtn) cerrarBtn.focus();
}

function cerrar() {
  teatro.classList.remove('abierto');
  teatro.setAttribute('aria-hidden', 'true');
  frame.innerHTML = '';          // corta la reproducción de golpe
  document.documentElement.classList.remove('viv-lock');
  if (disparador && typeof disparador.focus === 'function') disparador.focus();
  disparador = null;
}

if (teatro) {
  $('js-viv-cerrar').addEventListener('click', cerrar);
  $('js-viv-prev').addEventListener('click', () => pintarPieza(idx - 1));
  $('js-viv-next').addEventListener('click', () => pintarPieza(idx + 1));
  teatro.addEventListener('click', function (e) { if (e.target === teatro) cerrar(); });
  document.addEventListener('keydown', function (e) {
    if (!teatro.classList.contains('abierto')) return;
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'ArrowLeft') pintarPieza(idx - 1);
    else if (e.key === 'ArrowRight') pintarPieza(idx + 1);
  });
}

/* ── Arranque ────────────────────────────────────────────────────── */

const recapTuvoDato = pintarYouTube('js-viv-recap-caja', 'js-viv-recap', cfg.recap);
pintarReels();
const fotosTuvoDato = pintarFotos();
pintarYouTube('js-viv-teaser-caja', 'js-viv-teaser', cfg.teaser);

if (!piezas.length) {
  /* Si no hay NADA todavía, la página no puede quedarse en blanco: se
     dice con todas sus letras que el material está en edición, en vez
     de fingir una galería vacía. */
  mostrar('js-viv-vacio');
} else {
  /* Ya hay algo (los reels) — las secciones que TODAVÍA no tienen su
     material no se quedan en silencio: prometen algo concreto en vez
     de simplemente desaparecer sin explicación. */
  if (!recapTuvoDato) {
    proximamente('js-viv-recap', 'js-viv-recap-caja', 'El recap está en edición — el resumen completo de los tres días llega en los próximos días.');
  }
  if (!fotosTuvoDato) {
    proximamente('js-viv-fotos', 'js-viv-galeria', 'La galería se va llenando estos días — vuelve pronto y búscate en las fotos.');
  }
}

/* ── Cascada de entrada: cada tarjeta aparece un poco después de la
   anterior conforme entra en pantalla. Solo se activa si el sistema
   permite movimiento Y existe IntersectionObserver — si cualquiera de
   los dos falla, las tarjetas se quedan tal cual el CSS las pinta por
   default: visibles, sin animar (nunca invisibles por un fallo). */
(function iniciarCascada() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;
  const tarjetas = document.querySelectorAll('.viv-reel, .viv-foto');
  if (!tarjetas.length) return;
  document.body.classList.add('viv-anim');
  const io = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('viv-in'); io.unobserve(en.target); }
    });
  }, { threshold: .15 });
  tarjetas.forEach(function (t) { io.observe(t); });
})();
