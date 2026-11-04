"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  GUIDE_START,
  guideNodes,
  guideWelcome,
  searchGuide,
  searchIndex,
  type GuideChoice,
  type SearchEntry,
} from "@/lib/site-guide";

// The chat bubble in the corner. It asks what a visitor is here for, shows buttons, and takes
// them straight to the right page or section. The buttons are a fixed set of questions. The
// "type what you're looking for" box asks an AI (see /api/guide) to pick from the site's real
// pages, and falls back to a built-in keyword search when the AI is off or does not answer.
// Typed questions go to the AI service to get an answer and are not saved on this site.
//
// It opens by itself on the main landing pages for first-time visitors (once a week at most),
// and never on a page that was reached through a #section link. It shows on every page of the site except the kids'
// game, which is a chrome-free kiosk for children (the guide's typed box sends questions to an AI,
// and the game promises that nothing a child does is sent anywhere). On the coaching page the
// launcher sits above that page's sticky call-to-action bar and never opens by itself.

type Msg = { id: number; from: "bot" | "me"; text: string };

const AUTO_OPEN_PATHS = ["/", "/tech", "/faith", "/techjr"];
// The coaching page has a sticky "book a call" bar, so the launcher sits above it there.
const LIFTED_PREFIXES = ["/tech/coaching"];
const AUTO_OPEN_DELAY_MS = 1200;
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
const STORAGE_KEY = "warthens-guide-seen";
const AGAIN = "Need anything else? Here is the main menu.";
const NO_MATCH =
  "I couldn't find a match for that. Try one of the options below, or email info@thewarthens.com.";

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Only the one email address we use is turned into a link.
function withEmailLink(text: string): ReactNode {
  const parts = text.split("info@thewarthens.com");
  if (parts.length === 1) return text;
  return (
    <>
      {parts[0]}
      <a href="mailto:info@thewarthens.com" className="font-semibold underline underline-offset-2">
        info@thewarthens.com
      </a>
      {parts[1]}
    </>
  );
}

const choiceClass =
  "flex w-full items-center gap-3 rounded-2xl border border-border-subtle bg-background px-3.5 py-3 text-left text-sm font-medium text-foreground transition-colors hover:border-blue-500/50 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-default disabled:opacity-50 disabled:hover:border-border-subtle disabled:hover:bg-background";

