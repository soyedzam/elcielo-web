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

  // — Tablero de resultados (resultados.html) —
  // true = se abre directo, sin pedir contraseña. Pedido explícito para
  // compartirlo con los pastores sin fricción — nunca expone nombre ni
  // contacto (eso lo filtra el propio Apps Script, no esta bandera).
  // Poner en false en cuanto se decida que sí necesita clave — y cambiar
  // también RESULTADOS_PUBLICO en Codigo.gs, los dos deben ir juntos.
  resultadosPublico: true,

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

    // Cuántos reels habrá en total al final (9, confirmado por Ed). Con
    // esto la página arma sola la barra "X de 9 momentos" y las tarjetas
    // "Próximamente" del carril — nunca hay que tocar HTML para eso.
    // 0 = no se muestra ninguna promesa de "vienen más".
    reelsTotal: 9,

    // Los reels verticales (9:16). "ig" es opcional: pone el link
    // «Ver en Instagram» debajo, para quien quiera reaccionar allá.
    // Orden = orden de aparición en el carril.
    // Primeros 3 de 9 — domingo 16, cierre del congreso (hora de captura
    // 11:03-11:11am Mérida, coincide exacto con Bienvenida/Alabanza del
    // programa real). H.264 8-bit, 608×1080, con póster — subidos 260817.
    reels: [
      { archivo: "el-cielo-domingo-bienvenida-cierre.mp4", poster: "el-cielo-domingo-bienvenida-cierre.jpg", titulo: "Bienvenida del domingo de cierre", dia: "domingo" },
      { archivo: "el-cielo-domingo-casa-llena.mp4", poster: "el-cielo-domingo-casa-llena.jpg", titulo: "La casa llena, domingo de cierre", dia: "domingo" },
      { archivo: "el-cielo-domingo-alabanza-cierre.mp4", poster: "el-cielo-domingo-alabanza-cierre.jpg", titulo: "Alabanza en el domingo de cierre", dia: "domingo" }
    ],

    // Pieza insignia. id = el ID de YouTube, nada más (no la URL completa).
    recap: { id: "", titulo: "El recap del congreso" },

    /* El video de visión de Comunidad Más Alto, proyectado para abrir las
       tres noches — cierra el círculo al final de la página.
       🔴 Está NO LISTADO en YouTube por decisión de Ed (17-ago): eso no
       impide el embed, pero sí que aparezca en búsquedas o en el canal.
       Si algún día se hace público, aquí no hay que tocar nada. */
    teaser: { id: "FdbgBzH1WsI", titulo: "Con esto abrimos" },

    /* Fotos por día. "n" es el nombre del archivo dentro de
       assets/fotos/asi-lo-vivimos/. Cada foto necesita su miniatura
       (mismo nombre + "-t") para que la galería cargue ligera.
       🔴 REGLA DURA: ninguna foto con menores identificables entra aquí
       sin autorización por escrito de madre/padre o tutor. Ante la duda,
       se queda fuera — es la misma regla que dejó 3 fotos congeladas
       desde agosto. */
    fotos: {
      /* Vacío a propósito (18-ago). Las 18 fotos del viernes se bajaron:
         el revelado automático las dejó lavadas y con dominante de color,
         no a la altura de lo que salió de la cámara. Los originales y los
         derivados siguen en ACTIVOS — cuando haya una versión aprobada,
         se vuelven a listar aquí. */
      viernes: [],
      sabado: [],
      domingo: [
        { n: "domingo-bienvenida-congreso.webp", alt: "Letreros de bienvenida junto al acceso del congreso El Cielo en mi Ciudad." },
        { n: "domingo-alabanza-en-comunidad.webp", alt: "Mujeres adultas participan en un momento de alabanza en comunidad." },
        { n: "domingo-audiencia-reunida-01.webp", alt: "Audiencia reunida en El Cielo en mi Ciudad, Mérida, Yucatán." },
        { n: "domingo-audiencia-vista-lateral-02.webp", alt: "Vista lateral amplia de la audiencia de El Cielo en mi Ciudad." },
        { n: "domingo-auditorio-cubierto-01.webp", alt: "Vista lateral del auditorio de El Cielo en mi Ciudad." },
        { n: "domingo-mensaje-biblico.webp", alt: "Mensaje bíblico presentado ante la audiencia de El Cielo en mi Ciudad." },
        { n: "domingo-predicacion-ante-audiencia.webp", alt: "Orador comparte un mensaje ante la audiencia de El Cielo en mi Ciudad." },
        { n: "domingo-testimonio-en-comunidad.webp", alt: "Mujer comparte un testimonio con micrófono acompañada por integrantes de Comunidad Más Alto." },
        { n: "domingo-oracion-acompanamiento.webp", alt: "Dos participantes adultos comparten un momento de oración y acompañamiento en El Cielo en mi Ciudad." },
        { n: "domingo-equipo-servicio.webp", alt: "Integrante del equipo de servicio durante el encuentro de Comunidad Más Alto en Mérida." },
        { n: "domingo-escucha-en-comunidad.webp", alt: "Participante escucha una intervención durante el encuentro comunitario." },
        { n: "domingo-hombre-en-reflexion.webp", alt: "Hombre participa en un momento de reflexión durante el congreso." },
        { n: "domingo-momento-reflexion-01.webp", alt: "Primer plano de un participante adulto durante un momento de reflexión." },
        { n: "domingo-participantes-atentos.webp", alt: "Participantes adultos escuchan atentamente durante El Cielo en mi Ciudad." },
        { n: "domingo-participantes-en-reflexion.webp", alt: "Dos participantes adultos durante una reflexión de Comunidad Más Alto." },
        { n: "domingo-vista-lateral-audiencia.webp", alt: "Participantes escuchan el mensaje desde un costado del auditorio." }
      ]
    }
  }
};
