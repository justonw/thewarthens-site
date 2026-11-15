#!/usr/bin/env python3
"""Rebuilds public/downloads/career-changer-starter-kit.pdf (the emailed "Resume & LinkedIn Checklist").

Keep the checklist text in step with src/lib/starter-checklist.ts, which feeds the interactive checklist
on /tech. Run:  python3 scripts/make-starter-kit.py   (needs reportlab: pip install reportlab)
No em dashes anywhere, on purpose.
"""
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.units import inch
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, KeepTogether

OUT = "public/downloads/career-changer-starter-kit.pdf"
BLUE = HexColor("#2563eb")
INK = HexColor("#111111")
GREY = HexColor("#5b6275")

registerFontFamily("Helvetica", normal="Helvetica", bold="Helvetica-Bold", italic="Helvetica-Oblique", boldItalic="Helvetica-BoldOblique")

eyebrow = ParagraphStyle("eyebrow", fontName="Helvetica", fontSize=8.5, leading=12, textColor=BLUE, spaceAfter=6)
title = ParagraphStyle("title", fontName="Helvetica", fontSize=30, leading=34, textColor=INK, spaceAfter=6)
dek = ParagraphStyle("dek", fontName="Helvetica", fontSize=11.5, leading=15, textColor=GREY, spaceAfter=12)
h2 = ParagraphStyle("h2", fontName="Helvetica", fontSize=15, leading=19, textColor=INK, spaceBefore=14, spaceAfter=5, keepWithNext=1)
body = ParagraphStyle("body", fontName="Helvetica", fontSize=10.5, leading=14.5, textColor=INK, spaceAfter=4)
note = ParagraphStyle("note", fontName="Helvetica", fontSize=9, leading=12.5, textColor=GREY, spaceAfter=8)
note_k = ParagraphStyle("note_k", parent=note, keepWithNext=1)
item = ParagraphStyle("item", fontName="Helvetica", fontSize=10.5, leading=14, textColor=INK, leftIndent=24, firstLineIndent=-24, spaceBefore=7)
why = ParagraphStyle("why", fontName="Helvetica-Oblique", fontSize=8.5, leading=12, textColor=GREY, leftIndent=24, spaceBefore=2)
cta = ParagraphStyle("cta", fontName="Helvetica-Bold", fontSize=8.5, leading=12, textColor=BLUE, leftIndent=24, spaceBefore=2)
bullet = ParagraphStyle("bullet", parent=body, leftIndent=12, firstLineIndent=-12, spaceAfter=8)
foot = ParagraphStyle("foot", fontName="Helvetica", fontSize=8, leading=11, textColor=GREY, alignment=1)

RESUME = [
    ("Use the exact job title from the posting somewhere in your resume.", "Resumes containing the exact title get 10.6× more interview invitations than resumes that don’t.", None),
    ("Mirror the specific posting’s language, not a generic keyword list.", "There’s no universal keyword set. Read each posting and match its real wording where your experience genuinely applies.", None),
    ("Keep formatting simple: single column, standard fonts, no tables, icons, or graphics.", "ATS software scans like a machine, not a designer. Fancy layouts get misread or dropped entirely.", None),
    ("Put a skills section near the top of the page.", "76.4% of recruiters start filtering candidates by skills first, before work history or education.", None),
    ("Use a reverse-chronological or combination format, not a skills-only layout.", "Functional-only resumes are the format ATS is most likely to mis-parse, and recruiters trust them the least.", None),
    ("Don’t worry about hitting exactly one page.", "ATS parsers don’t penalize length. The one-page rule is a human-reader preference, not a screening rule.", None),
    ("Open with a short summary that names the role you want.", "It’s the first thing a recruiter and the scanner read. In 3 sentences or fewer, say who you are, your proof, and the role you’re after. Skip “I don’t have direct experience, but…” and lead with the value you bring.", None),
    ("Start each bullet with a verb and end it with a result.", "Bullets that say what you did and what changed read stronger than a list of duties. Only use numbers you can back up.", None),
    ("Use ChatGPT or Claude to help tailor your resume language to each posting.", "This is now standard competitive practice in 2026, not a shortcut to be embarrassed about.", "Or let our free tool do it for you: thewarthens.com/tech/resume"),
]
LINKEDIN = [
    ("Add a professional photo.", "Profiles with a photo get 21× more views and 9× more connection requests."),
    ("Write your headline around your target role, not your current job title.", "Recruiters search headlines by keyword. A headline stuck on your old title makes you invisible to new-field searches."),
    ("Make your About section hook someone in the first 2–4 lines.", "That’s all that shows before “see more” truncates it. Lead with what you do, who for, then 3–5 concrete wins."),
    ("List 30–50 skills, and pin your top 3 to the role you want.", "Profiles listing 5+ skills are 27× more discoverable in recruiter search."),
    ("Turn on “Open to Work.”", "It costs nothing and puts you in front of recruiters actively searching that setting."),
    ("Customize your profile URL.", "Small detail, but it reads as intentional, and it’s easier to put on a resume or business card."),
    ("Comment and share inside your target industry before you’re even applying.", "Visibility compounds. Showing up in a field’s conversation is part of how you get read as already belonging there."),
]

