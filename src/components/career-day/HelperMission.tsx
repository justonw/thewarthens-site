"use client";

import { useState } from "react";
import {
  helperIntro,
  helperRounds,
  techSalesCard,
  type SoftSkillId,
} from "@/lib/career-day";
import { BigButton, CareerCard, Panel, ReadAloud, SkillChips } from "./ui";

type Step = "intro" | "round" | "card";

export default function HelperMission({ onFinish }: { onFinish: (skills: SoftSkillId[]) => void }) {
  const [step, setStep] = useState<Step>("intro");
  const [roundIndex, setRoundIndex] = useState(0);
  const [tried, setTried] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [earned, setEarned] = useState<SoftSkillId[]>([]);

  const round = helperRounds[roundIndex];
  const lastTried = tried.length > 0 ? tried[tried.length - 1] : null;
  const lastOption = lastTried !== null ? round.options[lastTried] : null;

  function choose(index: number) {
    if (solved) return;
    setTried((t) => (t.includes(index) ? t : [...t, index]));
    if (round.options[index].correct) {
      setSolved(true);
      setEarned((e) => Array.from(new Set([...e, ...round.earns])));
    }
  }

  function next() {
    if (roundIndex + 1 < helperRounds.length) {
      setRoundIndex(roundIndex + 1);
      setTried([]);
      setSolved(false);
    } else {
      setStep("card");
    }
  }

  if (step === "intro") {
    return (
      <Panel className="mx-auto max-w-2xl text-center">
        <div aria-hidden className="text-7xl">
          🤝
        </div>
        <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Be the Helper</h2>
        <p className="mt-4 text-xl leading-relaxed text-slate-700">{helperIntro}</p>
        <div className="mt-5 flex justify-center">
          <ReadAloud text={helperIntro} />
        </div>
        <div className="mt-6">
          <BigButton onClick={() => setStep("round")}>Let&apos;s go! 🚀</BigButton>
        </div>
      </Panel>
    );
  }

  if (step === "card") {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <Panel className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">Mission complete! 🎉</h2>
          <p className="mt-2 text-lg text-slate-600">You showed these skills:</p>
          <div className="mt-3">
            <SkillChips skills={earned} />
          </div>
        </Panel>
        <CareerCard data={techSalesCard} />
        <div className="text-center">
          <BigButton tone="amber" onClick={() => onFinish(earned)}>
            ⭐ Earn my star!
          </BigButton>
        </div>
      </div>
    );
  }

  const spoken = `${round.who} ${round.says} ${round.question} ${round.options
    .map((o, i) => `${String.fromCharCode(65 + i)}. ${o.text}`)
    .join(" ")}`;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-center gap-2" aria-label={`Round ${roundIndex + 1} of ${helperRounds.length}`}>
        {helperRounds.map((_, i) => (
          <span
            key={i}
            className={`h-3 w-10 rounded-full ${
              i < roundIndex ? "bg-emerald-400" : i === roundIndex ? "bg-blue-500" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      <Panel className="text-center">
        <div aria-hidden className="text-7xl">
          {round.sceneEmoji}
        </div>
        <p className="mt-3 text-xl font-bold text-slate-700">{round.who}</p>
        <p className="mx-auto mt-3 max-w-md rounded-3xl bg-sky-100 px-6 py-4 text-2xl font-extrabold text-sky-900">
          &ldquo;{round.says}&rdquo;
        </p>
        <p className="mt-5 text-2xl font-extrabold text-slate-900">{round.question}</p>
        <div className="mt-4 flex justify-center">
          <ReadAloud text={spoken} />
        </div>
      </Panel>

      <div className="grid gap-3">
        {round.options.map((option, i) => {
          const wasTried = tried.includes(i);
          const isRight = solved && option.correct;
          return (
            <button
              key={option.text}
              type="button"
              onClick={() => choose(i)}
              disabled={solved && !option.correct}
              className={`flex min-h-20 items-center gap-4 rounded-3xl border-4 px-5 py-4 text-left text-xl font-bold shadow-md transition active:scale-[0.98] ${
                isRight
                  ? "cd-pop border-emerald-400 bg-emerald-100 text-emerald-900"
                  : wasTried
                    ? "border-amber-300 bg-amber-50 text-amber-900 opacity-70"
                    : "border-white bg-white text-slate-800 hover:border-blue-300"
              } ${solved && !option.correct ? "opacity-40" : ""}`}
            >
              <span aria-hidden className="text-4xl">
                {option.emoji}
              </span>
              <span>{option.text}</span>
            </button>
          );
        })}
      </div>

      {lastOption && (
        <div
          role="status"
          className={`cd-pop rounded-3xl p-5 text-center text-xl font-bold ${
            lastOption.correct ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"
          }`}
        >
          {lastOption.correct ? "✅ " : "🤔 "}
          {lastOption.feedback}
        </div>
      )}

      {solved && (
        <div className="space-y-4 text-center">
          <SkillChips skills={round.earns} />
          <p className="mx-auto max-w-xl text-lg font-semibold text-slate-700">💡 {round.lesson}</p>
          <BigButton onClick={next}>
            {roundIndex + 1 < helperRounds.length ? "Next ➡️" : "See what it takes ➡️"}
          </BigButton>
        </div>
      )}
    </div>
  );
}
