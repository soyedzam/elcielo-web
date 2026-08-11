/* EL CIELO EN MI CIUDAD · formulario de registro.
   Manda el registro a la hoja del equipo (Apps Script) y muestra el folio.

   Sin URL configurada, el formulario no se enseña: queda el WhatsApp de
   informes. Vale más un canal que funciona que un formulario que traga
   los datos y no avisa a nadie. */

const cfgR = window.ELCIELO || {};

const zona   = document.getElementById('js-form-zona');
const form   = document.getElementById('js-registro');
const generando = document.getElementById('js-form-generando');
const textoGenerando = document.getElementById('js-generando-texto');
const fillGenerando = document.getElementById('js-generando-fill');
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
    zona.hidden = true;
    if (generando) {
      generando.hidden = false;
      if (textoGenerando) textoGenerando.textContent = 'Verificando disponibilidad…';
      if (fillGenerando) fillGenerando.style.width = '6%';
    }

    try {
      /* text/plain a propósito: con application/json el navegador manda
         antes una petición de permiso que Apps Script no contesta, y el
         registro nunca sale. */
      const peticion = fetch(cfgR.urlRegistro, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          nombre: nombre.input.value.trim(),
          whatsapp: soloDigitos(whatsapp.input.value),
          correo: correo.input.value.trim(),
          sitio: trampa ? trampa.value : '',
          origen: 'plataforma'
        })
      }).then(function (resp) { return resp.json(); });

      /* La petición real corre en paralelo al "efecto Kayak": ver el folio
         armarse en pasos, aunque la respuesta ya haya llegado, sube cuánto
         confía la persona en el resultado (labor illusion, Buell & Norton). */
      const resultados = await Promise.all([peticion, animarGenerando()]);
      const r = resultados[0];

      if (r.ok) { confirmar(r); return; }
      if (generando) generando.hidden = true;
      if (r.error === 'lleno') { avisarLleno(); return; }
      throw new Error(r.error || 'falló');

    } catch (err) {
      if (generando) generando.hidden = true;
      zona.hidden = false;
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

/* Secuencia de "creación" del folio — 3 pasos, ~2.9s en total. El texto
   avanza solo; si la respuesta real tarda más, se queda en el último
   paso hasta que llegue (nunca promete el 100% antes de tiempo). */
function animarGenerando() {
  if (!generando) return Promise.resolve();
  const pasos = [
    { t: 0,    msg: 'Verificando disponibilidad…', pct: 20 },
    { t: 900,  msg: 'Apartando tu lugar…',          pct: 58 },
    { t: 1850, msg: 'Generando tu folio…',          pct: 90 }
  ];
  return new Promise(function (resolve) {
    const temporizadores = pasos.map(function (paso) {
      return setTimeout(function () {
        if (textoGenerando) textoGenerando.textContent = paso.msg;
        if (fillGenerando) fillGenerando.style.width = paso.pct + '%';
      }, paso.t);
    });
    temporizadores.push(setTimeout(function () {
      if (fillGenerando) fillGenerando.style.width = '100%';
      setTimeout(resolve, 280);
    }, 2650));
  });
}

/* Confeti vanilla, sin librería — respeta "movimiento reducido" del
   sistema: sin partículas, sin animar, el folio aparece igual.
   El paso de la física va por tiempo real (delta-time), no por cuadro:
   así se ve igual de rápido en una pantalla de 60Hz que en una de 120Hz,
   y un frame perdido no lo deja "flotando" de más. Duración dura por
   reloj (4.2s), nunca por conteo de cuadros. */
function confeti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const DURACION_MS = 4200;
  const colores = ['#F2A93B', '#FFD59E', '#8A5A12', '#F7F4EE'];
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const piezas = [];
  for (let i = 0; i < 140; i++) {
    piezas.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 140,
      y: canvas.height * 0.32,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -12 - 4,
      g: 0.3 + Math.random() * 0.12,
      w: 6 + Math.random() * 5,
      h: 8 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: colores[Math.floor(Math.random() * colores.length)]
    });
  }
  // Red de seguridad: si el tab pierde foco y el navegador congela
  // requestAnimationFrame (pasa en pestañas en segundo plano), esto
  // igual quita el canvas — nunca se queda flotando de por vida.
  const quitar = setTimeout(function () { canvas.remove(); }, DURACION_MS + 500);

  const inicio = performance.now();
  let anterior = inicio;
  (function paso(ahora) {
    const transcurrido = ahora - inicio;
    const dt = Math.min((ahora - anterior) / (1000 / 60), 3);   // en "cuadros de 60fps", topado
    anterior = ahora;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    piezas.forEach(function (p) {
      p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      const vida = Math.max(1 - transcurrido / DURACION_MS, 0);
      if (vida <= 0) return;
      ctx.save();
      ctx.globalAlpha = vida;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (transcurrido < DURACION_MS) {
      requestAnimationFrame(paso);
    } else {
      clearTimeout(quitar);
      canvas.remove();
    }
  })(inicio);
}

function confirmar(r) {
  zona.hidden = true;
  if (generando) generando.hidden = true;
  listo.hidden = false;
  listo.innerHTML =
    '<div class="lx-listo">' +
      '<div class="lx-listo-ico" aria-hidden="true">✓</div>' +
      '<h3>' + (r.repetido ? 'Ya tenías tu lugar' : 'Tu lugar está apartado') + '</h3>' +
      '<p class="lx-listo-nombre">' + escapar(r.nombre).toUpperCase() + '</p>' +
      '<p class="lx-listo-copy">' +
        (r.repetido
          ? 'Tu registro ya estaba hecho, no hace falta repetirlo. Este es tu folio:'
          : 'Nos vemos del 14 al 16 de agosto. Guarda este folio, es lo que te van a pedir en la entrada:') +
      '</p>' +
      '<div class="lx-folio-caja"><span>Tu folio</span><b>' + escapar(r.folio) + '</b></div>' +
      (r.rifa
        ? '<div class="lx-rifa-card">' +
            '<span class="lx-rifa-ico" aria-hidden="true">🎁</span>' +
            '<span class="lx-rifa-copy"><b>Estás dentro de la rifa</b><span>Del congreso — solo por registrarte antes.</span></span>' +
          '</div>'
        : '') +
      '<p class="lx-listo-captura">Toma una captura de pantalla — así lo tienes a la mano el día del congreso.</p>' +
      '<div class="lx-listo-mapas">' +
        '<span class="lx-listo-mapas-t">¿Cómo llegas?</span>' +
        '<div class="lx-mapas">' +
          '<a class="lx-mapa-btn" href="https://www.google.com/maps/place/Comunidad+M%C3%A1s+Alto/@21.027526,-89.5794081,17z/data=!3m1!4b1!4m6!3m5!1s0x8f5677b06a7551c1:0xe9d4fba775ea49f6!8m2!3d21.027521!4d-89.5768332!16s%2Fg%2F11lryyxxhf" target="_blank" rel="noopener">Google Maps</a>' +
          '<a class="lx-mapa-btn" href="https://maps.apple.com/?ll=21.027521,-89.5768332&q=Comunidad%20M%C3%A1s%20Alto" target="_blank" rel="noopener">Apple Maps</a>' +
          '<a class="lx-mapa-btn" href="https://waze.com/ul?ll=21.027521,-89.5768332&navigate=yes" target="_blank" rel="noopener">Waze</a>' +
        '</div>' +
      '</div>' +
    '</div>';
  listo.setAttribute('tabindex', '-1');
  listo.focus();
  listo.scrollIntoView({ block: 'center', behavior: 'smooth' });
  if (!r.repetido) confeti();
}

function avisarLleno() {
  /* El cupo es real (300 personas, el aforo de la carpa) y ya se llenó
     con este mismo registro en línea o presencial — no prometemos un
     lugar en la puerta que no podemos garantizar. */
  zona.hidden = true;
  if (generando) generando.hidden = true;
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
