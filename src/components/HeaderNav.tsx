"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// The site menu. Each section has its own color, shown as colored text with a colored underline, so the tabs stand out
// and a visitor can tell the sections apart at a glance. The page you are on is filled in. The underline adds no width,
// so all the tabs still fit on a small phone.

type Tone = "slate" | "blue" | "emerald" | "amber" | "rose" | "teal";

const TONES: Record<Tone, { idle: string; active: string }> = {
  slate: { idle: "text-slate-700 border-slate-300 hover:border-slate-500 hover:bg-slate-100", active: "text-slate-900 border-slate-700 bg-slate-100" },
  blue: { idle: "text-blue-700 border-blue-300 hover:border-blue-600 hover:bg-blue-50", active: "text-blue-800 border-blue-600 bg-blue-100" },
  emerald: { idle: "text-emerald-700 border-emerald-300 hover:border-emerald-600 hover:bg-emerald-50", active: "text-emerald-800 border-emerald-600 bg-emerald-100" },
  amber: { idle: "text-amber-700 border-amber-300 hover:border-amber-600 hover:bg-amber-50", active: "text-amber-800 border-amber-600 bg-amber-100" },
  rose: { idle: "text-rose-700 border-rose-300 hover:border-rose-600 hover:bg-rose-50", active: "text-rose-800 border-rose-600 bg-rose-100" },
  teal: { idle: "text-teal-700 border-teal-300 hover:border-teal-600 hover:bg-teal-50", active: "text-teal-800 border-teal-600 bg-teal-100" },
};

type Item = { href: string; label: string; short: string; tone: Tone; wideOnly?: boolean; cta?: boolean; also?: string[] };

const items: Item[] = [
  // On phones the logo already goes home, so this makes room for the coaching link.
  { href: "/", label: "Home", short: "Home", tone: "slate", wideOnly: true },
  { href: "/tech", label: "Tech Journey", short: "Tech", tone: "blue" },
  { href: "/resume", label: "Resume Builder", short: "Resume", tone: "emerald" },
  { href: "/techjr", label: "Tech Jr.", short: "Tech Jr.", tone: "amber" },
  { href: "/faith", label: "Faith Journey", short: "Faith", tone: "rose", also: ["/jesus", "/magnets", "/source-of-life"] },
  { href: "/tech/coaching", label: "1:1 Coaching", short: "Coaching", tone: "teal" },
  { href: "/contact", label: "Contact", short: "Contact", tone: "slate", cta: true },
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
    <nav className="flex items-center gap-0.5 sm:gap-2">
      {items.map((it) => {
        const on = it.href === current;
        const tone = TONES[it.tone];
        const base = "whitespace-nowrap text-[11px] transition-all duration-150 min-[400px]:text-xs sm:text-sm";
        const cls = it.cta
          ? `${base} ml-0.5 rounded-full bg-purple-700 px-2 py-2 font-semibold text-white shadow-md shadow-purple-900/20 hover:-translate-y-0.5 hover:bg-purple-800 hover:shadow-lg active:translate-y-0 active:scale-95 min-[360px]:ml-1 min-[360px]:px-2.5 min-[400px]:px-3 sm:px-4 ${on ? "ring-2 ring-purple-300" : ""}`
          : `${base} rounded-t-lg border-b-2 px-0.5 py-1.5 font-semibold hover:-translate-y-0.5 active:scale-95 min-[360px]:px-1 min-[400px]:px-1.5 sm:rounded-full sm:border-b-0 sm:border-2 sm:px-4 sm:py-1.5 ${on ? `${tone.active} font-bold` : tone.idle}`;
        return (
          <Link key={it.href} href={it.href} aria-current={on ? "page" : undefined} className={`${cls} ${it.wideOnly ? "hidden sm:inline-block" : ""}`}>
            <span className="sm:hidden">{it.short}</span>
            <span className="hidden sm:inline">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
