// Browser-only: turns a file a visitor picks, drops, or pastes into something the resume tool can use.
//   .txt / .md   -> text
//   .docx        -> text (read in the browser)
//   .pdf         -> sent to the AI as a PDF
//   images       -> shrunk and sent to the AI as a picture (screenshots, photos)
// Anything else, or anything that comes out empty, throws an error with a plain message that tells the
// person what to do instead.
import type { Attachment } from "./resume-tailor";

export type PickedFile = {
  id: string;
  name: string;
  kind: "text" | "pdf" | "image";
  // For text and Word files: the words we read, which are also added to the text box for them to edit.
  text?: string;
  // For PDFs and images: the file itself, as it will be sent.
  attachment?: Attachment;
  // Approximate size once encoded, to keep the whole upload under the host's limit.
  size: number;
  previewUrl?: string;
};

// A PDF is sent as is, so it has to fit. (Base64 adds about a third.)
export const MAX_PDF_BYTES = 3_500_000;
const MAX_IMAGE_SIDE = 1800;
const MIN_TEXT_CHARS = 20;

const kb = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)} MB` : `${Math.round(n / 1000)} KB`);

function toBase64(bytes: Uint8Array) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(binary);
}

async function shrinkImage(file: File): Promise<{ data: string; previewUrl: string; size: number }> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(`We couldn't open ${file.name}. Try saving it as a PNG or JPG, or paste the text instead.`);
  }
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error(`We couldn't read ${file.name}. Paste the text instead.`);
  ctx.fillStyle = "#ffffff"; // keeps transparent screenshots readable
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  if (!blob) throw new Error(`We couldn't read ${file.name}. Paste the text instead.`);
  const bytes = new Uint8Array(await blob.arrayBuffer());
  return { data: toBase64(bytes), previewUrl: URL.createObjectURL(blob), size: Math.ceil((bytes.length * 4) / 3) };
}

export async function processFile(file: File): Promise<PickedFile> {
  const name = file.name || "pasted image";
  const lower = name.toLowerCase();
  const type = file.type;
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  if (type.startsWith("image/") || /\.(png|jpe?g|webp|gif|heic|heif|bmp)$/.test(lower)) {
    const img = await shrinkImage(file);
    return {
      id,
      name,
      kind: "image",
      attachment: { kind: "image", mediaType: "image/jpeg", data: img.data },
      size: img.size,
      previewUrl: img.previewUrl,
    };
  }

  if (type === "application/pdf" || lower.endsWith(".pdf")) {
    if (file.size > MAX_PDF_BYTES) {
      throw new Error(`${name} is ${kb(file.size)}, which is too large to send (the limit is about ${kb(MAX_PDF_BYTES)}). Take a screenshot of it, or paste the text instead.`);
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    return {
      id,
      name,
      kind: "pdf",
      attachment: { kind: "pdf", mediaType: "application/pdf", data: toBase64(bytes) },
      size: Math.ceil((bytes.length * 4) / 3),
    };
  }

  if (lower.endsWith(".docx")) {
    let value = "";
    try {
      const mammoth = await import("mammoth/mammoth.browser");
      value = (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value.trim();
    } catch {
      throw new Error(`We couldn't open ${name}. Save it as a PDF, or paste the text instead.`);
    }
    if (value.length < MIN_TEXT_CHARS) {
      throw new Error(`We couldn't find any text in ${name}. Save it as a PDF, or paste the text instead.`);
    }
    return { id, name, kind: "text", text: value, size: 0 };
  }

  if (type.startsWith("text/") || /\.(txt|md|text)$/.test(lower)) {
    const value = (await file.text()).trim();
    if (value.length < MIN_TEXT_CHARS) throw new Error(`${name} looks empty. Paste the text instead.`);
    return { id, name, kind: "text", text: value, size: 0 };
  }

  if (lower.endsWith(".doc")) {
    throw new Error(`${name} is an older Word format we can't open. Save it as .docx or PDF, or paste the text instead.`);
  }
  if (lower.endsWith(".pages")) {
    throw new Error(`We can't open Apple Pages files. Export ${name} as a PDF, or paste the text instead.`);
  }
  throw new Error(`We can't open ${name}. Use a PDF, a Word (.docx) file, a text file, or a picture, or paste the text instead.`);
}
