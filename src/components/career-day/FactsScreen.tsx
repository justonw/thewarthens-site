"use client";

import { useEffect, useState } from "react";
import type { CoolFact, FactGroup } from "@/lib/career-day";
import type { FactCheck } from "@/lib/play-facts";
import { factCheckAnswerSpoken, factCheckSpoken } from "@/lib/play-facts";
import { factsContent } from "@/lib/play-content";
import type { BandId } from "@/lib/play-worlds";
import { usePlay } from "./PlayShell";
import { BigButton, Confetti, Panel, ReadAloud } from "./ui";

// Each group gets its own color so the cards feel like a collection.
const tileTones = [
  "from-sky-400 to-blue-600",
  "from-rose-400 to-pink-600",
  "from-amber-400 to-orange-600",
  "from-emerald-400 to-teal-600",
  "from-violet-400 to-purple-600",
  "from-cyan-400 to-sky-600",
  "from-lime-400 to-green-600",
  "from-fuchsia-400 to-pink-600",
  "from-orange-400 to-red-500",
  "from-teal-400 to-emerald-600",
  "from-indigo-400 to-blue-700",
  "from-yellow-400 to-amber-600",
];

const ranks = [
  { min: 0, emoji: "🔍", name: "Curious Kid" },
  { min: 0.25, emoji: "🧐", name: "Fact Finder" },
  { min: 0.5, emoji: "🏹", name: "Fact Hunter" },
  { min: 0.75, emoji: "🧠", name: "Fact Genius" },
  { min: 1, emoji: "👑", name: "Fact Master" },
];

const rankFor = (share: number) => [...ranks].reverse().find((r) => share >= r.min) ?? ranks[0];

function FactCard({
  fact,
  open,
  onToggle,
}: {
  fact: CoolFact;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      id={`fact-${fact.id}`}
      className={`scroll-mt-24 rounded-3xl border-4 p-5 text-left shadow-md transition ${
        open ? "border-amber-300 bg-amber-50" : "border-white bg-white"
      }`}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-start gap-4 text-left active:scale-[0.99]"
      >
        <span
          aria-hidden
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 text-4xl"
        >
          {fact.emoji}
        </span>
        <span className="flex-1">
          <span className="block text-xl font-extrabold text-slate-900">{fact.hook}</span>
          {!open && (
            <span className="mt-2 inline-block rounded-full bg-sky-100 px-4 py-1 text-base font-bold text-sky-800">
              👆 Tap to see
            </span>
          )}
        </span>
      </button>
      {open && (
        <div className="cd-pop mt-3">
          <p className="text-lg font-semibold leading-relaxed text-slate-800">{fact.answer}</p>
          <div className="mt-3">
            <ReadAloud text={`${fact.hook} ${fact.answer}`} />
          </div>
        </div>
      )}
    </div>
  );
}

