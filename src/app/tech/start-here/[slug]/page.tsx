import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { startHereGuides, getStartHere } from "@/lib/start-here";
import { getGuideForPath } from "@/lib/guides";
import Reveal from "@/components/Reveal";
import StartHereChecklist from "@/components/StartHereChecklist";

export function generateStaticParams() {
  return startHereGuides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getStartHere(slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | The Warthens`,
    description: guide.dek,
    alternates: { canonical: `/tech/start-here/${guide.slug}` },
    openGraph: { title: guide.title, description: guide.dek, url: `/tech/start-here/${guide.slug}` },
    twitter: { card: "summary_large_image", title: guide.title, description: guide.dek },
  };
}

export default async function StartHerePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getStartHere(slug);
  if (!guide) notFound();

  const hypeGuide = getGuideForPath(guide.pathId);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Tech Journey", item: "https://thewarthens.com/tech" },
      { "@type": "ListItem", position: 2, name: "Start Here", item: "https://thewarthens.com/tech#start-here" },
      { "@type": "ListItem", position: 3, name: guide.title, item: `https://thewarthens.com/tech/start-here/${guide.slug}` },
    ],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.dek,
    step: guide.steps.map((s) => ({
      "@type": "HowToStep",
      name: s.title,
      text: s.description,
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((f) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="border-b border-border-subtle/60 bg-background-elevated/30">
        <div className="mx-auto max-w-3xl px-6 py-3 text-sm text-foreground-muted">
          <Link href="/tech" className="hover:text-foreground">
            Tech Journey
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Start Here</span>
        </div>
      </div>

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(50% 40% at 20% 0%, rgba(56,189,248,0.14), transparent)",
          }}
        />
        <Reveal className="mx-auto max-w-3xl px-6 pt-14 pb-10 sm:pt-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Start Here &middot; Updated {guide.updated}
          </p>
          <h1 className="text-balance mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {guide.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-foreground-muted">
            {guide.dek}
          </p>
          {hypeGuide && (
            <Link
              href={`/tech/guides/${hypeGuide.slug}`}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-foreground-muted underline decoration-border-subtle underline-offset-4 hover:text-foreground"
            >
              Want the honest hype-vs-reality data on this path first?
              <span aria-hidden>→</span>
            </Link>
          )}
        </Reveal>
      </section>

      {guide.whatIsTheJob && (
        <section className="mx-auto max-w-3xl px-6 pb-10">
          <Reveal>
            <h2 className="text-xl font-semibold sm:text-2xl">What's the job, really?</h2>
            <p className="mt-3 text-foreground-muted">{guide.whatIsTheJob.intro}</p>
            <p className="mt-3 text-foreground-muted">{guide.whatIsTheJob.dayToDay}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {guide.whatIsTheJob.specializations.map((spec) => (
                <div
                  key={spec.name}
                  className="rounded-2xl border border-border-subtle bg-background-elevated p-5"
                >
                  <p className="font-semibold text-foreground">{spec.name}</p>
                  <p className="mt-2 text-sm text-foreground-muted">{spec.description}</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-blue-600">
                    Good for
                  </p>
                  <p className="mt-1 text-sm text-foreground-muted">{spec.goodFor}</p>
                  {spec.href && (
                    <a
                      href={spec.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800"
                    >
                      {spec.linkLabel}
                      <span aria-hidden>→</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {(guide.pros || guide.cons) && (
        <section className="mx-auto max-w-3xl px-6 pb-10">
          <Reveal>
            <h2 className="text-xl font-semibold sm:text-2xl">Pros and cons to actually weigh</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {guide.pros && (
                <div className="rounded-2xl border border-border-subtle bg-background-elevated p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    Pros
                  </p>
                  <ul className="mt-3 space-y-3">
                    {guide.pros.map((item, i) => (
                      <li key={i} className="text-sm text-foreground-muted">
                        {item.text}
                        {item.source && (
                          <span className="mt-1 block text-xs font-semibold text-foreground-muted/70">
                            Source: {item.source}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {guide.cons && (
                <div className="rounded-2xl border border-border-subtle bg-background-elevated p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                    Cons
                  </p>
                  <ul className="mt-3 space-y-3">
                    {guide.cons.map((item, i) => (
                      <li key={i} className="text-sm text-foreground-muted">
                        {item.text}
                        {item.source && (
                          <span className="mt-1 block text-xs font-semibold text-foreground-muted/70">
                            Source: {item.source}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Reveal>
        </section>
      )}

      {guide.video && (
        <section className="mx-auto max-w-3xl px-6 pb-10">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-border-subtle">
              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${guide.video.youtubeId}`}
                  title={guide.video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
            <p className="mt-3 text-sm text-foreground-muted">{guide.video.title}</p>
          </Reveal>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-6 pb-10">
        <Reveal>
          <h2 className="text-xl font-semibold sm:text-2xl">
            Your free step-by-step path
          </h2>
          <p className="mt-2 text-sm text-foreground-muted">
            Every step here is free. Check them off as you go, saved privately in your browser.
          </p>
          <div className="mt-6">
            <StartHereChecklist slug={guide.slug} steps={guide.steps} />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-10">
        <Reveal className="rounded-3xl border border-border-subtle bg-background-elevated p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            When Paying Might Make Sense
          </p>
          <p className="mt-3 text-foreground-muted">{guide.paidNote}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {guide.paidLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              >
                {link.label}
                <span aria-hidden>→</span>
              </a>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-10">
        <Reveal>
          <h2 className="text-xl font-semibold sm:text-2xl">Quick Answers</h2>
          <div className="mt-5 space-y-3">
            {guide.faq.map((f, i) => (
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

      {guide.levelUp && (
        <section className="mx-auto max-w-3xl px-6 pb-10">
          <Reveal>
            <h2 className="text-xl font-semibold sm:text-2xl">Ready to level up?</h2>
            <p className="mt-2 text-sm text-foreground-muted">
              Already in the role? Here's what actually moves you to the next one.
            </p>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-border-subtle bg-background-elevated p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Realistic timeline
                </p>
                <p className="mt-2 text-sm text-foreground-muted">{guide.levelUp.timeline}</p>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-background-elevated p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  What actually gets you promoted
                </p>
                <p className="mt-2 text-sm text-foreground-muted">
                  {guide.levelUp.whatGetsYouPromoted}
                </p>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-background-elevated p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Job-hop or stay?
                </p>
                <p className="mt-2 text-sm text-foreground-muted">{guide.levelUp.jobHopVsStay}</p>
              </div>
              {guide.levelUp.icVsManagement && (
                <div className="rounded-2xl border border-border-subtle bg-background-elevated p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    Individual contributor or management?
                  </p>
                  <p className="mt-2 text-sm text-foreground-muted">
                    {guide.levelUp.icVsManagement}
                  </p>
                </div>
              )}
            </div>
          </Reveal>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <Reveal className="flex flex-col items-center gap-4 rounded-3xl border border-border-subtle bg-background-elevated p-6 text-center sm:p-8">
          <p className="text-sm text-foreground-muted">
            Not sure this is even the right path for you?
          </p>
          <Link
            href="/tech#quiz"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Take the free career-path quiz
            <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </section>
    </>
  );
}
