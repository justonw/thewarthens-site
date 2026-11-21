import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SourcesToggle from "@/components/SourcesToggle";
import { TEN_K_DISCLAIMER, TEN_K_IDEAS, TEN_K_SOURCES, TEN_K_UPDATED } from "@/lib/ten-k";

// The page linked from the "10 ways to make $10,000 a month" video description. It is also the talk-through for filming:
// each idea is a card with the same parts in the same order (what it is, who it fits, how to start, the math, the reality check).

const title = "10 Ways to Make $10,000 a Month";
const description =
  "Ten out-of-the-box ways to reach $10,000 a month, each with who it fits, how to start, and the math. The last one uses your job as the tool. Examples, not promises.";

export const metadata: Metadata = {
  title: { absolute: `${title} | The Warthens` },
  description,
  alternates: { canonical: "/10k" },
  openGraph: { title, description, url: "/10k" },
  twitter: { card: "summary_large_image", title, description },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  dateModified: "2026-11-21",
  inLanguage: "en-US",
  author: { "@type": "Organization", name: "The Warthens", url: "https://thewarthens.com" },
  publisher: { "@type": "Organization", name: "The Warthens", url: "https://thewarthens.com" },
};

const label = "text-xs font-semibold uppercase tracking-wider text-foreground-muted";

export default function TenKPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: "radial-gradient(60% 50% at 15% 0%, rgba(250,204,21,0.18), transparent), radial-gradient(45% 40% at 95% 15%, rgba(139,92,246,0.14), transparent)" }} />
        <div className="mx-auto max-w-3xl px-6 pb-8 pt-14 sm:pt-20">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Think outside the box · Updated {TEN_K_UPDATED}</p>
            <h1 className="text-balance mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">10 Ways to Make $10,000 a Month</h1>
            <p className="mt-4 text-lg text-foreground-muted">
              Some are odd. Some are old tricks with a twist. One is a job. Each one shows who it fits, how to start, and the math it takes to reach $10,000 in a month, so you can decide for yourself.
            </p>
            <p className="mt-5 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
              <span className="font-semibold">Read this first:</span> {TEN_K_DISCLAIMER}
            </p>
          </Reveal>

          <nav aria-label="The ten ideas" className="mt-7">
            <ol className="flex flex-wrap gap-2">
              {TEN_K_IDEAS.map((idea) => (
                <li key={idea.n}>
                  <a href={`#idea-${idea.n}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border-subtle bg-background-elevated px-3.5 py-2 text-sm font-semibold hover:border-blue-500/50">
                    <span aria-hidden>{idea.emoji}</span>
                    {idea.n}. {idea.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-8 px-6 pb-10">
        {TEN_K_IDEAS.map((idea) => {
          const last = idea.n === 10;
          return (
            <Reveal key={idea.n}>
              <article id={`idea-${idea.n}`} className={`scroll-mt-24 rounded-3xl border p-6 sm:p-8 ${last ? "border-blue-500/40 bg-blue-500/5" : "border-border-subtle bg-background-elevated"}`}>
                <p className="flex items-center gap-3 text-sm font-semibold text-foreground-muted">
                  <span aria-hidden className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
                    {idea.n}
                  </span>
                  <span aria-hidden className="text-2xl">
                    {idea.emoji}
                  </span>
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{idea.title}</h2>
                <p className="mt-1 text-base font-medium text-blue-700">{idea.hook}</p>

                <h3 className={`${label} mt-6`}>What it is</h3>
                <p className="mt-1.5 text-base">{idea.what}</p>

                <h3 className={`${label} mt-6`}>You might be good at this if</h3>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-base">
                  {idea.goodIf.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>

                <h3 className={`${label} mt-6`}>How to get started</h3>
                <ol className="mt-1.5 list-decimal space-y-1.5 pl-5 text-base">
                  {idea.start.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>

                <h3 className={`${label} mt-6`}>The math to $10,000</h3>
                <p className="mt-1.5 rounded-2xl bg-white/70 px-4 py-3 text-base font-medium">{idea.math}</p>

                <h3 className={`${label} mt-6`}>Reality check</h3>
                <p className="mt-1.5 text-base text-foreground-muted">{idea.reality}</p>

                {last && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/tech/guides/tech-sales-hype-vs-reality" className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-500">
                      Read the honest guide to tech sales
                    </Link>
                    <Link href="/tech#quiz" className="inline-flex min-h-12 items-center justify-center rounded-full border border-border-subtle bg-background-elevated px-6 py-3 text-base font-semibold hover:border-blue-500/50">
                      Take the free 2-minute career quiz
                    </Link>
                  </div>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>

      <section className="mx-auto max-w-3xl space-y-4 px-6 pb-16">
        <SourcesToggle sources={TEN_K_SOURCES} />
        <p className="text-xs text-foreground-muted">{TEN_K_DISCLAIMER}</p>
      </section>
    </>
  );
}
