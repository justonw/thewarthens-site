"use client";

import { useCallback, useEffect, useId, useSyncExternalStore } from "react";
import { clipUrl, speechText } from "@/lib/career-day-audio";

// Read-aloud plays a recorded voice clip when there is one. If not, it falls back to the
// browser's built-in speech. Nothing is sent anywhere.

let currentAudio: HTMLAudioElement | null = null;

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
  window.addEventListener("keydown", () => (userHasTapped = true), { capture: true, once: true });
}
export const hasUserTapped = () => userHasTapped;

export function stopSpeech() {
  if (currentAudio) {
    currentAudio.onended = null;
    currentAudio.onerror = null;
    currentAudio.pause();
    currentAudio = null;
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
  return pool.find((v) => /male/i.test(v.name) && !/female/i.test(v.name)) ?? null;
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
      const utterance = new SpeechSynthesisUtterance(speechText(text));
      utterance.lang = "en-US";
      const voice = pickVoice();
      if (voice) utterance.voice = voice;
      utterance.rate = 1;
      utterance.pitch = 0.95;
      utterance.onend = finish;
      utterance.onerror = finish;
      synth.speak(utterance);
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

      if (typeof Audio === "undefined") {
        speakWithBrowserVoice(text, reading);
        return;
      }
      const audio = new Audio(clipUrl(text));
      currentAudio = audio;
      let fellBack = false;
      const fallBack = () => {
        if (fellBack || currentAudio !== audio) return;
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
