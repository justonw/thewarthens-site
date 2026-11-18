"use client";

import { useState } from "react";
import type { ResumeFit, ResumeGap } from "@/lib/resume-tailor";
import VoiceInput from "./VoiceInput";

// "Make it stronger": the part of the Resume Builder that sets it apart. After the resume is built, we say how it lines
// up with the job and ask a few specific questions about the person's own history, one for each thing the job wants
// that the resume does not show. Each true answer is written into the resume (which updates right below). A "Not yet"
// leaves it off and says how to really build that skill. Nothing is added unless the person says it is true.

const input = "w-full rounded-xl border border-border-subtle bg-background px-3 py-2 text-sm outline-none focus:border-blue-500/50";

const FIT_STYLE = {
  strong: { label: "Strong match", box: "border-green-600/30 bg-green-600/5", chip: "bg-green-600 text-white" },
  good: { label: "Good match, with gaps", box: "border-blue-500/30 bg-blue-500/5", chip: "bg-blue-600 text-white" },
  stretch: { label: "A stretch, so be honest about the gaps", box: "border-amber-500/40 bg-amber-500/10", chip: "bg-amber-600 text-white" },
} as const;

type Way = "none" | "work" | "own" | "not";

function QuestionItem({ n, gap, onAdd, onHide }: { n: number; gap: ResumeGap; onAdd: (answer: string) => Promise<string | null>; onHide: () => void }) {
  const deepen = gap.kind === "deepen";
  const [way, setWay] = useState<Way>(deepen ? "work" : "none");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const question = gap.question || (deepen ? `Can you say more about ${gap.requirement}?` : `Do you have experience with ${gap.requirement}?`);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (answer.trim().length < 3) {
      setMessage("Write a short sentence about it.");
      return;
    }
    setBusy(true);
    setMessage("");
    const text = way === "own" ? `On my own, outside a paid job: ${answer.trim()}` : answer.trim();
    const problem = await onAdd(text);
    setBusy(false);
    if (problem) setMessage(problem);
  }

  const choice = "inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors sm:min-h-10";
  return (
    <li className="flex flex-col rounded-2xl border border-border-subtle bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-2">
        <span aria-hidden className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
          {n}
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">
          {deepen ? "You already have this, say more" : "The job asks for"}: {gap.requirement}
        </p>
      </div>
      <p className="mt-2 text-base font-semibold leading-snug">{question}</p>
      {way === "none" && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => setWay("work")} className={`${choice} border-violet-500/40 bg-violet-500/5 text-violet-800 hover:bg-violet-500/10`}>
            Yes, at a job
          </button>
          <button type="button" onClick={() => setWay("own")} className={`${choice} border-violet-500/40 bg-violet-500/5 text-violet-800 hover:bg-violet-500/10`}>
            Yes, on my own
          </button>
          <button type="button" onClick={() => setWay("not")} className={`${choice} border-border-subtle text-foreground-muted hover:bg-background`}>
            Not yet
          </button>
        </div>
      )}
      {way === "not" && (
        <div className="mt-3 rounded-xl bg-background p-3 text-sm text-foreground-muted">
          <p>That&apos;s okay. We left it off so nothing on your resume is untrue.{gap.ifNot ? ` ${gap.ifNot}` : ""}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs">
            <button type="button" onClick={() => setWay("none")} className="min-h-8 font-semibold text-violet-800 underline underline-offset-2">
              Actually, I do have it
            </button>
            <button type="button" onClick={onHide} className="min-h-8 underline underline-offset-2">
              Hide this question
            </button>
          </div>
        </div>
      )}
      {(way === "work" || way === "own") && (
        <form onSubmit={submit} className="mt-3 space-y-2">
          <label className="block text-sm text-foreground-muted" htmlFor={`q-${gap.kind}-${gap.requirement}`}>
            {deepen
              ? "Add the true detail: what you did, for whom, how many, or what changed."
              : way === "own"
                ? "What did you build or do, and what did it involve? One or two sentences."
                : "Which job, what did you do, and what changed? One or two sentences."}
          </label>
          <textarea
            id={`q-${gap.kind}-${gap.requirement}`}
            rows={3}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={way === "own" ? "For example: I built a small tool that does X, using Y, and it is used by Z." : "For example: I used it daily at Harbor Table to track catering leads for 2 years."}
            className={input}
          />
          <VoiceInput onText={(t) => setAnswer((cur) => (cur ? `${cur.trimEnd()} ${t}` : t))} />
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={busy} className="inline-flex min-h-11 items-center rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-60 sm:min-h-10">
              {busy ? "Adding…" : "Add it to my resume"}
            </button>
            <button type="button" onClick={() => (deepen ? onHide() : setWay("none"))} className="min-h-8 text-sm text-foreground-muted underline underline-offset-2">
              {deepen ? "Skip this one" : "Back"}
            </button>
          </div>
          {message && (
            <p role="alert" className="text-sm text-red-700">
              {message}
            </p>
          )}
        </form>
      )}
    </li>
  );
}

