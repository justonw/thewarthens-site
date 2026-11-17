// Spots the cold sales pitches that arrive through the contact form ("we can get you traffic within 24 hours", SEO and
// web design offers, link-building). A message that matches is dropped without a sound, so it never reaches the inbox.
// The phrases are deliberately specific: a real person writing to the Warthens does not talk like this.

const STRONG = [
  "traffic to your website",
  "targeted traffic",
  "show up first",
  "first page of google",
  "page one of google",
  "rank on google",
  "ranking on google",
  "rank higher on google",
  "within 24 hours of setup",
  "seo services",
  "seo package",
  "seo audit",
  "search engine optimization services",
  "backlink",
  "link building",
  "guest post",
  "sponsored post",
  "web design services",
  "website redesign",
  "increase your sales",
  "boost your sales",
  "lead generation services",
  "you pick the keywords",
  "we do the rest",
  "want to see how easy it is",
  "our system drives",
  "our team of experts can",
  "get more customers",
  "grow your business online",
  "social media marketing services",
  "guaranteed results",
  "limited time offer",
  "business loan",
];

const WEAK = ["your business should", "within a day", "within 24 hours", "free quote", "free audit", "free trial", "no obligation", "reply yes", "reply stop", "are you interested", "would you like to explore", "something you'd like to explore"];

const normalize = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ");

/** True when the text reads like a cold sales pitch and not a person writing to the site. */
export function looksLikeSalesPitch(...texts: string[]): boolean {
  const t = normalize(texts.join(" \n "));
  if (STRONG.some((p) => t.includes(p))) return true;
  if (WEAK.filter((p) => t.includes(p)).length >= 2) return true;
  // Three or more links in a short message is almost always an advert.
  if ((t.match(/https?:\/\//g) ?? []).length >= 3) return true;
  return false;
}
