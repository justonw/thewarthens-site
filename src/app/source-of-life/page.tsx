import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import CopyLinkButton from "@/components/source/CopyLinkButton";
import ParadigmTest from "@/components/source/ParadigmTest";
import ScrollProgress from "@/components/source/ScrollProgress";
import TeachMode, { TeachButton, type TeachSection } from "@/components/source/TeachMode";
import VerseBlock from "@/components/source/VerseBlock";
import VerseLibrary from "@/components/source/VerseLibrary";
import Worksheet from "@/components/source/Worksheet";
import { verses } from "@/lib/source-of-life-verses";
import {
  PAGE_MODIFIED,
  PAGE_PATH,
  PAGE_PUBLISHED,
  PAGE_TAGLINE,
  PAGE_TITLE,
  acts,
  documentVerseCount,
  extraSections,
  faq,
  featuredFor,
  hurtingVerses,
  notSaying,
  prayer,
  restFor,
  sectionTitles,
  sections,
  seoDescription,
  seoTitle,
  verseByRef,
  versesFor,
} from "@/lib/source-of-life";

const site = "https://thewarthens.com";

export const metadata: Metadata = {
  title: { absolute: seoTitle },
  description: seoDescription,
  alternates: { canonical: PAGE_PATH },
  authors: [{ name: "Juston Warthen" }],
  keywords: [
    "is God in control of everything",
    "is God sovereign over evil",
    "does God allow evil",
    "Isaiah 45:7 meaning",
    "praise God in all circumstances",
    "God is the source of life",
    "why does God allow suffering Bible verses",
    "God and the devil are not equal",
    "Bible verses God is in control",
  ],
  openGraph: {
    title: `${PAGE_TITLE}: ${PAGE_TAGLINE}`,
    description: seoDescription,
    url: PAGE_PATH,
    siteName: "The Warthens",
    locale: "en_US",
    type: "article",
    publishedTime: PAGE_PUBLISHED,
    modifiedTime: PAGE_MODIFIED,
    authors: ["Juston Warthen"],
    section: "Faith Journey",
  },
  twitter: { card: "summary_large_image", title: `${PAGE_TITLE}: ${PAGE_TAGLINE}`, description: seoDescription },
};

const gold = "text-amber-300";
const eyebrow = "text-xs font-semibold uppercase tracking-[0.22em] text-amber-300";
const card = "rounded-3xl border border-white/10 bg-white/[0.04]";

function OurTake({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 rounded-2xl border border-violet-300/20 bg-violet-400/[0.07] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-300">Our take</p>
      <p className="mt-2 text-base leading-relaxed text-slate-200 sm:text-lg">{children}</p>
    </div>
  );
}

