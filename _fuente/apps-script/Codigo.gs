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

// Las 6 columnas de día se agregan AL FINAL a propósito — nunca en medio
// de las que ya existen — para que ningún dato real ya guardado se
// recorra de columna. 'Asistió' (índice 7) queda como columna huérfana,
// sin usarse más, en vez de reciclarla: recortarla habría corrido todo
// lo que sigue.
const DIAS = ['viernes', 'sabado', 'domingo'];
const NOMBRE_DIA = { viernes: 'viernes', sabado: 'sábado', domingo: 'domingo' };
const FECHA_POR_DIA = { viernes: '2026-08-14', sabado: '2026-08-15', domingo: '2026-08-16' };

// Mismo criterio que hoyEnMerida() de agenda.js, del lado del servidor.
function diaDeHoy_() {
  const hoy = Utilities.formatDate(new Date(), 'America/Merida', 'yyyy-MM-dd');
  return DIAS.filter(function (d) { return FECHA_POR_DIA[d] === hoy; })[0] || '';
}

const COLUMNAS = [
  'Fecha y hora', 'Folio', 'Nombre', 'Correo', 'WhatsApp',
  'Origen', 'Entra a la rifa', 'Asistió',
  'Asiste viernes', 'Asiste sábado', 'Asiste domingo',
  'Asistió viernes', 'Asistió sábado', 'Asistió domingo'
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

// Convierte 1,2,3… en A,B,C… — para armar rangos de conditional format.
function columnaLetra_(n) {
  let letra = '';
  while (n > 0) {
    const resto = (n - 1) % 26;
    letra = String.fromCharCode(65 + resto) + letra;
    n = Math.floor((n - 1) / 26);
  }
  return letra;
}

/* Le da formato de marca a la hoja — se corre UNA vez a mano desde el
   editor (como ponerContrasena_), no cambia ningún dato, solo cómo se
   ve. Encabezado índigo, columnas a su ancho, y quien entra a la rifa
   resaltado en ámbar para verlo de un vistazo. */
function formatearHoja_() {
  const NOCHE = '#0B1033', HUESO = '#F7F4EE', AMBAR_CLARO = '#FDECC8';
  const h = hoja_();

  const encabezado = h.getRange(1, 1, 1, COLUMNAS.length);
  encabezado.setBackground(NOCHE).setFontColor(HUESO).setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  h.setFrozenRows(1);
  h.setRowHeight(1, 34);

  // Fecha y hora · Folio · Nombre · Correo · WhatsApp · Origen · Entra a la rifa ·
  // Asistió (huérfana) · Asiste V/S/D · Asistió V/S/D
  [130, 100, 200, 220, 120, 100, 120, 90, 95, 95, 95, 100, 100, 100].forEach(function (ancho, i) {
    h.setColumnWidth(i + 1, ancho);
  });

  const filasDatos = Math.max(h.getMaxRows() - 1, 1);
  h.getRange(2, 1, filasDatos, COLUMNAS.length)
    .setFontFamily('Arial').setFontSize(10.5).setVerticalAlignment('middle');

  h.clearConditionalFormatRules();
  const colRifa = columnaLetra_(COLUMNAS.indexOf('Entra a la rifa') + 1);
  const regla = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$' + colRifa + '2="Sí"')
    .setBackground(AMBAR_CLARO)
    .setRanges([h.getRange(2, 1, filasDatos, COLUMNAS.length)])
    .build();
  h.setConditionalFormatRules([regla]);

  SpreadsheetApp.flush();
  Logger.log('Formato aplicado a la hoja.');
}

/* Se corre UNA vez a mano desde el editor, antes de subir el resto de
   este archivo — agrega las 6 columnas nuevas de "día" al final de la
   Sheet real, que hoy solo tiene las 8 originales. Idempotente: si ya
   están, no hace nada (se puede correr de más sin miedo). NO toca
   ninguna fila ni columna existente. */
function agregarColumnasDia_() {
  const h = hoja_();
  const NUEVAS = COLUMNAS.slice(8); // las 6 últimas: Asiste V/S/D + Asistió V/S/D
  const yaEstan = h.getRange(1, 9).getValue() === NUEVAS[0];
  if (yaEstan) {
    Logger.log('agregarColumnasDia_: ya estaban, no se toca nada.');
    return;
  }
  const rango = h.getRange(1, 9, 1, NUEVAS.length);
  rango.setValues([NUEVAS]);
  rango.setFontWeight('bold').setBackground('#0B1033').setFontColor('#F7F4EE')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  SpreadsheetApp.flush();
  Logger.log('agregarColumnasDia_: 6 columnas nuevas agregadas al final.');
}

/* Lee qué día(s) marcó una fila al registrarse. Las filas de ANTES de
   este cambio no tienen nada en esas 3 columnas — se asume que van a
   los 3 días (así era el modelo hasta ahora), para que nadie desaparezca
   del tablero de la puerta por un dato que no existía cuando se registró. */
function diasDeFila_(f) {
  const v = f[8] === 'Sí', s = f[9] === 'Sí', d = f[10] === 'Sí';
  if (!v && !s && !d) return { viernes: true, sabado: true, domingo: true };
  return { viernes: v, sabado: s, domingo: d };
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

// El primer folio real es el 111, no el 1 — arranque pedido por Ed.
const FOLIO_INICIAL = 111;

function siguienteFolio_(total) {
  return PREFIJO_FOLIO + '-' + String(total + FOLIO_INICIAL).padStart(4, '0');
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
    const crudo = (e && e.postData && e.postData.contents) || '{}';
    Logger.log('doPost recibido: ' + crudo);

    const datos = JSON.parse(crudo);

    // Trampa para robots: el formulario trae un campo oculto que una
    // persona nunca llena. Si viene con texto, se acepta en silencio
    // sin escribir nada — el bot cree que funcionó y no reintenta.
    if (normalizar_(datos.sitio)) {
      Logger.log('doPost: trampa de robots activada, no se guarda nada.');
      return json_({ ok: true, folio: 'CIELO-0000', rifa: false });
    }

    const nombre = normalizar_(datos.nombre);
    const correo = normalizar_(datos.correo).toLowerCase();
    const whatsapp = normalizar_(datos.whatsapp);
    const presencial = datos.origen === 'presencial';

    if (nombre.length < 3) { Logger.log('doPost: rechazado por nombre.'); return json_({ ok: false, error: 'nombre' }); }
    if (!correoValido_(correo)) { Logger.log('doPost: rechazado por correo: ' + correo); return json_({ ok: false, error: 'correo' }); }
    if (telefonoClave_(whatsapp).length !== 10) { Logger.log('doPost: rechazado por whatsapp: ' + whatsapp); return json_({ ok: false, error: 'whatsapp' }); }

    // Qué día(s) marcó. Si no manda nada válido (formulario viejo en
    // caché, llamada externa que no se actualizó), se asume los 3 días
    // — nunca se rechaza el registro por esto, el dato es un plus, no
    // un requisito duro.
    const diasPedidos = Array.isArray(datos.dias) ? datos.dias.filter(d => DIAS.indexOf(d) > -1) : [];
    const dias = diasPedidos.length ? diasPedidos : DIAS.slice();

    const previos = registros_();

    if (previos.length >= CUPO) {
      Logger.log('doPost: cupo lleno (' + previos.length + '/' + CUPO + ').');
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
      Logger.log('doPost: ya estaba registrado, se devuelve folio ' + yaEsta[1]);
      return json_({
        ok: true, repetido: true,
        folio: yaEsta[1], nombre: yaEsta[2],
        rifa: yaEsta[6] === 'Sí',
        dias: diasDeFila_(yaEsta)
      });
    }

    const folio = siguienteFolio_(previos.length);
    const entraRifa = !presencial;   // el día del evento ya no entra a la rifa

    // Quien se registra presencial ya está parado en la puerta — se le
    // marca asistencia del día real de hoy, no del genérico de antes.
    const diaHoy = presencial ? diaDeHoy_() : '';

    // Si appendRow truena (Sheets con hipo, permisos, lo que sea), que
    // se sepa en el log con el mensaje real — antes se perdía en el
    // "servidor" genérico de más abajo.
    try {
      hoja_().appendRow([
        new Date(), folio, nombre, correo, whatsapp,
        presencial ? 'Presencial' : 'Plataforma',
        entraRifa ? 'Sí' : 'No',
        '',                                              // Asistió (huérfana)
        dias.indexOf('viernes') > -1 ? 'Sí' : '',
        dias.indexOf('sabado') > -1 ? 'Sí' : '',
        dias.indexOf('domingo') > -1 ? 'Sí' : '',
        diaHoy === 'viernes' ? new Date() : '',
        diaHoy === 'sabado' ? new Date() : '',
        diaHoy === 'domingo' ? new Date() : ''
      ]);
    } catch (errFila) {
      Logger.log('doPost: FALLÓ appendRow — ' + errFila);
      throw errFila;
    }

    Logger.log('doPost: guardado OK, folio ' + folio);

    // Aviso a Ed por cada registro — la Sheet sigue siendo la fuente de
    // verdad, así que un fallo de correo nunca debe tumbar el registro.
    try {
      MailApp.sendEmail({
        to: 'soyedzam@gmail.com',
        subject: 'Nuevo registro — ' + nombre + ' (' + folio + ')',
        body: 'Nombre: ' + nombre + '\nFolio: ' + folio + '\nWhatsApp: ' + whatsapp +
          '\nCorreo: ' + correo + '\nOrigen: ' + (presencial ? 'Presencial' : 'Plataforma') +
          '\nRifa: ' + (entraRifa ? 'Sí' : 'No') + '\nDías: ' + dias.map(function (d) { return NOMBRE_DIA[d]; }).join(', ')
      });
    } catch (errCorreo) {
      Logger.log('doPost: aviso por correo falló (registro sí se guardó) — ' + errCorreo);
    }

    return json_({
      ok: true, folio: folio, nombre: nombre, rifa: entraRifa,
      dias: { viernes: dias.indexOf('viernes') > -1, sabado: dias.indexOf('sabado') > -1, domingo: dias.indexOf('domingo') > -1 },
      lugares: CUPO - (previos.length + 1)
    });

  } catch (err) {
    Logger.log('doPost: ERROR — ' + err);
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
  // (XFrameOptionsMode.DENY no existe en la API — solo ALLOWALL y
  // DEFAULT; dejarlo puesto revienta doGet(). Sin la llamada, Apps
  // Script usa DEFAULT solo.)
  return HtmlService.createHtmlOutputFromFile('tablero')
    .setTitle('Registros · El Cielo en mi Ciudad')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
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
      // Sin mes: todo el congreso cae en agosto, ponerlo es ruido.
      fecha: f[0] ? Utilities.formatDate(new Date(f[0]), 'America/Merida', 'd · HH:mm') : '',
      folio: f[1], nombre: f[2], correo: f[3], whatsapp: f[4],
      origen: f[5], rifa: f[6] === 'Sí',
      dias: diasDeFila_(f),
      asistio: { viernes: Boolean(f[11]), sabado: Boolean(f[12]), domingo: Boolean(f[13]) }
    })).reverse()                           // lo más reciente arriba
  });
}

// Columna real de "Asistió [día]" — 1-based, para h.getRange().
const COL_ASISTIO_DIA = { viernes: 12, sabado: 13, domingo: 14 };

// Alterna, para el día que está activo en el tablero: si ya había
// llegado ESE día, lo desmarca (por si fue un toque accidental o la
// persona se salió); si no, lo marca con la hora real.
function marcarAsistio(clave, folio, dia) {
  if (!claveCorrecta_(clave)) {
    Utilities.sleep(700);
    return JSON.stringify({ ok: false, error: 'clave' });
  }
  const col = COL_ASISTIO_DIA[dia];
  if (!col) return JSON.stringify({ ok: false, error: 'dia' });
  const h = hoja_();
  const filas = h.getDataRange().getValues();
  for (let i = 1; i < filas.length; i++) {
    if (filas[i][1] === normalizar_(folio)) {
      const celda = h.getRange(i + 1, col);
      const yaMarcado = Boolean(filas[i][col - 1]);
      if (yaMarcado) {
        celda.clearContent();
        return JSON.stringify({ ok: true, asistio: false });
      }
      celda.setValue(new Date());
      return JSON.stringify({ ok: true, asistio: true });
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
