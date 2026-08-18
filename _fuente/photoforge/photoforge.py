#!/usr/bin/env python3
"""PhotoForge v2.0 — postproducción de fotos de evento.

═══════════════════════════════════════════════════════════════════════════
POR QUÉ EXISTE LA v2.0 — la lección que pagó la v1.0 (18-ago-2026)
═══════════════════════════════════════════════════════════════════════════
La v1.0 aplicaba balance de blancos automático "gray-world", que asume que
el promedio de la escena es gris neutro. En un congreso con pantalla LED y
luz de escenario magenta/azul, el promedio NO es gris — es magenta. El
algoritmo "corrigió" esa desviación y borró la luz del show.

Medido contra las fotos que el cliente ya había aprobado del mismo auditorio:

                        originales   aprobadas   salida v1.0
  a* (magenta)             +16.9       +17.7        +3.4   ← borrado
  b* (azul)                 -9.8        -9.7        -0.7   ← borrado
  saturación                0.47        0.51        0.35   ← caída
  % negros profundos        21.3        14.5        11.3   ← levantados

Ed la rechazó y tenía razón: quedaron lavadas. La fotografía de concierto
NO se corrige de color — la luz de colores es la puesta en escena, no un
error. Corregirla anula la intención de quien iluminó, y desplaza los tonos
de piel al complementario (magenta fuera ⇒ piel verdosa).

  «Si usas un balance de blancos que quita la luz de color y la devuelve a
   neutro, has anulado toda la intención escénica del artista.»

REGLA DURA: este motor NO toca el balance de blancos. Nunca.
═══════════════════════════════════════════════════════════════════════════

Qué SÍ hace, y por qué cada paso:

  1. Recuperación de altas luces — los originales traen hasta 20% de píxeles
     quemados (pantalla LED, cañones). Comprime el extremo alto sin tocar
     el resto: es lo único que la cámara de verdad perdió.
  2. Curva en S suave — contraste de medios tonos, con el punto negro
     PROFUNDIZADO, no levantado. Las fotos aprobadas conservan ~14% de
     negro real: esa oscuridad es el ambiente de la sala, no falta de datos.
  3. Vibrance (no saturación plana) — sube el color de las zonas apagadas
     y deja en paz las ya saturadas. Enriquece la piel y la ropa sin
     empujar el magenta del escenario, que ya está al tope.
  4. Máscara de enfoque — nitidez de entrega tras el reescalado.
  5. Reescalado LANCZOS a 1920 px + miniatura de 640 px, WebP.

Todo es determinista sobre los píxeles existentes: revelado digital, no IA
generativa. Nunca regenera ni modifica facciones.

Uso:
    python3 photoforge.py entrada.jpg salida.webp [--thumb salida-t.webp]
    python3 photoforge.py --medir archivo.jpg [archivo2.jpg ...]
"""
import sys
import argparse
import numpy as np
import cv2
from PIL import Image, ImageOps

# 2560 y no 1920: en pantallas Retina un lado mayor de 1920 se ve blando al
# abrir la foto a tamaño completo. Con el denoise en su sitio, el detalle extra
# suma nitidez en vez de sumar grano.
MAX_SIDE = 2560
THUMB_SIDE = 640
WEBP_QUALITY = 86
THUMB_QUALITY = 82

# Perfil derivado de las fotos aprobadas por el cliente del mismo auditorio
# (CMA_Auditorio-*, corrida 260802). Sirve para verificar, no para forzar:
# si una salida se aleja mucho de aquí, conviene revisarla a ojo.
PERFIL_OBJETIVO = {
    "saturacion": (0.45, 0.60),   # rico, sin quemar
    "negros_pct": (8.0, 22.0),    # la sala es oscura y debe seguir siéndolo
    "blancos_pct": (0.0, 3.0),    # casi nada quemado
}


