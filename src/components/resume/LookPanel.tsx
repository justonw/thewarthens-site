"use client";

import { isDefaultLook, DEFAULT_LOOK, type LookOptions } from "@/lib/resume-look";

// "Change how it looks": how the skills are written, how the summary is shaped, and the size. These only change the layout
// of the downloads and the preview. Every word stays as it is (except "first two sentences", which says what it drops), so
// the resume's keywords are never touched. The choice is remembered in this browser for the next resume.

function Choice<T extends string>({ label, value, options, onChange, note }: { label: string; value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; note?: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-foreground-muted" id={`look-${label}`}>
        {label}
      </p>
      <div role="group" aria-labelledby={`look-${label}`} className="mt-1.5 inline-flex max-w-full flex-wrap rounded-3xl border border-border-subtle bg-background-elevated p-1">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={value === o.id}
            onClick={() => onChange(o.id)}
            className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:min-h-9 ${value === o.id ? "bg-foreground text-background" : "text-foreground-muted hover:text-foreground"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {note && <p className="mt-1.5 text-xs text-foreground-muted">{note}</p>}
    </div>
  );
}

// onChange takes an updater, so two quick taps never undo each other.
export default function LookPanel({ value, onChange }: { value: LookOptions; onChange: (update: (cur: LookOptions) => LookOptions) => void }) {
  const custom = !isDefaultLook(value);
  return (
    <details className="group rounded-2xl border border-border-subtle bg-white shadow-sm">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <span>
          <span className="block text-sm font-semibold">Change how it looks</span>
          <span className="block text-xs text-foreground-muted">{custom ? "Customized. Your words stay the same." : "Skills as a list, a shorter summary, smaller type. Your words stay the same."}</span>
        </span>
        <span aria-hidden className="shrink-0 text-lg text-foreground-muted transition-transform group-open:rotate-180">
          ⌄
        </span>
      </summary>
      <div className="space-y-5 border-t border-border-subtle p-4">
        <Choice
          label="Skills"
          value={value.skills}
          onChange={(skills) => onChange((cur) => ({ ...cur, skills }))}
          options={[
            { id: "commas", label: "Commas" },
            { id: "bars", label: "Bars |" },
            { id: "bullets", label: "One per line" },
          ]}
          note={value.skills === "bars" ? "Skills separated by | so each one stands apart." : value.skills === "bullets" ? "Every skill gets its own bullet under its group. This adds length." : "Skills in a line, as written."}
        />
        <Choice
          label="Summary"
          value={value.summary}
          onChange={(summary) => onChange((cur) => ({ ...cur, summary }))}
          options={[
            { id: "paragraph", label: "Paragraph" },
            { id: "bullets", label: "Bullets" },
            { id: "short", label: "First 2 sentences" },
          ]}
          note={value.summary === "short" ? "Keeps the first two sentences and leaves out the rest, so check the key terms you want are in them." : value.summary === "bullets" ? "Each sentence becomes its own bullet." : "The summary as written."}
        />
        <Choice
          label="Size"
          value={value.size}
          onChange={(size) => onChange((cur) => ({ ...cur, size }))}
          options={[
            { id: "standard", label: "Standard" },
            { id: "smaller", label: "Smaller" },
          ]}
          note={value.size === "smaller" ? "Tighter margins and type, to fit more on a page. Still easy to read." : "The size of the template you chose."}
        />
        {custom && (
          <button type="button" onClick={() => onChange(() => DEFAULT_LOOK)} className="inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 underline underline-offset-2 sm:min-h-0">
            Put it back the way it was
          </button>
        )}
      </div>
    </details>
  );
}
