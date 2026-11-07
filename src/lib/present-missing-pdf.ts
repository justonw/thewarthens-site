import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import {
  LESSON_LABEL,
  LESSON_SUBTITLE,
  LESSON_TITLE,
  actionFor,
  contexts,
  explanation,
  morePresent,
  synopsis,
  versionNotice,
  type Verse,
} from "./present-missing";

// Builds the PDF a man receives by email: the session notes plus what he wrote in each box.
// Nothing is saved. The standard PDF fonts only know basic Western characters, so anything a
// person types that they cannot show (emoji, for example) is swapped for a question mark.

const PAGE = { w: 612, h: 792 };
const MARGIN = 54;
const MAUVE = rgb(0.1, 0.22, 0.5);
const INK = rgb(0.13, 0.13, 0.16);
const MUTED = rgb(0.4, 0.4, 0.45);
const ANSWER = rgb(0.05, 0.38, 0.32);

export async function buildLessonPdf(answers: Record<string, string>) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${LESSON_TITLE}: ${LESSON_SUBTITLE}`);
  pdf.setAuthor("The Warthens");
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const supported = new Set(regular.getCharacterSet());

  const clean = (text: string) =>
    Array.from(text.replace(/\r/g, ""))
      .map((ch) => {
        if (ch === "\n" || ch === "\t") return ch === "\t" ? "  " : ch;
        const code = ch.codePointAt(0) ?? 0;
        if (code < 32) return "";
        return supported.has(code) ? ch : "?";
      })
      .join("");

  let page: PDFPage = pdf.addPage([PAGE.w, PAGE.h]);
  let y = PAGE.h - MARGIN;
  const width = PAGE.w - MARGIN * 2;

  const newPage = () => {
    page = pdf.addPage([PAGE.w, PAGE.h]);
    y = PAGE.h - MARGIN;
  };
  const room = (needed: number) => {
    if (y - needed < MARGIN + 18) newPage();
  };

  const wrap = (text: string, font: PDFFont, size: number, maxWidth: number) => {
    const lines: string[] = [];
    for (const paragraph of clean(text).split("\n")) {
      if (paragraph.trim() === "") {
        lines.push("");
        continue;
      }
      let line = "";
      for (const word of paragraph.split(/\s+/)) {
        const trial = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(trial, size) <= maxWidth) {
          line = trial;
        } else {
          if (line) lines.push(line);
          line = word;
        }
      }
      lines.push(line);
    }
    return lines;
  };

  const text = (
    value: string,
    opts: { font?: PDFFont; size?: number; color?: ReturnType<typeof rgb>; indent?: number; gap?: number } = {}
  ) => {
    const font = opts.font ?? regular;
    const size = opts.size ?? 11;
    const indent = opts.indent ?? 0;
    const lineHeight = size * 1.4;
    for (const line of wrap(value, font, size, width - indent)) {
      room(lineHeight);
      if (line) page.drawText(line, { x: MARGIN + indent, y: y - size, size, font, color: opts.color ?? INK });
      y -= lineHeight;
    }
    y -= opts.gap ?? 4;
  };

  const heading = (value: string) => {
    room(60);
    y -= 10;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE.w - MARGIN, y },
      thickness: 0.8,
      color: MAUVE,
    });
    y -= 8;
    text(value, { font: bold, size: 15, color: MAUVE, gap: 6 });
  };

  const verse = (v: Verse) => {
    room(46); // keep a verse's reference with the start of its text
    text(`${v.ref} (${v.version})`, { font: bold, size: 9.5, color: MUTED, gap: 1, indent: 12 });
    text(v.text, { font: italic, size: 10.5, indent: 12, gap: 7 });
  };

  const answerBox = (label: string, value: string | undefined) => {
    text(label, { font: bold, size: 10, color: MUTED, gap: 2 });
    const mine = (value ?? "").trim();
    if (mine) text(mine, { size: 11, color: ANSWER, indent: 12, gap: 10 });
    else text("(left blank)", { font: italic, size: 10, color: MUTED, indent: 12, gap: 10 });
  };

  // Title
  text(LESSON_LABEL.toUpperCase(), { font: bold, size: 9, color: MUTED, gap: 2 });
  text(LESSON_TITLE, { font: bold, size: 26, color: MAUVE, gap: 0 });
  text(LESSON_SUBTITLE, { font: italic, size: 13, color: INK, gap: 8 });
  text("From Juston and Atiya Warthen · thewarthens.com/faith/present-but-missing", { size: 9, color: MUTED, gap: 10 });

  heading("Synopsis");
  for (const p of synopsis) text(p, { size: 11.5, gap: 8 });

  for (const group of explanation) {
    heading(group.heading);
    group.verses.forEach(verse);
  }

  heading("Questions to internalize");
  contexts.forEach((c, i) => {
    const action = actionFor(c);
    room(110);
    text(`${i + 1} of ${contexts.length}  ·  ${c.label}`, { font: bold, size: 12.5, color: MAUVE, gap: 3 });
    text(c.question, { font: bold, size: 11.5, gap: 4 });
    if (c.honor) verse(c.honor);
    answerBox("My notes", answers[`q-${c.id}`]);
    text("How to respond", { font: bold, size: 10, color: MUTED, gap: 2 });
    text(c.respond, { size: 11, indent: 12, gap: 6 });
    c.references?.forEach(verse);
    room(100);
    text(`What to do about it: ${action.label}`, { font: bold, size: 10, color: MUTED, gap: 2 });
    action.verses.forEach(verse);
    answerBox("My next step", answers[`a-${action.id}`]);
    y -= 10;
  });

  for (const group of morePresent) {
    heading(`More Scripture on being present: ${group.heading}`);
    group.verses.forEach(verse);
  }

  // Scripture notices
  heading("Scripture notices");
  for (const key of ["NASB2020", "NLT"] as const) text(versionNotice[key], { size: 8, color: MUTED, gap: 5 });

  // Page numbers
  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    p.drawText(`${LESSON_TITLE}  ·  ${i + 1} of ${pages.length}`, {
      x: MARGIN,
      y: 28,
      size: 8,
      font: regular,
      color: MUTED,
    });
  });

  return pdf.save();
}
