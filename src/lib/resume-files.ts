// Builds the downloadable resume files in the browser, so the resume never has to be stored on the
// server. One layout for both formats: US Letter, one column, Arial/Helvetica, plain section
// headings, no tables, icons, or graphics (the same rules as the Tech Journey resume checklist).
import type { ResumeDoc } from "./resume-tailor";

export function resumeFileName(doc: ResumeDoc, ext: "pdf" | "docx") {
  const slug = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const parts = [slug(doc.name) || "Resume", "Resume", slug(doc.headline)].filter(Boolean);
  return `${parts.join("-")}.${ext}`;
}

// The same words, in reading order, as a parser would see them.
export function resumeToPlainText(doc: ResumeDoc): string {
  const out: string[] = [];
  out.push(doc.name);
  if (doc.headline) out.push(doc.headline);
  if (doc.contact.length) out.push(doc.contact.join(" | "));
  if (doc.summary) out.push("", "SUMMARY", doc.summary);
  if (doc.skills.length) {
    out.push("", "SKILLS");
    for (const s of doc.skills) out.push(s.label ? `${s.label}: ${s.items}` : s.items);
  }
  if (doc.experience.length) {
    out.push("", "EXPERIENCE");
    for (const j of doc.experience) {
      out.push([j.title, j.company].filter(Boolean).join(", ") + (j.dates ? `  ${j.dates}` : ""));
      if (j.location) out.push(j.location);
      for (const b of j.bullets) out.push(`- ${b}`);
    }
  }
  if (doc.training.length) {
    out.push("", "TRAINING AND CERTIFICATIONS");
    for (const t of doc.training) out.push([t.name, t.detail].filter(Boolean).join(", ") + (t.dates ? `  ${t.dates}` : ""));
  }
  if (doc.education.length) {
    out.push("", "EDUCATION");
    for (const e of doc.education) out.push([e.credential, e.school].filter(Boolean).join(", ") + (e.dates ? `  ${e.dates}` : ""));
  }
  return out.join("\n");
}

// ---------- PDF ----------

// Helvetica can only draw Western European characters. Keep those and flatten anything else.
const LOOKALIKES: Record<string, string> = { "\u0141": "L", "\u0142": "l", "\u0110": "D", "\u0111": "d", "\u0131": "i", "\u0126": "H", "\u0127": "h" };

function pdfSafe(text: string) {
  let out = "";
  for (const raw of text) {
    const ch = LOOKALIKES[raw] ?? raw;
    if (/[ -~ -ÿ•]/.test(ch)) {
      out += ch;
    } else {
      const base = ch.normalize("NFD").replace(/[̀-ͯ]/g, "");
      out += /^[ -~]+$/.test(base) ? base : "?";
    }
  }
  return out;
}

