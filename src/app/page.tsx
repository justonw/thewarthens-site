import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CrewStrip from "@/components/career-day/CrewStrip";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// The front door: one question, and each answer goes straight to the right part of the site.
const doors = [
  {
    icon: "compass" as const,
    title: "Find my next career move",
    body: "A 2-minute quiz on how you like to work and what is pulling you toward a change.",
    href: "/tech#quiz",
    track: "door-career",
    cta: "Take the quiz",
    chip: "bg-blue-100 text-blue-700",
  },
  {
    icon: "file" as const,
    title: "Get a better resume",
    body: "Add your resume and a job posting. Get a tailored version in about a minute.",
    href: "/resume",
    track: "door-resume",
    cta: "Build my resume",
    chip: "bg-violet-100 text-violet-700",
  },
  {
    icon: "book" as const,
    title: "Grow in my faith",
    body: "Our story, Scripture-based studies, and Women Who Seek.",
    href: "/faith",
    track: "door-faith",
    cta: "Start with our story",
    chip: "bg-rose-100 text-rose-700",
  },
  {
    icon: "game" as const,
    title: "Games for my kids",
    body: "A career and online-safety game for ages 5 to 10. No sign-in.",
    href: "/techjr",
    track: "door-kids",
    cta: "See the games",
    chip: "bg-amber-100 text-amber-700",
  },
  {
    icon: "chat" as const,
    title: "Talk it through with a coach",
    body: "1:1 coaching with Jermell Mitchell on interviewing, networking, and negotiation.",
    href: "/tech/coaching?from=home",
    track: "door-coaching",
    cta: "Learn about coaching",
    chip: "bg-emerald-100 text-emerald-700",
  },
];

