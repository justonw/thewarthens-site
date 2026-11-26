import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import StayInTouch from "@/components/StayInTouch";
import ReadingShelf from "@/components/faith/ReadingShelf";
import { pinnedVideo, shelves } from "@/lib/faith-featured";

const title = "Faith Journey: Bible Study Articles & Our Story";
const description =
  "Read Bible studies and articles on tithing, ministry, calling and trusting God, plus our story of why we believe in Jesus. From The Warthens.";

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

// How we approach it, shown after the reading.
const faithPoints = [
  {
    title: "Question what looks counterfeit",
    body: "That means being willing to question anything that looks or feels counterfeit.",
  },
  {
    title: "Share what we’re learning",
    body: "And lovingly, faithfully contributing what we’re learning within our own sphere and beyond, toward the freedom that only truth brings.",
  },
  {
    title: "Where it comes from",
    body: "That posture comes from our own experience serving in local church leadership and later deconstructing what we thought faith was supposed to look like. God met us faithfully through all of it.",
  },
];

const readingCount = shelves.reduce((sum, shelf) => sum + shelf.items.length, 0);

export default function FaithJourneyPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "The Warthens", item: "https://thewarthens.com" },
      { "@type": "ListItem", position: 2, name: "Faith Journey", item: "https://thewarthens.com/faith" },
    ],
  };

  const readingListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Faith Journey reading library",
    itemListElement: shelves
      .flatMap((shelf) => shelf.items)
      .map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.title, url: `https://thewarthens.com${item.href}` })),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(readingListJsonLd) }}
      />
      {/* Top: who this is, and the one video, our story of faith */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(55% 60% at 50% 0%, rgba(147,51,234,0.10), transparent)" }}
        />
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 pb-12 pt-10 sm:pt-14 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <div>
            <p className="inline-flex items-center rounded-full border border-purple-600/25 bg-purple-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-700">
              Faith Journey with The Warthens
            </p>
            <h1 className="text-balance mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Learning, understanding, and living out God&apos;s wisdom, through faith, by His grace
            </h1>
            <p className="mt-4 text-lg text-foreground-muted">
              We don&apos;t believe in adopting whatever culture hands us unless it&apos;s actually rooted in biblical,
              theological truth. Read it for yourself.
            </p>
            <a
              href="#writings"
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-purple-700 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-purple-900/20 transition-colors hover:bg-purple-600"
            >
              Explore the articles and studies
              <span aria-hidden>↓</span>
            </a>
          </div>

          <figure className="overflow-hidden rounded-3xl border border-purple-600/20 bg-background-elevated shadow-xl shadow-purple-950/10">
            <Link href={pinnedVideo.href} className="group relative block aspect-video" aria-label={`${pinnedVideo.title}: ${pinnedVideo.cta}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://i.ytimg.com/vi/${pinnedVideo.id}/maxresdefault.jpg`} alt={pinnedVideo.title} className="absolute inset-0 h-full w-full object-cover" />
              <span aria-hidden className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-purple-700 shadow-xl transition-transform duration-300 group-hover:scale-110">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </Link>
            <figcaption className="p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-700">Our story of faith</p>
              <p className="text-balance mt-1.5 text-lg font-semibold leading-snug">{pinnedVideo.title}</p>
              <p className="mt-1.5 text-sm text-foreground-muted">{pinnedVideo.blurb}</p>
              <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1">
                <Link href={pinnedVideo.href} className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-purple-700 hover:text-purple-900">
                  {pinnedVideo.cta} <span aria-hidden>→</span>
                </Link>
                <a href={FAITH_YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center text-sm text-foreground-muted underline underline-offset-4 hover:text-purple-800">
                  Our YouTube channel
                </a>
              </p>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* The reading library: pick a topic, then everything on it, shelf by shelf */}
      <div id="writings" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-16">
        <div className="border-t border-border-subtle pt-10 sm:pt-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-purple-700">The reading library</p>
          <h2 className="text-balance mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">What would you like to explore?</h2>
          <p className="mt-3 max-w-2xl text-foreground-muted">
            {readingCount} articles, studies, lessons and places to grow, arranged in {shelves.length} topics. All free to
            read.
          </p>
          <nav aria-label="Reading topics" className="mt-7">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {shelves.map((shelf, i) => (
                <li key={shelf.id}>
                  <a
                    href={`#${shelf.id}`}
                    className="group flex h-full flex-col rounded-2xl border border-border-subtle bg-background-elevated p-5 transition-all hover:-translate-y-0.5 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-950/5"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-700">
                      {i + 1}. {shelf.name}
                    </span>
                    <span className="mt-2.5 flex-1 text-base font-semibold leading-snug">{shelf.question}</span>
                    <span className="mt-4 inline-flex items-center justify-between text-sm text-foreground-muted">
                      {shelf.items.length} to explore
                      <span aria-hidden className="text-purple-700 transition-transform group-hover:translate-y-0.5">
                        ↓
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 space-y-12">
          {shelves.map((shelf, i) => (
            <ReadingShelf key={shelf.id} shelf={shelf} number={i + 1} />
          ))}
        </div>
      </div>

      {/* How we approach it */}
      <Reveal className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">How we approach this</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {faithPoints.map((point) => (
            <li key={point.title} className="rounded-3xl border border-purple-600/15 bg-background-elevated p-6">
              <h3 className="text-lg font-semibold leading-snug">{point.title}</h3>
              <p className="mt-2.5 text-sm text-foreground-muted">{point.body}</p>
            </li>
          ))}
        </ul>
      </Reveal>

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

      <Reveal className="mx-auto max-w-3xl px-6 pb-8">
        <StayInTouch from="faith" />
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
