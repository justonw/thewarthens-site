"use client";

import { useMemo, useState } from "react";
import type { ResumeDoc } from "@/lib/resume-tailor";
import { answerHasNumber, findUnquantified, numberQuestion, quantifyScore, type BulletRef } from "@/lib/quantify";
import { track } from "@/lib/track";

// "Make your bullets measurable": the bullets with no number, each with one plain question. A real figure goes in, and
// only that bullet is rewritten around it (see lib/quantify.ts). Nothing is added unless the person types it, and a
// bullet they skip is left alone. Shown under the gap coach on a finished resume.

const errors: Record<string, string> = {
  "no-number": "Type it as a number, like 40 or 15%.",
  "quantify-limit": "You've used this month's number updates. You can still edit any bullet by hand.",
  "slow-down": "That was a lot of tries in a short time. Wait a few minutes and try again.",
  upstream: "That didn't work this time. Try again in a moment.",
  refused: "That didn't come out right. Try the number again, or edit the bullet by hand.",
  cap: "We've reached our limit for number updates this month. You can still edit any bullet by hand.",
  unavailable: "Number updates aren't available right now. You can still edit any bullet by hand.",
  email: "Add your email address on the resume form first. It only counts your monthly updates.",
};

function Item({ item, onAdd, onSkip }: { item: BulletRef; onAdd: (answer: string) => Promise<string | null>; onSkip: () => void }) {
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");
  const question = numberQuestion(item.text);
  const id = `nc-${item.job}-${item.bullet}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!answerHasNumber(answer)) {
      setProblem(errors["no-number"]);
      return;
    }
    setBusy(true);
    setProblem("");
    const result = await onAdd(answer.trim());
    setBusy(false);
    if (result) setProblem(result);
  }

  return (
    <li className="rounded-2xl border border-border-subtle bg-white p-4 shadow-sm sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
        {item.title}
        {item.company ? `, ${item.company}` : ""}
      </p>
      <p className="mt-2 rounded-xl bg-background px-3 py-2 text-sm leading-relaxed">{item.text}</p>
      <form onSubmit={submit} className="mt-3">
        <label htmlFor={id} className="block text-base font-semibold leading-snug">
          {question}
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id={id}
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setProblem("");
            }}
            maxLength={120}
            inputMode="text"
            autoComplete="off"
            placeholder="For example, 40 or 15%"
            className="min-h-11 w-full rounded-xl border border-border-subtle bg-background px-3 py-2 text-base outline-none focus:border-blue-500/50"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy || answer.trim().length === 0}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50 sm:flex-none"
            >
              {busy ? "Adding…" : "Add the number"}
            </button>
            <button type="button" onClick={onSkip} className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-foreground-muted transition-colors hover:text-foreground">
              No number
            </button>
          </div>
        </div>
        {problem && (
          <p role="alert" className="mt-2 text-sm text-red-700">
            {problem}
          </p>
        )}
      </form>
    </li>
  );
}

export default function NumbersCoach({
  doc,
  onDoc,
  email,
  keywords,
  onAnswered,
}: {
  doc: ResumeDoc;
  onDoc: (d: ResumeDoc) => void;
  email: string;
  keywords: string[];
  // Called with what the person said, so it can be kept as a true story for their next resume.
  onAnswered?: (topic: string, question: string, answer: string) => void;
}) {
  const [skipped, setSkipped] = useState<Set<string>>(() => new Set());
  const [flash, setFlash] = useState("");
  const score = useMemo(() => quantifyScore(doc), [doc]);
  const asked = useMemo(() => findUnquantified(doc, keywords, skipped), [doc, keywords, skipped]);

  async function add(item: BulletRef, answer: string): Promise<string | null> {
    if (!email) return errors.email;
    try {
      const res = await fetch("/api/resume-quantify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, bullet: item.text, answer, question: numberQuestion(item.text), title: item.title, company: item.company, current: item.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) return errors[data.error as string] ?? errors.upstream;
      // Only replace the bullet if it is still the one we asked about (the person may have edited it meanwhile).
      const job = doc.experience[item.job];
      if (!job || job.bullets[item.bullet]?.trim() !== item.text) return "That bullet changed while we were working. Try again.";
      onDoc({
        ...doc,
        experience: doc.experience.map((j, ji) => (ji === item.job ? { ...j, bullets: j.bullets.map((b, bi) => (bi === item.bullet ? (data.bullet as string) : b)) } : j)),
      });
      onAnswered?.(`${item.title}${item.company ? ` at ${item.company}`: ""}: ${item.text.slice(0, 80)}`, numberQuestion(item.text), answer);
      track("numbers-answered");
      setFlash(data.bullet as string);
      return null;
    } catch {
      return errors.upstream;
    }
  }

  if (score.total === 0) return null;
  const pct = Math.round((score.withNumber / score.total) * 100);

  if (asked.length === 0) {
    if (score.withNumber === 0 && skipped.size === 0) return null;
    return (
      <p role="status" className="rounded-2xl border border-border-subtle bg-background-elevated px-4 py-3 text-sm">
        <span className="font-semibold text-green-700">{score.withNumber} of {score.total} bullets show a number.</span>{" "}
        <span className="text-foreground-muted">{flash ? "Your last number is in the resume." : "Numbers make a resume easier to believe."}</span>
      </p>
    );
  }

  return (
    <section aria-labelledby="nc-title" className="rounded-3xl border border-border-subtle bg-gradient-to-br from-amber-500/10 via-background-elevated to-blue-500/10 p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Numbers coach</p>
          <h3 id="nc-title" className="mt-1 text-xl font-semibold tracking-tight">
            Make your bullets measurable
          </h3>
          <p className="mt-1 max-w-xl text-sm text-foreground-muted">
            A number makes a bullet easier to believe and to remember. Answer with a real figure; an honest rough number is fine. If there isn&apos;t one, tap &quot;No number&quot; and the bullet stays as it is.
          </p>
        </div>
        <div className="min-w-[10rem]">
          <p className="text-sm font-semibold">
            {score.withNumber} of {score.total} bullets show a number
          </p>
          <div aria-hidden className="mt-1.5 h-2 overflow-hidden rounded-full bg-border-subtle">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-green-600 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {flash && (
        <p role="status" className="mt-4 rounded-xl border border-green-600/30 bg-green-600/10 px-4 py-3 text-sm">
          <span className="font-semibold text-green-800">Added.</span> <span className="text-foreground">{flash}</span>
        </p>
      )}

      <ul className="mt-4 space-y-3">
        {asked.map((item) => (
          <Item key={`${item.job}-${item.bullet}-${item.text}`} item={item} onAdd={(a) => add(item, a)} onSkip={() => setSkipped((s) => new Set(s).add(item.text))} />
        ))}
      </ul>
    </section>
  );
}
