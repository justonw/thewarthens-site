"use client";

import { useRef, useState } from "react";
import { STAGES, sheetToPlainText, type PrepQuestion, type PrepSheet, type QuestionKind, type Stage } from "@/lib/interview";
import type { TailorResult, ResumeDoc } from "@/lib/resume-tailor";
import { storiesAsNotes, type Story } from "@/lib/resume-profile";
import { downloadBlob } from "@/lib/download";
import { track } from "@/lib/track";
import AutoTextarea from "./AutoTextarea";

// "Interview prep": once a company replies, a prep sheet for that exact job, built only from the person's resume and the true
// stories they have told us. It gives the likely questions for the kind of interview, why each is asked, how to approach it,
// and the real facts from their history to draw on. It never writes a story for them: when nothing real fits a question, it
// asks for a true example and keeps what they say for their next resume and answers.

const errors: Record<string, string> = {
  "interview-limit": "You've used this month's interview prep sheets. They come back on the 1st.",
  "slow-down": "That was a lot of tries in a short time. Wait a few minutes and try again.",
  upstream: "That didn't work this time, and it didn't use up a sheet. Try again in a moment.",
  refused: "That sheet used a number we couldn't find in your resume or stories, so we threw it away. Try again.",
  cap: "We've reached our limit for prep sheets this month. Please try again next month.",
  unavailable: "Interview prep isn't available right now. Please try again later.",
  email: "Add your email address on the resume form first. It only counts your monthly sheets.",
};

const KIND_LABEL: Record<QuestionKind, string> = { role: "The work", behavioral: "A time when", gap: "A gap to be honest about", motivation: "Why this role" };
const box = "w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-base leading-relaxed outline-none focus:border-blue-500/50";

function QuestionCard({ q, index, onStory }: { q: PrepQuestion; index: number; onStory?: (topic: string, question: string, answer: string) => void }) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  return (
    <details className="group rounded-2xl border border-border-subtle bg-white p-4 shadow-sm" open={index === 0}>
      <summary className="flex cursor-pointer list-none items-start gap-3">
        <span aria-hidden className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-sm font-bold text-blue-700">
          {index + 1}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold uppercase tracking-wider text-foreground-muted">{KIND_LABEL[q.kind]}</span>
          <span className="block text-base font-semibold leading-snug">{q.question}</span>
        </span>
        <span aria-hidden className="mt-1 text-foreground-muted transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="mt-3 space-y-3 text-sm sm:pl-10">
        {q.why && (
          <p>
            <span className="font-semibold">Why they ask: </span>
            <span className="text-foreground-muted">{q.why}</span>
          </p>
        )}
        {q.approach && (
          <p>
            <span className="font-semibold">How to answer: </span>
            <span className="text-foreground-muted">{q.approach}</span>
          </p>
        )}
        {q.points.length > 0 && (
          <div>
            <p className="font-semibold">What you can draw on</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-foreground-muted">
              {q.points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        )}
        {q.storyAsk && (
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Your real example</p>
            <p className="mt-1 font-semibold leading-snug">{q.storyAsk}</p>
            <p className="mt-1 text-xs text-foreground-muted">We never make up an example. Write a real one in a sentence or two. It is kept for your next resume and answers, and read through before you use it.</p>
            <AutoTextarea value={text} onChange={(e) => { setText(e.target.value); setSaved(false); }} rows={3} maxLength={700} placeholder="A sentence or two is enough" className={`${box} mt-2`} aria-label="Your real example" />
            <button
              type="button"
              disabled={text.trim().length < 5 || saved}
              onClick={() => {
                onStory?.(q.question.slice(0, 120), q.storyAsk, text.trim());
                setSaved(true);
              }}
              className="mt-2 inline-flex min-h-11 items-center rounded-full bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
            >
              {saved ? "Saved ✓" : "Save this example"}
            </button>
          </div>
        )}
      </div>
    </details>
  );
}

