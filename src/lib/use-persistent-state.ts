"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

// State that is remembered in this browser (localStorage) and stays in sync across components.
// Built on useSyncExternalStore so the server render and the first client render match, and
// the saved value appears right after hydration without a cascading re-render.
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function parse<T>(raw: string | null, fallback: T): T {
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// Pass a stable `initial` (a module-level constant) so the value keeps the same identity.
export function usePersistentState<T>(key: string, initial: T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null
  );
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const value = useMemo(() => parse(raw, initial), [raw, initial]);

  const set = useCallback(
    (next: T | ((previous: T) => T)) => {
      const current = parse(readRaw(key), initial);
      const resolved = typeof next === "function" ? (next as (previous: T) => T)(current) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // Storage can be blocked (private windows). The page still works, just without saving.
      }
      listeners.forEach((listener) => listener());
    },
    [key, initial]
  );

  return [value, set, hydrated] as const;
}
