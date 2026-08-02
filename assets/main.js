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

/* — CTA de conversión (config-driven) —
   data-cta = botón de conversión. Con número: wa.me. Sin número: #registro. */
function iniciarConversion() {
  const numero = String(cfg.whatsapp || "").replace(/\D/g, "");
  const enIndex = Boolean(document.getElementById("registro"));
  const destinoSinNumero = enIndex ? "#registro" : "index.html#registro";

  const waHref = numero
    ? "https://wa.me/" + numero + "?text=" +
      encodeURIComponent(cfg.mensajeWhatsApp || "Quiero apartar mi lugar en El Cielo en mi Ciudad.")
    : null;

  document.querySelectorAll("[data-cta]").forEach((el) => {
    if (waHref) {
      el.href = waHref;
      el.target = "_blank";
      el.rel = "noopener";
    } else if (el.dataset.ctaFallback !== "none") {
      el.href = destinoSinNumero;
    }
  });

  /* En #registro: con número aparece el botón directo de WhatsApp;
     sin número queda el plan B (con la comunidad, por Facebook). */
  const canalWa = document.getElementById("js-canal-wa");
  const canalAlt = document.getElementById("js-canal-alt");
  if (canalWa && canalAlt) {
    if (waHref) {
      canalWa.hidden = false;
      canalAlt.hidden = true;
      const btn = document.getElementById("js-canal-wa-btn");
      if (btn) { btn.href = waHref; btn.target = "_blank"; btn.rel = "noopener"; }
    } else {
      canalWa.hidden = true;
      canalAlt.hidden = false;
    }
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

/* — Días para el congreso (chips vivos, donde exista el nodo) — */
function iniciarDias() {
  const el = document.getElementById("js-dias");
  if (!el || !cfg.fechaInicio) return;
  const hoy = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Merida" }).format(new Date());
  const dias = Math.max(0, Math.round((Date.parse(cfg.fechaInicio) - Date.parse(hoy)) / 86400000));
  el.textContent = dias === 0 ? "Es hoy" : dias === 1 ? "Falta 1 día" : "Faltan " + dias + " días";
  el.hidden = false;
}

iniciarReveals();
iniciarConversion();
iniciarCompartir();
iniciarDias();
