"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { clipUrl, speechText } from "@/lib/career-day-audio";

// Read-aloud plays a recorded voice clip when there is one. If not, it falls back to the
// browser's built-in speech. Nothing is sent anywhere.

let currentAudio: HTMLAudioElement | null = null;

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
  const supported = useSyncExternalStore(subscribeNever, detectSupport, serverSupport);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => () => stopSpeech(), []);

  const speakWithBrowserVoice = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) {
      setSpeaking(false);
      return;
    }
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(speechText(text));
    utterance.lang = "en-US";
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synth.speak(utterance);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (speaking) {
        stopSpeech();
        setSpeaking(false);
        return;
      }
      stopSpeech();
      setSpeaking(true);

      if (typeof Audio === "undefined") {
        speakWithBrowserVoice(text);
        return;
      }
      const audio = new Audio(clipUrl(text));
      currentAudio = audio;
      let fellBack = false;
      const fallBack = () => {
        if (fellBack || currentAudio !== audio) return;
        fellBack = true;
        currentAudio = null;
        speakWithBrowserVoice(text);
      };
      audio.onended = () => {
        currentAudio = null;
        setSpeaking(false);
      };
      audio.onerror = fallBack;
      audio.play().catch(fallBack);
    },
    [speaking, speakWithBrowserVoice]
  );

  return { supported, speaking, speak };
}
