import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import Reveal from "@/components/Reveal";
import CopyLinkButton from "@/components/source/CopyLinkButton";
import ParadigmTest from "@/components/source/ParadigmTest";
import FoundationVisual from "@/components/source/FoundationVisual";
import HouseProgress from "@/components/source/HouseProgress";
import SectionNav, { type NavItem } from "@/components/source/SectionNav";
import TeachMode, { TeachButton } from "@/components/source/TeachMode";
import VerseBlock from "@/components/source/VerseBlock";
import LibraryLoader from "@/components/source/LibraryLoader";
import Worksheet from "@/components/source/Worksheet";
import {
  PAGE_MODIFIED,
  PAGE_PATH,
  PAGE_PUBLISHED,
  PAGE_TAGLINE,
  PAGE_TITLE,
  acts,
  documentVerseCount,
  faq,
  featuredFor,
  hurtingVerses,
  notSaying,
  prayer,
  restFor,
  sections,
  seoDescription,
  seoKeywords,
  seoTitle,
  shortAnswer,
  shareDescription,
  shareTitle,
  verseByRef,
  versesFor,
} from "@/lib/source-of-life";

const site = "https://thewarthens.com";

export const metadata: Metadata = {
  title: { absolute: seoTitle },
  description: seoDescription,
  alternates: { canonical: PAGE_PATH },
  authors: [{ name: "Juston Warthen" }],
  keywords: seoKeywords,
  openGraph: {
    title: shareTitle,
    description: shareDescription,
    url: PAGE_PATH,
    siteName: "The Warthens",
    locale: "en_US",
    type: "article",
    publishedTime: PAGE_PUBLISHED,
    modifiedTime: PAGE_MODIFIED,
    authors: ["Juston Warthen"],
    section: "Faith Journey",
  },
  twitter: { card: "summary_large_image", title: shareTitle, description: shareDescription },
};

const LIGHT = "#fbf8f2";
const NIGHT = "#0b0d22";

// A soft hand-off between the warm paper and the navy bands, so the page changes mood without a hard edge.
function Fade({ from, to }: { from: string; to: string }) {
  return <div aria-hidden className="h-24 sm:h-36" style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }} />;
}

const navItems: NavItem[] = [
  { id: "test", label: "The test" },
  { id: "why", label: "Why" },
  { id: "foundation", label: "Foundation" },
  { id: "act-1", label: "Know Him" },
  { id: "act-2", label: "See Him" },
  { id: "act-3", label: "Come to Him" },
  { id: "state", label: "Your state" },
  { id: "questions", label: "Questions" },
  { id: "hurting", label: "Hurting?" },
  { id: "library", label: "All verses" },
];

const gold = "text-sol-gold";
const eyebrow = "text-xs font-semibold uppercase tracking-[0.22em] text-sol-gold";
const card = "rounded-3xl border border-sol-line bg-sol-card";

function OurTake({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 rounded-2xl border border-sol-violet/30 bg-sol-violet/[0.07] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sol-violet">My take</p>
      <p className="mt-2 text-base leading-relaxed text-sol-ink sm:text-lg">{children}</p>
    </div>
  );
}

