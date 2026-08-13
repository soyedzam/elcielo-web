/* EL CIELO EN MI CIUDAD · clima actual — Open-Meteo, sin llave, sin
   backend. Comparte la misma fuente (Mérida) que el pronóstico por día
   de agenda.js, pero trae condiciones EN VIVO en vez de máx/mín. Si no
   hay red, la tarjeta simplemente no aparece: nunca un dato inventado. */

const COORDS_MERIDA = { lat: 21.0275, lng: -89.5768 };
const ICONO_POR_CODIGO = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌦️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  80: '🌦️', 81: '🌧️', 82: '⛈️',
  95: '⛈️', 96: '⛈️', 99: '⛈️'
};

export async function cargarClimaActual(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  const url = 'https://api.open-meteo.com/v1/forecast' +
    '?latitude=' + COORDS_MERIDA.lat + '&longitude=' + COORDS_MERIDA.lng +
    '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode' +
    '&timezone=America%2FMerida';
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('sin clima actual');
    const datos = await resp.json();
    const actual = datos.current;
    if (!actual) throw new Error('respuesta rara');

    const temp = Math.round(actual.temperature_2m);
    const humedad = Math.round(actual.relative_humidity_2m);
    const viento = Math.round(actual.wind_speed_10m);
    const icono = ICONO_POR_CODIGO[actual.weathercode] || '🌡️';

    el.innerHTML =
      '<span class="lx-clima-ico" aria-hidden="true">' + icono + '</span>' +
      '<span class="lx-clima-temp tabular">' + temp + '°</span>' +
      '<span class="lx-clima-detalle">Mérida ahora · ' + humedad + '% humedad · ' + viento + ' km/h viento</span>';
    el.hidden = false;
  } catch (err) {
    el.hidden = true;
  }
}
