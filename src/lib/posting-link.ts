// Pulls a job-posting link out of what a person pasted. Phones make this harder than it sounds: the share and copy
// buttons in the LinkedIn and Indeed apps often copy "Job title at Company" plus the link, not the link alone, and
// some keyboards paste a link without any paste event at all. So we look for a single link inside short text.

const URL_RE = /https?:\/\/[^\s<>"')\]]+/gi;
const BARE_RE = /^(?:www\.)?(?:[a-z0-9-]+\.)+[a-z]{2,}\/\S+$/i;

/** Returns the one link in a short pasted text, or null when the text is not "just a link". */
export function findPostingLink(raw: string): string | null {
  const text = raw.trim();
  if (!text || text.length > 600) return null;
  const urls = text.match(URL_RE);
  if (urls) {
    if (new Set(urls.map((u) => u.replace(/[.,;:!?]+$/, ""))).size !== 1) return null;
    const url = urls[0].replace(/[.,;:!?]+$/, "");
    // The rest of the text can only be a short title or message ("Sales Rep at Acme"), not a pasted posting.
    const rest = text.replace(URL_RE, " ").replace(/\s+/g, " ").trim();
    return rest.length <= 160 ? url : null;
  }
  // "linkedin.com/jobs/view/123" with no https:// in front.
  if (BARE_RE.test(text) && !/\s/.test(text)) return `https://${text}`;
  return null;
}
