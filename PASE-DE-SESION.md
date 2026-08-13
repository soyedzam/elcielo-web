# Pase de Sesión — El Cielo en mi Ciudad
> Handoff para la instancia nueva de Claude que retome este sitio.
> **Léelo completo antes de tocar nada.** Escrito 2-ago-2026 · v2.0 el 10-ago-2026 ·
> reescrito a fondo v3.0 el 12/13-ago-2026 (sesión larga: fotos reales, footer,
> menú móvil, tablero desplegado, y un plan grande de features "estilo app" —
> **NADA de ese plan grande está implementado todavía, solo planeado**).

---

## 0 · Quién eres aquí

Sitio estático en producción de **"El Cielo en mi Ciudad"** — congreso de **Comunidad
Más Alto** (CMA), Mérida, Yucatán, 14–16 de agosto de 2026. Está **EN VIVO** en
`https://elcielo.comunidadmasalto.org`. **🔴 El congreso empieza en 1-2 días** —
cualquier cambio grande se prueba en local primero, con más cuidado que nunca.
Escribe datos reales de personas (el formulario de registro).

## 1 · 🔴 Rutas y reglas duras

- **Repo:** `~/Dev/CMA/elcielo-web` — git propio, remoto `github.com/soyedzam/elcielo-web`, público.
- **Stack: HTML + CSS + JS vanilla. Cero build, cero framework.** Cada página comparte
  `assets/styles.css`, `assets/config.js`, `assets/main.js`. Este sprint sumó
  `assets/momentos.js` (grid de 22 videos + reproductor modal).
- **Hosting: GitHub Pages**, rama `main`, deploy automático en cada push. Fastly cachea
  ~600s — después de cada push, verifica con `curl -I` (headers `age`/`last-modified`),
  no confíes en un screenshot de navegador con caché. **Si Ed dice "no veo el cambio",
  primero confirma con curl que el server SÍ lo tiene — casi siempre es su caché, no el
  deploy** (pasó dos veces esta sesión, las dos veces era su navegador).
- **`sips` de macOS NO exporta a WebP** (`Error: Can't write format: org.webmproject.webp`).
  Usa Python + Pillow en su lugar (ya está instalado, `python3 -c "import PIL"` confirma):
  ```python
  from PIL import Image
  Image.open(f).convert("RGB").save(out, "WEBP", quality=90)
  ```
- **Dominio:** `elcielo.comunidadmasalto.org` — DNS en Hostinger, HTTPS de GitHub OK.
- **Repo compartido — Ed edita en paralelo** desde un preview local (Vite-style, puerto
  visto: 4173). Antes de `git add -A`, corre `git status` y revisa que no haya sorpresas;
  si hay archivos modificados que no son tuyos, no asumas — pregúntale antes de comittear
  (esta sesión pasó dos veces, se resolvió preguntando).

## 2 · Voz y marca — sistema Amanecer v1.0 (sin cambios)

índigo noche `#0B1033` · soporte `#1A2158` · ámbar `#F2A93B` · ámbar claro `#FFD59E` ·
hueso `#F7F4EE`. Archivo (display) · Instrument Sans (cuerpo) · IBM Plex Mono (kickers).
Reglas de voz de la v2.0 siguen todas vigentes (nunca "Culto", domingo SÍ lleva
registro, logo de CMA ya no está limitado solo al footer — Ed lo liberó explícitamente
el 11-ago, "colócalo donde mejor corresponda").

## 3 · Estado real de cada pieza (verificado, no de memoria)

| Pieza | Estado |
|---|---|
| `index.html` | Hero (video), Ejes, **Ponentes: 1 sola foto real de Ofir+Tere juntos** (ya no 2 fotos descoordinadas), Programa, Convoca, **Comunidad: 5 fotos reales del stock de auditorio** (antes 3 genéricas), Pastores, Registro, **footer editorial nuevo**, **menú móvil hamburguesa** |
| `momentos.html` | **Grid de los 22 videos reales** (antes 3) con reproductor en modal, `grid-auto-flow:dense`, tipografía discreta en las 19 normales / grande en las 3 destacadas. **Galería de 8 fotos reales** del stock. Footer + menú móvil nuevos. |
| `agenda.html`, `info.html`, `privacidad.html` | Footer editorial + menú móvil nuevos, sin otros cambios |
| `avance.html`, `escanea.html`, `guion.html`, `invitacion.html` | Solo cache-busting `?v=260811` en el `<link>` de styles.css (cambio de Ed, no mío) — no tienen header/footer compartido |
| Tablero (`_fuente/apps-script/`) | **YA DESPLEGADO en Apps Script** (Versión 3, 11-ago) — asistencia con toggle real (marca y desmarca), botones WhatsApp/llamada/correo funcionando, botón de imprimir en carta vertical, todo más grande. Folio real ya arranca en 111. |

