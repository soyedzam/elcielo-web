#!/usr/bin/env python3
"""PhotoForge v1.0 — postproducción técnica de fotos de evento.

Balance de blancos automático (gray-world) + contraste local (CLAHE en
canal L de LAB) + realce de saturación leve + máscara de enfoque. Todo
determinista sobre píxeles existentes: nunca regenera ni modifica
facciones, solo corrige luz/color/nitidez como lo haría revelado
digital convencional (Lightroom-style), no generación con IA.

Uso:
    python3 photoforge.py <entrada.jpg> <salida.webp> [--thumb salida-t.webp]
"""
import sys
import argparse
import numpy as np
import cv2
from PIL import Image, ImageOps

MAX_SIDE = 1920
THUMB_SIDE = 640
WEBP_QUALITY = 85
THUMB_QUALITY = 80


def auto_white_balance(bgr):
    """Gray-world: asume que el promedio de la escena es gris neutro."""
    result = bgr.astype(np.float32)
    avg_b, avg_g, avg_r = (result[:, :, i].mean() for i in range(3))
    avg_gray = (avg_b + avg_g + avg_r) / 3
    result[:, :, 0] *= avg_gray / max(avg_b, 1)
    result[:, :, 1] *= avg_gray / max(avg_g, 1)
    result[:, :, 2] *= avg_gray / max(avg_r, 1)
    return np.clip(result, 0, 255).astype(np.uint8)


def local_contrast(bgr, clip_limit=2.0, tile=8):
    """CLAHE sobre luminancia (LAB-L): contraste local sin lavar el color."""
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=(tile, tile))
    l2 = clahe.apply(l)
    return cv2.cvtColor(cv2.merge([l2, a, b]), cv2.COLOR_LAB2BGR)


def boost_saturation(bgr, factor=1.08):
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[:, :, 1] = np.clip(hsv[:, :, 1] * factor, 0, 255)
    return cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)


def unsharp_mask(bgr, amount=1.4, sigma=3):
    blur = cv2.GaussianBlur(bgr, (0, 0), sigma)
    return cv2.addWeighted(bgr, amount, blur, -(amount - 1), 0)


def enhance(path_in, path_out, thumb_out=None, max_side=MAX_SIDE, thumb_side=THUMB_SIDE):
    img = Image.open(path_in)
    img = ImageOps.exif_transpose(img).convert("RGB")
    arr = np.array(img)[:, :, ::-1]  # RGB -> BGR para OpenCV

    arr = auto_white_balance(arr)
    arr = local_contrast(arr)
    arr = boost_saturation(arr)
    arr = unsharp_mask(arr)

    out = Image.fromarray(arr[:, :, ::-1])  # BGR -> RGB

    w, h = out.size
    scale = min(1.0, max_side / max(w, h))
    if scale < 1.0:
        out = out.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    out.save(path_out, "WEBP", quality=WEBP_QUALITY)

    if thumb_out:
        tw, th = out.size
        tscale = min(1.0, thumb_side / max(tw, th))
        thumb = out.resize((round(tw * tscale), round(th * tscale)), Image.LANCZOS)
        thumb.save(thumb_out, "WEBP", quality=THUMB_QUALITY)

    return out.size


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("entrada")
    p.add_argument("salida")
    p.add_argument("--thumb")
    args = p.parse_args()
    size = enhance(args.entrada, args.salida, args.thumb)
    print(f"ok {args.salida} {size}")
