#!/usr/bin/env python3
"""Builds a transparent upper-third graphic (ProRes 4444 with alpha) that shows thewarthens.com/present, with a yellow
highlight that sweeps across "present". It eases onto the screen and stays until the end. Nothing moves off.

  python3 scripts/make-present-upper-third.py

Writes docs/video-overlays/overlay-present-upper-third.mov and a preview image. No em dashes.
"""
import os, shutil, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "video-overlays")
W, H, FPS, SECONDS = 1920, 1080, 30, 10
LEFT, RIGHT = "thewarthens.com/", "present"
YELLOW = (255, 214, 10)
INK = (22, 22, 34)
WHITE = (248, 247, 242)
GOLD = (222, 184, 112)
FONT = "/System/Library/Fonts/HelveticaNeue.ttc"
SIZE = 96

def ease(t):
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3

def scaled(layer, a):
    r, g, b, al = layer.split()
    return Image.merge("RGBA", (r, g, b, al.point(lambda v: int(v * a))))

reg = ImageFont.truetype(FONT, SIZE, index=0)
bold = ImageFont.truetype(FONT, SIZE, index=1)
probe = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
lw, rw = probe.textlength(LEFT, font=reg), probe.textlength(RIGHT, font=bold)
pad_x, pad_y = 70, 46
text_h = int(SIZE * 1.15)
pw, ph = int(lw + rw) + 2 * pad_x, text_h + 2 * pad_y
px, py = (W - pw) // 2, 150  # upper third: the panel sits in the top 350 pixels
margin = 90

def canvas():
    return Image.new("RGBA", (pw + 2 * margin, ph + 2 * margin), (0, 0, 0, 0))

# Panel: soft shadow, translucent dark fill, thin gold edge.
panel = canvas()
shadow = canvas()
ImageDraw.Draw(shadow).rounded_rectangle([margin, margin + 14, margin + pw, margin + 14 + ph], radius=30, fill=(0, 0, 0, 90))
panel = Image.alpha_composite(panel, shadow.filter(ImageFilter.GaussianBlur(24)))
ImageDraw.Draw(panel).rounded_rectangle([margin, margin, margin + pw, margin + ph], radius=30, fill=(8, 12, 28, 150), outline=GOLD + (140,), width=2)

tx, ty = margin + pad_x, margin + pad_y - 8
left_layer = canvas()
ImageDraw.Draw(left_layer).text((tx, ty), LEFT, font=reg, fill=WHITE + (255,))
rx = tx + lw
# The highlight rectangle sits behind "present".
hl_pad = 16
hl_box = (rx + 2, margin + pad_y - 2, rx + rw + hl_pad, margin + pad_y + text_h - 4)
white_present = canvas()
ImageDraw.Draw(white_present).text((rx, ty), RIGHT, font=bold, fill=WHITE + (255,))
ink_present = canvas()
ImageDraw.Draw(ink_present).text((rx, ty), RIGHT, font=bold, fill=INK + (255,))

def frame_at(t):
    f = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    # 1) the panel slides down from above and fades in
    e = ease(t / 0.8)
    comp = panel.copy()
    if e > 0:
        comp = scaled(comp, e)
    else:
        return f
    # 2) the web address fades in
    ea = ease((t - 0.45) / 0.6)
    layers = [comp, scaled(left_layer, ea), scaled(white_present, ea)]
    # 3) the yellow highlight sweeps left to right behind "present", and the word turns dark as it passes
    sweep = ease((t - 1.15) / 0.75)
    if sweep > 0:
        x0, y0, x1, y1 = hl_box
        edge = x0 + (x1 - x0) * sweep
        hl = canvas()
        ImageDraw.Draw(hl).rounded_rectangle([x0, y0, edge, y1], radius=10, fill=YELLOW + (255,))
        mask = Image.new("L", hl.size, 0)
        ImageDraw.Draw(mask).rectangle([0, 0, edge, hl.size[1]], fill=255)
        dark = Image.composite(ink_present, canvas(), mask)
        layers = [comp, scaled(left_layer, ea), hl, white_present, dark]
        # white text only where the highlight has not reached yet
        keep = Image.new("L", hl.size, 0)
        ImageDraw.Draw(keep).rectangle([edge, 0, hl.size[0], hl.size[1]], fill=255)
        white_rest = white_present.copy()
        white_rest.putalpha(ImageChops.multiply(white_present.getchannel("A"), keep))
        layers = [comp, scaled(left_layer, ea), hl, white_rest, dark]
    rise = int((1 - e) * -60)
    for layer in layers:
        f.alpha_composite(layer, (px - margin, py - margin + rise))
    return f

os.makedirs(OUT, exist_ok=True)
tmp = tempfile.mkdtemp(prefix="present-")
intro = int(2.2 * FPS)
for i in range(intro):
    frame_at(i / FPS).save(os.path.join(tmp, f"f{i:03d}.png"))
out = os.path.join(OUT, "overlay-present-upper-third.mov")
hold = SECONDS - intro / FPS
subprocess.run([
    "ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", os.path.join(tmp, "f%03d.png"),
    "-vf", f"tpad=stop_mode=clone:stop_duration={hold:.3f},format=yuva444p10le",
    "-frames:v", str(FPS * SECONDS), "-c:v", "prores_ks", "-profile:v", "4444", "-qscale:v", "12",
    "-pix_fmt", "yuva444p10le", "-r", str(FPS), out,
], check=True)
for name, idx in (("a", 16), ("b", 40), ("c", intro - 1)):
    still = Image.new("RGBA", (W, H), (40, 52, 84, 255))
    still.alpha_composite(Image.open(os.path.join(tmp, f"f{idx:03d}.png")))
    still.convert("RGB").save(os.path.join(OUT, f"preview-present-upper-third-{name}.jpg"), quality=88)
shutil.rmtree(tmp)
print(out)
