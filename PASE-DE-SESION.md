# Pase de Sesión — El Cielo en mi Ciudad
> Handoff para la instancia nueva de Claude que retome este sitio.
> **Léelo completo antes de tocar nada.** Escrito 2-ago-2026 · actualizado 8-ago-2026.

---

## 0 · Quién eres aquí

Sitio estático en producción de **"El Cielo en mi Ciudad"** — congreso de liderazgo de **Comunidad Más Alto** (CMA), Mérida, Yucatán, 14–16 de agosto de 2026. Está **EN VIVO** en `https://elcielo.comunidadmasalto.org`. No es un borrador: cualquier cambio que hagas puede verlo el público en minutos. Verifica siempre en vivo, con navegador real, antes de decir "listo".

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
- **Regla de diseño ya peleada y ganada esta sesión: nada de botones-píldora genéricos.** Los CTA son links editoriales (texto + flecha, subrayado animado, sin caja) — clase `.lx-btn`. **Única excepción deliberada:** el botón de WhatsApp en Registro (`.lx-btn-wa`, verde, con pulso) — Ed pidió explícitamente que ESE sí se vea como botón, porque es la conversión real. No lo "corrijas" a link plano pensando que es inconsistencia.
- **"Quién convoca" ≠ "quiénes son los ponentes".** Quien convoca el congreso es Comunidad Más Alto (sección "Pastores" — Pastor Joel y Pastora Ana). Los ponentes invitados son Ofir Peña y Tere Guillén (sección "Ponentes"). No mezcles los dos conceptos en copy nuevo — Ed corrigió esto una vez ya.
- **"Registro" se evitó en el copy — EXCEPTO en el programa/agenda**, donde "Registro 19:30 · Inicio 20:00" significa hora de puertas y Ed pidió explícitamente dejarlo así. No lo cambies a "Puertas" — ya se intentó y se revirtió.
- **El naranja de Comunidad Más Alto choca con el ámbar del congreso.** Medido del archivo original: CMA es `#F29100` y el sistema es `#F2A93B` — **mismo matiz exacto (36°)**, solo cambia saturación (100 vs 88) y luminosidad (47 vs 59). Puestos en la misma superficie no leen como dos marcas, leen como error de impresión. Si montas el logotipo de CMA sobre índigo, va en **monocromo hueso** o sobre **placa hueso** — nunca a color suelto. Ver §7.

## 3 · Estado real de cada pieza (verificado, no de memoria)

| Pieza | Estado |
|---|---|
| `index.html` | Landing completa: hero con video cinematográfico + gradiente Amanecer, Ejes, Ponentes (Ofir/Tere), Programa, Pastores (Joel/Ana), A quién convoca, Comunidad (fotos reales), Registro (countdown en vivo + WhatsApp), footer con créditos |
| `agenda.html` | Programa por día. Viernes y sábado-mañana ya llevan **hora de cierre** (22:05 / 11:13) y una línea de qué pasa dentro; sábado-tarde y domingo siguen solo con "Registro · Inicio" porque no hay guion todavía |
| `guion.html` | **Guion de cabina — uso interno.** `noindex`, sin enlace desde el sitio, se llega por URL directa. Minuto a minuto de la corrida en modo noche, para leerse del celular con el evento corriendo. Ver §7 |
| `momentos.html` | Fotos + videos (enlazan a YouTube, sin embed) |
| `info.html` | Acordeones: sede (con link a Google Maps real), qué es, fechas, cómo apartar lugar |
| `avance.html` | Kiosko: countdown en vivo (días:horas:min:seg) + QR — para pantallas de CMA |
| `escanea.html` | Kiosko: QR de reposo — para pantallas de CMA |
| `invitacion.html` | Loop de 14s, 1920×1080, para que OTRAS iglesias lo proyecten — video de fondo en `xs-elcielo-media.pages.dev` (Cloudflare Pages, self-hosted, fuera de git por peso) |

**Datos reales ya confirmados** (en `assets/config.js`, edítalo ahí, nunca hardcodees en HTML):
- WhatsApp: `5219991755967`
- Cupo: 300 lugares
- Fechas: 14–16 agosto 2026, apertura viernes 20:00 hora Mérida
- Google Maps: `https://share.google/InwyKySL9Dv5YHTaA`
- Video hero/invitación: `https://xs-elcielo-media.pages.dev/cielo-fondo-ia.mp4`

## 4 · ⚠️ Abierto — no inventes, pregúntale a Ed

