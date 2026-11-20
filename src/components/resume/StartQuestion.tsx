"use client";

import { useState } from "react";

// The one question asked before the form: where is the person in a job search? It is easy to answer (one tap), skippable, and it
// only decides where they start: which kind of resume to build, and which part of the kit opens first once it is built.

export type Intent = "apply" | "explore" | "reach" | "interview";

const CHOICES: { id: Intent; label: string; hint: string }[] = [
  { id: "apply", label: "I found a job to apply for", hint: "We tailor your resume to that posting." },
  { id: "explore", label: "I don't have a job yet", hint: "We build a general resume for the kind of role you want." },
  { id: "reach", label: "I applied and want to reach out", hint: "After your resume, we open a note to a recruiter or manager." },
  { id: "interview", label: "I have an interview coming", hint: "After your resume, we open likely questions and what to say." },
];

export default function StartQuestion({ value, onChange }: { value: Intent | null; onChange: (i: Intent | null) => void }) {
  const [skipped, setSkipped] = useState(false);
  const chosen = CHOICES.find((c) => c.id === value);

  if (chosen) {
    return (
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 rounded-2xl border border-blue-500/30 bg-blue-500/5 px-4 py-3 text-sm">
        <p>
          <span className="font-semibold">Starting point:</span> {chosen.label}. <span className="text-foreground-muted">{chosen.hint}</span>
        </p>
        <button type="button" onClick={() => onChange(null)} className="inline-flex min-h-10 items-center font-semibold text-blue-700 underline underline-offset-2">
          Change
        </button>
      </div>
    );
  }
  if (skipped) return null;

  return (
    <section aria-labelledby="start-question" className="mx-auto max-w-3xl rounded-2xl border border-border-subtle bg-background-elevated px-4 py-3 sm:px-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <h2 id="start-question" className="text-base font-semibold tracking-tight">
          Where are you right now? <span className="font-normal text-foreground-muted">One tap, and you can change it any time.</span>
        </h2>
        <button type="button" onClick={() => setSkipped(true)} className="inline-flex min-h-10 items-center text-sm text-foreground-muted underline underline-offset-2 hover:text-foreground">
          Skip
        </button>
      </div>
      <ul className="mt-2 flex flex-wrap gap-2">
        {CHOICES.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => onChange(c.id)}
              title={c.hint}
              className="inline-flex min-h-11 items-center rounded-full border border-border-subtle bg-background px-4 text-sm font-semibold transition-colors hover:border-blue-500/40"
            >
              {c.label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
