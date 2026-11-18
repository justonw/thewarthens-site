// Browser-only: tells the site that a step happened (see lib/funnel.ts). Each step is sent once per visit, never carries
// anything the person typed, and never gets in the way: a failure is ignored.
import type { FunnelEvent } from "./funnel";

const sent = new Set<string>();

export function track(event: FunnelEvent) {
  if (typeof window === "undefined" || sent.has(event)) return;
  sent.add(event);
  try {
    const body = JSON.stringify({ event });
    if (navigator.sendBeacon && navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }))) return;
    void fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
  } catch {
    /* counting is never worth breaking a page */
  }
}
