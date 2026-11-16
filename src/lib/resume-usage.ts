// What the server tells the page about the build it just finished, and the plain words for it.
export type Usage = { kind: "free" | "paid"; number: number; of: number | null; left: number };

// "Free build 2 of 2" or "Paid build 3 of 15". A paid build with an unknown total (bought before totals were kept)
// has no number to show.
export function buildLabel(u: Usage): string | null {
  if (u.of && u.number >= 1) return `${u.kind === "free" ? "Free" : "Paid"} build ${Math.min(u.number, u.of)} of ${u.of}`;
  return null;
}

// The full line under the heading: which build this was, and how many are left in all.
export function usageLine(u: Usage): string {
  const label = buildLabel(u);
  const left = u.left > 0 ? `${u.left} ${u.left === 1 ? "build" : "builds"} left` : "no builds left, but you can keep editing and downloading this one";
  return label ? `${label}. ${left.charAt(0).toUpperCase()}${left.slice(1)}.` : `You have ${left}.`;
}

// The only shape of this text the email route accepts, so it cannot be used to put other words in an email.
export const BUILD_NOTE_RE = /^(Free|Paid) build \d{1,4} of \d{1,4}$/;
