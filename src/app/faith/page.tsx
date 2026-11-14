import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { faithWritings, categoryLabels, type FaithWritingCategory } from "@/lib/faith-writings";

const title = "Faith Journey | The Warthens";
const description =
  "Learning, understanding, and living out God's wisdom, through faith, by His grace. Our faith journey, told through our own life experiences, with Bible studies, writings, and lessons.";

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
            Faith Journey with The Warthens
          </p>
          <h1 className="text-balance mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            Learning, understanding, and living out God&apos;s wisdom, through
            faith, by His grace
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-foreground-muted">
            We don&apos;t believe in adopting whatever culture hands us unless
            it&apos;s actually rooted in biblical, theological truth.
          </p>

          <div className="mt-12 grid gap-4 text-left md:grid-cols-2">
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

          <p className="mx-auto mt-10 max-w-2xl text-balance text-foreground-muted">
            This is where we share what we&apos;re learning, from videos to Bible
            studies and writings.
          </p>
        </div>
      </div>

      {/* Plug for the Faith Journey YouTube channel */}
      <div
        className="relative overflow-hidden text-white"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 0%, rgba(244,184,160,0.32), transparent 45%), radial-gradient(circle at 95% 100%, rgba(147,51,234,0.35), transparent 50%), linear-gradient(135deg, #9c5268, #7d3f52 50%, #572838)",
        }}
      >
        {/* soft decorative glows and a faint dot texture */}
        <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-rose-300/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-purple-400/25 blur-3xl" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 sm:py-20 md:grid-cols-[1.05fr_0.95fr] md:gap-14">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-100">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
              </span>
              On YouTube
            </p>
            <h2 className="text-balance mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Watch Faith Journey with The Warthens
            </h2>
            <p className="mt-4 max-w-lg text-balance text-lg text-rose-100">
              Testimonies, Bible study, and honest conversations about trusting God, from our family
              to yours.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Testimonies", "Bible study", "Trusting God", "Real conversations"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-rose-50"
                >
                  {chip}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={FAITH_YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 sm:px-7 py-3.5 text-sm font-semibold text-purple-800 shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-rose-50"
              >
                Watch on YouTube
                <span aria-hidden>→</span>
              </a>
              <a
                href={`${FAITH_YOUTUBE_URL}?sub_confirmation=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-white/40 px-5 sm:px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Subscribe
              </a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl shadow-black/25 backdrop-blur-md sm:p-6">
              <div className="flex items-center gap-3">
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0b1020] ring-2 ring-white/40">
                  <Image
                    src="/brand/icon-square.png"
                    alt=""
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold leading-tight">Faith Journey with The Warthens</p>
                  <p className="text-xs text-rose-100">Juston &amp; Atiya Warthen</p>
                </div>
              </div>

              <a
                href={FAITH_YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch Faith Journey with The Warthens on YouTube"
                className="group relative mt-5 flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-white/15"
                style={{
                  backgroundImage:
                    "radial-gradient(60% 90% at 20% 0%, rgba(147,51,234,0.55), transparent), radial-gradient(50% 80% at 100% 100%, rgba(59,130,246,0.4), transparent), linear-gradient(135deg, #14104a, #241b72 55%, #3b1d86)",
                }}
              >
                <Image
                  src="/brand/icon-square.png"
                  alt=""
                  width={160}
                  height={160}
                  className="pointer-events-none absolute -right-6 -bottom-8 h-40 w-40 rounded-3xl opacity-25 mix-blend-screen"
                />
                <span className="relative flex h-20 w-20 items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-white/30 motion-safe:animate-ping" />
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white text-purple-700 shadow-xl transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 text-left text-xs font-semibold tracking-wide text-white">
                  New videos on faith and trusting God
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Latest videos */}
      <div className="mx-auto max-w-5xl space-y-6 px-6 pt-12 sm:pt-16">
        <Reveal>
          <Link
            href="/jesus"
            className="group grid overflow-hidden rounded-[2rem] border border-border-subtle bg-background-elevated transition-all hover:-translate-y-0.5 hover:border-mauve-600/40 hover:shadow-xl hover:shadow-mauve-950/10 md:grid-cols-[1.1fr_0.9fr]"
          >
            <div className="relative aspect-video md:aspect-auto md:min-h-60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://i.ytimg.com/vi/HKWT347dZ3U/maxresdefault.jpg"
                alt="She Grew Up in Church. I Didn’t. We Both Needed Jesus."
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-mauve-700">Latest video</p>
              <h2 className="text-balance mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                She Grew Up in Church. I Didn’t. We Both Needed Jesus.
              </h2>
              <p className="mt-3 text-foreground-muted">
                Why we believe in Jesus: Atiya’s story, Juston’s story, and how we both needed him.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-purple-700 transition-transform group-hover:translate-x-1">
                Read the stories and watch <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        </Reveal>
        <Reveal delay={80}>
          <Link
            href="/magnets"
            className="group grid overflow-hidden rounded-[2rem] border border-border-subtle bg-background-elevated transition-all hover:-translate-y-0.5 hover:border-mauve-600/40 hover:shadow-xl hover:shadow-mauve-950/10 md:grid-cols-[1.1fr_0.9fr]"
          >
            <div className="relative aspect-video md:aspect-auto md:min-h-60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://i.ytimg.com/vi/mKewhwS4Ys4/maxresdefault.jpg"
                alt="Our Kids Swallowed Magnets. This Is How We Trusted God."
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-mauve-700">Previous video</p>
              <h2 className="text-balance mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Our Kids Swallowed Magnets. This Is How We Trusted God.
              </h2>
              <p className="mt-3 text-foreground-muted">
                Our story, plus what every parent should know about magnetic beads.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-purple-700 transition-transform group-hover:translate-x-1">
                Read the story and watch <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        </Reveal>
      </div>

      {/* Women Who Seek */}
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-8 sm:pt-10">
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
                them, plus lessons and exercises.
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

            <div className="mt-10">
              <Reveal>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                  Lessons and exercises
                </h3>
              </Reveal>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Reveal>
                  <Link
                    href="/faith/present-but-missing"
                    className="group flex h-full flex-col rounded-3xl border border-border-subtle bg-background-elevated p-6 transition-all hover:-translate-y-0.5 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-950/5"
                  >
                    <p className="text-lg font-semibold leading-snug">Present but Missing</p>
                    <p className="mt-2 flex-1 text-sm text-foreground-muted">
                      A lesson and exercise for men on providing everything but yourself. Follow the
                      Scripture, write your notes, and email yourself a PDF.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-purple-700">
                      Start the lesson
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </Link>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
