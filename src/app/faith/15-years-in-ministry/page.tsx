import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionNav from "@/components/source/SectionNav";
import {
  MINISTRY_MODIFIED,
  MINISTRY_PATH,
  MINISTRY_PUBLISHED,
  MINISTRY_TITLE,
  NLT_NOTICE,
  audience,
  closing,
  dek,
  lessons,
  ministrySeoDescription,
  ministrySeoTitle,
} from "@/lib/atiya-ministry";

const site = "https://thewarthens.com";

export const metadata: Metadata = {
  title: { absolute: ministrySeoTitle },
  description: ministrySeoDescription,
  alternates: { canonical: MINISTRY_PATH },
  authors: [{ name: "Atiya Warthen" }],
  openGraph: {
    title: ministrySeoTitle,
    description: ministrySeoDescription,
    url: MINISTRY_PATH,
    siteName: "The Warthens",
    locale: "en_US",
    type: "article",
    publishedTime: MINISTRY_PUBLISHED,
    modifiedTime: MINISTRY_MODIFIED,
    authors: ["Atiya Warthen"],
    section: "Faith Journey",
  },
  twitter: { card: "summary_large_image", title: ministrySeoTitle, description: ministrySeoDescription },
};

const eyebrow = "text-xs font-semibold uppercase tracking-[0.22em] text-sol-gold";
const navItems = [
  { id: "lesson-1", label: "1. Know God and His Word" },
  { id: "lesson-2", label: "2. Humility" },
  { id: "lesson-3", label: "3. Serve, not their opinions" },
  { id: "obey", label: "Obey Him" },
];

export default function MinistryPage() {
  const url = `${site}${MINISTRY_PATH}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "The Warthens", item: site },
          { "@type": "ListItem", position: 2, name: "Faith Journey", item: `${site}/faith` },
          { "@type": "ListItem", position: 3, name: MINISTRY_TITLE, item: url },
        ],
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        mainEntityOfPage: url,
        url,
        headline: MINISTRY_TITLE,
        description: ministrySeoDescription,
        datePublished: MINISTRY_PUBLISHED,
        dateModified: MINISTRY_MODIFIED,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        articleSection: "Faith Journey",
        author: { "@type": "Person", name: "Atiya Warthen", url: `${site}/about` },
        publisher: { "@type": "Organization", name: "The Warthens", logo: { "@type": "ImageObject", url: `${site}/brand/icon-square.png` } },
      },
    ],
  };

  return (
    <article className="relative overflow-x-clip">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ------------------------------------------------ hero */}
      <header className="relative isolate">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(60% 50% at 50% 0%, rgba(91,43,191,0.10), transparent), radial-gradient(40% 35% at 92% 20%, rgba(224,165,38,0.18), transparent)" }}
        />
        <div className="mx-auto max-w-4xl px-6 pb-12 pt-14 text-center sm:pt-20">
          <p className={eyebrow}>
            <Link href="/faith" className="hover:underline">Faith Journey</Link> · Atiya Warthen
          </p>
          <h1 className="text-balance mt-5 font-sol text-4xl font-semibold leading-[1.1] tracking-tight text-sol-ink sm:text-6xl">{MINISTRY_TITLE}</h1>
          <p className="text-balance mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-sol-ink/80 sm:text-xl">{dek}</p>

          <ol className="mx-auto mt-10 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
            {lessons.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="flex h-full flex-col rounded-2xl border border-sol-line bg-sol-card p-4 transition-colors hover:border-sol-gold/60">
                  <span aria-hidden className="font-sol text-3xl leading-none text-sol-gold">{l.n}</span>
                  <span className="mt-2 text-sm font-semibold text-sol-ink">{l.title}</span>
                  <span className="mt-1 text-sm text-sol-muted">{l.summary}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </header>

      <SectionNav items={navItems} />

      {/* ------------------------------------------------ who this is for */}
      <section className="mx-auto max-w-4xl px-6 py-14">
        <Reveal>
          <p className={`${eyebrow} text-center`}>Who this is for</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {audience.map((a) => (
              <div key={a.label} className="rounded-3xl border border-sol-line bg-sol-card p-6 sm:p-7">
                <p className="font-sol text-2xl font-semibold text-sol-ink">{a.label}</p>
                <p className="mt-3 text-base leading-relaxed text-sol-ink/80">{a.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------ the lessons */}
      {lessons.map((l, i) => (
        <section key={l.id} id={l.id} className={`scroll-mt-32 px-6 py-16 sm:py-20 ${i % 2 === 1 ? "bg-sol-card/60" : ""}`}>
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <div className="flex items-start gap-4 sm:gap-6">
                <span aria-hidden className="font-sol text-7xl leading-none text-sol-gold/40 sm:text-8xl">{l.n}</span>
                <div className="pt-1">
                  <p className={eyebrow}>Lesson {l.n}</p>
                  <h2 className="text-balance mt-1 font-sol text-3xl font-semibold leading-tight text-sol-ink sm:text-4xl">{l.title}</h2>
                </div>
              </div>
            </Reveal>

            <div className="mt-10 space-y-7">
              {l.blocks.map((b, bi) =>
                b.kind === "p" ? (
                  <Reveal key={bi}>
                    {b.lead ? (
                      <p className="border-l-4 border-sol-gold pl-5 font-sol text-2xl leading-snug text-sol-ink sm:text-3xl sm:leading-snug">{b.text}</p>
                    ) : (
                      <p className="text-xl leading-relaxed text-sol-ink/90">{b.text}</p>
                    )}
                  </Reveal>
                ) : (
                  <Reveal key={bi}>
                    <aside aria-label="Scripture" className="rounded-3xl border border-sol-gold/30 bg-sol-paper p-5 shadow-sm shadow-sol-ink/5 sm:p-7">
                      <div className="space-y-5">
                        {b.passages.map((p) => (
                          <figure key={p.ref}>
                            <blockquote className="font-sol text-xl italic leading-relaxed text-sol-ink sm:text-2xl sm:leading-relaxed">{p.text}</blockquote>
                            <figcaption className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-sol-gold">
                              {p.ref} <span className="font-normal text-sol-muted">NLT</span>
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                      <p className="mt-5 rounded-2xl bg-sol-violet/[0.07] px-4 py-3 text-base leading-relaxed text-sol-ink">{b.why}</p>
                    </aside>
                  </Reveal>
                ),
              )}
            </div>

          </div>
        </section>
      ))}

      {/* ------------------------------------------------ closing */}
      <section id="obey" className="sol-night scroll-mt-32 bg-sol-paper px-6 py-20 text-center text-sol-ink sm:py-28">
        <Reveal>
          <p className={eyebrow}>The close</p>
          <h2 className="mt-3 font-sol text-4xl font-semibold sm:text-6xl">{closing.title}</h2>
          <div className="text-balance mx-auto mt-8 max-w-2xl space-y-5 font-sol text-2xl leading-snug text-sol-ink/90 sm:text-3xl sm:leading-snug">
            {closing.lines.map((c) => (
              <p key={c}>{c}</p>
            ))}
          </div>
        </Reveal>
      </section>

      <footer className="mx-auto max-w-3xl px-6 py-10 text-xs leading-relaxed text-sol-muted">
        <p>
          By Atiya Warthen. More from <Link href="/faith" className="font-semibold underline underline-offset-4">Faith Journey</Link>.
        </p>
        <p className="mt-3">{NLT_NOTICE}</p>
      </footer>
    </article>
  );
}
