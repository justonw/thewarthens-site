#!/usr/bin/env python3
"""Builds a transparent lower-third text overlay (ProRes 4444 with alpha), 11 seconds. It eases up onto the screen and
stays until the end. Nothing moves off.

  python3 scripts/make-lower-third-question.py

Writes docs/video-overlays/overlay-lower-third-overwhelmed-question.mov and a preview image. No em dashes.
"""
import os, shutil, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "video-overlays")
W, H, FPS, SECONDS = 1920, 1080, 30, 11
TEXT = "What do others experience when I am overwhelmed?"
GOLD = (222, 184, 112)
WHITE = (248, 247, 242)
FONT = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
SIZE = 70

def ease(t):
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3

def scaled(layer, a):
    r, g, b, al = layer.split()
    return Image.merge("RGBA", (r, g, b, al.point(lambda v: int(v * a))))

def wrap(draw, text, fnt, width):
    lines, line = [], ""
    for word in text.split():
        trial = (line + " " + word).strip()
        if draw.textlength(trial, font=fnt) <= width:
            line = trial
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines

def balanced(draw, text, fnt, width):
    n = len(wrap(draw, text, fnt, width))
    lo, hi = 200, width
    while lo < hi:
        mid = (lo + hi) // 2
        if len(wrap(draw, text, fnt, mid)) <= n:
            hi = mid
        else:
            lo = mid + 1
    return wrap(draw, text, fnt, hi)

fnt = ImageFont.truetype(FONT, SIZE)
probe = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
lines = balanced(probe, TEXT, fnt, 1380)
lh = int(SIZE * 1.22)
inner_w = int(max(probe.textlength(l, font=fnt) for l in lines))
pad_x, pad_y = 90, 52
pw, ph = inner_w + 2 * pad_x, len(lines) * lh + 2 * pad_y
margin = 90
px = (W - pw) // 2
py = H - 130 - ph  # lower third: the card sits in the bottom 350 pixels, clear of the very bottom edge

def canvas():
    return Image.new("RGBA", (pw + 2 * margin, ph + 2 * margin), (0, 0, 0, 0))

panel = canvas()
shadow = canvas()
ImageDraw.Draw(shadow).rounded_rectangle([margin, margin + 14, margin + pw, margin + 14 + ph], radius=34, fill=(0, 0, 0, 90))
panel = Image.alpha_composite(panel, shadow.filter(ImageFilter.GaussianBlur(26)))
ImageDraw.Draw(panel).rounded_rectangle([margin, margin, margin + pw, margin + ph], radius=34, fill=(8, 12, 28, 140), outline=GOLD + (140,), width=2)
# A short gold bar on the left edge ties it to the other overlays.
ImageDraw.Draw(panel).rounded_rectangle([margin + 34, margin + pad_y - 6, margin + 40, margin + ph - pad_y + 6], radius=3, fill=GOLD + (255,))
text_layer = canvas()
d = ImageDraw.Draw(text_layer)
y = margin + pad_y - 8
for l in lines:
    w = d.textlength(l, font=fnt)
    d.text((margin + (pw - w) / 2, y), l, font=fnt, fill=WHITE + (255,))
    y += lh

def frame_at(t):
    f = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    e = ease(t / 0.8)
    et = ease((t - 0.3) / 0.7)
    if e <= 0:
        return f
    rise = int((1 - e) * 70)  # eases up from below
    f.alpha_composite(scaled(panel, e), (px - margin, py - margin + rise))
    if et > 0:
        f.alpha_composite(scaled(text_layer, et), (px - margin, py - margin + int((1 - et) * 40)))
    return f

os.makedirs(OUT, exist_ok=True)
tmp = tempfile.mkdtemp(prefix="lower-")
intro = int(1.4 * FPS)
for i in range(intro):
    frame_at(i / FPS).save(os.path.join(tmp, f"f{i:03d}.png"))
out = os.path.join(OUT, "overlay-lower-third-overwhelmed-question.mov")
subprocess.run([
    "ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", os.path.join(tmp, "f%03d.png"),
    "-vf", f"tpad=stop_mode=clone:stop_duration={SECONDS - intro / FPS:.3f},format=yuva444p10le",
    "-frames:v", str(FPS * SECONDS), "-c:v", "prores_ks", "-profile:v", "4444", "-qscale:v", "12",
    "-pix_fmt", "yuva444p10le", "-r", str(FPS), out,
], check=True)
still = Image.new("RGBA", (W, H), (40, 52, 84, 255))
still.alpha_composite(Image.open(os.path.join(tmp, f"f{intro - 1:03d}.png")))
still.convert("RGB").save(os.path.join(OUT, "preview-lower-third-overwhelmed-question.jpg"), quality=88)
shutil.rmtree(tmp)
print(out)
