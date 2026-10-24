"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

// Read-aloud uses the browser's built-in speech. Nothing is sent anywhere.
const clean = (text: string) =>
  text
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();

export function stopSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

// Browser support never changes while the page is open, so there is nothing to subscribe to.
const subscribeNever = () => () => {};
const detectSupport = () => "speechSynthesis" in window;
const serverSupport = () => false;

export function useSpeech() {
  const supported = useSyncExternalStore(subscribeNever, detectSupport, serverSupport);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => () => stopSpeech(), []);

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(clean(text));
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1.05;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(utterance);
  }, []);

  return { supported, speaking, speak };
}
