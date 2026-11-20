// Real documents (PDF and Word) for the parts of the job search kit that used to download as a plain text file: the interview prep
// sheet, the messages, and the application answers. A document is described once as a list of blocks, and the same description
// makes the PDF and the Word file, so they always say the same thing. The converters that turn a prep sheet, messages, or answers
// into blocks are in kit-export.ts (pure, so a script can test them). Browser-only: it hands back bytes or a Blob.
import { pdfSafe } from "./resume-files";

export type KitBlock =
  | { kind: "heading"; text: string }
  | { kind: "para"; text: string }
  // A numbered question, kept together with what follows it.
  | { kind: "question"; n: number; text: string }
  // A small label and its text, such as "Why they ask".
  | { kind: "label"; label: string; text: string }
  | { kind: "bullets"; items: string[] };

export type KitDocument = { title: string; subtitle: string; blocks: KitBlock[] };

export async function buildKitPdf(doc: KitDocument): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  pdf.setTitle(doc.subtitle ? `${doc.title}: ${doc.subtitle}` : doc.title);
  pdf.setCreator("The Warthens");
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const W = 612;
  const H = 792;
  const M = 64;
  const contentW = W - M * 2;
  const ink = rgb(0.07, 0.07, 0.07);
  const grey = rgb(0.38, 0.38, 0.4);
  const rule = rgb(0.82, 0.83, 0.86);

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
      if (font.widthOfTextAtSize(test, size) <= width) line = test;
      else {
        if (line) lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
    return lines;
  };
  const write = (text: string, o: { font?: typeof regular; size?: number; color?: ReturnType<typeof rgb>; indent?: number; lead?: number; after?: number; bullet?: boolean } = {}) => {
    const font = o.font ?? regular;
    const size = o.size ?? 11;
    const lead = o.lead ?? size * 1.5;
    const indent = o.indent ?? 0;
    const textX = M + indent + (o.bullet ? 12 : 0);
    const width = contentW - indent - (o.bullet ? 12 : 0);
    const lines = text.split("\n").flatMap((part) => (part.trim() === "" ? [""] : wrap(part, font, size, width)));
    lines.forEach((l, i) => {
      ensure(lead);
      y -= lead;
      if (o.bullet && i === 0) page.drawText("•", { x: M + indent, y, size, font, color: ink });
      if (l) page.drawText(l, { x: textX, y, size, font, color: o.color ?? ink });
    });
    y -= o.after ?? 0;
  };

  write(doc.title, { font: bold, size: 21, after: 2 });
  if (doc.subtitle) write(doc.subtitle, { size: 11.5, color: grey, after: 10 });

  let inQuestion = false;
  for (const b of doc.blocks) {
    if (b.kind === "heading") {
      inQuestion = false;
      ensure(70);
      y -= 12;
      write(b.text, { font: bold, size: 13, after: 3 });
      page.drawLine({ start: { x: M, y: y + 1 }, end: { x: W - M, y: y + 1 }, thickness: 0.6, color: rule });
      y -= 8;
    } else if (b.kind === "question") {
      inQuestion = true;
      ensure(80);
      y -= 8;
      write(`${b.n}. ${b.text}`, { font: bold, size: 11.5, after: 3 });
    } else if (b.kind === "label") {
      write(b.label.toUpperCase(), { font: bold, size: 8, color: grey, indent: inQuestion ? 14 : 0, lead: 12, after: b.text ? 0 : 2 });
      if (b.text) write(b.text, { size: 10.5, indent: inQuestion ? 14 : 0, after: 6 });
    } else if (b.kind === "bullets") {
      for (const item of b.items) write(item, { size: 10.5, indent: inQuestion ? 14 : 0, bullet: true, after: 2 });
      y -= 4;
    } else {
      write(b.text, { size: 11, after: 8 });
    }
  }

  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    p.drawText(pdfSafe(`${doc.title}${doc.subtitle ? `  |  ${doc.subtitle}` : ""}`).slice(0, 80), { x: M, y: 30, size: 8, font: regular, color: grey });
    const label = `Page ${i + 1} of ${pages.length}`;
    p.drawText(label, { x: W - M - regular.widthOfTextAtSize(label, 8), y: 30, size: 8, font: regular, color: grey });
  });
  return pdf.save();
}

export async function buildKitDocx(doc: KitDocument): Promise<Blob> {
  const d = await import("docx");
  const { Document, Packer, Paragraph, TextRun } = d;
  const FONT = "Arial";
  const run = (text: string, o: { bold?: boolean; size?: number; color?: string } = {}) => new TextRun({ text, font: FONT, size: o.size ?? 22, bold: o.bold, color: o.color });
  // A text with line breaks becomes one paragraph per line, so Word shows the breaks the person wrote.
  const lines = (text: string) => text.split("\n");

  const kids: InstanceType<typeof Paragraph>[] = [
    new Paragraph({ spacing: { after: 60 }, children: [run(doc.title, { bold: true, size: 40 })] }),
    ...(doc.subtitle ? [new Paragraph({ spacing: { after: 240 }, children: [run(doc.subtitle, { size: 23, color: "555555" })] })] : []),
  ];
  let inQuestion = false;
  for (const b of doc.blocks) {
    const left = inQuestion ? 360 : 0;
    if (b.kind === "heading") {
      inQuestion = false;
      kids.push(new Paragraph({ keepNext: true, spacing: { before: 320, after: 120 }, border: { bottom: { style: "single" as never, size: 4, space: 4, color: "CCCCCC" } }, children: [run(b.text, { bold: true, size: 27 })] }));
    } else if (b.kind === "question") {
      inQuestion = true;
      kids.push(new Paragraph({ keepNext: true, spacing: { before: 220, after: 80 }, children: [run(`${b.n}. ${b.text}`, { bold: true, size: 23 })] }));
    } else if (b.kind === "label") {
      kids.push(new Paragraph({ keepNext: true, indent: { left }, spacing: { after: 20 }, children: [run(b.label.toUpperCase(), { bold: true, size: 16, color: "666666" })] }));
      if (b.text) for (const l of lines(b.text)) kids.push(new Paragraph({ indent: { left }, spacing: { after: 120, line: 290 }, children: [run(l, { size: 21 })] }));
    } else if (b.kind === "bullets") {
      for (const item of b.items) kids.push(new Paragraph({ bullet: { level: 0 }, indent: { left: left + 360 }, spacing: { after: 40, line: 290 }, children: [run(item, { size: 21 })] }));
    } else {
      for (const l of lines(b.text)) kids.push(new Paragraph({ spacing: { after: 160, line: 300 }, children: [run(l)] }));
    }
  }
  const file = new Document({
    title: doc.subtitle ? `${doc.title}: ${doc.subtitle}` : doc.title,
    creator: "The Warthens",
    styles: { default: { document: { run: { font: FONT, size: 22 } } } },
    sections: [{ properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1300, bottom: 1300, left: 1300, right: 1300 } } }, children: kids }],
  });
  return Packer.toBlob(file);
}
