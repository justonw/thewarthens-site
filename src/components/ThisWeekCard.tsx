"use client";

import { useSyncExternalStore } from "react";

// A small win. Three gentle things to do this week, which can be ticked off. Ticks are remembered on this device only.
const KEY = "warthens-this-week-v1";
const items = [
  { id: "step", label: "One step", text: "Give 20 minutes to one thing for your next move: the quiz, your resume, or one video." },
  { id: "person", label: "One person", text: "Text someone who matters to you and tell them one thing you appreciate about them." },
  { id: "question", label: "One question", text: "Ask yourself: what did I do this week that mattered to someone?" },
];

const EVENT = "warthens-this-week-change";
function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
// The saved ticks as text, so equal values compare equal. The server and the first browser render both see "[]".
// Kept here too, so the ticks still work when the browser will not let a page save anything.
let memory = "[]";
function snapshot() {
  try {
    return window.localStorage.getItem(KEY) ?? memory;
  } catch {
    return memory;
  }
}

function save(next: string[]) {
  memory = JSON.stringify(next);
  try {
    window.localStorage.setItem(KEY, memory);
  } catch {
    // Remembering is a convenience.
  }
  window.dispatchEvent(new Event(EVENT));
}

export default function ThisWeekCard() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  let done: string[] = [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) done = parsed.filter((x) => typeof x === "string");
  } catch {
    // Ignore a damaged value.
  }

  function toggle(id: string) {
    const next = done.includes(id) ? done.filter((x) => x !== id) : [...done, id];
    save(next);
  }

  const all = done.length === items.length;
  return (
    <div className="h-full rounded-3xl border border-border-subtle bg-background-elevated p-6 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">A small win</p>
      <h3 className="mt-1 text-xl font-semibold">Three small things for this week</h3>
      <ul className="mt-4 space-y-2">
        {items.map((it) => {
          const on = done.includes(it.id);
          return (
            <li key={it.id}>
              <label className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border p-3 transition-colors ${on ? "border-green-600/30 bg-green-600/5" : "border-border-subtle hover:border-purple-500/40"}`}>
                <input type="checkbox" checked={on} onChange={() => toggle(it.id)} className="mt-1 h-5 w-5 shrink-0 accent-green-600" />
                <span className="text-sm">
                  <span className="font-semibold">{it.label}.</span> <span className={on ? "text-foreground-muted line-through" : "text-foreground-muted"}>{it.text}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      {all ? <p className="mt-3 text-sm font-semibold text-green-800">That counts. You did something that matters.</p> : <p className="mt-3 text-xs text-foreground-muted">Small steps add up. Pick any one.</p>}
    </div>
  );
}
