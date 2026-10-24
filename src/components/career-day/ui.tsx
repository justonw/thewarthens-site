"use client";

import type { ReactNode } from "react";
import type { CareerCardData, SoftSkillId } from "@/lib/career-day";
import { softSkills } from "@/lib/career-day";
import { useSpeech } from "./speech";

const tones = {
  blue: "bg-blue-600 text-white shadow-blue-900/20 hover:bg-blue-700",
  green: "bg-emerald-500 text-white shadow-emerald-900/20 hover:bg-emerald-600",
  amber: "bg-amber-400 text-slate-900 shadow-amber-900/20 hover:bg-amber-500",
  white: "bg-white text-slate-800 shadow-slate-900/10 hover:bg-slate-50",
};

export function BigButton({
  children,
  onClick,
  tone = "blue",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick: () => void;
  tone?: keyof typeof tones;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`min-h-16 rounded-3xl px-8 py-4 text-xl font-extrabold shadow-lg transition active:scale-95 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[2rem] border-4 border-white bg-white/90 p-5 shadow-xl shadow-slate-900/10 sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

export function ReadAloud({ text }: { text: string }) {
  const { supported, speaking, speak } = useSpeech();
  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-label={speaking ? "Stop reading" : "Read this out loud"}
      className="inline-flex min-h-12 items-center gap-2 rounded-full bg-sky-100 px-5 py-2 text-base font-bold text-sky-800 transition hover:bg-sky-200 active:scale-95"
    >
      <span aria-hidden>{speaking ? "⏹️" : "🔊"}</span>
      {speaking ? "Stop" : "Read it to me"}
    </button>
  );
}

const confettiColors = [
  "bg-rose-400",
  "bg-amber-400",
  "bg-emerald-400",
  "bg-sky-400",
  "bg-fuchsia-400",
  "bg-orange-400",
];

export function Confetti() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {Array.from({ length: 36 }).map((_, i) => (
        <span
          key={i}
          className={`cd-confetti absolute top-0 block h-3 w-2 rounded-sm ${confettiColors[i % confettiColors.length]}`}
          style={{
            left: `${(i * 97) % 100}%`,
            animationDelay: `${(i % 9) * 0.18}s`,
            animationDuration: `${2.6 + (i % 5) * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}

export function SkillChips({ skills }: { skills: SoftSkillId[] }) {
  if (skills.length === 0) return null;
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {skills.map((id) => (
        <span
          key={id}
          className="cd-pop inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-base font-bold text-amber-900"
        >
          <span aria-hidden>{softSkills[id].emoji}</span>
          {softSkills[id].label}
        </span>
      ))}
    </div>
  );
}

function CardSection({
  emoji,
  title,
  items,
}: {
  emoji: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl bg-slate-50 p-5">
      <p className="text-lg font-extrabold text-slate-800">
        <span aria-hidden>{emoji} </span>
        {title}
      </p>
      <ul className="mt-2 space-y-1.5 text-base text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden className="text-blue-500">
              •
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CareerCard({ data }: { data: CareerCardData }) {
  return (
    <Panel className="text-left">
      <div className="text-center">
        <div aria-hidden className="text-6xl">
          {data.emoji}
        </div>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900">{data.title}</h2>
        <p className="mt-1 text-lg text-slate-600">{data.tagline}</p>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <CardSection emoji="💬" title="People skills" items={data.soft} />
        <CardSection emoji="🧠" title="Tech skills" items={data.hard} />
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-lg font-extrabold text-slate-800">
            <span aria-hidden>🎓 </span>
            School
          </p>
          <p className="mt-2 text-base text-slate-700">{data.school}</p>
        </div>
        <CardSection emoji="🚪" title="Ways in" items={data.ways} />
      </div>
      {data.honest && (
        <p className="mt-4 rounded-3xl bg-amber-50 p-5 text-base font-semibold text-amber-900">
          <span aria-hidden>💡 </span>
          {data.honest}
        </p>
      )}
    </Panel>
  );
}
