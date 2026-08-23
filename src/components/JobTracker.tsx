"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "warthens-job-tracker-v1";

const STATUS_OPTIONS = [
  "Not Yet Applied",
  "Applied",
  "Phone Screen",
  "Interview",
  "Final Round",
  "Offer Received",
  "Rejected",
  "Withdrawn",
] as const;

type Status = (typeof STATUS_OPTIONS)[number];

type Entry = {
  id: string;
  company: string;
  role: string;
  status: Status;
  dateApplied: string;
  notes: string;
};

function loadEntries(): Entry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  } catch {
    return [];
  }
}

const statusColor: Record<Status, string> = {
  "Not Yet Applied": "bg-background-elevated-2 text-foreground-muted",
  Applied: "bg-blue-500/15 text-blue-600",
  "Phone Screen": "bg-blue-500/15 text-blue-600",
  Interview: "bg-amber-500/15 text-amber-600",
  "Final Round": "bg-amber-500/15 text-amber-600",
  "Offer Received": "bg-emerald-500/15 text-emerald-600",
  Rejected: "bg-red-500/10 text-red-600",
  Withdrawn: "bg-background-elevated-2 text-foreground-muted",
};

export default function JobTracker() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setEntries(loadEntries());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, loaded]);

  function addEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;
    const entry: Entry = {
      id: crypto.randomUUID(),
      company: company.trim(),
      role: role.trim(),
      status: "Applied",
      dateApplied: new Date().toISOString().slice(0, 10),
      notes: "",
    };
    setEntries((prev) => [entry, ...prev]);
    setCompany("");
    setRole("");
  }

  function updateStatus(id: string, status: Status) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const counts = STATUS_OPTIONS.reduce<Record<string, number>>((acc, s) => {
    acc[s] = entries.filter((e) => e.status === s).length;
    return acc;
  }, {});

  return (
    <div className="rounded-3xl border border-border-subtle bg-background-elevated p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
        Job Search Tracker
      </p>
      <h3 className="mt-2 text-xl font-semibold sm:text-2xl">
        Track your applications right here
      </h3>
      <p className="mt-3 text-sm text-foreground-muted">
        Saved privately in your browser only. We never see this data, and it
        never leaves your device. Clearing your browser data will clear it
        too, so grab the{" "}
        <a href="#tracker-download" className="font-semibold text-blue-600 hover:text-blue-700">
          downloadable version
        </a>{" "}
        if you want a permanent copy.
      </p>

      <form onSubmit={addEntry} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="flex-1 rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm outline-none focus:border-blue-500/50"
        />
        <input
          type="text"
          placeholder="Role / Title"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="flex-1 rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm outline-none focus:border-blue-500/50"
        />
        <button
          type="submit"
          className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          Add
        </button>
      </form>

      {entries.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {STATUS_OPTIONS.filter((s) => counts[s] > 0).map((s) => (
            <span
              key={s}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[s]}`}
            >
              {s}: {counts[s]}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-2">
        {entries.length === 0 && loaded && (
          <p className="text-sm text-foreground-muted">
            No applications yet. Add your first one above.
          </p>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-background px-5 py-3.5"
          >
            <div>
              <p className="font-medium">{entry.company}</p>
              <p className="text-xs text-foreground-muted">
                {entry.role} · Added {entry.dateApplied}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={entry.status}
                onChange={(e) => updateStatus(entry.id, e.target.value as Status)}
                className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${statusColor[entry.status]}`}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeEntry(entry.id)}
                aria-label={`Remove ${entry.company}`}
                className="-m-3.5 rounded-lg p-3.5 text-foreground-muted transition-colors hover:bg-red-500/10 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
