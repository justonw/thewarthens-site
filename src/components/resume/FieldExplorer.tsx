import Link from "next/link";
import { careerPaths, type PathId } from "@/lib/quiz";
import { getStartHereForPath } from "@/lib/start-here";
import { providerName } from "@/lib/next-steps";

// "Explore career fields": every field we have a guide, pay data, or partner for, so a visitor can look
// around even if their own field is not obvious from their resume. Same data as the Tech Journey page.
const ORDER: PathId[] = ["sales", "itsec", "swe", "data", "uxui", "bizops", "supplychain", "trades", "healthcare"];

const k = (n: number) => `$${Math.round(n / 1000)}K`;

export default function FieldExplorer() {
  return (
    <div>
      <div className="space-y-3">
        {ORDER.map((id) => {
          const path = careerPaths[id];
          const guide = getStartHereForPath(id);
          const seen = new Set<string>();
          const links = path.links.filter((l) => {
            const key = `${l.href}|${l.label}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          return (
            <details key={id} className="group rounded-2xl border border-border-subtle bg-background-elevated">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5">
                <span>
                  <span className="block font-semibold">{path.title}</span>
                  <span className="block text-xs text-foreground-muted">
                    Typical entry-level pay {k(path.payLow)} to {k(path.payHigh)}
                  </span>
                </span>
                <span aria-hidden className="shrink-0 text-sm text-foreground-muted transition-transform group-open:rotate-180">
                  ⌄
                </span>
              </summary>
              <div className="px-5 pb-5">
                <p className="text-sm text-foreground-muted">{path.blurb}</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {guide && (
                    <li className="sm:col-span-2">
                      <Link
                        href={`/tech/start-here/${guide.slug}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-blue-500/30 bg-blue-500/5 px-4 py-3 text-sm font-medium transition-colors hover:border-blue-500/60"
                      >
                        <span>
                          Start here: the free guide to {path.title}
                          <span className="block text-xs font-normal text-foreground-muted">Free, from us</span>
                        </span>
                        <span aria-hidden>→</span>
                      </Link>
                    </li>
                  )}
                  {links.map((l) => (
                    <li key={`${l.href}|${l.label}`}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-background px-4 py-3 text-sm transition-colors hover:border-blue-500/40"
                      >
                        <span>
                          <span className="block font-medium">{l.label}</span>
                          <span className="block text-xs text-foreground-muted">
                            {path.affiliate ? `Partner program, by ${providerName(l.href)}` : `Neutral source, by ${providerName(l.href)}`}
                          </span>
                        </span>
                        <span aria-hidden className="text-foreground-muted">→</span>
                      </a>
                    </li>
                  ))}
                </ul>
                {!path.affiliate && (
                  <p className="mt-3 text-xs text-foreground-muted">We don&apos;t have a partner in this field, so this points to a neutral source.</p>
                )}
              </div>
            </details>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-foreground-muted">
        Not sure where you fit?{" "}
        <Link href="/tech#quiz" className="font-semibold text-blue-600 underline underline-offset-2">
          Take the free 2-minute career quiz
        </Link>
        .
      </p>
      <p className="mt-3 text-xs text-foreground-muted">
        Pay ranges are typical entry-level figures from 2026 sources and vary by place and employer. Some links are affiliate links. Some provide free content, while others offer paid opportunities that provide compensation for us, and some offer you discounts or incentives on their platforms.
      </p>
    </div>
  );
}
