"use client";

import { useState } from "react";
import { cyberFeedbackSpoken, cyberRoundSpoken } from "@/lib/cyber-defenders";
import { crewById } from "@/lib/career-avatar";
import { cyberContent } from "@/lib/play-content";
import type { BandId } from "@/lib/play-worlds";
import Avatar from "./Avatar";
import { BigButton, CareerCard, Confetti, Panel, ReadAloud, ReadBox } from "./ui";

type Step = "intro" | "cases" | "round" | "caseDone" | "card";

export default function CyberMission({ band, onFinish }: { band: BandId; onFinish: () => void }) {
  const {
    intro: cyberIntro,
    cases: cyberCases,
    card: cyberCard,
    cardCloser: cyberCardCloser,
    grownUps: cyberGrownUps,
  } = cyberContent[band];
  const [step, setStep] = useState<Step>("intro");
  const [caseIndex, setCaseIndex] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [tried, setTried] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [closed, setClosed] = useState<string[]>([]);

  const currentCase = cyberCases[caseIndex];
  const round = currentCase.rounds[roundIndex];
  const speaker = round.speaker ? crewById(round.speaker) : undefined;
  const lastTried = tried.length > 0 ? tried[tried.length - 1] : null;
  const lastOption = lastTried !== null ? round.options[lastTried] : null;
  const allClosed = closed.length === cyberCases.length;

  function startCase(index: number) {
    setCaseIndex(index);
    setRoundIndex(0);
    setTried([]);
    setSolved(false);
    setStep("round");
  }

  function choose(index: number) {
    if (solved) return;
    setTried((t) => (t.includes(index) ? t : [...t, index]));
    if (round.options[index].correct) setSolved(true);
  }

  function next() {
    if (roundIndex + 1 < currentCase.rounds.length) {
      setRoundIndex(roundIndex + 1);
      setTried([]);
      setSolved(false);
    } else {
      setClosed((c) => (c.includes(currentCase.id) ? c : [...c, currentCase.id]));
      setStep("caseDone");
    }
  }

  if (step === "intro") {
    return (
      <Panel className="mx-auto max-w-2xl text-center">
        <div aria-hidden className="text-7xl">
          🛡️
        </div>
        <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Cyber Defenders</h2>
        <p className="mt-4 text-xl leading-relaxed text-slate-700">{cyberIntro}</p>
        <div className="mt-5 flex justify-center">
          <ReadAloud text={cyberIntro} />
        </div>
        <div className="mt-6">
          <BigButton tone="green" onClick={() => setStep("cases")}>
            Let&apos;s go! 🚀
          </BigButton>
        </div>
      </Panel>
    );
  }

  if (step === "cases") {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <Panel className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">Pick a case</h2>
          <p className="mt-2 text-lg text-slate-600">
            {closed.length} of {cyberCases.length} cases closed
          </p>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={cyberCases.length}
            aria-valuenow={closed.length}
            aria-label="Cases closed"
            className="mx-auto mt-3 h-4 max-w-sm overflow-hidden rounded-full bg-slate-200"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-700"
              style={{ width: `${(closed.length / cyberCases.length) * 100}%` }}
            />
          </div>
        </Panel>
        <div className="grid gap-4 sm:grid-cols-2">
          {cyberCases.map((c, i) => {
            const isClosed = closed.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => startCase(i)}
                className={`flex min-h-32 items-center gap-4 rounded-3xl border-4 px-5 py-4 text-left shadow-xl transition active:scale-[0.98] ${
                  isClosed
                    ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                    : "border-white bg-white text-slate-900 hover:border-emerald-300"
                }`}
              >
                <span aria-hidden className="text-6xl">
                  {c.emoji}
                </span>
                <span>
                  <span className="block text-sm font-extrabold uppercase tracking-wide text-emerald-700">
                    Case {i + 1}
                    {isClosed ? " ✅ Closed" : ""}
                  </span>
                  <span className="block text-2xl font-extrabold">{c.title}</span>
                  <span className="mt-1 block text-base font-semibold text-slate-600">{c.blurb}</span>
                </span>
              </button>
            );
          })}
        </div>
        {allClosed && (
          <div className="text-center">
            <BigButton tone="amber" onClick={() => setStep("card")}>
              🛡️ Meet a real defender
            </BigButton>
          </div>
        )}
      </div>
    );
  }

  if (step === "caseDone") {
    return (
      <>
        <Confetti />
        <Panel className="mx-auto max-w-2xl text-center">
          <div aria-hidden className="text-7xl">
            {currentCase.emoji}
          </div>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">{currentCase.doneLine}</h2>
          <div className="mt-5 flex justify-center">
            <ReadAloud text={currentCase.doneLine} />
          </div>
          <div className="mt-6">
            <BigButton tone="green" onClick={() => setStep(allClosed ? "card" : "cases")}>
              {allClosed ? "Meet a real defender ➡️" : "Pick the next case ➡️"}
            </BigButton>
          </div>
        </Panel>
      </>
    );
  }

  if (step === "card") {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <Panel className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">
            {cyberCases.length === 4 ? "All four" : "All three"} cases closed! 🎉
          </h2>
          <p className="mt-2 text-lg text-slate-600">You are a Cyber Defender. Here is what a real one does.</p>
        </Panel>
        <CareerCard data={cyberCard} />
        <ReadBox text={cyberCardCloser} className="text-center text-xl font-extrabold text-slate-800">
          <span className="px-8">{cyberCardCloser}</span>
        </ReadBox>
        <Panel className="text-left">
          <h3 className="text-xl font-extrabold text-slate-900">
            <span aria-hidden>🧑🏾🧒🏽 </span>
            {cyberGrownUps.heading}
          </h3>
          <ul className="mt-3 space-y-1.5 text-base text-slate-700">
            {cyberGrownUps.topics.map((t) => (
              <li key={t} className="flex gap-2">
                <span aria-hidden className="text-emerald-600">
                  •
                </span>
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-base font-bold text-slate-800">{cyberGrownUps.homeworkHeading}:</p>
          <ul className="mt-1 space-y-1.5 text-base text-slate-700">
            {cyberGrownUps.homework.map((h) => (
              <li key={h} className="flex gap-2">
                <span aria-hidden className="text-emerald-600">
                  ✓
                </span>
                {h}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-base font-bold text-slate-800">Try asking:</p>
          <ul className="mt-1 space-y-1 text-base text-slate-700">
            {cyberGrownUps.starters.map((s) => (
              <li key={s}>&ldquo;{s}&rdquo;</li>
            ))}
          </ul>
        </Panel>
        <div className="text-center">
          <BigButton tone="green" onClick={onFinish}>
            🛡️ I am a Cyber Defender!
          </BigButton>
        </div>
      </div>
    );
  }

  const spoken = cyberRoundSpoken(round);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <p className="text-center text-lg font-extrabold text-white">
        <span aria-hidden>{currentCase.emoji} </span>
        Case {caseIndex + 1}: {currentCase.title}
      </p>
      <div
        className="flex items-center justify-center gap-2"
        aria-label={`Question ${roundIndex + 1} of ${currentCase.rounds.length}`}
      >
        {currentCase.rounds.map((_, i) => (
          <span
            key={i}
            className={`h-3 w-10 rounded-full ${
              i < roundIndex ? "bg-emerald-400" : i === roundIndex ? "bg-sky-400" : "bg-white/30"
            }`}
          />
        ))}
      </div>

      <Panel className="text-center">
        {speaker ? (
          <div className="flex justify-center">
            <Avatar look={speaker.look} size={112} label={speaker.name} className="drop-shadow-lg" />
          </div>
        ) : (
          <div aria-hidden className="text-7xl">
            {round.sceneEmoji}
          </div>
        )}
        <p className="mt-3 text-xl font-bold text-slate-700">{round.who}</p>
        {round.says && (
          <p className="mx-auto mt-3 max-w-md break-words rounded-3xl bg-emerald-100 px-6 py-4 text-2xl font-extrabold text-emerald-900">
            &ldquo;{round.says}&rdquo;
          </p>
        )}
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
                    : "border-white bg-white text-slate-800 hover:border-emerald-300"
              } ${solved && !option.correct ? "opacity-40" : ""}`}
            >
              <span aria-hidden className="text-4xl">
                {option.emoji}
              </span>
              <span className="min-w-0 break-words">{option.text}</span>
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
          <p>
            {lastOption.correct ? "✅ " : "🤔 "}
            {lastOption.feedback}
          </p>
          {lastOption.correct && <p className="mt-3 text-lg font-semibold text-slate-800">💡 {round.lesson}</p>}
          <div className="mt-4 flex justify-center">
            <ReadAloud text={cyberFeedbackSpoken(round, lastOption)} />
          </div>
        </div>
      )}

      {solved && (
        <div className="text-center">
          <BigButton onClick={next}>
            {roundIndex + 1 < currentCase.rounds.length ? "Next ➡️" : "Close the case ➡️"}
          </BigButton>
        </div>
      )}
    </div>
  );
}
