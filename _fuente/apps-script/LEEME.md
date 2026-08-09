# Registro y tablero — cómo se conecta

El sitio es estático: no tiene servidor. Los registros se guardan en una
hoja de cálculo de Google, y esa hoja también sirve el tablero del equipo.

**Son 5 pasos, unos 5 minutos.** El único que no puedo hacer yo es el 3:
autorizar el script pide tu contraseña de Google.

---

## 1 · Crear la hoja

Entra a [sheets.new](https://sheets.new) y ponle de nombre
`El Cielo 2026 — Registros`. No hace falta crear columnas: el script las
pone solo la primera vez.

## 2 · Pegar el código

En esa hoja: menú **Extensiones → Apps Script**.

- Borra lo que traiga `Código.gs` y pega el contenido de **`Codigo.gs`**.
- Arriba a la izquierda, **+ → HTML**, nómbralo exactamente `tablero`
  (sin `.html`), y pega el contenido de **`tablero.html`**.
- Guarda (💾).

## 3 · Poner la contraseña del tablero

En el editor, abre `Codigo.gs`, busca hasta abajo la función
`ponerContrasena()` y cambia `CAMBIA-ESTA-CLAVE` por la contraseña que
le vas a pasar al equipo.

Selecciona `ponerContrasena` en el menú de funciones y dale **Ejecutar**.
Google te va a pedir autorización — es tu cuenta y tu hoja, por eso este
paso lo tienes que hacer tú. Sale un aviso de "app no verificada":
**Configuración avanzada → Ir a (nombre del proyecto)**. Es normal, el
proyecto es tuyo y no está publicado en ningún directorio.

Cuando termine, **borra la contraseña de esa función y vuelve a guardar**.
Ya quedó almacenada aparte; si se queda escrita ahí, cualquiera que abra
el script la puede leer.

## 4 · Publicar

**Implementar → Nueva implementación** → engrane → **Aplicación web**.

| Campo | Qué poner |
|---|---|
| Ejecutar como | **Yo** |
| Quién tiene acceso | **Cualquier usuario** |

> "Cualquier usuario" suena a que todo queda expuesto, pero no: es lo que
> permite que el formulario del sitio pueda enviar registros sin que la
> gente tenga que iniciar sesión con Google. Los datos siguen protegidos —
> la única URL que devuelve nombres pide la contraseña del paso 3.

Copia la **URL de la aplicación web** (termina en `/exec`).

## 5 · Conectarla al sitio

En `assets/config.js`, pega esa URL:

```js
urlRegistro: "https://script.google.com/macros/s/AKfy…/exec",
```

Sube el cambio y listo. Mientras esté vacía, el sitio no muestra el
formulario: deja solo el WhatsApp de informes. Es a propósito — vale más
un canal que responde que un formulario que se traga los datos.

---

## Cómo se usa

**El tablero** es esa misma URL abierta en el navegador. Pide contraseña,
y desde ahí el equipo ve quién se registró, busca por nombre o folio, y
marca quién ya llegó tocando el círculo. Funciona bien desde el celular
en la puerta.

**La rifa**: quien se registra por el sitio entra automáticamente
(columna *Entra a la rifa* = Sí). Quien se registre el día del evento
queda marcado como *Presencial* y fuera de la rifa. Para sortear, filtra
la columna por "Sí".

**Si alguien se registra dos veces**, el sistema lo detecta por correo o
por teléfono y le devuelve su folio original — no se duplica ni pierde
su lugar en la rifa.

---

## Ojo con esto

- **La contraseña se comparte por un canal privado**, no en el grupo
  grande de WhatsApp. Quien la tenga ve los datos de todos los inscritos.
- **Si la contraseña se filtra**, se cambia corriendo `ponerContrasena()`
  otra vez con una nueva. No hace falta volver a publicar.
- **Al editar el código, hay que volver a implementar** (Implementar →
  Administrar implementaciones → lápiz → Versión: Nueva). Si no, sigue
  corriendo la versión vieja.
- **El cupo** está en `CUPO` dentro de `Codigo.gs`. Al llegar al tope, el
  formulario deja de aceptar y avisa que la entrada sigue siendo libre.
