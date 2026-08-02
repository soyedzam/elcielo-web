# El Cielo en mi Ciudad — Web estática

Sitio del congreso de liderazgo de **Comunidad Más Alto** (Mérida, Yucatán · 14–16 ago 2026).
HTML + CSS + JS vanilla (módulos ES), sin build, sin dependencias, sin backend —
el mismo patrón que su sitio hermano [La Nave](https://lanave.comunidadmasalto.org/).

Es el port estático 1:1 de la landing editorial aprobada del build anterior
(`xs-event-engine`, sistema **Amanecer v1.0**): mismo copy, misma composición,
mismos tokens de marca. Solo cambió el motor que la sirve.

## Páginas

| Página | Qué es |
|---|---|
| `index.html` | Landing editorial completa: hero Amanecer, ejes, voces, programa, convoca/límites, comunidad, registro |
| `agenda.html` | Programa completo por día |
| `momentos.html` | Videos de la comunidad (miniaturas que abren YouTube, sin embed) + fotos |
| `info.html` | Sede, qué es, fechas, cómo apartar lugar |
| `avance.html` | Kiosko: cuenta regresiva al 14 de agosto (el número que respira) + QR |
| `escanea.html` | Kiosko: pantalla de reposo con QR sobre el gradiente |
| `invitacion.html` | Loop de 14s (1920×1080 auto-escala) para proyectar en otras iglesias, con video de fondo |

## Actualizar datos (lo único que se toca)

Editar [`assets/config.js`](assets/config.js):

```js
whatsapp: "52XXXXXXXXXX",   // ← número del equipo, solo dígitos  [VALIDAR: pendiente]
```

Con número: todos los CTA "Aparta tu lugar" abren WhatsApp con mensaje precargado
y en #registro aparece el botón directo. Sin número: los CTA llevan a #registro,
donde vive el plan B (equipo de la comunidad / Facebook). Guardar, commit y push
a `main` — GitHub Pages publica solo.

## Deploy

- `CNAME` ya trae `elcielo.comunidadmasalto.org`.
- Falta (lo hace Ed): crear el repo en GitHub, activar Pages (branch `main`),
  y el registro DNS `elcielo` → `soyedzam.github.io` en Squarespace.

## Reglas de marca aplicadas

- Sistema Amanecer v1.0: índigo `#0B1033` manda · ámbar `#F2A93B` solo conversión ·
  hueso `#F7F4EE` · Archivo 800/900 + Instrument Sans + IBM Plex Mono.
- Vocabulario canon: congreso · líderes convocados · aparta tu lugar · voces.
- Nada inventado: sesión sin confirmar dice "por confirmar"; cero urgencia falsa.
- El video pesado del loop vive fuera de git (Cloudflare Pages:
  `xs-elcielo-media.pages.dev`), referenciado desde `config.js`.
- Este sitio no usa cookies ni recopila datos personales.

*Estrategia, Arquitectura y Diseño: Soul Lens Studios · Powered by Xplorers Startups × EL ARKA.*
