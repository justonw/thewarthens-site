"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AutoTextarea from "@/components/resume/AutoTextarea";
import { matchKeywords, type TermResult } from "@/lib/keyword-match";

// The free keyword check. Paste a resume and a job posting, press the button, and see which of the posting's key
// phrases are in the resume. Nothing here calls an AI or a server: the matching is plain code in lib/keyword-match.ts.

const SAMPLE_RESUME = `Taylor Morgan
Customer support specialist with 4 years answering customer questions for a software company.
Managed a queue of about 60 tickets a day in Zendesk. Wrote help articles that cut repeat questions.
Used HubSpot to log customer notes and passed feedback to the sales and success teams. Reported weekly ticket numbers to a manager. Trained 5 new teammates.`;

const SAMPLE_POSTING = `Sales Development Representative
Requirements
- Experience with cold calling and outbound prospecting
- Familiarity with Salesforce or HubSpot CRM
- Strong communication skills and comfort working with cross-functional teams
What you'll do
- Book meetings for account executives
- Manage the sales pipeline and report on KPIs
- Hand off qualified leads to customer success`;

const field =
  "w-full rounded-2xl border border-border-subtle bg-background px-4 py-3 text-base leading-relaxed text-foreground placeholder:text-foreground-muted/70 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30";

const STATUS = {
  missing: {
    heading: "Not in your resume",
    help: "If you truly have this experience, find where it fits and say it in the posting's words. If you do not, leave it out.",
    chip: "border-amber-500/40 bg-amber-500/10 text-foreground",
  },
  words: {
    heading: "The words are there, but not as this phrase",
    help: "Every word shows up in your resume, just not together. If it describes real work you did, you may be able to use the exact phrase.",
    chip: "border-blue-500/30 bg-blue-500/5 text-foreground",
  },
  found: {
    heading: "Already in your resume",
    help: "Nothing to change here.",
    chip: "border-green-600/30 bg-green-600/5 text-foreground",
  },
} as const;

export default function KeywordMatcher() {
  const [resume, setResume] = useState("");
  const [posting, setPosting] = useState("");
  const [checked, setChecked] = useState<{ resume: string; posting: string } | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => (checked ? matchKeywords(checked.resume, checked.posting) : null), [checked]);
  const terms = useMemo(() => (result ? result.terms.filter((t) => !hidden.includes(t.phrase)) : []), [result, hidden]);

  const canCheck = resume.trim().length >= 40 && posting.trim().length >= 80;
  const found = terms.filter((t) => t.status === "found").length;
  const pct = terms.length ? Math.round((found / terms.length) * 100) : 0;

  const run = () => {
    if (!canCheck) return;
    setHidden([]);
    setChecked({ resume, posting });
    setTimeout(() => document.getElementById("kw-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const copyMissing = async () => {
    const list = terms.filter((t) => t.status !== "found").map((t) => t.phrase).join(", ");
    try {
      await navigator.clipboard.writeText(list);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Copying is a convenience; the list is on screen either way.
    }
  };

  const group = (status: TermResult["status"]) => terms.filter((t) => t.status === status);

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label htmlFor="kw-resume" className="text-sm font-semibold">
            1. Your resume
          </label>
          <p className="mb-2 text-sm text-foreground-muted">Paste the text of your resume.</p>
          <AutoTextarea id="kw-resume" value={resume} onChange={(e) => setResume(e.target.value)} placeholder="Paste your resume here" className={`${field} min-h-48`} />
        </div>
        <div>
          <label htmlFor="kw-posting" className="text-sm font-semibold">
            2. The job posting
          </label>
          <p className="mb-2 text-sm text-foreground-muted">Paste the whole posting, starting with the job title.</p>
          <AutoTextarea id="kw-posting" value={posting} onChange={(e) => setPosting(e.target.value)} placeholder="Paste the job posting here" className={`${field} min-h-48`} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={!canCheck}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
        >
          Check my keywords
        </button>
        <button
          type="button"
          onClick={() => {
            setResume(SAMPLE_RESUME);
            setPosting(SAMPLE_POSTING);
            setChecked(null);
          }}
          className="text-sm font-semibold text-blue-700 underline-offset-4 hover:underline"
        >
          Try it with an example
        </button>
        {!canCheck && (resume || posting) ? <span className="text-sm text-foreground-muted">Add a bit more text to both boxes to check.</span> : null}
      </div>

      {result && (
        <div id="kw-results" className="mt-10 scroll-mt-24">
          {terms.length === 0 ? (
            <p className="rounded-2xl border border-border-subtle bg-background-elevated p-5 text-foreground-muted">
              We could not find clear key phrases in that posting. Check that you pasted the full text of the job description, not just its title.
            </p>
          ) : (
            <>
              <div className="rounded-3xl border border-border-subtle bg-background-elevated p-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Your result</p>
                <p className="mt-1 text-2xl font-semibold" aria-live="polite">
                  {found} of {terms.length} key phrases are in your resume
                </p>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-border-subtle" role="img" aria-label={`${pct} percent of key phrases found`}>
                  <div className="h-full rounded-full bg-green-600" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-3 text-sm text-foreground-muted">
                  This is a simple word match, not a score from any hiring software. No one outside those companies knows exactly how theirs work. Use it as a to-do list, and only add what is true.
                </p>
              </div>

              {(["missing", "words", "found"] as const).map((status) => {
                const list = group(status);
                if (list.length === 0) return null;
                return (
                  <section key={status} className="mt-8">
                    <h2 className="text-lg font-semibold">
                      {STATUS[status].heading} <span className="text-foreground-muted">({list.length})</span>
                    </h2>
                    <p className="mt-1 text-sm text-foreground-muted">{STATUS[status].help}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {list.map((t) => (
                        <li key={t.phrase} className={`flex items-center gap-2 rounded-full border py-1.5 pl-3.5 pr-2 text-sm ${STATUS[status].chip}`}>
                          <span className="font-medium">{t.phrase}</span>
                          {t.count > 1 ? <span className="text-xs text-foreground-muted">used {t.count}x</span> : null}
                          <button
                            type="button"
                            onClick={() => setHidden((h) => [...h, t.phrase])}
                            aria-label={`Hide ${t.phrase}`}
                            title="Not relevant? Hide it"
                            className="flex h-6 w-6 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-black/10 hover:text-foreground"
                          >
                            <span aria-hidden>×</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}

              <p className="mt-6 text-sm text-foreground-muted">
                Company names, cities and other words that do not describe the work can show up here. Press the × on any phrase to hide it.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {group("missing").length + group("words").length > 0 ? (
                  <button
                    type="button"
                    onClick={copyMissing}
                    className="inline-flex items-center justify-center rounded-full border border-border-subtle bg-background-elevated px-5 py-2.5 text-sm font-semibold transition-colors hover:border-blue-500/50 hover:text-blue-700"
                  >
                    {copied ? "Copied" : "Copy the list of missing phrases"}
                  </button>
                ) : null}
              </div>

              <div className="mt-10 rounded-3xl border border-blue-500/30 bg-blue-500/5 p-6 sm:p-8">
                <h2 className="text-xl font-semibold">Want these worked in for you?</h2>
                <p className="mt-2 text-foreground-muted">
                  The Resume Builder rewrites your resume for this posting and uses the phrases that truly match your experience. It never invents anything: what your experience does not cover is listed for you instead. It also writes a matching cover letter. Your first 2 builds are free.
                </p>
                <Link
                  href="/resume"
                  className="mt-5 inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
                >
                  Open the Resume Builder
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
