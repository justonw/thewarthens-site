import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

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

const startPaths = [
  {
    icon: "compass" as const,
    title: "Find your path",
    body: "A free 2-minute quiz on how you like to work, what is pulling you toward a change, and your pace.",
    href: "/tech#quiz",
    cta: "Take the quiz",
    chip: "bg-blue-100 text-blue-700",
  },
  {
    icon: "book" as const,
    title: "Start with a step-by-step guide",
    body: "Free guides for tech sales, cybersecurity, coding, and data analytics, with real video from people doing the job.",
    href: "/tech#start-here",
    cta: "Pick a guide",
    chip: "bg-violet-100 text-violet-700",
  },
  {
    icon: "chat" as const,
    title: "Talk it through with a coach",
    body: "1:1 coaching with Jermell Mitchell on interviewing, networking, and negotiation, starting with a free 15-minute intro call.",
    href: "/tech/coaching?from=home",
    cta: "Learn about coaching",
    chip: "bg-emerald-100 text-emerald-700",
  },
];

function PathIcon({ name }: { name: "compass" | "book" | "chat" }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-6 w-6",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "compass") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
      </svg>
    );
  }
  if (name === "book") {
    return (
      <svg {...common}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
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
              "radial-gradient(60% 50% at 20% 10%, rgba(139,92,246,0.18), transparent), radial-gradient(50% 40% at 85% 0%, rgba(56,189,248,0.18), transparent)",
          }}
        />
        <div className="mx-auto max-w-4xl px-6 pb-16 pt-16 text-center sm:pb-24 sm:pt-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-background/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden />
            Tech Journey and Faith Journey
          </p>
          <h1 className="text-balance mt-6 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            We&apos;re Juston &amp; Atiya Warthen
          </h1>
          <p className="text-balance mx-auto mt-6 max-w-2xl text-lg text-foreground-muted">
            One life, two journeys we&apos;re walking out loud: a career
            transition into tech that changed our income and our peace of
            mind, and a faith journey of relying on God to discover,
            understand, and live out truth.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
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
              className="rounded-full border border-border-subtle bg-background px-6 py-3 text-sm font-semibold transition-colors hover:bg-background-elevated"
            >
              Start the Tech Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Where to begin */}
      <section className="mx-auto max-w-6xl px-6 pb-16 sm:pb-20">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Where to begin
          </p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Three ways into the Tech Journey
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {startPaths.map((path, i) => (
            <Reveal key={path.title} delay={i * 70}>
              <Link
                href={path.href}
                className="group flex h-full flex-col rounded-3xl border border-border-subtle bg-background-elevated p-6 transition-all hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-950/5"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${path.chip}`}
                >
                  <PathIcon name={path.icon} />
                </span>
                <p className="mt-5 text-lg font-semibold">{path.title}</p>
                <p className="mt-2 flex-1 text-sm text-foreground-muted">{path.body}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                  {path.cta}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Two journeys */}
      <section className="mx-auto max-w-6xl px-6 pb-20 sm:pb-24">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <Link
              href="/tech"
              className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] p-8 text-white shadow-xl shadow-blue-950/15 transition-transform hover:-translate-y-1 sm:p-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 12% 0%, rgba(56,189,248,0.4), transparent 45%), linear-gradient(135deg, #1d4ed8, #4338ca 55%, #6d28d9)",
              }}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-sky-200">
                Tech Journey
              </p>
              <h2 className="text-balance mt-3 text-3xl font-semibold leading-tight">
                A career that fits, a life that feels lighter
              </h2>
              <p className="mt-4 text-blue-100">
                Practical, real-world steps for anyone thinking bigger than
                their current job, income, or field: coding, IT,
                cybersecurity, sales, UX, the trades, and everything tech
                touches.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2 text-sm font-medium">
                {["Career quiz", "Real pay data", "Hype vs. Reality", "Start Here guides"].map(
                  (tag) => (
                    <li key={tag} className="rounded-full bg-white/15 px-3 py-1">
                      {tag}
                    </li>
                  )
                )}
              </ul>
              <span className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition-colors group-hover:bg-blue-50">
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
              className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] p-8 text-white shadow-xl shadow-rose-950/15 transition-transform hover:-translate-y-1 sm:p-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 88% 0%, rgba(244,184,160,0.35), transparent 45%), linear-gradient(135deg, #9c5268, #7d3f52 50%, #572838)",
              }}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-rose-200">
                Faith Journey
              </p>
              <h2 className="text-balance mt-3 text-3xl font-semibold leading-tight">
                Reliance on God for discovering, understanding, and living out truth
              </h2>
              <p className="mt-4 text-rose-100">
                Our story of deconstruction and restoration after serving in
                local church leadership, plus Women Who Seek, a community
                for women hosted by Atiya. More is on the way.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2 text-sm font-medium">
                {["Our story", "Writings", "Women Who Seek"].map((tag) => (
                  <li key={tag} className="rounded-full bg-white/15 px-3 py-1">
                    {tag}
                  </li>
                ))}
              </ul>
              <span className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#7d3f52] transition-colors group-hover:bg-rose-50">
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