1. **Título del bloque sábado-noche.** El Programa oficial no le puso nombre (a diferencia de "Apertura", "Taller para Liderazgo", "Cierre — Culto Único"). Hoy dice "Sesión general" — es un placeholder aceptado, no un dato inventado.
2. **Eje (Identidad/Propósito/Destino) de sábado-noche y domingo.** Solo Identidad→viernes y Propósito→sábado-taller están confirmados. No le fuerces un eje a los otros dos bloques.
3. **Los cierres de sábado-noche (20:30) y domingo (13:00) son ESTIMADOS, no dato.** No los dio nadie: se derivaron del molde del viernes (sesión general = 125 min) y de un culto de cierre de ~1h45, y van publicados con la palabra "aprox." precisamente por eso. Ed los aprobó como estimados el 8-ago. **En cuanto los pastores den la hora real, quitar el "aprox." y poner la firme.** El criterio usado: en agenda pública se anuncia el cierre más tardío realista, no el más probable — quien organiza su día alrededor de esa hora perdona que sobre, no que falte.
4. **Logotipo de Comunidad Más Alto — decisión pendiente de Ed.** Solo existe **un** archivo, PNG 375×236 (`~/Dev/CMA/lanave-web/assets/logo-masalto.png`, el mismo que usa La Nave). No hay SVG ni versión monocromo, y recolorearlo es decisión de CMA, no nuestra. Dónde va: pie de página, sección "Quiénes convocan", sede en Info. Dónde no: barra superior ni portada.
5. **Fotos de comunidad** — las 3 de la sección "Comunidad" son de La Nave (misma comunidad madre), reusadas con velo índigo. Si aparecen fotos oficiales del Cielo, reemplázalas.

## 5 · Lecciones ya pagadas en esta sesión — no las repitas

- **El registrador del dominio es Hostinger, no Squarespace.** Costó tiempo real deducirlo mal por el nombre de los nameservers (`dns-parking.com`, que parece Squarespace pero no lo es). Verifica con `whois`, no con el nombre del nameserver.
- **El pane de preview integrado renderiza negro en contenido con reveal-on-scroll** (el mismo bug documentado en la memoria del proyecto para otros sitios del portafolio). Usa Chrome real (`claude-in-chrome` o similar) para QA visual, nunca confíes en un fondo negro como "está roto".
- **`object-fit:cover` sin `object-position` corta caras en fotos documentales** cuando el aspect-ratio cambia en móvil. Si agregas fotos nuevas, revisa el recorte en 375px antes de dar por bueno — no asumas que el centro es un buen punto de anclaje.
- **GitHub Pages con dominio custom siempre 301-redirige** la URL `*.github.io` hacia el dominio propio si existe `CNAME` — no sirve como preview alterno mientras el CNAME esté puesto. Usa `raw.githack.com/soyedzam/elcielo-web/main/archivo.html` para previsualizar sin DNS.
- **Cambiar el custom domain vía API de GitHub Pages genera commits automáticos** ("Delete CNAME" / "Create CNAME") directo al repo — si haces `git push` y te rechaza por "fetch first", es eso, no un conflicto real: `git pull --rebase` y ya.
- **Chrome headless con `--window-size=390,…` NO emula un teléfono.** No aplica el `<meta viewport>` como lo haría iOS, así que el layout sale a un ancho distinto del que capturas y el texto aparece cortado por la derecha: parece desbordamiento y no lo es. Se perdió tiempo persiguiendo un bug fantasma así. Para juzgar móvil, navegador real a 375px y **mide**: `document.documentElement.scrollWidth <= clientWidth`. Headless sirve para capturas a ancho de escritorio, no para veredictos de móvil.
- **🔴 El programa vive DUPLICADO: `index.html` y `agenda.html` tienen los mismos cuatro bloques en HTML separado.** No hay parcial ni plantilla — es un sitio de cero build. Si tocas una hora en uno y no en el otro, el sitio se contradice a sí mismo y nadie te avisa. Ya pasó en esta sesión: se actualizó la agenda con las horas de cierre y la portada quedó con el formato viejo por dos commits. **Al tocar el programa, `grep -oE 'Registro [^<]*' index.html agenda.html` y compara antes de dar por cerrado.**
- **La cifra fantasma sí abría scroll lateral de verdad** (`.lx-ghost` va a `right:-14px` a propósito). Ya está recortada con `overflow-x: clip` en `.lx-programa-wrap` — `clip` y no `hidden`, porque `hidden` crearía un contenedor de scroll. Si agregas otro `.lx-ghost` en una sección nueva, recórtalo igual o vuelve el desplazamiento lateral en el teléfono.

## 6 · Cómo se responde a Ed

Directo, conciso, mínimo texto. Verifica en vivo con evidencia real antes de decir "listo" — nunca confíes en el reporte de otro agente ni en tu propia suposición sin comprobarlo (capturas, curl, lo que aplique). Cierre de respuesta larga: ✅ qué se hizo · ➡️ siguiente paso · ⚠️ pendientes.

## 7 · El guion de cabina NO es la agenda pública

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
*El Cielo en mi Ciudad · Pase de Sesión · v1.1 · 8-ago-2026 · La fragua produce; el taller archiva.* 🕊️
