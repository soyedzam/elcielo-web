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

/* Clima real por Open-Meteo — sin llave, sin backend, hecho para sitios
   estáticos. Si el día todavía no entra en su ventana de pronóstico (o
   no hay red), la insignia simplemente no aparece: nunca un dato
   inventado en su lugar. */
const COORDS_CLIMA = { lat: 21.0275, lng: -89.5768 };
const ICONO_POR_CODIGO = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌦️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  80: '🌦️', 81: '🌧️', 82: '⛈️',
  95: '⛈️', 96: '⛈️', 99: '⛈️'
};

async function cargarClima() {
  const inicio = FECHA_POR_DIA.viernes;
  const fin = FECHA_POR_DIA.domingo;
  const url = 'https://api.open-meteo.com/v1/forecast' +
    '?latitude=' + COORDS_CLIMA.lat + '&longitude=' + COORDS_CLIMA.lng +
    '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode' +
    '&timezone=America%2FMerida&start_date=' + inicio + '&end_date=' + fin;
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('sin pronóstico');
    const datos = await resp.json();
    const fechas = datos.daily && datos.daily.time;
    if (!fechas) throw new Error('respuesta rara');

    DIAS.forEach(function (d) {
      const el = document.getElementById('js-clima-' + d);
      if (!el) return;
      const idx = fechas.indexOf(FECHA_POR_DIA[d]);
      if (idx === -1) { el.hidden = true; return; }

      const max = Math.round(datos.daily.temperature_2m_max[idx]);
      const min = Math.round(datos.daily.temperature_2m_min[idx]);
      const lluvia = datos.daily.precipitation_probability_max[idx];
      const icono = ICONO_POR_CODIGO[datos.daily.weathercode[idx]] || '🌡️';
      el.innerHTML = icono + ' <b>' + max + '°</b>/' + min + '° · ' + lluvia + '% lluvia';
      el.hidden = false;
    });
  } catch (err) {
    DIAS.forEach(function (d) {
      const el = document.getElementById('js-clima-' + d);
      if (el) el.hidden = true;
    });
  }
}

iniciarTabs();
actualizarReloj();
actualizarEnVivo();
cargarClima();
setInterval(actualizarReloj, 1000);
setInterval(actualizarEnVivo, 15000);
