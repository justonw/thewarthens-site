"use client";

import { badgeVerse, type SoftSkillId } from "@/lib/career-day";
import { BigButton, Confetti, Panel, SkillChips } from "./ui";

export default function BadgeScreen({
  stars,
  skills,
  onMore,
  onNext,
}: {
  stars: number;
  skills: SoftSkillId[];
  onMore: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Confetti />
      <Panel className="cd-pop text-center">
        <div aria-hidden className="text-8xl">
          🏅
        </div>
        <h2 className="mt-2 text-5xl font-extrabold text-slate-900">Tech Pro Badge</h2>
        <p className="mt-3 text-2xl font-bold text-slate-700">
          You earned {stars} of 3 stars!
        </p>
        <div aria-hidden className="mt-2 text-5xl">
          {[0, 1, 2].map((i) => (
            <span key={i} className={i < stars ? "" : "opacity-25 grayscale"}>
              ⭐
            </span>
          ))}
        </div>

        {skills.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-lg font-bold text-slate-600">Skills you showed:</p>
            <SkillChips skills={skills} />
          </div>
        )}

        <p className="mt-6 rounded-3xl bg-amber-100 p-5 text-2xl font-extrabold text-amber-900">
          🎉 Show this screen to Mr. or Mrs. Warthen for your sticker!
        </p>

        <p className="mt-6 text-base italic text-slate-600">
          &ldquo;{badgeVerse.text}&rdquo; {badgeVerse.ref}
        </p>
      </Panel>

      <div className="flex flex-wrap justify-center gap-4">
        {stars < 3 && (
          <BigButton tone="white" onClick={onMore}>
            Do another mission
          </BigButton>
        )}
        <BigButton onClick={onNext}>Next player ➡️</BigButton>
      </div>
    </div>
  );
}
