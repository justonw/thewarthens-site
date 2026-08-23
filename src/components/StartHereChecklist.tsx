"use client";

import { useEffect, useState } from "react";
import type { StartHereStep } from "@/lib/start-here";

export default function StartHereChecklist({
  slug,
  steps,
}: {
  slug: string;
  steps: StartHereStep[];
}) {
  const storageKey = `warthens-start-here-${slug}-v1`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked, loaded, storageKey]);

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-background-elevated-2">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${Math.round((doneCount / steps.length) * 100)}%` }}
          />
        </div>
        <p className="shrink-0 text-xs font-semibold text-foreground-muted">
          {doneCount} of {steps.length}
        </p>
      </div>

      <ol className="mt-6 space-y-3">
        {steps.map((step, i) => (
          <li key={step.id}>
            <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-border-subtle bg-background-elevated p-5 transition-colors hover:border-blue-500/30">
              <input
                type="checkbox"
                checked={!!checked[step.id]}
                onChange={() => toggle(step.id)}
                className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
              />
              <span className="flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-blue-600">
                    {i + 1}.
                  </span>
                  <span
                    className={`font-semibold ${checked[step.id] ? "text-foreground-muted line-through" : "text-foreground"}`}
                  >
                    {step.title}
                  </span>
                </span>
                <span className="mt-1.5 block text-sm text-foreground-muted">
                  {step.description}
                </span>
                {step.href && (
                  <a
                    href={step.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {step.linkLabel}
                    <span aria-hidden>→</span>
                  </a>
                )}
              </span>
            </label>
          </li>
        ))}
      </ol>
    </div>
  );
}
