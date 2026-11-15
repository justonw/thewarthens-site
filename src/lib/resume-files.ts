// Builds the downloadable resume files in the browser, so the resume never has to be stored on the
// server. One layout for both formats: US Letter, one column, Arial/Helvetica, plain section
// headings, no tables, icons, or graphics (the same rules as the Tech Journey resume checklist).
import type { CoverLetter, ResumeDesign, ResumeDoc, SectionKey } from "./resume-tailor";

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

// ---------- Styles ----------
// Looks for the downloads. All are one column with standard fonts and plain headings, so every one is
// safe for hiring software. They differ in accent color, type, size, and spacing. "custom" is built from
// the look of the resume the person uploaded.

export type ResumeStyle = "classic" | "modern" | "compact" | "traditional" | "custom";

export const RESUME_STYLES: { id: Exclude<ResumeStyle, "custom">; label: string; note: string }[] = [
  { id: "classic", label: "Classic", note: "Black and white. The safest choice." },
  { id: "modern", label: "Modern", note: "A blue accent on your headings." },
  { id: "compact", label: "Compact", note: "Tighter, to fit more on one page." },
  { id: "traditional", label: "Traditional", note: "Serif type and a centered header." },
];

type Look = {
  margin: number;
  body: number;
  lead: number;
  nameSize: number;
  headlineSize: number;
  accent: [number, number, number] | null;
  hdSize: number;
  hdGap: number;
  ruleW: number;
  docMargin: number;
  docBody: number;
  docName: number;
  docHead: number;
  docRule: number;
  hex: string;
  serif: boolean;
  center: boolean;
  plainHeadings: boolean;
  order: SectionKey[];
};

const DEFAULT_ORDER: SectionKey[] = ["summary", "skills", "experience", "training", "education"];

const BASE: Look = { margin: 54, body: 10, lead: 13, nameSize: 22, headlineSize: 12, accent: null, hdSize: 10, hdGap: 21, ruleW: 0.75, docMargin: 1080, docBody: 21, docName: 44, docHead: 20, docRule: 6, hex: "111111", serif: false, center: false, plainHeadings: false, order: DEFAULT_ORDER };

const LOOKS: Record<Exclude<ResumeStyle, "custom">, Look> = {
  classic: BASE,
  modern: { ...BASE, lead: 13.5, nameSize: 26, headlineSize: 13, accent: [0.114, 0.306, 0.847], hdSize: 10.5, hdGap: 22, ruleW: 1.5, docName: 52, docHead: 21, docRule: 12, hex: "1D4ED8" },
  compact: { ...BASE, margin: 43, body: 9.5, lead: 12, nameSize: 20, headlineSize: 11, hdSize: 9.5, hdGap: 17, docMargin: 864, docBody: 19, docName: 38, docHead: 18 },
  traditional: { ...BASE, body: 10.5, lead: 13.5, nameSize: 24, headlineSize: 12, hdSize: 11, hdGap: 22, serif: true, center: true, docBody: 22, docName: 48, docHead: 22 },
};

function lookFromDesign(d: ResumeDesign): Look {
  const base = d.density === "compact" ? LOOKS.compact : d.density === "roomy" ? { ...BASE, body: 10.5, lead: 14.5, hdGap: 24, docBody: 22 } : BASE;
  const hex = d.accent.replace("#", "") || "111111";
  const n = (i: number) => parseInt(hex.slice(i, i + 2), 16) / 255;
  return {
    ...base,
    serif: d.font === "serif",
    center: d.headerAlign === "center",
    plainHeadings: d.headingStyle === "plain",
    accent: d.accent ? [n(0), n(2), n(4)] : null,
    hex: hex.toUpperCase(),
    order: d.sectionOrder.length ? d.sectionOrder : DEFAULT_ORDER,
  };
}

