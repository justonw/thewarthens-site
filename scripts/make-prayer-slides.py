#!/usr/bin/env python3
"""Builds the prayer video slides (full-screen 1920x1080 images) and the matching data file for the
Present but Missing page, from one list of verses (KJV, public domain).

  python3 scripts/make-prayer-slides.py

Writes docs/prayer-slides/slide-01.png ... , docs/prayer-slides/slides.txt, and src/lib/present-missing-prayer.ts.
Edit the SLIDES list below to change the words, then run it again. No em dashes.
"""
import json, os, textwrap
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "prayer-slides")

# (reference, KJV words, short note under it)
SLIDES = [
    ("The place of prayer", [
        ("Psalm 95:6", "O come, let us worship and bow down: let us kneel before the LORD our maker.", "Kneeling is the body saying what the heart means: I belong to You, Lord."),
        ("Daniel 6:10", "...he kneeled upon his knees three times a day, and prayed, and gave thanks before his God, as he did aforetime.", "The king's decree was signed, and Daniel still went to his place of prayer, as he always had."),
        ("Luke 22:41-42", "...and kneeled down, and prayed, Saying, Father, if thou be willing, remove this cup from me: nevertheless not my will, but thine, be done.", "Jesus knelt in the garden before He stood before Pilate."),
    ]),
    ("The fear of man", [
        ("Proverbs 29:25", "The fear of man bringeth a snare: but whoso putteth his trust in the LORD shall be safe.", "Fearing people sets a trap for you. Trusting the LORD keeps you safe."),
        ("Proverbs 29:26", "Many seek the ruler's favour; but every man's judgment cometh from the LORD.", "People chase the ruler's favor, but the final verdict belongs to the LORD."),
        ("Isaiah 51:12", "I, even I, am he that comforteth you: who art thou, that thou shouldest be afraid of a man that shall die, and of the son of man which shall be made as grass;", "God asks: why fear someone who will pass away, when I am the One who comforts you?"),
    ]),
    ("Who we answer to", [
        ("Galatians 1:10", "For do I now persuade men, or God? or do I seek to please men? for if I yet pleased men, I should not be the servant of Christ.", "Paul asks: am I living for people's approval, or for God's?"),
        ("Acts 4:19", "...Whether it be right in the sight of God to hearken unto you more than unto God, judge ye.", "Peter and John were told to stop speaking about Jesus, and they let God be the judge."),
        ("Acts 5:29", "...We ought to obey God rather than men.", "Told again, the apostles gave the same answer."),
    ]),
    ("Standing before kings", [
        ("Daniel 3:17-18", "If it be so, our God whom we serve is able to deliver us from the burning fiery furnace, and he will deliver us out of thine hand, O king. But if not, be it known unto thee, O king, that we will not serve thy gods, nor worship the golden image which thou hast set up.", "Shadrach, Meshach, and Abednego: God is able to rescue us, and even if He does not, we will not bow."),
        ("Daniel 4:35", "...he doeth according to his will in the army of heaven, and among the inhabitants of the earth: and none can stay his hand, or say unto him, What doest thou?", "A king learned that God rules over kings."),
        ("Daniel 5:17", "Then Daniel answered and said before the king, Let thy gifts be to thyself, and give thy rewards to another; yet I will read the writing unto the king...", "Daniel stood before Belshazzar and told him the truth, without needing his gifts."),
    ]),
    ("Before they stood", [
        ("Esther 4:16", "Go, gather together all the Jews that are present in Shushan, and fast ye for me, and neither eat nor drink three days, night or day: I also and my maidens will fast likewise; and so will I go in unto the king, which is not according to the law: and if I perish, I perish.", "Before Esther went in to the king, she called for three days of fasting."),
        ("Esther 5:1", "Now it came to pass on the third day, that Esther put on her royal apparel, and stood in the inner court of the king's house...", "On the third day she stood before the king, after three days of fasting."),
        ("2 Kings 19:14", "And Hezekiah received the letter of the hand of the messengers, and read it: and Hezekiah went up into the house of the LORD, and spread it before the LORD.", "Hezekiah took a threatening letter to the house of the LORD and spread it out before Him."),
    ]),
    ("Praying for boldness", [
        ("Acts 4:29", "And now, Lord, behold their threatenings: and grant unto thy servants, that with all boldness they may speak thy word,", "Peter and John were held overnight and warned. The church prayed for boldness, not for the threats to end."),
        ("Acts 4:31", "And when they had prayed, the place was shaken where they were assembled together; and they were all filled with the Holy Ghost, and they spake the word of God with boldness.", "After they prayed, the place shook, and they spoke God's word with boldness."),
        ("Acts 4:13", "Now when they saw the boldness of Peter and John, and perceived that they were unlearned and ignorant men, they marvelled; and they took knowledge of them, that they had been with Jesus.", "People saw their boldness and knew they had been with Jesus."),
    ]),
    ("Standing with boldness", [
        ("Galatians 2:11", "But when Peter was come to Antioch, I withstood him to the face, because he was to be blamed.", "Paul stood face to face with Peter and told him the truth."),
        ("Ephesians 6:19-20", "And for me, that utterance may be given unto me, that I may open my mouth boldly, to make known the mystery of the gospel, For which I am an ambassador in bonds: that therein I may speak boldly, as I ought to speak.", "Paul asked for prayer so he could speak boldly, even in chains."),
    ]),
    ("Confidence before God", [
        ("Hebrews 4:16", "Let us therefore come boldly unto the throne of grace, that we may obtain mercy, and find grace to help in time of need.", "We can come to God's throne boldly, because of grace."),
        ("Psalm 118:6", "The LORD is on my side; I will not fear: what can man do unto me?", "When the LORD is on your side, you do not have to fear what people can do."),
        ("Proverbs 28:1", "The wicked flee when no man pursueth: but the righteous are bold as a lion.", "Those who live right before God can be bold as a lion."),
    ]),
]
CLOSING = "I kneel before God, so I can stand before men."
CLOSING_LINES = ["I kneel before God,", "so I can stand before men."]

