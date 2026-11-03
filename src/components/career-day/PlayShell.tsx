"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { SoftSkillId } from "@/lib/career-day";
import {
  PLAY_PATH,
  badgePath,
  bandById,
  bandPath,
  bands,
  levelFor,
  starWorldsFor,
  type Band,
  type BandId,
  type World,
} from "@/lib/play-worlds";
import { stopSpeech } from "./speech";
import { SkyDecor } from "./Scenery";
import { AutoReadContext } from "./ui";

// Everything a family's session remembers lives here, in memory only. Nothing is saved or sent.
// It sits above all the world pages, so moving between worlds keeps the stars. Each age group
// keeps its own stars, so a child who tries the other group starts fresh there.

type PlayState = {
  /** The age group being played, or null on the "How old are you?" screen. */
  band: Band | null;
  /** Where "back to the map" goes: this age group's map, or the age picker. */
  mapPath: string;
  done: Record<string, boolean>;
  skills: SoftSkillId[];
  stars: number;
  runKey: number;
  /** Cool Facts this age group has opened, by fact id. */
  foundFacts: Record<string, boolean>;
  markFactFound: (id: string) => void;
  finishWorld: (id: string, earned?: SoftSkillId[]) => void;
  /** For bonus worlds that do not earn a star toward the badge. */
  completeWorld: (id: string, message: string) => void;
  resetAll: () => void;
};

const PlayContext = createContext<PlayState | null>(null);

export function usePlay() {
  const ctx = useContext(PlayContext);
  if (!ctx) throw new Error("usePlay must be used inside PlayShell");
  return ctx;
}

const NO_SKILLS: SoftSkillId[] = [];
const NO_WORLDS: World[] = [];

// The worlds finished in one age group, from the "<age group>:<world>" keys.
const doneInBand = (all: Record<string, boolean>, band: BandId | null): Record<string, boolean> =>
  band
    ? Object.fromEntries(
        Object.keys(all)
          .filter((key) => key.startsWith(`${band}:`))
          .map((key) => [key.slice(band.length + 1), true])
      )
    : {};

// "/techjr/play/ages-5-7/helper" -> "ages-5-7". Anything else (like the age picker) -> null.
const bandIdFromPath = (pathname: string | null): BandId | null => {
  const segment = pathname?.split("/")[3];
  return bands.some((b) => b.id === segment) ? (segment as BandId) : null;
};

// Kiosk mode (for a career day table): add ?kiosk=1 to the address and the game starts over
// by itself when nobody touches the screen. At home it never resets on its own.
const IDLE_MS = 120_000;
const IDLE_BADGE_MS = 60_000;

