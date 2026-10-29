"use client";

import { useState } from "react";
import {
  giftIntro,
  giftQuestionSpoken,
  giftQuestions,
  giftResultSpoken,
  giftResults,
  giftVerse,
  giftWrapUp,
  type GiftId,
} from "@/lib/career-day";
import { BigButton, Confetti, Panel, ReadAloud } from "./ui";

type Step = "intro" | "quiz" | "result";

// The gift picked most often wins. On a tie, the most recent pick among the tied gifts wins.
function pickWinner(picks: GiftId[]): GiftId {
  const counts = new Map<GiftId, number>();
  for (const g of picks) counts.set(g, (counts.get(g) ?? 0) + 1);
  const max = Math.max(...counts.values());
  for (let i = picks.length - 1; i >= 0; i--) {
    if (counts.get(picks[i]) === max) return picks[i];
  }
  return picks[picks.length - 1];
}

export default function GiftMission({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState<Step>("intro");
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<GiftId[]>([]);

  function choose(gift: GiftId) {
    const nextPicks = [...picks, gift];
    setPicks(nextPicks);
    if (index + 1 < giftQuestions.length) {
      setIndex(index + 1);
    } else {
      setStep("result");
    }
  }

  function back() {
    if (index === 0) {
      setStep("intro");
      return;
    }
    setPicks((p) => p.slice(0, -1));
    setIndex(index - 1);
  }

  if (step === "intro") {
    return (
      <Panel className="mx-auto max-w-2xl text-center">
        <div aria-hidden className="text-7xl">
          🎁
        </div>
        <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Find Your Gift</h2>
        <p className="mt-4 text-xl leading-relaxed text-slate-700">{giftIntro}</p>
        <div className="mt-5 flex justify-center">
          <ReadAloud text={giftIntro} />
        </div>
        <div className="mt-6">
          <BigButton onClick={() => setStep("quiz")}>Let&apos;s go! 🚀</BigButton>
        </div>
      </Panel>
    );
  }

  if (step === "result") {
    const result = giftResults[pickWinner(picks)];
    const spoken = giftResultSpoken(result);
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <Confetti />
        <Panel className="cd-pop text-center">
          <p className="text-lg font-extrabold uppercase tracking-widest text-fuchsia-600">
            You have the gift of
          </p>
          <div aria-hidden className="mt-2 text-8xl">
            {result.emoji}
          </div>
          <h2 className="mt-2 text-5xl font-extrabold text-slate-900">{result.title}</h2>
          <p className="mx-auto mt-3 max-w-md text-xl font-semibold text-slate-700">{result.blurb}</p>
          <div className="mt-4 flex justify-center">
            <ReadAloud text={spoken} />
          </div>
        </Panel>

        <Panel>
          <p className="text-center text-2xl font-extrabold text-slate-900">
            People with your gift grow up to be:
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {result.careers.map((career) => (
              <div
                key={career.name}
                className={`rounded-3xl p-4 ${career.ours ? "bg-blue-50 ring-4 ring-blue-300" : "bg-slate-50"}`}
              >
                <p className="text-xl font-extrabold text-slate-900">
                  <span aria-hidden className="mr-2 text-3xl">
                    {career.emoji}
                  </span>
                  {career.name}
                </p>
                <p className="mt-1 text-base text-slate-700">{career.does}</p>
                {career.ours && (
                  <p className="mt-2 text-sm font-bold text-blue-700">⭐ Mr. and Mrs. Warthen&apos;s job</p>
                )}
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="text-center">
          <p className="text-xl font-extrabold text-slate-900">🌟 Try this today</p>
          <p className="mt-2 rounded-3xl bg-amber-100 p-4 text-xl font-bold text-amber-900">{result.tryToday}</p>
          <p className="mt-5 text-lg font-semibold text-slate-700">{giftWrapUp}</p>
          <p className="mt-4 text-base italic text-slate-600">
            &ldquo;{giftVerse.text}&rdquo; {giftVerse.ref}
          </p>
        </Panel>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <BigButton
            tone="white"
            onClick={() => {
              setPicks([]);
              setIndex(0);
              setStep("quiz");
            }}
          >
            Try again 🔁
          </BigButton>
          <BigButton tone="amber" onClick={onFinish}>
            ⭐ Earn my star!
          </BigButton>
        </div>
      </div>
    );
  }

  const q = giftQuestions[index];
  const spoken = giftQuestionSpoken(q);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div
        className="flex items-center justify-center gap-2"
        aria-label={`Question ${index + 1} of ${giftQuestions.length}`}
      >
        {giftQuestions.map((_, i) => (
          <span
            key={i}
            className={`h-3 w-10 rounded-full ${
              i < index ? "bg-emerald-400" : i === index ? "bg-blue-500" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      <Panel className="text-center">
        <p className="text-base font-bold text-slate-500">Tap the one that sounds like you</p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900">{q.question}</h2>
        <div className="mt-4 flex justify-center">
          <ReadAloud text={spoken} />
        </div>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2">
        {q.options.map((option, i) => (
          <button
            key={option.text}
            type="button"
            onClick={() => choose(option.gift)}
            className={`flex min-h-20 items-center gap-4 rounded-3xl border-4 border-white bg-white px-5 py-4 text-left text-xl font-bold text-slate-800 shadow-md transition hover:border-blue-300 active:scale-[0.98] ${
              i === q.options.length - 1 && q.options.length % 2 === 1 ? "sm:col-span-2" : ""
            }`}
          >
            <span aria-hidden className="text-4xl">
              {option.emoji}
            </span>
            <span>{option.text}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={back}
        className="min-h-12 rounded-full bg-white/80 px-5 py-2 text-base font-bold text-slate-600 shadow transition hover:bg-white active:scale-95"
      >
        ⬅️ Back
      </button>
    </div>
  );
}