export async function buildPdf(doc: ResumeDoc): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${doc.name} - Resume`);
  pdf.setAuthor(doc.name);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const W = 612;
  const H = 792;
  const M = 54;
  const contentW = W - M * 2;
  const ink = rgb(0.07, 0.07, 0.07);
  const grey = rgb(0.34, 0.34, 0.34);
  const BODY = 10;
  const LEAD = 13;

  let page = pdf.addPage([W, H]);
  let y = H - M;

  const ensure = (needed: number) => {
    if (y - needed < M) {
      page = pdf.addPage([W, H]);
      y = H - M;
    }
  };

  const wrap = (text: string, font: typeof regular, size: number, width: number) => {
    const lines: string[] = [];
    let line = "";
    for (const word of pdfSafe(text).split(/\s+/).filter(Boolean)) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) <= width) {
        line = test;
      } else {
        if (line) lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  const text = (t: string, x: number, size: number, font: typeof regular, color = ink) => {
    page.drawText(pdfSafe(t), { x, y, size, font, color });
  };

  const paragraph = (t: string, opts: { size?: number; font?: typeof regular; color?: ReturnType<typeof rgb>; indent?: number; bullet?: boolean } = {}) => {
    const size = opts.size ?? BODY;
    const font = opts.font ?? regular;
    const indent = opts.indent ?? 0;
    const lines = wrap(t, font, size, contentW - indent);
    lines.forEach((l, idx) => {
      ensure(LEAD);
      y -= LEAD;
      if (opts.bullet && idx === 0) text("•", M + indent - 11, size, regular, opts.color ?? ink);
      text(l, M + indent, size, font, opts.color ?? ink);
    });
  };

  const heading = (label: string) => {
    ensure(LEAD * 3);
    y -= 10;
    y -= 11;
    text(label.toUpperCase(), M, 10, bold);
    y -= 4;
    page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.75, color: ink });
    y -= 3;
  };

  // A line with text on the left and dates flush right. A long left side wraps to a second line.
  const split = (left: string, right: string, font: typeof regular) => {
    const r = pdfSafe(right);
    const rw = r ? regular.widthOfTextAtSize(r, BODY) : 0;
    const lw = contentW - rw - (r ? 12 : 0);
    const lines = wrap(left, font, BODY, lw);
    if (lines.length === 0) lines.push("");
    lines.forEach((l, idx) => {
      ensure(LEAD);
      y -= LEAD;
      text(l, M, BODY, font);
      if (idx === 0 && r) page.drawText(r, { x: W - M - rw, y, size: BODY, font: regular, color: ink });
    });
  };

  // Header
  y -= 22;
  text(doc.name, M, 22, bold);
  if (doc.headline) {
    y -= 18;
    text(doc.headline, M, 12, regular);
  }
  if (doc.contact.length) {
    for (const l of wrap(doc.contact.join("  |  "), regular, 9.5, contentW)) {
      y -= 14;
      text(l, M, 9.5, regular, grey);
    }
  }

  if (doc.summary) {
    heading("Summary");
    paragraph(doc.summary);
  }

  if (doc.skills.length) {
    heading("Skills");
    for (const s of doc.skills) paragraph(s.label ? `${s.label}: ${s.items}` : s.items);
  }

  if (doc.experience.length) {
    heading("Experience");
    doc.experience.forEach((j, idx) => {
      if (idx > 0) y -= 6;
      ensure(LEAD * 3);
      split([j.title, j.company].filter(Boolean).join(", "), j.dates, bold);
      if (j.location) {
        ensure(LEAD);
        y -= LEAD;
        text(j.location, M, 9.5, regular, grey);
      }
      for (const b of j.bullets) paragraph(b, { indent: 14, bullet: true });
    });
  }

  if (doc.training.length) {
    heading("Training and certifications");
    for (const t of doc.training) split([t.name, t.detail].filter(Boolean).join(", "), t.dates, regular);
  }

  if (doc.education.length) {
    heading("Education");
    for (const e of doc.education) split([e.credential, e.school].filter(Boolean).join(", "), e.dates, regular);
  }

  return pdf.save();
}

// ---------- Word (.docx) ----------

export async function buildDocx(doc: ResumeDoc): Promise<Blob> {
  const d = await import("docx");
  const { Document, Packer, Paragraph, TextRun, TabStopType, BorderStyle, LevelFormat, AlignmentType } = d;
  const FONT = "Arial";
  const PAGE_W = 12240;
  const MARGIN = 1080;
  const RIGHT = PAGE_W - MARGIN * 2;
  const run = (text: string, o: { bold?: boolean; size?: number; color?: string } = {}) =>
    new TextRun({ text, font: FONT, size: o.size ?? 21, bold: o.bold, color: o.color });

  const heading = (label: string) =>
    new Paragraph({
      spacing: { before: 220, after: 80 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "111111", space: 1 } },
      keepNext: true,
      children: [run(label.toUpperCase(), { bold: true, size: 20 })],
    });

  const body = (text: string) => new Paragraph({ spacing: { after: 40 }, children: [run(text)] });

  const split = (left: string, right: string, bold: boolean) =>
    new Paragraph({
      spacing: { before: 60 },
      keepNext: true,
      tabStops: [{ type: TabStopType.RIGHT, position: RIGHT }],
      children: [run(left, { bold }), ...(right ? [run(`\t${right}`)] : [])],
    });

  const kids: InstanceType<typeof Paragraph>[] = [];
  kids.push(new Paragraph({ spacing: { after: 20 }, children: [run(doc.name, { bold: true, size: 44 })] }));
  if (doc.headline) kids.push(new Paragraph({ spacing: { after: 20 }, children: [run(doc.headline, { size: 24 })] }));
  if (doc.contact.length) kids.push(new Paragraph({ children: [run(doc.contact.join("  |  "), { size: 19, color: "555555" })] }));

  if (doc.summary) {
    kids.push(heading("Summary"), body(doc.summary));
  }
  if (doc.skills.length) {
    kids.push(heading("Skills"));
    for (const s of doc.skills) {
      kids.push(
        new Paragraph({
          spacing: { after: 40 },
          children: s.label ? [run(`${s.label}: `, { bold: true }), run(s.items)] : [run(s.items)],
        })
      );
    }
  }
  if (doc.experience.length) {
    kids.push(heading("Experience"));
    for (const j of doc.experience) {
      kids.push(split([j.title, j.company].filter(Boolean).join(", "), j.dates, true));
      if (j.location) kids.push(new Paragraph({ keepNext: true, children: [run(j.location, { size: 19, color: "555555" })] }));
      for (const b of j.bullets) {
        kids.push(
          new Paragraph({
            numbering: { reference: "bullets", level: 0 },
            spacing: { after: 30 },
            children: [run(b)],
          })
        );
      }
    }
  }
  if (doc.training.length) {
    kids.push(heading("Training and certifications"));
    for (const t of doc.training) kids.push(split([t.name, t.detail].filter(Boolean).join(", "), t.dates, false));
  }
  if (doc.education.length) {
    kids.push(heading("Education"));
    for (const e of doc.education) kids.push(split([e.credential, e.school].filter(Boolean).join(", "), e.dates, false));
  }

  const file = new Document({
    title: `${doc.name} - Resume`,
    creator: doc.name,
    styles: { default: { document: { run: { font: FONT, size: 21 } } } },
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 360, hanging: 240 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
        children: kids,
      },
    ],
  });
  return Packer.toBlob(file);
}
