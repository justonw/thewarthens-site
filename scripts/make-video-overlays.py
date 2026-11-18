#!/usr/bin/env python3
"""Builds transparent center-screen text overlays as video files (ProRes 4444 with an alpha channel), 11 seconds each.
Each one eases onto the screen and then stays until the end. Nothing moves off. Drop them on a track above your video.

  python3 scripts/make-video-overlays.py

Writes docs/video-overlays/*.mov. Edit the CARDS list to change the words. No em dashes.
"""
import os, shutil, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "video-overlays")
W, H, FPS, SECONDS = 1920, 1080, 30, 11

# (file name, big line, supporting line)
CARDS = [
    ("01-overwhelmed", "You feel overwhelmed.", "Learn to lead through pressure without shutting down or blowing up."),
    ("02-husband-father", "You’re a husband or father.", "Engage your wife’s and children’s hearts, not just their needs."),
    ("03-quiet-in-church", "You’ve sat quiet in church.", "Test teaching against Scripture, because your allegiance is to God, not man."),
    ("04-taken-advantage-of", "You’ve watched people get taken advantage of.", "Your silence gives lies a voice. Your “presence” can stop them."),
    ("05-truth", "Truth.", "What God’s Word says about a man’s role and responsibility."),
    ("06-action", "Action.", "Practical steps to take home, to work, and to church."),
    ("07-prayer", "Prayer.", "Kneeling before God so you can stand before men."),
]

GOLD = (222, 184, 112)
WHITE = (246, 244, 238)
SOFT = (214, 218, 232)
FONT_DIR = "/System/Library/Fonts/Supplemental/"
BOLD, REG = FONT_DIR + "Georgia Bold.ttf", FONT_DIR + "Georgia.ttf"

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
    """Wraps to the fewest lines, then narrows the line width as far as it can so no line is left with one lonely word."""
    n = len(wrap(draw, text, fnt, width))
    lo, hi = 200, width
    while lo < hi:
        mid = (lo + hi) // 2
        if len(wrap(draw, text, fnt, mid)) <= n:
            hi = mid
        else:
            lo = mid + 1
    return wrap(draw, text, fnt, hi)

def ease(t):  # ease-out cubic, 0..1
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3

def build_card(big, small):
    scratch = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    short = len(big) <= 12
    big_f = ImageFont.truetype(BOLD, 128 if short else 84)
    small_f = ImageFont.truetype(REG, 54)
    inner = 1180
    big_lines = balanced(scratch, big, big_f, inner)
    small_lines = balanced(scratch, small, small_f, inner)
    big_lh, small_lh = int(big_f.size * 1.18), int(small_f.size * 1.36)
    pad_x, pad_top, pad_bottom = 100, 78, 74
    bar_h, gap1, gap2 = 5, 34, 30
    content_h = bar_h + gap1 + len(big_lines) * big_lh + gap2 + len(small_lines) * small_lh
    pw, ph = inner + 2 * pad_x, content_h + pad_top + pad_bottom
    px, py = (W - pw) // 2, (H - ph) // 2

    # Panel with a soft shadow, a translucent dark fill, and a thin gold edge.
    panel = Image.new("RGBA", (pw + 160, ph + 160), (0, 0, 0, 0))
    shadow = Image.new("RGBA", panel.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle([80, 100, 80 + pw, 100 + ph], radius=38, fill=(0, 0, 0, 90))
    panel = Image.alpha_composite(panel, shadow.filter(ImageFilter.GaussianBlur(30)))
    ImageDraw.Draw(panel).rounded_rectangle([80, 80, 80 + pw, 80 + ph], radius=38, fill=(8, 12, 28, 140), outline=GOLD + (140,), width=2)
    panel_pos = (px - 80, py - 80)

    def text_layer(lines, fnt, lh, color, top):
        layer = Image.new("RGBA", panel.size, (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        y = top
        for line in lines:
            w = d.textlength(line, font=fnt)
            d.text(((panel.size[0] - w) / 2, y), line, font=fnt, fill=color + (255,))
            y += lh
        return layer

    base = 80 + pad_top
    bar = Image.new("RGBA", panel.size, (0, 0, 0, 0))
    ImageDraw.Draw(bar).rounded_rectangle([(panel.size[0] - 90) // 2, base, (panel.size[0] + 90) // 2, base + bar_h], radius=2, fill=GOLD + (255,))
    head = text_layer(big_lines, big_f, big_lh, WHITE, base + bar_h + gap1)
    body = text_layer(small_lines, small_f, small_lh, SOFT, base + bar_h + gap1 + len(big_lines) * big_lh + gap2)
    return panel, [bar, head, body], panel_pos

def scaled(layer, a):
    r, g, b, al = layer.split()
    return Image.merge("RGBA", (r, g, b, al.point(lambda v: int(v * a))))

def render(name, big, small):
    panel, layers, pos = build_card(big, small)
    tmp = tempfile.mkdtemp(prefix="overlay-")
    intro = int(1.6 * FPS)
    # (start, length) in seconds for the panel, the bar and big line, and the supporting line.
    timings = [(0.0, 0.8), (0.2, 0.7), (0.55, 0.7)]
    for f in range(intro):
        t = f / FPS
        frame = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        for layer, (start, length) in zip([panel] + layers, [timings[0], timings[1], timings[1], timings[2]]):
            e = ease((t - start) / length)
            if e <= 0:
                continue
            rise = int((1 - e) * 46)
            frame.alpha_composite(scaled(layer, e), (pos[0], pos[1] + rise))
        frame.save(os.path.join(tmp, f"f{f:03d}.png"))
    out = os.path.join(OUT, f"overlay-{name}.mov")
    hold = SECONDS - intro / FPS
    subprocess.run([
        "ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", os.path.join(tmp, "f%03d.png"),
        "-vf", f"tpad=stop_mode=clone:stop_duration={hold:.3f},format=yuva444p10le",
        "-frames:v", str(FPS * SECONDS), "-c:v", "prores_ks", "-profile:v", "4444", "-qscale:v", "12",
        "-pix_fmt", "yuva444p10le", "-r", str(FPS), out,
    ], check=True)
    # A still of the finished card on a plain background, for a quick look.
    still = Image.new("RGBA", (W, H), (40, 52, 84, 255))
    last = Image.open(os.path.join(tmp, f"f{intro - 1:03d}.png"))
    still.alpha_composite(last)
    still.convert("RGB").save(os.path.join(OUT, f"preview-{name}.jpg"), quality=88)
    shutil.rmtree(tmp)
    return out

os.makedirs(OUT, exist_ok=True)
for name, big, small in CARDS:
    print(render(name, big, small))
