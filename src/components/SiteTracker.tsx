"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/track";
import { isFunnelEvent } from "@/lib/funnel";

// The site's own, private counts (see lib/funnel.ts): which parts get visited, and which Home doors get used. It sets
// no cookie, stores nothing in the browser, and sends only the name of the step, never who did it or what they typed.
// Any link or button can be counted by giving it data-track="the-step-name".

const VIEWS: [string, Parameters<typeof track>[0]][] = [
  ["/tech/coaching", "view-coaching"],
  ["/tech", "view-tech"],
  ["/faith", "view-faith"],
  ["/techjr", "view-techjr"],
  ["/contact", "view-contact"],
];

export default function SiteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (pathname === "/") return track("view-home");
    const hit = VIEWS.find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`));
    if (hit) track(hit[1]);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target instanceof Element ? e.target.closest("[data-track]") : null;
      const name = el?.getAttribute("data-track");
      if (isFunnelEvent(name)) track(name);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
