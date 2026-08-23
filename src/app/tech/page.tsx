import type { Metadata } from "next";
import Link from "next/link";
import { freeResources, techSections } from "@/lib/tech-links";
import { guides } from "@/lib/guides";
import { startHereGuides } from "@/lib/start-here";
import Reveal from "@/components/Reveal";
import ScrollCue from "@/components/ScrollCue";
import CareerQuiz from "@/components/CareerQuiz";
import IncomeSnapshot from "@/components/IncomeSnapshot";
import JobTracker from "@/components/JobTracker";
import StarterChecklist from "@/components/StarterChecklist";
import EmailGatedDownload from "@/components/EmailGatedDownload";
import CourseSection from "@/components/CourseSection";

const title = "Tech Journey | Career Change to Tech | The Warthens";
const description =
  "Real steps for a career change to tech, no experience or degree needed for most paths. Take the free 2-minute career quiz, see real 2026 pay data, and read our honest Hype vs. Reality guides before you commit.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "career change to tech",
    "tech career pivot",
    "is it too late to switch careers to tech",
    "career change no experience no degree",
    "is tech sales worth it",
    "is software engineering still a good career",
    "coding bootcamp worth it",
    "tech journey warthen",
  ],
  alternates: { canonical: "/tech" },
  openGraph: { title, description, url: "/tech" },
  twitter: { card: "summary_large_image", title, description },
};

const quickNav = [
  { href: "#quiz", label: "Find Your Path" },
  { href: "#pay", label: "See the Pay" },
  { href: "#guides", label: "Hype vs. Reality" },
  { href: "#start-here", label: "Start Here (Free)" },
  { href: "#learn", label: "Learn a Skill" },
  { href: "#checklist", label: "Beat the AI Scan" },
  { href: "#tracker", label: "Track Applications" },
  { href: "#toolkit", label: "Get the Files" },
];

const hubFaq = [
  {
    question: "How do I change careers into tech with no experience or degree?",
    answer:
      "Take the free career quiz to see which path fits how you work, then use that path's free Start Here guide before spending a dollar on any course. Most of the paths on this page, tech sales, IT, cybersecurity, coding, and the trades, don't require a degree, they require transferable skills and a real search.",
  },
  {
    question: "What tech career pays the most for beginners in 2026?",
    answer:
      "Based on the entry-level ranges in our Income Snapshot, IT & Cybersecurity ($78K-$100K) and Data Analytics ($85K-$100K) currently show the highest entry-level ranges, with Software Engineering ($60K-$75K) and Skilled Trades ($60K-$80K) close behind. Ranges vary by location and employer, and none of these are guarantees.",
  },
  {
    question: "Is it too late to switch careers to tech?",
    answer:
      "No, but the on-ramp looks different than it did a few years ago. Our Hype vs. Reality guides break down what's actually changed for tech sales, software engineering, and cybersecurity, so you can go in with realistic timelines instead of outdated marketing claims.",
  },
  {
    question: "How much does it cost to start a career in tech?",
    answer:
      "It can cost nothing to start. Every path's Start Here guide is a free, step-by-step way to test whether a field fits you before you consider a paid course or bootcamp. Paying only makes sense later, once you want a structured program and community on top of what you've already learned for free.",
  },
];

