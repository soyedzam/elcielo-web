# Pase de Sesión — El Cielo en mi Ciudad
> Handoff para la instancia nueva de Claude que retome este sitio.
> **Léelo completo antes de tocar nada.** v2.0 el 10-ago · v3.0 el 12/13-ago ·
> v4.0 el 13/14-ago · **v5.0 el 16/17-ago-2026 — el congreso YA PASÓ.**
> Esta versión reescribe el pase para el mundo post-evento: qué quedó vivo, qué se
> aprendió y qué sigue abierto.

---

## 0 · Quién eres aquí

Sitio estático en producción de **"El Cielo en mi Ciudad"** — congreso de **Comunidad
Más Alto** (CMA), Mérida, Yucatán. **La 1ª edición ya se celebró: 14–16 de agosto de 2026.**
Vive en `https://elcielo.comunidadmasalto.org`.

El sitio pasó de "vende el evento" a **"guarda la memoria del evento y recoge qué
sintió la gente"**. Escribe datos reales de personas: trátalos como tales.

## 1 · 🔴 Rutas y reglas duras

- **Repo:** `~/Dev/CMA/elcielo-web` — remoto `github.com/soyedzam/elcielo-web`, **público**.
  🔴 Por eso: **jamás un dato personal en este repo.** Los nombres/correos/WhatsApp
  viven solo en la Sheet del equipo y en `ACTIVOS/…/260817_confidencial/`.
- **Stack: HTML + CSS + JS vanilla. Cero build, cero framework.**
- **Hosting: GitHub Pages**, rama `main`, deploy automático en cada push.
  Fastly cachea ~600s — verifica con `curl -I` (`age`/`last-modified`), **nunca con una
  captura**. Si el build queda `errored` sin razón, reintenta con
  `gh api -X POST repos/soyedzam/elcielo-web/pages/builds` antes de sospechar del código.
- **Backend: Google Apps Script** — proyecto "El Cielo 2026 — Registro y Tablero",
  cuenta `soyedzam@gmail.com`. **Versión 6 activa** (17-ago). La URL `/exec` es la misma
  desde el inicio y **no debe cambiar**: para actualizar, siempre
  *Implementar → Administrar implementaciones → editar la activa → Nueva versión*.
  **Nunca "Nueva implementación"** (crea URL nueva y rompe `config.js`).
- **Media pesada:** Cloudflare Pages `xs-elcielo-media` (cuenta c3f13d0a). Los reels y el
  video del hero viven ahí, **fuera de git**. Antes de desplegar, **espeja lo que ya está
  publicado** o el deploy lo borra (`~/Dev/CMA/_deploy-media-stage/` tiene el mirror).
- **Dominio:** DNS en Hostinger, HTTPS de GitHub OK.
- **Repo compartido — Ed edita en paralelo.** `git status` antes de cualquier `git add -A`.

## 2 · Voz y marca — sistema Amanecer v1.0

índigo noche `#0B1033` · soporte `#1A2158` · ámbar `#F2A93B` · ámbar claro `#FFD59E` ·
hueso `#F7F4EE`. Archivo (display) · Instrument Sans (cuerpo) · IBM Plex Mono (kickers).

**Palabras prohibidas por pedido explícito de Ed:**
- ❌ **"carpa"** — se dice *el lugar*, *la casa*. (17-ago)
- ❌ **"rifa"** — ya no se promete en ningún lado (13-ago). La columna sigue en la Sheet
  por compatibilidad, pero es dato interno, no promesa pública.

## 3 · 🟢 Lo que está en vivo hoy

| Pieza | Estado |
|---|---|
| `index.html` | Modo post-evento: hero en pasado, sin cuenta regresiva, sin cupo, sin formulario |
| `asi-lo-vivimos.html` | **La memoria del congreso.** 3 de 9 reels + barra de progreso honesta + tarjetas "Próximamente" + "¿Tú también grabaste algo?" |
| `encuesta.html` | 8 preguntas, una por pantalla, anónima. **Guardando de verdad** (probado end-to-end) |
| `resultados.html` | **Tablero público de KPIs**, sin contraseña (pedido explícito de Ed). Solo agregados |
| `agenda.html` · `info.html` · `momentos.html` · `privacidad.html` | Nav volteado a post-evento |
| Tablero de puerta (Apps Script) | Asistencia por día + **botón "Reporte MKT"** (solo cifras, cero datos personales) |

**El interruptor pre/post:** `config.ctaDestino` en `assets/config.js` manda **todos** los
`[data-cta]` del sitio. Voltear el sitio entero ya no requiere tocar código.

## 4 · 🔴 Lo que NUNCA debe pasar

1. **Datos personales al repo.** Es público. El informe con los 31 correos/WhatsApp vive
   en `ACTIVOS/06_COMUNIDADES/CMA_Mas-Alto/El-Cielo-en-mi-Ciudad/260817_confidencial/`.
