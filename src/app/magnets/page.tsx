import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

const VIDEO_ID = "mKewhwS4Ys4";
const VIDEO_TITLE = "Our Kids Swallowed Magnets. This Is How We Trusted God.";
const FAITH_YOUTUBE_URL = "https://www.youtube.com/channel/UCJj_ar9Gs8YvcYK6jSh9a6g";

// Search title stays under about 60 characters; the on-page headline and social cards use the video title.
const title = "Kids Swallowed Magnets: Our Story & Safety Tips | The Warthens";
const description =
  "Our kids swallowed magnetic beads. Watch our story of trusting God in a worst-case scenario, and learn what parents should know about magnet safety.";
const thumbnail = `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`;
const CPSC_URL =
  "https://www.cpsc.gov/Newsroom/News-Releases/2021/Ingestion-of-High-Powered-Magnetic-Balls-and-Magnetic-Cubes-Poses-Serious-Risk-of-Severe-Internal-Injury-or-Death-in-Children-and-Teens";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/magnets" },
  keywords: [
    "kids swallowed magnets",
    "child swallowed magnet",
    "magnetic beads dangerous",
    "magnet balls swallowed",
    "swallowed magnets symptoms",
    "trusting God in hard times",
    "Christian family testimony",
  ],
  openGraph: {
    title: VIDEO_TITLE,
    description,
    url: "/magnets",
    type: "website",
    images: [{ url: thumbnail, width: 1280, height: 720, alt: VIDEO_TITLE }],
  },
  twitter: { card: "summary_large_image", title: VIDEO_TITLE, description, images: [thumbnail] },
};

// The story section is built only from Atiya's own account. It leaves out names of the children,
// doctors, and hospitals on purpose.
const story = [
  "On a Monday in July 2026, in the middle of what was supposed to be our family vacation week, our four-year-old daughter told us her throat hurt and that she had swallowed a magnet. She was playing and laughing, so we hoped it was one small magnet. Urgent care took X-rays, and they showed around 30 tiny magnets in her stomach, clustered in two groups. The colorful magnetic beads had been a toy in our home. We thought we had put them all away.",
  "She was sent to a children's hospital, where the surgeon explained that magnets this strong can pull toward each other through the walls of the intestines, and that waiting was risky. We prayed, asked questions, and agreed she needed surgery. For more than three hours, we didn't know if our daughter was okay. When the surgeon finally came to talk to us, he told us the magnets had pinched her intestines and that he had repaired the holes they caused.",
  "We had already decided that our two-year-old son needed X-rays too, so the next morning we took him in. He looked normal, just like his sister had, but an X-ray showed a cluster of magnets in him as well, and he needed surgery too. Two days after we came home, he developed an abscess, a pocket of infection, and needed another procedure.",
  "Both of our children came through, and we are so grateful they're still here. It was also the hardest week of our lives. In the midst of fear and doubt, God graced us with faith, even giving Atiya Philippians 4:13 specifically.",
  "What helped us was being willing to face hard decisions, refusing to let self-condemnation have the last word, trusting God with what we couldn't control, and letting Scripture, like Philippians 4:6-7, quiet the storm inside us.",
  "If you're a parent, here is what we most want you to know. Swallowed magnets can look like nothing at first. Our daughter seemed fine all day with around 30 magnets inside her, and our son looked normal too. Magnetic beads look like candy to little kids, and they don't understand the danger. If you have young children, keep magnetic beads out of your home, and if a child swallows any, go to the emergency room right away.",
];

// Safety answers follow the U.S. Consumer Product Safety Commission guidance on swallowed magnets.
const faq = [
  {
    question: "What should I do if my child swallowed a magnet?",
    answer:
      "Get emergency medical care right away, even if your child seems fine. The Consumer Product Safety Commission says not to wait for symptoms. Tell the medical team how many magnets you think were swallowed.",
  },
  {
    question: "Why are magnetic beads (magnet balls) dangerous?",
    answer:
      "Strong magnets can pull toward each other, or toward metal objects, through the walls of the intestines. That can cause serious injury, such as tears, blockages, and infection. On an X-ray, several magnets can even look like a single object.",
  },
  {
    question: "What are the symptoms of swallowing magnets?",
    answer:
      "Stomach pain, nausea, vomiting, or diarrhea can show up, but serious injury can happen before any symptoms appear. That is why you should not wait to see if your child is okay.",
  },
  {
    question: "How can I keep magnets away from my kids?",
    answer:
      "Remove magnetic beads, magnet sets, and small magnets from homes with young children, check play areas and floors for loose or missing ones, and teach kids never to put magnets near their mouth or nose.",
  },
  {
    question: "How did you trust God when you couldn't control the outcome?",
    answer:
      "Four things helped us: being willing to face hard decisions, not letting self-condemnation have the last word, trusting God with the uncertainty, and quieting the storm within. We talk through each one in the video.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "VideoObject",
      "@id": "https://thewarthens.com/magnets#video",
      name: VIDEO_TITLE,
      description:
        "Our kids swallowed magnetic beads and we faced a worst-case scenario. This is our story of trusting God when we couldn't control the outcome.",
      thumbnailUrl: [thumbnail],
      uploadDate: "2026-11-12T08:30:10-08:00",
      duration: "PT39M24S",
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
      "@id": "https://thewarthens.com/magnets",
      url: "https://thewarthens.com/magnets",
      name: title,
      description,
      mainEntity: { "@id": "https://thewarthens.com/magnets#video" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "The Warthens", item: "https://thewarthens.com" },
        { "@type": "ListItem", position: 2, name: "Faith Journey", item: "https://thewarthens.com/faith" },
        { "@type": "ListItem", position: 3, name: VIDEO_TITLE, item: "https://thewarthens.com/magnets" },
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

export default function MagnetsPage() {
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
          <aside
            aria-labelledby="safety-note"
            className="mx-auto mt-14 max-w-2xl rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 text-left sm:p-8"
          >
            <p
              id="safety-note"
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden
              >
                <path d="M12 3.5 2.8 19.5h18.4L12 3.5Z" />
                <path d="M12 10v4.5" />
                <path d="M12 17.2h.01" />
              </svg>
              Safety note for parents
            </p>
            <p className="mt-3 text-foreground">
              Magnetic beads (magnet balls) are dangerous if swallowed. If a child swallows any, get
              emergency medical care right away, even if they seem fine. Magnets can attract each
              other inside the body and cause serious injury (or worse). Keep them away from young
              children, and think about removing them from your home. We&apos;re sharing our
              experience, not giving medical advice.
            </p>
          </aside>
        </Reveal>

        <Reveal delay={80}>
          <article className="mx-auto mt-16 max-w-2xl text-left">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Our story: when our kids swallowed magnetic beads
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-foreground">
              {story.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </article>
        </Reveal>

        <Reveal delay={80}>
          <div className="mx-auto mt-16 max-w-2xl text-left">
            <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
              What parents should know
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
            <p className="mt-6 text-center text-sm text-foreground-muted">
              Safety information is based on guidance from the{" "}
              <a
                href={CPSC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-purple-700 underline underline-offset-4"
              >
                U.S. Consumer Product Safety Commission
              </a>
              . We&apos;re sharing our experience, not giving medical advice.
            </p>
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
