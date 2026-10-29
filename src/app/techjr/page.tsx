import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { guides } from "@/lib/guides";
import {
  careerExplainers,
  conversationStarters,
  creatorSafety,
  gameParts,
  hostingNeeds,
  hostingSteps,
  pathsForParents,
  privacyPoints,
  softSkillsForParents,
  techJrDescription,
  techJrFaq,
  techJrTitle,
  TECHJR_PATH,
  TECHJR_PLAY_PATH,
  TECHJR_UPDATED,
  volunteerTips,
} from "@/lib/tech-jr";

export const metadata: Metadata = {
  title: techJrTitle,
  description: techJrDescription,
  keywords: [
    "career day activities for elementary students",
    "career day ideas",
    "tech careers for kids",
    "what is tech sales for kids",
    "how to become a content creator for kids",
    "career exploration for elementary school",
    "career games for kids",
    "teach kids about careers",
  ],
  alternates: { canonical: TECHJR_PATH },
  openGraph: {
    title: techJrTitle,
    description: techJrDescription,
    url: TECHJR_PATH,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: techJrTitle, description: techJrDescription },
};

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-500 sm:text-base";
const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full border border-border-subtle bg-background-elevated px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-blue-500/50 hover:text-blue-700 sm:text-base";
const card = "rounded-2xl border border-border-subtle bg-background-elevated p-5";

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
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

