# -*- coding: utf-8 -*-
"""Optimiza las imágenes usadas por la web: redimensiona + comprime.
- Fotos sin transparencia -> JPEG (.jpg) y se actualizan las referencias.
- Imágenes con transparencia (logos) -> PNG optimizado, mismo nombre.
Respalda los originales en image_backup_originals/ (fuera de public, no se despliega).
"""
import os, re, shutil, subprocess
from PIL import Image

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(BASE, "public", "Imagenes")
SRC_DIR = os.path.join(BASE, "src")
BACKUP = os.path.join(BASE, "image_backup_originals")
MAX_SIDE = 1600
JPEG_Q = 82
MIN_BYTES = 300 * 1024  # solo tocar imágenes > 300KB

os.makedirs(BACKUP, exist_ok=True)

# Logos / iconos: mantener PNG con transparencia, no convertir a JPG
KEEP_PNG = {"logo-negro.png", "logo-blanco.png", "logo-dorado.png",
            "logosinfondo.png", "logo-showclinic.png"}

# Obtener imágenes referenciadas en el código
out = subprocess.run(
    ["grep", "-rhoE", r"/Imagenes/[^\"')]+\.(png|jpg|jpeg|JPG|JPEG|PNG)", SRC_DIR],
    capture_output=True, text=True)
referenced = sorted(set(p.replace("/Imagenes/", "") for p in out.stdout.splitlines()))

renames = {}   # old filename -> new filename
report = []

for fname in referenced:
    path = os.path.join(IMG_DIR, fname)
    if not os.path.exists(path):
        report.append((fname, "NO EXISTE", 0, 0))
        continue
    orig_kb = os.path.getsize(path) / 1024
    if fname in KEEP_PNG or orig_kb * 1024 < MIN_BYTES:
        report.append((fname, "sin cambios", round(orig_kb), round(orig_kb)))
        continue

    # backup
    shutil.copy2(path, os.path.join(BACKUP, fname.replace("/", "_")))

    try:
        im = Image.open(path)
    except Exception as e:
        report.append((fname, f"error: {e}", round(orig_kb), 0))
        continue

    # detectar transparencia real
    has_alpha = False
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        a = im.convert("RGBA").getchannel("A")
        if a.getextrema()[0] < 250:
            has_alpha = True

    # redimensionar
    im_resized = im.copy()
    im_resized.thumbnail((MAX_SIDE, MAX_SIDE))

    if has_alpha:
        # mantener PNG, optimizado
        im_resized.save(path, optimize=True)
        new_kb = os.path.getsize(path) / 1024
        report.append((fname, "PNG opt (alpha)", round(orig_kb), round(new_kb)))
    else:
        # convertir a JPEG
        rgb = im_resized.convert("RGB")
        stem, ext = os.path.splitext(fname)
        if ext.lower() in (".jpg", ".jpeg"):
            new_name = fname  # mantener nombre
            new_path = path
        else:
            new_name = stem + ".jpg"
            new_path = os.path.join(IMG_DIR, new_name)
        rgb.save(new_path, "JPEG", quality=JPEG_Q, optimize=True, progressive=True)
        new_kb = os.path.getsize(new_path) / 1024
        if new_name != fname:
            os.remove(path)  # quitar PNG viejo (respaldado)
            renames[fname] = new_name
        report.append((fname, f"JPEG -> {new_name}", round(orig_kb), round(new_kb)))

# Actualizar referencias en el código
if renames:
    for root, _, files in os.walk(SRC_DIR):
        for f in files:
            if not f.endswith((".jsx", ".js", ".tsx", ".ts", ".css", ".html")):
                continue
            fp = os.path.join(root, f)
            with open(fp, encoding="utf-8") as fh:
                content = fh.read()
            new = content
            for old, newn in renames.items():
                new = new.replace("/Imagenes/" + old, "/Imagenes/" + newn)
            if new != content:
                with open(fp, "w", encoding="utf-8") as fh:
                    fh.write(new)

# también index.html en raíz
idx = os.path.join(BASE, "index.html")
if os.path.exists(idx) and renames:
    with open(idx, encoding="utf-8") as fh:
        c = fh.read()
    nc = c
    for old, newn in renames.items():
        nc = nc.replace("/Imagenes/" + old, "/Imagenes/" + newn)
    if nc != c:
        with open(idx, "w", encoding="utf-8") as fh:
            fh.write(nc)

print(f"{'IMAGEN':45} {'ACCIÓN':22} {'ANTES':>8} {'DESPUÉS':>8}")
print("-" * 90)
tot_old = tot_new = 0
for fname, action, okb, nkb in sorted(report, key=lambda x: -x[2]):
    print(f"{fname[:44]:45} {action[:21]:22} {okb:>7}K {nkb:>7}K")
    tot_old += okb; tot_new += nkb
print("-" * 90)
print(f"{'TOTAL':45} {'':22} {tot_old:>7}K {tot_new:>7}K  ({round(tot_new/tot_old*100) if tot_old else 0}% del original)")
print(f"\nRenombrados (png->jpg): {len(renames)}")
