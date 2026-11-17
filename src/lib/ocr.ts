// Browser-only: reads the words out of a photo or screenshot, so the free scanner can use it. The reader (about
// 12 MB) is downloaded once, only when someone adds a picture, and the picture never leaves their device.
// Files live in /public/ocr (Tesseract, Apache 2.0).
const MAX_SIDE = 2200;

async function prepare(file: File): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(`We couldn't open ${file.name || "that picture"}. Try a PNG or JPG, or paste the text instead.`);
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("We couldn't read that picture. Paste the text instead.");
  ctx.fillStyle = "#ffffff"; // transparent screenshots read badly on black
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("We couldn't read that picture. Paste the text instead.");
  return blob;
}

export async function imageToText(file: File, onProgress?: (percent: number) => void): Promise<string> {
  const image = await prepare(file);
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng", 1, {
    workerPath: "/ocr/worker.min.js",
    corePath: "/ocr",
    langPath: "/ocr",
    gzip: false,
    workerBlobURL: false,
    logger: (m: { status: string; progress: number }) => {
      if (m.status === "recognizing text") onProgress?.(Math.round(m.progress * 100));
    },
  });
  try {
    const { data } = await worker.recognize(image);
    return data.text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  } finally {
    void worker.terminate();
  }
}