**Cambios grandes de esta sesión (todo comiteado y en vivo):**

1. **Galería de video** (`momentos.html`): portado el patrón de "teatro" de La Nave
   (`lanave.comunidadmasalto.org/galeria-videos.html`) — `assets/videos.json` con los
   22 videos reales, grid + modal, sin YouTube embebido hasta abrir uno.
2. **Curaduría de fotos del stock** (`260802_stock-fotografico-auditorio-comunidad-mas-alto`,
   22 fotos en total): 14 aprobadas por Ed y aplicadas — 1 hero, 5 en "Comunidad" (index),
   8 en galería (momentos). Las 3 con menores (`familia-comunidad`, `nina-sonriendo-comunidad`,
   `familia-ninos-exterior`) **siguen excluidas** — `VALIDAR_AUTORIZACION_MENOR` sin resolver.
3. **Foto real de Ofir + Tere juntos** (sesión nueva, post-producida, llegó 12-ago) —
   resuelve el mismatch de estilo que venía pendiente desde la v2.0. 3 variantes
   disponibles en `assets/fotos/CMA_Retrato-Comunidad-Mas-Alto-pastores-ofir-tere-*`
   (sentado = la usada, de-pie y fondo-rojo = alternas sin usar). Originales +
   WebP también archivados en Drive, `ACTIVOS/06_COMUNIDADES/CMA_Mas-Alto/Fotos/
   260812_retratos-pastores-ofir-tere/`.
4. **Footer rediseñado** — colofón editorial (masthead + reglas + fila legal/social +
   créditos en una línea) en vez de la pila de párrafos grises de antes.
5. **Menú móvil real** — antes `display:none` ocultaba Agenda/Momentos/Info bajo 720px
   y solo quedaba el CTA. Ahora hay hamburguesa → cajón a pantalla completa
   (`#js-top-burger` / `#js-top-nav`, lógica en `main.js` → `iniciarMenuMovil()`).

## 4 · Sistema de registro — sin cambios de fondo esta sesión

Sigue como en la v2.0 (ver `_fuente/apps-script/LEEME.md` para el ritual completo de
5 pasos si hay que reinstalar desde cero). Lo nuevo: **el tablero (paso de código) ya
se desplegó** — antes de esta sesión el repo tenía el fix pero nunca se había pegado
en el editor real de Apps Script; ahora sí, confirmado con la implementación mostrando
"Versión 3" y el mismo ID de despliegue que usa `config.js`.

**Sigue sin resolver:** el reporte de un registro de prueba ("001") que no se guardó
en la Sheet (ver v2.0 §4) — se instrumentó bitácora nueva pero no se ha visto
reaparecer el problema para diagnosticarlo con datos reales.

## 5 · 🔴 Plan grande "estilo app" — SOLO PLANEADO, CERO IMPLEMENTADO

Ed pidió 8 mejoras usando como referencia **`capacitacion2026.lacumbreglobalmexico.org`**
(otra plataforma que el mismo equipo construyó en Claude) — es una PWA completa con
nav de pestañas abajo, saludo dinámico, reloj en vivo, selector ES/EN, chat
"Concierge IA", tab de clima de 3 días, e instalable como app. El plan completo con
código de ejemplo, archivos exactos a tocar, y razonamiento de cada decisión está en:

`/Users/soyedzam/.claude/plans/dynamic-greeting-clover.md`

**Si ese archivo no existe ya en tu sesión (vive fuera del repo, en el home de Ed),
aquí está el resumen — pero el archivo completo tiene el código listo para pegar:**

| # | Pedido | Antes del viernes 14 (evento) | Recomendación |
|---|---|---|---|
| 1 | Correo a soyedzam@gmail.com por cada registro | ✅ Sí — 10 min | `MailApp.sendEmail()` en `doPost()` de `Codigo.gs`, después del `appendRow` exitoso, en `try/catch` silencioso |
| 2 | Encuesta de evaluación condicional | ✅ Sí, si Ed responde 2 preguntas abiertas (abajo) | — |
| 3 | Redes (Instagram/TikTok) + links a ministerios (Kids/Nova/Unica/Vanguardia) | ✅ Sí — 20 min | URLs reales ya investigadas, ver abajo |
| 4 | Widget de clima más rico (actual + 3 días) | 🟡 Versión simple sí, tab completo no | Extender `cargarClima()` de `agenda.js` con `&current=...` de Open-Meteo |
| 5 | Concierge IA (chat) | 🔴 NO — después del evento | Necesita backend nuevo (Cloudflare Worker) para no exponer llave de LLM |
| 6 | Instalar como app (PWA) | 🟡 Versión mínima sí (manifest + iconos), service worker no | Sin SW = instalable pero no offline; suficiente para el objetivo real |
| 7 | Diseño "más profesional, estilo app" | 🟡 Detalles sueltos sí, bottom-tabs no | Reloj en vivo ya existe en `agenda.js` (`actualizarReloj()`), reusar |
| 8 | Selector de idioma ES/EN | 🔴 NO — después del evento | 9 páginas + JS dinámico sin ninguna capa de i18n hoy — riesgo alto a 2 días del evento |

