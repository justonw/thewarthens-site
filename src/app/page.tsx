import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ScrollCue from "@/components/ScrollCue";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The Warthens",
  alternateName: ["Tech Journey", "The Warthens Tech Journey"],
  url: "https://thewarthens.com",
  logo: "https://thewarthens.com/brand/icon-square.png",
  description:
    "Juston and Atiya Warthen, known as Tech Journey, share practical steps for a career change into tech, plus their journey of relying on God to discover, understand, and live out truth.",
  sameAs: [
    "https://youtube.com/@thewarthens",
    "https://www.instagram.com/thewarthens",
    "https://www.tiktok.com/@techjourneyyoutube",
    "https://www.linkedin.com/in/juston-warthen-96aa13167",
    "https://www.linkedin.com/in/atiya-warthen-4062881b0",
  ],
};

function LinkedInBadge() {
  return (
    <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-[#0A66C2] text-white shadow-sm">
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.114 20.452H3.558V9h3.556v11.452z" />
      </svg>
    </span>
  );
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 30% 20%, rgba(139,92,246,0.18), transparent), radial-gradient(50% 40% at 80% 10%, rgba(56,189,248,0.16), transparent)",
          }}
        />
        <Reveal className="mx-auto max-w-4xl px-6 pt-20 pb-16 text-center sm:pt-28 sm:pb-20">
          <Image
            src="/brand/icon-square.png"
            alt="The Warthens"
            width={88}
            height={88}
            className="mx-auto mb-8 rounded-2xl"
            priority
          />
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            We&apos;re Juston &amp; Atiya Warthen
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-foreground-muted">
            One life, two journeys we&apos;re walking out loud: a career
            transition into tech that changed our income and our peace of
            mind, and a faith journey of relying on God to discover,
            understand, and live out truth.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://youtube.com/@thewarthens?si=hMA8NuKtm0vox8X4"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.03] hover:opacity-90"
            >
              Watch on YouTube
            </a>
            <Link
              href="/tech"
              className="rounded-full border border-border-subtle px-6 py-3 text-sm font-semibold transition-colors hover:bg-background-elevated"
            >
              Start the Tech Journey
            </Link>
          </div>
          <ScrollCue className="mt-12" />
        </Reveal>
      </section>

      {/* Two journeys */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-2">
          <Reveal>
            <Link
              href="/tech"
              className="group relative block h-full overflow-hidden rounded-3xl border border-border-subtle bg-background-elevated p-8 transition-all hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-950/5"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl transition-opacity group-hover:opacity-80"
              />
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Tech Journey
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                A career that fits, a life that feels lighter
              </h2>
              <p className="mt-3 text-foreground-muted">
                Practical, real-world steps for anyone thinking bigger than
                their current job, income, or field: coding, IT,
                cybersecurity, sales, UX, the trades, and everything tech
                touches.
              </p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                Explore Tech Resources
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <Link
              href="/faith"
              className="group relative block h-full overflow-hidden rounded-3xl border border-border-subtle bg-background-elevated p-8 transition-all hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-950/5"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl transition-opacity group-hover:opacity-80"
              />
              <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">
                Faith Journey
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                Reliance on God for discovering, understanding, and living out truth
              </h2>
              <p className="mt-3 text-foreground-muted">
                Our story of deconstruction and restoration after serving in
                local church leadership, plus Women Who Seek, a community
                for women hosted by Atiya. More is on the way.
              </p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-purple-600">
                Watch Our Story
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* About */}
      <section className="border-t border-border-subtle bg-background-elevated/40">
        <Reveal className="mx-auto max-w-5xl px-6 py-20">
          <div className="grid items-center gap-10 sm:grid-cols-[auto_1fr]">
            <div className="flex justify-center gap-4 sm:justify-start">
              <a
                href="https://www.linkedin.com/in/atiya-warthen-4062881b0"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block h-28 w-28 shrink-0"
                aria-label="Atiya Warthen on LinkedIn"
              >
                <Image
                  src="/team/atiya.png"
                  alt="Atiya Warthen"
                  width={112}
                  height={112}
                  className="h-28 w-28 rounded-full border-2 border-border-subtle object-cover transition-opacity group-hover:opacity-90"
                />
                <LinkedInBadge />
              </a>
              <a
                href="https://www.linkedin.com/in/juston-warthen-96aa13167"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative -ml-6 block h-28 w-28 shrink-0"
                aria-label="Juston Warthen on LinkedIn"
              >
                <Image
                  src="/team/juston.jpg"
                  alt="Juston Warthen"
                  width={112}
                  height={112}
                  className="h-28 w-28 rounded-full border-2 border-border-subtle object-cover transition-opacity group-hover:opacity-90"
                />
                <LinkedInBadge />
              </a>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">About us</h2>
              <p className="mt-3 text-foreground-muted">
                We&apos;re a married couple navigating career growth in tech
                and a growing faith, sharing what we&apos;re learning so
                other people don&apos;t have to figure it out alone. If
                you&apos;re thinking about a change and know it might be
                time to learn something new, we&apos;re here to help you
                think bigger than what&apos;s in front of you right now.
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
