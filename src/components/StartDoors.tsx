import Link from "next/link";

// "Figuring out what's next?" A few doors that lead to the right place on the site, worded as what a person wants
// (not what is wrong with them). Practical ones first, gentler ones after.

type Door = { title: string; go: string; href: string };

const DOORS: Record<"tech" | "faith", Door[]> = {
  tech: [
    { title: "I'm looking for a career change", go: "Take the 2-minute quiz", href: "#quiz" },
    { title: "I need a better resume", go: "Tailor it to a job", href: "/resume" },
    { title: "I want to earn more", go: "See what tech roles pay", href: "#pay" },
    { title: "I'm curious about tech but don't know where to start", go: "Step-by-step starting paths", href: "#start-here" },
    { title: "I want to feel more settled", go: "Hear our story", href: "/jesus" },
    { title: "I'm in a season of change", go: "Get an occasional note from us", href: "/faith#stay-in-touch" },
  ],
  faith: [
    { title: "I want to feel more settled", go: "Hear our story", href: "/jesus" },
    { title: "I want something to read", go: "Studies and writings", href: "#writings" },
    { title: "I'm in a season of change", go: "Get an occasional note from us", href: "#stay-in-touch" },
    { title: "I'm also working on my career", go: "Explore Tech Journey", href: "/tech" },
  ],
};

export default function StartDoors({ variant }: { variant: "tech" | "faith" }) {
  const doors = DOORS[variant];
  const accent = variant === "tech" ? "hover:border-blue-500/50 hover:shadow-blue-900/10 text-blue-700" : "hover:border-purple-500/50 hover:shadow-purple-900/10 text-purple-700";
  return (
    <section aria-labelledby={`doors-${variant}`} className="mx-auto max-w-5xl px-6 pb-12">
      <div className="text-center">
        <h2 id={`doors-${variant}`} className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          Figuring out what&apos;s next? You&apos;re in the right place.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-balance text-foreground-muted">
          Whether it&apos;s a job, a season of life, or just a lot on your mind, start with whatever fits you today.
        </p>
      </div>
      <ul className={`mt-8 grid gap-3 sm:grid-cols-2 ${doors.length > 4 ? "lg:grid-cols-3" : ""}`}>
        {doors.map((d) => {
          const className = `group flex h-full min-h-[5.5rem] flex-col justify-between gap-3 rounded-2xl border border-border-subtle bg-background-elevated p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ${accent}`;
          const inner = (
            <>
              <span className="text-base font-semibold text-foreground">{d.title}</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                {d.go}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </>
          );
          return (
            <li key={d.title}>
              {d.href.startsWith("#") ? (
                <a href={d.href} className={className}>
                  {inner}
                </a>
              ) : (
                <Link href={d.href} className={className}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
