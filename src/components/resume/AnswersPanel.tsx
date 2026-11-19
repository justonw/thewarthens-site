"use client";

import { useRef, useState } from "react";
import { ANSWER_TWEAKS, QUICK_QUESTIONS, isPersonalQuestion, wordCount, type AnswerTweak, type Unsupported } from "@/lib/answers";
import type { ResumeDoc, TailorResult } from "@/lib/resume-tailor";
import { newMessageId, whenLabel, type SavedAnswer } from "@/lib/resume-library";
import { storiesAsNotes, type Story } from "@/lib/resume-profile";
import { track } from "@/lib/track";
import AutoTextarea from "./AutoTextarea";

// "Answers": the written questions on an application ("Why do you want to work here?", "Tell us about a time..."). The
// person picks or pastes a question and gets a first-person draft built only from their resume, the true stories they have
// told us, and the job. For a "tell us about a time" question with no real example behind it, we ask ONE question back
// instead of making one up, and keep what they say as a true story for next time. Questions about pay, work
// authorization, and the like are for the person to answer, and are never drafted.

const errors: Record<string, string> = {
  "answers-limit": "You've used this month's answer drafts. They come back on the 1st.",
  "slow-down": "That was a lot of tries in a short time. Wait a few minutes and try again.",
  upstream: "That didn't work this time. Try again in a moment.",
  refused: "That draft used a number we couldn't find in your resume or stories, so we threw it away. Try again.",
  cap: "We've reached our limit for answer drafts this month. Please try again next month.",
  unavailable: "Answer drafts aren't available right now. Please try again later.",
  email: "Add your email address on the resume form first. It only counts your monthly drafts.",
  question: "Paste the question from the application first.",
};

const box = "w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-base leading-relaxed outline-none focus:border-blue-500/50";

type Drafted = { kind: "answer"; basedOn: string } | { kind: "ask"; askBack: string } | { kind: "yours"; note: string };

