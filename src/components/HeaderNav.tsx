"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// The site menu. On larger screens each tab is a raised white chip with a soft shadow, so the tabs read as separate
// buttons, and the page you are on is a rich indigo chip with a glow. On phones there is no room for chips, so the tabs
// are bold type with thin dividers between them, and the current page is indigo with a thick underline. (An underline
// adds no width, so all the tabs still fit on a small phone.)

type Item = { href: string; label: string; short: string; wideOnly?: boolean; cta?: boolean; firstOnPhone?: boolean; also?: string[] };

const items: Item[] = [
  // The logo already goes home, so this tab only shows where there is plenty of room.
  { href: "/", label: "Home", short: "Home", wideOnly: true },
  { href: "/tech", label: "Tech Journey", short: "Tech", firstOnPhone: true },
  { href: "/resume", label: "Resume Builder", short: "Resume" },
  { href: "/techjr", label: "Tech Jr.", short: "Tech Jr." },
  { href: "/faith", label: "Faith Journey", short: "Faith", also: ["/jesus", "/magnets", "/source-of-life"] },
  { href: "/tech/coaching", label: "1:1 Coaching", short: "Coaching" },
  { href: "/contact", label: "Contact", short: "Contact", cta: true },
];

// The tab for the page you are on: the longest matching address wins, so /tech/coaching lights up Coaching, not Tech.
function activeHref(path: string) {
  let best = "";
  for (const it of items) {
    for (const base of [it.href, ...(it.also ?? [])]) {
      const hit = base === "/" ? path === "/" : path === base || path.startsWith(`${base}/`);
      if (hit && base.length > best.length) best = it.href;
    }
  }
  return best;
}

export default function HeaderNav() {
  const path = usePathname() || "/";
  const current = activeHref(path);
  return (
    <nav className="flex items-center gap-0.5 sm:gap-1.5 xl:gap-2.5">
      {items.map((it) => {
        const on = it.href === current;
        const base = "relative max-sm:after:absolute max-sm:after:-inset-y-2 max-sm:after:-inset-x-1 whitespace-nowrap text-[11px] font-extrabold tracking-tight max-[359px]:text-[10px] transition-all duration-150 min-[380px]:text-xs sm:text-sm lg:text-[15px] xl:text-base";
        const cls = it.cta
          ? `${base} ml-0.5 rounded-full bg-purple-700 px-2.5 py-2 text-white max-[359px]:px-2 shadow-lg shadow-purple-900/30 hover:-translate-y-0.5 hover:bg-purple-800 hover:shadow-xl active:translate-y-0 active:scale-95 min-[360px]:ml-1 min-[400px]:px-3 sm:px-4 xl:px-6 ${on ? "ring-2 ring-purple-300" : ""}`
          : `${base} border-b-[3px] px-1 py-1.5 max-[359px]:px-0.5 active:scale-95 min-[400px]:px-1.5 before:absolute before:-left-[3px] before:top-1/2 before:h-3.5 before:w-px before:-translate-y-1/2 before:bg-slate-300 ${it.firstOnPhone ? "before:hidden" : ""} sm:rounded-full sm:border-b-0 sm:px-2.5 sm:py-2 sm:before:hidden lg:px-3.5 xl:px-5 ${
              on
                ? "border-indigo-700 text-indigo-800 sm:bg-gradient-to-br sm:from-indigo-950 sm:via-indigo-800 sm:to-indigo-600 sm:text-white sm:shadow-lg sm:shadow-indigo-900/40"
                : "border-transparent text-slate-800 hover:text-indigo-800 sm:bg-white sm:shadow-[0_1px_2px_rgba(15,23,42,0.10),0_4px_10px_-3px_rgba(15,23,42,0.16)] sm:ring-1 sm:ring-slate-900/[0.07] sm:hover:-translate-y-0.5 sm:hover:shadow-[0_2px_4px_rgba(15,23,42,0.12),0_10px_18px_-6px_rgba(15,23,42,0.28)]"
            }`;
        return (
          <Link key={it.href} href={it.href} aria-current={on ? "page" : undefined} className={`${cls} ${it.wideOnly ? "hidden lg:inline-block" : ""}`}>
            <span className="xl:hidden">{it.short}</span>
            <span className="hidden xl:inline">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
