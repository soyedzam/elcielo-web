# Pase de Sesión — El Cielo en mi Ciudad
> Handoff para la instancia nueva de Claude que retome este sitio.
> **Léelo completo antes de tocar nada.** Escrito 2-ago-2026 · reescrito a fondo 10-ago-2026 (v2.0, sesión larga con cambios grandes).

---

## 0 · Quién eres aquí

Sitio estático en producción de **"El Cielo en mi Ciudad"** — congreso de **Comunidad Más Alto** (CMA), Mérida, Yucatán, 14–16 de agosto de 2026. Está **EN VIVO** en `https://elcielo.comunidadmasalto.org`. No es un borrador: cualquier cambio que hagas puede verlo el público en minutos, y **escribe datos reales de personas** (el formulario de registro). Verifica siempre en vivo, con navegador real, antes de decir "listo".

El **10-ago-2026 los pastores mandaron el itinerario oficial final** (imagen "ITINERARIO OFICIAL" + 4 PDFs de show-flow) y una lista larga de cambios por WhatsApp. Esta sesión fue básicamente ejecutar esa lista completa, de punta a punta, con verificación real en cada paso. Lo que sigue es el estado después de todo eso — **no leas el historial de commits pensando que cada uno es independiente, son parte de la misma corrida**.

## 1 · 🔴 Rutas y reglas duras

- **Repo:** `~/Dev/CMA/elcielo-web` — git propio, remoto `github.com/soyedzam/elcielo-web`, **público** (sin datos privados, es un sitio de marketing).
- **Stack: HTML + CSS + JS vanilla. Cero build, cero framework, cero backend, cero base de datos.** Cada página comparte `assets/styles.css`, `assets/config.js`, `assets/main.js`. Nuevos este sprint: `assets/agenda.js` (la agenda interactiva) y `registros.html` (redirect al tablero).
- **Hosting: GitHub Pages**, rama `main`, deploy automático en cada push (sin CI, sin staging). Después de cada push, **espera el deploy con un `curl` en loop antes de dar por hecho** — Fastly cachea ~600s y a veces el navegador de QA muestra una versión vieja aunque el server ya tenga la nueva (usa cache-bust en la URL del recurso, no confíes en el primer screenshot).
- **Dominio:** `elcielo.comunidadmasalto.org` — DNS en Hostinger, CNAME ya propagado, HTTPS de GitHub funcionando.
- **Motor dinámico anterior (Next.js + Cloudflare) — ABANDONADO**, vive archivado en `~/Dev/XST/xs-event-engine`. Este repo estático es la única fuente de verdad.

## 2 · Voz y marca — sistema Amanecer v1.0

Fuente canon: `~/Library/CloudStorage/GoogleDrive-soyedzam@gmail.com/Mi unidad/ACTIVOS/06_COMUNIDADES/CMA_Mas-Alto/Grafica/Cielo-Design-System_260801_v1.0/BRAND-AI.md`.

Colores: índigo noche `#0B1033` · índigo medio `#1A2158` · ámbar `#F2A93B` · ámbar claro `#FFD59E` · ámbar oscuro `#8A5A12` · hueso `#F7F4EE`. Tipografía: **Archivo** (display) · **Instrument Sans** (cuerpo) · **IBM Plex Mono** (kickers, prefijo `//`).

**Reglas ya selladas — no las reabras sin que Ed lo pida:**
- "Congreso" a secas, nunca "de liderazgo". "Entrada libre" en vez de "300 lugares" (300 sigue como `cupo` real en `config.js`, solo no se anuncia).
- **"Culto" → "Reunión" en TODO el sitio (10-ago).** El domingo se llama "Cierre — Reunión", sin "Única". Si ves "Culto" reaparecer, es regresión.
- **El domingo SÍ lleva registro (10:30–10:55)** — esto es lo contrario de lo que decía la v1.3 de este doc. La regla vieja ("domingo sin registro, culto abierto") quedó **revertida** por el itinerario oficial de los pastores. No la repongas.
- **El Taller de sábado por la mañana se cayó de la agenda PÚBLICA** (no está en `agenda.html` ni `index.html`) pero **sigue vivo en `guion.html`** porque tiene su propio show-flow real de los pastores. Es una decisión deliberada, no un olvido — ver §5.
- **Ps Ofir Peña predica las 3 sesiones.** Ps Tere Guillén sigue como ponente (bio en la sección "Ponentes") pero el itinerario oficial no le asigna un bloque propio — no inventes uno.
- CTAs son links editoriales (`.lx-btn`) salvo 2 excepciones deliberadas: el botón de WhatsApp en Registro (`.lx-btn-wa`, verde) y los pills de "Cómo llegar" (`.lx-mapa-btn`, Google/Apple Maps/Waze). No los "corrijas" a link plano.
- **El logo real de Comunidad Más Alto quedó resuelto (10-ago):** el ícono que se había scrapeado de `comunidadmasalto.org` (línea abstracta ámbar) **NO es su marca real** — es un adorno decorativo de su sitio. El logo real (naranja+gris, "MASALTO / Comunidad Cristiana") vive en `~/Dev/CMA/lanave-web/assets/logo-masalto.png`, cópialo de ahí. **Va SOLO en el footer**, una vez, ~42px, sobre placa hueso (`.lx-cma-chip`) — se probó ponerlo en 5 encabezados y Ed pidió replegarlo a uno solo, grande, "que luzca bien ahí" en vez de estar repetido. El naranja de CMA choca con el ámbar del congreso si va directo sobre índigo.

