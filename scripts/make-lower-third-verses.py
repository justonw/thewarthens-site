#!/usr/bin/env python3
"""Builds transparent lower-third Scripture overlays (ProRes 4444 with alpha), 8 seconds each. Each one eases up onto the
screen and stays until the end. Nothing moves off.

  python3 scripts/make-lower-third-verses.py [name ...]

Writes docs/video-overlays/overlay-lower-third-<name>.mov and a preview image for each. No em dashes.
"""
import os, shutil, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "video-overlays")
W, H, FPS, SECONDS = 1920, 1080, 30, 8
VERSES = [
    ("ephesians-6-4", "“Fathers, do not provoke your children to anger, but bring them up in the discipline and instruction of the Lord.”", "Ephesians 6:4"),
    ("colossians-3-21", "“Fathers, do not antagonize your children, so that they will not become discouraged.”", "Colossians 3:21"),
    ("psalm-119-99", "“I have more insight than all my teachers, For Your testimonies are my meditation.”", "Psalm 119:99"),
    ("1-john-2-20-21", "“But you have an anointing from the Holy One, and you all know. I have not written to you because you do not know the truth, but because you do know it, and because no lie is of the truth.”", "1 John 2:20-21"),
]
GOLD = (222, 184, 112)
WHITE = (248, 247, 242)
GEORGIA, GEORGIA_B = "/System/Library/Fonts/Supplemental/Georgia.ttf", "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
HELV = "/System/Library/Fonts/HelveticaNeue.ttc"
SIZE = 56

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

def render(name, verse, ref):
    ref_f = ImageFont.truetype(HELV, 30, index=1)
    probe = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    pad_x, pad_top, pad_bottom, gap = 100, 50, 46, 22
    # A long verse gets a slightly smaller type size and a wider card, so the whole card stays in the bottom third.
    size = SIZE
    while True:
        fnt = ImageFont.truetype(GEORGIA, size)
        lines = balanced(probe, verse, fnt, 1380 if size == SIZE else 1480)
        lh = int(size * 1.3)
        ph = pad_top + len(lines) * lh + gap + 34 + pad_bottom
        if ph <= 372 or size <= 38:
            break
        size -= 2
    inner_w = int(max(probe.textlength(l, font=fnt) for l in lines))
    pw = inner_w + 2 * pad_x
    margin = 90
    px, py = (W - pw) // 2, H - 110 - ph

    def canvas():
        return Image.new("RGBA", (pw + 2 * margin, ph + 2 * margin), (0, 0, 0, 0))

    panel = canvas()
    shadow = canvas()
    ImageDraw.Draw(shadow).rounded_rectangle([margin, margin + 14, margin + pw, margin + 14 + ph], radius=34, fill=(0, 0, 0, 90))
    panel = Image.alpha_composite(panel, shadow.filter(ImageFilter.GaussianBlur(26)))
    ImageDraw.Draw(panel).rounded_rectangle([margin, margin, margin + pw, margin + ph], radius=34, fill=(8, 12, 28, 140), outline=GOLD + (140,), width=2)
    verse_layer = canvas()
    d = ImageDraw.Draw(verse_layer)
    y = margin + pad_top - 6
    for l in lines:
        w = d.textlength(l, font=fnt)
        d.text((margin + (pw - w) / 2, y), l, font=fnt, fill=WHITE + (255,))
        y += lh
    ref_layer = canvas()
    d = ImageDraw.Draw(ref_layer)
    text = ref.upper()
    w = d.textlength(text, font=ref_f)
    d.text((margin + (pw - w) / 2, y + gap - 6), text, font=ref_f, fill=GOLD + (255,))

    def frame_at(t):
        f = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        e = ease(t / 0.8)
        if e <= 0:
            return f
        rise = int((1 - e) * 70)
        f.alpha_composite(scaled(panel, e), (px - margin, py - margin + rise))
        for layer, start in ((verse_layer, 0.3), (ref_layer, 0.7)):
            et = ease((t - start) / 0.7)
            if et > 0:
                f.alpha_composite(scaled(layer, et), (px - margin, py - margin + int((1 - et) * 40)))
        return f

    tmp = tempfile.mkdtemp(prefix="verse-")
    intro = int(1.6 * FPS)
    for i in range(intro):
        frame_at(i / FPS).save(os.path.join(tmp, f"f{i:03d}.png"))
    out = os.path.join(OUT, f"overlay-lower-third-{name}.mov")
    subprocess.run([
        "ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", os.path.join(tmp, "f%03d.png"),
        "-vf", f"tpad=stop_mode=clone:stop_duration={SECONDS - intro / FPS:.3f},format=yuva444p10le",
        "-frames:v", str(FPS * SECONDS), "-c:v", "prores_ks", "-profile:v", "4444", "-qscale:v", "12",
        "-pix_fmt", "yuva444p10le", "-r", str(FPS), out,
    ], check=True)
    still = Image.new("RGBA", (W, H), (40, 52, 84, 255))
    still.alpha_composite(Image.open(os.path.join(tmp, f"f{intro - 1:03d}.png")))
    still.convert("RGB").save(os.path.join(OUT, f"preview-lower-third-{name}.jpg"), quality=88)
    shutil.rmtree(tmp)
    return out

os.makedirs(OUT, exist_ok=True)
import sys
wanted = sys.argv[1:]  # optional: only build the ones named, for example: 1-john-2-20-21
for name, verse, ref in VERSES:
    if not wanted or name in wanted:
        print(render(name, verse, ref))
