"use client";

import { useState } from "react";
import { quizQuestions, careerPaths, type PathId } from "@/lib/quiz";

type Scores = Partial<Record<PathId, number>>;

function computeResults(scores: Scores) {
  const ranked = (Object.entries(scores) as [PathId, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  return ranked.map(([id]) => careerPaths[id]);
}

export default function CareerQuiz() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Scores>({});
  const [done, setDone] = useState(false);

  const question = quizQuestions[step];
  const progress = Math.round((step / quizQuestions.length) * 100);

  function answer(path: PathId) {
    const next = { ...scores, [path]: (scores[path] ?? 0) + 1 };
    setScores(next);
    if (step + 1 < quizQuestions.length) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  function retake() {
    setStep(0);
    setScores({});
    setDone(false);
  }

  if (done) {
    const results = computeResults(scores);
    const [top, ...rest] = results;
    const alternates = rest.slice(0, 2);

    return (
      <div className="rounded-3xl border border-border-subtle bg-background-elevated p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Your Best-Fit Path
        </p>
        <h3 className="mt-2 text-2xl font-semibold">{top.title}</h3>
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
            className="font-semibold text-foreground-muted underline decoration-border-subtle underline-offset-4 hover:text-foreground"
          >
            Retake the quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border-subtle bg-background-elevated p-6 sm:p-8">
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

      <h3 className="mt-6 text-xl font-semibold sm:text-2xl">{question.question}</h3>

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
    </div>
  );
}
