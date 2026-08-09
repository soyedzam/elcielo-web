/* ═══════════════════════════════════════════════════════════════════
   EL CIELO EN MI CIUDAD · registro y tablero
   ───────────────────────────────────────────────────────────────────
   Este archivo vive en Google Apps Script, NO en el sitio.
   El sitio es estático: no tiene servidor ni base de datos, así que
   esta hoja de cálculo hace las dos cosas.

   Qué hace:
   · Recibe los registros del formulario del sitio        → doPost
   · Sirve el tablero privado del equipo, con contraseña  → doGet
   · Lleva el control de cupo, duplicados y folios de rifa

   Instalación: ver LEEME.md en esta misma carpeta.
   ═══════════════════════════════════════════════════════════════════ */

// ── Ajustes ────────────────────────────────────────────────────────
// La contraseña NO se escribe aquí. Se guarda una sola vez desde el
// menú del editor (Propiedades del script) para que no viaje en el
// código ni quede en el historial de git.
const HOJA = 'Registros';
const CUPO = 300;                    // [VALIDAR] tope real de asistentes
const PREFIJO_FOLIO = 'CIELO';

const COLUMNAS = [
  'Fecha y hora', 'Folio', 'Nombre', 'Correo', 'WhatsApp',
  'Origen', 'Entra a la rifa', 'Asistió'
];

// ── Utilidades ─────────────────────────────────────────────────────

function hoja_() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let h = libro.getSheetByName(HOJA);
  if (!h) {
    h = libro.insertSheet(HOJA);
    h.appendRow(COLUMNAS);
    h.getRange(1, 1, 1, COLUMNAS.length).setFontWeight('bold');
    h.setFrozenRows(1);
  }
  return h;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function normalizar_(texto) {
  return String(texto || '').trim();
}

/* Deja solo dígitos y quita el 52/521 inicial de México, para que
   9991755967, +52 999 175 5967 y 5219991755967 cuenten como el mismo
   teléfono a la hora de detectar duplicados. */
function telefonoClave_(tel) {
  let d = String(tel || '').replace(/\D/g, '');
  if (d.length > 10 && d.startsWith('521')) d = d.slice(3);
  else if (d.length > 10 && d.startsWith('52')) d = d.slice(2);
  return d.slice(-10);
}

function correoValido_(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo);
}

function contrasenaGuardada_() {
  return PropertiesService.getScriptProperties().getProperty('CLAVE_TABLERO') || '';
}

/* Comparación en tiempo constante: no revela por dónde falló la clave. */
function claveCorrecta_(intento) {
  const real = contrasenaGuardada_();
  if (!real || !intento || intento.length !== real.length) return false;
  let dif = 0;
  for (let i = 0; i < real.length; i++) {
    dif |= real.charCodeAt(i) ^ intento.charCodeAt(i);
  }
  return dif === 0;
}

function registros_() {
  const h = hoja_();
  const filas = h.getDataRange().getValues();
  filas.shift();                                  // encabezados
  return filas.filter(f => f[1]);                 // solo las que tienen folio
}

function siguienteFolio_(total) {
  return PREFIJO_FOLIO + '-' + String(total + 1).padStart(4, '0');
}

// ── Alta de registro (desde el formulario del sitio) ────────────────

