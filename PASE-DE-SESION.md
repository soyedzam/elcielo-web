# Pase de Sesión — El Cielo en mi Ciudad
> Handoff para la instancia nueva de Claude que retome este sitio.
> **Léelo completo antes de tocar nada.** v2.0 el 10-ago · v3.0 el 12/13-ago ·
> v4.0 el 13/14-ago · v5.0 el 16/17-ago — el congreso YA PASÓ ·
> v6.0 el 17-ago (tarde) — la memoria ya tiene material dentro · v6.1 el 19-ago ·
> **v6.2 el 19-ago (tarde) — LA GALERÍA DE FOTOS ESTÁ CERRADA. Solo faltan videos.**

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
  🔴 **La regla se rompió y nadie lo vio hasta el 19-ago:** `privacidad.html` seguía
  prometiendo la rifa en 4 lugares (tabla de datos ×2, lista de usos, retención). Se
  limpió el 19-ago con "va" explícito de Ed. **Lección: al prohibir una palabra, se
  audita TODO el sitio con `grep -rin`, no solo las páginas donde se recuerda que estaba.**
  El tablero de Apps Script sí la conserva — es interno y está permitido.

## 3 · 🟢 Lo que está en vivo hoy

| Pieza | Estado |
|---|---|
| `index.html` | Modo post-evento: hero en pasado, sin cuenta regresiva, sin cupo, sin formulario |
| `asi-lo-vivimos.html` | **La memoria del congreso.** 3 de 9 reels + **34 fotos, GALERÍA CERRADA** (Viernes 14 · Domingo 16) + el video que abrió el congreso + "¿Tú también grabaste algo?" |
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
3. **Fotos con menores: CERO en este evento.** El 19-ago Ed cerró el criterio —
   *"no se muestran fotos de menores para ese evento"*. Ya no es "sin autorización
   escrita": es **no se publican, punto**. Las 4 que esperaban su criterio quedan fuera
   de forma definitiva, junto a las 7 ya congeladas. No hay ruta de apelación: si una
   foto tiene un menor identificable, no entra.
   🔴 **Nunca heredes la clasificación de menores de otra pasada.** El inventario del
   16-ago marcaba `domingo-audiencia-reunida-02` como apta y tenía un bebé con rostro
   totalmente identificable en primer plano — se cazó con zoom antes de publicar. Se
   re-verifica siempre, foto por foto, aunque venga "ya revisado".

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
- 🔴 **AppleScript manda las teclas a la app que está AL FRENTE, no a la que crees.**
  Al automatizar el selector nativo de archivos, las pulsaciones se fueron a **WhatsApp**
  —incluidos dos Enter— porque Chrome no tenía el foco. No se envió nada, pero fue suerte.
  Antes de cualquier `keystroke`: verificar con
  `get name of first application process whose frontmost is true` y activar la app a mano.
- **`[hidden]` no le gana a un `display` propio.** Le pasó a `.res-puerta` y volvió a
  pasarle a `.viv-grid`: los dos paneles de día se apilaban y las pestañas no ocultaban
  nada. Cualquier elemento que el JS oculte con `hidden` y que tenga `display:` en CSS
  necesita su propia regla `[hidden] { display: none }`.
- **Las pestañas de día (`.lx-dia-tab`) nacieron para fondo hueso.** Sobre una sección
  `lx-on-night` quedan tinta sobre tinta y la no-seleccionada se vuelve invisible. Hay
  override scopeado a `.lx-on-night`; si reusas el componente en otro fondo, revisa color.
- **El pane de preview clampea el scroll** además de lo ya sabido: no dejaba llegar a la
  galería y habría hecho concluir que todo estaba bien. Playwright + Chrome real
  (`chromium.launch({channel:"chrome"})`) lo resolvió en un intento. La altura del
  documento (5123 → 4641 px) fue la prueba del arreglo, no una captura.

## 5-bis · La galería y el video (17-ago tarde) — cómo funcionan

**Las fotos van por día** en `config.asiVivimos.fotos` (`viernes` / `sabado` / `domingo`).
El JS pone pestañas **solo si hay más de un día con fotos** — una sola pestaña es un botón
que no decide nada. Cada foto necesita su miniatura (mismo nombre + `-t`).

**El motor que las prepara** está versionado en `_fuente/photoforge/` (copia de trabajo en
`~/Dev/CMA/scripts/`). Lee su `LEEME.md` antes de procesar un lote nuevo: **el motor no
cura**, y la curación pesa más que el procesado (101 originales → 18 publicadas; Ed
rechazó una primera curación de 25 por dejar casi-duplicados).

