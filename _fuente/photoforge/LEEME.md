# PhotoForge v2.1 — postproducción de fotos de evento

Motor que preparó las fotos de `assets/fotos/asi-lo-vivimos/`. Vive aquí para quedar
versionado y respaldado; la copia de trabajo es `~/Dev/CMA/scripts/photoforge.py`.

## 🔴 La v1.0 se publicó y hubo que bajarla — lee esto antes de tocar el motor

La v1.0 aplicaba **balance de blancos automático gray-world**, que asume que el promedio
de la escena es gris neutro. En un congreso con pantalla LED magenta eso es falso: el
algoritmo leyó la luz del show como un error y la borró. La pantalla rosa salió verde
oliva y las caras amarillentas. Ed las rechazó con razón.

Medido contra fotos del mismo auditorio que el cliente ya había aprobado:

|                      | originales | aprobadas | v1.0 | v2.1 |
|----------------------|-----------:|----------:|-----:|-----:|
| a* (magenta escenario) | +16.9 | +17.7 | **+3.4** | +16.9 |
| b* (azul)              |  −9.8 |  −9.7 | **−0.7** |  −9.8 |
| saturación             |  0.47 |  0.51 | **0.35** |  0.51 |

**En fotografía de escenario la luz de color es la puesta en escena, no un error.**
Corregirla anula la intención de quien iluminó y desplaza la piel al complementario.

> REGLA DURA: este motor **no toca el balance de blancos**. Nunca.

## Qué hace

| Paso | Por qué |
|---|---|
| Recuperación de altas luces | los originales traen hasta 20% de píxeles quemados |
| Curva en S suave | contraste de medios con el negro **profundizado**, no levantado |
| Vibrance selectivo | sube el color apagado, deja en paz el magenta que ya está al tope |
| Denoise adaptativo | mide el grano de cada foto y ajusta — el lote mezcla ISO 6400 y 10000 |
| Enfoque enmascarado por bordes | un unsharp plano afila el grano igual que el filo |
| Resize LANCZOS | 2560 px lado mayor + miniatura de 640 px |

Orden deliberado: **reescalar → denoise → enfocar.** Reescalar primero ya promedia parte
del grano y abarata el denoise; enfocar al final evita volver a subir lo que se limpió.

🔴 **Nunca regenera ni modifica facciones.** Es revelado digital, no IA generativa. Si
alguien le agrega un paso que invente píxeles, deja de poder usarse en fotos de personas
reales sin decirlo.

## Límites que no se pasan

- **Altas luces quemadas no se recuperan.** Los originales son JPEG, no RAW: donde el
  sensor llegó a 255 no hay dato que traer.
- **La retícula de la pantalla LED no es ruido.** En tomas cercanas los diodos se
  resuelven uno por uno; ningún denoise lo quita (y NLM la *preserva* por diseño, porque
  busca parches repetidos). A tamaño de galería no se nota; solo al 100%.
- **Techo del denoise: luma 7.** Pasado ese punto las caras se ven de cera. Comprobado a
  ojo sobre este material, no es un número teórico.

## Uso

```bash
python3 photoforge.py entrada.jpg salida.webp --thumb salida-t.webp
```

## Dependencias en esta Mac

`numpy` y `opencv` (`cv2`) están instalados. Para HEIC la cadena es
`sips -s format tiff` → Pillow: **`sips` no exporta WebP y no hay `pillow_heif`**.

## Antes de publicar lo que salga de aquí

1. **Curar.** El motor no elige: en el lote del viernes fueron 101 originales → 18
   publicadas. Una toma por momento real, nunca dos del mismo instante.
2. **Verificar menores con zoom, foto por foto.** No heredar la clasificación de otra
   pasada — el inventario del 16-ago marcaba como apta una foto con un bebé de rostro
   identificable en primer plano.
