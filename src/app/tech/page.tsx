import type { Metadata } from "next";
import { freeResources, techSections } from "@/lib/tech-links";
import Reveal from "@/components/Reveal";
import ScrollCue from "@/components/ScrollCue";
import CareerQuiz from "@/components/CareerQuiz";

export const metadata: Metadata = {
  title: "Tech Journey | The Warthens",
  description:
    "Practical steps to navigate a career transition into tech and tech-adjacent fields, for a more peaceful, satisfying life.",
};

function LinkGrid({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-2xl border border-border-subtle bg-background-elevated px-5 py-4 text-sm font-medium transition-colors hover:border-blue-500/40 hover:bg-background-elevated-2"
          >
            {link.label}
            <span
              aria-hidden
              className="text-foreground-muted transition-transform group-hover:translate-x-1 group-hover:text-blue-600"
            >
              →
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function TechJourneyPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(50% 40% at 20% 0%, rgba(56,189,248,0.16), transparent)",
          }}
        />
        <Reveal className="mx-auto max-w-3xl px-6 pt-16 pb-12 text-center sm:pt-24 sm:pb-16">
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
          <ScrollCue className="mt-10" />
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <Reveal>
          <p className="text-center text-sm text-foreground-muted">
            Not sure where to start? This takes about 2 minutes and looks
            at how you like to work, what&apos;s pulling you toward a
            change, and your pace — there&apos;s no wrong answer.
          </p>
          <div className="mt-5">
            <CareerQuiz />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-10">
        <Reveal className="rounded-3xl border border-border-subtle bg-background-elevated p-6 sm:p-8">
          <h2 className="text-lg font-semibold">{freeResources.title}</h2>
          <div className="mt-5">
            <LinkGrid links={freeResources.links} />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl space-y-10 px-6 pb-16">
        {techSections.map((section, i) => (
          <Reveal key={section.title} delay={Math.min(i, 3) * 80}>
            <h2 className="text-lg font-semibold">{section.title}</h2>
            {section.note && (
              <p className="mt-1 text-sm text-foreground-muted">{section.note}</p>
            )}
            <div className="mt-4">
              <LinkGrid links={section.links} />
            </div>
          </Reveal>
        ))}
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