export default function InterviewPanel({
  doc,
  result,
  email,
  stories,
  saved,
  onSave,
  onStory,
  onBack,
}: {
  doc: ResumeDoc;
  result: TailorResult;
  email: string;
  stories: Story[];
  // The sheet already built for this job (kept with the saved build), and a way to keep a new one.
  saved: PrepSheet | null;
  onSave?: (sheet: PrepSheet) => void;
  onStory?: (topic: string, question: string, answer: string) => void;
  onBack: () => void;
}) {
  const [stage, setStage] = useState<Stage>(saved?.stage ?? "manager");
  const [sheet, setSheet] = useState<PrepSheet | null>(saved);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const topRef = useRef<HTMLDivElement>(null);
  const job = `${result.postingTitle || doc.headline}${result.postingCompany ? ` at ${result.postingCompany}` : ""}`;

  async function build() {
    if (busy) return;
    if (!email) return setError(errors.email);
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/resume-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          doc,
          stage,
          postingTitle: result.postingTitle,
          postingCompany: result.postingCompany,
          postingKeywords: result.postingKeywords,
          fitReason: result.fit?.reason ?? "",
          unmet: result.gaps.map((g) => g.requirement),
          stories: storiesAsNotes(stories, 2800),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok || !data.sheet) {
        setError(errors[data.error as string] ?? errors.upstream);
        return;
      }
      setSheet(data.sheet as PrepSheet);
      onSave?.(data.sheet as PrepSheet);
      track("interview-written");
      window.setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch {
      setError(errors.upstream);
    } finally {
      setBusy(false);
    }
  }

  async function copy(what: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      window.setTimeout(() => setCopied(""), 2200);
    } catch {
      setError("Your browser blocked copying. Select the text and copy it by hand.");
    }
  }

  const plain = sheet ? sheetToPlainText(sheet, job) : "";

  return (
    <div ref={topRef} className="scroll-mt-24 space-y-5">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight">Get ready for the interview</h3>
        <p className="mt-1 text-sm text-foreground-muted sm:text-base">
          A prep sheet for {job}, built from your real experience. The likely questions, how to approach each one, and the facts from your own history to draw on. Nothing is made up.
        </p>
      </div>

      <div className="rounded-3xl border border-border-subtle bg-white p-5 shadow-lg shadow-blue-900/5 sm:p-6">
        <p className="text-sm font-semibold">What kind of interview is it?</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStage(s.id)}
              aria-pressed={stage === s.id}
              className={`rounded-2xl border p-3 text-left transition-colors ${stage === s.id ? "border-blue-600 bg-blue-500/10" : "border-border-subtle bg-background hover:border-blue-500/40"}`}
            >
              <span className="block text-sm font-semibold">{s.label}</span>
              <span className="mt-0.5 block text-xs text-foreground-muted">{s.blurb}</span>
            </button>
          ))}
        </div>
        <button type="button" onClick={() => void build()} disabled={busy} className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-blue-600 px-6 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-500 disabled:opacity-60 sm:w-auto">
          {busy ? "Building your prep sheet…" : sheet ? "Build it again" : "Build my prep sheet"}
        </button>
        {busy && <p className="mt-2 text-xs text-foreground-muted">This takes about 20 seconds.</p>}
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>

      {sheet && (
        <>
          <div className="rounded-3xl border border-border-subtle bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Your 60-second opening</p>
            <p className="mt-1 text-sm text-foreground-muted">For &quot;tell me about yourself.&quot; Say it in your own words. This is the shape.</p>
            <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed">{sheet.opening}</p>
            <button type="button" onClick={() => void copy("opening", sheet.opening)} className="mt-3 inline-flex min-h-10 items-center rounded-full border border-border-subtle bg-background px-4 text-xs font-semibold hover:border-blue-500/40">
              {copied === "opening" ? "Copied" : "Copy opening"}
            </button>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">Likely questions ({sheet.questions.length})</p>
            <div className="space-y-3">
              {sheet.questions.map((q, i) => (
                <QuestionCard key={`${sheet.at}-${i}`} q={q} index={i} onStory={onStory} />
              ))}
            </div>
          </div>

          {sheet.askThem.length > 0 && (
            <div className="rounded-3xl border border-border-subtle bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Questions to ask them</p>
              <p className="mt-1 text-sm text-foreground-muted">Asking good questions shows you want this job. Pick two or three.</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">
                {sheet.askThem.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {sheet.remember.length > 0 && (
            <div className="rounded-2xl border border-border-subtle bg-background-elevated p-4">
              <p className="text-sm font-semibold">Remember</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground-muted">
                {sheet.remember.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-foreground-muted">Questions about pay, work authorization, and other personal facts are for you to answer in your own words, so they are not part of this sheet.</p>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void copy("all", plain)} className="inline-flex min-h-11 items-center rounded-full border border-border-subtle bg-white px-5 text-sm font-semibold shadow-sm hover:border-blue-500/40">
              {copied === "all" ? "Copied" : "Copy the whole sheet"}
            </button>
            <button
              type="button"
              onClick={() => downloadBlob(new Blob([plain], { type: "text/plain;charset=utf-8" }), `interview-prep-${(result.postingTitle || doc.headline || "job").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "job"}.txt`)}
              className="inline-flex min-h-11 items-center rounded-full border border-border-subtle bg-white px-5 text-sm font-semibold shadow-sm hover:border-blue-500/40"
            >
              Download as a text file
            </button>
          </div>
        </>
      )}

      <p className="text-center text-xs">
        <button type="button" onClick={onBack} className="font-semibold text-blue-700 underline underline-offset-2">
          ← Back to my resume
        </button>
      </p>
    </div>
  );
}
