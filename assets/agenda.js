/* EL CIELO EN MI CIUDAD · agenda interactiva.
   Reloj de Mérida en vivo, navegación por día tipo app, y marca "en
   vivo" en el bloque que está pasando ahora mismo — todo en hora de
   Mérida (America/Merida, UTC-6 fijo), sin importar dónde esté quien
   mira la página. */

const DIAS = ['viernes', 'sabado', 'domingo'];
const FECHA_POR_DIA = { viernes: '2026-08-14', sabado: '2026-08-15', domingo: '2026-08-16' };

function hoyEnMerida() {
  // en-CA da YYYY-MM-DD directo, sin que haya que parsear nada.
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Merida' }).format(new Date());
}

function seleccionarDia(dia) {
  DIAS.forEach(function (d) {
    const tab = document.getElementById('js-tab-' + d);
    const panel = document.getElementById('js-panel-' + d);
    const activo = d === dia;
    if (tab) tab.setAttribute('aria-selected', activo ? 'true' : 'false');
    if (panel) panel.hidden = !activo;
  });
}

function iniciarTabs() {
  DIAS.forEach(function (d) {
    const tab = document.getElementById('js-tab-' + d);
    if (tab) tab.addEventListener('click', function () { seleccionarDia(d); });
  });
  const hoy = hoyEnMerida();
  const diaDeHoy = DIAS.find(function (d) { return FECHA_POR_DIA[d] === hoy; });
  seleccionarDia(diaDeHoy || 'viernes');
}

function actualizarReloj() {
  const el = document.getElementById('js-reloj-hora');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('es-MX', {
    timeZone: 'America/Merida', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
  });
  el.textContent = fmt.format(new Date());
}

function actualizarEnVivo() {
  const ahora = Date.now();
  const algunoVivo = {};
  document.querySelectorAll('.lx-dia-panel').forEach(function (panel) {
    const dia = panel.getAttribute('data-dia-panel');
    algunoVivo[dia] = false;
    panel.querySelectorAll('li[data-inicio]').forEach(function (li) {
      const inicio = new Date(li.getAttribute('data-inicio')).getTime();
      const fin = new Date(li.getAttribute('data-fin')).getTime();
      const vivo = ahora >= inicio && ahora < fin;
      li.classList.toggle('is-vivo', vivo);
      const insignia = li.querySelector('.lx-en-vivo');
      if (insignia) insignia.hidden = !vivo;
      if (vivo) algunoVivo[dia] = true;
    });
  });
  DIAS.forEach(function (d) {
    const puntoTab = document.getElementById('js-tabvivo-' + d);
    if (puntoTab) puntoTab.hidden = !algunoVivo[d];
  });
}

iniciarTabs();
actualizarReloj();
actualizarEnVivo();
setInterval(actualizarReloj, 1000);
setInterval(actualizarEnVivo, 15000);
