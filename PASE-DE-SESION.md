# Pase de Sesión — El Cielo en mi Ciudad
> Handoff para la instancia nueva de Claude que retome este sitio.
> **Léelo completo antes de tocar nada.** Escrito 2-ago-2026 · v2.0 el 10-ago-2026 ·
> v3.0 el 12/13-ago-2026 · **reescrito a fondo v4.0 el 13/14-ago-2026** (sesión larga:
> registro por día en vivo, backend de Apps Script desplegado con acceso real de Ed,
> rediseño del footer completo).

---

## 0 · Quién eres aquí

Sitio estático en producción de **"El Cielo en mi Ciudad"** — congreso de **Comunidad
Más Alto** (CMA), Mérida, Yucatán, 14–16 de agosto de 2026. Está **EN VIVO** en
`https://elcielo.comunidadmasalto.org`. **🔴 EL CONGRESO EMPIEZA HOY, 14-ago, 20:00 hrs.**
No hay margen para experimentar en producción — cualquier cambio se prueba en local
primero. El sitio ya escribe registros reales de personas.

## 1 · 🔴 Rutas y reglas duras

- **Repo:** `~/Dev/CMA/elcielo-web` — git propio, remoto `github.com/soyedzam/elcielo-web`, público.
- **Stack: HTML + CSS + JS vanilla. Cero build, cero framework.**
- **Hosting: GitHub Pages**, rama `main`, deploy automático en cada push (source: rama
  `main`, path `/` — confirmado con `gh api repos/soyedzam/elcielo-web/pages`).
  Fastly cachea ~600s — después de cada push, verifica con `curl -I`
  (headers `age`/`last-modified`), nunca con un screenshot con caché.
  **A veces el build de GitHub Pages queda en `errored` sin razón real** (pasó esta
  sesión) — reintenta con `gh api -X POST repos/soyedzam/elcielo-web/pages/builds` antes
  de asumir que el código está mal.
- **Backend: Google Apps Script** (`_fuente/apps-script/Codigo.gs` + `tablero.html`) —
  proyecto real "El Cielo 2026 — Registro y Tablero", cuenta `soyedzam@gmail.com`.
  URL de despliegue (web app, la misma que usa `config.js.urlRegistro`):
  `.../macros/s/AKfycbywpR5sr99FA1DeTlmJbyWMkgwaGPRUYw1fExBZRrIB9d0h2DtN5kc-8y_EtHq_t0dV/exec`
  — **Versión 4 activa** (14-ago). Ver §3 para cómo desplegar una nueva versión sin
  romper esta URL.
- **`sips` de macOS NO exporta a WebP** — usa Python + Pillow (`python3 -c "import PIL"` confirma que está instalado).
- **Dominio:** `elcielo.comunidadmasalto.org` — DNS en Hostinger, HTTPS de GitHub OK.
- **Repo compartido — Ed edita en paralelo.** `git status` antes de cualquier `git add -A`.

## 2 · Voz y marca — sistema Amanecer v1.0 (sin cambios)

índigo noche `#0B1033` · soporte `#1A2158` · ámbar `#F2A93B` · ámbar claro `#FFD59E` ·
hueso `#F7F4EE`. Archivo (display) · Instrument Sans (cuerpo) · IBM Plex Mono (kickers).
**Ya NO se promete "rifa"** en ningún lado del sitio (Ed lo pidió quitar el 13-ago —
el mecanismo/premio nunca lo confirmaron los pastores). El backend interno (Sheet,
tablero) sigue con la columna "Entra a la rifa" por compatibilidad, pero es dato
interno, no promesa pública.

## 3 · 🟢 Registro por día — EN VIVO, backend y frontend desplegados

Cambio grande de esta sesión: el registro pasó de "un solo checkbox implícito para
todo el congreso" a **marcar explícitamente qué día(s) vienes** (Viernes/Sábado/
Domingo, checkboxes, los 3 marcados por defecto). **El cupo (300) sigue siendo
global para todo el congreso — Ed confirmó explícitamente que NO se reparte por
día.** Solo cambia a quién se le espera y a quién se le marca asistencia cada día.

