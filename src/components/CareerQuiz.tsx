"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { quizQuestions, careerPaths, type PathId } from "@/lib/quiz";
import { getGuideForPath } from "@/lib/guides";
import { getStartHereForPath } from "@/lib/start-here";

type Scores = Partial<Record<PathId, number>>;

function computeResults(scores: Scores) {
  const ranked = (Object.entries(scores) as [PathId, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  return ranked.map(([id]) => careerPaths[id]);
}

export default function CareerQuiz() {
  // The path picked for each question so far. Everything else (the step, the scores, whether it is done) follows from this,
  // which is also what lets someone go back a question after a mis-tap.
  const [picked, setPicked] = useState<PathId[]>([]);
  const step = picked.length;
  const done = step >= quizQuestions.length;
  const scores = picked.reduce<Scores>((acc, p) => ({ ...acc, [p]: (acc[p] ?? 0) + 1 }), {});

  const question = quizQuestions[step];
  const progress = Math.round((step / quizQuestions.length) * 100);

  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Whenever the question or the result changes, make sure the person can see it, and tell a screen reader. The card changes
  // height between questions (the result is much taller), so without this the top of the new content can sit above the screen.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = cardRef.current;
    if (el) {
      const top = el.getBoundingClientRect().top;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (top < 80 || top > window.innerHeight * 0.4) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  function answer(path: PathId) {
    setPicked([...picked, path]);
  }

  function back() {
    setPicked(picked.slice(0, -1));
  }

  function retake() {
    setPicked([]);
  }

  if (done) {
    const results = computeResults(scores);
    const [top, ...rest] = results;
    const alternates = rest.slice(0, 2);
    const guide = getGuideForPath(top.id);
    const startHere = getStartHereForPath(top.id);

    return (
      <div ref={cardRef} className="scroll-mt-24 rounded-3xl border border-border-subtle bg-background-elevated p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Your Best-Fit Path
        </p>
        <h3 ref={headingRef} tabIndex={-1} className="mt-2 text-2xl font-semibold outline-none">{top.title}</h3>
        <p className="mt-3 text-foreground-muted">{top.blurb}</p>
        {!top.affiliate && (
          <p className="mt-2 text-xs font-medium text-foreground-muted">
            We don&apos;t have a partner in this field, so this points
            straight to the source, not a sales page.
          </p>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          {top.links.map((link) => (
            <a
              key={`${link.href}|${link.label}`}
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
        <div className="mt-4 flex flex-col items-start gap-2">
          {startHere && (
            <Link
              href={`/tech/start-here/${startHere.slug}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Free step-by-step path to actually get started
              <span aria-hidden>→</span>
            </Link>
          )}
          {guide && (
            <Link
              href={`/tech/guides/${guide.slug}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-foreground-muted underline decoration-border-subtle underline-offset-4 hover:text-foreground"
            >
              Before you commit, read our honest Hype vs. Reality guide on this path
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>

        {alternates.length > 0 && (
          <div className="mt-8 border-t border-border-subtle pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Also Worth a Look
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {alternates.map((path) => (
                <div key={path.id} className="rounded-2xl border border-border-subtle p-4">
                  <p className="font-semibold">{path.title}</p>
                  <p className="mt-1 text-sm text-foreground-muted">{path.blurb}</p>
                  <a
                    href={path.links[0].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {path.links[0].label}
                    <span aria-hidden>→</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border-subtle pt-6 text-sm">
          <a
            href="#learn"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Browse the full course list ↓
          </a>
          <a
            href="#toolkit"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Get the job search toolkit ↓
          </a>
          <button
            onClick={retake}
            className="-m-3.5 rounded-lg p-3.5 font-semibold text-foreground-muted underline decoration-border-subtle underline-offset-4 hover:text-foreground"
          >
            Retake the quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={cardRef} className="scroll-mt-24 rounded-3xl border border-border-subtle bg-background-elevated p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Find Your Path
        </p>
        <p className="text-xs text-foreground-muted">
          {step + 1} of {quizQuestions.length}
        </p>
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-background-elevated-2">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h3 ref={headingRef} tabIndex={-1} className="mt-6 text-xl font-semibold outline-none sm:text-2xl">{question.question}</h3>

      <div className="mt-5 flex flex-col gap-3">
        {question.options.map((option) => (
          <button
            key={option.label}
            onClick={() => answer(option.path)}
            className="group flex items-center justify-between rounded-2xl border border-border-subtle bg-background px-5 py-4 text-left text-sm font-medium transition-colors hover:border-blue-500/40 hover:bg-background-elevated-2"
          >
            {option.label}
            <span
              aria-hidden
              className="ml-3 shrink-0 text-foreground-muted transition-transform group-hover:translate-x-1 group-hover:text-blue-600"
            >
              →
            </span>
          </button>
        ))}
      </div>

      {step > 0 && (
        <button type="button" onClick={back} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-foreground-muted underline underline-offset-2 hover:text-foreground">
          ← Back to the last question
        </button>
      )}
    </div>
  );
}
