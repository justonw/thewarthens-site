"use client";

import { useRef } from "react";
import VoiceInput from "./VoiceInput";

// "I don't have a resume yet": the concrete details go in proper fields, and the history goes in a big
// box the person can type in or talk into. The two are joined into one text for the resume writer.

export type Scratch = { name: string; email: string; phone: string; location: string; link: string; story: string };
export const emptyScratch: Scratch = { name: "", email: "", phone: "", location: "", link: "", story: "" };
export const MIN_STORY_CHARS = 150;

export function scratchToText(s: Scratch, fallbackEmail: string) {
  const email = s.email.trim() || fallbackEmail.trim();
  const lines = [`Name: ${s.name.trim()}`];
  if (email) lines.push(`Email: ${email}`);
  if (s.phone.trim()) lines.push(`Phone: ${s.phone.trim()}`);
  if (s.location.trim()) lines.push(`Location: ${s.location.trim()}`);
  if (s.link.trim()) lines.push(`Link: ${s.link.trim()}`);
  lines.push("", "In my own words:", s.story.trim());
  return lines.join("\n");
}

export const scratchReady = (s: Scratch) => s.name.trim().length > 1 && s.story.trim().length >= MIN_STORY_CHARS;

const STARTERS = [
  "Jobs I've had (what I did, where, and when): ",
  "School and training: ",
  "Skills and tools I use: ",
  "Volunteer, side, or family work: ",
  "What I'm proud of: ",
];

const field = "w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm outline-none focus:border-blue-500/50";

export default function ScratchForm({ value, onChange, done }: { value: Scratch; onChange: (update: (previous: Scratch) => Scratch) => void; done: boolean }) {
  const storyRef = useRef<HTMLTextAreaElement>(null);
  // Updates build on the latest values, so words arriving from the microphone never overwrite each other.
  const set = (patch: Partial<Scratch>) => onChange((prev) => ({ ...prev, ...patch }));
  const count = value.story.trim().length;

  function addStarter(text: string) {
    onChange((prev) => ({ ...prev, story: `${prev.story.trim() ? `${prev.story.trimEnd()}\n\n` : ""}${text}` }));
    storyRef.current?.focus();
  }

  function addSpoken(text: string) {
    onChange((prev) => ({ ...prev, story: `${prev.story}${prev.story && !/\s$/.test(prev.story) ? " " : ""}${text}` }));
  }

  return (
    <div className="rounded-2xl border border-border-subtle bg-background-elevated p-4 shadow-sm transition-shadow focus-within:border-blue-500/40 focus-within:shadow-md sm:p-5">
      <div className="flex items-center gap-3">
        <span aria-hidden className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${done ? "bg-green-600 text-white" : "bg-blue-600/10 text-blue-700"}`}>
          {done ? "✓" : 1}
        </span>
        <p className="text-base font-semibold">Tell us about you</p>
      </div>
      <p className="mt-1 text-xs text-foreground-muted sm:pl-10">No resume yet? No problem. Add your details, then tell us your story in your own words.</p>

      <div className="mt-4 grid gap-3 sm:ml-10 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold" htmlFor="sc-name">
            Full name
          </label>
          <input id="sc-name" value={value.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name" placeholder="Jordan Rivera" className={`${field} mt-1`} />
        </div>
        <div>
          <label className="block text-xs font-semibold" htmlFor="sc-email">
            Email for your resume <span className="font-normal text-foreground-muted">(optional)</span>
          </label>
          <input id="sc-email" type="email" value={value.email} onChange={(e) => set({ email: e.target.value })} autoComplete="email" placeholder="Same as the email below if you leave it blank" className={`${field} mt-1`} />
        </div>
        <div>
          <label className="block text-xs font-semibold" htmlFor="sc-phone">
            Phone <span className="font-normal text-foreground-muted">(optional)</span>
          </label>
          <input id="sc-phone" type="tel" value={value.phone} onChange={(e) => set({ phone: e.target.value })} autoComplete="tel" placeholder="(555) 123-4567" className={`${field} mt-1`} />
        </div>
        <div>
          <label className="block text-xs font-semibold" htmlFor="sc-location">
            City and state <span className="font-normal text-foreground-muted">(optional)</span>
          </label>
          <input id="sc-location" value={value.location} onChange={(e) => set({ location: e.target.value })} autoComplete="address-level2" placeholder="Atlanta, GA" className={`${field} mt-1`} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold" htmlFor="sc-link">
            LinkedIn or website <span className="font-normal text-foreground-muted">(optional)</span>
          </label>
          <input id="sc-link" value={value.link} onChange={(e) => set({ link: e.target.value })} placeholder="linkedin.com/in/yourname" className={`${field} mt-1`} />
        </div>
      </div>

      <div className="mt-5 sm:ml-10">
        <label className="block text-sm font-semibold" htmlFor="sc-story">
          Your story
        </label>
        <p className="mt-0.5 text-xs text-foreground-muted">
          Type it or talk it. A few sentences about each job, your school or training, and what you&apos;re good at is plenty. Dates and numbers help if you remember them.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {STARTERS.map((st) => (
            <button key={st} type="button" onClick={() => addStarter(st)} className="rounded-full border border-border-subtle bg-background px-3 py-1 text-xs transition-colors hover:border-blue-500/40">
              + {st.split(" (")[0].replace(/: $/, "")}
            </button>
          ))}
        </div>
        <textarea
          ref={storyRef}
          id="sc-story"
          rows={9}
          value={value.story}
          onChange={(e) => set({ story: e.target.value })}
          placeholder="For example: I managed a restaurant for 3 years, from 2021 until now. I led 22 people, handled complaints, and followed up with catering customers, which grew our orders. Before that I was an assistant manager. I have an associate degree in business. I'm good with Excel and customer service..."
          className={`${field} mt-3 resize-y`}
        />
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <VoiceInput onText={addSpoken} />
          <p className={`text-xs ${count >= MIN_STORY_CHARS ? "text-green-700" : "text-foreground-muted"}`} role="status">
            {count >= MIN_STORY_CHARS ? "That's enough to start." : `Keep going: ${MIN_STORY_CHARS - count} more characters to start.`}
          </p>
        </div>
      </div>
    </div>
  );
}
