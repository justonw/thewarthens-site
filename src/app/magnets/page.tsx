import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

const VIDEO_ID = "mKewhwS4Ys4";
const VIDEO_TITLE = "Our Kids Swallowed Magnets. This Is How We Trusted God.";
const FAITH_YOUTUBE_URL = "https://www.youtube.com/channel/UCJj_ar9Gs8YvcYK6jSh9a6g";

const title = `${VIDEO_TITLE} | The Warthens`;
const description =
  "Our kids swallowed magnetic beads and we faced a worst-case scenario. Watch the full story of how we trusted God when we couldn't control the outcome, plus a safety note for parents.";
const thumbnail = `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/magnets" },
  openGraph: {
    title,
    description,
    url: "/magnets",
    type: "website",
    images: [{ url: thumbnail, width: 1280, height: 720, alt: VIDEO_TITLE }],
  },
  twitter: { card: "summary_large_image", title, description, images: [thumbnail] },
};

export default function MagnetsPage() {
  return (
    <section className="relative overflow-hidden">
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

        <p className="mx-auto mt-8 max-w-xl text-balance text-lg text-foreground-muted">
          Atiya shares the full story, and we talk about what carried us when the outcome was out of
          our hands.
        </p>

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
