import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

const VIDEO_ID = "HKWT347dZ3U";
const VIDEO_TITLE = "She Grew Up in Church. I Didn’t. We Both Needed Jesus.";
const FAITH_YOUTUBE_URL = "https://www.youtube.com/channel/UCJj_ar9Gs8YvcYK6jSh9a6g";

// Search title stays under about 60 characters; the on-page headline and social cards use the video title.
const title = "Why We Believe in Jesus: Our Testimonies | The Warthens";
const description =
  "Atiya grew up in church. Juston didn’t. Watch how we each came to believe in Jesus, from childhood trauma and agnostic doubt to real change, and share your own story with us.";
const thumbnail = `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/jesus" },
  keywords: [
    "why we believe in Jesus",
    "Christian testimony",
    "agnostic to Christian testimony",
    "how I became a Christian",
    "grew up in church but needed Jesus",
    "did not grow up in church",
    "Jesus transformed my life",
    "Christian couple testimony",
  ],
  openGraph: {
    title: VIDEO_TITLE,
    description,
    url: "/jesus",
    type: "website",
    images: [{ url: thumbnail, width: 1280, height: 720, alt: VIDEO_TITLE }],
  },
  twitter: { card: "summary_large_image", title: VIDEO_TITLE, description, images: [thumbnail] },
};

// Each story is built only from what Atiya and Juston shared themselves. It leaves out names of
// the children, and graphic detail on purpose.
const stories = [
  {
    name: "Atiya: she grew up in church, and still needed Jesus",
    paragraphs: [
      "Atiya grew up in church, and as a child she experienced the presence of God. Then came childhood trauma. In the pain that followed, she turned to drinking, and in college her life spiraled.",
      "She eventually encountered Jesus and was transformed.",
    ],
  },
  {
    name: "Juston: not raised in church, and still needed Jesus",
    paragraphs: [
      "Juston wasn’t raised in church. He was a “good kid” who didn’t drink or smoke, and an analytical agnostic who thought there might be a God but wasn’t sure.",
      "Then he realized he was enslaved to his own sinful nature, which was eye-opening for someone who had never been “in the streets.” After encountering the transforming power of Jesus on both the mind and the body, and finding that the historical evidence made sense, he was inclined to believe.",
    ],
  },
];

const faq = [
  {
    question: "Why do you believe in Jesus?",
    answer:
      "We came to Jesus from very different places. Atiya felt God’s presence as a child and met Jesus after a season of pain and drinking. Juston, an analytical agnostic, was drawn in by the transforming power of Jesus on the mind and body and by historical evidence that made sense to him. We tell both stories in the video.",
  },
  {
    question: "Do you have to grow up in church to believe in Jesus?",
    answer:
      "No. Atiya grew up in church and Juston did not, and we both needed Jesus. Where you started does not decide whether you can know him.",
  },
  {
    question: "Can an agnostic or skeptic come to believe in Jesus?",
    answer:
      "Juston did. He thought there might be a God, looked at the historical evidence, and found it made sense. Then he encountered the transforming power of Jesus for himself.",
  },
  {
    question: "Can Jesus change someone who has been hurt or has struggled with drinking?",
    answer:
      "That is Atiya’s story. After childhood trauma she turned to drinking and her life spiraled, and then she encountered Jesus and was transformed. We are sharing our experience, not professional counseling. If you are in crisis, please contact a local emergency service, or call or text 988 if you are in the U.S.",
  },
  {
    question: "Can I share my own testimony with you?",
    answer:
      "Yes, we would love to hear it. Use the message form on our contact page, choose “Share my testimony or my story,” and tell us who you were, how you met Jesus, and what has changed.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "VideoObject",
      "@id": "https://thewarthens.com/jesus#video",
      name: VIDEO_TITLE,
      description:
        "Atiya grew up in church and Juston did not. Hear how we each came to believe in Jesus, and why we both needed him.",
      thumbnailUrl: [thumbnail],
      uploadDate: "2026-11-14T07:08:07-08:00",
      duration: "PT35M59S",
      contentUrl: `https://www.youtube.com/watch?v=${VIDEO_ID}`,
      embedUrl: `https://www.youtube.com/embed/${VIDEO_ID}`,
      inLanguage: "en",
      publisher: {
        "@type": "Organization",
        name: "The Warthens",
        logo: { "@type": "ImageObject", url: "https://thewarthens.com/brand/icon-square.png" },
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://thewarthens.com/jesus",
      url: "https://thewarthens.com/jesus",
      name: title,
      description,
      mainEntity: { "@id": "https://thewarthens.com/jesus#video" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "The Warthens", item: "https://thewarthens.com" },
        { "@type": "ListItem", position: 2, name: "Faith Journey", item: "https://thewarthens.com/faith" },
        { "@type": "ListItem", position: 3, name: VIDEO_TITLE, item: "https://thewarthens.com/jesus" },
      ],
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