export default function SiteGuide() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ id: 0, from: "bot", text: guideWelcome }]);
  const [nodeId, setNodeId] = useState(GUIDE_START);
  const [trail, setTrail] = useState<string[]>([]);
  const [results, setResults] = useState<SearchEntry[] | null>(null);
  const [typing, setTyping] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [query, setQuery] = useState("");

  const nextId = useRef(1);
  const timers = useRef<number[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Focus moves into the box only when the visitor opened it, and back to the button when they close it.
  const openedByVisitor = useRef(false);
  const closedByVisitor = useRef(false);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, reducedMotion() ? 0 : ms));
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const remember = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // Private windows can block storage. The guide still works without it.
    }
  }, []);

  // Open by itself for first-time visitors on the main landing pages.
  useEffect(() => {
    if (!pathname || !AUTO_OPEN_PATHS.includes(pathname)) return;
    if (window.location.hash) return;
    const forced = new URLSearchParams(window.location.search).has("guide");
    let seenAt = 0;
    try {
      seenAt = Number(window.localStorage.getItem(STORAGE_KEY)) || 0;
    } catch {
      // Treat unreadable storage as "not seen yet".
    }
    if (!forced && Date.now() - seenAt < COOLDOWN_MS) return;
    const t = window.setTimeout(() => {
      setOpen(true);
      remember();
    }, AUTO_OPEN_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [pathname, remember]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closedByVisitor.current = true;
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open && openedByVisitor.current) {
      openedByVisitor.current = false;
      panelRef.current?.focus();
    }
    if (!open && closedByVisitor.current) {
      closedByVisitor.current = false;
      launcherRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reducedMotion() ? "auto" : "smooth" });
  }, [messages, typing, results, open]);

  const addMe = (text: string) => setMessages((m) => [...m, { id: nextId.current++, from: "me", text }]);

  const botSay = (text: string, after?: () => void) => {
    setTyping(true);
    later(() => {
      setMessages((m) => [...m, { id: nextId.current++, from: "bot", text }]);
      setTyping(false);
      after?.();
    }, 450);
  };

  const close = () => {
    closedByVisitor.current = true;
    setOpen(false);
  };

  const openByVisitor = () => {
    openedByVisitor.current = true;
    remember();
    setOpen(true);
  };

  // Take the visitor to the page, then tuck the guide away and get it ready for next time.
  const go = (href: string, say: string) => {
    setLeaving(true);
    botSay(say, () =>
      later(() => {
        router.push(href);
        setOpen(false);
        setLeaving(false);
        setNodeId(GUIDE_START);
        setTrail([]);
        setResults(null);
        setMessages([{ id: nextId.current++, from: "bot", text: AGAIN }]);
      }, 600)
    );
  };

  const choose = (choice: GuideChoice) => {
    addMe(`${choice.emoji} ${choice.label}`);
    if (choice.action === "search") {
      setResults(null);
      botSay("Sure. Type what you're looking for below, like “resume” or “kids”.", () =>
        inputRef.current?.focus()
      );
    } else if (choice.next) {
      setTrail((t) => [...t, nodeId]);
      setNodeId(choice.next);
      setResults(null);
      botSay(guideNodes[choice.next].say);
    } else if (choice.href) {
      go(choice.href, choice.say ?? "Taking you there.");
    }
  };

  const goBack = () => {
    const previous = trail[trail.length - 1] ?? GUIDE_START;
    setTrail((t) => t.slice(0, -1));
    setNodeId(previous);
    setResults(null);
    addMe("⬅️ Back");
    botSay(guideNodes[previous].say);
  };

  const mainMenu = () => {
    setTrail([]);
    setNodeId(GUIDE_START);
    setResults(null);
    addMe("🏠 Main menu");
    botSay(guideNodes[GUIDE_START].say);
  };

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    const text = query.trim();
    if (!text || typing || leaving) return;
    setQuery("");
    addMe(text);
    setResults(null);
    setTyping(true);
    void answerQuestion(text);
  };

  // Ask the AI first. If it is off, slow, or fails, use the built-in search so the visitor still
  // gets an answer. With no match at all, the question's own buttons come back so nobody is stuck.
  const answerQuestion = async (text: string) => {
    let reply: string | null = null;
    let found: SearchEntry[] = [];
    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: text }),
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok) {
        const data = (await res.json()) as { reply?: unknown; pages?: unknown };
        if (typeof data.reply === "string") {
          reply = data.reply;
          const hrefs = Array.isArray(data.pages) ? data.pages : [];
          found = hrefs.flatMap((h) => searchIndex.find((e) => e.href === h) ?? []);
        }
      }
    } catch {
      // Fall through to the built-in search.
    }
    if (reply === null) {
      found = searchGuide(text);
      reply = found.length > 0 ? "Here is what I found:" : NO_MATCH;
    }
    const said = reply;
    setTyping(false);
    botSay(said, () => setResults(found.length > 0 ? found : null));
  };

  const node = guideNodes[nodeId];
  const busy = typing || leaving;
  const lifted = !!pathname && LIFTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const inResults = results !== null;

  return (
    <div className="print:hidden">
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Site guide"
          tabIndex={-1}
          style={{ maxHeight: "min(32rem, calc(100dvh - 8rem))" }}
          className={`guide-pop fixed right-3 z-[60] flex w-[calc(100vw-1.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-border-subtle bg-background shadow-2xl shadow-blue-950/25 outline-none sm:right-5 bottom-3 sm:bottom-5`}
        >
          <div className="flex items-center gap-3 bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 px-4 py-3 text-white">
            <Image
              src="/brand/icon-square.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-lg"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight">Site guide</p>
              <p className="text-xs leading-tight text-blue-100">Tell me what you need and I&apos;ll take you there.</p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close the site guide"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg text-white/90 transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span aria-hidden>✕</span>
            </button>
          </div>

          <div
            ref={listRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((m) => (
              <div key={m.id} className={m.from === "me" ? "flex justify-end" : "flex justify-start"}>
                <p
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-snug ${
                    m.from === "me"
                      ? "rounded-br-md bg-blue-600 text-white"
                      : "rounded-bl-md bg-background-elevated text-foreground"
                  }`}
                >
                  {m.from === "bot" ? withEmailLink(m.text) : m.text}
                </p>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start" role="status" aria-label="The guide is typing">
                <span className="flex gap-1 rounded-2xl rounded-bl-md bg-background-elevated px-4 py-3.5" aria-hidden>
                  <span className="guide-dot h-1.5 w-1.5 rounded-full bg-foreground-muted" />
                  <span className="guide-dot h-1.5 w-1.5 rounded-full bg-foreground-muted [animation-delay:150ms]" />
                  <span className="guide-dot h-1.5 w-1.5 rounded-full bg-foreground-muted [animation-delay:300ms]" />
                </span>
              </div>
            )}

            {!busy && (
              <div className="space-y-2 pt-1">
                {inResults
                  ? results.map((r) => (
                      <button
                        key={r.href}
                        type="button"
                        onClick={() => {
                          addMe(r.title);
                          go(r.href, `Opening ${r.title}.`);
                        }}
                        className={`${choiceClass} flex-col items-start gap-0.5`}
                      >
                        <span className="font-semibold">{r.title}</span>
                        <span className="text-xs font-normal text-foreground-muted">{r.blurb}</span>
                      </button>
                    ))
                  : node.choices.map((c) => (
                      <button key={c.label} type="button" onClick={() => choose(c)} className={choiceClass}>
                        <span aria-hidden className="text-lg">
                          {c.emoji}
                        </span>
                        <span>{c.label}</span>
                      </button>
                    ))}
                {(trail.length > 0 || inResults) && (
                  <div className="flex gap-2 pt-1">
                    {trail.length > 0 && !inResults && (
                      <button
                        type="button"
                        onClick={goBack}
                        className="rounded-full border border-border-subtle px-3.5 py-1.5 text-xs font-semibold text-foreground-muted transition-colors hover:border-blue-500/50 hover:text-blue-700"
                      >
                        ⬅️ Back
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={mainMenu}
                      className="rounded-full border border-border-subtle px-3.5 py-1.5 text-xs font-semibold text-foreground-muted transition-colors hover:border-blue-500/50 hover:text-blue-700"
                    >
                      🏠 Main menu
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <form onSubmit={submitSearch} role="search" className="flex gap-2 border-t border-border-subtle bg-background-elevated/60 p-3">
            <label htmlFor="site-guide-search" className="sr-only">
              Search the site
            </label>
            <input
              ref={inputRef}
              id="site-guide-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Or type what you're looking for"
              autoComplete="off"
              enterKeyHint="search"
              maxLength={200}
              className="min-w-0 flex-1 rounded-full border border-border-subtle bg-background px-4 py-2.5 text-base text-foreground placeholder:text-foreground-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 sm:text-sm"
            />
            <button
              type="submit"
              disabled={busy || query.trim() === ""}
              className="shrink-0 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              Go
            </button>
          </form>
          <p className="border-t border-border-subtle bg-background-elevated/60 px-4 pb-2.5 pt-0 text-[11px] leading-snug text-foreground-muted">
            Typed questions are sent to an AI to find the right page. Please don&apos;t include personal details.
          </p>
        </div>
      ) : (
        <button
          ref={launcherRef}
          type="button"
          onClick={openByVisitor}
          className={`fixed right-4 z-[60] inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/25 transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${lifted ? "bottom-24 sm:right-6 sm:bottom-24" : "bottom-4 sm:right-6 sm:bottom-6"}`}
        >
          <span aria-hidden>💬</span>
          Where to start?
        </button>
      )}
    </div>
  );
}
