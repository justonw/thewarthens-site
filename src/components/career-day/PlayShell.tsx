"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SoftSkillId } from "@/lib/career-day";
import { levelFor, starWorlds } from "@/lib/play-worlds";
import { stopSpeech } from "./speech";
import { AutoReadContext } from "./ui";

// Everything a family's session remembers lives here, in memory only. Nothing is saved or sent.
// It sits above all the world pages, so moving between worlds keeps the stars.

type PlayState = {
  done: Record<string, boolean>;
  skills: SoftSkillId[];
  stars: number;
  runKey: number;
  finishWorld: (id: string, earned?: SoftSkillId[]) => void;
  resetAll: () => void;
};

const PlayContext = createContext<PlayState | null>(null);

export function usePlay() {
  const ctx = useContext(PlayContext);
  if (!ctx) throw new Error("usePlay must be used inside PlayShell");
  return ctx;
}

export const PLAY_PATH = "/techjr/play";

// Kiosk mode (for a career day table): add ?kiosk=1 to the address and the game starts over
// by itself when nobody touches the screen. At home it never resets on its own.
const IDLE_MS = 120_000;
const IDLE_BADGE_MS = 60_000;

export default function PlayShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [skills, setSkills] = useState<SoftSkillId[]>([]);
  const [runKey, setRunKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  // Read once when the game opens. It only controls the idle timer, never what is drawn.
  const [kiosk] = useState(
    () => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("kiosk")
  );
  // A setting for the device, not information about a child, so it survives "Start over".
  const [autoRead, setAutoRead] = useState(true);

  const stars = starWorlds.filter((w) => done[w.id]).length;
  const level = levelFor(stars);
  const onBadge = pathname === `${PLAY_PATH}/badge`;
  const atHome = pathname === PLAY_PATH;

  const resetAll = useCallback(() => {
    stopSpeech();
    setDone({});
    setSkills([]);
    setToast(null);
    setRunKey((k) => k + 1);
    router.push(PLAY_PATH);
  }, [router]);

  const finishWorld = useCallback(
    (id: string, earned: SoftSkillId[] = []) => {
      const nextDone = { ...done, [id]: true };
      setDone(nextDone);
      if (earned.length > 0) setSkills((s) => Array.from(new Set([...s, ...earned])));
      if (starWorlds.every((w) => nextDone[w.id])) {
        router.push(`${PLAY_PATH}/badge`);
      } else {
        setToast("⭐ Star earned! Pick your next world.");
        router.push(PLAY_PATH);
      }
    },
    [done, router]
  );

  // Whenever the page changes, stop any voice that was still talking.
  useEffect(() => {
    stopSpeech();
  }, [pathname]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (!kiosk || (atHome && stars === 0)) return;
    const limit = onBadge ? IDLE_BADGE_MS : IDLE_MS;
    let timer = setTimeout(resetAll, limit);
    const bump = () => {
      clearTimeout(timer);
      timer = setTimeout(resetAll, limit);
    };
    // Touches, typing, and scrolling all count as "still here" (a parent reading a card is not idle).
    window.addEventListener("pointerdown", bump);
    window.addEventListener("keydown", bump);
    window.addEventListener("scroll", bump, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", bump);
      window.removeEventListener("keydown", bump);
      window.removeEventListener("scroll", bump);
    };
  }, [kiosk, atHome, onBadge, stars, resetAll]);

  const value = useMemo(
    () => ({ done, skills, stars, runKey, finishWorld, resetAll }),
    [done, skills, stars, runKey, finishWorld, resetAll]
  );

  return (
    <PlayContext.Provider value={value}>
      <AutoReadContext.Provider value={autoRead}>
        <div className="cd-sky relative min-h-dvh overflow-x-clip text-slate-900">
          <div aria-hidden className="cd-stars pointer-events-none absolute inset-0" />

          <header className="sticky top-0 z-30 border-b border-white/15 bg-indigo-950/70 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-5">
              <Link
                href={PLAY_PATH}
                onClick={stopSpeech}
                className="flex min-h-12 items-center gap-2 whitespace-nowrap rounded-2xl bg-white/10 px-3 py-2 text-base font-extrabold text-white ring-1 ring-white/20 transition hover:bg-white/20 active:scale-95 sm:px-4"
              >
                <span aria-hidden>🗺️</span>
                <span className="hidden sm:inline">All worlds</span>
                <span className="sm:hidden">Map</span>
              </Link>

              <div
                aria-label={`Level ${level.name}, ${stars} of ${starWorlds.length} stars`}
                className="flex min-w-0 flex-1 items-center justify-center gap-3"
              >
                <span className="hidden items-center gap-1.5 whitespace-nowrap rounded-full bg-white/10 px-3 py-1.5 text-sm font-extrabold text-amber-200 ring-1 ring-white/15 sm:inline-flex">
                  <span aria-hidden>{level.emoji}</span>
                  {level.name}
                </span>
                <div className="flex items-center gap-1 text-2xl sm:text-3xl" aria-hidden>
                  {starWorlds.map((w) => (
                    <span
                      key={w.id}
                      className={done[w.id] ? "cd-pop drop-shadow-[0_0_10px_rgba(253,224,71,0.9)]" : "opacity-30 grayscale"}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  setAutoRead((on) => !on);
                }}
                aria-pressed={autoRead}
                aria-label={autoRead ? "Voice is on. Tap to turn it off." : "Voice is off. Tap to turn it on."}
                className={`min-h-12 min-w-12 rounded-2xl px-3 py-2 text-xl font-bold ring-1 transition active:scale-95 ${
                  autoRead
                    ? "bg-sky-400 text-slate-900 ring-sky-200 hover:bg-sky-300"
                    : "bg-white/10 text-white ring-white/20 hover:bg-white/20"
                }`}
              >
                <span aria-hidden>{autoRead ? "🔊" : "🔇"}</span>
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="min-h-12 whitespace-nowrap rounded-2xl bg-white/10 px-3 py-2 text-sm font-bold text-white ring-1 ring-white/20 transition hover:bg-white/20 active:scale-95 sm:px-4 sm:text-base"
              >
                🔄 <span className="hidden sm:inline">Start over</span>
              </button>
            </div>
          </header>

          <main className="relative mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-5 sm:pt-10">
            {toast && (
              <div
                role="status"
                className="cd-pop mx-auto mb-6 max-w-2xl rounded-3xl bg-emerald-300 px-5 py-4 text-center text-xl font-extrabold text-emerald-950 shadow-lg shadow-emerald-400/30"
              >
                {toast}
              </div>
            )}
            {children}
          </main>
        </div>
      </AutoReadContext.Provider>
    </PlayContext.Provider>
  );
}