export default function PlayShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // Keyed "<age group>:<world>" so each age group keeps its own progress.
  const [doneAll, setDoneAll] = useState<Record<string, boolean>>({});
  const [skillsAll, setSkillsAll] = useState<Partial<Record<BandId, SoftSkillId[]>>>({});
  // Cool Facts opened so far, also keyed "<age group>:<fact>".
  const [factsAll, setFactsAll] = useState<Record<string, boolean>>({});
  const [runKey, setRunKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  // Read once when the game opens. It only controls the idle timer, never what is drawn.
  const [kiosk] = useState(
    () => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("kiosk")
  );
  // A setting for the device, not information about a child, so it survives "Start over".
  const [autoRead, setAutoRead] = useState(true);

  const bandId = bandIdFromPath(pathname);
  const band = bandId ? (bandById(bandId) ?? null) : null;
  const starWorlds = bandId ? starWorldsFor(bandId) : NO_WORLDS;
  const done = doneInBand(doneAll, bandId);
  const foundFacts = doneInBand(factsAll, bandId);
  const skills = (bandId && skillsAll[bandId]) || NO_SKILLS;
  const stars = starWorlds.filter((w) => done[w.id]).length;
  const level = levelFor(stars);
  const onBadge = !!bandId && pathname === badgePath(bandId);
  const atPicker = pathname === PLAY_PATH;
  const anyProgress = Object.keys(doneAll).length > 0 || Object.keys(factsAll).length > 0;
  const mapPath = band ? bandPath(band.id) : PLAY_PATH;

  const resetAll = useCallback(() => {
    stopSpeech();
    setDoneAll({});
    setSkillsAll({});
    setFactsAll({});
    setToast(null);
    setRunKey((k) => k + 1);
    router.push(PLAY_PATH);
  }, [router]);

  const finishWorld = (id: string, earned: SoftSkillId[] = []) => {
    if (!bandId) return;
    const nextDone = { ...doneAll, [`${bandId}:${id}`]: true };
    setDoneAll(nextDone);
    if (earned.length > 0) {
      setSkillsAll((all) => ({
        ...all,
        [bandId]: Array.from(new Set([...(all[bandId] ?? []), ...earned])),
      }));
    }
    if (starWorldsFor(bandId).every((w) => nextDone[`${bandId}:${w.id}`])) {
      router.push(badgePath(bandId));
    } else {
      setToast("⭐ Star earned! Pick your next world.");
      router.push(bandPath(bandId));
    }
  };

  const markFactFound = (id: string) => {
    if (!bandId) return;
    setFactsAll((f) => (f[`${bandId}:${id}`] ? f : { ...f, [`${bandId}:${id}`]: true }));
  };

  const completeWorld = (id: string, message: string) => {
    if (!bandId) return;
    setDoneAll((d) => ({ ...d, [`${bandId}:${id}`]: true }));
    setToast(message);
    router.push(bandPath(bandId));
  };

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
    if (!kiosk || (atPicker && !anyProgress)) return;
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
  }, [kiosk, atPicker, onBadge, anyProgress, resetAll]);

  const value = {
    band,
    mapPath,
    done,
    skills,
    stars,
    runKey,
    foundFacts,
    markFactFound,
    finishWorld,
    completeWorld,
    resetAll,
  };

  return (
    <PlayContext.Provider value={value}>
      <AutoReadContext.Provider value={autoRead}>
        <div className="cd-sky relative min-h-dvh overflow-x-clip text-slate-900">
          <div aria-hidden className="cd-stars pointer-events-none absolute inset-0" />
          <SkyDecor />

          <header className="sticky top-0 z-30 border-b border-white/15 bg-indigo-950/70 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-5">
              {band ? (
                <Link
                  href={mapPath}
                  onClick={stopSpeech}
                  className="flex min-h-12 items-center gap-2 whitespace-nowrap rounded-2xl bg-white/10 px-3 py-2 text-base font-extrabold text-white ring-1 ring-white/20 transition hover:bg-white/20 active:scale-95 sm:px-4"
                >
                  <span aria-hidden>🗺️</span>
                  <span className="hidden sm:inline">All worlds</span>
                  <span className="sm:hidden">Map</span>
                </Link>
              ) : (
                <span className="flex min-h-12 items-center gap-2 whitespace-nowrap rounded-2xl px-3 py-2 text-base font-extrabold text-white sm:px-4">
                  <span aria-hidden>🌟</span>
                  Tech Journey Jr.
                </span>
              )}

              <div
                aria-label={band ? `Level ${level.name}, ${stars} of ${starWorlds.length} stars` : undefined}
                className="flex min-w-0 flex-1 items-center justify-center gap-3"
              >
                {band && (
                  <>
                    <span className="hidden items-center gap-1.5 whitespace-nowrap rounded-full bg-white/10 px-3 py-1.5 text-sm font-extrabold text-amber-200 ring-1 ring-white/15 sm:inline-flex">
                      <span aria-hidden>{level.emoji}</span>
                      {level.name}
                    </span>
                    <div className="flex items-center gap-1.5 text-2xl sm:text-3xl" aria-hidden>
                      {starWorlds.map((w) => (
                        <span
                          key={w.id}
                          className={done[w.id] ? "cd-pop drop-shadow-[0_0_10px_rgba(253,224,71,0.9)]" : "opacity-30 grayscale"}
                        >
                          ⭐
                        </span>
                      ))}
                      <span className="ml-1 whitespace-nowrap text-sm font-extrabold text-amber-200 sm:text-base">
                        {stars} of {starWorlds.length}
                      </span>
                    </div>
                  </>
                )}
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
