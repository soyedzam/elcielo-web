/* EL CIELO EN MI CIUDAD · orquestador — reveals + conversión + compartir.
   Patrón de La Nave: sin número de WhatsApp los CTA llevan a #registro;
   con número, todos abren wa.me con el mensaje precargado. */

const cfg = window.ELCIELO || {};
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* — Reveal de secciones (sin JS todo es visible) — */
function iniciarReveals() {
  const reveals = document.querySelectorAll(".lx-rv");
  if (!reveals.length) return;
  if ("IntersectionObserver" in window && !reduceMotion) {
    document.body.classList.add("lx-anim");
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("lx-in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach((el) => io.observe(el));
  }
}

/* — CTA de conversión —
   Todos los "Aparta tu lugar" llevan al formulario, que es donde se
   registra. WhatsApp dejó de ser la vía de registro: ahora es solo el
   canal de informes, y vive en un único botón dentro de #registro. */
function iniciarConversion() {
  const enIndex = Boolean(document.getElementById("registro"));
  const destino = enIndex ? "#registro" : "index.html#registro";

  document.querySelectorAll("[data-cta]").forEach((el) => {
    if (el.dataset.ctaFallback === "none") return;
    el.href = destino;
    el.removeAttribute("target");
    el.removeAttribute("rel");
  });

  const numero = String(cfg.whatsapp || "").replace(/\D/g, "");
  const btnInformes = document.getElementById("js-canal-wa-btn");
  if (btnInformes && numero) {
    btnInformes.href = "https://wa.me/" + numero + "?text=" +
      encodeURIComponent(cfg.mensajeWhatsApp || "Hola, quiero informes del congreso El Cielo en mi Ciudad.");
    btnInformes.target = "_blank";
    btnInformes.rel = "noopener";
  }
}

/* — Compartir: hoja nativa del teléfono o WhatsApp — */
function iniciarCompartir() {
  const btn = document.getElementById("js-compartir");
  if (!btn) return;
  const texto = cfg.compartir || ("Aparta tu lugar en " + (cfg.urlDisplay || ""));
  btn.addEventListener("click", async () => {
    if (navigator.share) {
      try { await navigator.share({ text: texto }); } catch (e) { /* canceló */ }
      return;
    }
    window.open("https://wa.me/?text=" + encodeURIComponent(texto), "_blank", "noopener");
  });
}

/* — Video cinematográfico del hero (index) —
   El gradiente Amanecer es el primer fotograma: pinta al instante.
   El video (self-hosted, fuera de git) se inyecta después y hace fade-in
   cuando ya puede reproducirse. Nunca con movimiento reducido ni saveData. */
function iniciarHeroVideo() {
  const cont = document.getElementById("js-hero-media");
  if (!cont || !cfg.videoInvitacion || reduceMotion) return;
  if (navigator.connection && navigator.connection.saveData) return;
  const video = document.createElement("video");
  video.src = cfg.videoInvitacion;
  video.muted = true;
  video.loop = true;
  video.autoplay = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("preload", "auto");
  video.addEventListener("canplay", () => cont.classList.add("lx-listo"), { once: true });
  video.addEventListener("error", () => cont.classList.remove("lx-listo"), { once: true });
  cont.appendChild(video);
}

/* — Menú móvil: cajón a pantalla completa bajo 720px —
   Antes los links (Agenda/Momentos/Info) se ocultaban con display:none
   y solo quedaba el CTA — sin forma de navegar el sitio desde el celular. */
function iniciarMenuMovil() {
  const btn = document.getElementById("js-top-burger");
  const nav = document.getElementById("js-top-nav");
  if (!btn || !nav) return;

  function cerrar() {
    nav.classList.remove("abierto");
    btn.classList.remove("abierto");
    btn.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("lx-nav-lock");
  }

  btn.addEventListener("click", () => {
    const abrir = !nav.classList.contains("abierto");
    nav.classList.toggle("abierto", abrir);
    btn.classList.toggle("abierto", abrir);
    btn.setAttribute("aria-expanded", abrir ? "true" : "false");
    document.documentElement.classList.toggle("lx-nav-lock", abrir);
  });

  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", cerrar));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrar(); });
}

iniciarReveals();
iniciarConversion();
iniciarCompartir();
iniciarHeroVideo();
iniciarMenuMovil();