function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm text-foreground-muted sm:text-base">
          <Check />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function TechJrPage() {
  const site = "https://thewarthens.com";
  const pageUrl = `${site}${TECHJR_PATH}`;

  // One connected graph. It only states things that are visible on the page.
  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: techJrTitle,
        description: techJrDescription,
        dateModified: TECHJR_UPDATED,
        isPartOf: { "@type": "WebSite", name: "The Warthens", url: site },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        about: { "@id": `${pageUrl}#game` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "The Warthens", item: site },
          { "@type": "ListItem", position: 2, name: "Tech Journey", item: `${site}/tech` },
          { "@type": "ListItem", position: 3, name: "Tech Journey Jr.", item: pageUrl },
        ],
      },
      {
        "@type": "LearningResource",
        "@id": `${pageUrl}#game`,
        name: "Tech Journey Jr.",
        description:
          "A free career game for kindergarten through 5th grade about tech sales, customer success, and content creation, with a parent guide and a kit for running a career day table.",
        url: `${site}${TECHJR_PLAY_PATH}`,
        learningResourceType: "Educational game",
        educationalLevel: "Elementary school",
        typicalAgeRange: "5-11",
        isAccessibleForFree: true,
        inLanguage: "en",
        teaches: [
          "What tech sales and customer success are",
          "What content creators do",
          "Listening, honesty, kindness, and problem solving",
        ],
        audience: [
          { "@type": "Audience", audienceType: "Children in kindergarten through 5th grade" },
          { "@type": "Audience", audienceType: "Parents" },
          { "@type": "EducationalAudience", educationalRole: "teacher" },
        ],
        author: { "@type": "Organization", name: "The Warthens", url: site },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: techJrFaq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <article className="relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }}
      />

      {/* Hero */}
      <header className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(55% 45% at 50% 0%, rgba(56,189,248,0.14), transparent)",
          }}
        />
        <div className="mx-auto max-w-4xl px-6 pt-16 pb-14 text-center sm:pt-24 sm:pb-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-600/25 bg-blue-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700">
            Tech Journey Jr. · Kindergarten to 5th Grade
          </p>
          <h1 className="text-balance mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            Tech and creator careers for kids, made simple and fun
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-foreground-muted">
            A free career game for children, a plain-language guide for parents, and a ready-to-use
            kit for teachers and organizers who want to run a career day table.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={TECHJR_PLAY_PATH} className={primaryButton}>
              Play the game, it&apos;s free
            </Link>
            <a href="#parents" className={secondaryButton}>
              For parents
            </a>
            <a href="#host" className={secondaryButton}>
              Host a career day
            </a>
          </div>
          <p className="mt-4 text-sm text-foreground-muted">
            No sign-in. Nothing a child types or picks is saved.
          </p>
        </div>
      </header>

      {/* What kids do */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <Reveal>
          <h2 className="text-2xl font-semibold sm:text-3xl">What children do in the game</h2>
          <p className="mt-3 max-w-2xl text-foreground-muted">
            Three short missions and a page of facts. Every screen can be read aloud, buttons are
            big enough for small fingers, and it works on phones, tablets, and computers.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {gameParts.map((part) => (
              <div key={part.title} className={card}>
                <p className="text-3xl" aria-hidden>
                  {part.emoji}
                </p>
                <h3 className="mt-3 text-lg font-semibold">{part.title}</h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                  {part.topic}
                </p>
                <p className="mt-2 text-sm text-foreground-muted">{part.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href={TECHJR_PLAY_PATH} className={primaryButton}>
              Start the game
            </Link>
          </div>
        </Reveal>
      </section>

      {/* For parents */}
      <section id="parents" className="scroll-mt-24 border-y border-border-subtle/80 bg-background-elevated/40">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              For parents
            </p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
              How to talk with your child about tech and creator careers
            </h2>
            <p className="mt-3 max-w-2xl text-foreground-muted">
              Kids this age do not need to pick a career. They need to see that many kinds of work
              exist, that those jobs help people, and that the habits they are building now carry
              over.
            </p>
          </Reveal>

          <Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {careerExplainers.map((c) => (
                <div key={c.title} className={card}>
                  <h3 className="text-lg font-semibold">{c.title}</h3>
                  <p className="mt-2 text-sm text-foreground-muted">{c.body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <h3 className="mt-12 text-xl font-semibold">Skills your child practices</h3>
            <p className="mt-2 max-w-2xl text-sm text-foreground-muted sm:text-base">
              These are the same four habits that help in tech sales, customer success, and content
              creation, and in just about every other job.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {softSkillsForParents.map((s) => (
                <div key={s.title} className={card}>
                  <h4 className="font-semibold">{s.title}</h4>
                  <p className="mt-1.5 text-sm text-foreground-muted">{s.body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <h3 className="mt-12 text-xl font-semibold">Questions to ask at home</h3>
            <p className="mt-2 max-w-2xl text-sm text-foreground-muted sm:text-base">
              Play together, then try one of these over dinner or in the car.
            </p>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2">
              {conversationStarters.map((q, i) => (
                <li key={q} className={`${card} flex gap-3 text-sm`}>
                  <span className="font-semibold text-blue-700">{i + 1}.</span>
                  <span className="text-foreground-muted">{q}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold">Ways people get started</h3>
                <div className="mt-4">
                  <CheckList items={pathsForParents} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold">If your child wants to be a creator</h3>
                <div className="mt-4">
                  <CheckList items={creatorSafety} />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-12 rounded-3xl border border-border-subtle bg-background p-6">
              <h3 className="text-lg font-semibold">Want the grown-up version?</h3>
              <p className="mt-1.5 text-sm text-foreground-muted">
                Our free Tech Journey guides give an honest look at what these jobs are really like
                for adults, including what to expect and how people break in.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {guides.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/tech/guides/${g.slug}`}
                    className="rounded-full border border-border-subtle bg-background-elevated px-3.5 py-1.5 text-sm font-semibold transition-colors hover:border-blue-500/50 hover:text-blue-700"
                  >
                    {g.title}
                  </Link>
                ))}
                <Link
                  href="/tech"
                  className="rounded-full border border-border-subtle bg-background-elevated px-3.5 py-1.5 text-sm font-semibold transition-colors hover:border-blue-500/50 hover:text-blue-700"
                >
                  All Tech Journey resources
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Hosting kit */}
      <section id="host" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-16">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
            For teachers and organizers
          </p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Run your own career day table with Tech Journey Jr.
          </h2>
          <p className="mt-3 max-w-2xl text-foreground-muted">
            We built this for a school career fair and you are welcome to use it at yours. It needs
            one device, no accounts, and no prep time.
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold">What you need</h3>
              <div className="mt-4">
                <CheckList items={hostingNeeds} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Privacy for your families</h3>
              <div className="mt-4">
                <CheckList items={privacyPoints} />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <h3 className="mt-12 text-xl font-semibold">Setup in four steps</h3>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2">
            {hostingSteps.map((step, i) => (
              <li key={step.title} className={card}>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Step {i + 1}
                </p>
                <h4 className="mt-1 font-semibold">{step.title}</h4>
                <p className="mt-1.5 text-sm text-foreground-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal>
          <h3 className="mt-12 text-xl font-semibold">Tips for the volunteer at the table</h3>
          <div className="mt-4 max-w-3xl">
            <CheckList items={volunteerTips} />
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl border border-border-subtle bg-background-elevated p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Table address</p>
              <p className="mt-1 text-sm text-foreground-muted">
                Put this on your sign or flyer, or make a QR code for it:{" "}
                <span className="font-semibold text-foreground">thewarthens.com/techjr/play</span>
              </p>
            </div>
            <Link href={TECHJR_PLAY_PATH} className={primaryButton}>
              Open the game
            </Link>
          </div>
          <p className="mt-4 text-sm text-foreground-muted">
            Planning an event and want to tell us how it went, or have an idea to make this better?
            Email{" "}
            <a href="mailto:info@thewarthens.com" className="font-semibold text-blue-700 underline">
              info@thewarthens.com
            </a>
            .
          </p>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <Reveal>
          <h2 className="text-2xl font-semibold sm:text-3xl">Common questions</h2>
          <div className="mt-5 space-y-3">
            {techJrFaq.map((f) => (
              <details
                key={f.question}
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
    </article>
  );
}