export default function TechJourneyPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "The Warthens", item: "https://thewarthens.com" },
      { "@type": "ListItem", position: 2, name: "Tech Journey", item: "https://thewarthens.com/tech" },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: hubFaq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(50% 40% at 20% 0%, rgba(56,189,248,0.16), transparent)",
          }}
        />
        <Reveal className="mx-auto max-w-3xl px-6 pt-16 pb-10 text-center sm:pt-24 sm:pb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Tech Journey
          </p>
          <h1 className="text-balance mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Your career is connected to your peace
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-foreground-muted">
            Income problems become real problems: not being able to be
            present with your family, driving for hours after your shift
            ends, watching bills pile up. Tech is the field that changed
            things for us, and it&apos;s a wide door: coding, IT,
            cybersecurity, sales, marketing tech, healthcare tech, UX, and
            the trades all count. This page is every resource we&apos;d
            hand a friend who&apos;s ready to think bigger than their
            current job.
          </p>
          <ScrollCue className="mt-8" />
        </Reveal>
      </section>

      <div className="sticky top-14 z-40 border-y border-border-subtle bg-background/95 backdrop-blur sm:top-16">
        <nav
          aria-label="Page sections"
          className="mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto px-6 py-3"
        >
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
            Jump to
          </span>
          {quickNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 whitespace-nowrap rounded-full border border-border-subtle bg-background-elevated px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-700"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <section id="quiz" className="mx-auto max-w-3xl scroll-mt-32 px-6 pb-16">
        <Reveal>
          <h2 className="text-center text-2xl font-semibold sm:text-3xl">
            Find Your Path
          </h2>
          <p className="mt-3 text-center text-sm text-foreground-muted">
            Not sure where to start? This takes about 2 minutes and looks
            at how you like to work, what&apos;s pulling you toward a
            change, and your pace. There&apos;s no wrong answer.
          </p>
          <div className="mt-5">
            <CareerQuiz />
          </div>
        </Reveal>
      </section>

      <section id="pay" className="mx-auto max-w-3xl scroll-mt-32 px-6 pb-16">
        <Reveal>
          <h2 className="sr-only">See the Pay</h2>
          <IncomeSnapshot />
        </Reveal>
      </section>

      <section id="guides" className="mx-auto max-w-5xl scroll-mt-32 px-6 pb-16">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Hype vs. Reality
          </p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
            What course marketing says, versus what the data and real people say
          </h2>
          <p className="mt-3 max-w-2xl text-foreground-muted">
            We researched what training programs, including our own partners,
            claim about these paths, then checked it against real labor data
            and accounts from people actually doing the job.
          </p>
          <div className="mt-6 max-w-2xl overflow-hidden rounded-3xl border border-border-subtle">
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/gQjj5E4SIlI"
                title="We Got It Wrong as Tech Influencers - Here's What We Missed"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-foreground-muted">
            We Got It Wrong as Tech Influencers, Here&apos;s What We Missed,
            a transparent look at what we thought we knew but didn&apos;t.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/tech/guides/${guide.slug}`}
                className="group flex flex-col justify-between rounded-3xl border border-border-subtle bg-background-elevated p-6 transition-all hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-950/5"
              >
                <div>
                  <p className="font-semibold">{guide.title}</p>
                  <p className="mt-2 text-sm text-foreground-muted">{guide.dek}</p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                  Read the guide
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      <section id="start-here" className="mx-auto max-w-5xl scroll-mt-32 px-6 pb-16">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Start Here, For Free
          </p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Free, step-by-step paths to actually start learning
          </h2>
          <p className="mt-3 max-w-2xl text-foreground-muted">
            Concrete, free first steps for three paths, including real
            video from people actually doing the job, before you spend a
            dollar on any course.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {startHereGuides.map((g) => (
              <Link
                key={g.slug}
                href={`/tech/start-here/${g.slug}`}
                className="group flex flex-col justify-between rounded-3xl border border-border-subtle bg-background-elevated p-6 transition-all hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-950/5"
              >
                <div>
                  <p className="font-semibold">{g.title}</p>
                  <p className="mt-2 text-sm text-foreground-muted">{g.dek}</p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                  Start the free path
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      <section id="learn" className="mx-auto max-w-5xl scroll-mt-32 px-6 pb-4">
        <Reveal>
          <CourseSection
            title={freeResources.title}
            links={freeResources.links}
            defaultOpen
          />
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl space-y-4 px-6 pb-16">
        {techSections.map((section, i) => (
          <Reveal key={section.title} delay={Math.min(i, 3) * 60}>
            <CourseSection
              title={section.title}
              note={section.note}
              links={section.links}
            />
          </Reveal>
        ))}
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Job Search Toolkit
          </p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Once you&apos;re applying, stay organized
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-foreground-muted">
            An interactive resume &amp; LinkedIn checklist, plus a tracker
            for every application and follow-up. Use the live versions
            right on this page, or get both as files sent to your inbox.
          </p>
        </Reveal>
      </section>

      <section id="checklist" className="mx-auto max-w-3xl scroll-mt-32 px-6 pb-16">
        <Reveal>
          <StarterChecklist />
        </Reveal>
      </section>

      <section id="tracker" className="mx-auto max-w-3xl scroll-mt-32 px-6 pb-16">
        <Reveal>
          <JobTracker />
        </Reveal>
      </section>

      <section id="toolkit" className="mx-auto max-w-3xl scroll-mt-32 px-6 pb-16">
        <Reveal>
          <EmailGatedDownload
            resourceId="job-search-toolkit"
            eyebrow="Free Download"
            title="Get the Printable PDF & Spreadsheet Versions"
            description="You just used the interactive checklist and tracker above. Prefer an offline copy? We'll email you the resume & LinkedIn checklist as a PDF and the job tracker as an editable spreadsheet (XLSX), so you can print it, fill it out by hand, or customize it in Excel or Google Sheets."
            files={[
              { label: "Resume Checklist (PDF)", href: "/downloads/career-changer-starter-kit.pdf" },
              { label: "Tracker (XLSX)", href: "/downloads/job-search-tracker.xlsx" },
            ]}
            ctaLabel="Email Me Both"
          />
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <Reveal>
          <h2 className="text-xl font-semibold sm:text-2xl">Quick Answers</h2>
          <div className="mt-5 space-y-3">
            {hubFaq.map((f, i) => (
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
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <Reveal>
          <Link
            href="/faith"
            className="group flex items-center justify-between gap-4 rounded-3xl border border-border-subtle bg-background-elevated p-6 text-left transition-all hover:-translate-y-0.5 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-950/5"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
                Also On This Site
              </p>
              <p className="mt-1 text-lg font-semibold">Faith Journey</p>
              <p className="mt-1 text-sm text-foreground-muted">
                Reliance on God for discovering, understanding, and living
                out truth, alongside the career side.
              </p>
            </div>
            <span
              aria-hidden
              className="shrink-0 text-purple-600 transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <p className="text-center text-xs text-foreground-muted">
          Some links provide free content, while others offer paid
          opportunities that provide compensation for us. Some paid
          opportunities also offer you discounts or incentives on their
          platforms.
        </p>
      </section>
    </>
  );
}
