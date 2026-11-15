"use client";

import { useRef, useState, useSyncExternalStore } from "react";

// "Talk instead of typing": a mic button that turns speech into text, using the speech recognition built
// into the visitor's browser (Chrome, Edge, and Safari have it; Firefox does not). Where it is missing,
// we point to the microphone on their phone keyboard, which does the same job in any text box.

type SpeechResultEvent = {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
};
type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechResultEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

function getCtor(): (new () => Recognition) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const noSubscribe = () => () => {};

export default function VoiceInput({ onText }: { onText: (text: string) => void }) {
  // null on the server and during the first render, so the page and the browser agree.
  const supported = useSyncExternalStore(noSubscribe, () => Boolean(getCtor()), () => null);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState("");
  const recRef = useRef<Recognition | null>(null);

  function start() {
    const Ctor = getCtor();
    if (!Ctor) return;
    setError("");
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let finalText = "";
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interimText += r[0].transcript;
      }
      if (finalText.trim()) onText(finalText.trim());
      setInterim(interimText);
    };
    rec.onerror = (e) => {
      setError(
        e.error === "not-allowed" || e.error === "service-not-allowed"
          ? "Microphone access is blocked. Allow it in your browser, or use the microphone on your keyboard."
          : "Voice typing stopped. Tap the mic to try again, or use the microphone on your keyboard."
      );
      setListening(false);
    };
    rec.onend = () => {
      setListening(false);
      setInterim("");
    };
    recRef.current = rec;
    rec.start();
    setListening(true);
  }

  function stop() {
    recRef.current?.stop();
  }

  if (supported === null) return null;
  if (!supported) {
    return <p className="text-xs text-foreground-muted">Tip: tap the microphone on your keyboard to talk instead of typing.</p>;
  }

  return (
    <div>
      <button
        type="button"
        onClick={listening ? stop : start}
        aria-pressed={listening}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
          listening ? "border-red-500/50 bg-red-500/10 text-red-700" : "border-border-subtle bg-background hover:border-blue-500/40"
        }`}
      >
        {listening ? (
          <span className="relative flex h-2.5 w-2.5">
            <span className="rb-ping absolute inline-flex h-full w-full rounded-full bg-red-500" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0014 0M12 18v3" />
          </svg>
        )}
        {listening ? "Listening. Tap to stop" : "Talk instead of typing"}
      </button>
      {listening && interim && <p className="mt-2 text-xs italic text-foreground-muted">{interim}</p>}
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-700">
          {error}
        </p>
      )}
      <p className="mt-2 text-xs text-foreground-muted">Voice typing uses your browser&apos;s speech service. You can fix any words afterward.</p>
    </div>
  );
}