**Sheet — 6 columnas nuevas, agregadas AL FINAL, nunca en medio** (para que ningún
dato real ya guardado se corriera de columna): `Asiste viernes/sábado/domingo`
(lo que la persona marcó al registrarse) + `Asistió viernes/sábado/domingo` (lo que
el equipo marca en la puerta). La columna vieja `Asistió` (índice 7) quedó huérfana,
sin usarse, en vez de reciclarla. **Los registros de ANTES de este cambio no tienen
nada en esas 3 columnas de "Asiste"** — `diasDeFila_()` en `Codigo.gs` los trata como
"asiste los 3 días" automáticamente, así nadie desaparece del tablero de la puerta.

**Tablero** (`tablero.html`, servido por `doGet()`): ahora tiene pestañas
Viernes/Sábado/Domingo (arranca en la de HOY, `diaDeHoy()` client-side). Filtra la
lista + las cifras por la pestaña activa. El cupo mostrado en el contador (`cupo
total X/300`) sigue siendo GLOBAL, no por día — no lo confundas si lo tocas.
El check de asistencia marca/desmarca el día activo específicamente
(`marcarAsistio(clave, folio, dia)` — la función ahora recibe un 3er parámetro `dia`).

**Formulario** (`index.html` + `registro.js`): checkboxes `name="dias"`, valida
mínimo 1 marcado antes de enviar. La confirmación muestra "Te esperamos: Viernes 14 ·
Domingo 16" (o "los 3 días" si marcó todo) usando `textoDias(r.dias)`.

**🔴 El correo de aviso a Ed por cada registro está escrito pero DESACTIVADO**
a propósito: `const CORREO_ACTIVO = false;` al inicio de `Codigo.gs`. Ed pidió
dejarlo en pausa. Cuando confirme que sí lo quiere, cambia esa línea a `true`,
pega el archivo completo en el editor real (ver receta abajo), guarda, y
**Implementar → Administrar implementaciones → editar la activa → Nueva versión →
Implementar** (nunca "Nueva implementación": eso crea una URL nueva y rompe
`config.js`).

**Cómo pegar código en Apps Script sin gastar el contexto del chat en base64:**
```js
// En la consola del editor de Apps Script (con el archivo correcto seleccionado):
const r = await fetch('https://raw.githubusercontent.com/soyedzam/elcielo-web/main/_fuente/apps-script/Codigo.gs');
const src = await r.text();
window.monaco.editor.getEditors()[0].setValue(src);
```
Igual para `tablero.html`. Muchísimo más barato que pasar el archivo completo
(sobre todo `tablero.html`, que trae un logo en base64 de ~35 KB) como string
escapado dentro del prompt — evita eso a toda costa.

**🔴 El selector de "Ejecutar función" del editor de Apps Script OCULTA las
funciones que terminan en `_`** (convención de "privado" — `agregarColumnasDia_`,
`hoja_`, etc. nunca aparecen en el dropdown). Para correr una así una sola vez
(como la migración de columnas), agrega un wrapper temporal sin guion bajo:
```js
function correrLoQueSea() { funcionPrivada_(); }
```
selecciónalo, ejecútalo, revisa el log, y **vuelve a pegar el archivo limpio desde
GitHub raw** para quitar el wrapper (no lo dejes en el código real).

**Migración de columnas ya corrida** (`agregarColumnasDia_()`) — es idempotente, no
la vuelvas a correr por accidente pensando que hace falta, pero tampoco pasa nada
grave si se corre de más (revisa primero si ya están antes de escribir).

## 4 · 🟢 Footer — rediseñado completo esta sesión

Ed pidió revisar "mucho espacio vacío" en el cierre del footer. Cambios (en vivo,
5 páginas: index/agenda/momentos/info/privacidad):