## 3 · Estado real de cada pieza (verificado, no de memoria)

| Pieza | Estado |
|---|---|
| `index.html` | Landing: hero (sin logo grande, se quitó), Ejes, Ponentes (Ofir + Tere, 2 fotos reales separadas), Programa (teaser 3 días, link a agenda.html), Convoca ("A toda la congregación en general", 3 incisos), Comunidad (3 fotos nuevas: kids/jóvenes/encuentro), Pastores (Joel/Ana), Registro (formulario + confeti + mapas), footer con logo real |
| `agenda.html` | **Ya no es una lista — es una mini-app** (ver §4-bis): reloj de Mérida en vivo, tabs por día, insignia EN VIVO, clima real por día, sección "Cómo llegar", SIN sección de venta al final |
| `guion.html` | Interno, `noindex`, minuto a minuto de los **4 bloques** (viernes, sábado-mañana Taller, sábado-noche, domingo) con horas reales del show-flow de los pastores. Enlazado de forma **discreta** ("Equipo", 10px, opacidad .35) en el footer de las 5 páginas públicas — ya no está huérfano de enlaces, pero tampoco en el nav |
| `momentos.html` | Galería con las 3 fotos nuevas (kids, jóvenes con letrero, encuentro al aire libre) |
| `info.html` | Sede solo "Comunidad Más Alto" (sin "Carpa") + 3 botones de Cómo Llegar |
| `registros.html` | **Nuevo.** Redirect de nuestro dominio al tablero real de Apps Script — da una URL presentable (`elcielo.comunidadmasalto.org/registros.html`) sin necesitar backend propio |
| `avance.html` / `escanea.html` / `invitacion.html` | Sin cambios este sprint |

**Datos confirmados en `assets/config.js`:**
- `whatsapp: "5219994338287"` — **cambió este sprint**, ya no es el número viejo
- `coords: { lat: 21.027521, lng: -89.5768332 }` + `mapaUrl` con el link completo de Google Maps (con place ID) — para los 3 botones de Cómo Llegar (Google/Apple/Waze)
- `urlRegistro` sigue siendo el mismo Apps Script — folio ahora debería arrancar en 111, PERO ver §4 sobre el paso pendiente

## 4 · Sistema de registro — actualizado a fondo

**En el sitio (ya en vivo):**
- `assets/registro.js`: al enviar el formulario aparece un panel "Generando tu folio…" (~2.9s, 3 pasos con barra de progreso — efecto *labor illusion*, la petición real corre en paralelo). Al confirmar: **confeti** (canvas nativo, física por tiempo real no por cuadros, con un `setTimeout` de respaldo que lo quita a los 4.7s aunque el navegador congele `requestAnimationFrame` en background), **nombre en MAYÚSCULAS grande**, tarjeta de rifa rediseñada (no una línea con emoji), y una mini-sección "¿Cómo llegas?" con los 3 botones de mapas.
- `assets/agenda.js`: reloj de Mérida en vivo (`Intl.DateTimeFormat` con `timeZone: 'America/Merida'`), tabs Viernes/Sábado/Domingo (auto-selecciona el día si hoy es uno de los 3), insignia **EN VIVO** roja pulsante calculada contra `data-inicio`/`data-fin` en cada `<li>` del itinerario, clima real por día vía **Open-Meteo** (sin llave, sin backend — si el día cae fuera del rango de pronóstico la insignia se oculta sola, nunca un dato inventado).

**En Apps Script — 🔴 CAMBIOS PENDIENTES, NO ESTÁN EN VIVO:**