W, H = 1920, 1080
BG_TOP, BG_BOT = (10, 14, 30), (22, 20, 46)
TEXT = (244, 242, 236)
GOLD = (222, 184, 112)
MUTED = (178, 184, 204)
FONT_DIR = "/System/Library/Fonts/Supplemental/"
SERIF = FONT_DIR + "Georgia.ttf"
SERIF_I = FONT_DIR + "Georgia Italic.ttf"
SERIF_B = FONT_DIR + "Georgia Bold.ttf"
SANS = "/System/Library/Fonts/HelveticaNeue.ttc"

def font(path, size, index=0):
    return ImageFont.truetype(path, size, index=index)

def background():
    img = Image.new("RGB", (W, H), BG_TOP)
    d = ImageDraw.Draw(img)
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)], fill=tuple(int(BG_TOP[i] + (BG_BOT[i] - BG_TOP[i]) * t) for i in range(3)))
    return img

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

def layout(draw, blocks, size, width):
    """Returns (total height, per-block lines) for a font scale."""
    verse_f, ref_f, note_f = font(SERIF, size), font(SANS, int(size * 0.62), index=1), font(SERIF_I, int(size * 0.72))
    out, total = [], 0
    for ref, verse, note in blocks:
        v = wrap(draw, verse, verse_f, width)
        n = wrap(draw, "(" + note + ")", note_f, width)
        h = len(v) * int(size * 1.34) + int(size * 0.32) + int(size * 0.62 * 1.3) + int(size * 0.18) + len(n) * int(size * 0.72 * 1.32)
        out.append((v, n, h))
        total += h
    total += int(size * 0.85) * (len(blocks) - 1)
    return total, out, (verse_f, ref_f, note_f)

