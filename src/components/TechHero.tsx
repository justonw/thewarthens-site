import Link from "next/link";
import Reveal from "@/components/Reveal";

// The top of the Tech Journey page: what this is, the two things most people come for, and the path in order.

const fields = ["Coding", "IT", "Cybersecurity", "Sales", "Marketing tech", "Healthcare tech", "UX", "The trades"];

const steps = [
  { href: "#quiz", title: "Find your path", note: "A 2-minute quiz about how you like to work" },
  { href: "#pay", title: "See the pay", note: "Real 2026 entry-level ranges for each path" },
  { href: "#start-here", title: "Start learning", note: "Free step-by-step guides, no course needed" },
  { href: "/resume", title: "Apply with confidence", note: "A resume tailored to the job, ready for the AI scan" },
];

export default function TechHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 45% at 15% 0%, rgba(56,189,248,0.22), transparent), radial-gradient(45% 40% at 95% 20%, rgba(139,92,246,0.14), transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(42,90,168,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(42,90,168,0.07) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 pt-12 pb-10 sm:pt-16 sm:pb-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            Tech Journey · Free to start
          </p>
          <h1 className="text-balance mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Your career is connected to your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">peace</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-foreground-muted sm:text-lg">
            Income problems become real problems: missing time with your family, driving for hours after your shift
            ends, watching bills pile up. Tech is the field that changed things for us, and the door is wider than most
            people think.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#quiz"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-900/20 transition-colors hover:bg-blue-500"
            >
              Take the 2-minute quiz
              <span aria-hidden>→</span>
            </a>
            <Link
              href="/resume"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border-subtle bg-background-elevated px-6 py-3 text-base font-semibold text-foreground transition-colors hover:border-blue-500/50 hover:text-blue-700"
            >
              Tailor your resume
            </Link>
          </div>
          <p className="mt-3 text-sm text-foreground-muted">No degree needed for most of these paths.</p>
          <ul aria-label="Paths covered" className="mt-6 flex flex-wrap gap-2">
            {fields.map((f) => (
              <li key={f} className="rounded-full border border-border-subtle bg-background-elevated px-3 py-1 text-sm font-medium text-foreground">
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-xl text-foreground-muted">
            This page is every resource we&apos;d hand a friend who&apos;s ready to think bigger than their current job.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <nav aria-label="Your path in four steps" className="rounded-3xl border border-border-subtle bg-background-elevated p-5 shadow-xl shadow-blue-950/5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Your path in four steps</p>
            <ol className="mt-4">
              {steps.map((s, i) => {
                const last = i === steps.length - 1;
                const inner = (
                  <>
                    <span className="relative flex flex-col items-center">
                      <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      {!last && <span aria-hidden className="mt-1 w-px flex-1 bg-gradient-to-b from-blue-500/50 to-blue-500/10" />}
                    </span>
                    <span className={`block min-w-0 ${last ? "" : "pb-5"}`}>
                      <span className="flex items-center gap-2 text-base font-semibold">
                        {s.title}
                        <span aria-hidden className="text-blue-600 transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                      <span className="mt-0.5 block text-sm text-foreground-muted">{s.note}</span>
                    </span>
                  </>
                );
                const cls = "group grid min-h-11 grid-cols-[2.25rem_1fr] gap-4 rounded-xl";
                return (
                  <li key={s.title}>
                    {s.href.startsWith("#") ? (
                      <a href={s.href} className={cls}>
                        {inner}
                      </a>
                    ) : (
                      <Link href={s.href} className={cls}>
                        {inner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </Reveal>
      </div>
    </section>
  );
}