function resolveLook(style: ResumeStyle, design?: ResumeDesign): Look {
  if (style === "custom") return design ? lookFromDesign(design) : LOOKS.classic;
  return LOOKS[style];
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

export async function buildPdf(doc: ResumeDoc, style: ResumeStyle = "classic", design?: ResumeDesign): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const L = resolveLook(style, design);
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${doc.name} - Resume`);
  pdf.setAuthor(doc.name);
  const regular = await pdf.embedFont(L.serif ? StandardFonts.TimesRoman : StandardFonts.Helvetica);
  const bold = await pdf.embedFont(L.serif ? StandardFonts.TimesRomanBold : StandardFonts.HelveticaBold);

  const W = 612;
  const H = 792;
  const M = L.margin;
  const contentW = W - M * 2;
  const ink = rgb(0.07, 0.07, 0.07);
  const grey = rgb(0.34, 0.34, 0.34);
  const accent = L.accent ? rgb(L.accent[0], L.accent[1], L.accent[2]) : ink;
  const BODY = L.body;
  const LEAD = L.lead;

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

  // Header lines are centered or left-aligned depending on the look.
  const headerLine = (t: string, size: number, font: typeof regular, color = ink) => {
    const safe = pdfSafe(t);
    const x = L.center ? Math.max(M, (W - font.widthOfTextAtSize(safe, size)) / 2) : M;
    page.drawText(safe, { x, y, size, font, color });
  };

  const paragraph = (t: string, opts: { size?: number; font?: typeof regular; color?: ReturnType<typeof rgb>; indent?: number; bullet?: boolean } = {}) => {
    const size = opts.size ?? BODY;
    const font = opts.font ?? regular;
    const indent = opts.indent ?? 0;
    const lines = wrap(t, font, size, contentW - indent);
    lines.forEach((l, idx) => {
      ensure(LEAD);
      y -= LEAD;
      if (opts.bullet && idx === 0) text("\u2022", M + indent - 11, size, regular, opts.color ?? ink);
      text(l, M + indent, size, font, opts.color ?? ink);
    });
  };

  const heading = (label: string) => {
    ensure(LEAD * 3);
    y -= L.hdGap;
    text(label.toUpperCase(), M, L.hdSize, bold, accent);
    if (!L.plainHeadings) {
      y -= 4;
      page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: L.ruleW, color: accent });
      y -= 3;
    }
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
  y -= L.nameSize;
  headerLine(doc.name, L.nameSize, bold);
  if (doc.headline) {
    y -= L.headlineSize + 6;
    headerLine(doc.headline, L.headlineSize, regular, accent);
  }
  if (doc.contact.length) {
    for (const l of wrap(doc.contact.join("  |  "), regular, 9.5, contentW)) {
      y -= 14;
      headerLine(l, 9.5, regular, grey);
    }
  }

  const sections: Record<SectionKey, () => void> = {
    summary: () => {
      if (!doc.summary) return;
      heading("Summary");
      paragraph(doc.summary);
    },
    skills: () => {
      if (!doc.skills.length) return;
      heading("Skills");
      for (const sk of doc.skills) paragraph(sk.label ? `${sk.label}: ${sk.items}` : sk.items);
    },
    experience: () => {
      if (!doc.experience.length) return;
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
    },
    training: () => {
      if (!doc.training.length) return;
      heading("Training and certifications");
      for (const t of doc.training) split([t.name, t.detail].filter(Boolean).join(", "), t.dates, regular);
    },
    education: () => {
      if (!doc.education.length) return;
      heading("Education");
      for (const e of doc.education) split([e.credential, e.school].filter(Boolean).join(", "), e.dates, regular);
    },
  };
  for (const key of L.order) sections[key]();

  return pdf.save();
}

// ---------- Word (.docx) ----------

export async function buildDocx(doc: ResumeDoc, style: ResumeStyle = "classic", design?: ResumeDesign): Promise<Blob> {
  const d = await import("docx");
  const { Document, Packer, Paragraph, TextRun, TabStopType, BorderStyle, LevelFormat, AlignmentType } = d;
  const L = resolveLook(style, design);
  const FONT = L.serif ? "Times New Roman" : "Arial";
  const PAGE_W = 12240;
  const MARGIN = L.docMargin;
  const RIGHT = PAGE_W - MARGIN * 2;
  const align = L.center ? AlignmentType.CENTER : AlignmentType.LEFT;
  const run = (text: string, o: { bold?: boolean; size?: number; color?: string } = {}) =>
    new TextRun({ text, font: FONT, size: o.size ?? L.docBody, bold: o.bold, color: o.color });

  const heading = (label: string) =>
    new Paragraph({
      spacing: { before: 220, after: 80 },
      ...(L.plainHeadings ? {} : { border: { bottom: { style: BorderStyle.SINGLE, size: L.docRule, color: L.hex, space: 1 } } }),
      keepNext: true,
      children: [run(label.toUpperCase(), { bold: true, size: L.docHead, color: L.hex })],
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
  kids.push(new Paragraph({ alignment: align, spacing: { after: 20 }, children: [run(doc.name, { bold: true, size: L.docName })] }));
  if (doc.headline) kids.push(new Paragraph({ alignment: align, spacing: { after: 20 }, children: [run(doc.headline, { size: L.docBody + 3, color: L.accent ? L.hex : undefined })] }));
  if (doc.contact.length) kids.push(new Paragraph({ alignment: align, children: [run(doc.contact.join("  |  "), { size: 19, color: "555555" })] }));

  const sections: Record<SectionKey, () => void> = {
    summary: () => {
      if (doc.summary) kids.push(heading("Summary"), body(doc.summary));
    },
    skills: () => {
      if (!doc.skills.length) return;
      kids.push(heading("Skills"));
      for (const sk of doc.skills) {
        kids.push(new Paragraph({ spacing: { after: 40 }, children: sk.label ? [run(`${sk.label}: `, { bold: true }), run(sk.items)] : [run(sk.items)] }));
      }
    },
    experience: () => {
      if (!doc.experience.length) return;
      kids.push(heading("Experience"));
      for (const j of doc.experience) {
        kids.push(split([j.title, j.company].filter(Boolean).join(", "), j.dates, true));
        if (j.location) kids.push(new Paragraph({ keepNext: true, children: [run(j.location, { size: 19, color: "555555" })] }));
        for (const b of j.bullets) {
          kids.push(new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 30 }, children: [run(b)] }));
        }
      }
    },
    training: () => {
      if (!doc.training.length) return;
      kids.push(heading("Training and certifications"));
      for (const t of doc.training) kids.push(split([t.name, t.detail].filter(Boolean).join(", "), t.dates, false));
    },
    education: () => {
      if (!doc.education.length) return;
      kids.push(heading("Education"));
      for (const e of doc.education) kids.push(split([e.credential, e.school].filter(Boolean).join(", "), e.dates, false));
    },
  };
  for (const key of L.order) sections[key]();

  const file = new Document({
    title: `${doc.name} - Resume`,
    creator: doc.name,
    styles: { default: { document: { run: { font: FONT, size: L.docBody } } } },
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "\u2022",
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

// ---------- Cover letter ----------
// A one-page business letter: your name and contact details, the date, the greeting, a few short
// paragraphs, and a sign-off. Same plain, single-column look as the resume.

function today() {
  return new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function coverLetterFileName(doc: ResumeDoc, ext: "pdf" | "docx") {
  const slug = (v: string) =>
    v
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  return `${[slug(doc.name) || "Cover", "Cover-Letter", slug(doc.headline)].filter(Boolean).join("-")}.${ext}`;
}

export function coverLetterToText(letter: CoverLetter, doc: ResumeDoc): string {
  return [
    doc.name,
    doc.contact.join(" | "),
    "",
    today(),
    "",
    letter.greeting,
    "",
    letter.paragraphs.join("\n\n"),
    "",
    letter.closing,
    doc.name,
  ]
    .filter((line, i) => i !== 1 || line)
    .join("\n");
}

export async function buildCoverLetterPdf(letter: CoverLetter, doc: ResumeDoc): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${doc.name} - Cover Letter`);
  pdf.setAuthor(doc.name);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const W = 612;
  const H = 792;
  const M = 72;
  const contentW = W - M * 2;
  const ink = rgb(0.07, 0.07, 0.07);
  const grey = rgb(0.34, 0.34, 0.34);
  const SIZE = 11;
  const LEAD = 15.5;

  let page = pdf.addPage([W, H]);
  let y = H - M;
  const ensure = (needed: number) => {
    if (y - needed < M) {
      page = pdf.addPage([W, H]);
      y = H - M;
    }
  };
  const wrap = (text: string, font: typeof regular, size: number) => {
    const lines: string[] = [];
    let line = "";
    for (const word of pdfSafe(text).split(/\s+/).filter(Boolean)) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) <= contentW) line = test;
      else {
        if (line) lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
    return lines;
  };
  const para = (text: string, o: { font?: typeof regular; size?: number; color?: ReturnType<typeof rgb>; after?: number } = {}) => {
    const font = o.font ?? regular;
    const size = o.size ?? SIZE;
    for (const l of wrap(text, font, size)) {
      ensure(LEAD);
      y -= LEAD;
      page.drawText(l, { x: M, y, size, font, color: o.color ?? ink });
    }
    y -= o.after ?? 0;
  };

  para(doc.name, { font: bold, size: 16, after: 2 });
  if (doc.contact.length) para(doc.contact.join("  |  "), { size: 9.5, color: grey, after: 6 });
  y -= 14;
  para(today(), { after: 14 });
  para(letter.greeting, { after: 10 });
  for (const p of letter.paragraphs) para(p, { after: 10 });
  y -= 2;
  para(letter.closing, { after: 22 });
  para(doc.name, { font: bold });
  return pdf.save();
}