- **Logo de CMA**: antes placa hueso + logo chico (naranja+gris, `masalto-logo-color.png`).
  Ahora el **wordmark** (`masalto-wordmark.png`, script en ámbar) directo sobre índigo,
  más grande — su ámbar es de la misma familia que el del sitio, no choca. La placa
  hueso vieja (`.lx-cma-chip`) SIGUE existiendo para el crédito inline de
  `momentos.html` (no tocar esa, es un uso distinto).
- **Redes + Ministerios**: antes 2 filas sueltas casi vacías. Ahora comparten una sola
  columna a la derecha (`.footer-links-col`), apiladas. Ministerios son pastillas de
  TEXTO — **no hay logos reales de Kids/Nova/Unica/Vanguardia**, si Ed los pasa,
  reemplaza los `<a class="footer-ministerio">` por `<img>`.
- **Cierre (créditos)**: antes una fila estirada con "Equipo" aislado muy a la derecha
  (el vacío que Ed señaló). Ahora es un colofón de 2 líneas — el ancho lo pone el
  contenido, no el footer completo, así nunca vuelve a quedar un hueco sin importar
  el viewport. Clase nueva `.credits-linea` + `.credits-sep` (el punto `·`).
- **Mapas en la confirmación de registro**: los 3 botones (Google/Apple/Waze) ahora
  llevan un ícono SVG genérico (pin/brújula/ruta) — **no son los logos oficiales**,
  para no fabricar marca ajena (regla dura del proyecto).
- **Clima en Agenda**: se agregó la misma insignia de clima en vivo (reusa
  `assets/clima.js`, `cargarClimaActual()`) junto al reloj de Mérida, con el kicker
  "// sigue el evento en vivo" — es la pantalla que más se comparte.

## 5 · Estado real de cada pieza (verificado, no de memoria)

| Pieza | Estado |
|---|---|
| `index.html` | Registro con selector de día, clima actual en el hero, encuesta condicional (oculta, ver §6), footer nuevo, sin rifa |
| `agenda.html` | Clima en vivo junto al reloj, footer nuevo |
| `momentos.html`, `info.html`, `privacidad.html` | Footer nuevo, sin otros cambios de fondo |
| `assets/registro.js` | Selector de día, íconos de mapa, sin rifa |
| `assets/styles.css` | Footer reestructurado, clima con custom properties (`--clima-fuerte`/`--clima-suave` por contexto claro/oscuro) |
| `_fuente/apps-script/Codigo.gs` | 14 columnas, registro por día, correo en pausa (`CORREO_ACTIVO=false`) |
| `_fuente/apps-script/tablero.html` | Pestañas de día, asistencia por día — **Versión 4 desplegada y verificada con un fetch real desde el navegador** |

## 6 · 🔴 Abierto — preguntas sin responder

1. **Encuesta de evaluación**: Ed confirmó que se muestra **desde** el sábado 15
   (`config.js.encuestaUrl` vacío por ahora → bloque oculto por defecto, patrón
   "vacío = no se muestra"). **Sigue faltando el link real** (Google Forms/Tally/
   otro) — en cuanto lo tengas, pégalo en `config.js` y se activa solo, cero código.
2. **Logos reales de Kids/Nova/Unica/Vanguardia** — si Ed los manda, reemplazan las
   pastillas de texto en el footer (ver §4).
3. **Correo de aviso** (`CORREO_ACTIVO`) — activarlo requiere que Ed lo confirme
   explícitamente, no solo que tengas acceso técnico (ver §3).
4. Heredado de v2.0/v3.0, sigue sin resolver: título/eje de sábado-noche y domingo,
   si el Taller de sábado-mañana sigue en pie, mecánica de rifa (ahora irrelevante,
   ya no se promete públicamente), las 3 fotos con menores sin autorización.

## 7 · 🔴 El "plan grande estilo app" (Concierge IA, i18n, bottom-tabs) — SIGUE SIN TOCAR

