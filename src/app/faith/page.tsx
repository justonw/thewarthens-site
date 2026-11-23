import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import StartDoors from "@/components/StartDoors";
import StayInTouch from "@/components/StayInTouch";
import ThisWeekCard from "@/components/ThisWeekCard";
import FaithLibrary from "@/components/faith/FaithLibrary";
import { faithWritings } from "@/lib/faith-writings";
import { extraLibraryItems, faithVideos, pinnedVideo, type LibraryItem } from "@/lib/faith-featured";

const title = "Faith Journey: Bible Studies, Testimonies & Wisdom";
const description =
  "Our faith journey, told through real life: Bible studies, testimonies, and lessons on learning, understanding, and living out God's wisdom by His grace.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/faith" },
  openGraph: { title, description, url: "/faith" },
  twitter: { card: "summary_large_image", title, description },
};

// The Faith Journey YouTube channel (separate from the Tech Journey channel in the footer).
const FAITH_YOUTUBE_URL = "https://www.youtube.com/channel/UCJj_ar9Gs8YvcYK6jSh9a6g";

const faq = [
  {
    question: "What is Faith Journey?",
    answer:
      "Faith Journey is Juston and Atiya Warthen learning, understanding, and living out God's wisdom through faith, by His grace. That means not adopting cultural norms unless they're actually rooted in biblical, theological truth, being willing to question anything that looks counterfeit, and faithfully contributing that discernment within their own sphere and beyond. It's shaped in part by their own experience serving in local church leadership and later deconstructing what they thought faith was supposed to look like, where they found God faithful through all of it.",
  },
  {
    question: "Is there a community for women in Faith Journey?",
    answer:
      "Yes. Women Who Seek is a Bible study community for women, hosted by Atiya Warthen, open to any woman wherever she is in her journey with Jesus.",
  },
];

// The hero paragraph, split into three points. Same words, easier to scan.
const faithPoints = [
  {
    label: "Test it",
    title: "Question what looks counterfeit",
    body: "That means being willing to question anything that looks or feels counterfeit.",
    icon: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M20.5 20.5 16 16" />
        <path d="m8.5 11 1.8 1.8L14 9.2" />
      </>
    ),
  },
  {
    label: "Share it",
    title: "Share what we're learning",
    body: "And lovingly, faithfully contributing what we're learning within our own sphere and beyond, toward the freedom that only truth brings.",
    icon: (
      <>
        <path d="M12 6.5C10.4 5.3 8 4.8 4.5 5v12.2c3.5-.2 5.9.3 7.5 1.5 1.6-1.2 4-1.7 7.5-1.5V5c-3.5-.2-5.9.3-7.5 1.5Z" />
        <path d="M12 6.5v12.2" />
      </>
    ),
  },
  {
    label: "Our story",
    title: "Where it comes from",
    body: "That posture comes from our own experience serving in local church leadership and later deconstructing what we thought faith was supposed to look like. God met us faithfully through all of it.",
    icon: (
      <>
        <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11Z" />
        <circle cx="12" cy="10" r="2.4" />
      </>
    ),
  },
];

const newest = pinnedVideo;
const olderVideos = faithVideos;

// The lessons, communities and writings, newest lessons first, then writings by date as listed.
const libraryItems: LibraryItem[] = [
  ...extraLibraryItems,
  ...faithWritings.map((w) => ({
    href: `/faith/${w.category}/${w.slug}`,
    title: w.title,
    blurb: w.dek,
    cta: "Read it",
    tags: [w.category],
  })),
];

