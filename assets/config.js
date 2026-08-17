/* EL CIELO EN MI CIUDAD · configuración — EDITAR AQUÍ Y SOLO AQUÍ.
   Congreso de Comunidad Más Alto · Mérida, Yucatán · 14–16 ago 2026.
   Todo lo demás (cuenta regresiva, días restantes, CTAs) se calcula solo. */

window.ELCIELO = {
  // — Fechas del congreso (America/Merida, UTC-6 fijo) —
  fechaInicio: "2026-08-14",
  fechaFin: "2026-08-16",
  // Apertura del viernes: puertas 19:30, inicio 20:00 (hora de Mérida).
  aperturaISO: "2026-08-14T20:00:00-06:00",

  // — Cupo real —
  cupo: 300,

  /* — A dónde llevan TODOS los CTA del sitio ([data-cta] en main.js) —
     Es el interruptor que voltea el sitio de "pre-evento" a "post-evento"
     sin tocar una línea de código: antes valía "#registro" (el formulario);
     desde el 16-ago-2026, que el congreso ya pasó, lleva a la memoria.
     Los CTA con data-cta-fallback="none" ignoran esto y guardan su href. */
  ctaDestino: "asi-lo-vivimos.html",

  // — Registro en línea —
  // URL de la app web de Apps Script que escribe en la hoja del equipo.
  // Vacía = no se muestra el formulario y solo queda el WhatsApp de
  // informes. Cómo obtenerla: _fuente/apps-script/LEEME.md
  urlRegistro: "https://script.google.com/macros/s/AKfycbywpR5sr99FA1DeTlmJbyWMkgwaGPRUYw1fExBZRrIB9d0h2DtN5kc-8y_EtHq_t0dV/exec",

  // — Informes —
  // WhatsApp del equipo. Ya NO es la vía de registro (eso lo hace el
  // formulario): aquí solo se responden dudas sobre el congreso.
  // MX móvil: 52 + 10 dígitos, con el "1" de móvil → 521XXXXXXXXXX.
  whatsapp: "5219994338287",
  mensajeWhatsApp: "Hola, quiero informes del congreso El Cielo en mi Ciudad.",

  // — URL que se muestra como referencia en la página y en el QR —
  urlDisplay: "elcielo.comunidadmasalto.org",

  // — Ubicación real de Comunidad Más Alto —
  // Coordenadas exactas del pin (no el centro del mapa) — de ahí salen
  // los tres links de "Cómo llegar" (Google / Apple / Waze).
  coords: { lat: 21.027521, lng: -89.5768332 },
  mapaUrl: "https://www.google.com/maps/place/Comunidad+M%C3%A1s+Alto/@21.027526,-89.5794081,17z/data=!3m1!4b1!4m6!3m5!1s0x8f5677b06a7551c1:0xe9d4fba775ea49f6!8m2!3d21.027521!4d-89.5768332!16s%2Fg%2F11lryyxxhf",

  // — Texto del botón «Compártelo» (hoja nativa del teléfono / WhatsApp) —
  compartir: "Así se vivió El Cielo en mi Ciudad — congreso de Comunidad Más Alto, 14–16 de agosto en Mérida. Mira las fotos y los videos: elcielo.comunidadmasalto.org/asi-lo-vivimos.html",

  // — Video de fondo del loop de invitación (self-hosted en Cloudflare Pages,
  //   fuera de git: 6 MB). Vacío = el gradiente Amanecer hace de fondo. —
  videoInvitacion: "https://xs-elcielo-media.pages.dev/cielo-fondo-ia.mp4",

  // — Facebook de la comunidad que convoca —
  facebook: {
    url: "https://www.facebook.com/comunidadmasalto",
    handle: "Comunidad Más Alto"
  },

  // — Encuesta de evaluación —
  // Vacía = el bloque no se muestra, sin importar la fecha (mismo patrón
  // que urlRegistro). Se muestra desde el sábado 15 de agosto en adelante.
  // Es una página del propio sitio (no un Google Forms): misma marca,
  // y las respuestas caen en la misma Sheet del equipo, hoja "Evaluación".
  // Si algún día se cambia por un link externo (http…), se abre en
  // pestaña nueva solo; una ruta relativa se abre en la misma.
  encuestaUrl: "encuesta.html",

  /* ═══════════════════════════════════════════════════════════════════
     ASÍ LO VIVIMOS — la memoria del congreso. EDITAR SOLO AQUÍ.
     ───────────────────────────────────────────────────────────────────
     La página se arma sola con lo que haya: cada bloque vacío se oculta
     y ninguno rompe a los demás. Se puede publicar con 3 reels y sin
     recap, y el recap entra después sin tocar una línea de HTML.

     DÓNDE VA CADA COSA (decidido 16-ago, ver Pase de Sesión):
     · Reels verticales  → Cloudflare Pages (xs-elcielo-media), archivo
       .mp4 propio: reproducen en el sitio, sin marca ajena y sin rastreo.
     · Recap y teaser    → YouTube: pesan más de lo que Pages admite por
       archivo, y ahí sí conviene el alcance y la calidad adaptativa.
     · Fotos             → assets/fotos/asi-lo-vivimos/ en este repo,
       en WebP (Pillow, NO sips) y separadas por día.
     ═══════════════════════════════════════════════════════════════════ */
  asiVivimos: {
    // Base de los .mp4 autohospedados. Se antepone a cada "archivo".
    baseMedia: "https://xs-elcielo-media.pages.dev/asi-lo-vivimos/",

    // Los 9 reels verticales (9:16). "ig" es opcional: pone el link
    // «Ver en Instagram» debajo, para quien quiera reaccionar allá.
    // Orden = orden de aparición en el carril.
    reels: [
      // { archivo: "reel-01.mp4", poster: "reel-01.jpg", titulo: "…", dia: "viernes", ig: "https://www.instagram.com/reel/…" }
    ],

    // Pieza insignia. id = el ID de YouTube, nada más (no la URL completa).
    recap: { id: "", titulo: "El recap del congreso" },

    // El teaser con el que se convocó — cierra el círculo al final.
    teaser: { id: "", titulo: "Así lo anunciamos" },

    /* Fotos por día. "n" es el nombre del archivo dentro de
       assets/fotos/asi-lo-vivimos/. Cada foto necesita su miniatura
       (mismo nombre + "-t") para que la galería cargue ligera.
       🔴 REGLA DURA: ninguna foto con menores identificables entra aquí
       sin autorización por escrito de madre/padre o tutor. Ante la duda,
       se queda fuera — es la misma regla que dejó 3 fotos congeladas
       desde agosto. */
    fotos: {
      viernes: [],   // { n: "v-01.webp", alt: "…" }
      sabado: [],
      domingo: []
    }
  }
};
