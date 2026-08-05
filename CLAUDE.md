# CLAUDE.md — El Cielo en mi Ciudad · CASCO WEB
> Este repo es un **casco**, no el canon. El canon vive en EL ASTILLERO.
> *La fragua produce; el taller archiva.* No se combate. Se construye.

## 1 · Dónde estás
| | |
|---|---|
| **Realidad** | `CMA` — Comunidad Más Alto · proyecto **El Cielo en mi Ciudad** |
| **Capa** | 🌍 Comunidades → `06_COMUNIDADES/CMA_Mas-Alto/` en el hub |
| **Repo** | `soyedzam/elcielo-web` · rama `main` |
| **Stack** | **HTML estático — sin build, sin `package.json`.** No inventes uno. |
| **Páginas** | `index.html` · `agenda.html` · `avance.html` · `escanea.html` · `assets/` · `CNAME` |

**Hub (el cerebro):** `~/Documents/2026/EL ASTILLERO`
Si no lo tienes montado, dilo y detente: sin canon no se escribe.

`[VALIDAR]` "El Cielo en mi Ciudad" no aparece con nombre propio en el Registro de Entidades
v2.4 — lo trato como proyecto de CMA porque así vive en disco (`~/Dev/CMA/`). Si es una
Realidad aparte, hay que darla de alta con `ECO_OPS_SOP_Alta-de-Entidad` antes de archivar nada.

## 2 · El canon manda — se LEE antes de escribir, nunca de memoria
| Tarea | Doc en el hub |
|---|---|
| Nombrar archivos | `00_EMPIEZA-AQUI/ECO_OPS_DOC_Nomenclatura-Canon_260804_v1.4.md` |
| Dónde cae cada archivo (**el YAML manda**) | `_SISTEMA/SIS_GEN_DAT_Reglas-de-Archivado_260804_v1.5.yaml` |
| Voz y vocabulario | `00_EMPIEZA-AQUI/ECO_OPS_DOC_Lexico-Canon_260627_v1.0.md` |
| Códigos `[COD]` de las Realidades | `00_EMPIEZA-AQUI/SIS_GEN_IDX_Registro-de-Entidades_260730_v2.4.md` |
| **Crear una Realidad nueva** (el árbol y los 8 pasos) | `_SISTEMA/SIS_GEN_DOC_Realidad-en-Caja_260703_v1.0.md` |
| Capacitar a un chat/agente externo | `_SISTEMA/SIS_GEN_PRM_Pase-de-Abordaje-Chats_260801_v1.3.md` |
| El rector de este archivo | `_SISTEMA/SIS_GEN_PRM_Pase-de-Casco_260805_v1.0.md` |

## 3 · El motor
Toda tarea web arranca en **`/webforge`** (M7 · powered by Xplorers Startups): stack canon,
ductería compartida, Leyes Pagadas y ritual de verificación. No improvises un casco nuevo.

## 4 · Qué se queda aquí y qué se va al hub
- **Aquí (casco):** HTML, CSS, JS, contenido del sitio.
- **Al hub (canon):** estrategia, copy aprobado, informes, bitácoras, briefs — con **pasaporte**
  y nombre canon `[COD]_[AREA]_[TIPO]_[Slug]_[YYMMDD]_v[X.Y].ext`.
  `AREA`: MKT · GEN · OPS · EST — `TIPO`: **lista cerrada** (DOC · MAN · PLN · PLANO · RUMBO ·
  PRM · SOP · FICHA · DAT · IDX · INF · EXP · CONV · BITACORA · PULSO · MIS · OPE · MODULO).
  **No acuñes TIPOs.** Si no cabe, usa el más cercano y escribe
  `TIPO PROPUESTO: [XXX] — requiere alta del Taller`. Un TIPO inventado rompe el Router.
- El estado (`borrador`/`vigente`) **nunca** va en el nombre: va en el pasaporte.

## 5 · Commits
- **Conventional commits, en español:** `feat(scope): …` · `fix:` · `perf:` · `chore:` · `refactor:`
- Solo si el commit es parte de una corrida del Taller: `YYMMDD_ADR-E_Ciudad · descripción`
- Se commitea y se hace push **cuando Ed lo pide**. Si estás en `main`, avisa antes.
- ⚠️ `git fetch` antes de tocar; nunca `git add -A` a ciegas — te llevas trabajo de otra sesión.

## 6 · Assets pesados → Drive, jamás al repo
`~/Library/CloudStorage/GoogleDrive-soyedzam@gmail.com/Mi unidad/ACTIVOS/06_COMUNIDADES/CMA_Mas-Alto/`
⚠️ Drive e iCloud crean duplicados `" 2"` y restauran carpetas borradas: verifica antes y después.
⚠️ Los repos viven en `~/Dev/`, **nunca** en `~/Documents` (iCloud corrompe `.git`).

## 7 · Voz — innegociable
- ❌ Nunca lenguaje de guerra (enemigo, batalla, conquistar) ni religioso en lo público.
- ✅ Se construye, se cruza, se acompaña. Humano: libertad, familia, paz, comunidad.
- Nunca inventes datos, cifras, testimonios, reseñas ni logos de terceros. Lo no confirmado → `[VALIDAR]`.
- Miembros del equipo **solo por código** (ADR-E, ADR-V, C01, S07) — jamás nombre civil en archivos.
- Datos de personas (leads, padrón, clientes) → jamás a GitHub.

## 8 · Propio de este casco
- ⚠️ Ley pagada **T-14**: la recepción de este proyecto costó 7 archivos renombrados por un
  TIPO inventado. Aquí se respeta la lista cerrada de TIPOs sin excepción.
- 🔴 Ed tiene **Reducir Movimiento** activo: la narrativa corre siempre, solo el adorno respeta
  la preferencia, más un botón para encenderlo. Prueba con `reducedMotion: 'reduce'`.

## 9 · Verificar antes de cantar victoria
No hay build: se abre el HTML y **se comprueba con navegador**, nunca solo con `curl`
(un `curl` con cache-buster da falso verde).


---
*CMA · El Cielo en mi Ciudad · Pase de Casco v1.0 · 5·ago·2026* 🕊️
