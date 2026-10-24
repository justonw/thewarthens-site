// Who gets the coaching request emails. Kept in its own file so the routing is easy to test.
export const JERMELL_EMAIL = "jermellallenmitchell@gmail.com";
export const JUSTON_EMAIL = "justonwarthen@gmail.com";

// True only for the real site. Test links (Netlify previews) and localhost are not "live".
export function isLiveHost(rawHost: string | null | undefined) {
  const host = (rawHost ?? "").split(",")[0].split(":")[0].trim().toLowerCase();
  return host === "thewarthens.com" || host === "www.thewarthens.com";
}

// Live requests go to Jermell with Juston copied. Everything else goes to Juston only,
// so testing the form never emails Jermell.
export function recipientsFor(live: boolean, extra: string[] = []) {
  return live ? [JERMELL_EMAIL, JUSTON_EMAIL, ...extra] : [JUSTON_EMAIL];
}