El código en `_fuente/apps-script/Codigo.gs` y `tablero.html` **vive en el repo pero se ejecuta desde el editor de Apps Script del proyecto "El Cielo 2026 — Registro y Tablero"** (cuenta de Ed, Sheet `15h4WdWGYSfwZe_bZV9qw_T1tbFBA6dEO8qisDu7SWk4`). Este repo **no se sincroniza solo con Google** — hay que copiar y volver a implementar a mano. Al cierre de esta sesión, **Ed decidió dejarlo pendiente para la próxima** ("dejemos el Google Sheet pendiente, cerramos sprint por hoy"). Lo que queda por hacer en un solo viaje al editor:

1. Reemplazar `Codigo.gs` completo. Trae: `FOLIO_INICIAL = 111` (el folio real sigue arrancando en 0001 hasta que esto se pegue), fix de `doGet()` (traía `.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DENY)` — ese enum no existe, revienta la función; ya se quitó), formato de fecha sin mes (`'d · HH:mm'` en vez de `'d MMM · HH:mm'` — todo el congreso es en agosto, sobraba), y **bitácora nueva con `Logger.log`** en cada paso de `doPost` (qué llegó, por qué se rechazó algo, y sobre todo si `appendRow` truena con el mensaje real — antes ese error se perdía en un `'servidor'` genérico sin rastro).
2. Reemplazar el archivo HTML `tablero`. Trae: logo real de CMA embebido en base64 (Apps Script no puede referenciar assets externos del sitio, todo tiene que ir inline), botones de WhatsApp/llamar/correo por cada persona registrada, aviso "✓ Llegó [nombre]" + animación al marcar asistencia (antes era un check mudo).
3. Correr `formatearHoja_()` una vez desde el editor (nueva función, da formato de marca a la Sheet: encabezado índigo, columnas a su ancho, resalta en ámbar quien entra a la rifa — no toca datos).
4. **Implementar → Administrar implementaciones → lápiz → Nueva versión.**

**🔴 Reporte sin resolver:** Ed dijo que una prueba de registro ("001") no se guardó en la Sheet. Revisé `doPost` completo y no encontré un bug reproducible — si `appendRow` fallara, el cliente vería un error, no una confirmación con folio. Puede ser una vista cacheada de la Sheet, o el registro sí se guardó y no se refrescó la vista. **La bitácora nueva del punto 1 es justo para esto** — la próxima vez que pase, el log de Ejecuciones va a decir la causa real en vez de nada. No se cerró este punto, solo se instrumentó para la próxima.

**Reglas que siguen igual:**
- Contraseña del tablero (`Masalto26.`) SOLO en `PropertiesService`, nunca en el repo.
- Folio se calcula contando filas de la Sheet, no con contador aparte.
- Rifa: `origen: 'plataforma'` → entra; `origen: 'presencial'` → no entra (ese flujo de check-in en puerta todavía no existe).
- Cross-origin sandboxing del tablero: automatización de navegador no puede escribir en sus campos, pero un clic real de persona sí funciona.
- Verificar registros reales en el log de "Ejecuciones" de Apps Script, no solo abriendo la Sheet.

## 5 · ⚠️ Abierto — no inventes, pregúntale a Ed

1. **Título y eje (Identidad/Propósito/Destino) de sábado-noche y domingo.** Sigue sin resolver desde antes de esta sesión. Solo Identidad→viernes y Propósito→sábado-taller están confirmados.
2. **¿El Taller de sábado mañana sigue en pie de verdad?** Tiene su propio show-flow real (por eso vive en `guion.html`), pero no aparece en el itinerario público que los pastores mandaron. Se asumió que es una sesión aparte para público distinto, no que se canceló — confírmalo si hay oportunidad.
3. **Foto de la Ps Tere Guillén.** Ya se montó una foto real (suya, verdadera) junto a la de Ofir, pero **no combinan en estilo** (la de él es sesión profesional, la de ella es un retrato antiguo escaneado). Ed pidió explícitamente que **NO se use IA** para "mejorarle las facciones" en el compuesto — eso sería fabricar una imagen sintética de una persona real, se rehusó dos veces y quedó firme. **Decidido 11-ago-2026: se resuelve por post-producción real (edición/color/recorte de las fotos existentes), no esperando una foto nueva ni generando nada con IA.** Sigue vigente la petición a Mariani por si mandan una mejor (ver punto 6), pero ya no es bloqueante.
4. **Rifa para incentivar el registro.** Se le sugirió a los pastores por WhatsApp (10-ago) dejarla completamente abierta a lo que ellos decidan — premio y mecánica. Sin respuesta todavía.
5. **Google Sheet — el reporte de "001" sin guardar** (ver §4). Instrumentado pero no diagnosticado. Además, el paso manual completo de Apps Script (folio 111, tablero nuevo, formato de Sheet) sigue pendiente — Ed lo dejó para la siguiente sesión a propósito.
6. **Fotos pendientes de Mariani.** Se pidió por WhatsApp que sigan revisando si quieren algún otro cambio, y específicamente una foto mejor de Ofir + Tere juntos. Sin respuesta todavía al cierre de esta sesión.

