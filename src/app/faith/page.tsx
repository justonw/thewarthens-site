import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { faithWritings, categoryLabels, type FaithWritingCategory } from "@/lib/faith-writings";

const title = "Faith Journey | The Warthens";
const description =
  "Learning, understanding, and living out God's wisdom, through faith, by His grace. Our faith journey, coming soon.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/faith" },
  openGraph: { title, description, url: "/faith" },
  twitter: { card: "summary_large_image", title, description },
};

const videoJsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Redeeming A Deconstructed Faith | Our Christian Journey",
  description:
    "We discuss our journey from being former church leaders to gaining a more proper context of the Christian faith and how we practically put our faith into practice.",
  thumbnailUrl: ["https://i.ytimg.com/vi/-udk7605GZw/maxresdefault.jpg"],
  uploadDate: "2024-01-04T09:00:00-08:00",
  duration: "PT56M6S",
  contentUrl: "https://youtu.be/-udk7605GZw",
  embedUrl: "https://www.youtube.com/embed/-udk7605GZw",
  publisher: {
    "@type": "Organization",
    name: "The Warthens",
    logo: {
      "@type": "ImageObject",
      url: "https://thewarthens.com/brand/icon-square.png",
    },
  },
};

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
    title: "Question what looks counterfeit",
    body: "That means being willing to question anything that looks or feels counterfeit.",
  },
  {
    title: "Share what we're learning",
    body: "And lovingly, faithfully contributing what we're learning within our own sphere and beyond, toward the freedom that only truth brings.",
  },
  {
    title: "Where it comes from",
    body: "That posture comes from our own experience serving in local church leadership and later deconstructing what we thought faith was supposed to look like. God met us faithfully through all of it.",
  },
];

const categoryOrder: FaithWritingCategory[] = ["story-time", "topical-study", "reflections"];
const writingGroups = categoryOrder
  .map((category) => ({
    category,
    items: faithWritings.filter((w) => w.category === category),
  }))
  .filter((group) => group.items.length > 0);

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero: a short lead, then three points instead of one long paragraph */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(55% 45% at 50% 0%, rgba(147,51,234,0.10), transparent)",
          }}
        />
        <div className="mx-auto max-w-4xl px-6 pt-16 pb-16 text-center sm:pt-24 sm:pb-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-purple-600/25 bg-purple-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-700">
            Faith Journey · Coming Soon
          </p>
          <h1 className="text-balance mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            Learning, understanding, and living out God&apos;s wisdom, through
            faith, by His grace
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-foreground-muted">
            We don&apos;t believe in adopting whatever culture hands us unless
            it&apos;s actually rooted in biblical, theological truth.
          </p>

          <div className="mt-12 grid gap-4 text-left md:grid-cols-3">
            {faithPoints.map((point, i) => (
              <Reveal key={point.title} delay={i * 80}>
                <div className="h-full rounded-3xl border border-border-subtle bg-background-elevated p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-700 text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <p className="mt-4 font-semibold">{point.title}</p>
                  <p className="mt-2 text-sm text-foreground-muted">{point.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-balance text-foreground-muted">
            This page is where we&apos;ll keep sharing what we&apos;re learning.
            For now, here&apos;s where it started.
          </p>
        </div>
      </div>

      {/* Where it started: the video, as the focal point */}
      <div
        className="text-white"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(244,184,160,0.3), transparent 45%), linear-gradient(135deg, #9c5268, #7d3f52 50%, #572838)",
        }}
      >
        <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-rose-200">
              Where it started
            </p>
            <a
              href="https://youtu.be/-udk7605GZw"
              target="_blank"
              rel="noopener noreferrer"
              className="group mx-auto mt-6 block aspect-video w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 shadow-2xl shadow-black/30"
            >
              <div className="relative h-full w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://img.youtube.com/vi/-udk7605GZw/maxresdefault.jpg"
                  alt="Redeeming A Deconstructed Faith | Our Christian Journey"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-purple-700 shadow-lg transition-transform group-hover:scale-105">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
                <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4 text-left text-sm font-semibold text-white">
                  Redeeming A Deconstructed Faith | Our Christian Journey
                </p>
              </div>
            </a>
            <p className="mt-6 text-sm text-rose-100">
              More content, stories, and resources are on the way. Follow along
              on{" "}
              <a
                href="https://youtube.com/@thewarthens?si=hMA8NuKtm0vox8X4"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white underline underline-offset-4 hover:text-rose-100"
              >
                YouTube
              </a>{" "}
              so you don&apos;t miss it.
            </p>
          </Reveal>
        </div>
      </div>

      {faithWritings.length > 0 && (
        <div id="writings" className="scroll-mt-32">
          <div className="mx-auto max-w-5xl px-6 pb-4 pt-16 sm:pt-20">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-wider text-purple-700">
                Writings
              </p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Read what we&apos;re learning</h2>
              <p className="mt-2 text-sm text-foreground-muted">
                Story Time, Topical Study, and Reflections pieces as we publish
                them.
              </p>
            </Reveal>
            {writingGroups.map((group) => (
              <div key={group.category} className="mt-10">
                <Reveal>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                    {categoryLabels[group.category]}
                  </h3>
                </Reveal>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {group.items.map((w, i) => (
                    <Reveal key={w.slug} delay={Math.min(i, 3) * 60}>
                      <Link
                        href={`/faith/${w.category}/${w.slug}`}
                        className="group flex h-full flex-col rounded-3xl border border-border-subtle bg-background-elevated p-6 transition-all hover:-translate-y-0.5 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-950/5"
                      >
                        <p className="text-lg font-semibold leading-snug">{w.title}</p>
                        <p className="mt-2 flex-1 text-sm text-foreground-muted">{w.dek}</p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-purple-700">
                          Read it
                          <span
                            aria-hidden
                            className="transition-transform group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </span>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Women Who Seek */}
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-12 sm:pt-16">
        <Reveal>
          <Link
            href="/faith/women-who-seek"
            className="group grid overflow-hidden rounded-[2rem] border border-border-subtle bg-background-elevated transition-all hover:-translate-y-0.5 hover:border-mauve-600/40 hover:shadow-xl hover:shadow-mauve-950/10 md:grid-cols-[0.9fr_1.1fr]"
          >
            <div className="relative min-h-56">
              <Image
                src="/women-who-seek/study-group.png"
                alt="Women studying the Bible together"
                fill
                sizes="(min-width: 768px) 440px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-wider text-mauve-700">
                A Community for Women
              </p>
              <p className="mt-2 text-2xl font-semibold">Women Who Seek</p>
              <p className="mt-3 text-foreground-muted">
                Finding Jesus in the Scriptures, hosted by Atiya. Open to any woman, wherever she is
                in her journey with Jesus.
              </p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-mauve-700">
                Visit Women Who Seek
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </Link>
        </Reveal>
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
