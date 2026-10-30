"use client";

import { useState } from "react";
import { factGroups, factsIntro, type CoolFact } from "@/lib/career-day";
import { BigButton, Panel, ReadAloud } from "./ui";

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
      className={`rounded-3xl border-4 p-5 text-left shadow-md transition ${
        open ? "border-amber-300 bg-amber-50" : "border-white bg-white"
      }`}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-start gap-4 text-left active:scale-[0.99]"
      >
        <span aria-hidden className="text-5xl">
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

export default function FactsScreen({ onHome }: { onHome: () => void }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Panel className="text-center">
        <div aria-hidden className="text-7xl">
          🤯
        </div>
        <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Cool Facts</h2>
        <p className="mt-3 text-xl leading-relaxed text-slate-700">{factsIntro}</p>
        <div className="mt-4 flex justify-center">
          <ReadAloud text={factsIntro} />
        </div>
      </Panel>

      {factGroups.map((group) => (
        <section key={group.id} className="space-y-3">
          <div className="text-center">
            <h3 className="text-2xl font-extrabold text-white">
              <span aria-hidden>{group.emoji} </span>
              {group.title}
            </h3>
            <p className="text-base font-semibold text-indigo-200">{group.blurb}</p>
          </div>
          {group.facts.map((fact) => (
            <FactCard
              key={fact.id}
              fact={fact}
              open={openId === fact.id}
              onToggle={() => setOpenId(openId === fact.id ? null : fact.id)}
            />
          ))}
        </section>
      ))}

      <div className="text-center">
        <BigButton onClick={onHome}>🗺️ Back to the map</BigButton>
      </div>
    </div>
  );
}