export default function FaithJourneyPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "The Warthens", item: "https://thewarthens.com" },
      { "@type": "ListItem", position: 2, name: "Faith Journey", item: "https://thewarthens.com/faith" },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section className="relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Hero: short, so the newest thing is on the first screen */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(55% 45% at 50% 0%, rgba(147,51,234,0.10), transparent)",
          }}
        />
        <div className="mx-auto max-w-4xl px-6 pt-12 pb-8 text-center sm:pt-20 sm:pb-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-purple-600/25 bg-purple-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-700">
            Faith Journey with The Warthens
          </p>
          <h1 className="text-balance mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
            Learning, understanding, and living out God&apos;s wisdom, through
            faith, by His grace
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-foreground-muted">
            We don&apos;t believe in adopting whatever culture hands us unless
            it&apos;s actually rooted in biblical, theological truth.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#writings"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-purple-700 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-purple-900/20 transition-colors hover:bg-purple-600"
            >
              Read the articles
              <span aria-hidden>↓</span>
            </a>
            <a
              href="#videos"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-border-subtle bg-background-elevated px-7 py-3 text-base font-semibold text-foreground transition-colors hover:border-purple-500/50 hover:text-purple-800"
            >
              Watch the videos
            </a>
          </div>
        </div>
      </div>

      {/* Pinned: our Jesus story stays at the top */}
      <div id="videos" className="mx-auto max-w-5xl scroll-mt-24 px-6 pb-12">
        <Reveal>
          <div className="grid overflow-hidden rounded-[2rem] border border-purple-600/20 bg-background-elevated shadow-xl shadow-purple-950/10 md:grid-cols-[1.05fr_0.95fr]">
            <Link href={newest.href} className="group relative block aspect-video md:aspect-auto md:min-h-72" aria-label={`${newest.title}: ${newest.cta}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${newest.id}/maxresdefault.jpg`}
                alt={newest.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span aria-hidden className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-purple-700 shadow-xl transition-transform duration-300 group-hover:scale-110">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </Link>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <p className="inline-flex w-fit items-center gap-2 rounded-full bg-purple-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-800">
                <span aria-hidden className="h-2 w-2 rounded-full bg-red-500" />
                Start here: our story
              </p>
              <h2 className="text-balance mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{newest.title}</h2>
              <p className="mt-3 text-foreground-muted">{newest.blurb}</p>
              {newest.perks && (
                <ul className="mt-4 space-y-2 text-sm text-foreground">
                  {newest.perks.map((perk) => (
                    <li key={perk} className="flex gap-2.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-5 w-5 shrink-0 text-purple-700" aria-hidden>
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6">
                <Link
                  href={newest.href}
                  className="inline-flex items-center gap-2 rounded-full bg-purple-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/25 transition-all hover:-translate-y-0.5 hover:bg-purple-600 sm:text-base"
                >
                  {newest.cta}
                  <span aria-hidden>→</span>
                </Link>
              </div>
              <p className="mt-3 text-xs text-foreground-muted">Free to read and watch. No sign-up.</p>
            </div>
          </div>
        </Reveal>
      </div>

      <StartDoors variant="faith" />

      <Reveal className="mx-auto grid max-w-5xl gap-5 px-6 pb-16 md:grid-cols-2">
        <ThisWeekCard variant="faith" />
        <StayInTouch from="faith" />
      </Reveal>

      {/* Newer videos */}
      <div className="mx-auto max-w-5xl px-6 pb-14 pt-12 sm:pt-16">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">New on the channel</h2>
            <a href={FAITH_YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-purple-700 underline underline-offset-4 hover:text-purple-900">
              See all on YouTube
            </a>
          </div>
        </Reveal>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {olderVideos.map((v, i) => (
            <li key={v.id} className="h-full">
              <Reveal delay={i * 80} className="h-full">
                <Link
                  href={v.href}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border-subtle bg-background-elevated transition-all hover:-translate-y-0.5 hover:border-mauve-600/40 hover:shadow-xl hover:shadow-mauve-950/10"
                >
                  <div className="relative aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`} alt={v.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3 className="text-balance text-lg font-semibold leading-snug">{v.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-foreground-muted">{v.blurb}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-purple-700 transition-transform group-hover:translate-x-1">
                      {v.cta} <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      {/* Everything to read or do, filterable */}
      <div id="writings" className="scroll-mt-32">
        <div className="mx-auto max-w-5xl px-6 pb-16 pt-6">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-purple-700">Read and do</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Read what we&apos;re learning</h2>
            <p className="mt-2 mb-6 text-sm text-foreground-muted">
              Lessons and exercises, Bible studies, and writings. Tap a filter to narrow it down.
            </p>
            <FaithLibrary items={libraryItems} />
          </Reveal>
        </div>
      </div>

      {/* How we approach it */}
      <div className="mx-auto max-w-4xl px-6 pb-16">
        <Reveal>
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">How we approach this</h2>
        </Reveal>
          <div className="mt-8 grid gap-4 text-left md:grid-cols-2">
            {faithPoints.map((point, i) => {
              const featured = i === 2;
              return (
                <Reveal key={point.title} delay={i * 80} className={featured ? "md:col-span-2" : ""}>
                  <div
                    className={`group relative h-full overflow-hidden rounded-3xl border border-purple-600/15 bg-gradient-to-br from-background-elevated via-background-elevated to-purple-600/[0.07] p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-600/40 hover:shadow-xl hover:shadow-purple-900/10 sm:p-8 ${
                      featured ? "md:flex md:items-center md:gap-8" : ""
                    }`}
                  >
                    {/* soft glow in the corner */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-purple-500/15 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-mauve-800 text-white shadow-lg shadow-purple-900/25 ring-1 ring-white/20">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-7 w-7"
                        aria-hidden
                      >
                        {point.icon}
                      </svg>
                    </span>
                    <div className={`relative ${featured ? "mt-5 md:mt-0" : "mt-5"}`}>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
                        {point.label}
                      </p>
                      <p className="mt-1.5 text-xl font-semibold leading-snug">{point.title}</p>
                      <p className="mt-2.5 text-foreground-muted">{point.body}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
      </div>

      <Reveal delay={100} className="mx-auto max-w-3xl px-6 pb-16 text-left">
        <h2 className="text-xl font-semibold sm:text-2xl">Quick Answers</h2>
        <div className="mt-5 space-y-3">
          {faq.map((f, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-border-subtle bg-background-elevated"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 font-semibold">
                {f.question}
                <span
                  aria-hidden
                  className="shrink-0 text-sm text-foreground-muted transition-transform group-open:rotate-180"
                >
                  ⌄
                </span>
              </summary>
              <p className="px-5 pb-5 text-sm text-foreground-muted">{f.answer}</p>
            </details>
          ))}
        </div>
      </Reveal>

      <Reveal delay={150} className="mx-auto max-w-3xl px-6 pb-20 text-center sm:pb-24">
        <Link
          href="/tech"
          className="flex items-center justify-between gap-4 rounded-3xl border border-border-subtle bg-background-elevated p-6 text-left transition-all hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-950/5"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Also On This Site
            </p>
            <p className="mt-1 text-lg font-semibold">Tech Journey</p>
            <p className="mt-1 text-sm text-foreground-muted">
              Real steps for a career change into tech, alongside the
              faith side.
            </p>
          </div>
          <span aria-hidden className="shrink-0 text-blue-600">
            →
          </span>
        </Link>
      </Reveal>

    </section>
  );
}
