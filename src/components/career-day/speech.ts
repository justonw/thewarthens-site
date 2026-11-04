"use client";

import { useCallback, useEffect, useId, useSyncExternalStore } from "react";
import { clipId, clipUrl, speechText } from "@/lib/career-day-audio";
import { hasRecordedClip } from "@/lib/clip-manifest";

// Read-aloud plays a recorded voice clip when there is one. If not, it falls back to the
// browser's built-in speech. Nothing is sent anywhere.

// One audio element is reused for every clip. Phones only let a page play sound after a tap, and
// they treat a fresh element as locked, so the first tap "unlocks" this one with a silent sound.
// After that, clips can start by themselves on later screens.
let currentAudio: HTMLAudioElement | null = null;
let sharedAudio: HTMLAudioElement | null = null;
const SILENT_WAV = "data:audio/wav;base64,UklGRsQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YaAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA";

function unlockAudio() {
  if (typeof Audio === "undefined") return;
  if (!sharedAudio) sharedAudio = new Audio();
  sharedAudio.src = SILENT_WAV;
  sharedAudio.play().catch(() => {});
}

// iPhones also keep the device voice locked until it speaks once as the direct result of a tap.
function unlockSpeech() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const quiet = new SpeechSynthesisUtterance(" ");
  quiet.volume = 0;
  window.speechSynthesis.speak(quiet);
}

// Only one thing is read at a time. This remembers which button or box it is, so that one
// can light up, and so starting a new reading clears the old one.
let activeId: string | null = null;
let readingNumber = 0;
const listeners = new Set<() => void>();
function setActive(id: string | null) {
  if (activeId === id) return;
  activeId = id;
  listeners.forEach((l) => l());
}
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

// Browsers block sound until someone has tapped the page, so automatic reading waits for that.
let userHasTapped = false;
if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", () => (userHasTapped = true), { capture: true, once: true });
  // iPhones only count a finished tap or click (not the first touch) as permission to play sound.
  let unlocked = false;
  const unlock = () => {
    userHasTapped = true;
    if (unlocked) return;
    unlocked = true;
    unlockAudio();
    unlockSpeech();
  };
  for (const type of ["touchend", "click", "keydown"] as const) {
    window.addEventListener(type, unlock, { capture: true, once: true });
  }
}
export const hasUserTapped = () => userHasTapped;

export function stopSpeech() {
  if (currentAudio) {
    currentAudio.onended = null;
    currentAudio.onerror = null;
    currentAudio.pause();
    currentAudio = null;
  }
  if (sharedAudio) {
    sharedAudio.onended = null;
    sharedAudio.onerror = null;
    sharedAudio.pause();
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  setActive(null);
}

// Friendly, natural-sounding US male voices that ship with common devices, best first.
const PREFERRED_VOICES = [
  "Aaron",
  "Evan",
  "Nathan",
  "Guy",
  "Davis",
  "Christopher",
  "Eric",
  "Tom",
  "Alex",
  "Daniel",
  "David",
];

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith("en"));
  const us = voices.filter((v) => v.lang.replace("_", "-") === "en-US");
  const pool = us.length > 0 ? us : voices;
  for (const name of PREFERRED_VOICES) {
    const match = pool.find((v) => v.name.includes(name));
    if (match) return match;
  }
  const male = pool.find((v) => /male/i.test(v.name) && !/female/i.test(v.name));
  if (male) return male;
  // No known male voice: at least avoid the well-known female defaults, so a device that has any
  // other English voice uses that instead.
  return pool.find((v) => !FEMALE_VOICES.test(v.name)) ?? null;
}

const FEMALE_VOICES =
  /samantha|victoria|karen|moira|tessa|fiona|veena|allison|ava|susan|zira|aria|jenny|hazel|libby|sonia|emma|female|siri/i;

// Some browsers load their voice list a moment after the page opens. Wait briefly for it, so the
// first reading does not fall back to the device's default (often a woman's) voice.
function whenVoicesReady(run: () => void) {
  const synth = window.speechSynthesis;
  if (synth.getVoices().length > 0) {
    run();
    return;
  }
  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    synth.removeEventListener("voiceschanged", go);
    run();
  };
  synth.addEventListener("voiceschanged", go);
  window.setTimeout(go, 800);
}

// Browser support never changes while the page is open, so there is nothing to subscribe to.
const subscribeNever = () => () => {};
const detectSupport = () => typeof Audio !== "undefined" || "speechSynthesis" in window;
const serverSupport = () => false;

export function useSpeech() {
  const id = useId();
  const supported = useSyncExternalStore(subscribeNever, detectSupport, serverSupport);
  const speaking = useSyncExternalStore(subscribe, () => activeId === id, () => false);

  useEffect(
    () => () => {
      if (activeId === id) stopSpeech();
    },
    [id]
  );

  const speakWithBrowserVoice = useCallback(
    (text: string, reading: number) => {
      const finish = () => {
        if (reading === readingNumber && activeId === id) setActive(null);
      };
      if (!("speechSynthesis" in window)) {
        finish();
        return;
      }
      const synth = window.speechSynthesis;
      whenVoicesReady(() => {
        if (reading !== readingNumber) return;
        const utterance = new SpeechSynthesisUtterance(speechText(text));
        utterance.lang = "en-US";
        const voice = pickVoice();
        if (voice) utterance.voice = voice;
        utterance.rate = 1;
        utterance.pitch = 0.95;
        utterance.onend = finish;
        utterance.onerror = finish;
        synth.speak(utterance);
      });
    },
    [id]
  );

  const speak = useCallback(
    (text: string, restart = false) => {
      if (speaking && !restart) {
        stopSpeech();
        return;
      }
      stopSpeech();
      const reading = ++readingNumber;
      setActive(id);

      // No recording for this line: speak with the device voice right now, while the tap that
      // asked for it still counts (phones refuse speech that starts a moment later).
      if (typeof Audio === "undefined" || !hasRecordedClip(clipId(text))) {
        speakWithBrowserVoice(text, reading);
        return;
      }
      if (!sharedAudio) sharedAudio = new Audio();
      const audio = sharedAudio;
      currentAudio = audio;
      audio.src = clipUrl(text);
      let fellBack = false;
      const fallBack = () => {
        if (fellBack || reading !== readingNumber) return;
        fellBack = true;
        currentAudio = null;
        speakWithBrowserVoice(text, reading);
      };
      audio.onended = () => {
        currentAudio = null;
        if (reading === readingNumber && activeId === id) setActive(null);
      };
      audio.onerror = fallBack;
      audio.play().catch(fallBack);
    },
    [id, speaking, speakWithBrowserVoice]
  );

  return { supported, speaking, speak };
}
