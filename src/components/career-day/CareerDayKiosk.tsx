"use client";

import { useCallback, useEffect, useState } from "react";
import { homeIntro, missions, type MissionId, type SoftSkillId } from "@/lib/career-day";
import BadgeScreen from "./BadgeScreen";
import CreatorMission from "./CreatorMission";
import FactsScreen from "./FactsScreen";
import HelperMission from "./HelperMission";
import GiftMission from "./GiftMission";
import { stopSpeech } from "./speech";
import { AutoReadContext, BigButton, ReadAloud } from "./ui";

type Screen = "home" | MissionId | "badge" | "facts";
type DoneMap = Record<MissionId, boolean>;

const emptyDone: DoneMap = { helper: false, creator: false, gift: false };

// If nobody touches the screen, go back to the start so the next child gets a fresh one.
const IDLE_MS = 120_000;
const IDLE_BADGE_MS = 60_000;

export default function CareerDayKiosk() {
  const [screen, setScreen] = useState<Screen>("home");
  const [done, setDone] = useState<DoneMap>(emptyDone);
  const [skills, setSkills] = useState<SoftSkillId[]>([]);
  const [runKey, setRunKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  // A setting for the device, not information about a child, so it survives "Start over".
  const [autoRead, setAutoRead] = useState(true);

  const stars = Object.values(done).filter(Boolean).length;

  const resetAll = useCallback(() => {
    stopSpeech();
    setDone(emptyDone);
    setSkills([]);
    setToast(null);
    setScreen("home");
    setRunKey((k) => k + 1);
  }, []);

  const toggleAutoRead = useCallback(() => {
    stopSpeech();
    setAutoRead((on) => !on);
  }, []);

  const goHome = useCallback(() => {
    stopSpeech();
    setScreen("home");
  }, []);

  function finishMission(id: MissionId, earnedSkills: SoftSkillId[] = []) {
    const nextDone = { ...done, [id]: true };
    setDone(nextDone);
    if (earnedSkills.length > 0) {
      setSkills((s) => Array.from(new Set([...s, ...earnedSkills])));
    }
    if (Object.values(nextDone).every(Boolean)) {
      setScreen("badge");
    } else {
      setToast("⭐ Star earned! Try another mission or get your badge.");
      setScreen("home");
    }
  }

  // Back to the top whenever the screen changes.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    stopSpeech();
  }, [screen]);

  // Hide the "star earned" message after a moment.
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  // Kiosk behavior: reset after a stretch with no touches.
  useEffect(() => {
    if (screen === "home" && stars === 0) return;
    const limit = screen === "badge" ? IDLE_BADGE_MS : IDLE_MS;
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
  }, [screen, stars, resetAll]);

  return (
    <AutoReadContext.Provider value={autoRead}>
    <div className="min-h-dvh bg-gradient-to-b from-sky-100 via-white to-amber-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={goHome}
            className="min-h-12 whitespace-nowrap rounded-full bg-sky-100 px-4 py-2 text-sm font-extrabold text-sky-900 transition hover:bg-sky-200 active:scale-95 sm:px-5 sm:text-base"
          >
            🏠 Home
          </button>
          <div aria-label={`${stars} of 3 stars`} className="text-3xl">
            {[0, 1, 2].map((i) => (
              <span key={i} className={i < stars ? "" : "opacity-25 grayscale"}>
                ⭐
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={toggleAutoRead}
            aria-pressed={autoRead}
            aria-label={autoRead ? "Voice is on. Tap to turn it off." : "Voice is off. Tap to turn it on."}
            className={`min-h-12 min-w-12 rounded-full px-3 py-2 text-xl font-bold shadow transition active:scale-95 ${
              autoRead ? "bg-sky-500 text-white hover:bg-sky-600" : "bg-white text-slate-500 hover:bg-slate-50"
            }`}
          >
            <span aria-hidden>{autoRead ? "🔊" : "🔇"}</span>
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="min-h-12 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow transition hover:bg-slate-50 active:scale-95 sm:px-5 sm:text-base"
          >
            🔄 Start over
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:pt-10">
        {toast && (
          <div
            role="status"
            className="cd-pop mx-auto mb-5 max-w-2xl rounded-3xl bg-emerald-100 px-5 py-4 text-center text-xl font-extrabold text-emerald-900"
          >
            {toast}
          </div>
        )}

        {screen === "home" && (
          <div className="text-center">
            <div aria-hidden className="cd-float text-7xl">
              👩🏾‍💻 👨🏾‍💻
            </div>
            <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Tech Journey Jr.
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-2xl font-semibold text-slate-700">{homeIntro}</p>
            <div className="mt-4 flex justify-center">
              <ReadAloud text={homeIntro} auto={false} />
            </div>
            <p className="mt-2 text-base font-semibold text-slate-500">
              {autoRead
                ? "The voice is on. Every screen will read itself. Tap 🔊 at the top to turn it off."
                : "The voice is off. Tap 🔇 at the top to turn it on."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {missions.map((m) => (
                <div
                  key={m.id}
                  className="relative flex flex-col items-center gap-2 rounded-[2rem] border-4 border-white bg-white p-6 pt-10 text-center shadow-xl shadow-slate-900/10"
                >
                  {done[m.id] && (
                    <span className="absolute right-4 top-4 rounded-full bg-emerald-100 px-3 py-1 text-sm font-extrabold text-emerald-800">
                      ✅ Done
                    </span>
                  )}
                  <span aria-hidden className="text-7xl">
                    {m.emoji}
                  </span>
                  <span className="text-2xl font-extrabold text-slate-900">{m.title}</span>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-800">
                    {m.tag}
                  </span>
                  <span className="mt-1 text-lg font-semibold text-slate-700">{m.about}</span>
                  <div className="mt-2">
                    <ReadAloud text={m.about} auto={false} />
                  </div>
                  <BigButton
                    onClick={() => setScreen(m.id)}
                    className="mt-auto w-full"
                  >
                    {done[m.id] ? "Play again" : "Start"}
                  </BigButton>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setScreen("facts")}
                className="min-h-16 rounded-3xl border-4 border-white bg-white px-8 py-3 text-xl font-extrabold text-slate-800 shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:border-amber-300 active:scale-95"
              >
                🤯 Cool Facts
              </button>
            </div>

            {stars > 0 && (
              <div className="mt-8">
                <BigButton tone="amber" onClick={() => setScreen("badge")}>
                  🏅 Get my badge
                </BigButton>
              </div>
            )}

            <p className="mx-auto mt-12 max-w-md text-sm text-slate-500">
              Made with 💙 by Tech Journey with The Warthens. This page does not collect or save any
              information.
            </p>
          </div>
        )}

        {screen === "helper" && (
          <HelperMission key={`helper-${runKey}`} onFinish={(s) => finishMission("helper", s)} />
        )}
        {screen === "creator" && (
          <CreatorMission key={`creator-${runKey}`} onFinish={() => finishMission("creator")} />
        )}
        {screen === "gift" && (
          <GiftMission key={`gift-${runKey}`} onFinish={() => finishMission("gift")} />
        )}
        {screen === "facts" && <FactsScreen onHome={goHome} />}
        {screen === "badge" && (
          <BadgeScreen stars={stars} skills={skills} onMore={goHome} onNext={resetAll} />
        )}
      </main>
    </div>
    </AutoReadContext.Provider>
  );
}
