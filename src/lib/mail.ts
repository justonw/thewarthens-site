// A small helper for the plain emails the site sends through Resend (receipts and alerts). It never throws: it
// answers whether the email service accepted the message, so a failed email can never break the thing it reports on.

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.TRACKER_FROM_EMAIL || "The Warthens <info@thewarthens.com>";
export const OWNER_ALERT_EMAIL = process.env.NOTIFY_EMAIL || "techjourneyinfo@gmail.com";

export function escapeHtml(input: string) {
  return input.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

export async function sendMail(to: string, subject: string, html: string, timeoutMs = 7000): Promise<boolean> {
  if (!RESEND_API_KEY) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject: subject.replace(/[\r\n]+/g, " ").slice(0, 200), html }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    return res.ok;
  } catch {
    return false;
  }
}