## 6 · Lecciones ya pagadas en esta sesión — no las repitas

- **No todo lo que se scrapea del sitio oficial de un cliente es su marca real.** El ícono ámbar que se bajó de `comunidadmasalto.org` parecía un logo pero era un adorno de su animación hero — el logo real vivía en otro repo hermano (`lanave-web`) todo este tiempo. Si un cliente dice "no es el logo", no insistas con el mismo archivo — busca en otros repos del mismo cliente antes de volver a scrapear.
- **El repo de Apps Script y lo realmente desplegado ya habían divergido antes de esta sesión** — el bug de `XFrameOptionsMode.DENY` seguía en el `.gs` del repo pese a que la memoria decía "ya corregido". El repo es la fuente de *intención*, no de verdad — si algo parece raro, compáralo contra lo que Ed puede ver en el editor real, no asumas que coincide.
- **`requestAnimationFrame` se puede congelar casi por completo en un tab que pierde foco** (confirmado en el pane de preview de esta herramienta, probablemente también en navegadores reales bajo ciertas condiciones). Cualquier animación con duración fija debe calcularse por **tiempo real** (`performance.now()`/`Date.now()`), nunca por conteo de cuadros — y conviene un `setTimeout` de respaldo que garantice la limpieza aunque el `rAF` nunca vuelva a correr.
- **Una clase CSS que define `display` sin cuidar `[hidden]` rompe el atributo `hidden`** — pasó con `.lx-en-vivo` (se veía "EN VIVO" en todo aunque `hidden` estuviera puesto). Si una clase toca `display`, agrega también `.clase[hidden]{display:none}`.
- **Apps Script's `HtmlService` no puede cargar assets externos del sitio** (no hay red compartida entre GitHub Pages y `script.google.com`) — cualquier imagen en `tablero.html` tiene que ir embebida en base64 dentro del mismo archivo.
- **Antes de generar/editar con IA la imagen de una persona real e identificable, aunque el cliente lo pida y insista, la respuesta es no** — se sostuvo dos veces esta sesión. La alternativa siempre es una foto real, aunque combine peor visualmente.

## 7 · Cómo se responde a Ed

Directo, conciso, mínimo texto. Verifica en vivo con evidencia real antes de decir "listo" — nunca confíes en el reporte de otro agente ni en tu propia suposición sin comprobarlo (capturas, curl, registro de ejecución, lo que aplique). Cierre de respuesta larga: ✅ qué se hizo · ➡️ siguiente paso · ⚠️ pendientes. Cuando Ed pide algo ambiguo o de mucho alcance ("mejórala en todo sentido"), está bien pedirle que aterrice en modo planeación primero — lo ha hecho varias veces esta sesión y funciona bien.

## 8 · El guion de cabina NO es la agenda pública

Dos documentos, dos públicos, no se mezclan.

| | `agenda.html` — pública | `guion.html` — interna |
|---|---|---|
| Para quién | El líder convocado | Equipo de producción y voluntariado |
| Qué responde | ¿A qué hora entro y a qué hora salgo? | ¿Qué va ahora y cuánto dura? |
| Qué muestra | Registro · Bienvenida · Alabanza · Conferencia · Cierre, con horas | Cada entrada al minuto, con notas de cabina |
| Enlace | Nav de arriba | Solo el link discreto "Equipo" en el footer — no en el nav |
| Indexación | Normal | `noindex, nofollow` |

**Por qué importa:** el minutaje de cabina (Ofrenda, Video de presentación, etc.) le dice al asistente el minuto exacto en que se le va a pedir dinero — eso cambia cómo se vive el momento. La agenda pública sí puede listar cada actividad con su hora (eso se amplió este sprint, antes era una sola línea condensada) — lo que nunca sube es el minutaje interno de producción.

---
*El Cielo en mi Ciudad · Pase de Sesión · v2.0 · 10-ago-2026 · La fragua produce; el taller archiva.* 🕊️