export default function SourceOfLifePage() {
  const url = `${site}${PAGE_PATH}`;
  const quotes = {
    job1: verseByRef("questions", "Job 1:12"),
    job2: verseByRef("questions", "Job 2:6"),
    daniel: verseByRef("wicked", "Daniel 9:14"),
    isaiah: verseByRef("source", "Isaiah 45:7"),
    romans: verseByRef("source", "Romans 11:36"),
    grace: verseByRef("questions", "Romans 8:28"),
    mystery: verseByRef("understand", "Isaiah 55:8-9"),
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
        headline: shareTitle,
        description: seoDescription,
        image: `${url}/opengraph-image`,
        datePublished: PAGE_PUBLISHED,
        dateModified: PAGE_MODIFIED,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        articleSection: "Faith Journey",
        keywords: seoKeywords.join(", "),
        about: [
          { "@type": "Thing", name: "Sovereignty of God" },
          { "@type": "Thing", name: "Problem of evil" },
          { "@type": "Thing", name: "Bible" },
        ],
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
    <article className="relative overflow-x-clip">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HouseProgress />
      <TeachMode />

      {/* Always-available way to the hurting path */}
      <a
        href="#hurting"
        className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-2 rounded-full border border-sol-rose/30 bg-sol-paper/95 px-4 py-2.5 text-sm font-semibold text-sol-rose shadow-lg shadow-sol-ink/15 backdrop-blur transition-colors hover:border-sol-rose hover:bg-sol-card sm:bottom-6 sm:left-6"
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
              "radial-gradient(60% 50% at 50% 0%, rgba(91,43,191,0.11), transparent), radial-gradient(40% 35% at 92% 18%, rgba(224,165,38,0.18), transparent), radial-gradient(38% 34% at 6% 62%, rgba(29,99,168,0.08), transparent)",
          }}
        />
        <div className="mx-auto max-w-5xl px-6 pt-16 pb-16 text-center sm:pt-24 sm:pb-24">
          <p className={eyebrow}>{PAGE_TITLE} · Faith Journey with The Warthens</p>
          <h1 className="mt-7 font-sol font-semibold tracking-tight text-sol-ink">
            <span className="block text-4xl leading-[1.1] sm:text-6xl lg:text-[4.25rem] lg:leading-[1.08]">Good is not always God.</span>
            <span className="mt-2 block pb-3 text-4xl italic leading-[1.2] text-sol-violet sm:text-6xl lg:text-[4.25rem] lg:leading-[1.15]">
              “Bad” is not always the devil.
            </span>
          </h1>
          <p className="text-balance mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-sol-ink/80 sm:text-xl">
            Everything is held in God’s hands, so you can come to the Father in all of it. Here is the Scripture behind that,
            and a way to look at your own life through it.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm italic text-sol-muted">
            A study by Juston Warthen. Written from conviction, not claiming the full picture, and open to other views.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href="#test" className="rounded-full bg-sol-primary px-7 py-3.5 text-sm font-semibold text-sol-on-primary shadow-lg shadow-sol-primary/20 transition-colors hover:bg-sol-primary/90">
              Take the 2-minute test →
            </a>
            <a href="#library" className="rounded-full border border-sol-line px-7 py-3.5 text-sm font-semibold text-sol-ink transition-colors hover:border-sol-gold/60">
              Browse every verse
            </a>
          </div>
          <ul className="mx-auto mt-12 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
            {[
              ["1", "A short test", "See how you already sort good and bad."],
              ["2", "The Scripture", `${documentVerseCount} passages in three acts, King James Version.`],
              ["3", "A worksheet", "Take honest stock of where you are right now."],
            ].map(([n, t, d]) => (
              <li key={n} className="rounded-2xl border border-sol-line bg-sol-card p-4">
                <p className="font-sol text-2xl text-sol-gold">{n}</p>
                <p className="mt-1 text-sm font-semibold text-sol-ink">{t}</p>
                <p className="mt-1 text-sm text-sol-muted">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <SectionNav items={navItems} />

      {/* ------------------------------------------------ paradigm test */}
      <Fade from={LIGHT} to={NIGHT} />
      <section id="test" className="sol-night scroll-mt-32 bg-sol-paper px-6 py-10 text-sol-ink sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className={eyebrow}>Before you read</p>
          <h2 className="mt-3 font-sol text-3xl font-semibold text-sol-ink sm:text-5xl">Who is behind it?</h2>
          <p className="text-balance mx-auto mt-4 max-w-xl text-lg text-sol-ink/80">
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
              grace: pick(quotes.grace),
              mystery: pick(quotes.mystery),
            }}
          />
        </div>
      </section>
      <Fade from={NIGHT} to={LIGHT} />

      {/* ------------------------------------------------ why + how to read */}
      <section id="why" className="mx-auto max-w-3xl scroll-mt-32 px-6 pb-20">
        <Reveal>
          <div className="rounded-3xl border border-sol-gold/30 bg-sol-card p-6 shadow-sm shadow-sol-ink/5 sm:p-8">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-sol-gold">The short answer</h2>
            <p className="mt-3 font-sol text-xl leading-relaxed text-sol-ink sm:text-2xl sm:leading-relaxed">{shortAnswer}</p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <p className={`${eyebrow} mt-16`}>Why I made this</p>
          <h2 className="mt-3 font-sol text-3xl font-semibold text-sol-ink sm:text-4xl">Where this started.</h2>
          <p className="mt-2 text-sm text-sol-muted">By Juston Warthen</p>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-sol-ink/80">
            <p>
              It started with a statement from a pulpit: whatever good happens in your life is God, and whatever bad
              happens in your life is the devil. It sounded simple, and it did not sit right with what I was reading. I
              had also been let down by the state of my own life, so the question was not abstract for me. I wanted a
              more thorough look, so over time I started collecting Scripture. This page is that collection.
            </p>
            <p>
              I am grateful for the people who teach faithfully, and I am not writing against anyone. But I came to feel
              that idea can quietly dumb down who God is. When that is missed, we start chasing what feels good, we avoid
              the hard question of why God allowed something, and our attention slides off God and onto the devil when it
              never needed to. The devil and God are not equal.
            </p>
            <p>
              What I call good and bad is my paradigm, the lens I look through. It does not mean it lines up with truth.
              Even in the Garden there was a tree of the knowledge of good and evil. I do not claim the full revelation,
              but I wonder if our trouble began when we started sorting good and evil by our own knowledge. My aim is one
              lens: Christ, who is truth.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 rounded-3xl border border-sol-violet/30 bg-sol-violet/[0.07] p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sol-violet">Where I stand</p>
            <p className="mt-3 text-lg leading-relaxed text-sol-ink">
              I believe what is on this page. I am not claiming to have the absolute full picture, and I am open to other views. Please test it for yourself, the way the Bereans did.
            </p>
            <div className="mt-5">
              <VerseBlock verse={verseByRef("questions", "Acts 17:11")} domId="why-acts-17-11" />
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className={`${card} mt-6 p-6 sm:p-8`}>
            <p className="text-sm font-semibold text-sol-ink">How to read this page</p>
            <p className="mt-2 text-sol-muted">
              Some of this is Scripture and some of it is my perspective. I keep them visibly apart so you can weigh each one.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="border-l-2 border-sol-gold/60 pl-4">
                <p className="font-sol text-lg text-sol-ink">Gold line, serif type: the Bible itself, in the King James Version.</p>
              </div>
              <div className="rounded-2xl border border-sol-violet/30 bg-sol-violet/[0.07] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sol-violet">My take</p>
                <p className="mt-1 text-base text-sol-ink">Purple box: what I think it means, open to other views.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------ the foundation */}
      <section id="foundation" className="scroll-mt-32 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="text-center">
              <p className={eyebrow}>The foundation</p>
              <h2 className="mt-3 font-sol text-3xl font-semibold text-sol-ink sm:text-5xl">Check the foundation before you build.</h2>
              <p className="text-balance mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-sol-ink/80">
                A wrong view of God, or of what good and bad really mean, means we begin on a cracked or unsettled
                foundation. Then the whole house goes up from there, and we have not yet truly lived in truth.
              </p>
            </div>
            <FoundationVisual
              cracked={{
                title: "A cracked foundation",
                lines: [
                  "Good is God, and bad is the devil.",
                  "My own paradigm decides what is good and bad.",
                  "I chase what feels good and avoid the hard questions.",
                ],
              }}
              solid={{
                title: "A solid foundation",
                lines: [
                  "God is the source of life and in control of all things.",
                  "I see my current state honestly and take accountability.",
                  "I go to the Father by the blood of Jesus, in the good and the bad.",
                ],
              }}
            />
            <p className="text-balance mx-auto mt-8 max-w-2xl text-center text-lg leading-relaxed text-sol-ink/80">
              When we rightly see who God is, and where we are right now, we are in a better position to work toward a better future.
            </p>
            <div className="mt-10 space-y-8">
              <VerseBlock verse={verseByRef("foundation", "Matthew 7:24-27")} size="featured" />
              <VerseBlock verse={verseByRef("foundation", "1 Corinthians 3:11")} size="featured" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ the three acts */}
      {acts.map((act) => (
        <Fragment key={act.number}>
        {act.number === 2 && <Fade from={LIGHT} to={NIGHT} />}
        <div id={`act-${act.number}`} className={`scroll-mt-32 ${act.number === 2 ? "sol-night bg-sol-paper text-sol-ink" : ""}`}>
          <div className="relative px-6 py-24 text-center">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-0"
              style={{ background: "radial-gradient(45% 60% at 50% 50%, rgba(244,196,90,0.09), transparent)" }}
            />
            <Reveal>
              <p className={`${eyebrow} relative`}>Act {act.number === 1 ? "I" : act.number === 2 ? "II" : "III"}</p>
              <h2 className="relative mt-3 font-sol text-5xl font-semibold text-sol-ink sm:text-7xl">{act.name}</h2>
              <p className="relative mt-3 font-sol text-xl italic text-sol-gold sm:text-2xl">{act.line}</p>
              <p className="text-balance relative mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-sol-ink/80">{act.intro}</p>
              {act.number === 2 && (
                <a href="#hurting" className="relative mt-6 inline-block text-sm font-semibold text-sol-rose underline underline-offset-4 hover:text-sol-rose">
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
                        <span className="font-sol text-5xl leading-none text-sol-gold/30 sm:text-6xl">{String(number).padStart(2, "0")}</span>
                        <h3 className="font-sol text-2xl font-semibold leading-snug text-sol-ink sm:text-3xl">{s.title}</h3>
                      </div>
                      <OurTake>{s.take}</OurTake>
                      {s.note && <p className="mt-4 rounded-2xl border border-sol-line bg-sol-card p-4 text-sm leading-relaxed text-sol-ink/80">{s.note}</p>}
                    </Reveal>
                    <div className="mt-9 space-y-9">
                      {featured.map((v) => (
                        <Reveal key={v.id}>
                          <VerseBlock verse={v} size="featured" />
                        </Reveal>
                      ))}
                    </div>
                    {rest.length > 0 && (
                      <details className="group mt-10 rounded-2xl border border-sol-line bg-sol-card open:border-sol-gold/30">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-sol-ink">
                          <span>See all {versesFor(s.id).length} verses in this section</span>
                          <span aria-hidden className="text-sol-gold transition-transform duration-200 group-open:rotate-45">+</span>
                        </summary>
                        <div className="space-y-7 px-5 pb-6 pt-2">
                          {rest.map((v) => {
                            const heading = v.group && v.group !== lastGroup ? v.group : null;
                            lastGroup = v.group;
                            return (
                              <div key={v.id}>
                                {heading && <p className="mb-4 mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-sol-violet">{heading}</p>}
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
                        className="rounded-full border border-sol-line px-4 py-2 text-xs font-semibold text-sol-ink/80 transition-colors hover:border-sol-gold/60 hover:text-sol-gold"
                      >
                        Teach this section, one verse at a time
                      </TeachButton>
                    </div>
                  </section>
                );
              })}
          </div>
        </div>
        {act.number === 2 && <Fade from={NIGHT} to={LIGHT} />}
        </Fragment>
      ))}

      {/* ------------------------------------------------ the one lens */}
      <section className="px-6 py-20">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className={eyebrow}>The one lens</p>
            <h2 className="mt-3 font-sol text-3xl font-semibold text-sol-ink sm:text-5xl">Why not turn to Christ as the singular focus?</h2>
            <p className="text-balance mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-sol-ink/80">
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
      <section id="state" className="scroll-mt-32 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className={eyebrow}>Take accountability</p>
          <h2 className="mt-3 font-sol text-3xl font-semibold text-sol-ink sm:text-5xl">Your current state</h2>
          <p className="text-balance mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-sol-ink/80">
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
      <section id="questions" className="scroll-mt-32 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className={eyebrow}>Honest questions</p>
            <h2 className="mt-3 font-sol text-3xl font-semibold text-sol-ink sm:text-5xl">What a careful reader will ask</h2>
          </div>
          <div className="mt-10 space-y-3">
            {faq.map((f) => (
              <details key={f.question} className="group rounded-2xl border border-sol-line bg-sol-card open:border-sol-gold/30">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-sol-ink">
                  <span>{f.question}</span>
                  <span aria-hidden className="shrink-0 text-sol-gold transition-transform duration-200 group-open:rotate-45">+</span>
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

          <div className="mt-10 rounded-3xl border border-sol-line bg-sol-card p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sol-ink/80">What I am not saying</p>
            <ul className="mt-4 space-y-3 text-base text-sol-ink/80">
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
      <section id="hurting" className="relative scroll-mt-32 px-6 py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(55% 60% at 50% 40%, rgba(251,113,133,0.10), transparent)" }}
        />
        <div className="relative mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sol-rose">If you are hurting right now</p>
            <h2 className="mt-3 font-sol text-3xl font-semibold text-sol-ink sm:text-5xl">Start here. You do not have to settle any debate first.</h2>
            <p className="text-balance mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-sol-ink/80">
              Nothing on this page asks you to pretend it does not hurt. Come as you are. David did, and so can you.
            </p>
          </div>
          <div className="mt-10 space-y-8">
            {hurtingVerses.map((h) => (
              <VerseBlock key={`${h.section}-${h.ref}`} verse={verseByRef(h.section, h.ref)} size="featured" domId={`h-${h.section}-${h.ref.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`} />
            ))}
          </div>
          <div className="mt-10 rounded-3xl border border-sol-rose/30 bg-sol-rose/10 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sol-rose">A simple prayer</p>
            <p className="mt-3 font-sol text-xl leading-relaxed text-sol-ink sm:text-2xl">{prayer}</p>
          </div>
          <div className="mt-6 rounded-3xl border border-sol-line bg-sol-card p-6 text-sol-ink/80 sm:p-8">
            <p>
              If you are in crisis or thinking about hurting yourself, please call or text <strong className="text-sol-ink">988</strong> (in
              the U.S.) or contact your local emergency number right now. This page is Scripture and my perspective. It is not counseling.
            </p>
            <p className="mt-3">
              You can also{" "}
              <Link href="/contact#message" className="font-semibold text-sol-gold underline underline-offset-4">write to us</Link>. We read every message.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ library */}
      <section id="library" className="scroll-mt-32 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className={eyebrow}>Come back to it</p>
          <h2 className="mt-3 font-sol text-3xl font-semibold text-sol-ink sm:text-5xl">Every verse, searchable</h2>
          <p className="text-balance mx-auto mt-5 max-w-2xl text-lg text-sol-ink/80">
            Search a word, filter by section, copy a verse, or send one to someone who needs it today.
          </p>
        </div>
        <div className="mt-10">
          <LibraryLoader />
        </div>
      </section>

      {/* ------------------------------------------------ close */}
      <Fade from={LIGHT} to={NIGHT} />
      <section className="sol-night relative bg-sol-paper px-6 pb-28 text-center text-sol-ink">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(50% 60% at 50% 100%, rgba(244,196,90,0.14), transparent)" }}
        />
        <Reveal>
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-sol text-4xl font-semibold text-sol-ink sm:text-6xl">{PAGE_TAGLINE}</h2>
            <p className="text-balance mt-6 text-lg leading-relaxed text-sol-ink/80">
              Whatever happens, the Lord is in control and the Father is open to you by the blood of Jesus. Look to Him.
              If you see something here differently, I would genuinely like to hear it.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <CopyLinkButton url={url} className="rounded-full bg-sol-primary px-7 py-3.5 text-sm font-semibold text-sol-on-primary shadow-lg shadow-sol-primary/20 transition-colors hover:bg-sol-primary/90" />
              <Link href="/contact#message" className="rounded-full border border-sol-line px-7 py-3.5 text-sm font-semibold text-sol-ink transition-colors hover:border-sol-gold/60">
                Tell us what changed in your thinking
              </Link>
              <Link href="/faith" className="rounded-full border border-sol-line px-7 py-3.5 text-sm font-semibold text-sol-ink transition-colors hover:border-sol-gold/60">
                More from Faith Journey
              </Link>
            </div>
            <p className="mt-12 text-xs text-sol-muted">
              Scripture quotations are from the King James Version of the Bible, which is in the public domain.
            </p>
          </div>
        </Reveal>
      </section>
    </article>
  );
}
