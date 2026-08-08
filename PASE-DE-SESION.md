# Pase de Sesión — El Cielo en mi Ciudad
> Handoff para la instancia nueva de Claude que retome este sitio.
> **Léelo completo antes de tocar nada.** Escrito: 2-ago-2026.

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

## 3 · Estado real de cada pieza (verificado, no de memoria)

| Pieza | Estado |
|---|---|
| `index.html` | Landing completa: hero con video cinematográfico + gradiente Amanecer, Ejes, Ponentes (Ofir/Tere), Programa, Pastores (Joel/Ana), A quién convoca, Comunidad (fotos reales), Registro (countdown en vivo + WhatsApp), footer con créditos |
| `agenda.html` | Programa por día, igual al de index |
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
3. **`og:image`** — no existe. Sin ella, el link se ve pobre al compartirse en WhatsApp/redes. Se puede exportar del Design System.
4. **Fotos de comunidad** — las 3 de la sección "Comunidad" son de La Nave (misma comunidad madre), reusadas con velo índigo. Si aparecen fotos oficiales del Cielo, reemplázalas.

## 5 · Lecciones ya pagadas en esta sesión — no las repitas

- **El registrador del dominio es Hostinger, no Squarespace.** Costó tiempo real deducirlo mal por el nombre de los nameservers (`dns-parking.com`, que parece Squarespace pero no lo es). Verifica con `whois`, no con el nombre del nameserver.
- **El pane de preview integrado renderiza negro en contenido con reveal-on-scroll** (el mismo bug documentado en la memoria del proyecto para otros sitios del portafolio). Usa Chrome real (`claude-in-chrome` o similar) para QA visual, nunca confíes en un fondo negro como "está roto".
- **`object-fit:cover` sin `object-position` corta caras en fotos documentales** cuando el aspect-ratio cambia en móvil. Si agregas fotos nuevas, revisa el recorte en 375px antes de dar por bueno — no asumas que el centro es un buen punto de anclaje.
- **GitHub Pages con dominio custom siempre 301-redirige** la URL `*.github.io` hacia el dominio propio si existe `CNAME` — no sirve como preview alterno mientras el CNAME esté puesto. Usa `raw.githack.com/soyedzam/elcielo-web/main/archivo.html` para previsualizar sin DNS.
- **Cambiar el custom domain vía API de GitHub Pages genera commits automáticos** ("Delete CNAME" / "Create CNAME") directo al repo — si haces `git push` y te rechaza por "fetch first", es eso, no un conflicto real: `git pull --rebase` y ya.

## 6 · Cómo se responde a Ed

Directo, conciso, mínimo texto. Verifica en vivo con evidencia real antes de decir "listo" — nunca confíes en el reporte de otro agente ni en tu propia suposición sin comprobarlo (capturas, curl, lo que aplique). Cierre de respuesta larga: ✅ qué se hizo · ➡️ siguiente paso · ⚠️ pendientes.

---
*El Cielo en mi Ciudad · Pase de Sesión · 2-ago-2026 · La fragua produce; el taller archiva.* 🕊️
