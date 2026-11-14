"use client";

import { useState } from "react";
import { pickLabels, situations, type Pick } from "@/lib/source-of-life";

type Quote = { ref: string; text: string };
type Quotes = { job1: Quote; job2: Quote; daniel: Quote; isaiah: Quote; romans: Quote };

const choiceStyle: Record<Pick, string> = {
  god: "border-amber-300/40 hover:border-amber-300 hover:bg-amber-300/10",
  devil: "border-rose-300/40 hover:border-rose-300 hover:bg-rose-300/10",
  me: "border-sky-300/40 hover:border-sky-300 hover:bg-sky-300/10",
};

function QuoteLine({ q }: { q: Quote }) {
  return (
    <blockquote className="mt-3 border-l-2 border-amber-300/60 pl-4 font-serif text-lg leading-relaxed text-slate-100">
      {q.text}
      <span className="mt-1 block font-sans text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
        {q.ref} <span className="text-slate-500">KJV</span>
      </span>
    </blockquote>
  );
}

// Seven everyday situations, three buttons, and a reveal. The test does not score anything. It
// makes the reader notice that they already sort life into God, the devil, and themselves.
export default function ParadigmTest({ quotes }: { quotes: Quotes }) {
  const [answers, setAnswers] = useState<Pick[]>([]);
  const done = answers.length === situations.length;
  const current = answers.length;

  const count = (p: Pick) => answers.filter((a) => a === p).length;
  const g = count("god");
  const d = count("devil");
  const m = count("me");

  return (
    <div className="mx-auto max-w-2xl">
      {!done ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-9">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            <span>
              {current + 1} of {situations.length}
            </span>
            <span className="flex gap-1.5" aria-hidden>
              {situations.map((_, i) => (
                <span key={i} className={`h-1.5 w-6 rounded-full ${i < current ? "bg-amber-300" : i === current ? "bg-amber-300/50" : "bg-white/10"}`} />
              ))}
            </span>
          </div>
          <p key={current} className="mt-8 min-h-[4.5rem] font-serif text-2xl leading-snug text-white sm:text-3xl">
            {situations[current]}
          </p>
          <p className="mt-6 text-sm text-slate-400">Be honest. Who do you think is behind it?</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {(Object.keys(pickLabels) as Pick[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAnswers((a) => [...a, p])}
                className={`rounded-2xl border bg-white/[0.03] px-4 py-4 text-base font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 ${choiceStyle[p]}`}
              >
                {pickLabels[p]}
              </button>
            ))}
          </div>
          {current > 0 && (
            <button type="button" onClick={() => setAnswers((a) => a.slice(0, -1))} className="mt-5 text-sm text-slate-400 underline underline-offset-4 hover:text-slate-200">
              Back
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-3xl border border-amber-300/25 bg-white/[0.04] p-6 text-left shadow-2xl shadow-black/30 sm:p-9" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Here is what you just did</p>
          <p className="mt-4 text-lg text-slate-200">
            You put <strong className="text-white">{g}</strong> in God&apos;s column, <strong className="text-white">{d}</strong> in the
            devil&apos;s column, and <strong className="text-white">{m}</strong> on your own choices.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-slate-200">
            Every card made you decide who was behind it. Nobody handed you the answer, so it came from your paradigm: the lens you already look at life through. That is not an accusation. It is the point of this whole page.
          </p>

          {d > 0 && (
            <div className="mt-7">
              <p className="text-slate-200">
                You gave {d === 1 ? "one" : d} of these to the devil. Look at the one place Scripture pulls back the curtain on Satan&apos;s reach. Before he could touch Job, the Lord set the limit:
              </p>
              <QuoteLine q={quotes.job1} />
              <QuoteLine q={quotes.job2} />
            </div>
          )}

          {m > 0 && (
            <div className="mt-7">
              <p className="text-slate-200">
                You put {m === 1 ? "one" : m} on your own choices. Accountability is real, and we need it. Daniel said it plainly:
              </p>
              <QuoteLine q={quotes.daniel} />
              <p className="mt-3 text-slate-300">It is real, and it is still not the whole picture.</p>
            </div>
          )}

          <div className="mt-7">
            <p className="text-slate-200">
              {g === situations.length
                ? "You gave all of it to God. Then the question is not who, but how to come to Him in what hurts."
                : g > 0
                  ? "You were willing to give God some of it. Ask why you would hand Him the good and not the rest."
                  : "You did not give God any of it. Read what He says about Himself:"}
            </p>
            <QuoteLine q={quotes.isaiah} />
          </div>

          <p className="mt-7 text-lg leading-relaxed text-slate-100">
            We are not asking you to agree yet. We are asking you to look at the lens, and then at Scripture. Our understanding is that everything that happens, happens as the Lord allows it, and that is exactly why you can go to Him in the good and in the bad, by the blood of Jesus.
          </p>
          <QuoteLine q={quotes.romans} />

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#act-1" className="rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-[#0a0c1d] transition-colors hover:bg-amber-200">
              Begin with who He is →
            </a>
            <button type="button" onClick={() => setAnswers([])} className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-amber-300/60">
              Take it again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