2. **`resultados.html` no muestra nombre ni contacto.** Está verificado en el backend
   (`datosEvaluacion()` NO devuelve esas columnas), no solo en el front. Si tocas esa
   función, vuelve a verificarlo.
3. **Fotos con menores identificables** no se publican sin autorización escrita de
   madre/padre o tutor. Hay 3 congeladas desde agosto por esto.

## 5 · Lecciones pagadas — no las repitas

Las de esta sesión ya subieron al canon como leyes formales; aquí las que muerden a diario:

- **`curl` NO puede hacer POST a Apps Script.** El redirect de Google lo rompe y devuelve
  una página de error de Drive que **parece backend roto**. Verifica con `fetch()` real
  desde el navegador.
- **`Content-Type: text/plain` a propósito.** Con `application/json` el navegador manda un
  preflight CORS que Apps Script no contesta, y el envío **nunca llega, en silencio**.
- **Columnas nuevas siempre AL FINAL** de la Sheet. En medio, corre los datos guardados.
- **El selector "Ejecutar" de Apps Script oculta las funciones que terminan en `_`.**
  Wrapper temporal sin guion bajo, córrelo, y repega el archivo limpio desde GitHub raw.
- **Mueve archivos a Apps Script con `fetch` a GitHub raw + `monaco.editor.setValue()`**,
  nunca pegando strings escapados. Esta lección se pagó **tres veces**.
- **`if (!valor)` casi tumba el tablero público** — cuidado con falsy en booleanos y ceros.
- **HEVC 10-bit de los Pixel/iPhone no reproduce en web.** Transcodifica a H.264 8-bit
  (`-pix_fmt yuv420p`) o falla con "high profile doesn't support a bit depth of 10".
- **`sips` no exporta WebP** en esta Mac — usa Python + Pillow.
- **El pane de preview no avanza las transiciones CSS.** Un `getComputedStyle` puede
  devolver el valor inicial y hacerte creer que una regla no aplica. Neutraliza la
  transición para verificar.
- **`flex-basis` se interpretó como altura** y creó 486px de aire en el footer. El
  diagnóstico falló dos veces antes de encontrarlo: mide con `getBoundingClientRect`.
- **WhatsApp Web no acepta adjuntos por automatización.** El input de imágenes
  (`accept="image/*"`) rechaza PDFs en silencio; hay que abrir el menú Documento para que
  aparezca el input `accept="*"`. Aun así, el envío final exige un clic humano real.

## 6 · ⚠️ Abierto

1. **6 reels faltantes** (van 3 de 9) — el buzón es `~/Dev/CMA/_entrada-medios/reels/`.
2. **Recap y teaser** en post-producción → van a **YouTube** (pesan más de lo que
   Cloudflare Pages admite por archivo), y su ID entra en `config.asiVivimos`.
3. **~66 fotos** pendientes, con el filtro de menores aplicado.
4. **El PDF confidencial no se envió a Val por WhatsApp** — los 2 mensajes de texto sí.
   Ed tiene que arrastrarlo desde Descargas.
5. **Correo de aviso por registro** sigue en pausa: `CORREO_ACTIVO = false`, por decisión
   explícita de Ed. No lo actives sin que lo pida.
6. **Los pastores no han contestado** si la encuesta se queda abierta.

## 7 · Cómo se responde a Ed

Directo, conciso, mínimo texto. Tablas antes que párrafos. Estado con 🟢🟡🔴.
Verifica en vivo con evidencia real antes de decir "listo" — nunca con una captura
cacheada ni con `curl` puro contra Apps Script.
**"No despliegues hasta que lo revise" es literal y por pieza**: el "va" tiene que ser
explícito para cada cosa. Pasó con el registro por día vs. el correo: aprobó uno y dejó
el otro en pausa en el mismo mensaje.

## 8 · Este sitio es la 3ª corrida de EventForge

El motor de eventos del ecosistema (`_SISTEMA/SoS/EventForge/`) **calibró su doctrina el
17-ago** usando este sitio como evidencia. Dos cosas que importan aquí:

- **Este sitio ganó el ship contra el motor Next.js**, por una razón estructural: el
  dominio del cliente vive en Squarespace, y `custom_domain` de Cloudflare exige la zona
  DNS dentro de Cloudflare. GitHub Pages + CNAME funciona con cualquier registrador.
- **Pero este repo ya muestra la descomposición que el motor existía para evitar:** las
  fechas del evento están escritas en 3 archivos y las coordenadas de Mérida en 4. Si vas
  a clonar esto para otro evento, **lee la doctrina primero** — la conclusión fue que
  EventForge debe ser un *generador* de estático, no una app ni un clon a mano.

---
*El Cielo en mi Ciudad · Pase de Sesión · v5.0 · 17·ago·2026 · El evento pasa; la plataforma queda.* 🕊️