function PathIcon({ name }: { name: "compass" | "file" | "book" | "game" | "chat" }) {
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
  if (name === "file") {
    return (
      <svg {...common}>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5M9 13h6M9 17h6" />
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
  if (name === "game") {
    return (
      <svg {...common}>
        <rect x="2" y="7" width="20" height="11" rx="5" />
        <path d="M7 10.5v4M5 12.5h4M15.5 11.5h.01M18 13.5h.01" />
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
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-[#090c14] text-white"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 8%, rgba(139,92,246,0.38), transparent 42%), radial-gradient(circle at 88% 0%, rgba(56,189,248,0.32), transparent 42%), radial-gradient(circle at 60% 100%, rgba(217,70,239,0.18), transparent 45%)",
        }}
      >
        <div aria-hidden className="dot-grid pointer-events-none absolute inset-0" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 pt-14 sm:pb-28 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-300" aria-hidden />
              Tech Journey and Faith Journey
            </p>
            <h1 className="text-balance mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              We&apos;re Juston &amp; Atiya Warthen
            </h1>
            <p className="text-balance mt-6 max-w-xl text-lg text-slate-300">
              One life, two journeys we&apos;re walking out loud: a career
              transition into tech that changed our income and our peace of
              mind, and a faith journey of relying on God to discover,
              understand, and live out truth.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/tech"
                data-track="hero-tech"
                className="inline-flex min-h-12 items-center rounded-full bg-white px-7 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-black/30 transition-transform hover:scale-[1.03]"
              >
                Start the Tech Journey
              </Link>
              <a
                href="https://youtube.com/@thewarthens?si=hMA8NuKtm0vox8X4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center rounded-full px-4 py-3 text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
              >
                Watch on YouTube
              </a>
            </div>
            <nav aria-label="Other places to start" className="mt-4">
              <p className="text-sm text-slate-300">Looking for something else?</p>
              <ul className="mt-1 flex flex-wrap gap-x-5">
                {[
                  ["Resume help", "/resume"],
                  ["Faith Journey", "/faith"],
                  ["Games for kids", "/techjr"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="inline-flex min-h-11 items-center text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* The two of us */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-0 rounded-full bg-gradient-to-br from-violet-500/30 via-fuchsia-500/10 to-sky-400/30 blur-3xl"
            />
            <div className="relative flex items-center justify-center gap-4 sm:gap-5">
              <div className="w-[47%] -rotate-2 rounded-[2.2rem] bg-gradient-to-br from-violet-400 via-fuchsia-400 to-rose-300 p-[3px] shadow-2xl shadow-violet-950/50">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.1rem] bg-slate-200">
                  <Image
                    src="/team/atiya.png"
                    alt="Atiya Warthen, who co-leads Faith Journey and hosts Women Who Seek"
                    fill
                    priority
                    sizes="(min-width: 1024px) 260px, 44vw"
                    className="object-cover"
                    style={{ objectPosition: "50% 28%" }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#090c14]/95 via-[#090c14]/60 to-transparent px-4 pb-4 pt-14">
                    <p className="font-semibold">Atiya</p>
                    <p className="text-xs text-slate-300">Warthen</p>
                  </div>
                </div>
              </div>
              <div className="mt-10 w-[47%] rotate-2 rounded-[2.2rem] bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-400 p-[3px] shadow-2xl shadow-blue-950/50 sm:mt-14">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.1rem] bg-blue-700">
                  <Image
                    src="/team/juston.jpg"
                    alt="Juston Warthen, co-host of Tech Journey and Faith Journey"
                    fill
                    priority
                    sizes="(min-width: 1024px) 260px, 44vw"
                    className="object-cover"
                    style={{ objectPosition: "50% 18%" }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#090c14]/95 via-[#090c14]/60 to-transparent px-4 pb-4 pt-14">
                    <p className="font-semibold">Juston</p>
                    <p className="text-xs text-slate-300">Warthen</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Both of us are on both journeys, so one shared badge instead of one per person */}
            <span className="cd-float absolute -bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-slate-900 shadow-xl shadow-black/30">
              <span className="h-2 w-2 rounded-full bg-blue-600" aria-hidden />
              Tech Journey
              <span aria-hidden className="text-slate-300">
                +
              </span>
              <span className="h-2 w-2 rounded-full bg-purple-600" aria-hidden />
              Faith Journey
            </span>
          </div>
        </div>
      </section>

      {/* The front door */}
      <section aria-labelledby="front-door" className="mx-auto max-w-6xl px-6 pb-14 pt-14 sm:pb-20 sm:pt-20">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Start here</p>
          <h2 id="front-door" className="mt-2 text-2xl font-semibold sm:text-3xl">
            What brings you here today?
          </h2>
        </Reveal>
        <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {doors.map((door, i) => (
            <li key={door.title}>
              <Reveal delay={i * 60}>
                <Link
                  href={door.href}
                  data-track={door.track}
                  className="group flex h-full items-start gap-4 rounded-3xl border border-border-subtle bg-background-elevated p-5 transition-all hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-lg lg:flex-col lg:gap-0"
                >
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${door.chip}`}>
                    <PathIcon name={door.icon} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col lg:mt-5">
                    <span className="text-lg font-semibold leading-snug">{door.title}</span>
                    <span className="mt-1.5 flex-1 text-sm text-foreground-muted">{door.body}</span>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                      {door.cta}
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
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

      {/* Tech Journey Jr. */}
      <section className="mx-auto max-w-6xl px-6 pb-20 sm:pb-24">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-950/20 sm:p-12"
            style={{
              backgroundImage:
                "radial-gradient(circle at 90% 0%, rgba(244,114,182,0.45), transparent 45%), radial-gradient(circle at 0% 100%, rgba(56,189,248,0.35), transparent 45%), linear-gradient(135deg, #261a68, #3b1f8f 55%, #1e3a8a)",
            }}
          >
            <div aria-hidden className="dot-grid pointer-events-none absolute inset-0" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-amber-200">
                  For the kids
                </p>
                <h2 className="text-balance mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                  Tech Journey Jr.
                </h2>
                <p className="mt-4 max-w-xl text-indigo-100">
                  A free career and online-safety game for ages 5 to 10. Two age groups, a voice that
                  reads every screen, Cool Facts about the real people who built tech, and a crew of
                  kids who look like the kids who play. No sign-in.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/techjr/play"
                    className="rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/20 transition-transform hover:scale-[1.03]"
                  >
                    Play the game
                  </Link>
                  <Link
                    href="/techjr"
                    className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                  >
                    For parents and teachers
                  </Link>
                </div>
              </div>
              <CrewStrip
                ids={["maya", "kenji", "emma", "jamal", "joy", "joshua", "lily", "diego"]}
                size={84}
                className="mx-auto max-w-sm"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* About */}
      <section
        className="relative overflow-hidden bg-[#090c14] text-white"
        style={{
          backgroundImage:
            "radial-gradient(circle at 90% 0%, rgba(139,92,246,0.35), transparent 45%), radial-gradient(circle at 5% 100%, rgba(56,189,248,0.25), transparent 45%)",
        }}
      >
        <Reveal className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-300">About us</p>
          <h2 className="text-balance mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Think bigger than what&apos;s in front of you right now
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            We&apos;re a married couple navigating career growth in tech and a
            growing faith, sharing what we&apos;re learning so other people
            don&apos;t have to figure it out alone. If you&apos;re thinking
            about a change and know it might be time to learn something new,
            we&apos;re here to help.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {[
              { name: "Juston", href: "https://www.linkedin.com/in/juston-warthen-96aa13167" },
              { name: "Atiya", href: "https://www.linkedin.com/in/atiya-warthen-4062881b0" },
            ].map((person) => (
              <a
                key={person.name}
                href={person.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/15"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-sky-300" aria-hidden>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                </svg>
                {person.name} on LinkedIn
              </a>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