def recuperar_altas(bgr, umbral=200, fuerza=0.75):
    """Comprime solo el extremo alto de la luminancia.

    Trabaja sobre L de LAB para no desplazar el tono: bajar los tres canales
    RGB por igual apagaría el color junto con el brillo.
    """
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)
    L = lab[:, :, 0].astype(np.float32)
    exceso = np.clip(L - umbral, 0, None)
    margen = 255.0 - umbral
    # rolloff suave: cuanto más se pasa, más se comprime
    L_nueva = umbral + margen * np.tanh(fuerza * exceso / margen) / np.tanh(fuerza)
    lab[:, :, 0] = np.clip(np.where(L > umbral, L_nueva, L), 0, 255).astype(np.uint8)
    return cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)


def curva_s(bgr, contraste=0.09, punto_negro=0.004):
    """Curva en S sobre la luminancia: medios con más cuerpo, negros más hondos.

    punto_negro recorta el pie del histograma hacia abajo — es lo contrario
    de lo que hacía el CLAHE de la v1.0, que los levantaba y lavaba la foto.
    """
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)
    x = lab[:, :, 0].astype(np.float32) / 255.0
    x = np.clip((x - punto_negro) / (1.0 - punto_negro), 0, 1)
    # S centrada en 0.5, sin tocar los extremos
    y = x + contraste * np.sin(2 * np.pi * x) / (2 * np.pi) * -1
    y = np.clip(y, 0, 1)
    lab[:, :, 0] = (y * 255).astype(np.uint8)
    return cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)


def vibrance(bgr, fuerza=0.08):
    """Sube saturación de forma inversa a la que ya hay.

    Un +8% plano (v1.0) empuja por igual el magenta del cañón —que ya está
    al tope y solo se ensucia— y una piel apagada que sí lo necesita.
    """
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
    s = hsv[:, :, 1] / 255.0
    hsv[:, :, 1] = np.clip(s * (1.0 + fuerza * (1.0 - s)), 0, 1) * 255
    return cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)


def medir_grano(bgr):
    """Ruido medido SOLO en zonas lisas — ahí no hay detalle, todo es grano.

    Medirlo sobre la imagen entera confunde grano con textura real (pelo,
    tela) y da un número que no sirve para decidir.
    """
    L = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)[:, :, 0].astype(np.float32)
    gx = cv2.Sobel(L, cv2.CV_32F, 1, 0, ksize=3)
    gy = cv2.Sobel(L, cv2.CV_32F, 0, 1, ksize=3)
    liso = cv2.magnitude(gx, gy) < 12
    if liso.sum() < 1000:
        return 0.0
    return float((L - cv2.GaussianBlur(L, (0, 0), 2))[liso].std())


def reducir_ruido(bgr, objetivo=1.2):
    """Denoise adaptativo: cada foto recibe la mano que su grano pide.

    El lote mezcla ISO 6400 y 10000, y una fuerza fija sería mucha para una
    y poca para la otra. Se mide el grano real y se escala desde ahí.

    Croma >> luma a propósito: el ruido de COLOR son motas magenta/verdes,
    siempre sucias y sin costo al borrarlas; el de LUMINANCIA es grano, y
    pasado de mano deja la piel de cera. Con luma>7 las caras ya se notan
    plastificadas — ese es el techo, comprobado a ojo sobre este material.
    """
    grano = medir_grano(bgr)
    if grano <= objetivo:
        return bgr
    # regla de tres contra el punto calibrado (grano 2.66 → luma 7)
    luma = int(np.clip(round(7 * grano / 2.66), 2, 7))
    croma = int(np.clip(luma * 2.1, 6, 16))
    return cv2.fastNlMeansDenoisingColored(bgr, None, luma, croma, 7, 21)


