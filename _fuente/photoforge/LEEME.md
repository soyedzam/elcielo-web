# PhotoForge — postproducción de fotos de evento

Motor que preparó las fotos de `assets/fotos/asi-lo-vivimos/`. Vive aquí para quedar
versionado y respaldado; la copia de trabajo es `~/Dev/CMA/scripts/photoforge.py`.

## Qué hace

Revelado digital determinista sobre los píxeles que ya existen:

| Paso | Qué corrige |
|---|---|
| Balance de blancos gray-world | la luz de escenario tiñe todo de magenta/verde |
| CLAHE sobre el canal L de LAB | contraste local sin lavar el color |
| Saturación +8% | compensa lo que el WB automático apaga |
| Máscara de enfoque | nitidez de entrega, no de captura |
| Resize LANCZOS | 1920 px lado mayor + miniatura de 640 px |

🔴 **Nunca regenera ni modifica facciones.** Es Lightroom, no IA generativa. Si algún día
alguien le agrega un paso que invente píxeles, deja de poder usarse en fotos de personas
reales sin decirlo.

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
