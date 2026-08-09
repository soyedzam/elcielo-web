/* EL CIELO EN MI CIUDAD · formulario de registro.
   Manda el registro a la hoja del equipo (Apps Script) y muestra el folio.

   Sin URL configurada, el formulario no se enseña: queda el WhatsApp de
   informes. Vale más un canal que funciona que un formulario que traga
   los datos y no avisa a nadie. */

const cfgR = window.ELCIELO || {};

const zona   = document.getElementById('js-form-zona');
const form   = document.getElementById('js-registro');
const listo  = document.getElementById('js-form-listo');
const canalWa = document.getElementById('js-canal-alt');
const boton  = document.getElementById('js-enviar');

const TEXTO_BOTON = boton ? boton.textContent : '';

function mostrarWhatsApp() {
  if (canalWa) canalWa.hidden = false;
}

/* Sin registro en línea: solo el canal de informes. */
if (!form || !cfgR.urlRegistro) {
  if (zona) zona.hidden = true;
  mostrarWhatsApp();
} else {
  iniciar();
}

function campo(id) {
  const input = document.getElementById(id);
  return { input: input, caja: input ? input.closest('.lx-campo') : null };
}

function marcarMal(c, mal) {
  if (!c.caja) return;
  c.caja.classList.toggle('lx-mal', mal);
  if (c.input) c.input.setAttribute('aria-invalid', mal ? 'true' : 'false');
}

/* Solo dígitos, sin el 52/521 de México, para comparar y para enviar. */
function soloDigitos(tel) {
  let d = String(tel || '').replace(/\D/g, '');
  if (d.length > 10 && d.startsWith('521')) d = d.slice(3);
  else if (d.length > 10 && d.startsWith('52')) d = d.slice(2);
  return d;
}

function validar(nombre, whatsapp, correo) {
  const errores = [];
  if (nombre.input.value.trim().length < 3) errores.push(nombre);
  if (soloDigitos(whatsapp.input.value).length !== 10) errores.push(whatsapp);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.input.value.trim())) errores.push(correo);
  return errores;
}

function iniciar() {
  const nombre   = campo('f-nombre');
  const whatsapp = campo('f-whatsapp');
  const correo   = campo('f-correo');
  const trampa   = document.getElementById('f-sitio');

  /* El error se quita en cuanto la persona corrige, no al reenviar:
     que el formulario responda mientras escribes quita la sensación
     de estar peleando con él. */
  [nombre, whatsapp, correo].forEach(function (c) {
    if (!c.input) return;
    c.input.addEventListener('input', function () {
      if (c.caja && c.caja.classList.contains('lx-mal')) marcarMal(c, false);
    });
  });

  form.addEventListener('submit', async function (ev) {
    ev.preventDefault();

    const errores = validar(nombre, whatsapp, correo);
    [nombre, whatsapp, correo].forEach(function (c) {
      marcarMal(c, errores.indexOf(c) > -1);
    });
    if (errores.length) {
      errores[0].input.focus();
      errores[0].input.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    boton.disabled = true;
    boton.textContent = 'Apartando tu lugar…';

    try {
      /* text/plain a propósito: con application/json el navegador manda
         antes una petición de permiso que Apps Script no contesta, y el
         registro nunca sale. */
      const respuesta = await fetch(cfgR.urlRegistro, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          nombre: nombre.input.value.trim(),
          whatsapp: soloDigitos(whatsapp.input.value),
          correo: correo.input.value.trim(),
          sitio: trampa ? trampa.value : '',
          origen: 'plataforma'
        })
      });
      const r = await respuesta.json();

      if (r.ok) { confirmar(r); return; }
      if (r.error === 'lleno') { avisarLleno(); return; }
      throw new Error(r.error || 'falló');

    } catch (err) {
      boton.disabled = false;
      boton.textContent = TEXTO_BOTON;
      const error = document.getElementById('js-form-error');
      if (error) {
        error.textContent = 'No pudimos guardar tu registro. Revisa tu conexión e inténtalo otra vez, o escríbenos por WhatsApp.';
        error.style.display = 'block';
      }
      mostrarWhatsApp();
    }
  });
}

function confirmar(r) {
  zona.hidden = true;
  listo.hidden = false;
  listo.innerHTML =
    '<div class="lx-listo">' +
      '<div class="lx-listo-ico" aria-hidden="true">✓</div>' +
      '<h3>' + (r.repetido ? 'Ya tenías tu lugar' : 'Tu lugar está apartado') + '</h3>' +
      '<p>' +
        (r.repetido
          ? 'Tu registro ya estaba hecho, no hace falta repetirlo. Este es tu folio:'
          : 'Nos vemos del 14 al 16 de agosto. Guarda este folio, es lo que te van a pedir en la entrada:') +
      '</p>' +
      '<div class="lx-folio-caja"><span>Tu folio</span><b>' + escapar(r.folio) + '</b></div>' +
      (r.rifa ? '<p style="margin-top:18px">🎁 <strong>Estás dentro de la rifa</strong> del congreso.</p>' : '') +
      '<p style="margin-top:18px">Toma una captura de pantalla — así lo tienes a la mano el día del congreso.</p>' +
    '</div>';
  listo.setAttribute('tabindex', '-1');
  listo.focus();
  listo.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

function avisarLleno() {
  /* El cupo es real (300 personas, el aforo de la carpa) y ya se llenó
     con este mismo registro en línea o presencial — no prometemos un
     lugar en la puerta que no podemos garantizar. */
  zona.hidden = true;
  listo.hidden = false;
  listo.innerHTML =
    '<div class="lx-listo">' +
      '<h3>Se llenó el cupo</h3>' +
      '<p>Los 300 lugares ya están apartados. Si alguien libera el suyo puede haber espacio el día del evento, pero no lo podemos garantizar — escríbenos por WhatsApp y te decimos cómo va el cupo más cerca de la fecha.</p>' +
    '</div>';
  mostrarWhatsApp();
}

function escapar(t) {
  return String(t == null ? '' : t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
