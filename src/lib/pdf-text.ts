// Browser-only: reads the words out of a PDF so the free scanner can use them. Nothing is sent anywhere.
// A scanned PDF (a picture of a page) has no words in it, so it comes back empty and the caller says so.
export async function pdfToText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url).toString();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages: string[] = [];
  try {
    for (let n = 1; n <= Math.min(doc.numPages, 8); n++) {
      const page = await doc.getPage(n);
      const content = await page.getTextContent();
      let out = "";
      for (const item of content.items) {
        if (!("str" in item)) continue;
        out += item.str;
        out += item.hasEOL ? "\n" : " ";
      }
      pages.push(out);
    }
  } finally {
    void doc.destroy();
  }
  return pages.join("\n").replace(/[ \t]+\n/g, "\n").replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}
