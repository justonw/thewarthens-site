import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guides, getGuide } from "@/lib/guides";
import Reveal from "@/components/Reveal";
import SourcesToggle from "@/components/SourcesToggle";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | The Warthens`,
    description: guide.dek,
    alternates: { canonical: `/tech/guides/${guide.slug}` },
    openGraph: { title: guide.title, description: guide.dek, url: `/tech/guides/${guide.slug}` },
    twitter: { title: guide.title, description: guide.dek },
  };
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <Reveal>
        <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
        <div className="mt-5">{children}</div>
      </Reveal>
    </section>
  );
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <>
      <div className="border-b border-border-subtle/60 bg-background-elevated/30">
        <div className="mx-auto max-w-3xl px-6 py-3 text-sm text-foreground-muted">
          <Link href="/tech" className="hover:text-foreground">
            Tech Journey
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Hype vs. Reality</span>
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
            Hype vs. Reality &middot; Updated {guide.updated}
          </p>
          <h1 className="text-balance mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {guide.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-foreground-muted">
            {guide.dek}
          </p>
        </Reveal>
      </section>

      <Section title="The Hype">
        <p className="mb-4 text-sm text-foreground-muted">
          What course and training marketing in this space typically says.
        </p>
        <ul className="space-y-3">
          {guide.hype.map((point, i) => (
            <li
              key={i}
              className="rounded-2xl border border-border-subtle bg-background-elevated p-4"
            >
              <p className="text-sm">{point.text}</p>
              {point.source && (
                <p className="mt-2 text-xs font-semibold text-foreground-muted">
                  Source: {point.source}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="The Reality: The Data">
        <ul className="space-y-3">
          {guide.realityData.map((point, i) => (
            <li
              key={i}
              className="rounded-2xl border border-border-subtle bg-background-elevated p-4"
            >
              <p className="text-sm">{point.text}</p>
              {point.source && (
                <p className="mt-2 text-xs font-semibold text-blue-600">
                  Source: {point.source}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <Reveal className="rounded-3xl border border-blue-500/30 bg-blue-500/5 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            The AI Factor
          </p>
          <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
            How AI is actually changing this path
          </h2>
          <p className="mt-3 text-sm text-foreground-muted">{guide.aiAngle.intro}</p>
          <ul className="mt-5 space-y-3">
            {guide.aiAngle.points.map((point, i) => (
              <li key={i} className="rounded-2xl border border-blue-500/20 bg-background p-4">
                <p className="text-sm">{point.text}</p>
                {point.source && (
                  <p className="mt-2 text-xs font-semibold text-blue-600">
                    Source: {point.source}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <Section title="Real Voices">
        <div className="space-y-4">
          {guide.voices.map((v, i) => (
            <blockquote
              key={i}
              className="rounded-2xl border-l-4 border-blue-500/40 bg-background-elevated p-5"
            >
              <p className="text-sm italic text-foreground">&ldquo;{v.quote}&rdquo;</p>
              <p className="mt-2 text-xs font-semibold text-foreground-muted">
                {v.source}
              </p>
            </blockquote>
          ))}
        </div>
      </Section>

      <Section title="Our Honest Take">
        <div className="space-y-4">
          {guide.synthesis.map((p, i) => (
            <p key={i} className="text-foreground-muted">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border-subtle bg-background-elevated p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Worth it if
            </p>
            <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
              {guide.forWhom.map((item, i) => (
                <li key={i}>&bull; {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-background-elevated p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Look elsewhere first if
            </p>
            <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
              {guide.notForWhom.map((item, i) => (
                <li key={i}>&bull; {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <section className="mx-auto max-w-3xl px-6 pb-10">
        <Reveal>
          <SourcesToggle sources={guide.sources} />
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <Reveal className="flex flex-col items-center gap-4 rounded-3xl border border-border-subtle bg-background-elevated p-6 text-center sm:p-8">
          <p className="text-sm text-foreground-muted">
            Ready to see where you fit, with real numbers either way?
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
