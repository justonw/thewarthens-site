"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// Pages that run as a standalone kiosk (no site header or footer, so there is
// nowhere for a visitor to wander off to). Right now: the school career-day page.
const KIOSK_PREFIXES = ["/career-day"];

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname && KIOSK_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }
  return <>{children}</>;
}