**El video de "Con esto abrimos"** está **no listado** en YouTube por decisión de Ed. No
listado **no impide el embed** — verificado reproduciéndolo en el sitio. Si algún día se
hace público, en el código no hay que tocar nada.

🔴 **Ese bloque se llamaba "Así lo anunciamos"** y prometía *"el video con el que
convocamos, meses antes"*. El video que existe no es ese: es el de visión de CMA que
abrió las tres noches. Se reescribió el copy en vez de meter la pieza en un marco que
mentía. Si vuelve a aparecer el copy viejo, es regresión.

## 6 · ⚠️ Abierto

1. ~~4 fotos en duda por menores~~ — 🟢 **CERRADO 19-ago: no se publican.** Ed decidió
   cero fotos de menores en este evento (ver §4.3). Siguen en
   `~/Dev/CMA/_entrada-medios/fotos/` sin publicar. 🔴 Ojo si alguna vez se reabre: se
   llaman `…auditorio-bajo-carpa-02…` — el nombre lleva palabra prohibida y el repo es
   público, habría que renombrarlas antes de tocarlas.
2. ~~Fotos del sábado 15~~ — 🟢 **CERRADO 19-ago: LA GALERÍA DE FOTOS ESTÁ CERRADA.**
   Ed: *"fotos del sábado ya están todas, ya no más fotos en la plataforma"*. El sitio se
   queda con **34 fotos definitivas** (18 viernes + 16 domingo). **El sábado en 0 no es un
   hueco: es una decisión.** No vuelvas a pedirle fotos del sábado, no proceses lotes
   nuevos y no trates el 0 del sábado como pendiente. Las pestañas de día muestran solo
   Viernes y Domingo, que es lo correcto — no inventes una pestaña de sábado vacía.
3. **6 reels faltantes** (van 3 de 9) — el buzón es `~/Dev/CMA/_entrada-medios/reels/`.
4. **El recap** sigue en post-producción → va a **YouTube** (pesa más de lo que
   Cloudflare Pages admite por archivo), y su ID entra en `config.asiVivimos.recap`.
   Su bloque en la página ya está listo y vacío.
5. ~~El PDF confidencial a Val~~ — 🟢 **CERRADO 19-ago: llegó.** Confirmado por Ed.
6. **Correo de aviso por registro** sigue en pausa: `CORREO_ACTIVO = false`, por decisión
   explícita de Ed. No lo actives sin que lo pida.
7. ~~Los pastores no han contestado sobre la encuesta~~ — 🟢 **CERRADO 19-ago: la
   encuesta sigue abierta.** Confirmado por Ed. `encuesta.html` se queda recibiendo y no
   se toca el CTA.

## 6-bis · 🔴 Consecuencia de cerrar la galería — SIN TOCAR, falta el "va"

Al cerrar las fotos, quedaron **textos que prometen fotos que ya no van a llegar**. Se
detectaron el 19-ago y **NO se corrigieron** porque Ed cerró sesión antes de dar el "va".
Es lo primero que hay que ponerle enfrente al retomar:

| Dónde | Texto | Problema |
|---|---|---|
| `asi-lo-vivimos.html:7` (meta description) | "las fotos de **los tres días**" | Solo hay viernes y domingo. Lo lee Google. |
| `asi-lo-vivimos.html:15` (og:description) | "las fotos de **los tres días**" | Es lo que se ve al compartir en redes. |

Dos que **NO** hay que tocar (ya se verificaron inactivos, no son bugs):
- `asi-lo-vivimos.html:133` — "Fotos y videos de los tres días, en edición" vive en
  `#js-viv-vacio`, que solo se muestra si **no hay nada** en la página. Con fotos y reels
  publicados está oculto. Es el estado vacío legítimo, déjalo.
- El fallback `proximamente()` de fotos ("La galería se va llenando estos días") solo
  corre si `fotosTuvoDato` es falso. Con 34 fotos nunca dispara.

🔴 **`reelsTotal: 9` SÍ sigue siendo honesto** — los 6 reels y el recap siguen pendientes,
así que la barra de progreso no miente. No la toques al arreglar los metas.

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
*El Cielo en mi Ciudad · Pase de Sesión · v6.2 · 19·ago·2026 · El evento pasa; la plataforma queda.* 🕊️
