// Turns a plain-text note into a simple email: blank lines separate paragraphs, and web addresses become links.
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export function noteHtml(text: string, unsubscribeLink: string) {
  const paragraphs = text
    .trim()
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>").replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g, '<a href="$1">$1</a>')}</p>`)
    .join("\n");
  return `${paragraphs}
<hr style="border:none;border-top:1px solid #ddd;margin:28px 0 12px">
<p style="font-size:12px;color:#666">You're getting this because you asked for an occasional note from Juston and Atiya at thewarthens.com. <a href="${unsubscribeLink}">Unsubscribe</a>.</p>`;
}

