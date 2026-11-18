"use client";

import type { ResumeDoc, ResumeJob } from "@/lib/resume-tailor";
import AutoTextarea from "./AutoTextarea";

// The finished resume as an editable page: click any text to change it.
const mini =
  "w-full min-w-0 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm outline-none hover:border-border-subtle focus:border-blue-500/50 focus:bg-background-elevated";

function Heading({ children }: { children: string }) {
  return (
    <p className="mb-1 mt-5 border-b border-foreground/70 pb-0.5 text-[11px] font-semibold uppercase tracking-wider">{children}</p>
  );
}

export default function ResumeEditor({ doc, onChange }: { doc: ResumeDoc; onChange: (doc: ResumeDoc) => void }) {
  const set = (patch: Partial<ResumeDoc>) => onChange({ ...doc, ...patch });
  const setJob = (i: number, patch: Partial<ResumeJob>) => set({ experience: doc.experience.map((j, k) => (k === i ? { ...j, ...patch } : j)) });

  return (
    <div spellCheck className="rounded-2xl border border-border-subtle bg-background p-4 font-sans text-sm leading-snug sm:p-8">
      <input aria-label="Name" className={`${mini} text-2xl font-semibold`} value={doc.name} onChange={(e) => set({ name: e.target.value })} />
      <input aria-label="Target job title" className={`${mini} text-base`} value={doc.headline} onChange={(e) => set({ headline: e.target.value })} />
      <AutoTextarea
        aria-label="Contact details, separated by vertical bars"
        className={`${mini} text-xs text-foreground-muted`}
        value={doc.contact.join(" | ")}
        onChange={(e) => set({ contact: e.target.value.split("|") })}
      />

      <Heading>Summary</Heading>
      <AutoTextarea aria-label="Summary" className={mini} value={doc.summary} onChange={(e) => set({ summary: e.target.value })} />

      <Heading>Skills</Heading>
      {doc.skills.map((s, i) => (
        <div key={i} className="flex flex-col sm:flex-row sm:gap-1">
          <input
            aria-label={`Skill group ${i + 1} name`}
            className={`${mini} shrink-0 font-semibold sm:w-28!`}
            value={s.label}
            onChange={(e) => set({ skills: doc.skills.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)) })}
          />
          <AutoTextarea
            aria-label={`Skill group ${i + 1} items`}
            className={mini}
            value={s.items}
            onChange={(e) => set({ skills: doc.skills.map((x, k) => (k === i ? { ...x, items: e.target.value } : x)) })}
          />
        </div>
      ))}

      <Heading>Experience</Heading>
      {doc.experience.map((j, i) => (
        <div key={i} className="mb-3">
          <div className="flex flex-col sm:flex-row sm:gap-1">
            <input aria-label={`Job ${i + 1} title`} className={`${mini} font-semibold`} value={j.title} onChange={(e) => setJob(i, { title: e.target.value })} />
            <input aria-label={`Job ${i + 1} dates`} className={`${mini} shrink-0 sm:w-40! sm:text-right`} value={j.dates} onChange={(e) => setJob(i, { dates: e.target.value })} />
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-1">
            <input aria-label={`Job ${i + 1} company`} className={`${mini} font-semibold`} value={j.company} onChange={(e) => setJob(i, { company: e.target.value })} />
            <input aria-label={`Job ${i + 1} location`} className={`${mini} shrink-0 text-xs text-foreground-muted sm:w-40! sm:text-right`} value={j.location} onChange={(e) => setJob(i, { location: e.target.value })} />
          </div>
          <AutoTextarea
            aria-label={`Job ${i + 1} bullets, one per line`}
            className={`${mini} mt-1`}
            value={j.bullets.join("\n")}
            onChange={(e) => setJob(i, { bullets: e.target.value.split("\n") })}
          />
        </div>
      ))}

      {doc.training.length > 0 && (
        <>
          <Heading>Training and certifications</Heading>
          {doc.training.map((t, i) => (
            <div key={i} className="flex flex-wrap gap-1 sm:flex-nowrap">
              <input aria-label={`Training ${i + 1}`} className={mini} value={t.name} onChange={(e) => set({ training: doc.training.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)) })} />
              <input aria-label={`Training ${i + 1} date`} className={`${mini} sm:w-28 sm:text-right`} value={t.dates} onChange={(e) => set({ training: doc.training.map((x, k) => (k === i ? { ...x, dates: e.target.value } : x)) })} />
            </div>
          ))}
        </>
      )}

      {doc.education.length > 0 && (
        <>
          <Heading>Education</Heading>
          {doc.education.map((ed, i) => (
            <div key={i} className="mb-2">
              <input aria-label={`Education ${i + 1} credential`} className={`${mini} font-semibold`} value={ed.credential} onChange={(e) => set({ education: doc.education.map((x, k) => (k === i ? { ...x, credential: e.target.value } : x)) })} />
              <div className="flex flex-col sm:flex-row sm:gap-1">
                <input aria-label={`Education ${i + 1} school`} className={mini} value={ed.school} onChange={(e) => set({ education: doc.education.map((x, k) => (k === i ? { ...x, school: e.target.value } : x)) })} />
                <input aria-label={`Education ${i + 1} date`} className={`${mini} shrink-0 sm:w-28! sm:text-right`} value={ed.dates} onChange={(e) => set({ education: doc.education.map((x, k) => (k === i ? { ...x, dates: e.target.value } : x)) })} />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
