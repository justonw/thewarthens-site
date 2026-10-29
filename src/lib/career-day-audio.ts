// Read-aloud clips for the career day kiosk.
// Each spoken screen has a recorded clip at /career-day/audio/<id>.mp3, where the id comes
// from the exact words spoken. If a clip is missing, the browser's own voice reads it instead.
// This file is plain TypeScript with no imports so the clip script can use it too.

export function speechText(text: string) {
  return text
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Two small hashes joined together, so different sentences never share a file name.
export function clipId(text: string) {
  const t = speechText(text);
  let a = 0x811c9dc5;
  let b = 5381;
  for (let i = 0; i < t.length; i++) {
    const code = t.charCodeAt(i);
    a = Math.imul(a ^ code, 0x01000193) >>> 0;
    b = (Math.imul(b, 33) + code) >>> 0;
  }
  return a.toString(16).padStart(8, "0") + b.toString(16).padStart(8, "0");
}

export const clipUrl = (text: string) => `/career-day/audio/${clipId(text)}.mp3`;
