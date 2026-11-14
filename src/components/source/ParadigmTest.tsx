"use client";

import { useState } from "react";
import { pickLabels, situations, type Pick } from "@/lib/source-of-life";

type Quote = { ref: string; text: string };
type Quotes = { job1: Quote; job2: Quote; daniel: Quote; isaiah: Quote; romans: Quote; grace: Quote; mystery: Quote };

const choiceStyle: Record<Pick, string> = {
  god: "border-sol-gold/40 hover:border-sol-gold hover:bg-sol-gold/10",
  devil: "border-sol-rose/30 hover:border-sol-rose hover:bg-sol-rose/10",
  me: "border-sol-sky/40 hover:border-sol-sky hover:bg-sol-sky/10",
  unsure: "",
};
const mainPicks: Pick[] = ["god", "devil", "me"];

function QuoteLine({ q }: { q: Quote }) {
  return (
    <blockquote className="mt-3 border-l-2 border-sol-gold/60 pl-4 font-sol text-lg leading-relaxed text-sol-ink">
      {q.text}
      <span className="mt-1 block font-sans text-xs font-semibold uppercase tracking-[0.16em] text-sol-gold">
        {q.ref} <span className="text-sol-muted">KJV</span>
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
  const u = count("unsure");

  return (
    <div className="mx-auto max-w-2xl">
      {!done ? (
        <div className="rounded-3xl border border-sol-line bg-sol-card p-6 shadow-xl shadow-sol-ink/10 backdrop-blur sm:p-9">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-sol-muted">
            <span>
              {current + 1} of {situations.length}
            </span>
            <span className="flex gap-1.5" aria-hidden>
              {situations.map((_, i) => (
                <span key={i} className={`h-1.5 w-6 rounded-full ${i < current ? "bg-sol-primary" : i === current ? "bg-sol-gold/50" : "bg-sol-line"}`} />
              ))}
            </span>
          </div>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-sol-gold">Imagine this happens to you</p>
          <p key={current} className="mt-3 min-h-[4.5rem] font-sol text-2xl leading-snug text-sol-ink sm:text-3xl">
            {situations[current]}
          </p>
          <p className="mt-6 text-sm text-sol-muted">Who do you think is mainly behind this? Go with your first instinct.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {mainPicks.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAnswers((a) => [...a, p])}
                className={`rounded-2xl border bg-sol-card px-4 py-4 text-base font-semibold text-sol-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sol-gold ${choiceStyle[p]}`}
              >
                {pickLabels[p]}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setAnswers((a) => [...a, "unsure"])}
            className="mt-3 w-full rounded-2xl border border-dashed border-sol-line px-4 py-3 text-sm font-semibold text-sol-muted transition-colors hover:border-sol-ink/40 hover:text-sol-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sol-gold"
          >
            {pickLabels.unsure}
          </button>
          {current > 0 && (
            <button type="button" onClick={() => setAnswers((a) => a.slice(0, -1))} className="mt-5 text-sm text-sol-muted underline underline-offset-4 hover:text-sol-ink">
              Back
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-3xl border border-sol-gold/25 bg-sol-card p-6 text-left shadow-xl shadow-sol-ink/10 sm:p-9" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sol-gold">Here is what you just did</p>
          <p className="mt-4 text-lg text-sol-ink">
            You put <strong className="text-sol-ink">{g}</strong> in God&apos;s column, <strong className="text-sol-ink">{d}</strong> in the
            devil&apos;s column, and <strong className="text-sol-ink">{m}</strong> on your own choices
            {u > 0 ? (
              <>
                . You were not sure about <strong className="text-sol-ink">{u}</strong>.
              </>
            ) : (
              "."
            )}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-sol-ink">
            Every card made you decide who was behind it. Nobody handed you the answer, so it came from your paradigm: the lens you already look at life through. That is not an accusation. It is the point of this whole page.
          </p>

          {d > 0 && (
            <div className="mt-7">
              <p className="text-sol-ink">
                You gave {d === 1 ? "one" : d} of these to the devil. Look at the one place Scripture pulls back the curtain on Satan&apos;s reach. Before he could touch Job, the Lord set the limit:
              </p>
              <QuoteLine q={quotes.job1} />
              <QuoteLine q={quotes.job2} />
            </div>
          )}

          {m > 0 && (
            <div className="mt-7">
              <p className="text-sol-ink">
                You put {m === 1 ? "one" : m} on your own choices. Accountability is real, and we need it. Daniel said it plainly:
              </p>
              <QuoteLine q={quotes.daniel} />
              <p className="mt-4 text-sol-ink">
                My choices are real, and I am accountable for them. But even my imperfect ones are met by grace. God works all things together for good for those who love Him, not because I got it right, but because of the blood.
              </p>
              <QuoteLine q={quotes.grace} />
            </div>
          )}

          {u > 0 && (
            <div className="mt-7">
              <p className="text-sol-ink">
                You were not sure about {u === 1 ? "one" : u}. That is an honest place to start, and Scripture never promises we will understand all of it:
              </p>
              <QuoteLine q={quotes.mystery} />
            </div>
          )}

          <div className="mt-7">
            <p className="text-sol-ink">
              {g === situations.length
                ? "You gave all of it to God. Then the question is not who, but how to come to Him in what hurts."
                : g > 0
                  ? "You were willing to give God some of it. Ask why you would hand Him the good and not the rest."
                  : "You did not give God any of it. Read what He says about Himself:"}
            </p>
            <QuoteLine q={quotes.isaiah} />
          </div>

          <p className="mt-7 text-lg leading-relaxed text-sol-ink">
            I am not asking you to agree yet. I am asking you to look at the lens, and then at Scripture. My understanding is that nothing happens outside what the Lord allows, and that is exactly why you can go to Him in the good and in the bad, by the blood of Jesus.
          </p>
          <QuoteLine q={quotes.romans} />

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#act-1" className="rounded-full bg-sol-primary px-6 py-3 text-sm font-semibold text-sol-on-primary transition-colors hover:bg-sol-primary/90">
              Begin with who He is →
            </a>
            <button type="button" onClick={() => setAnswers([])} className="rounded-full border border-sol-line px-6 py-3 text-sm font-semibold text-sol-ink transition-colors hover:border-sol-gold/60">
              Take it again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
