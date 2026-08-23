import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ScrollCue from "@/components/ScrollCue";
import { faithWritings, categoryLabels } from "@/lib/faith-writings";

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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 0%, rgba(147,51,234,0.10), transparent)",
        }}
      />
      <Reveal className="mx-auto max-w-3xl px-6 pt-16 pb-20 text-center sm:pt-24">
        <p className="inline-flex items-center gap-2 rounded-full border border-purple-600/25 bg-purple-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-700">
          Faith Journey · Coming Soon
        </p>
        <h1 className="text-balance mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          Learning, understanding, and living out God&apos;s wisdom, through
          faith, by His grace
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-foreground-muted">
          We don&apos;t believe in adopting whatever culture hands us unless
          it&apos;s actually rooted in biblical, theological truth. That
          means being willing to question anything that looks or feels
          counterfeit, and lovingly, faithfully contributing what
          we&apos;re learning within our own sphere and beyond, toward
          the freedom that only truth brings. That posture comes from
          our own experience serving in local church leadership and
          later deconstructing what we thought faith was supposed to
          look like; God met us faithfully through all of it. This page
          is where we&apos;ll keep sharing what we&apos;re learning. For
          now, here&apos;s where it started.
        </p>
        <ScrollCue className="mt-8" />

        <a
          href="https://youtu.be/-udk7605GZw"
          target="_blank"
          rel="noopener noreferrer"
          className="group mx-auto mt-10 block aspect-video w-full max-w-2xl overflow-hidden rounded-3xl border border-border-subtle shadow-xl shadow-black/10"
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
                <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </div>
            <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4 text-left text-sm font-semibold text-white">
              Redeeming A Deconstructed Faith | Our Christian Journey
            </p>
          </div>
        </a>

        <p className="mt-8 text-sm text-foreground-muted">
          More content, stories, and resources are on the way. Follow along
          on{" "}
          <a
            href="https://youtube.com/@thewarthens?si=hMA8NuKtm0vox8X4"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-purple-700 hover:text-purple-800"
          >
            YouTube
          </a>{" "}
          so you don&apos;t miss it.
        </p>
      </Reveal>

      {faithWritings.length > 0 && (
        <Reveal delay={50} className="mx-auto max-w-3xl px-6 pb-16 text-left">
          <h2 className="text-xl font-semibold sm:text-2xl">Writings</h2>
          <p className="mt-2 text-sm text-foreground-muted">
            Story Time, Topical Study, and Wisdom &amp; Devotional pieces as
            we publish them.
          </p>
          <div className="mt-6 space-y-4">
            {faithWritings.map((w) => (
              <Link
                key={w.slug}
                href={`/faith/${w.category}/${w.slug}`}
                className="group block rounded-3xl border border-border-subtle bg-background-elevated p-6 transition-all hover:-translate-y-0.5 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-950/5"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-700">
                  {categoryLabels[w.category]}
                </p>
                <p className="mt-2 text-lg font-semibold">{w.title}</p>
                <p className="mt-2 text-sm text-foreground-muted">{w.dek}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-purple-700">
                  Read it
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      )}

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

      <Reveal delay={150} className="mx-auto max-w-3xl px-6 pb-6 text-center">
        <Link
          href="/faith/women-who-seek"
          className="flex items-center justify-between gap-4 rounded-3xl border border-border-subtle bg-background-elevated p-6 text-left transition-all hover:-translate-y-0.5 hover:border-mauve-600/40 hover:shadow-xl hover:shadow-mauve-950/5"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-mauve-700">
              A Community for Women
            </p>
            <p className="mt-1 text-lg font-semibold">Women Who Seek</p>
            <p className="mt-1 text-sm text-foreground-muted">
              Finding Jesus in the Scriptures, hosted by Atiya.
            </p>
          </div>
          <span aria-hidden className="shrink-0 text-mauve-700">
            →
          </span>
        </Link>
      </Reveal>

      <Reveal delay={200} className="mx-auto max-w-3xl px-6 pb-20 text-center sm:pb-24">
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
