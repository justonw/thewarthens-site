"use client";

import { badgeSpoken, badgeVerse, type SoftSkillId } from "@/lib/career-day";
import ArtIcon from "./ArtIcon";
import { BigButton, Confetti, Panel, ReadAloud, SkillChips } from "./ui";

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
        <div aria-hidden className="relative mx-auto flex h-48 w-48 items-center justify-center">
          <svg viewBox="0 0 200 200" className="cd-spin-slow absolute inset-0 h-full w-full">
            {Array.from({ length: 12 }, (_, i) => (
              <path key={i} d="M100 100 L92 8 L108 8 Z" fill="#FDE047" fillOpacity="0.55" transform={`rotate(${i * 30} 100 100)`} />
            ))}
          </svg>
          <span className="cd-pop relative block h-36 w-36 drop-shadow-[0_10px_16px_rgba(0,0,0,0.25)]">
            <ArtIcon name="medal" className="h-full w-full" />
          </span>
        </div>
        <h2 className="mt-2 text-5xl font-extrabold text-slate-900">Tech Pro Badge</h2>
        <p className="mt-3 text-2xl font-bold text-slate-700">
          You earned {stars} of 3 stars!
        </p>
        <div aria-hidden className="mt-3 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <ArtIcon key={i} name="star" className={`h-14 w-14 ${i < stars ? "cd-pop" : "opacity-25 grayscale"}`} />
          ))}
        </div>

        {skills.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-lg font-bold text-slate-600">Skills you showed:</p>
            <SkillChips skills={skills} />
          </div>
        )}

        <p className="mt-6 rounded-3xl bg-amber-100 p-5 text-2xl font-extrabold text-amber-900">
          🎉 Show this screen to a grown-up and tell them what you learned!
        </p>

        <p className="mt-6 text-base italic text-slate-600">
          &ldquo;{badgeVerse.text}&rdquo; {badgeVerse.ref}
        </p>

        <div className="mt-5 flex justify-center">
          <ReadAloud text={badgeSpoken(stars)} />
        </div>
      </Panel>

      <div className="flex flex-wrap justify-center gap-4">
        {stars < 3 && (
          <BigButton tone="white" onClick={onMore}>
            Pick another world
          </BigButton>
        )}
        <BigButton onClick={onNext}>Next player ➡️</BigButton>
      </div>
    </div>
  );
}