**URLs reales ya investigadas para el punto 3** (no inventar, ya están confirmadas):
- Instagram: `https://www.instagram.com/comunidad_masalto/`
- TikTok: `https://www.tiktok.com/@comunidad_masalto`
- YouTube: `https://www.youtube.com/@comunidadmasalto`
- Ministerios: `kids.`, `nova.`, `unica.`, `vanguardia.comunidadmasalto.org`
  (Ed dijo "Univa" en voz — es **Unica**, confirmado en comunidadmasalto.org)

**🔴 Preguntas abiertas que Ed NUNCA llegó a responder esta sesión** (se cerró la
sesión antes de que contestara — pregúntaselas de nuevo antes de tocar el punto 2):
1. La encuesta de evaluación: ¿"que aparezca hasta el sábado" es que se **muestra
   desde** el sábado, o que **deja de mostrarse** el sábado?
2. ¿Ya existe el link real de la encuesta (Google Forms/Tally/otro)? No hay uno en
   el proyecto todavía.
3. Confirmar que Concierge IA e i18n completo quedan para después del evento — Ed
   no llegó a decir que sí ni que no explícitamente, solo cerró la sesión.

## 6 · ⚠️ Abierto — heredado de v2.0, sigue sin resolver

1. Título y eje de sábado-noche y domingo — sigue sin confirmar.
2. ¿El Taller de sábado-mañana sigue en pie? — sin confirmar.
3. Rifa (mecánica/premio) — sin respuesta de los pastores.
4. El reporte "001" sin guardar en la Sheet — instrumentado, no diagnosticado.
5. Las 3 fotos con menores sin autorización — siguen fuera del sitio a propósito.

## 7 · Lecciones pagadas esta sesión — no las repitas

- **`sips` no exporta WebP en este Mac** — usa Pillow (`python3 -c "import PIL"` para
  confirmar que está instalado antes de necesitarlo a medio flujo).
- **El sandbox de Google bloquea que la automatización de navegador escriba en el
  campo de contraseña del tablero** — ya estaba documentado en v2.0, se confirmó otra
  vez. No pierdas tiempo intentándolo con `computer`/`javascript_tool`; un clic real
  de Ed sí funciona.
- **El pane de preview de este entorno renderiza mal elementos `position:fixed` o con
  `transform` cuando se hace `scrollIntoView` por JS** (el menú móvil abierto se veía
  transparente/doble-expuesto en el screenshot pese a que los estilos computados eran
  perfectos). Verifica con `getComputedStyle` + `getBoundingClientRect`, no confíes
  solo en el screenshot cuando hay overlays fixed.
- **Repo compartido: Ed edita en paralelo desde su propio preview.** `git status` antes
  de cualquier `git add -A`; si hay archivos que no tocaste tú, pregunta antes de
  comittearlos junto con los tuyos (aunque casi siempre son inofensivos, como pasó
  con el cache-busting `?v=` de esta sesión).
- **Monaco de Apps Script tiene `window.monaco.editor.getEditors()[0].setValue(text)`**
  — mucho más confiable que simular teclas o usar el portapapeles (que falla por
  `document.hasFocus()` en este entorno). Trae el contenido por `fetch` directo desde
  GitHub raw en vez de pasarlo en base64 gigante por el prompt.
- **Extraer el ID de una carpeta de Google Drive sincronizada localmente:**
  `xattr -p "com.google.drivefs.item-id#S" "<ruta>"` — da el ID real, arma el link con
  `https://drive.google.com/drive/folders/<ID>`.

## 8 · Cómo se responde a Ed

Directo, conciso, mínimo texto. Verifica en vivo con evidencia real (curl, capturas,
computed styles) antes de decir "listo". Cierre de respuesta larga: ✅ qué se hizo ·
➡️ siguiente paso · ⚠️ pendientes. Cuando el pedido es grande y con fecha límite
encima (como el plan de 8 features a 2 días del evento), decir con claridad qué NO
alcanza a entrar y por qué — Ed lo prefiere a que algo se rompa por prisa.

## 9 · El guion de cabina NO es la agenda pública (sin cambios, ver v2.0 §8)

---
*El Cielo en mi Ciudad · Pase de Sesión · v3.0 · 12/13-ago-2026 · La fragua produce; el taller archiva.* 🕊️