def checkbox(text):
    return Paragraph(f'<font color="#2563eb">[&nbsp;&nbsp;]</font>&nbsp;&nbsp;{text}', item)

story = [
    Paragraph("THE WARTHENS · TECH JOURNEY", eyebrow),
    Paragraph("Beat the AI Resume Scan", title),
    Paragraph("A resume &amp; LinkedIn checklist built from real 2026 hiring data, for people navigating AI-driven screening, not generic advice recycled from 2015.", dek),
    HRFlowable(width="100%", thickness=0.6, color=HexColor("#cfd3dc"), spaceAfter=4),
    Paragraph("Before you touch your resume", h2),
    Paragraph("Most career-changer resumes apologize: “I don’t have direct experience, but…” That framing tells a hiring manager you’re focused on what you lack. Lead with the value you bring instead. The perspective you carry in from another field is something no one already inside the industry can offer. Treat it as an asset on the page, not a gap you owe an explanation for.", body),
    Paragraph("Resume Checklist for 2026’s AI Screening", h2),
    Paragraph("98.8% of Fortune 500 companies and 80% of mid-size employers now run resumes through an ATS before a human ever sees them, and a growing number add an LLM layer on top that reads and scores your resume against the job description. Here’s what actually moves the needle.", note),
]
for text, reason, link in RESUME:
    parts = [checkbox(text), Paragraph(reason, why)]
    if link:
        parts.append(Paragraph(f'<link href="https://thewarthens.com/tech/resume" color="#2563eb">{link}</link>', cta))
    story.append(KeepTogether(parts))

story += [
    Paragraph("LinkedIn Checklist", h2),
    Paragraph("Complete profiles generate 71% higher interview rates. Recruiters are looking here before, sometimes instead of, your resume.", note_k),
]
for text, reason in LINKEDIN:
    story.append(KeepTogether([checkbox(text), Paragraph(reason, why)]))

story += [
    Paragraph("How to Talk About Your Career Change", h2),
    Paragraph("•&nbsp;&nbsp;<b>Don’t open with a disclaimer.</b> Skip “I don’t have direct experience, but…” entirely. It primes the reader to see a gap before they see you.", bullet),
    Paragraph("•&nbsp;&nbsp;<b>Translate, don’t discard.</b> You already have real skills built in your current field. Your job is translating them into your new field’s language, not starting from zero.", bullet),
    Paragraph("•&nbsp;&nbsp;<b>Sell the outside perspective.</b> What you noticed from outside the industry is something no insider can replicate. That’s a genuine edge, not a consolation prize.", bullet),
    Spacer(1, 6),
    HRFlowable(width="100%", thickness=0.6, color=HexColor("#cfd3dc"), spaceAfter=6),
    Paragraph('Not sure which field even fits? Take the free 2-minute career-path quiz and see real, sourced 2026 entry-level pay for 9 different paths at <link href="https://thewarthens.com/tech" color="#2563eb">thewarthens.com/tech</link>. Ready to apply? <link href="https://thewarthens.com/tech/resume" color="#2563eb">thewarthens.com/tech/resume</link> tailors your resume to a job posting for free.', note),
    HRFlowable(width="100%", thickness=0.6, color=HexColor("#cfd3dc"), spaceAfter=6),
    Paragraph("Sources: Jobscan ATS usage data, Merit America, Resume.io, Kickresume, CareerEnlightenment, Simplify Jobs LinkedIn optimization research, all 2026-dated. © The Warthens · thewarthens.com", foot),
]

doc = SimpleDocTemplate(OUT, pagesize=letter, leftMargin=0.9 * inch, rightMargin=0.9 * inch, topMargin=0.8 * inch, bottomMargin=0.8 * inch,
                        title="Beat the AI Resume Scan: Resume & LinkedIn Checklist", author="The Warthens")
doc.build(story)
print("wrote", OUT)