export default function SourceOfLifePage() {
  const url = `${site}${PAGE_PATH}`;
  const allSections = [...sections, ...extraSections.map((s) => ({ id: s.id, title: s.title }))];
  const teachSections: TeachSection[] = allSections.map((s) => ({
    id: s.id,
    title: sectionTitles[s.id],
    verses: versesFor(s.id).map((v) => ({ id: v.id, ref: v.ref, text: v.text })),
  }));

  const quotes = {
    job1: verseByRef("questions", "Job 1:12"),
    job2: verseByRef("questions", "Job 2:6"),
    daniel: verseByRef("wicked", "Daniel 9:14"),
    isaiah: verseByRef("source", "Isaiah 45:7"),
    romans: verseByRef("source", "Romans 11:36"),
  };
  const pick = (v: { ref: string; text: string }) => ({ ref: v.ref, text: v.text });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "The Warthens", item: site },
          { "@type": "ListItem", position: 2, name: "Faith Journey", item: `${site}/faith` },
          { "@type": "ListItem", position: 3, name: PAGE_TITLE, item: url },
        ],
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        mainEntityOfPage: url,
        url,
        headline: `${PAGE_TITLE}: why you can praise God anyway`,
        description: seoDescription,
        image: `${url}/opengraph-image`,
        datePublished: PAGE_PUBLISHED,
        dateModified: PAGE_MODIFIED,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        articleSection: "Faith Journey",
        author: { "@type": "Person", name: "Juston Warthen", url: site },
        publisher: {
          "@type": "Organization",
          name: "The Warthens",
          logo: { "@type": "ImageObject", url: `${site}/brand/icon-square.png` },
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <article className="relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ScrollProgress />
      <TeachMode sections={teachSections} />

      {/* Always-available way to the hurting path */}
      <a
        href="#hurting"
        className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-2 rounded-full border border-rose-300/40 bg-[#14172e]/90 px-4 py-2.5 text-sm font-semibold text-rose-100 shadow-lg shadow-black/40 backdrop-blur transition-colors hover:border-rose-300 hover:bg-[#1b1f3d] sm:bottom-6 sm:left-6"
      >
        <span aria-hidden>♡</span> Hurting right now?
      </a>

      {/* ------------------------------------------------ hero */}
      <header className="relative isolate">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 0%, rgba(120,73,206,0.38), transparent), radial-gradient(45% 40% at 85% 25%, rgba(50,120,206,0.22), transparent), radial-gradient(40% 35% at 12% 70%, rgba(244,196,90,0.12), transparent)",
          }}
        />
        <div className="mx-auto max-w-4xl px-6 pt-20 pb-20 text-center sm:pt-28 sm:pb-28">
          <p className={eyebrow}>Faith Journey with The Warthens</p>
          <h1 className="mt-6 font-serif text-6xl font-semibold tracking-tight text-white sm:text-8xl">{PAGE_TITLE}</h1>
          <p className="mt-4 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 bg-clip-text font-serif text-3xl italic text-transparent sm:text-5xl">
            {PAGE_TAGLINE}
          </p>
          <p className="text-balance mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
            Regardless of what happens, you can look to the Lord. Everything we perceive as good, bad, or evil is
            held in His hands, and He is the source of life. This is the Scripture behind that, and an invitation to
            look at your life through it.
          </p>
          <blockquote className="mx-auto mt-12 max-w-2xl font-serif text-xl italic leading-relaxed text-slate-100 sm:text-2xl">
            “{quotes.romans.text}”
            <footer className="mt-3 font-sans text-xs font-semibold not-italic uppercase tracking-[0.2em] text-amber-300">
              {quotes.romans.ref}
            </footer>
          </blockquote>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <a href="#test" className="rounded-full bg-amber-300 px-7 py-3.5 text-sm font-semibold text-[#0a0c1d] shadow-lg shadow-amber-300/20 transition-colors hover:bg-amber-200">
              Begin with a short test →
            </a>
            <a href="#library" className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-slate-100 transition-colors hover:border-amber-300/60">
              Browse every verse
            </a>
          </div>
          <dl className="mx-auto mt-14 grid max-w-md grid-cols-3 gap-4 text-center">
            {[
              [String(documentVerseCount), "passages"],
              [String(sections.length), "sections"],
              ["3", "acts"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="font-serif text-3xl text-white">{n}</dt>
                <dd className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* ------------------------------------------------ why + how to read */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <Reveal>
          <p className={eyebrow}>Why this page exists</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">Good is not always God, and bad is not always the devil.</h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-slate-300">
            <p>
              Juston started this collection after being let down over the state of his life, and after hearing a
              message that sounded simple: whatever good happens to you is God, and whatever bad happens to you is the
              devil. It felt like a quiet way of dumbing down who God really is.
            </p>
            <p>
              When that is missed, we start chasing what feels good. We avoid the hard question of why God allowed
              something. And our attention slides off God and onto the devil when it never needed to. The devil and God
              are not equal.
            </p>
            <p>
              What we call good and bad is our paradigm, the lens we look through. It does not mean it lines up with
              truth. Even in the Garden there was a tree of the knowledge of good and evil. We do not claim the full
              revelation, but we wonder if our trouble began when we started sorting good and evil by our own knowledge.
              Our aim is one lens: Christ, who is truth.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className={`${card} mt-10 p-6 sm:p-8`}>
            <p className="text-sm font-semibold text-white">How to read this page</p>
            <p className="mt-2 text-slate-400">
              Some of this is Scripture and some of it is our perspective. We keep them visibly apart so you can weigh each one.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="border-l-2 border-amber-300/60 pl-4">
                <p className="font-serif text-lg text-slate-100">Gold line, serif type: the Bible itself, in the King James Version.</p>
              </div>
              <div className="rounded-2xl border border-violet-300/20 bg-violet-400/[0.07] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-300">Our take</p>
                <p className="mt-1 text-base text-slate-200">Purple box: what we think it means. Not the hill we die on.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------ paradigm test */}
      <section id="test" className="scroll-mt-20 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className={eyebrow}>Before you read</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-5xl">Who is behind it?</h2>
          <p className="text-balance mx-auto mt-4 max-w-xl text-lg text-slate-300">
            Seven everyday moments. Tap the first answer that comes to mind. Nothing is scored, and nothing is saved.
          </p>
        </div>
        <div className="mt-10">
          <ParadigmTest
            quotes={{
              job1: pick(quotes.job1),
              job2: pick(quotes.job2),
              daniel: pick(quotes.daniel),
              isaiah: pick(quotes.isaiah),
              romans: pick(quotes.romans),
            }}
          />
        </div>
      </section>

      {/* ------------------------------------------------ the three acts */}
      {acts.map((act) => (
        <div key={act.number} id={`act-${act.number}`} className="scroll-mt-20">
          <div className="relative px-6 py-24 text-center">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-0"
              style={{ background: "radial-gradient(45% 60% at 50% 50%, rgba(244,196,90,0.09), transparent)" }}
            />
            <Reveal>
              <p className={`${eyebrow} relative`}>Act {act.number === 1 ? "I" : act.number === 2 ? "II" : "III"}</p>
              <h2 className="relative mt-3 font-serif text-5xl font-semibold text-white sm:text-7xl">{act.name}</h2>
              <p className="relative mt-3 font-serif text-xl italic text-amber-200 sm:text-2xl">{act.line}</p>
              <p className="text-balance relative mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">{act.intro}</p>
              {act.number === 2 && (
                <a href="#hurting" className="relative mt-6 inline-block text-sm font-semibold text-rose-200 underline underline-offset-4 hover:text-rose-100">
                  I am hurting right now, take me to the hurting path
                </a>
              )}
            </Reveal>
          </div>

          <div className="mx-auto max-w-3xl space-y-24 px-6 pb-24">
            {sections
              .filter((s) => s.act === act.number)
              .map((s) => {
                const number = sections.findIndex((x) => x.id === s.id) + 1;
                const rest = restFor(s);
                const featured = featuredFor(s);
                let lastGroup: string | undefined;
                return (
                  <section key={s.id} id={s.id} className="scroll-mt-24">
                    <Reveal>
                      <div className="flex items-start gap-4">
                        <span className="font-serif text-5xl leading-none text-amber-300/30 sm:text-6xl">{String(number).padStart(2, "0")}</span>
                        <h3 className="font-serif text-2xl font-semibold leading-snug text-white sm:text-3xl">{s.title}</h3>
                      </div>
                      <OurTake>{s.take}</OurTake>
                      {s.note && <p className="mt-3 text-sm italic text-slate-400">{s.note}</p>}
                    </Reveal>
                    <div className="mt-9 space-y-9">
                      {featured.map((v) => (
                        <Reveal key={v.id}>
                          <VerseBlock verse={v} size="featured" />
                        </Reveal>
                      ))}
                    </div>
                    {rest.length > 0 && (
                      <details className="group mt-10 rounded-2xl border border-white/10 bg-white/[0.03] open:border-amber-300/30">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-slate-100">
                          <span>See all {versesFor(s.id).length} verses in this section</span>
                          <span aria-hidden className="text-amber-300 transition-transform duration-200 group-open:rotate-45">+</span>
                        </summary>
                        <div className="space-y-7 px-5 pb-6 pt-2">
                          {rest.map((v) => {
                            const heading = v.group && v.group !== lastGroup ? v.group : null;
                            lastGroup = v.group;
                            return (
                              <div key={v.id}>
                                {heading && <p className="mb-4 mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">{heading}</p>}
                                <VerseBlock verse={v} />
                              </div>
                            );
                          })}
                        </div>
                      </details>
                    )}
                    <div className="mt-5">
                      <TeachButton
                        sectionId={s.id}
                        className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-amber-300/60 hover:text-amber-200"
                      >
                        Teach this section, one verse at a time
                      </TeachButton>
                    </div>
                  </section>
                );
              })}
          </div>
        </div>
      ))}

      {/* ------------------------------------------------ the one lens */}
      <section className="px-6 py-20">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className={eyebrow}>The one lens</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-5xl">Why not turn to Christ as the singular focus?</h2>
            <p className="text-balance mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
              God causes all things to work together for good for those who love Him. In Christ it all works out. In
              Christ every power, throne, and dominion was created by Christ and for Christ. So make Him the paradigm,
              the lens through which you view and approach all of life.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl space-y-8">
            <VerseBlock verse={verseByRef("questions", "Romans 8:28")} size="featured" domId="lens-romans-8-28" />
            <VerseBlock verse={verseByRef("jesus", "Colossians 1:12-16")} size="featured" domId="lens-colossians-1-12-16" />
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------ current state */}
      <section id="state" className="scroll-mt-20 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className={eyebrow}>Take accountability</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-5xl">Your current state</h2>
          <p className="text-balance mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            We take accountability because that is the current state. When we understand where we are and why, we can
            trust God into the next one. If we misread it, or forget that God is in control and that we can go to our
            Father by the blood of Jesus, we miss what our salvation is worth.
          </p>
        </div>
        <div className="mt-10">
          <Worksheet />
        </div>
      </section>

      {/* ------------------------------------------------ honest questions */}
      <section id="questions" className="scroll-mt-20 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className={eyebrow}>Honest questions</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-5xl">What a careful reader will ask</h2>
          </div>
          <div className="mt-10 space-y-3">
            {faq.map((f) => (
              <details key={f.question} className="group rounded-2xl border border-white/10 bg-white/[0.04] open:border-amber-300/30">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-white">
                  <span>{f.question}</span>
                  <span aria-hidden className="shrink-0 text-amber-300 transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <div className="px-5 pb-6">
                  <OurTake>{f.answer}</OurTake>
                  <div className="mt-6 space-y-6">
                    {f.refs.map((r) => (
                      <VerseBlock key={`${f.question}-${r.ref}`} verse={verseByRef(r.section, r.ref)} domId={`q-${r.section}-${r.ref.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`} />
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">What we are not saying</p>
            <ul className="mt-4 space-y-3 text-base text-slate-300">
              {notSaying.map((n) => (
                <li key={n} className="flex gap-3">
                  <span aria-hidden className={gold}>•</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ hurting path */}
      <section id="hurting" className="relative scroll-mt-20 px-6 py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(55% 60% at 50% 40%, rgba(251,113,133,0.10), transparent)" }}
        />
        <div className="relative mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-200">If you are hurting right now</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-5xl">Start here. You do not have to settle any debate first.</h2>
            <p className="text-balance mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
              Nothing on this page asks you to pretend it does not hurt. Come as you are. David did, and so can you.
            </p>
          </div>
          <div className="mt-10 space-y-8">
            {hurtingVerses.map((h) => (
              <VerseBlock key={`${h.section}-${h.ref}`} verse={verseByRef(h.section, h.ref)} size="featured" domId={`h-${h.section}-${h.ref.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`} />
            ))}
          </div>
          <div className="mt-10 rounded-3xl border border-rose-200/20 bg-rose-300/[0.06] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-200">A simple prayer</p>
            <p className="mt-3 font-serif text-xl leading-relaxed text-slate-100 sm:text-2xl">{prayer}</p>
          </div>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-slate-300 sm:p-8">
            <p>
              If you are in crisis or thinking about hurting yourself, please call or text <strong className="text-white">988</strong> (in
              the U.S.) or contact your local emergency number right now. This page is Scripture and our perspective. It is not counseling.
            </p>
            <p className="mt-3">
              You can also{" "}
              <Link href="/contact#message" className="font-semibold text-amber-300 underline underline-offset-4">write to us</Link>. We read every message.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ library */}
      <section id="library" className="scroll-mt-20 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className={eyebrow}>Come back to it</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-5xl">Every verse, searchable</h2>
          <p className="text-balance mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            Search a word, filter by section, copy a verse, or send one to someone who needs it today.
          </p>
        </div>
        <div className="mt-10">
          <VerseLibrary verses={verses} sections={allSections.map((s) => ({ id: s.id, title: sectionTitles[s.id] }))} />
        </div>
      </section>

      {/* ------------------------------------------------ close */}
      <section className="relative px-6 pt-20 pb-28 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(50% 60% at 50% 100%, rgba(244,196,90,0.14), transparent)" }}
        />
        <Reveal>
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-serif text-4xl font-semibold text-white sm:text-6xl">{PAGE_TAGLINE}</h2>
            <p className="text-balance mt-6 text-lg leading-relaxed text-slate-300">
              Whatever happens, the Lord is in control and the Father is open to you by the blood of Jesus. Look to Him.
              If you see something here differently, we would genuinely like to hear it.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <CopyLinkButton url={url} className="rounded-full bg-amber-300 px-7 py-3.5 text-sm font-semibold text-[#0a0c1d] shadow-lg shadow-amber-300/20 transition-colors hover:bg-amber-200" />
              <Link href="/contact#message" className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-slate-100 transition-colors hover:border-amber-300/60">
                Tell us what changed in your thinking
              </Link>
              <Link href="/faith" className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-slate-100 transition-colors hover:border-amber-300/60">
                More from Faith Journey
              </Link>
            </div>
            <p className="mt-12 text-xs text-slate-500">
              Scripture quotations are from the King James Version of the Bible, which is in the public domain.
            </p>
          </div>
        </Reveal>
      </section>
    </article>
  );
}