export default function AnswersPanel({
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
  // Answers already drafted for this job (kept with the saved build), and a way to keep new ones.
  saved: SavedAnswer[];
  onSave?: (a: SavedAnswer) => void;
  // A true answer the person gave when we asked a question back, to be kept for their next resume.
  onStory?: (topic: string, question: string, answer: string) => void;
  onBack: () => void;
}) {
  const [question, setQuestion] = useState("");
  const [limit, setLimit] = useState("");
  const [extra, setExtra] = useState("");
  const [drafted, setDrafted] = useState<Drafted | null>(null);
  const [answer, setAnswer] = useState("");
  const [overLimit, setOverLimit] = useState(false);
  // The second look: whether the draft was checked against the material, and any sentences it could not find there.
  const [checked, setChecked] = useState(false);
  const [flagged, setFlagged] = useState<Unsupported[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const keptId = useRef("");
  const topRef = useRef<HTMLDivElement>(null);

  const limitNumber = Number.parseInt(limit, 10) > 0 ? Number.parseInt(limit, 10) : 0;
  const personal = question.trim().length >= 8 && isPersonalQuestion(question);

  async function write(tweak: AnswerTweak = "", extraText = "") {
    if (busy) return;
    if (question.trim().length < 8) return setError(errors.question);
    if (!email) return setError(errors.email);
    setBusy(true);
    setError("");
    setCopied(false);
    try {
      const res = await fetch("/api/resume-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          doc,
          postingTitle: result.postingTitle,
          postingCompany: result.postingCompany,
          postingKeywords: result.postingKeywords,
          fitReason: result.fit?.reason ?? "",
          question: question.trim(),
          limit: limitNumber,
          stories: storiesAsNotes(stories, 2800),
          extra: extraText,
          tweak,
          previous: tweak && drafted?.kind === "answer" ? answer : "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(errors[data.error as string] ?? errors.upstream);
        return;
      }
      const r = data.result as { outcome: "answer" | "ask" | "yours"; answer?: string; basedOn?: string; askBack?: string; note?: string };
      if (r.outcome === "answer" && r.answer) {
        setDrafted({ kind: "answer", basedOn: r.basedOn ?? "" });
        setAnswer(r.answer);
        setOverLimit(Boolean(data.overLimit));
        setChecked(Boolean(data.checked));
        setFlagged(Array.isArray(data.flagged) ? (data.flagged as Unsupported[]) : []);
        setExtra("");
        keep(r.answer);
        track("answers-written");
        window.setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      } else if (r.outcome === "ask" && r.askBack) {
        setDrafted({ kind: "ask", askBack: r.askBack });
      } else {
        setDrafted({ kind: "yours", note: r.note ?? "" });
      }
    } catch {
      setError(errors.upstream);
    } finally {
      setBusy(false);
    }
  }

  // Keeps the draft with the saved build, one entry per question: tweaks and edits update it instead of adding more.
  function keep(text: string) {
    if (!onSave) return;
    if (!keptId.current) keptId.current = newMessageId();
    onSave({ id: keptId.current, at: new Date().toISOString(), question: question.trim(), answer: text });
  }

  async function copy(text: string) {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      const field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(field);
      field.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      document.body.removeChild(field);
    }
    if (ok) {
      // What they copied is what they will paste into the form, so that is what is kept.
      keep(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } else {
      setError("Your browser blocked copying. Select the text and copy it by hand.");
    }
  }

  function another() {
    setQuestion("");
    setLimit("");
    setExtra("");
    setDrafted(null);
    setAnswer("");
    setChecked(false);
    setFlagged([]);
    setError("");
    keptId.current = "";
    window.setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function submitExtra(e: React.FormEvent) {
    e.preventDefault();
    if (extra.trim().length < 5) return setError("Write a sentence or two about a real time. It only has to be true.");
    onStory?.(question.trim().slice(0, 120), drafted?.kind === "ask" ? drafted.askBack : "", extra.trim());
    void write("", extra.trim());
  }

  // Flagged sentences still in the text (the person may have edited or removed them since).
  const norm = (t: string) => t.replace(/\s+/g, " ").trim();
  const visibleFlags = flagged.filter((f) => norm(answer).includes(norm(f.sentence)));
  function removeSentence(sentence: string) {
    const next = norm(answer).replace(norm(sentence), "").replace(/\s{2,}/g, " ").trim();
    setAnswer(next);
    setFlagged((cur) => cur.filter((f) => f.sentence !== sentence));
  }

  const chars = answer.length;
  const over = limitNumber > 0 && chars > limitNumber;

  return (
    <div ref={topRef} className="space-y-5 scroll-mt-24">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight">Answer the application questions</h3>
        <p className="mt-1 text-sm text-foreground-muted sm:text-base">
          Paste a question from the application. We&apos;ll draft an answer from your real experience and this job, in your voice. Nothing is made up.
        </p>
      </div>

      {saved.length > 0 && (
        <details className="rounded-2xl border border-border-subtle bg-background-elevated p-4">
          <summary className="cursor-pointer text-sm font-semibold">Answers you already drafted for this job ({saved.length})</summary>
          <ul className="mt-3 space-y-3">
            {saved.map((a) => (
              <li key={a.id} className="rounded-xl border border-border-subtle bg-white p-3 text-sm">
                <p className="text-xs font-semibold text-foreground-muted">
                  {a.question} · {whenLabel(a.at)}
                </p>
                <p className="mt-2 whitespace-pre-wrap">{a.answer}</p>
                <button type="button" onClick={() => void navigator.clipboard?.writeText(a.answer).catch(() => {})} className="mt-2 inline-flex min-h-10 items-center rounded-full border border-border-subtle bg-background px-4 text-xs font-semibold hover:border-blue-500/40">
                  Copy answer
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}

      {drafted?.kind !== "answer" && (
        <div className="rounded-3xl border border-border-subtle bg-white p-5 shadow-lg shadow-blue-900/5 sm:p-6">
          <p className="text-sm font-semibold">Tap a common question, or paste your own</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setQuestion(q);
                  setDrafted(null);
                  setError("");
                }}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-left text-sm transition-colors sm:min-h-10 ${question === q ? "border-blue-600 bg-blue-500/10 font-semibold" : "border-border-subtle bg-background hover:border-blue-500/40"}`}
              >
                {q}
              </button>
            ))}
          </div>

          <label htmlFor="ans-question" className="mt-5 block text-sm font-semibold">
            The question
          </label>
          <textarea
            id="ans-question"
            rows={3}
            maxLength={600}
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (drafted) setDrafted(null);
            }}
            placeholder="Paste the question from the application here"
            className={`${box} mt-1 resize-y`}
          />

          <div className="mt-3">
            <label htmlFor="ans-limit" className="text-xs font-semibold text-foreground-muted">
              Character limit on the form (optional)
            </label>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <input
                id="ans-limit"
                value={limit}
                onChange={(e) => setLimit(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
                inputMode="numeric"
                placeholder="For example, 500"
                autoComplete="off"
                className={`${box} !w-40 !text-sm`}
              />
              {[500, 1000, 2000].map((n) => (
                <button key={n} type="button" onClick={() => setLimit(String(n))} className="inline-flex min-h-11 items-center rounded-full border border-border-subtle bg-background px-3 text-xs font-semibold hover:border-blue-500/40 sm:min-h-9">
                  {n}
                </button>
              ))}
            </div>
          </div>

          {personal && (
            <p role="status" className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
              This one asks for facts only you can give, like pay, work authorization, or your dates. Answer it yourself so it is exactly right. We won&apos;t draft it.
            </p>
          )}

          {drafted?.kind === "ask" && (
            <form onSubmit={submitExtra} className="mt-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">One quick question first</p>
              <label htmlFor="ans-extra" className="mt-1 block text-base font-semibold leading-snug">
                {drafted.askBack}
              </label>
              <p className="mt-1 text-xs text-foreground-muted">We never make up an example. Tell us a real one in a sentence or two, and we&apos;ll keep it for your next resume too.</p>
              <textarea id="ans-extra" rows={3} maxLength={700} value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="A sentence or two is enough" className={`${box} mt-2 resize-y`} />
              <button type="submit" disabled={busy || extra.trim().length < 5} className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50 sm:w-auto">
                {busy ? "Writing…" : "Use this and write my answer"}
              </button>
            </form>
          )}

          {drafted?.kind === "yours" && (
            <p role="status" className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
              {drafted.note}
            </p>
          )}

          {error && (
            <p role="alert" className="mt-4 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {drafted?.kind !== "ask" && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void write()}
                disabled={busy || question.trim().length < 8 || personal}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {busy ? "Writing…" : "Draft my answer"}
                <span aria-hidden>→</span>
              </button>
              <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold text-foreground-muted transition-colors hover:text-foreground">
                Back to my resume
              </button>
            </div>
          )}
        </div>
      )}

      {drafted?.kind === "answer" && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-border-subtle bg-gradient-to-br from-blue-500/10 via-background-elevated to-violet-500/10 p-5 shadow-sm sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Your answer</p>
            <p className="mt-1 text-base font-semibold leading-snug">{question}</p>
            {drafted.basedOn && (
              <p className="mt-2 flex gap-2 text-sm text-foreground-muted">
                <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-green-600" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>
                  <span className="font-semibold text-foreground">Built on:</span> {drafted.basedOn}
                </span>
              </p>
            )}
          </div>

          <section className="rounded-2xl border border-border-subtle bg-white p-5 shadow-sm">
            <label htmlFor="ans-answer" className="sr-only">
              Your answer
            </label>
            <AutoTextarea id="ans-answer" value={answer} onChange={(e) => setAnswer(e.target.value)} className={box} />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className={`font-semibold ${over ? "text-red-700" : "text-foreground-muted"}`} aria-live="polite">
                {wordCount(answer)} words · {chars}
                {limitNumber > 0 ? ` / ${limitNumber}` : ""} characters
              </span>
              {(over || overLimit) && limitNumber > 0 && <span className="text-red-700">Over the form&apos;s limit. Tap Shorter, or trim a few words.</span>}
            </div>
            {visibleFlags.length > 0 ? (
              <div role="status" className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
                <p className="font-semibold">Check {visibleFlags.length === 1 ? "this sentence" : "these sentences"}</p>
                <p className="mt-0.5 text-xs text-foreground-muted">We couldn&apos;t find {visibleFlags.length === 1 ? "it" : "them"} in your resume or stories. Keep {visibleFlags.length === 1 ? "it" : "them"} only if true.</p>
                <ul className="mt-2 space-y-2">
                  {visibleFlags.map((f) => (
                    <li key={f.sentence} className="rounded-lg bg-white p-2.5">
                      <p>&ldquo;{f.sentence}&rdquo;</p>
                      <p className="mt-0.5 text-xs text-foreground-muted">{f.why}</p>
                      <button type="button" onClick={() => removeSentence(f.sentence)} className="mt-1.5 inline-flex min-h-10 items-center rounded-full border border-border-subtle bg-background px-4 text-xs font-semibold hover:border-blue-500/40">
                        Remove it
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : checked ? (
              <p role="status" className="mt-3 flex gap-2 text-sm text-green-800">
                <span aria-hidden>✓</span>
                <span>We checked each sentence against your resume and stories and found nothing extra. Still read it once.</span>
              </p>
            ) : (
              <p role="status" className="mt-3 text-sm text-foreground-muted">We couldn&apos;t run the accuracy check this time. Read every sentence before you paste it.</p>
            )}
            <button
              type="button"
              onClick={() => void copy(answer)}
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-500 sm:w-auto"
            >
              {copied ? "Copied, now paste it" : "Copy answer"}
            </button>
          </section>

          <div className="rounded-2xl border border-border-subtle bg-background-elevated p-5">
            <p className="text-sm font-semibold">Not quite right? One tap and we&apos;ll write it again.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ANSWER_TWEAKS.map((t) => (
                <button key={t.id} type="button" disabled={busy} onClick={() => void write(t.id)} className="inline-flex min-h-11 items-center rounded-full border border-border-subtle bg-white px-4 py-2 text-sm font-semibold shadow-sm transition-colors hover:border-blue-500/40 disabled:opacity-60 sm:min-h-10">
                  {busy ? "Writing…" : t.label}
                </button>
              ))}
            </div>
            {error && (
              <p role="alert" className="mt-3 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
          </div>

          <p className="text-sm text-foreground-muted">Read it once and make it yours before you paste it. It only uses what is on your resume and what you told us.</p>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={another} className="inline-flex min-h-11 items-center rounded-full border border-border-subtle bg-white px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors hover:border-blue-500/40">
              Answer another question
            </button>
            <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center rounded-full px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-500/10">
              Back to my resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
