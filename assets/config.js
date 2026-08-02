/* EL CIELO EN MI CIUDAD · configuración — EDITAR AQUÍ Y SOLO AQUÍ.
   Congreso de liderazgo de Comunidad Más Alto · Mérida, Yucatán · 14–16 ago 2026.
   Todo lo demás (cuenta regresiva, días restantes, CTAs) se calcula solo. */

window.ELCIELO = {
  // — Fechas del congreso (America/Merida, UTC-6 fijo) —
  fechaInicio: "2026-08-14",
  fechaFin: "2026-08-16",
  // Apertura del viernes: puertas 19:30, inicio 20:00 (hora de Mérida).
  aperturaISO: "2026-08-14T20:00:00-06:00",

  // — Cupo real —
  cupo: 300,

  // — Conversión —
  // Número de WhatsApp del equipo en formato internacional, solo dígitos.
  // MX móvil: 52 + 10 dígitos, con el "1" de móvil → 521XXXXXXXXXX.
  whatsapp: "5219991755967",
  mensajeWhatsApp: "Hola, quiero apartar mi lugar en El Cielo en mi Ciudad.",

  // — URL que se muestra como referencia en la página y en el QR —
  urlDisplay: "elcielo.comunidadmasalto.org",

  // — Ubicación real de Comunidad Más Alto (Google Maps) —
  mapaUrl: "https://share.google/InwyKySL9Dv5YHTaA",

  // — Texto del botón «Compártelo» (hoja nativa del teléfono / WhatsApp) —
  compartir: "El Cielo en mi Ciudad — congreso de liderazgo de Comunidad Más Alto. 14–16 de agosto en Mérida. Aparta tu lugar en elcielo.comunidadmasalto.org",

  // — Video de fondo del loop de invitación (self-hosted en Cloudflare Pages,
  //   fuera de git: 6 MB). Vacío = el gradiente Amanecer hace de fondo. —
  videoInvitacion: "https://xs-elcielo-media.pages.dev/cielo-fondo-ia.mp4",

  // — Facebook de la comunidad que convoca —
  facebook: {
    url: "https://www.facebook.com/comunidadmasalto",
    handle: "Comunidad Más Alto"
  }
};
