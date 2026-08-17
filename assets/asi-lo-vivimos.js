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

/* ── Bloques de YouTube (recap y teaser) ─────────────────────────── */

/* Fachada: se pinta la miniatura de YouTube y el iframe solo entra al
   tocar. Así la página no carga nada de Google hasta que alguien de
   verdad quiere ver el video. */
function pintarYouTube(cajaId, seccionId, dato) {
  if (!dato || !dato.id) return;
  const caja = $(cajaId);
  if (!caja) return;

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
}

/* ── Carril de reels ─────────────────────────────────────────────── */

function pintarReels() {
  const reels = Array.isArray(cfg.reels) ? cfg.reels : [];
  if (!reels.length) return;
  const rail = $('js-viv-rail');
  if (!rail) return;

  const base = cfg.baseMedia || '';
  const frag = document.createDocumentFragment();

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

  rail.appendChild(frag);
  mostrar('js-viv-reels');
}

/* ── Galería de fotos, por día ───────────────────────────────────── */

function pintarFotos() {
  const fotos = cfg.fotos || {};
  const conFotos = DIAS.filter(function (d) {
    return Array.isArray(fotos[d]) && fotos[d].length;
  });
  if (!conFotos.length) return;

  const tabs = $('js-viv-tabs');
  const galeria = $('js-viv-galeria');
  if (!tabs || !galeria) return;

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

    fotos[d].forEach(function (f) {
      if (!f || !f.n) return;
      const i = piezas.length;
      piezas.push({ tipo: 'foto', src: RUTA_FOTOS + f.n, titulo: f.alt || '' });

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'viv-foto';
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

function abrir(i) {
  pintarPieza(i);
  teatro.classList.add('abierto');
  teatro.setAttribute('aria-hidden', 'false');
  document.documentElement.classList.add('viv-lock');
}

function cerrar() {
  teatro.classList.remove('abierto');
  teatro.setAttribute('aria-hidden', 'true');
  frame.innerHTML = '';          // corta la reproducción de golpe
  document.documentElement.classList.remove('viv-lock');
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

pintarYouTube('js-viv-recap-caja', 'js-viv-recap', cfg.recap);
pintarReels();
pintarFotos();
pintarYouTube('js-viv-teaser-caja', 'js-viv-teaser', cfg.teaser);

/* Si no hay NADA todavía, la página no puede quedarse en blanco: se
   dice con todas sus letras que el material está en edición, en vez de
   fingir una galería vacía. */
if (!piezas.length) mostrar('js-viv-vacio');
