# Pase de Sesión — El Cielo en mi Ciudad
> Handoff para la instancia nueva de Claude que retome este sitio.
> **Léelo completo antes de tocar nada.** Escrito 2-ago-2026 · actualizado 10-ago-2026.

---

## 0 · Quién eres aquí

Sitio estático en producción de **"El Cielo en mi Ciudad"** — congreso de **Comunidad Más Alto** (CMA), Mérida, Yucatán, 14–16 de agosto de 2026. **"De liderazgo" se quitó del nombre a propósito el 10-ago-2026** — ver §2. Está **EN VIVO** en `https://elcielo.comunidadmasalto.org`. No es un borrador: cualquier cambio que hagas puede verlo el público en minutos, y desde el 10-ago también **escribe datos reales de personas** (el formulario de registro). Verifica siempre en vivo, con navegador real, antes de decir "listo".

## 1 · 🔴 Rutas y reglas duras

- **Repo:** `~/Dev/CMA/elcielo-web` — git propio, remoto `github.com/soyedzam/elcielo-web`, **público** (sin datos privados, es un sitio de marketing). NO está en `~/Documents` ni carpeta sincronizada.
- **Stack: HTML + CSS + JS vanilla. Cero build, cero framework, cero backend, cero base de datos.** Cada página es un archivo `.html` independiente que comparte `assets/styles.css`, `assets/config.js` y `assets/main.js`. Si algo pide "compilar" o "instalar dependencias", vas por el camino equivocado — no lo hay.
- **Hosting: GitHub Pages**, rama `main`, deploy automático en cada push (no hay CI que revise nada — lo que subes a `main` se publica solo, en segundos). Repo Git-connected: **`main` ES producción**, no hay staging.
- **Dominio:** `elcielo.comunidadmasalto.org` — DNS en **Hostinger** (no Squarespace — ese fue el primer error de esta sesión, verifícalo tú con `whois` si algo no cuadra: el registrador real es Hostinger operations, UAB). Registro CNAME `elcielo` → `soyedzam.github.io`, ya puesto y propagado. Certificado HTTPS real (Let's Encrypt) emitido por GitHub — si alguna vez ves el certificado genérico `*.github.io` en vez de uno propio, el truco que funcionó fue: quitar el custom domain en Settings → Pages (PUT con `cname=null` vía `gh api`) y volver a ponerlo — reinicia la emisión.
- **Motor dinámico anterior (Next.js + Cloudflare Workers) — ABANDONADO, no lo retomes sin que Ed lo pida explícitamente.** Vive en `~/Dev/XST/xs-event-engine` (tenant `elcielo.config.json`), archivado tal cual. Ed decidió pasarse a estático a media sesión porque no quería captura de leads real ni la complejidad de Cloudflare — **este repo estático es la fuente de verdad actual**, no el motor.

## 2 · Voz y marca — sistema Amanecer v1.0

- Fuente canon: `~/Library/CloudStorage/GoogleDrive-soyedzam@gmail.com/Mi unidad/ACTIVOS/06_COMUNIDADES/CMA_Mas-Alto/Grafica/Cielo-Design-System_260801_v1.0/BRAND-AI.md` — léelo antes de escribir copy o tocar CSS.
- Colores: índigo noche `#0B1033` (base) · índigo medio `#1A2158` · ámbar `#F2A93B` (acento/conversión) · ámbar claro `#FFD59E` · ámbar oscuro `#8A5A12` (texto ámbar sobre claro, AA) · hueso `#F7F4EE`.
- Tipografía: **Archivo** 800/900 (display) · **Instrument Sans** (cuerpo) · **IBM Plex Mono** mayúsculas tracking amplio (kickers/señal, prefijo `//`).
- Vocabulario obligatorio: congreso (no evento) · líderes convocados (no asistentes) · aparta tu lugar (no comprar boleto/regístrate) · voces/ponentes (no conferencistas) · mesa de ciudad (no networking). Cero emoji, cero exclamaciones dobles, nada de urgencia falsa ("¡últimos lugares!").
- **"Congreso de liderazgo" → "congreso" a secas, en TODO el sitio (10-ago-2026, pedido explícito de Ed: "quitar todo rastro").** Se tocaron 17+ sitios: `<title>`, meta description, og:, schema.org, kickers, footer, texto de compartir de WhatsApp. También se renombró la sesión "Taller para Liderazgo" → **"Taller de Formación"** (agenda.html, index.html, guion.html) y se reescribió la sección "A quién convoca" sin la palabra "liderazgo" como etiqueta (aunque describir a alguien como "quien tiene gente a su cargo" sigue siendo válido — no es la misma etiqueta del evento). Lo que SÍ se dejó: "líderes atendidos" en la bio de Ofir Peña (dato biográfico real, no branding del evento) y el verbo "lidera" en prosa común. Si ves "de liderazgo" reaparecer en cualquier archivo, es una regresión — quítalo.
- **"300 lugares" → "Entrada libre" (10-ago-2026).** El congreso pasó de aforo-gatekept a acceso abierto con incentivo de registro: quien se registra antes entra a una **rifa**, quien llega el día del evento sin registro también entra pero sin rifa. El número 300 sigue existiendo como `cupo` en `assets/config.js` (es el tope real del Apps Script, ver §4) pero **ya no se anuncia como "300 lugares" en el copy público** — el hero dice "Entrada: Libre", no un número. No le devuelvas el "Son 300 lugares" a agenda.html/info.html pensando que es información útil: ya no es la promesa que se hace.
- **Regla de diseño ya peleada y ganada esta sesión: nada de botones-píldora genéricos.** Los CTA son links editoriales (texto + flecha, subrayado animado, sin caja) — clase `.lx-btn`. **Única excepción deliberada:** el botón de WhatsApp en Registro (`.lx-btn-wa`, verde, con pulso) — Ed pidió explícitamente que ESE sí se vea como botón, porque es la conversión real. No lo "corrijas" a link plano pensando que es inconsistencia.
- **"Quién convoca" ≠ "quiénes son los ponentes".** Quien convoca el congreso es Comunidad Más Alto (sección "Pastores" — Pastor Joel y Pastora Ana). Los ponentes invitados son Ofir Peña y Tere Guillén (sección "Ponentes"). No mezcles los dos conceptos en copy nuevo — Ed corrigió esto una vez ya.
- **"Registro" se evitó en el copy — EXCEPTO en el programa/agenda**, donde "Registro 19:30 · Inicio 20:00" significa hora de puertas y Ed pidió explícitamente dejarlo así. No lo cambies a "Puertas" — ya se intentó y se revirtió.
- **El domingo NO lleva registro y eso es deliberado** (confirmado por Ed, 8-ago-2026). Los otros tres bloques son sesiones del congreso; el domingo es Culto Único, abierto a toda la congregación y **sin control de acceso**. Por eso su línea dice solo `11:00 — 13:00 aprox.` Si le devuelves un "Registro 10:30" por simetría visual con los otros tres, le estás diciendo a la gente de la iglesia que necesita apartar lugar para entrar a su propio culto.
- **El naranja de Comunidad Más Alto choca con el ámbar del congreso.** Medido del archivo original: CMA es `#F29100` y el sistema es `#F2A93B` — **mismo matiz exacto (36°)**, solo cambia saturación (100 vs 88) y luminosidad (47 vs 59). Puestos en la misma superficie no leen como dos marcas, leen como error de impresión. Si montas el logotipo de CMA sobre índigo, va en **monocromo hueso** o sobre **placa hueso** — nunca a color suelto. Sigue sin decisión de Ed — ver §5, punto 4.

## 3 · Estado real de cada pieza (verificado, no de memoria)

| Pieza | Estado |
|---|---|
| `index.html` | Landing completa: hero con foto+video cinematográfico, Ejes, Ponentes (Ofir/Tere), Programa, Pastores (Joel/Ana), A quién convoca, Comunidad (fotos reales), Registro (formulario + countdown en vivo), footer con créditos |
| `agenda.html` | Programa por día. Viernes y sábado-mañana ya llevan **hora de cierre** (22:05 / 11:13) y una línea de qué pasa dentro; sábado-tarde y domingo tienen cierre **estimado** ("aprox.") porque no hay guion todavía |
| `guion.html` | **Guion de cabina — uso interno.** `noindex`, sin enlace desde el sitio, se llega por URL directa. Minuto a minuto de la corrida en modo noche, para leerse del celular con el evento corriendo. Ver §8 |
| `momentos.html` | Fotos + videos (enlazan a YouTube, sin embed) |
| `info.html` | Acordeones: sede (con link a Google Maps real), qué es, fechas, cómo apartar lugar |
| `avance.html` | Kiosko: countdown en vivo (días:horas:min:seg) + QR — para pantallas de CMA |
| `escanea.html` | Kiosko: QR de reposo — para pantallas de CMA |
| `invitacion.html` | Loop de 14s, 1920×1080, para que OTRAS iglesias lo proyecten — video de fondo en `xs-elcielo-media.pages.dev` (Cloudflare Pages, self-hosted, fuera de git por peso) |

**Datos reales ya confirmados** (en `assets/config.js`, edítalo ahí, nunca hardcodees en HTML):
- WhatsApp: `5219991755967` — **solo informes, ya no es el canal de registro** (ver §4)
- Cupo real (backend): 300 — ya no se anuncia como número en el copy público
- Fechas: 14–16 agosto 2026, apertura viernes 20:00 hora Mérida
- Google Maps: `https://share.google/InwyKySL9Dv5YHTaA`
- Video hero/invitación: `https://xs-elcielo-media.pages.dev/cielo-fondo-ia.mp4`
- `urlRegistro`: URL de la app web de Apps Script — **si aparece vacía, el sitio oculta el formulario solo** y deja el WhatsApp de informes como plan B. Nunca lo dejes vacío sin querer.

## 4 · Sistema de registro (nuevo, 10-ago-2026) — formulario → Sheet → tablero

El sitio sigue siendo 100% estático, pero desde hoy **sí escribe datos reales**. La arquitectura:

```
Formulario en index.html#registro
   → fetch POST a Apps Script (assets/registro.js)
      → Google Sheet "El Cielo 2026 — Registros" (fuente de verdad)
      → folio CIELO-000N + marca de rifa (Sí/No según origen)
   → tablero.html (dentro del mismo Apps Script): password-gated,
     lo abre el equipo el día del evento para ver/buscar/marcar asistencia
```

**Dónde vive cada pieza:**
- `assets/registro.js` — el fetch del formulario público. Usa `Content-Type: text/plain` a propósito (con `application/json` el navegador manda un preflight que Apps Script no contesta y el registro se pierde en silencio).
- `_fuente/apps-script/Codigo.gs` y `tablero.html` — **código fuente que vive en este repo pero NO se ejecuta desde aquí.** Es lo que está pegado en el editor de Apps Script del proyecto **"El Cielo 2026 — Registro y Tablero"**, en la cuenta de Ed, amarrado a la Sheet `15h4WdWGYSfwZe_bZV9qw_T1tbFBA6dEO8qisDu7SWk4`. Si editas la lógica aquí, **tienes que copiarla también al editor de Apps Script y volver a implementar** (Implementar → Administrar implementaciones → lápiz → Nueva versión) — este repo no se sincroniza solo con Google.
- `_fuente/apps-script/LEEME.md` — el runbook paso a paso para el setup manual (crear Sheet, pegar código, autorizar, publicar). Ya se ejecutó una vez; solo hace falta releerlo si hay que reinstalar desde cero.

**Reglas duras:**
- **La contraseña del tablero (`Masalto26.`) vive SOLO en `PropertiesService` de Apps Script — NUNCA en este repo público.** Se puso corriendo `ponerContrasena()` una vez desde el editor y luego se borró del código fuente. Si necesitas cambiarla: edita `ponerContrasena()` en el editor de Apps Script (no aquí), corre la función, y vuelve a borrar la clave del código.
- **El folio se calcula contando filas de la Sheet, no con un contador aparte.** Si borras una fila de prueba, el próximo folio real vuelve a ser `CIELO-0001` — es el comportamiento correcto, no un bug.
- **Rifa:** `origen: 'plataforma'` (formulario web, antes del evento) → entra a la rifa. `origen: 'presencial'` (el día del evento) → no entra. El formulario público siempre manda `plataforma`; el flag `presencial` es para un flujo futuro de check-in en puerta que **todavía no existe** — si Ed pide registro el día del evento, hay que construir esa segunda pantalla.
- **Cross-origin sandboxing:** el tablero corre dentro de un iframe de `script.googleusercontent.com` con sandboxing muy estricto de Google. La automatización de navegador (clicks/tecleo sintético) **no logra escribir en sus campos** — se intentó 3 formas distintas y todas fallaron en silencio (el campo se queda vacío, sin error). No es un bug del producto: un clic real de una persona sí funciona (Ed lo confirmó). Si necesitas probar el login del tablero, pídele a Ed que lo haga él, o prueba el flujo de datos por otro lado (p.ej. mandar un registro real por el formulario público y verificar la fila en la Sheet directamente).
- **Bug propio ya corregido:** `HtmlService.XFrameOptionsMode.DENY` no existe en Apps Script (el enum solo tiene `ALLOWALL` y `DEFAULT`) — tronaba `doGet()` con "El argumento no puede ser nulo: mode". Si ves ese error de nuevo, es que alguien volvió a escribir `DENY`.
- **Cómo revisar si de verdad está llegando gente:** no confíes solo en abrir la Sheet (puede verse vacía por vista cacheada). La fuente dura es el **registro de ejecución de Apps Script** — abre el proyecto → ícono de reloj "Ejecuciones" en la barra lateral → ahí se ve cada `doPost` real con fecha y hora, y si falló, el error exacto. El 10-ago a las 2:49pm, con el sistema recién conectado, las 12 ejecuciones de los últimos 7 días eran TODAS de pruebas propias (mías y de Ed) — cero registros externos todavía. Vuelve a revisar ahí, no solo en la hoja, si Ed pregunta "¿ya se está llenando?".
- Verificado de punta a punta dos veces (local y en producción real): formulario → POST → fila en Sheet → folio → confirmación en pantalla. Las filas de prueba se borraron después.

## 5 · ⚠️ Abierto — no inventes, pregúntale a Ed

1. **Título del bloque sábado-noche.** El Programa oficial no le puso nombre (a diferencia de "Apertura", "Taller de Formación", "Cierre — Culto Único"). Hoy dice "Sesión general" — es un placeholder aceptado, no un dato inventado.
2. **Eje (Identidad/Propósito/Destino) de sábado-noche y domingo.** Solo Identidad→viernes y Propósito→sábado-taller están confirmados. No le fuerces un eje a los otros dos bloques.
3. **Los cierres de sábado-noche (20:30) y domingo (13:00) son ESTIMADOS, no dato.** No los dio nadie: se derivaron del molde del viernes (sesión general = 125 min) y de un culto de cierre de ~1h45, y van publicados con la palabra "aprox." precisamente por eso. Ed los aprobó como estimados el 8-ago. **En cuanto los pastores den la hora real, quitar el "aprox." y poner la firme.** El criterio usado: en agenda pública se anuncia el cierre más tardío realista, no el más probable — quien organiza su día alrededor de esa hora perdona que sobre, no que falte.
4. **Logotipo de Comunidad Más Alto — decisión pendiente de Ed, TODAVÍA no la dio.** Solo existe **un** archivo, PNG 375×236 (`~/Dev/CMA/lanave-web/assets/logo-masalto.png`, el mismo que usa La Nave). No hay SVG ni versión monocromo, y recolorearlo es decisión de CMA, no nuestra. Se le presentaron 3 opciones (monocromo hueso / placa hueso / solo pie de página) en un artifact — Ed no eligió, la conversación se fue hacia otro lado. Dónde va: pie de página, sección "Quiénes convocan", sede en Info. Dónde no: barra superior ni portada.
5. **Confirmar el link que Ed está compartiendo con la gente.** El 10-ago Ed dijo "se está llenando" pero el registro de ejecución de Apps Script (§4) mostraba cero registros externos. Puede ser timing (recién mandó el link), puede ser que esté compartiendo una URL vieja o el canal de WhatsApp confundiéndose con registro real. Verifica el registro de ejecución antes de asumir que el sistema tiene un problema — y antes de asumir que no lo tiene.

## 6 · Lecciones ya pagadas en esta sesión — no las repitas

- **El registrador del dominio es Hostinger, no Squarespace.** Costó tiempo real deducirlo mal por el nombre de los nameservers (`dns-parking.com`, que parece Squarespace pero no lo es). Verifica con `whois`, no con el nombre del nameserver.
- **El pane de preview integrado renderiza negro en contenido con reveal-on-scroll** (el mismo bug documentado en la memoria del proyecto para otros sitios del portafolio). Usa Chrome real (`claude-in-chrome` o similar) para QA visual, nunca confíes en un fondo negro como "está roto".
- **`object-fit:cover` sin `object-position` corta caras en fotos documentales** cuando el aspect-ratio cambia en móvil. Si agregas fotos nuevas, revisa el recorte en 375px antes de dar por bueno — no asumas que el centro es un buen punto de anclaje.
- **GitHub Pages con dominio custom siempre 301-redirige** la URL `*.github.io` hacia el dominio propio si existe `CNAME` — no sirve como preview alterno mientras el CNAME esté puesto. Usa `raw.githack.com/soyedzam/elcielo-web/main/archivo.html` para previsualizar sin DNS.
- **Cambiar el custom domain vía API de GitHub Pages genera commits automáticos** ("Delete CNAME" / "Create CNAME") directo al repo — si haces `git push` y te rechaza por "fetch first", es eso, no un conflicto real: `git pull --rebase` y ya.
- **Chrome headless con `--window-size=390,…` NO emula un teléfono.** No aplica el `<meta viewport>` como lo haría iOS, así que el layout sale a un ancho distinto del que capturas y el texto aparece cortado por la derecha: parece desbordamiento y no lo es. Para juzgar móvil, navegador real a 375px y **mide**: `document.documentElement.scrollWidth <= clientWidth`. Headless sirve para capturas a ancho de escritorio, no para veredictos de móvil.
- **🔴 El programa vive DUPLICADO: `index.html` y `agenda.html` tienen los mismos cuatro bloques en HTML separado.** No hay parcial ni plantilla — es un sitio de cero build. Si tocas una hora en uno y no en el otro, el sitio se contradice a sí mismo y nadie te avisa. **Al tocar el programa, `grep -oE 'Registro [^<]*' index.html agenda.html` y compara antes de dar por cerrado.**
- **La cifra fantasma sí abría scroll lateral de verdad** (`.lx-ghost` va a `right:-14px` a propósito). Ya está recortada con `overflow-x: clip` en `.lx-programa-wrap` — `clip` y no `hidden`, porque `hidden` crearía un contenedor de scroll. Si agregas otro `.lx-ghost` en una sección nueva, recórtalo igual o vuelve el desplazamiento lateral en el teléfono.
- **Al "teclear" código largo en un editor con autocompletado de llaves/comillas (Monaco, CodeMirror), el texto se corrompe** — saltos de línea duplicados, indentación rota. Pasó al pegar `Codigo.gs` en Apps Script. La solución que funcionó: escribir el texto en un `<textarea>` plano temporal (sin autoclose), copiar de ahí con `Cmd+C` real, y recién entonces pegar con `Cmd+V` en el editor de código. Verificar SIEMPRE el conteo de líneas antes y después.
- **La API de portapapeles (`navigator.clipboard.writeText`, `execCommand('copy')`) falla con "Document is not focused" cuando se llama desde un script inyectado por automatización**, aunque la página se vea enfocada. Un clic sintético real (vía herramienta de automatización, no `element.focus()` por JS) sí cuenta como interacción de usuario y sí desbloquea copiar/pegar — por eso el truco del textarea + Cmd+C funciona y el JS puro no.

## 7 · Cómo se responde a Ed

Directo, conciso, mínimo texto. Verifica en vivo con evidencia real antes de decir "listo" — nunca confíes en el reporte de otro agente ni en tu propia suposición sin comprobarlo (capturas, curl, registro de ejecución, lo que aplique). Cierre de respuesta larga: ✅ qué se hizo · ➡️ siguiente paso · ⚠️ pendientes.

## 8 · El guion de cabina NO es la agenda pública

Regla nacida el 8-ago-2026, cuando Ed pasó la hoja del programa con el minuto a minuto.

**Son dos documentos con dos públicos, y no se mezclan.**

| | `agenda.html` — pública | `guion.html` — interna |
|---|---|---|
| Para quién | El líder convocado | El equipo de producción |
| Qué responde | ¿A qué hora entro y a qué hora salgo? | ¿Qué va ahora y cuánto dura? |
| Qué muestra | Puertas · inicio · **cierre** · qué pasa dentro | Cada entrada al minuto, con notas de cabina |
| Indexación | Normal | `noindex, nofollow`, sin enlaces entrantes |

**Por qué importa:** publicar "21:52 Ofrenda · 10 min" le dice al asistente el minuto exacto en que se le va a pedir dinero, y cuánto dura la predicación antes de que empiece. Eso es información de cabina — cambia cómo se vive el momento. **Nunca subas el minutaje a la agenda pública**, por más que el dato ya exista y sea verdadero.

Lo que sí sube de un guion nuevo: la **hora de cierre** (se calcula sumando los bloques) y una línea de qué pasa dentro, sin horas intermedias.

---
*El Cielo en mi Ciudad · Pase de Sesión · v1.3 · 10-ago-2026 · La fragua produce; el taller archiva.* 🕊️