export default function JesusPage() {
  return (
    <section className="relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 40% at 50% 0%, rgba(147,51,234,0.12), transparent), radial-gradient(40% 30% at 90% 15%, rgba(244,184,160,0.18), transparent)",
        }}
      />
      <div className="mx-auto max-w-3xl px-6 pt-14 pb-16 text-center sm:pt-20 sm:pb-24">
        <p className="inline-flex items-center rounded-full border border-purple-600/25 bg-purple-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-700">
          Faith Journey with The Warthens
        </p>
        <h1 className="text-balance mt-6 text-3xl font-semibold tracking-tight sm:text-5xl">
          {VIDEO_TITLE}
        </h1>
        <p className="text-balance mx-auto mt-5 max-w-xl text-lg text-foreground-muted">
          Why we believe in Jesus: two very different roads, and the same Savior.
        </p>

        <Reveal>
          <div className="mx-auto mt-10 overflow-hidden rounded-3xl border border-border-subtle bg-black shadow-2xl shadow-purple-950/15">
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${VIDEO_ID}`}
                title={VIDEO_TITLE}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </Reveal>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`https://youtu.be/${VIDEO_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-purple-700 px-5 py-3.5 sm:px-7 text-sm font-semibold text-white shadow-md transition-colors hover:bg-purple-800"
          >
            Watch on YouTube
            <span aria-hidden>→</span>
          </a>
          <a
            href={`${FAITH_YOUTUBE_URL}?sub_confirmation=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-purple-600/40 px-5 py-3.5 sm:px-7 text-sm font-semibold text-purple-800 transition-colors hover:bg-purple-600/10"
          >
            Subscribe
          </a>
        </div>

        <Reveal delay={80}>
          <article className="mx-auto mt-16 max-w-2xl text-left">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Our stories: how we each came to Jesus
            </h2>
            <div className="mt-8 space-y-10">
              {stories.map((s) => (
                <div key={s.name}>
                  <h3 className="text-xl font-semibold tracking-tight text-purple-800">{s.name}</h3>
                  <div className="mt-3 space-y-4 text-lg leading-relaxed text-foreground">
                    {s.paragraphs.map((p) => (
                      <p key={p.slice(0, 40)}>{p}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-10 text-lg leading-relaxed text-foreground">
              Two different roads, and we both needed Jesus. The full stories, in our own words, are
              in the video above.
            </p>
          </article>
        </Reveal>

        <Reveal delay={80}>
          <aside
            aria-labelledby="your-story"
            className="mx-auto mt-16 max-w-2xl rounded-3xl border border-purple-600/25 bg-purple-600/10 p-6 text-left sm:p-8"
          >
            <h2 id="your-story" className="text-xl font-semibold tracking-tight sm:text-2xl">
              What is your story?
            </h2>
            <p className="mt-3 text-foreground">
              Maybe you grew up in church. Maybe you didn&apos;t. Maybe you are still asking
              questions. We would love to hear who you were, how you met Jesus, and what has
              changed. Tell us a little about yourself, or leave your testimony.
            </p>
            <Link
              href="/contact#message"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-purple-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-purple-800"
            >
              Share your story
              <span aria-hidden>→</span>
            </Link>
          </aside>
        </Reveal>

        <Reveal delay={80}>
          <div className="mx-auto mt-16 max-w-2xl text-left">
            <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
              Common questions
            </h2>
            <div className="mt-6 space-y-3">
              {faq.map((f) => (
                <details
                  key={f.question}
                  className="group rounded-2xl border border-border-subtle bg-background-elevated p-5 open:border-purple-600/30 open:shadow-md"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    <span>{f.question}</span>
                    <span
                      aria-hidden
                      className="shrink-0 text-purple-700 transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-foreground-muted">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Reveal>

        <p className="mt-12 text-sm text-foreground-muted">
          More from our family:{" "}
          <Link href="/faith" className="font-semibold text-purple-700 underline underline-offset-4">
            Faith Journey
          </Link>
        </p>
      </div>
    </section>
  );
}
