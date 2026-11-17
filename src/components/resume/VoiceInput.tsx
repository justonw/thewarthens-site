"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// "Talk instead of typing": a mic button that turns speech into text, using the speech recognition built
// into the visitor's browser (Chrome, Edge, and Safari have it; Firefox does not). Where it is missing,
// we point to the microphone on their phone keyboard, which does the same job in any text box.
//
// Phones are the hard case, so this is written defensively: only one listener at a time, a listener that is
// always shut off when the button, the section, or the page goes away, a stop button that always resets even
// when the browser never reports that it stopped, automatic restarts (phones end a session after every pause),
// and a stop after a quiet spell so the microphone is never left on.

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
  abort(): void;
  onresult: ((e: SpeechResultEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

function getCtor(): (new () => Recognition) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

// Phones and tablets. Their browsers handle a long "continuous" session badly (repeated words, sessions that
// never report ending), so there we listen one phrase at a time and start again after each.
function isTouchDevice() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent));
}

const SILENCE_STOP_MS = 25_000;
const MAX_SESSION_MS = 5 * 60_000;
const RESTART_DELAY_MS = 350;
const FORCE_RESET_MS = 1500;

const noSubscribe = () => () => {};
// Read the clock through one helper, so the lint rule about clocks in render does not trip on event handlers.
const clock = () => Date.now();

const BLOCKED = "Microphone access is blocked. Allow it in your browser settings, or tap the microphone on your keyboard instead.";
const STOPPED = "Voice typing stopped. Tap the mic to try again, or tap the microphone on your keyboard instead.";
const UNAVAILABLE = "Voice typing isn't working on this device right now. Tap the microphone on your keyboard instead, it does the same thing.";

export default function VoiceInput({ onText }: { onText: (text: string) => void }) {
  // null on the server and during the first render, so the page and the browser agree.
  const supported = useSyncExternalStore(noSubscribe, () => Boolean(getCtor()), () => null);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState("");

  const recRef = useRef<Recognition | null>(null);
  const wantRef = useRef(false); // the person wants it on (they pressed start and have not pressed stop)
  const mountedRef = useRef(true);
  const onTextRef = useRef(onText);
  const startedAt = useRef(0);
  const lastHeard = useRef(0);
  const quickEnds = useRef(0);
  const lastFinal = useRef({ text: "", at: 0 });
  const timers = useRef<number[]>([]);

  useEffect(() => {
    onTextRef.current = onText;
  });

  function clearTimers() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }

  // Shuts the current listener off for good, without waiting for the browser to say it has finished.
  function kill() {
    const rec = recRef.current;
    recRef.current = null;
    if (!rec) return;
    rec.onresult = null;
    rec.onerror = null;
    rec.onend = null;
    try {
      rec.abort();
    } catch {
      // Already stopped.
    }
  }

  function finish(message = "") {
    wantRef.current = false;
    clearTimers();
    kill();
    if (!mountedRef.current) return;
    setListening(false);
    setInterim("");
    setError(message);
  }

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      // The section went away (or the page is closing): make sure the microphone is released.
      mountedRef.current = false;
      wantRef.current = false;
      clearTimers();
      kill();
    };
  }, []);

  // Phones pause a page's microphone when it goes to the background. Treat that as "stop" so nothing is left half on.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden" && wantRef.current) finish();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function listen() {
    const Ctor = getCtor();
    if (!Ctor || !wantRef.current) return;
    kill();
    const touch = isTouchDevice();
    let rec: Recognition;
    try {
      rec = new Ctor();
    } catch {
      finish(UNAVAILABLE);
      return;
    }
    rec.lang = "en-US";
    rec.continuous = !touch;
    rec.interimResults = true;
    const sessionStart = clock();

    rec.onresult = (e) => {
      if (recRef.current !== rec) return;
      lastHeard.current = clock();
      quickEnds.current = 0;
      let finalText = "";
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interimText += r[0].transcript;
      }
      const text = finalText.trim();
      // Some phone browsers report the same finished phrase twice in a row. Add it once.
      const repeat = text && text === lastFinal.current.text && clock() - lastFinal.current.at < 1500;
      if (text && !repeat) {
        lastFinal.current = { text, at: clock() };
        onTextRef.current(text);
      }
      if (mountedRef.current) setInterim(interimText);
    };

    rec.onerror = (e) => {
      if (recRef.current !== rec) return;
      // These two are normal: nobody spoke for a moment, or we shut it off ourselves. The end handler decides what is next.
      if (e.error === "no-speech" || e.error === "aborted") return;
      if (e.error === "not-allowed" || e.error === "service-not-allowed") return finish(BLOCKED);
      finish(e.error === "audio-capture" ? "We couldn't find a microphone on this device. Tap the microphone on your keyboard instead." : STOPPED);
    };

    rec.onend = () => {
      if (recRef.current !== rec) return;
      recRef.current = null;
      if (!wantRef.current) return finish();
      const now = clock();
      // Ending again and again within a moment of starting means it cannot work here. Stop rather than loop.
      quickEnds.current = now - sessionStart < 700 ? quickEnds.current + 1 : 0;
      if (quickEnds.current >= 3) return finish(UNAVAILABLE);
      if (now - lastHeard.current > SILENCE_STOP_MS || now - startedAt.current > MAX_SESSION_MS) return finish();
      // Phones (and desktop browsers after a long pause) end a session on their own. Carry on listening.
      if (mountedRef.current) setInterim("");
      timers.current.push(window.setTimeout(listen, RESTART_DELAY_MS));
    };

    recRef.current = rec;
    try {
      rec.start();
    } catch {
      finish(STOPPED);
    }
  }

  function start() {
    if (wantRef.current) return;
    setError("");
    wantRef.current = true;
    startedAt.current = clock();
    lastHeard.current = clock();
    quickEnds.current = 0;
    // On a phone the keyboard's own dictation and this would fight over the microphone, so put the keyboard away first.
    if (isTouchDevice()) (document.activeElement as HTMLElement | null)?.blur?.();
    setListening(true);
    listen();
  }

  function stop() {
    wantRef.current = false;
    clearTimers();
    const rec = recRef.current;
    // Let a final phrase come through if one is on its way, but never depend on the browser to say it has stopped.
    if (rec) {
      try {
        rec.stop();
      } catch {
        // Already stopped.
      }
    }
    setListening(false);
    timers.current.push(window.setTimeout(() => kill(), FORCE_RESET_MS));
    setInterim("");
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
        className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
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
