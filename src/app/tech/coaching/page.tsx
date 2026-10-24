import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import IntakeForm from "@/components/coaching/IntakeForm";
import StickyCta from "@/components/coaching/StickyCta";
import {
  approach,
  coach,
  COACHING_PATH,
  howItWorks,
  justonCommentary,
  justonPullQuote,
  freeSession,
  coachingQuestions,
  services,
  textMessages,
  type ServiceIcon,
} from "@/lib/coaching";

const title = "1:1 Career & Sales Coaching with Jermell Mitchell | Tech Journey";
const description =
  "Paid 1:1 coaching on interviewing, networking, negotiation, and sales from enterprise Account Executive Jermell Mitchell. Start with a free 15-minute intro call.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "sales coaching",
    "tech sales coach",
    "interview coaching",
    "negotiation coaching",
    "job offer negotiation",
    "networking coach",
    "career coaching tech sales",
    "Jermell Mitchell",
  ],
  alternates: { canonical: COACHING_PATH },
  openGraph: {
    title,
    description,
    url: COACHING_PATH,
    type: "profile",
  },
  twitter: { card: "summary_large_image", title, description },
};

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-500 sm:text-base";

function Icon({ name }: { name: ServiceIcon }) {
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
  switch (name) {
    case "target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "message":
      return (
        <svg {...common}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "scale":
      return (
        <svg {...common}>
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="M7 21h10" />
          <path d="M12 3v18" />
          <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="m16 11 2 2 4-4" />
        </svg>
      );
  }
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function Check({ className = "text-blue-600" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`mt-0.5 h-5 w-5 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function CoachingPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "The Warthens", item: "https://thewarthens.com" },
      { "@type": "ListItem", position: 2, name: "Tech Journey", item: "https://thewarthens.com/tech" },
      {
        "@type": "ListItem",
        position: 3,
        name: "1:1 Coaching",
        item: `https://thewarthens.com${COACHING_PATH}`,
      },
    ],
  };

  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: coach.name,
      jobTitle: "Account Executive",
      image: `https://thewarthens.com${coach.photo}`,
      sameAs: [coach.linkedin],
      description:
        "Enterprise Account Executive with more than eight years in fintech and SaaS sales who offers paid 1:1 coaching on sales, networking, interviewing, and negotiation.",
    },
  };

  return (
    <>
      {[breadcrumbJsonLd, profileJsonLd].map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}

      {/* HERO */}
      <section
        id="top"
        className="relative overflow-hidden bg-[#090c14] text-white"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 10%, rgba(139,92,246,0.32), transparent 45%), radial-gradient(circle at 85% 5%, rgba(56,189,248,0.28), transparent 45%)",
        }}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-14 sm:pb-24 sm:pt-20 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-300" aria-hidden />
              1:1 coaching with {coach.name}
            </p>
            <h1 className="text-balance mt-5 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Personal coaching with {coach.name}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              One-on-one coaching on sales, networking, interviewing, and negotiation, shaped around
              your situation and your goals.
            </p>

            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-200">
              <li className="flex items-center gap-2">
                <Check className="text-sky-300" /> Paid 1:1 coaching
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-sky-300" /> Free 15-minute intro call
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-sky-300" /> No obligation to continue
              </li>
            </ul>

            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <a href="#apply" className={primaryButton}>
                Request a free 15-minute intro
                <span aria-hidden>→</span>
              </a>
              <a
                href="#story"
                className="text-sm font-semibold text-slate-300 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                Read Juston&apos;s story ↓
              </a>
            </div>
            <p className="mt-5 text-sm text-slate-400">
              Plus, a free 30-minute session goes to someone on a set cadence.{" "}
              <a
                href="#free-session"
                className="font-semibold text-slate-200 underline-offset-4 hover:text-white hover:underline"
              >
                Learn more
              </a>
            </p>
          </div>

          <div className="mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/40">
              <div className="relative aspect-square w-full">
                <Image
                  src={coach.photo}
                  alt={`${coach.name}, ${coach.title}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 400px, 90vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#090c14] via-[#090c14]/80 to-transparent px-6 pb-6 pt-16">
                <p className="text-xl font-semibold">{coach.name}</p>
                <p className="text-sm text-slate-300">
                  {coach.roleLine}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE QUESTIONS */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Where coaching helps
            </p>
            <h2 className="text-balance mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Questions worth talking through with a real person
            </h2>
            <p className="mt-4 text-foreground-muted">
              Everyone&apos;s situation is a little different. These are the questions people most
              often want help thinking through.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <dl className="divide-y divide-border-subtle border-y border-border-subtle">
              {coachingQuestions.map((q) => (
                <div key={q.question} className="py-5">
                  <dt className="text-lg font-semibold leading-snug">{q.question}</dt>
                  <dd className="mt-1 text-sm text-foreground-muted">{q.answer}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* AREAS OF FOCUS */}
      <section
        id="focus"
        className="relative scroll-mt-16 overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 text-white"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 0%, rgba(56,189,248,0.35), transparent 45%), radial-gradient(circle at 92% 100%, rgba(167,139,250,0.4), transparent 45%), linear-gradient(135deg, #1d4ed8, #4338ca 55%, #6d28d9)",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <Reveal className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-200">
              Areas of focus
            </p>
            <h2 className="text-balance mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
              Five areas you can be coached in
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Start with what matters most to you. {coach.firstName} shapes the coaching around
              where you are, and these apply well beyond a sales career.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3 xl:gap-4">
            {services.map((svc, i) => (
              <Reveal
                key={svc.title}
                delay={Math.min(i, 4) * 60}
                className={i === services.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}
              >
                <div
                  className={`flex h-full flex-col rounded-3xl border-t-4 ${svc.border} bg-white p-6 text-foreground shadow-xl shadow-black/15 transition-transform hover:-translate-y-1 lg:p-5 xl:p-6`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${svc.chip}`}
                    >
                      <Icon name={svc.icon} />
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-foreground-muted/60">
                      0{i + 1}
                    </span>
                  </div>
                  <p className="mt-5 text-lg font-semibold leading-snug lg:text-[17px] xl:text-lg">{svc.title}</p>
                  <p className="mt-2 text-sm text-foreground-muted lg:text-[13px] xl:text-sm">{svc.body}</p>
                  <div className="mt-auto pt-5">
                    <div className="border-t border-border-subtle pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                        Good when
                      </p>
                      <p className="mt-1 text-sm font-medium lg:text-[13px] xl:text-sm">{svc.goodWhen}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 flex flex-col items-center gap-4 text-center">
            <a
              href="#apply"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-blue-700 shadow-lg shadow-black/20 transition-colors hover:bg-blue-50 sm:text-base"
            >
              Request a free 15-minute intro
              <span aria-hidden>→</span>
            </a>
            <p className="text-sm text-blue-100">
              Not sure which area fits? Tell {coach.firstName} what matters most in the form and
              you&apos;ll shape it together.
            </p>
          </Reveal>
        </div>
      </section>

      {/* HOW HE COACHES */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              How {coach.firstName} coaches
            </p>
            <h2 className="text-balance mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Built around you, not a script
            </h2>
            <p className="mt-4 text-foreground-muted">
              The same approach doesn&apos;t work for everyone, so the guidance needs to fit you and
              give you something useful to put into practice. Sometimes that means working through a
              specific challenge. Other times it means seeing a strength you already have but
              haven&apos;t fully used.
            </p>
            <blockquote className="mt-6 border-l-4 border-blue-600 pl-5">
              <p className="text-xl font-semibold leading-snug tracking-tight">
                &ldquo;Selling starts with understanding people, including yourself.&rdquo;
              </p>
              <footer className="mt-1 text-sm text-foreground-muted">{coach.name}</footer>
            </blockquote>
            <a
              href={coach.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-border-subtle bg-background px-5 py-2.5 text-sm font-semibold transition-colors hover:border-[#0A66C2]/50 hover:text-[#0A66C2]"
            >
              <span className="text-[#0A66C2]">
                <LinkedInIcon />
              </span>
              {coach.firstName} on LinkedIn
              <span aria-hidden>↗</span>
            </a>
          </Reveal>

          <div className="space-y-4">
            {approach.map((a, i) => (
              <Reveal key={a.title} delay={i * 80}>
                <div className="flex gap-4 rounded-3xl border border-border-subtle bg-background-elevated p-6">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{a.title}</p>
                    <p className="mt-1.5 text-sm text-foreground-muted">{a.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-border-subtle bg-background-elevated/60">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              How it works
            </p>
            <h2 className="text-balance mt-2 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              A simple way to start
            </h2>
          </Reveal>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {howItWorks.map((step, i) => (
              <Reveal key={step.title} delay={i * 70}>
                <div className="h-full rounded-3xl border border-border-subtle bg-background p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
                    {i + 1}
                  </span>
                  <p className="mt-4 font-semibold">{step.title}</p>
                  <p className="mt-1.5 text-sm text-foreground-muted">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <a href="#apply" className={primaryButton}>
              Request a free 15-minute intro
              <span aria-hidden>→</span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* JUSTON'S STORY */}
      <section id="story" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-16 sm:py-24">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            From someone who&apos;s been coached by {coach.firstName}
          </p>
          <h2 className="text-balance mt-2 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            A note from Juston
          </h2>
          <div className="mt-5 flex items-center gap-3">
            <Image
              src="/team/juston.jpg"
              alt="Juston Warthen"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
            <p className="text-sm">
              <span className="font-semibold">Juston Warthen</span>
              <span className="block text-foreground-muted">Tech Journey, thewarthens.com</span>
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <blockquote className="border-l-4 border-blue-600 pl-6">
              <p className="text-balance text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
                &ldquo;{justonPullQuote}&rdquo;
              </p>
              <footer className="mt-4 text-sm text-foreground-muted">
                A line from {coach.firstName} that hit me like a pair of brass knuckles
              </footer>
            </blockquote>
          </Reveal>
          <Reveal delay={100}>
            <div className="space-y-4 text-foreground-muted">
              {justonCommentary.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="mt-6 rounded-2xl border border-border-subtle bg-background-elevated px-4 py-3 text-xs text-foreground-muted">
              That&apos;s my experience, and it&apos;s mine alone. Coaching can&apos;t promise a job,
              a raise, or an offer. Your effort, your background, and the market all matter too.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <h3 className="text-xl font-semibold sm:text-2xl">In his own words</h3>
          <p className="mt-2 max-w-2xl text-sm text-foreground-muted">
            Real texts from {coach.firstName} while he was coaching me. The highlights are mine.
            Other messages are blurred for privacy.
          </p>
        </Reveal>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {textMessages.slice(0, 2).map((t, i) => (
            <Reveal key={t.src} delay={i * 80}>
              <figure>
                <div className="overflow-hidden rounded-3xl border border-border-subtle bg-white shadow-lg shadow-blue-950/5">
                  <Image
                    src={t.src}
                    alt={t.alt}
                    width={t.width}
                    height={t.height}
                    sizes="(min-width: 768px) 480px, 92vw"
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="mt-3 text-sm font-semibold">{t.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
          <Reveal className="md:col-span-2">
            <figure className="mx-auto max-w-2xl">
              <div className="overflow-hidden rounded-3xl border border-border-subtle bg-white shadow-lg shadow-blue-950/5">
                <Image
                  src={textMessages[2].src}
                  alt={textMessages[2].alt}
                  width={textMessages[2].width}
                  height={textMessages[2].height}
                  sizes="(min-width: 672px) 672px, 92vw"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-3">
                <span className="text-sm font-semibold">{textMessages[2].caption}</span>
                <span className="mt-1 block text-sm italic text-foreground-muted">
                  &ldquo;{textMessages[2].quote}&rdquo;
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* FREE SESSION */}
      <section id="free-session" className="mx-auto max-w-5xl scroll-mt-24 px-6 pb-16 sm:pb-24">
        <Reveal>
          <div className="rounded-[2rem] bg-gradient-to-br from-violet-500/60 via-blue-500/50 to-sky-400/60 p-px">
            <div className="grid gap-8 rounded-[calc(2rem-1px)] bg-background p-7 sm:p-10 md:grid-cols-[auto_1fr] md:gap-10">
              <div className="flex items-center gap-5 md:flex-col md:items-start md:gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 via-blue-600 to-sky-500 text-5xl font-semibold text-white shadow-xl shadow-blue-600/25">
                  30
                </div>
                <p className="text-sm font-semibold uppercase tracking-wider text-foreground-muted">
                  free minutes
                  <span className="block">with Jermell</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-violet-700">
                  A little something extra
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {freeSession.title}
                </h2>
                <p className="mt-4 text-lg text-foreground-muted">{freeSession.lead}</p>
                <p className="mt-2 text-foreground-muted">{freeSession.sub}</p>

                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  {freeSession.points.map((p) => (
                    <div key={p.title}>
                      <p className="font-semibold">{p.title}</p>
                      <p className="mt-1 text-sm text-foreground-muted">{p.body}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <a href="#apply" className={primaryButton}>
                    Request your intro call
                    <span aria-hidden>→</span>
                  </a>
                </div>
                <p className="mt-5 text-xs text-foreground-muted">{freeSession.fineprint}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* APPLY */}
      <section
        id="apply"
        className="relative scroll-mt-16 overflow-hidden bg-[#090c14] text-white"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 0%, rgba(139,92,246,0.25), transparent 45%), radial-gradient(circle at 10% 100%, rgba(56,189,248,0.2), transparent 45%)",
        }}
      >
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
          <Reveal className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-300">
              Step one
            </p>
            <h2 className="text-balance mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Request your free 15-minute intro call
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Answer seven questions so {coach.firstName} can see where he can actually help. If it
              looks like a fit, you&apos;ll be contacted to schedule the call. The coaching itself
              is a paid service, and nothing here commits you to it.
            </p>
          </Reveal>
          <Reveal className="mt-10 text-foreground" delay={100}>
            <IntakeForm />
          </Reveal>
        </div>
      </section>

      {/* DISCLOSURES */}
      <section className="mx-auto max-w-3xl px-6 pb-20 pt-10">
        <p className="text-center text-xs leading-relaxed text-foreground-muted">
          {coach.name} offers coaching independently. Coaching outcomes depend on many factors,
          including your effort, experience, and the job market, and no result is guaranteed.
        </p>
      </section>

      <StickyCta formId="apply" />
    </>
  );
}