function GroupTile({
  group,
  found,
  tone,
  onOpen,
}: {
  group: FactGroup;
  found: number;
  tone: string;
  onOpen: () => void;
}) {
  const total = group.facts.length;
  const complete = found === total;
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${tone} p-4 text-left text-white shadow-lg ring-4 transition active:scale-[0.97] ${
        complete ? "ring-amber-300" : "ring-white/60"
      }`}
    >
      <span aria-hidden className="pointer-events-none absolute -right-3 -top-3 text-7xl opacity-25">
        {group.emoji}
      </span>
      <span aria-hidden className="block text-5xl drop-shadow">
        {group.emoji}
      </span>
      <span className="mt-2 block text-lg font-extrabold leading-tight">{group.title}</span>
      <span className="block text-sm font-semibold text-white/90">{group.blurb}</span>
      <span className="mt-3 flex items-center gap-2" aria-label={`${found} of ${total} found`}>
        <span aria-hidden className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/25">
          <span
            className="block h-full rounded-full bg-white transition-all"
            style={{ width: `${(found / total) * 100}%` }}
          />
        </span>
        <span className="text-sm font-extrabold">{complete ? "⭐ All!" : `${found}/${total}`}</span>
      </span>
    </button>
  );
}

function FactGame({
  checks,
  intro,
  onExit,
}: {
  checks: FactCheck[];
  intro: string;
  onExit: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const done = index >= checks.length;
  const current = checks[index];

  if (done) {
    const share = score / checks.length;
    return (
      <Panel className="cd-pop text-center">
        <Confetti />
        <div aria-hidden className="text-7xl">
          {share >= 0.8 ? "🏆" : share >= 0.5 ? "🎉" : "💪"}
        </div>
        <h3 className="mt-3 text-3xl font-extrabold text-slate-900">
          You got {score} of {checks.length}!
        </h3>
        <p className="mt-2 text-xl text-slate-700">
          {share >= 0.8
            ? "You are a super fact checker!"
            : share >= 0.5
              ? "Great job! Try again to get them all."
              : "Good try! Open more Cool Facts, then play again."}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <BigButton
            tone="green"
            onClick={() => {
              setIndex(0);
              setPicked(null);
              setScore(0);
            }}
          >
            🔁 Play again
          </BigButton>
          <BigButton tone="white" onClick={onExit}>
            🤯 Back to Cool Facts
          </BigButton>
        </div>
      </Panel>
    );
  }

  const answer = (said: boolean) => {
    if (picked !== null) return;
    setPicked(said);
    if (said === current.isTrue) setScore((n) => n + 1);
  };
  const right = picked !== null && picked === current.isTrue;

  return (
    <Panel className="text-center">
      <p className="text-base font-extrabold text-indigo-700">
        {index + 1} of {checks.length}
      </p>
      {index === 0 && picked === null && (
        <p className="mt-1 text-lg font-bold text-slate-600">{intro}</p>
      )}
      <div aria-hidden className="mt-3 text-7xl">
        {current.emoji}
      </div>
      <h3 className="mx-auto mt-3 max-w-xl text-2xl font-extrabold leading-snug text-slate-900">
        {current.statement}
      </h3>
      <div className="mt-3 flex justify-center">
        <ReadAloud text={factCheckSpoken(current)} />
      </div>

      <div className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-3">
        {[
          { said: true, label: "✅ True", tone: "border-emerald-700 bg-emerald-500 text-white" },
          { said: false, label: "🎭 Made up", tone: "border-fuchsia-800 bg-fuchsia-500 text-white" },
        ].map((b) => (
          <button
            key={String(b.said)}
            type="button"
            disabled={picked !== null}
            onClick={() => answer(b.said)}
            className={`min-h-20 rounded-2xl border-b-[6px] text-xl font-extrabold shadow-lg transition active:translate-y-1 active:border-b-2 disabled:cursor-default ${b.tone} ${
              picked !== null && b.said !== current.isTrue ? "opacity-40" : ""
            } ${picked === b.said ? "ring-4 ring-amber-300" : ""}`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {picked !== null && (
        <div
          role="status"
          className={`cd-pop mx-auto mt-5 max-w-xl rounded-3xl p-4 text-left ${
            right ? "bg-emerald-100" : "bg-amber-100"
          }`}
        >
          <p className="text-xl font-extrabold text-slate-900">
            {right ? "🎉 You got it!" : "🤔 Not quite!"}
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-800">{current.because}</p>
          <div className="mt-3">
            <ReadAloud text={factCheckAnswerSpoken(current)} />
          </div>
          <div className="mt-4 text-center">
            <BigButton
              tone="blue"
              onClick={() => {
                setIndex((n) => n + 1);
                setPicked(null);
              }}
            >
              {index + 1 === checks.length ? "See my score" : "Next 👉"}
            </BigButton>
          </div>
        </div>
      )}

      <div className="mt-5">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full px-4 py-2 text-base font-bold text-slate-500 underline hover:text-slate-800"
        >
          Back to Cool Facts
        </button>
      </div>
    </Panel>
  );
}

type View = { kind: "home" } | { kind: "group"; id: string } | { kind: "game" };

export default function FactsScreen({ band, onHome }: { band: BandId; onHome: () => void }) {
  const { intro, groups, checks, checksIntro } = factsContent[band];
  const { foundFacts, markFactFound } = usePlay();
  const [view, setView] = useState<View>({ kind: "home" });
  const [openId, setOpenId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);

  const allFacts = groups.flatMap((g) => g.facts);
  const total = allFacts.length;
  const foundCount = allFacts.filter((f) => foundFacts[f.id]).length;
  const rank = rankFor(foundCount / total);
  const nextRank = ranks.find((r) => r.min > foundCount / total);

  // After a surprise, bring the opened card into view.
  useEffect(() => {
    if (!focusId) return;
    const id = setTimeout(() => {
      document.getElementById(`fact-${focusId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      setFocusId(null);
    }, 50);
    return () => clearTimeout(id);
  }, [focusId]);

  const openFact = (id: string) => {
    markFactFound(id);
    setOpenId(id);
  };
  const toggleFact = (id: string) => {
    if (openId === id) setOpenId(null);
    else openFact(id);
  };

  const surprise = () => {
    const unseen = groups.flatMap((g) => g.facts.filter((f) => !foundFacts[f.id]).map((f) => ({ g, f })));
    const pool = unseen.length > 0 ? unseen : groups.flatMap((g) => g.facts.map((f) => ({ g, f })));
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setView({ kind: "group", id: pick.g.id });
    openFact(pick.f.id);
    setFocusId(pick.f.id);
  };

  const groupIndex = view.kind === "group" ? groups.findIndex((g) => g.id === view.id) : -1;
  const group = groupIndex >= 0 ? groups[groupIndex] : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Panel className="text-center">
        <div aria-hidden className="text-7xl">
          🤯
        </div>
        <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Cool Facts</h2>
        <p className="mt-3 text-xl leading-relaxed text-slate-700">{intro}</p>
        <div className="mt-4 flex justify-center">
          <ReadAloud text={intro} />
        </div>

        <div className="mt-5 rounded-3xl bg-indigo-50 p-4 text-left">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-extrabold text-indigo-900">
              <span aria-hidden>{rank.emoji} </span>
              {rank.name}
            </p>
            <p className="text-lg font-extrabold text-indigo-900">
              {foundCount} of {total} found
            </p>
          </div>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={foundCount}
            aria-label="Cool Facts found"
            className="mt-2 h-4 overflow-hidden rounded-full bg-indigo-200"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-500 transition-all"
              style={{ width: `${(foundCount / total) * 100}%` }}
            />
          </div>
          {nextRank && (
            <p className="mt-2 text-sm font-bold text-indigo-700">
              Find {Math.max(1, Math.ceil(nextRank.min * total) - foundCount)} more to become a {nextRank.emoji}{" "}
              {nextRank.name}!
            </p>
          )}
        </div>
      </Panel>

      {view.kind === "game" ? (
        <FactGame checks={checks} intro={checksIntro} onExit={() => setView({ kind: "home" })} />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={surprise}
              className="flex min-h-20 items-center justify-center gap-3 rounded-3xl border-b-[6px] border-amber-700 bg-amber-400 px-5 py-4 text-xl font-extrabold text-slate-900 shadow-lg transition hover:bg-amber-300 active:translate-y-1 active:border-b-2"
            >
              <span aria-hidden className="text-3xl">
                🎲
              </span>
              Surprise me!
            </button>
            <button
              type="button"
              onClick={() => setView({ kind: "game" })}
              className="flex min-h-20 items-center justify-center gap-3 rounded-3xl border-b-[6px] border-fuchsia-800 bg-fuchsia-500 px-5 py-4 text-xl font-extrabold text-white shadow-lg transition hover:bg-fuchsia-400 active:translate-y-1 active:border-b-2"
            >
              <span aria-hidden className="text-3xl">
                🕵️
              </span>
              True or Made Up?
            </button>
          </div>

          {group ? (
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setView({ kind: "home" });
                    setOpenId(null);
                  }}
                  className="min-h-12 rounded-2xl bg-white/15 px-4 py-2 text-base font-extrabold text-white ring-1 ring-white/30 transition hover:bg-white/25 active:scale-95"
                >
                  ⬅️ All groups
                </button>
                <h3 className="text-right text-2xl font-extrabold text-white">
                  <span aria-hidden>{group.emoji} </span>
                  {group.title}
                </h3>
              </div>
              <p className="text-center text-base font-semibold text-indigo-200">{group.blurb}</p>
              {group.facts.map((fact) => (
                <FactCard
                  key={fact.id}
                  fact={fact}
                  open={openId === fact.id}
                  onToggle={() => toggleFact(fact.id)}
                />
              ))}
              {groupIndex < groups.length - 1 && (
                <div className="text-center">
                  <BigButton
                    tone="white"
                    onClick={() => {
                      setView({ kind: "group", id: groups[groupIndex + 1].id });
                      setOpenId(null);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Next group: {groups[groupIndex + 1].emoji} {groups[groupIndex + 1].title} 👉
                  </BigButton>
                </div>
              )}
            </section>
          ) : (
            <section>
              <h3 className="mb-3 text-center text-2xl font-extrabold text-white">Pick a group</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {groups.map((g, i) => (
                  <GroupTile
                    key={g.id}
                    group={g}
                    tone={tileTones[i % tileTones.length]}
                    found={g.facts.filter((f) => foundFacts[f.id]).length}
                    onOpen={() => {
                      setView({ kind: "group", id: g.id });
                      setOpenId(null);
                    }}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <div className="text-center">
        <BigButton onClick={onHome}>🗺️ Back to the map</BigButton>
      </div>
    </div>
  );
}