export async function buildCoverLetterDocx(letter: CoverLetter, doc: ResumeDoc): Promise<Blob> {
  const d = await import("docx");
  const { Document, Packer, Paragraph, TextRun } = d;
  const FONT = "Arial";
  const run = (text: string, o: { bold?: boolean; size?: number; color?: string } = {}) =>
    new TextRun({ text, font: FONT, size: o.size ?? 22, bold: o.bold, color: o.color });
  const block = (text: string, after = 180, o: { bold?: boolean; size?: number; color?: string } = {}) =>
    new Paragraph({ spacing: { after, line: 300 }, children: [run(text, o)] });

  const kids = [
    block(doc.name, 40, { bold: true, size: 32 }),
    ...(doc.contact.length ? [block(doc.contact.join("  |  "), 240, { size: 19, color: "555555" })] : []),
    block(today(), 240),
    block(letter.greeting, 180),
    ...letter.paragraphs.map((p) => block(p, 180)),
    block(letter.closing, 440),
    block(doc.name, 0, { bold: true }),
  ];
  const file = new Document({
    title: `${doc.name} - Cover Letter`,
    creator: doc.name,
    styles: { default: { document: { run: { font: FONT, size: 22 } } } },
    sections: [{ properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } }, children: kids }],
  });
  return Packer.toBlob(file);
}
