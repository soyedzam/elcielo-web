/* EL CIELO EN MI CIUDAD · cuenta regresiva de /avance — el número que respira.
   Antes contaba registros en una base de datos; ahora cuenta hacia la apertura
   real del congreso (config.aperturaISO, hora de Mérida). Cero servidor. */

const cfg = window.ELCIELO || {};
const APERTURA_MS = Date.parse(cfg.aperturaISO || (cfg.fechaInicio + "T20:00:00-06:00"));
/* Arranque visual de la barra: desde 45 días antes de abrir (ventana de promoción). */
const VENTANA_MS = 45 * 86400000;

const dos = (n) => String(n).padStart(2, "0");

function pinta() {
  const ahora = Date.now();
  const falta = Math.max(0, APERTURA_MS - ahora);

  const dias = Math.floor(falta / 86400000);
  const horas = Math.floor((falta % 86400000) / 3600000);
  const min = Math.floor((falta % 3600000) / 60000);
  const seg = Math.floor((falta % 60000) / 1000);

  const elNumero = document.getElementById("js-numero");
  const elUnidad = document.getElementById("js-unidad");
  const elNota = document.getElementById("js-nota");
  if (falta === 0) {
    if (elNumero) elNumero.textContent = "Es hoy";
    if (elUnidad) elUnidad.textContent = "el cielo en mi ciudad · mérida";
    if (elNota) elNota.hidden = true;
  } else {
    if (elNumero) elNumero.textContent = String(dias);
    if (elUnidad) elUnidad.textContent = dias === 1 ? "día para el congreso" : "días para el congreso";
  }

  const ids = { "js-horas": dos(horas), "js-min": dos(min), "js-seg": dos(seg), "js-dias-stat": String(dias) };
  Object.keys(ids).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = ids[id];
  });

  /* la barra-horizonte se llena conforme se acerca el 14 de agosto */
  const barra = document.getElementById("js-progreso");
  if (barra) {
    const transcurrido = Math.min(VENTANA_MS, Math.max(0, VENTANA_MS - falta));
    const pct = Math.round((transcurrido / VENTANA_MS) * 100);
    barra.style.setProperty("--p", pct + "%");
    const pctEl = document.getElementById("js-pct");
    if (pctEl) pctEl.textContent = pct + "%";
  }
}

pinta();
setInterval(pinta, 1000);