Ed pidió en algún momento un preview tipo `capacitacion2026.lacumbreglobalmexico.org`
(SPA con bottom-tabs, saludo dinámico, Concierge IA, i18n ES/EN) desplegado en un
`.pages.dev` aparte, nunca en el dominio real. **Se llegó a crear un preview temporal
mínimo** (`xs-elcielo-preview-registro.pages.dev`, Cloudflare Pages direct-upload,
proyecto separado) solo para que Ed viera el registro-por-día ANTES de aprobarlo —
ese preview usa un `fetch` simulado (no le pega a la Sheet real) y **puede borrarse**,
ya cumplió su propósito. **La app completa (Concierge IA, i18n, bottom-tabs) NUNCA se
construyó** — quedó en el plan de `/Users/soyedzam/.claude/plans/dynamic-greeting-clover.md`
si aún existe en el home de Ed. Dado que el congreso es HOY, esto es candidato claro
a "después del evento, sin presión de fecha" — no lo empieces sin que Ed lo pida de
nuevo explícitamente.

## 8 · Lecciones pagadas esta sesión — no las repitas

- **El selector de "Ejecutar" de Apps Script oculta funciones `nombre_()`** — usa un
  wrapper temporal sin guion bajo para correrlas una vez (ver §3).
- **`curl` puro falla al hacer POST a una URL `exec` de Apps Script** (Google
  redirige y el redirect se rompe con curl, incluso con `--post302 --post301`) — la
  respuesta es una página de error de Drive que no significa que el backend esté
  roto. **Prueba siempre con un `fetch()` real desde el navegador** (mismo código
  que usa el sitio), no con curl, antes de concluir que algo falló.
- **El build de GitHub Pages a veces queda en `errored` sin razón real** — antes de
  investigar el código, reintenta con
  `gh api -X POST repos/soyedzam/elcielo-web/pages/builds`.
- **Traer archivos grandes a Apps Script vía `fetch` a GitHub raw**, no pegándolos
  como string escapado en el prompt — ya estaba documentado en v3.0, se repitió el
  error esta sesión (se gastó contexto pegando `tablero.html` en trozos antes de
  acordarse). Es la única forma sana de mover archivos con base64 embebido.
- **El pane de preview sandbox (`Claude_Browser`) no hace scroll real de forma
  confiable para screenshots** — `scrollIntoView`/`scrollTo` por JS no mueve lo que
  la captura ve. En el navegador real (`claude-in-chrome`) sí funciona, pero el
  `computer scroll` tiene tope de `scroll_amount<=10` y `repeat<=100`: hacen falta
  varias llamadas encadenadas para bajar una página larga (~7500px).
- **`git status` reveló que Ed sí tiene sesión de Google activa en su Chrome real**
  (`claude-in-chrome`) cuando hace falta — no asumas que no hay acceso, confírmalo
  navegando a `script.google.com/home` antes de decir que estás bloqueado.

## 9 · Cómo se responde a Ed

Directo, conciso, mínimo texto. Verifica en vivo con evidencia real (curl, fetch
real desde el navegador, computed styles) antes de decir "listo" — nunca con un
screenshot con caché ni con curl puro contra Apps Script. Cierre de respuesta larga:
✅ qué se hizo · ➡️ siguiente paso · ⚠️ pendientes. Ed pidió varias veces "no
despliegues hasta que las revise" — respeta eso literalmente incluso si técnicamente
ya tienes acceso para hacerlo; el "sí, dale" tiene que ser explícito para cada pieza
(pasó con el registro por día vs. el correo: aprobó una y dejó la otra en pausa en el
mismo mensaje).

## 10 · El guion de cabina NO es la agenda pública (sin cambios, ver v2.0 §8)

---
*El Cielo en mi Ciudad · Pase de Sesión · v4.0 · 13/14-ago-2026 · La fragua produce; el taller archiva.* 🕊️
