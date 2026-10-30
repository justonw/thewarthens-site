"use client";

import { createContext, useContext, useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import type { CareerCardData, SoftSkillId } from "@/lib/career-day";
import { cardSpoken, softSkills } from "@/lib/career-day";
import { hasUserTapped, useSpeech } from "./speech";

// When on, each screen reads itself aloud as soon as it appears, so a child can go through the
// whole game by tapping alone. The Read it to me button still works either way.
export const AutoReadContext = createContext(false);

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

export function ReadAloud({ text, auto = true }: { text: string; auto?: boolean }) {
  const { supported, speaking, speak } = useSpeech();
  const autoRead = useContext(AutoReadContext);
  const speakRef = useRef(speak);
  useEffect(() => {
    speakRef.current = speak;
  });
  useEffect(() => {
    if (!autoRead || !auto || !hasUserTapped()) return;
    const id = setTimeout(() => speakRef.current(text, true), 400);
    return () => clearTimeout(id);
  }, [autoRead, auto, text]);
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

// A box that reads itself aloud when a child taps it. With the voice on, it also reads when it
// is reached with the keyboard or when the mouse rests on it for a moment.
export function ReadBox({
  text,
  children,
  className = "",
}: {
  text: string;
  children: ReactNode;
  className?: string;
}) {
  const { speaking, speak } = useSpeech();
  const autoRead = useContext(AutoReadContext);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearHover = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };
  useEffect(() => clearHover, []);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={speaking}
      onClick={() => speak(text)}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          speak(text);
        }
      }}
      onFocus={(e) => {
        if (autoRead && hasUserTapped() && e.currentTarget.matches(":focus-visible")) speak(text, true);
      }}
      onPointerEnter={(e) => {
        if (!autoRead || e.pointerType !== "mouse" || !hasUserTapped()) return;
        clearHover();
        hoverTimer.current = setTimeout(() => speak(text, true), 700);
      }}
      onPointerLeave={clearHover}
      className={`relative cursor-pointer rounded-3xl p-5 text-left outline-none transition focus-visible:ring-4 focus-visible:ring-blue-400 ${
        speaking ? "bg-sky-100 ring-4 ring-sky-400" : "bg-slate-50 hover:bg-sky-50"
      } ${className}`}
    >
      <span
        aria-hidden
        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-lg ${
          speaking ? "bg-sky-500 text-white" : "bg-white text-sky-700 shadow"
        }`}
      >
        {speaking ? "⏹️" : "🔊"}
      </span>
      {children}
    </div>
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
  text,
}: {
  emoji: string;
  title: string;
  items: string[];
  text: string;
}) {
  return (
    <ReadBox text={text}>
      <p className="pr-10 text-lg font-extrabold text-slate-800">
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
    </ReadBox>
  );
}

export function CareerCard({ data, lead = "" }: { data: CareerCardData; lead?: string }) {
  return (
    <Panel className="text-left">
      <div className="text-center">
        <div aria-hidden className="text-6xl">
          {data.emoji}
        </div>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900">{data.title}</h2>
        <p className="mt-1 text-lg text-slate-600">{data.tagline}</p>
        <div className="mt-4 flex justify-center">
          <ReadAloud text={cardSpoken.intro(data, lead)} />
        </div>
        <p className="mt-3 text-base font-bold text-sky-800">👆 Tap any box to hear it read out loud.</p>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <CardSection emoji="💬" title="People skills" items={data.soft} text={cardSpoken.soft(data)} />
        <CardSection emoji="🧠" title="Tech skills" items={data.hard} text={cardSpoken.hard(data)} />
        <ReadBox text={cardSpoken.school(data)}>
          <p className="pr-10 text-lg font-extrabold text-slate-800">
            <span aria-hidden>🎓 </span>
            School
          </p>
          <p className="mt-2 text-base text-slate-700">{data.school}</p>
        </ReadBox>
        <CardSection emoji="🚪" title="Ways in" items={data.ways} text={cardSpoken.ways(data)} />
      </div>
      {data.honest && (
        <ReadBox
          text={cardSpoken.honest(data)}
          className="mt-4 !bg-amber-50 text-base font-semibold text-amber-900 hover:!bg-amber-100"
        >
          <span aria-hidden>💡 </span>
          <span className="pr-10">{data.honest}</span>
        </ReadBox>
      )}
    </Panel>
  );
}