export default function StrengthenPanel({
  gaps,
  fit,
  justAdded,
  onAdd,
}: {
  gaps: ResumeGap[];
  fit?: ResumeFit;
  justAdded: string;
  onAdd: (index: number, answer: string) => Promise<string | null>;
}) {
  // How many questions there were to begin with, so the bar can show how far along the person is.
  const [startCount] = useState(gaps.length);
  const total = Math.max(startCount, gaps.length);
  const [hidden, setHidden] = useState<string[]>([]);
  const keyOf = (g: ResumeGap) => `${g.kind ?? "missing"}-${g.requirement}`;
  const open = gaps.map((g, i) => ({ g, i })).filter(({ g }) => !hidden.includes(keyOf(g)));
  const added = total - gaps.length;
  const handled = total - open.length;

  if (!fit && total === 0) return null;

  return (
    <section id="strengthen" aria-labelledby="strengthen-title" className="scroll-mt-24 rounded-3xl bg-gradient-to-br from-violet-500 via-blue-500 to-fuchsia-500 p-[2px] shadow-lg shadow-violet-900/10">
      <div className="rounded-[calc(1.5rem-2px)] bg-gradient-to-br from-white via-white to-violet-50 p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span aria-hidden className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-md">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 9a3 3 0 115 2c-1 1-2 1.5-2 3" />
                <path d="M12 18h.01" />
                <circle cx="12" cy="12" r="9.5" />
              </svg>
            </span>
            <div>
              <p className="inline-flex rounded-full bg-violet-600 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">Gap coach</p>
              <h2 id="strengthen-title" className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                {open.length > 0 ? "Let's make this resume stronger" : "You've gone through every question"}
              </h2>
            </div>
          </div>
          {total > 0 && (
            <p className="text-sm font-semibold text-violet-800">
              {handled} of {total} done{added > 0 ? `, ${added} added to your resume` : ""}
            </p>
          )}
        </div>

        {total > 0 && (
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-violet-100" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={handled} aria-label="Questions done">
            <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500" style={{ width: `${Math.round((handled / total) * 100)}%` }} />
          </div>
        )}

        {fit && (
          <div className={`mt-4 rounded-2xl border p-4 ${FIT_STYLE[fit.level].box}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">How your resume lines up with this job</p>
            <p className="mt-1.5">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${FIT_STYLE[fit.level].chip}`}>{FIT_STYLE[fit.level].label}</span>
            </p>
            <p className="mt-2 text-sm">{fit.reason}</p>
          </div>
        )}

        {open.length > 0 && (
          <p className="mt-4 max-w-3xl text-sm text-foreground-muted">
            The job asks for things your resume doesn&apos;t show yet. Answer a few short questions about <strong className="text-foreground">your own experience</strong>, and we&apos;ll write what&apos;s true into your resume. It updates right below as you go. Say &ldquo;Not yet&rdquo; and we leave it off, so nothing on your resume is untrue.
          </p>
        )}

        {justAdded && (
          <p role="status" className="mt-4 rounded-2xl border border-green-600/30 bg-green-600/5 px-4 py-3 text-sm font-medium text-green-800">
            Added to your resume: {justAdded}
          </p>
        )}

        {open.length > 0 ? (
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {open.map(({ g, i }, k) => (
              <QuestionItem key={keyOf(g)} n={k + 1} gap={g} onAdd={(answer) => onAdd(i, answer)} onHide={() => setHidden((h) => [...h, keyOf(g)])} />
            ))}
          </ul>
        ) : (
          total > 0 && (
            <p className="mt-5 text-sm text-foreground-muted">
              {added > 0 ? `${added} new ${added === 1 ? "line was" : "lines were"} written into your resume from your answers. Read it through once more below, then download.` : "Nothing was added. Your resume stays exactly as it is, and it is still true. You can rebuild it any time you have more to add."}
            </p>
          )
        )}
      </div>
    </section>
  );
}
