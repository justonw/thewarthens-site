"use client";

import { useEffect, useState } from "react";
import { starterChecklist } from "@/lib/starter-checklist";

const STORAGE_KEY = "warthens-starter-checklist-v1";

const totalItems = starterChecklist.reduce((sum, g) => sum + g.items.length, 0);

function loadChecked(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export default function StarterChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setChecked(loadChecked());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked, loaded]);

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleWhy(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function reset() {
    setChecked({});
  }

  const doneCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((doneCount / totalItems) * 100);

  return (
    <div className="rounded-3xl border border-border-subtle bg-background-elevated p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Backed by 2026 Hiring Research
          </p>
          <h3 className="mt-2 text-xl font-semibold sm:text-2xl">
            Beat the AI Resume Scan
          </h3>
        </div>
        {doneCount > 0 && (
          <button
            onClick={reset}
            className="-m-3.5 rounded-lg p-3.5 text-xs font-semibold text-foreground-muted underline decoration-border-subtle underline-offset-4 hover:text-foreground"
          >
            Reset
          </button>
        )}
      </div>
      <p className="mt-3 text-sm text-foreground-muted">
        Most companies now screen resumes with an ATS (Applicant
        Tracking System, software that filters resumes before a person
        reads them), and a growing number add an AI layer on top that
        scores your resume the way an LLM (an AI language model) would.
        This checklist covers what the research says actually gets you
        past that screen and into recruiter searches. Check items off
        as you go, saved privately in your browser.
      </p>

      <div className="mt-5 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-background-elevated-2">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="shrink-0 text-xs font-semibold text-foreground-muted">
          {doneCount} of {totalItems}
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {starterChecklist.map((group) => (
          <div key={group.id}>
            <h4 className="font-semibold">{group.title}</h4>
            <p className="mt-1 text-xs text-foreground-muted">{group.note}</p>
            <ul className="mt-4 space-y-3">
              {group.items.map((item) => (
                <li key={item.id}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border-subtle bg-background p-4 transition-colors hover:border-blue-500/30">
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggle(item.id)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                    />
                    <span className="flex-1">
                      <span className="flex items-start justify-between gap-3">
                        <span
                          className={`text-sm font-medium ${checked[item.id] ? "text-foreground-muted line-through" : "text-foreground"}`}
                        >
                          {item.text}
                        </span>
                        <button
                          onClick={(e) => toggleWhy(e, item.id)}
                          className="-m-3.5 shrink-0 rounded-lg p-3.5 text-xs font-semibold text-blue-600 hover:bg-blue-500/10 hover:text-blue-700"
                        >
                          {expanded[item.id] ? "Hide" : "Why?"}
                        </button>
                      </span>
                      {expanded[item.id] && (
                        <span className="mt-1 block text-xs italic text-foreground-muted">
                          {item.why}
                        </span>
                      )}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-foreground-muted">
        Want this as a printable PDF, plus a job search tracker?{" "}
        <a href="#toolkit" className="font-semibold text-blue-600 hover:text-blue-700">
          Get the job search toolkit ↓
        </a>
      </p>
      <p className="mt-3 text-xs text-foreground-muted">
        Sources: Jobscan ATS usage data, Merit America, Resume.io,
        Kickresume, CareerEnlightenment, Simplify Jobs LinkedIn
        optimization research, all 2026-dated.
      </p>
    </div>
  );
}