function doPost(e) {
  // Un solo registro a la vez: si dos personas envían en el mismo
  // instante, sin esto podrían llevarse el mismo folio.
  const candado = LockService.getScriptLock();
  try {
    candado.waitLock(20000);
  } catch (err) {
    return json_({ ok: false, error: 'ocupado' });
  }

  try {
    const datos = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Trampa para robots: el formulario trae un campo oculto que una
    // persona nunca llena. Si viene con texto, se acepta en silencio
    // sin escribir nada — el bot cree que funcionó y no reintenta.
    if (normalizar_(datos.sitio)) {
      return json_({ ok: true, folio: 'CIELO-0000', rifa: false });
    }

    const nombre = normalizar_(datos.nombre);
    const correo = normalizar_(datos.correo).toLowerCase();
    const whatsapp = normalizar_(datos.whatsapp);
    const presencial = datos.origen === 'presencial';

    if (nombre.length < 3) return json_({ ok: false, error: 'nombre' });
    if (!correoValido_(correo)) return json_({ ok: false, error: 'correo' });
    if (telefonoClave_(whatsapp).length !== 10) return json_({ ok: false, error: 'whatsapp' });

    const previos = registros_();

    if (previos.length >= CUPO) {
      return json_({ ok: false, error: 'lleno' });
    }

    // ¿Ya se había registrado? Se le devuelve SU folio, no uno nuevo:
    // quien duda y envía dos veces no debe perder su lugar en la rifa
    // ni aparecer duplicado en la lista de la puerta.
    const telClave = telefonoClave_(whatsapp);
    const yaEsta = previos.find(f =>
      String(f[3]).toLowerCase().trim() === correo || telefonoClave_(f[4]) === telClave
    );
    if (yaEsta) {
      return json_({
        ok: true, repetido: true,
        folio: yaEsta[1], nombre: yaEsta[2],
        rifa: yaEsta[6] === 'Sí'
      });
    }

    const folio = siguienteFolio_(previos.length);
    const entraRifa = !presencial;   // el día del evento ya no entra a la rifa

    hoja_().appendRow([
      new Date(), folio, nombre, correo, whatsapp,
      presencial ? 'Presencial' : 'Plataforma',
      entraRifa ? 'Sí' : 'No',
      presencial ? new Date() : ''
    ]);

    return json_({
      ok: true, folio: folio, nombre: nombre, rifa: entraRifa,
      lugares: CUPO - (previos.length + 1)
    });

  } catch (err) {
    return json_({ ok: false, error: 'servidor' });
  } finally {
    candado.releaseLock();
  }
}

// ── Tablero privado del equipo ──────────────────────────────────────

function doGet() {
  // Lo único que se sirve por GET es la página del tablero, y llega
  // vacía: los datos solo salen por las funciones de abajo, que piden
  // contraseña. Así no existe ninguna URL que devuelva nombres.
  return HtmlService.createHtmlOutputFromFile('tablero')
    .setTitle('Registros · El Cielo en mi Ciudad')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DENY);
}

/* Las dos funciones que el tablero llama con google.script.run.
   Devuelven texto JSON porque google.script.run no serializa objetos
   con fechas de forma predecible. */

function datosTablero(clave) {
  if (!claveCorrecta_(clave)) {
    Utilities.sleep(700);                  // frena el probar claves en serie
    return JSON.stringify({ ok: false, error: 'clave' });
  }
  return JSON.stringify({
    ok: true,
    cupo: CUPO,
    registros: registros_().map(f => ({
      fecha: f[0] ? Utilities.formatDate(new Date(f[0]), 'America/Merida', 'd MMM · HH:mm') : '',
      folio: f[1], nombre: f[2], correo: f[3], whatsapp: f[4],
      origen: f[5], rifa: f[6] === 'Sí', asistio: Boolean(f[7])
    })).reverse()                           // lo más reciente arriba
  });
}

function marcarAsistio(clave, folio) {
  if (!claveCorrecta_(clave)) {
    Utilities.sleep(700);
    return JSON.stringify({ ok: false, error: 'clave' });
  }
  const h = hoja_();
  const filas = h.getDataRange().getValues();
  for (let i = 1; i < filas.length; i++) {
    if (filas[i][1] === normalizar_(folio)) {
      h.getRange(i + 1, 8).setValue(new Date());
      return JSON.stringify({ ok: true });
    }
  }
  return JSON.stringify({ ok: false, error: 'no-encontrado' });
}

// ── Se corre UNA vez desde el editor, para dejar la contraseña ──────

function ponerContrasena() {
  const clave = 'CAMBIA-ESTA-CLAVE';   // escríbela aquí, corre, y bórrala
  PropertiesService.getScriptProperties().setProperty('CLAVE_TABLERO', clave);
  hoja_();                              // deja la hoja lista de una vez
  Logger.log('Listo. Borra la clave de esta función y vuelve a guardar.');
}
