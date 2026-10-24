"use client";

import { useState } from "react";
import {
  audiences,
  creatorCard,
  creatorIntro,
  creatorSafety,
  defaultSkinTone,
  skinTones,
  superpowers,
  type Audience,
  type Superpower,
} from "@/lib/career-day";
import { BigButton, CareerCard, Confetti, Panel, ReadAloud } from "./ui";

type Step = "intro" | "power" | "who" | "name" | "poster" | "card";

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-12 rounded-full bg-white/80 px-5 py-2 text-base font-bold text-slate-600 shadow transition hover:bg-white active:scale-95"
    >
      ⬅️ Back
    </button>
  );
}

function ChoiceTile({
  emoji,
  label,
  onClick,
  selected,
}: {
  emoji: string;
  label: string;
  onClick: () => void;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-32 flex-col items-center justify-center gap-2 rounded-3xl border-4 p-4 text-center shadow-md transition active:scale-95 ${
        selected
          ? "border-blue-500 bg-blue-50"
          : "border-white bg-white hover:border-blue-300"
      }`}
    >
      <span aria-hidden className="text-5xl">
        {emoji}
      </span>
      <span className="text-lg font-extrabold text-slate-800">{label}</span>
    </button>
  );
}

export default function CreatorMission({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState<Step>("intro");
  const [power, setPower] = useState<Superpower | null>(null);
  const [audience, setAudience] = useState<Audience | null>(null);
  const [tone, setTone] = useState<string>(defaultSkinTone);
  const [name, setName] = useState("");
  const [show, setShow] = useState<string | null>(null);

  const avatar = `🧒${tone}`;
  const cleanName = name.trim();
  const nameOptions = power
    ? [...power.showNames, ...(cleanName ? [`${cleanName}'s ${power.label} Show`] : [])]
    : [];
  const selectedShow = show && nameOptions.includes(show) ? show : null;

  if (step === "intro") {
    return (
      <Panel className="mx-auto max-w-2xl text-center">
        <div aria-hidden className="text-7xl">
          🎥
        </div>
        <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Make a Show</h2>
        <p className="mt-4 text-xl leading-relaxed text-slate-700">{creatorIntro}</p>
        <div className="mt-5 flex justify-center">
          <ReadAloud text={creatorIntro} />
        </div>
        <div className="mt-6">
          <BigButton onClick={() => setStep("power")}>Let&apos;s go! 🚀</BigButton>
        </div>
      </Panel>
    );
  }

  if (step === "power") {
    const prompt = "What are you really good at? Tap one.";
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <Panel className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">1. What are you really good at?</h2>
          <p className="mt-1 text-lg text-slate-600">Tap one.</p>
          <div className="mt-3 flex justify-center">
            <ReadAloud text={prompt} />
          </div>
        </Panel>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {superpowers.map((p) => (
            <ChoiceTile
              key={p.id}
              emoji={p.emoji}
              label={p.label}
              selected={power?.id === p.id}
              onClick={() => {
                setPower(p);
                setShow(null);
                setStep("who");
              }}
            />
          ))}
        </div>
        <BackButton onClick={() => setStep("intro")} />
      </div>
    );
  }

  if (step === "who") {
    const prompt = "Who is your show for? Tap one.";
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <Panel className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">2. Who is your show for?</h2>
          <p className="mt-1 text-lg text-slate-600">Tap one.</p>
          <div className="mt-3 flex justify-center">
            <ReadAloud text={prompt} />
          </div>
        </Panel>
        <div className="grid grid-cols-2 gap-3">
          {audiences.map((a) => (
            <ChoiceTile
              key={a.id}
              emoji={a.emoji}
              label={a.label}
              selected={audience?.id === a.id}
              onClick={() => {
                setAudience(a);
                setStep("name");
              }}
            />
          ))}
        </div>
        <BackButton onClick={() => setStep("power")} />
      </div>
    );
  }

  if (step === "name" && power && audience) {
    const prompt = "Pick the one that looks like you. Then pick a name for your show.";
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <Panel className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">3. Name your show</h2>
          <div className="mt-3 flex justify-center">
            <ReadAloud text={prompt} />
          </div>

          <p className="mt-5 text-lg font-bold text-slate-700">Pick the one that looks like you</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {skinTones.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                aria-label={`Choose this look`}
                className={`flex h-20 w-20 items-center justify-center rounded-3xl border-4 text-5xl transition active:scale-95 ${
                  tone === t ? "border-blue-500 bg-blue-50" : "border-white bg-white hover:border-blue-300"
                }`}
              >
                {`🧒${t}`}
              </button>
            ))}
          </div>

          <label className="mt-6 block text-lg font-bold text-slate-700" htmlFor="creator-name">
            Type your first name (if you want)
          </label>
          <input
            id="creator-name"
            type="text"
            value={name}
            maxLength={12}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            onChange={(e) => setName(e.target.value)}
            placeholder="First name"
            className="mx-auto mt-2 block w-full max-w-xs rounded-3xl border-4 border-slate-200 bg-white px-5 py-4 text-center text-2xl font-bold text-slate-900 outline-none focus:border-blue-400"
          />
          <p className="mt-2 text-sm text-slate-500">
            It stays on this screen. It is never saved or sent anywhere.
          </p>
        </Panel>

        <Panel>
          <p className="text-center text-lg font-bold text-slate-700">Pick a name for your show</p>
          <div className="mt-3 grid gap-3">
            {nameOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setShow(option)}
                className={`min-h-16 rounded-3xl border-4 px-5 py-3 text-2xl font-extrabold transition active:scale-[0.98] ${
                  selectedShow === option
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-slate-100 bg-white text-slate-800 hover:border-blue-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </Panel>

        <div className="flex items-center justify-between gap-3">
          <BackButton onClick={() => setStep("who")} />
          <BigButton disabled={!selectedShow} onClick={() => setStep("poster")}>
            Make my poster ✨
          </BigButton>
        </div>
      </div>
    );
  }

  if (step === "poster" && power && audience && selectedShow) {
    const who = cleanName || "a future creator";
    const pitch = `Hi, I'm ${who}! On my show, I help ${audience.phrase} with ${power.topic}.`;
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <Confetti />
        <div className="cd-pop rounded-[2.2rem] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 p-1.5 shadow-2xl">
          <div className="rounded-[2rem] bg-white p-6 text-center sm:p-8">
            <div aria-hidden className="text-8xl">
              {avatar}
            </div>
            <p className="mt-2 text-sm font-extrabold uppercase tracking-[0.25em] text-fuchsia-600">
              Brand new show
            </p>
            <h2 className="mt-1 text-5xl font-extrabold text-slate-900">{selectedShow}</h2>
            <p className="mt-3 text-2xl font-bold text-slate-700">
              Helping {audience.phrase} with {power.topic}!
            </p>
            <div className="mt-5 rounded-3xl bg-slate-50 p-5 text-left">
              <p className="text-lg font-extrabold text-slate-800">
                <span aria-hidden>{power.emoji} </span>
                My first 3 episodes:
              </p>
              <ol className="mt-2 list-decimal space-y-1 pl-6 text-lg font-semibold text-slate-700">
                {power.episodeIdeas.map((idea) => (
                  <li key={idea}>{idea}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <Panel className="text-center">
          <p className="text-xl font-extrabold text-slate-900">🎤 Say it out loud to a grown-up!</p>
          <p className="mt-3 rounded-3xl bg-amber-100 p-5 text-2xl font-bold text-amber-900">
            &ldquo;{pitch}&rdquo;
          </p>
          <p className="mt-3 text-base text-slate-600">
            Real creators practice, show up often, and stay kind and honest.
          </p>
        </Panel>

        <Panel className="bg-sky-50 text-center">
          <p className="text-lg font-extrabold text-sky-900">🛡️ Stay safe</p>
          <p className="mt-1 text-lg font-semibold text-sky-900">{creatorSafety}</p>
        </Panel>

        <div className="text-center">
          <BigButton onClick={() => setStep("card")}>See what it takes ➡️</BigButton>
        </div>
      </div>
    );
  }

  if (step === "card") {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <CareerCard data={creatorCard} />
        <Panel className="text-center">
          <p className="text-xl font-extrabold text-slate-900">Your voice can help someone else&apos;s world get bigger. 🌍</p>
        </Panel>
        <div className="text-center">
          <BigButton tone="amber" onClick={onFinish}>
            ⭐ Earn my star!
          </BigButton>
        </div>
      </div>
    );
  }

  // Fallback if state is ever out of order.
  return (
    <div className="text-center">
      <BigButton onClick={() => setStep("intro")}>Start this mission over</BigButton>
    </div>
  );
}
