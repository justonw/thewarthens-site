import Link from "next/link";
import type { Reading, Shelf } from "@/lib/faith-featured";

// One topic on /faith: a heading that says what a person can explore there, then everything to read about it.
// A featured piece gets a large card with links straight to its parts. The rest are easy-to-scan rows, numbered
// when they are meant to be read in order.

function Meta({ item }: { item: Reading }) {
  const bits = [item.author, item.minutes ? `${item.minutes} min read` : null].filter(Boolean);
  return (
    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs">
      <span className="rounded-full bg-purple-600/10 px-2.5 py-1 font-semibold text-purple-800">{item.kind}</span>
      {bits.length > 0 && <span className="text-foreground-muted">{bits.join(" · ")}</span>}
    </span>
  );
}

function Featured({ item }: { item: Reading }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-purple-600/25 bg-gradient-to-br from-background-elevated to-purple-600/[0.08] shadow-lg shadow-purple-950/5">
      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1.1fr_0.9fr] md:gap-8">
        <div className="flex flex-col items-start">
          <Meta item={item} />
          <h3 className="text-balance mt-4 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
            <Link href={item.href} className="hover:text-purple-800">
              {item.title}
            </Link>
          </h3>
          <p className="mt-3 text-foreground-muted">{item.blurb}</p>
          <Link
            href={item.href}
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-purple-700 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-purple-900/20 transition-colors hover:bg-purple-600"
          >
            {item.cta}
            <span aria-hidden>→</span>
          </Link>
        </div>
        {item.parts && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Inside this article</p>
            <ol className="mt-3 space-y-2.5">
              {item.parts.map((part, i) => (
                <li key={part.href}>
                  <Link
                    href={part.href}
                    className="group flex items-center gap-3.5 rounded-2xl border border-border-subtle bg-background-elevated p-3.5 transition-colors hover:border-purple-500/50"
                  >
                    <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-700 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm font-semibold leading-snug">{part.label}</span>
                    <span aria-hidden className="text-purple-700 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </article>
  );
}

function Row({ item, step }: { item: Reading; step?: number }) {
  return (
    <Link
      href={item.href}
      className="group flex gap-4 rounded-3xl border border-border-subtle bg-background-elevated p-5 transition-all hover:-translate-y-0.5 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-950/5 sm:gap-5 sm:p-6"
    >
      {step !== undefined && (
        <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-purple-700 text-base font-bold text-purple-800">
          {step}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <Meta item={item} />
        <h3 className="text-balance mt-3 text-lg font-semibold leading-snug sm:text-xl">
          {step !== undefined && <span className="sr-only">Part {step}: </span>}
          {item.title}
        </h3>
        <span className="mt-2 block text-sm text-foreground-muted">{item.blurb}</span>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700">
          {item.cta}
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </span>
      {item.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image.src} alt="" loading="lazy" className="hidden aspect-[4/3] w-44 shrink-0 self-center rounded-2xl object-cover sm:block" />
      )}
    </Link>
  );
}

export default function ReadingShelf({ shelf, number }: { shelf: Shelf; number: number }) {
  const featured = shelf.items.filter((item) => item.featured);
  const rest = shelf.items.filter((item) => !item.featured);
  return (
    <section id={shelf.id} aria-labelledby={`${shelf.id}-title`} className="scroll-mt-24 border-t border-border-subtle pt-10">
      <div className="grid gap-6 lg:grid-cols-[15rem_1fr] lg:gap-10">
        <header className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-700">
            Topic {number} · {shelf.items.length} to explore
          </p>
          <h2 id={`${shelf.id}-title`} className="text-balance mt-2 text-2xl font-semibold tracking-tight">
            {shelf.name}
          </h2>
          <p className="mt-2 text-sm text-foreground-muted">{shelf.intro}</p>
          {shelf.more && (
            <Link href={shelf.more.href} className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-purple-700 underline underline-offset-4 hover:text-purple-900">
              {shelf.more.label}
            </Link>
          )}
        </header>
        <div className="space-y-4">
          {featured.map((item) => (
            <Featured key={item.href} item={item} />
          ))}
          <ul className="space-y-4">
            {rest.map((item, i) => (
              <li key={item.href}>
                <Row item={item} step={shelf.inOrder ? i + 1 : undefined} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
