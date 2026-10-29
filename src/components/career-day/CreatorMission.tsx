"use client";

import { useState } from "react";
import {
  audienceLine,
  audiences,
  creatorCard,
  creatorIntro,
  creatorSafety,
  lookPrompt,
  namePrompt,
  powerPrompt,
  superpowers,
  whoPrompt,
  type Superpower,
} from "@/lib/career-day";
import {
  avatarHairColors,
  avatarSkins,
  defaultLook,
  hairStylesFor,
  type AvatarGender,
  type AvatarLook,
} from "@/lib/career-avatar";
import Avatar from "./Avatar";
import { BigButton, CareerCard, Confetti, Panel, ReadAloud } from "./ui";

type Step = "intro" | "power" | "who" | "look" | "name" | "poster" | "card";

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
  multi,
}: {
  emoji: string;
  label: string;
  onClick: () => void;
  selected?: boolean;
  multi?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={multi ? selected : undefined}
      className={`relative flex min-h-32 flex-col items-center justify-center gap-2 rounded-3xl border-4 p-4 text-center shadow-md transition active:scale-95 ${
        selected
          ? "border-blue-500 bg-blue-50"
          : "border-white bg-white hover:border-blue-300"
      }`}
    >
      {multi && selected && (
        <span
          aria-hidden
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-lg font-extrabold text-white"
        >
          ✓
        </span>
      )}
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
  const [audienceIds, setAudienceIds] = useState<string[]>([]);
  const [look, setLook] = useState<AvatarLook>(defaultLook);
  const [name, setName] = useState("");
  const [show, setShow] = useState<string | null>(null);

  const allPicked = audienceIds.length === audiences.length;
  const audienceText = audienceLine(audienceIds);

  function toggleAudience(id: string) {
    setAudienceIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }

  function chooseGender(gender: AvatarGender) {
    if (gender === look.gender) return;
    setLook((l) => ({ ...l, gender, hair: hairStylesFor(gender)[0].id }));
  }
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
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <Panel className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">1. What are you really good at?</h2>
          <p className="mt-1 text-lg text-slate-600">Tap one.</p>
          <div className="mt-3 flex justify-center">
            <ReadAloud text={powerPrompt} />
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
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <Panel className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">2. Who is your show for?</h2>
          <p className="mt-1 text-lg text-slate-600">Tap all that fit.</p>
          <div className="mt-3 flex justify-center">
            <ReadAloud text={whoPrompt} />
          </div>
        </Panel>
        <div className="grid grid-cols-2 gap-3">
          {audiences.map((a) => (
            <ChoiceTile
              key={a.id}
              emoji={a.emoji}
              label={a.label}
              multi
              selected={audienceIds.includes(a.id)}
              onClick={() => toggleAudience(a.id)}
            />
          ))}
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            aria-pressed={allPicked}
            onClick={() => setAudienceIds(allPicked ? [] : audiences.map((a) => a.id))}
            className={`min-h-14 rounded-full border-4 px-6 py-2 text-lg font-extrabold transition active:scale-95 ${
              allPicked
                ? "border-blue-500 bg-blue-50 text-blue-900"
                : "border-white bg-white text-slate-700 hover:border-blue-300"
            }`}
          >
            {allPicked ? "✅ Everyone!" : "🙌 Select all"}
          </button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <BackButton onClick={() => setStep("power")} />
          <BigButton disabled={audienceIds.length === 0} onClick={() => setStep("look")}>
            Next ➡️
          </BigButton>
        </div>
      </div>
    );
  }

  if (step === "look") {
    const styles = hairStylesFor(look.gender);
    const pick = (selected: boolean) =>
      `rounded-3xl border-4 transition active:scale-95 ${
        selected ? "border-blue-500 bg-blue-50" : "border-white bg-white hover:border-blue-300"
      }`;
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <Panel className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">3. Make your character</h2>
          <div className="mt-3 flex justify-center">
            <ReadAloud text={lookPrompt} />
          </div>
          <div className="cd-pop mt-5 flex justify-center">
            <Avatar look={look} size={168} label="Your character" className="drop-shadow-lg" />
          </div>
        </Panel>

        <Panel>
          <p className="text-center text-lg font-bold text-slate-700">I am a</p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {(["boy", "girl"] as const).map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={look.gender === g}
                onClick={() => chooseGender(g)}
                className={`flex min-h-24 items-center justify-center gap-3 p-2 ${pick(look.gender === g)}`}
              >
                <Avatar
                  look={{ ...look, gender: g, hair: hairStylesFor(g)[0].id }}
                  size={64}
                />
                <span className="text-xl font-extrabold capitalize text-slate-800">{g}</span>
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-lg font-bold text-slate-700">My skin</p>
          <div className="mx-auto mt-2 grid max-w-md grid-cols-6 justify-items-center gap-2">
            {avatarSkins.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-label={t.label}
                aria-pressed={look.skin === t.id}
                onClick={() => setLook((l) => ({ ...l, skin: t.id }))}
                className={`aspect-square w-full max-w-14 rounded-full border-4 transition active:scale-95 ${
                  look.skin === t.id ? "border-blue-500 ring-4 ring-blue-200" : "border-white"
                }`}
                style={{ backgroundColor: t.hex }}
              />
            ))}
          </div>

          <p className="mt-6 text-center text-lg font-bold text-slate-700">My hair</p>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {styles.map((h) => (
              <button
                key={h.id}
                type="button"
                aria-pressed={look.hair === h.id}
                onClick={() => setLook((l) => ({ ...l, hair: h.id }))}
                className={`flex flex-col items-center gap-1 p-2 ${pick(look.hair === h.id)}`}
              >
                <Avatar look={{ ...look, hair: h.id }} size={84} />
                <span className="text-base font-extrabold text-slate-800">{h.label}</span>
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-lg font-bold text-slate-700">My hair color</p>
          <div className="mx-auto mt-2 grid max-w-md grid-cols-5 justify-items-center gap-2">
            {avatarHairColors.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-label={c.label}
                aria-pressed={look.hairColor === c.id}
                onClick={() => setLook((l) => ({ ...l, hairColor: c.id }))}
                className={`aspect-square w-full max-w-14 rounded-full border-4 transition active:scale-95 ${
                  look.hairColor === c.id ? "border-blue-500 ring-4 ring-blue-200" : "border-white"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </Panel>

        <div className="flex items-center justify-between gap-3">
          <BackButton onClick={() => setStep("who")} />
          <BigButton onClick={() => setStep("name")}>Next ➡️</BigButton>
        </div>
      </div>
    );
  }

  if (step === "name" && power && audienceIds.length > 0) {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <Panel className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">4. Name your show</h2>
          <div className="mt-3 flex justify-center">
            <ReadAloud text={namePrompt} />
          </div>
          <div className="mt-4 flex justify-center">
            <Avatar look={look} size={96} />
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
          <BackButton onClick={() => setStep("look")} />
          <BigButton disabled={!selectedShow} onClick={() => setStep("poster")}>
            Make my poster ✨
          </BigButton>
        </div>
      </div>
    );
  }

  if (step === "poster" && power && audienceIds.length > 0 && selectedShow) {
    const who = cleanName || "a future creator";
    const pitch = `Hi, I'm ${who}! On my show, I help ${audienceText} with ${power.topic}.`;
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <Confetti />
        <div className="cd-pop rounded-[2.2rem] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 p-1.5 shadow-2xl">
          <div className="rounded-[2rem] bg-white p-6 text-center sm:p-8">
            <div className="flex justify-center">
              <Avatar look={look} size={144} label="Your character" />
            </div>
            <p className="mt-2 text-sm font-extrabold uppercase tracking-[0.25em] text-fuchsia-600">
              Brand new show
            </p>
            <h2 className="mt-1 text-5xl font-extrabold text-slate-900">{selectedShow}</h2>
            <p className="mt-3 text-2xl font-bold text-slate-700">
              Helping {audienceText} with {power.topic}!
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