def make_slide(n, label, blocks):
    img = background()
    d = ImageDraw.Draw(img)
    margin_x, top, bottom = 170, 150, 90
    width = W - 2 * margin_x
    avail = H - top - bottom
    size = 50
    while size > 26:
        total, parts, fonts = layout(d, blocks, size, width)
        if total <= avail:
            break
        size -= 1
    verse_f, ref_f, note_f = fonts
    # label
    d.text((margin_x, 70), label.upper(), font=font(SANS, 28, index=1), fill=GOLD, spacing=4)
    d.line([(margin_x, 118), (margin_x + 120, 118)], fill=GOLD, width=3)
    y = top + max(0, (avail - total) // 2)
    for (ref, verse, note), (v, nl, h) in zip(blocks, parts):
        for line in v:
            d.text((margin_x, y), line, font=verse_f, fill=TEXT)
            y += int(size * 1.34)
        y += int(size * 0.32)
        d.text((margin_x, y), ref.upper(), font=ref_f, fill=GOLD)
        y += int(size * 0.62 * 1.3) + int(size * 0.18)
        for line in nl:
            d.text((margin_x, y), line, font=note_f, fill=MUTED)
            y += int(size * 0.72 * 1.32)
        y += int(size * 0.85)
    img.save(os.path.join(OUT, f"slide-{n:02d}.png"), optimize=True)
    return size

def make_closing(n):
    img = background()
    d = ImageDraw.Draw(img)
    f = font(SERIF, 84)
    lines = CLOSING_LINES
    lh = 120
    y = (H - lh * len(lines)) // 2
    for line in lines:
        w = d.textlength(line, font=f)
        d.text(((W - w) / 2, y), line, font=f, fill=TEXT)
        y += lh
    d.line([(W // 2 - 70, y + 30), (W // 2 + 70, y + 30)], fill=GOLD, width=3)
    img.save(os.path.join(OUT, f"slide-{n:02d}.png"), optimize=True)

os.makedirs(OUT, exist_ok=True)
for f in os.listdir(OUT):
    if f.startswith("slide-") and f.endswith(".png"):
        os.remove(os.path.join(OUT, f))
sizes = []
for i, (label, blocks) in enumerate(SLIDES, 1):
    sizes.append(make_slide(i, label, blocks))
make_closing(len(SLIDES) + 1)
print("font sizes:", sizes)

# Plain-text copy of the slides, for Canva or another editor.
with open(os.path.join(OUT, "slides.txt"), "w") as fh:
    for i, (label, blocks) in enumerate(SLIDES, 1):
        fh.write(f"SLIDE {i}: {label}\n\n")
        for ref, verse, note in blocks:
            fh.write(f"{verse}\n{ref} (KJV)\n({note})\n\n")
        fh.write("\n")
    fh.write(f"SLIDE {len(SLIDES) + 1}\n\n{CLOSING}\n")

# The same verses for the web page, grouped into dropdowns (slides 6 and 7 share one).
groups = [(SLIDES[i][0], SLIDES[i][1]) for i in range(len(SLIDES))]
merged = []
for label, blocks in groups:
    if label == "Standing with boldness" and merged and merged[-1][0] == "Praying for boldness":
        merged[-1] = ("Praying for boldness", merged[-1][1] + blocks)
    else:
        merged.append((label, blocks))
ts = ['// Scripture for the place of prayer on the Present but Missing page (kneeling before God so a man can stand before people).',
      '// Generated by scripts/make-prayer-slides.py from the same list as the prayer video slides. KJV (public domain).',
      '',
      'export type PrayerVerse = { ref: string; text: string; note: string };',
      'export type PrayerGroup = { heading: string; verses: PrayerVerse[] };',
      '',
      'export const prayerScripture: PrayerGroup[] = ' + json.dumps([{ "heading": l, "verses": [{ "ref": r, "text": v, "note": n } for r, v, n in b] } for l, b in merged], indent=2, ensure_ascii=False) + ';',
      '']
with open(os.path.join(ROOT, "src", "lib", "present-missing-prayer.ts"), "w") as fh:
    fh.write("\n".join(ts))
print("slides:", len(SLIDES) + 1, "dropdowns:", len(merged))