def enfoque(bgr, cantidad=0.55, sigma=1.1, umbral_borde=14):
    """Máscara de enfoque aplicada SOLO donde hay borde real.

    Un unsharp plano (v2.0) sube el filo y el grano por igual — en zonas lisas
    solo hay grano, así que ahí afilar es amplificar ruido. La máscara de
    Sobel deja fuera esas zonas.
    """
    gris = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    gx = cv2.Sobel(gris, cv2.CV_32F, 1, 0, ksize=3)
    gy = cv2.Sobel(gris, cv2.CV_32F, 0, 1, ksize=3)
    borde = cv2.magnitude(gx, gy)
    mascara = np.clip((borde - umbral_borde) / 60.0, 0, 1)
    mascara = cv2.GaussianBlur(mascara, (0, 0), 1.5)[:, :, None]

    borroso = cv2.GaussianBlur(bgr, (0, 0), sigma)
    afilado = cv2.addWeighted(bgr, 1 + cantidad, borroso, -cantidad, 0)
    return (bgr * (1 - mascara) + afilado * mascara).astype(np.uint8)


def medir(path):
    """Estadísticas para comparar contra PERFIL_OBJETIVO."""
    img = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    bgr = np.asarray(img)[:, :, ::-1]
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)
    L = lab[:, :, 0].astype(np.float32) * 100 / 255
    s = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)[:, :, 1].astype(np.float32) / 255
    return {
        "L50": float(np.percentile(L, 50)),
        "saturacion": float(s.mean()),
        "negros_pct": float((L < 5).mean() * 100),
        "blancos_pct": float((L > 95).mean() * 100),
        "a": float(lab[:, :, 1].mean()) - 128,
        "b": float(lab[:, :, 2].mean()) - 128,
    }


def procesar(path_in, path_out, thumb_out=None, max_side=MAX_SIDE, thumb_side=THUMB_SIDE):
    img = ImageOps.exif_transpose(Image.open(path_in)).convert("RGB")
    bgr = np.asarray(img)[:, :, ::-1].copy()

    # 🔴 Sin balance de blancos: la luz de color es la puesta en escena.
    bgr = recuperar_altas(bgr)
    bgr = curva_s(bgr)
    bgr = vibrance(bgr)

    out = Image.fromarray(bgr[:, :, ::-1])
    w, h = out.size
    escala = min(1.0, max_side / max(w, h))
    if escala < 1.0:
        out = out.resize((round(w * escala), round(h * escala)), Image.LANCZOS)

    # Orden deliberado: reescalar → denoise → enfocar.
    # Reescalar primero ya promedia parte del grano y hace el denoise 10×
    # más barato; enfocar al final, sobre la imagen ya limpia, evita subir
    # el ruido que el paso anterior acaba de quitar.
    bgr_out = np.asarray(out)[:, :, ::-1].copy()
    bgr_out = reducir_ruido(bgr_out)
    bgr_out = enfoque(bgr_out)
    out = Image.fromarray(bgr_out[:, :, ::-1])
    out.save(path_out, "WEBP", quality=WEBP_QUALITY)

    if thumb_out:
        tw, th = out.size
        te = min(1.0, thumb_side / max(tw, th))
        out.resize((round(tw * te), round(th * te)), Image.LANCZOS).save(
            thumb_out, "WEBP", quality=THUMB_QUALITY
        )
    return out.size


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--medir", nargs="+", help="solo reporta estadísticas, no procesa")
    p.add_argument("entrada", nargs="?")
    p.add_argument("salida", nargs="?")
    p.add_argument("--thumb")
    args = p.parse_args()

    if args.medir:
        print(f"{'archivo':<46}{'L50':>7}{'sat':>7}{'%neg':>7}{'%bla':>7}{'a*':>7}{'b*':>7}")
        for f in args.medir:
            m = medir(f)
            nombre = f.split("/")[-1][:44]
            print(f"{nombre:<46}{m['L50']:>7.1f}{m['saturacion']:>7.3f}"
                  f"{m['negros_pct']:>7.2f}{m['blancos_pct']:>7.2f}{m['a']:>7.1f}{m['b']:>7.1f}")
        sys.exit(0)

    if not args.entrada or not args.salida:
        p.error("faltan entrada y salida (o usa --medir)")
    print(f"ok {args.salida} {procesar(args.entrada, args.salida, args.thumb)}")
