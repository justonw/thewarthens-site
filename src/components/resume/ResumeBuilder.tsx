"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CoverLetter, ResumeDoc, ResumeGap, TailorResult } from "@/lib/resume-tailor";
import { MAX_NOTES_CHARS, MAX_POSTING_CHARS, MAX_RESUME_CHARS } from "@/lib/resume-input-limits";
import type { PickedFile } from "@/lib/resume-upload";
import { usePersistentState } from "@/lib/use-persistent-state";
import ResumeInputBox from "@/components/ResumeInputBox";
import { type Usage } from "@/lib/resume-usage";
import ResultView from "./ResultView";
import VoiceInput from "./VoiceInput";
import { takeHandoff } from "@/lib/resume-handoff";
import BuyMore from "./BuyMore";
import ProfilePanel from "./ProfilePanel";
import ApplicationsList from "./ApplicationsList";
import { LIBRARY_KEY, MAX_ANSWERS_PER_ENTRY, MAX_MESSAGES_PER_ENTRY, cleanLibrary, entryFromResult, entryToResult, followUpDue, noLibrary, sameJob, upsertEntry, type LibraryEntry, type SavedAnswer, type SavedMessage } from "@/lib/resume-library";
import { NO_TRACKER_ENTRIES, TRACKER_KEY, type TrackerEntry } from "@/lib/job-tracker";
import { RESULTS, type Result } from "@/lib/outcomes";
import type { ResumeStyle } from "@/lib/resume-files";
import { downloadBlob } from "@/lib/download";
import { track } from "@/lib/track";
import GeneralTarget from "./GeneralTarget";
import StartQuestion, { type Intent } from "./StartQuestion";
import type { PrepSheet } from "@/lib/interview";
import { STORIES_KEY, USE_STORIES_KEY, addStoryTo, buildProfileFile, noStories, profileFileName, storiesAsNotes, type Profile, type Story } from "@/lib/resume-profile";
import ScratchForm, { emptyScratch, scratchReady, scratchToText, type Scratch } from "./ScratchForm";

// The whole resume builder: the form, the progress screen, and the results. Anything worth keeping for
// next time (resume, notes, email) is remembered in this browser only.

type Phase = "form" | "loading" | "result";

const SOURCES = ["YouTube", "Instagram or TikTok", "Google search", "A friend or family member", "Career day or an event", "Other"];

const NOTE_STARTERS = [
  "Skills or tools that aren't on my resume: ",
  "Volunteer, side, or past work: ",
  "Certifications or classes I'm working on: ",
  "Strengths I want highlighted: ",
  "The kind of role I'm looking for: ",
];

// Drops starter lines that were tapped but never filled in, so they are not sent as "notes".
function tidyNotes(value: string) {
  const starters = new Set(NOTE_STARTERS.map((x) => x.trim()));
  return value
    .split("\n")
    .filter((line) => !starters.has(line.trim()))
    .join("\n")
    .trim();
}

const SAVED_KEY = "warthens-resume-builder-v1";
const MAX_SAVED_FILE_B64 = 1_500_000;

type SavedFile = { name: string; kind: "pdf" | "image"; mediaType: string; data: string; size: number };
type Saved = {
  resume: string;
  notes: string;
  hiringManager: string;
  email: string;
  source: string;
  wantLetter: boolean;
  // Whether to email a copy of each build. Remembered, so the next job does not ask again.
  emailCopy?: boolean;
  files: SavedFile[];
};

const noSaved: Saved | null = null;

const DRAFT_KEY = "warthens-resume-draft-v1";
// A build that is running right now. If the phone reloads the page while it runs, this is how we find out.
const INFLIGHT_KEY = "warthens-resume-inflight-v1";
const INFLIGHT_DRAFT_KEY = "warthens-resume-inflight-draft-v1";
const clock = () => Date.now();
type Draft = {
  mode?: string;
  scratch?: Scratch;
  resume?: string;
  posting?: string;
  general?: boolean;
  targetRole?: string;
  notes?: string;
  hiringManager?: string;
  wantLetter?: boolean;
  email?: string;
  source?: string;
  emailCopy?: boolean;
  matchDesign?: boolean;
  resumeFiles?: PickedFile[];
  postingFiles?: PickedFile[];
  filesDropped?: boolean;
};
// A picture's preview is a temporary address that does not survive the trip, so it is rebuilt from the picture itself.
const stripPreview = (f: PickedFile): PickedFile => ({ ...f, previewUrl: undefined });
const withPreview = (f: PickedFile): PickedFile =>
  f.kind === "image" && f.attachment ? { ...f, previewUrl: `data:${f.attachment.mediaType};base64,${f.attachment.data}` } : f;

const errorText: Record<string, string> = {
  email: "Enter a valid email address.",
  source: "Choose how you found us.",
  files: "One of your files couldn't be used. Remove it and add it again, or paste the text instead.",
  "too-big": "Your files add up to more than we can send at once (about 4 MB). Remove one, or paste the text instead.",
  "resume-short": "Add your resume first: paste the text, or upload a file or screenshot.",
  "posting-short": "Add the job posting: paste it, paste its link, or upload a file or screenshot.",
  "target-short": "Tell us the kind of role you want, like Customer Success Manager.",
  "too-long": "That's more text than we can read at once. Trim the resume or the posting and try again.",
  limit: "You're out of builds.",
  cap: "We've reached our free limit for this month. It resets on the 1st. Email info@thewarthens.com to join the wait.",
  "slow-down": "That was a lot of tries in a short time. Wait a few minutes and try again.",
  unavailable: "The resume builder isn't available right now. Try again later.",
  upstream: "Something went wrong building your resume, and it didn't use up a build. Try again.",
  "recover-limit": "Something went wrong, and we couldn't restore your build automatically. Email info@thewarthens.com and we'll fix it right away.",
  forbidden: "Something went wrong. Reload the page and try again.",
};

const progressSteps = (letter: boolean) => [
  "Reading your resume…",
  "Reading the job posting…",
  "Matching your experience to what they want…",
  "Writing your resume…",
  ...(letter ? ["Writing your cover letter…"] : []),
  "Checking it against our checklist…",
];

// A quick check for the most common mistyped email providers, so a copy is not sent to a stranger by accident.
const EMAIL_FIXES: Record<string, string> = {
  "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gmal.com": "gmail.com", "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gamil.com": "gmail.com", "gnail.com": "gmail.com",
  "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com", "yahoo.con": "yahoo.com", "hotmial.com": "hotmail.com", "hotmail.con": "hotmail.com", "outlok.com": "outlook.com", "outlook.con": "outlook.com",
  "iclod.com": "icloud.com", "icloud.con": "icloud.com",
};
function suggestEmail(value: string): string {
  const m = value.trim().match(/^([^@\s]+)@([^@\s]+)$/);
  if (!m) return "";
  const fix = EMAIL_FIXES[m[2].toLowerCase()];
  return fix ? `${m[1]}@${fix}` : "";
}

// Each try at a build has its own id, so the server can tell which build a "give it back" request is about.
function newBuildId() {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
}

// Asks the server to give back a build whose result never arrived. A build that is still running is asked about
// again every few seconds, for up to about 100 seconds (a build never runs longer than that).
async function recoverBuild(buildId: string, email: string): Promise<string> {
  for (let i = 0; i < 17; i++) {
    try {
      const res = await fetch("/api/resume-recover", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, buildId }) });
      const d = (await res.json().catch(() => ({}))) as { status?: string };
      if (d.status && d.status !== "pending") return d.status;
    } catch {
      /* try again */
    }
    await new Promise((resolve) => setTimeout(resolve, 6000));
  }
  return "unknown";
}

export default function ResumeBuilder() {
  const [phase, setPhase] = useState<Phase>("form");
  const [mode, setMode] = useState<"have" | "scratch">("have");
  const [scratch, setScratch] = useState<Scratch>(emptyScratch);
  const [resume, setResume] = useState("");
  const [resumeFiles, setResumeFiles] = useState<PickedFile[]>([]);
  const [posting, setPosting] = useState("");
  // A general resume: no posting, just the kind of role the person is aiming for.
  const [general, setGeneral] = useState(false);
  // Where the person is in a job search (the one starting question). It decides the kind of resume and which part of the kit opens first.
  const [intent, setIntent] = useState<Intent | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [postingFiles, setPostingFiles] = useState<PickedFile[]>([]);
  const [notes, setNotes] = useState("");
  const [hiringManager, setHiringManager] = useState("");
  const [wantLetter, setWantLetter] = useState(false);
  const [email, setEmail] = useState("");
  const emailHint = suggestEmail(email);
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);
  const [tick, setTick] = useState(0);

  const [result, setResult] = useState<TailorResult | null>(null);
  const [doc, setDoc] = useState<ResumeDoc | null>(null);
  const [letter, setLetter] = useState<CoverLetter | null>(null);
  const [letterFailed, setLetterFailed] = useState(false);
  const [emailCopy, setEmailCopy] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [outOfBuilds, setOutOfBuilds] = useState(false);
  // True when there are no packs on sale yet, so running out of free builds leads to a waitlist and not a buy screen.
  const [nothingToBuy, setNothingToBuy] = useState(false);
  // After a payment: whether we could put their form back ("yes"), or everything but their files ("files").
  const [draftBack, setDraftBack] = useState<"" | "yes" | "files">("");
  // Set when the page was reloaded while a build was running (phones do this when you switch apps for a moment).
  // True when the free keyword scanner passed the resume and posting over.
  const [fromScanner, setFromScanner] = useState(false);
  const [reloadNote, setReloadNote] = useState<"" | "checking" | "back" | "limit">("");
  // True when the visitor has just come back from Stripe.
  const justPaid = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("paid") === "1",
    () => false
  );
  // Whether the copy was asked for in the build that produced the result on screen.
  const [mailThis, setMailThis] = useState(false);
  // "Use my session to improve this web application". For ONE build only: never pre-checked, never remembered, and cleared
  // again as soon as that build is made, so the next job asks again.
  const [shareOk, setShareOk] = useState(false);
  const [shareStopped, setShareStopped] = useState<"" | "working" | "done" | "failed">("");
  const [gaps, setGaps] = useState<ResumeGap[]>([]);
  const [changes, setChanges] = useState<string[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  // "Free build 2 of 2" or "Paid build 3 of 15", as reported by the server for the build on screen.
  const [usage, setUsage] = useState<Usage | null>(null);
  const [original, setOriginal] = useState<string | null>(null);
  const [matchDesign, setMatchDesign] = useState(true);
  // "auto" shows the quick next-job screen when a profile is saved; "full" shows the whole form.
  const [lanePref, setLanePref] = useState<"auto" | "full">("auto");
  // The saved build on screen, so edits and messages are kept with it.
  const [entryId, setEntryId] = useState<string | null>(null);
  // Set when a saved build is opened from a follow-up nudge, so it opens on the follow-up message.
  const [openFollowUp, setOpenFollowUp] = useState(false);

  const [saved, setSaved, hydrated] = usePersistentState<Saved | null>(SAVED_KEY, noSaved);
  const [stories, setStories] = usePersistentState<Story[]>(STORIES_KEY, noStories);
  const [includeStories, setIncludeStories] = usePersistentState<boolean>(USE_STORIES_KEY, true);
  const [library, setLibrary] = usePersistentState<LibraryEntry[]>(LIBRARY_KEY, noLibrary);
  const [, setTracker] = usePersistentState<TrackerEntry[]>(TRACKER_KEY, NO_TRACKER_ENTRIES);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  // Private step counts (see lib/funnel.ts): opened, returned with a saved profile, and each step reached.
  useEffect(() => {
    track("resume-visit");
  }, []);
  useEffect(() => {
    if (hydrated && saved !== null) track("returning-visit");
  }, [hydrated, saved]);
  useEffect(() => {
    if (mode === "scratch" ? scratchReady(scratch) : resume.trim().length >= 150 || resumeFiles.length > 0) track("resume-added");
  }, [mode, scratch, resume, resumeFiles.length]);
  useEffect(() => {
    if (posting.trim().length >= 80 || postingFiles.length > 0) track("job-added");
  }, [posting, postingFiles.length]);
  useEffect(() => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && source) track("email-entered");
  }, [email, source]);

  // Rotates the progress messages while the AI works.
  useEffect(() => {
    if (phase !== "loading") return;
    const timer = setInterval(() => setTick((t) => t + 1), 4500);
    return () => clearInterval(timer);
  }, [phase]);

  const formIsEmpty = !scratch.name.trim() && !scratch.story.trim() && !resume.trim() && !posting.trim() && !notes.trim() && resumeFiles.length === 0 && postingFiles.length === 0;
  const showSaved = hydrated && saved !== null && formIsEmpty && phase === "form";

  // The quick next-job screen: for someone whose resume, email, and source are already saved, the only thing left to ask
  // for is the job. Anything that brings its own form contents (a payment return, the scanner, a reload) gets the full form.
  const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const canFast = hydrated && mode === "have" && saved !== null && (saved.resume.trim().length >= 150 || saved.files.length > 0) && EMAIL_OK.test(saved.email) && Boolean(saved.source);
  const fast = canFast && lanePref === "auto" && phase === "form" && !justPaid && !fromScanner && !reloadNote && !draftBack;

  // Puts the saved profile into the form the first time the quick screen shows, so the full form is ready if they want it.
  const appliedFast = useRef(false);
  useEffect(() => {
    if (!fast || !formIsEmpty) return;
    const timer = window.setTimeout(() => {
      if (appliedFast.current) return;
      appliedFast.current = true;
      applySaved();
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fast, formIsEmpty]);

  // On a computer, the job box is ready for a paste. (On a phone, focusing would pop the keyboard over the screen.)
  useEffect(() => {
    if (!fast || typeof window.matchMedia !== "function" || !window.matchMedia("(pointer: fine)").matches) return;
    const timer = window.setTimeout(() => document.getElementById("rt-posting")?.focus({ preventScroll: true }), 600);
    return () => window.clearTimeout(timer);
  }, [fast]);

  // The notes sent with a build: what they typed, plus (if they want) the true answers they gave before.
  function notesForBuild() {
    const base = tidyNotes(notes);
    if (!includeStories || stories.length === 0) return base;
    const extra = storiesAsNotes(stories, MAX_NOTES_CHARS - base.length - 2);
    return [base, extra].filter(Boolean).join("\n\n");
  }

  function exportProfile() {
    track("profile-saved");
    const json = buildProfileFile({ resume: saved?.resume ?? "", notes: saved?.notes ?? "", hiringManager: saved?.hiringManager ?? "", email: saved?.email ?? "", stories, library, filesOmitted: saved?.files.length ?? 0 });
    downloadBlob(new Blob([json], { type: "application/json" }), profileFileName());
  }

  // Loads a profile file. "replace" puts everything back; "stories" only adds its stories and keeps what is here.
  function importProfile(p: Profile, how: "replace" | "stories") {
    // The saved builds in the file are checked entry by entry. A file with none (an older one) never wipes the ones here.
    const imported = cleanLibrary(p.library ?? []);
    if (how === "stories") {
      setStories((cur) => p.stories.reduce((list, s) => addStoryTo(list, s), cur));
      if (imported.length) setLibrary((cur) => imported.reduce((list, e) => (list.some((x) => x.id === e.id) ? list : upsertEntry(list, e)), cur));
      return;
    }
    if (imported.length) setLibrary(imported);
    setStories(p.stories);
    setSaved({ resume: p.resume, notes: p.notes, hiringManager: p.hiringManager, email: p.email, source: saved?.source ?? "", wantLetter: saved?.wantLetter ?? false, files: [] });
    setMode("have");
    setResume(p.resume);
    setNotes(p.notes);
    setHiringManager(p.hiringManager);
    if (p.email) setEmail(p.email);
  }

  function forgetProfile() {
    setSaved(null);
    setStories([]);
    setLibrary([]);
    setEntryId(null);
  }

  function applySaved() {
    if (!saved) return;
    setEmailCopy(saved.emailCopy !== false);
    setMode("have");
    setResume(saved.resume);
    setNotes(saved.notes);
    setHiringManager(saved.hiringManager);
    setEmail(saved.email);
    setSource(saved.source);
    setWantLetter(saved.wantLetter);
    setResumeFiles(
      saved.files.map((f, i) => ({
        id: `saved-${i}-${Date.now()}`,
        name: f.name,
        kind: f.kind,
        attachment: { kind: f.kind, mediaType: f.mediaType, data: f.data },
        size: f.size,
        previewUrl: f.kind === "image" ? `data:${f.mediaType};base64,${f.data}` : undefined,
      }))
    );
  }

  function insertStarter(starter: string) {
    setNotes((n) => `${n.trim() ? `${n.trimEnd()}\n` : ""}${starter}`);
    setNotesOpen(true);
    notesRef.current?.focus();
  }

  async function build(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOutOfBuilds(false);
    // Check here first so people get a clear message before anything is sent.
    const fromScratch = mode === "scratch";
    const resumeText = fromScratch ? scratchToText(scratch, email) : resume;
    if (fromScratch) {
      if (scratch.name.trim().length < 2) return setError("Add your name so we can put it at the top.");
      if (!scratchReady(scratch)) return setError("Tell us a little more about your work, school, and skills. A few sentences is enough.");
    } else if (resume.trim().length < 150 && resumeFiles.length === 0) {
      return setError(errorText["resume-short"]);
    }
    if (general) {
      if (targetRole.trim().length < 3) return setError(errorText["target-short"]);
    } else if (posting.trim().length < 80 && postingFiles.length === 0) return setError(errorText["posting-short"]);
    if (resumeText.length > MAX_RESUME_CHARS) return setError(`Your resume text is very long (${resumeText.length.toLocaleString()} characters). Keep it under ${MAX_RESUME_CHARS.toLocaleString()}, or upload it as a file instead.`);
    if (posting.length > MAX_POSTING_CHARS) return setError(`The posting text is very long (${posting.length.toLocaleString()} characters). Keep it under ${MAX_POSTING_CHARS.toLocaleString()}, or paste just the job description.`);
    if (notes.length > MAX_NOTES_CHARS) return setError(`Your notes are a bit long (${notes.length.toLocaleString()} characters). Keep them under ${MAX_NOTES_CHARS.toLocaleString()}.`);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError(errorText.email);
    if (!source) return setError(errorText.source);
    if ([...resumeFiles, ...postingFiles].reduce((n, f) => n + f.size, 0) > 5_000_000) return setError(errorText["too-big"]);

    track("build-started");
    setPhase("loading");
    setRetrying(false);
    setTick(0);
    const payloadBase = {
      email: email.trim(),
      source,
      resumeText,
      postingText: general ? "" : posting,
      general,
      targetRole: general ? targetRole.trim() : "",
      fromScratch,
      resumeFiles: fromScratch ? [] : resumeFiles.flatMap((f) => (f.attachment ? [f.attachment] : [])),
      postingFiles: general ? [] : postingFiles.flatMap((f) => (f.attachment ? [f.attachment] : [])),
      notes: notesForBuild(),
      coverLetter: wantLetter && !general,
      hiringManager: hiringManager.trim(),
      matchDesign: !fromScratch && matchDesign && resumeFiles.some((f) => Boolean(f.attachment)),
      shareOk,
    };
    // A one-off hiccup on our side should not reach the person: try once more before showing an error.
    // Every try has its own id. When a try does not come back, we first ask the server to give that build back (it
    // may have finished on our side while the connection dropped), so trying again never costs a second build.
    saveDraft(INFLIGHT_DRAFT_KEY);
    let data: { ok?: boolean; error?: string; message?: string; result?: TailorResult; letterFailed?: boolean; remaining?: number | null; usage?: Usage | null; shareId?: string | null } = {};
    let status = 0;
    for (let attempt = 1; attempt <= 2; attempt++) {
      const buildId = newBuildId();
      try {
        window.sessionStorage.setItem(INFLIGHT_KEY, JSON.stringify({ buildId, email: email.trim(), at: clock() }));
      } catch {
        /* private mode: no reload recovery, everything else works */
      }
      try {
        const res = await fetch("/api/resume-tailor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payloadBase, buildId }) });
        status = res.status;
        data = await res.json().catch(() => ({}));
      } catch {
        status = 0;
        data = { error: "upstream" };
      }
      const retryable = (status === 0 || status >= 500) && data.error !== "unavailable";
      if (data.ok || !retryable) break;
      setRetrying(true);
      const recovered = await recoverBuild(buildId, email.trim());
      if (recovered === "limit") {
        data = { error: "recover-limit" };
        break;
      }
      if (attempt === 2) break;
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    // The build is over, one way or another, so there is nothing to recover after a reload.
    try {
      window.sessionStorage.removeItem(INFLIGHT_KEY);
      window.sessionStorage.removeItem(INFLIGHT_DRAFT_KEY);
    } catch {
      /* ignore */
    }
    if (!data.ok || !data.result) {
      setOutOfBuilds(data.error === "limit");
      setError(data.error === "problem" ? data.message ?? errorText.upstream : errorText[data.error as string] ?? errorText.upstream);
      setPhase("form");
      return;
    }

    // Remember what is worth keeping for next time, in this browser only.
    const files: SavedFile[] = [];
    let total = 0;
    for (const f of resumeFiles) {
      if (!f.attachment) continue;
      total += f.attachment.data.length;
      if (total > MAX_SAVED_FILE_B64) break;
      files.push({ name: f.name, kind: f.attachment.kind, mediaType: f.attachment.mediaType, data: f.attachment.data, size: f.size });
    }
    setSaved({ resume: resumeText, notes: tidyNotes(notes), hiringManager, email: email.trim(), source, wantLetter, emailCopy, files });

    // Keep this build in "My applications" and put the job in the tracker, so there is nothing to remember to do.
    const built = data.result;
    const id = newBuildId();
    setLibrary((cur) => upsertEntry(cur, { ...entryFromResult(id, built, built.coverLetter ?? null), shareId: shareOk && data.shareId ? data.shareId : undefined }));
    setShareStopped("");
    setShareOk(false);
    setEntryId(id);
    if (!built.general) trackJob(built.postingCompany, built.postingTitle);

    track("build-finished");
    if (built.general) track("general-built");
    setResult(data.result);
    setDoc(data.result.resume);
    setLetter(data.result.coverLetter ?? null);
    setLetterFailed(Boolean(data.letterFailed));
    setMailThis(emailCopy);
    setGaps(data.result.gaps);
    setChanges(data.result.changes);
    setRemaining(typeof data.remaining === "number" ? data.remaining : null);
    setUsage(data.usage ?? null);
    setOriginal(fromScratch || !resumeText.trim() ? null : resumeText);
    setPhase("result");
  }

  // Pressing Build swaps the long form for a much shorter progress card, and the page gets shorter under the
  // reader. So whenever the view changes, take them to the top of the new one (or to the message, when a build
  // comes back with a problem), so they never have to hunt for where they are.
  const previousPhase = useRef<Phase>("form");
  useEffect(() => {
    const was = previousPhase.current;
    previousPhase.current = phase;
    if (was === phase) return;
    const backWithProblem = phase === "form" && was === "loading";
    // When the person said they want to reach out or prep for an interview, the tool they asked for opens first, so take them to it
    // (the kit strip sits right above it), not to the top of the result where they would have to look for it.
    const toolFirst = phase === "result" && !general && (openFollowUp || intent === "reach" || intent === "interview");
    const target = (backWithProblem && document.getElementById("rt-problem")) || (toolFirst && document.getElementById("rt-tabs")) || document.getElementById("resume-tool");
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - (backWithProblem ? 160 : toolFirst ? 80 : 100);
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Tell the page section around the builder which stage it is in, so the "Start here" intro can hide itself once the form is done.
  useEffect(() => {
    const section = document.getElementById("start");
    section?.setAttribute("data-phase", phase);
    return () => section?.removeAttribute("data-phase");
  }, [phase]);

  // Paying on Stripe takes the person to another page and back, which would empty the form. So the form is kept
  // for the trip, in this tab only, and put back (once) when they return from a payment.
  function saveDraft(key = DRAFT_KEY) {
    try {
      const draft = { mode, scratch, resume, posting, general, targetRole, notes, hiringManager, wantLetter, email, source, emailCopy, matchDesign, resumeFiles: resumeFiles.map(stripPreview), postingFiles: postingFiles.map(stripPreview) };
      const json = JSON.stringify(draft);
      // Files can be large. If they do not fit, keep the typed parts and tell the person to add the files again.
      window.sessionStorage.setItem(key, json.length < 3_500_000 ? json : JSON.stringify({ ...draft, resumeFiles: [], postingFiles: [], filesDropped: true }));
    } catch {
      /* private mode or storage full: they will simply see an empty form, as before */
    }
  }

  function applyDraft(raw: string) {
    try {
      const d = JSON.parse(raw) as Draft;
      setMode(d.mode === "scratch" ? "scratch" : "have");
      setScratch({ ...emptyScratch, ...d.scratch });
      setResume(d.resume ?? "");
      setPosting(d.posting ?? "");
      setNotes(d.notes ?? "");
      setHiringManager(d.hiringManager ?? "");
      setWantLetter(Boolean(d.wantLetter));
      setGeneral(d.general === true);
      setTargetRole(d.targetRole ?? "");
      setEmail(d.email ?? "");
      setSource(d.source ?? "");
      setEmailCopy(d.emailCopy !== false);
      setMatchDesign(d.matchDesign !== false);
      setResumeFiles((d.resumeFiles ?? []).map(withPreview));
      setPostingFiles((d.postingFiles ?? []).map(withPreview));
      setDraftBack(d.filesDropped ? "files" : "yes");
    } catch {
      /* an unreadable draft is ignored */
    }
  }

  // The page came back after being reloaded in the middle of a build. The result cannot be recovered, but the build can:
  // ask the server to give it back, put the form back as it was, and say so.
  const checkedInflight = useRef(false);
  useEffect(() => {
    if (checkedInflight.current) return;
    checkedInflight.current = true;
    let info: { buildId?: string; email?: string; at?: number } | null = null;
    let draft: string | null = null;
    try {
      info = JSON.parse(window.sessionStorage.getItem(INFLIGHT_KEY) ?? "null");
      draft = window.sessionStorage.getItem(INFLIGHT_DRAFT_KEY);
      window.sessionStorage.removeItem(INFLIGHT_KEY);
      window.sessionStorage.removeItem(INFLIGHT_DRAFT_KEY);
    } catch {
      return;
    }
    if (!info?.buildId || !info.email || clock() - Number(info.at ?? 0) > 20 * 60_000) return;
    const { buildId, email: who } = info;
    const saved = draft;
    window.setTimeout(() => {
      if (saved) applyDraft(saved);
      setReloadNote("checking");
      void recoverBuild(buildId, who).then((status) => setReloadNote(status === "limit" ? "limit" : "back"));
    }, 0);
  }, []);

  // The free keyword scanner can hand over the resume and posting it was just given. Used once, and only when nothing
  // else is being restored.
  const handoffChecked = useRef(false);
  useEffect(() => {
    if (handoffChecked.current) return;
    handoffChecked.current = true;
    const h = takeHandoff();
    if (!h || (!h.resume.trim() && !h.posting.trim())) return;
    window.setTimeout(() => {
      setResume((cur) => cur || h.resume);
      setPosting((cur) => cur || h.posting);
      setFromScanner(true);
    }, 0);
  }, []);

  const restored = useRef(false);
  useEffect(() => {
    if (!justPaid || restored.current) return;
    restored.current = true;
    let raw: string | null = null;
    try {
      raw = window.sessionStorage.getItem(DRAFT_KEY);
      window.sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      return;
    }
    if (!raw) return;
    const saved = raw;
    // Applied just after the page has settled, so the form fills in without a mismatch with the server's page.
    window.setTimeout(() => applyDraft(saved), 0);
  }, [justPaid]);

  // After Stripe the person must still press Build. Bring the button into view and focus it, so the last step
  // is impossible to miss. Waits a moment so the restored form has finished filling in and the page has settled.
  const buildButton = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!justPaid) return;
    const timer = window.setTimeout(() => {
      buildButton.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      buildButton.current?.focus({ preventScroll: true });
    }, 700);
    return () => window.clearTimeout(timer);
  }, [justPaid]);

  // Stops sharing one build: the saved copy is emptied on our side, and the build here no longer says it is shared.
  async function stopSharing(id: string) {
    const e = library.find((x) => x.id === id);
    if (!e?.shareId) return;
    setShareStopped("working");
    try {
      const res = await fetch("/api/resume-share", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ shareId: e.shareId, email: (email.trim() || saved?.email || "").trim() }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error("not stopped");
      setLibrary((cur) => cur.map((x) => (x.id === id ? { ...x, shareId: undefined } : x)));
      setShareStopped("done");
    } catch {
      setShareStopped("failed");
    }
  }

  function startOver() {
    // Keeps the resume, notes, and email, so the next job takes seconds.
    track("next-job");
    setEntryId(null);
    setOpenFollowUp(false);
    setPhase("form");
    setResult(null);
    setDoc(null);
    setLetter(null);
    setPosting("");
    setPostingFiles([]);
    setGeneral(false);
    setIntent(null);
    setTargetRole("");
    setError("");
  }

  // ---------- My applications ----------

  const todayIso = () => new Date().toISOString().slice(0, 10);

  // Puts a job in the tracker (once). A job already there is left as it is, unless it is being marked applied.
  function trackJob(company: string, role: string, status: "Not Yet Applied" | "Applied" = "Not Yet Applied") {
    if (!company.trim() || !role.trim()) return;
    setTracker((cur) => {
      const hit = cur.find((x) => sameJob(x, { company, role }));
      if (!hit) {
        return [{ id: crypto.randomUUID(), company: company.trim(), role: role.trim(), status, dateApplied: todayIso(), notes: "Resume tailored for this job." }, ...cur];
      }
      if (status === "Applied" && hit.status === "Not Yet Applied") return cur.map((x) => (x === hit ? { ...x, status: "Applied", dateApplied: todayIso() } : x));
      return cur;
    });
  }

  function openEntry(id: string, followUp = false) {
    const e = library.find((x) => x.id === id);
    if (!e) return;
    track(followUp ? "followup-opened" : "build-reopened");
    setOpenFollowUp(followUp);
    if (!email.trim() && saved?.email) setEmail(saved.email);
    setResult(entryToResult(e));
    setDoc(e.doc);
    setLetter(e.letter);
    setLetterFailed(false);
    setMailThis(false);
    setGaps(e.gaps);
    setChanges(e.changes);
    setRemaining(null);
    setUsage(null);
    setOriginal(null);
    setEntryId(id);
    setShareStopped("");
    setPhase("result");
  }

  function toggleApplied(id: string) {
    const e = library.find((x) => x.id === id);
    if (!e) return;
    const nowApplied = e.status !== "applied";
    const stamp = new Date().toISOString();
    setLibrary((cur) => cur.map((x) => (x.id === id ? { ...x, status: nowApplied ? "applied" : "built", appliedAt: nowApplied ? stamp : "", updatedAt: stamp } : x)));
    if (nowApplied) {
      trackJob(e.company, e.title, "Applied");
    } else {
      // Undoing only steps the tracker back if it still says "Applied", so a later stage is never overwritten.
      setTracker((cur) => cur.map((x) => (sameJob(x, { company: e.company, role: e.title }) && x.status === "Applied" ? { ...x, status: "Not Yet Applied" } : x)));
    }
  }

  // A follow-up was copied: remember it, so this job is not nudged again.
  function markFollowedUp(id: string) {
    const stamp = new Date().toISOString();
    setLibrary((cur) => cur.map((x) => (x.id === id && !x.followedUpAt ? { ...x, followedUpAt: stamp, updatedAt: stamp } : x)));
    track("followup-written");
  }

  // Where an application stands now. The job tracker is kept in step, so the two never disagree.
  function markOutcome(id: string, outcome: Result) {
    const e = library.find((x) => x.id === id);
    if (!e) return;
    const stamp = new Date().toISOString();
    setLibrary((cur) => cur.map((x) => (x.id === id ? { ...x, result: outcome, resultAt: outcome === "" ? "" : stamp, updatedAt: stamp } : x)));
    const status = RESULTS.find((r) => r.id === outcome)?.tracker ?? "Applied";
    if (e.company.trim() && e.title.trim()) {
      setTracker((cur) => {
        const hit = cur.find((x) => sameJob(x, { company: e.company, role: e.title }));
        if (!hit) return [{ id: crypto.randomUUID(), company: e.company.trim(), role: e.title.trim(), status, dateApplied: new Date().toISOString().slice(0, 10), notes: "Resume tailored for this job." }, ...cur];
        return cur.map((x) => (x === hit ? { ...x, status } : x));
      });
    }
    if (outcome !== "") track("outcome-marked");
  }

  function removeEntry(id: string) {
    setLibrary((cur) => cur.filter((x) => x.id !== id));
    if (entryId === id) setEntryId(null);
  }

  function saveMessage(m: SavedMessage) {
    if (!entryId) return;
    setLibrary((cur) =>
      cur.map((x) => (x.id === entryId ? { ...x, updatedAt: new Date().toISOString(), messages: [m, ...x.messages.filter((y) => y.id !== m.id)].slice(0, MAX_MESSAGES_PER_ENTRY) } : x))
    );
  }

  function saveInterview(sheet: PrepSheet) {
    if (!entryId) return;
    setLibrary((cur) => cur.map((x) => (x.id === entryId ? { ...x, updatedAt: new Date().toISOString(), interview: sheet } : x)));
  }

  function saveAnswer(a: SavedAnswer) {
    if (!entryId) return;
    setLibrary((cur) =>
      cur.map((x) => (x.id === entryId ? { ...x, updatedAt: new Date().toISOString(), answers: [a, ...x.answers.filter((y) => y.id !== a.id)].slice(0, MAX_ANSWERS_PER_ENTRY) } : x))
    );
  }

  function saveStyle(style: ResumeStyle) {
    if (!entryId) return;
    setLibrary((cur) => cur.map((x) => (x.id === entryId && x.style !== style ? { ...x, style } : x)));
  }

  // Edits to the resume, the letter, and the questions keep flowing into the saved build, a moment after each change.
  useEffect(() => {
    if (phase !== "result" || !entryId || !doc) return;
    const timer = window.setTimeout(() => {
      setLibrary((cur) =>
        cur.map((x) => {
          if (x.id !== entryId) return x;
          const same = JSON.stringify([x.doc, x.letter, x.gaps, x.changes]) === JSON.stringify([doc, letter, gaps, changes]);
          return same ? x : { ...x, doc, letter, gaps, changes, updatedAt: new Date().toISOString() };
        })
      );
    }, 700);
    return () => window.clearTimeout(timer);
  }, [phase, entryId, doc, letter, gaps, changes, setLibrary]);

  const current = entryId ? library.find((x) => x.id === entryId) : undefined;

  if (phase === "loading") {
    const steps = progressSteps(wantLetter);
    const index = Math.min(tick, steps.length - 1);
    return (
      <div id="resume-tool" className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-border-subtle bg-background-elevated shadow-lg">
        <div className="h-1.5 w-full overflow-hidden bg-background-elevated-2">
          <div className="rb-bar h-full w-full bg-gradient-to-r from-blue-600 to-violet-600" />
        </div>
        <div className="p-8 text-center sm:p-10">
          <div className="relative mx-auto h-14 w-14">
            <span className="rb-ping absolute inset-0 rounded-full bg-violet-500/30" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white">
              <svg viewBox="0 0 24 24" className="h-7 w-7 animate-pulse" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8L12 3z" />
              </svg>
            </span>
          </div>
          <p className="mt-5 text-xl font-semibold">{wantLetter ? "Building your resume and cover letter" : "Building your resume"}</p>
          <p className="mt-1 text-sm text-foreground-muted" role="status">
            {retrying ? "That took a little longer than usual, so we're trying again." : "Writing it for this exact job."}
          </p>
          <ul className="mx-auto mt-6 max-w-xs space-y-2.5 text-left text-sm">
            {steps.map((label, i) => (
              <li key={label} className={`flex items-center gap-3 transition-opacity ${i > index ? "opacity-40" : ""}`}>
                {i < index ? (
                  <span aria-hidden className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600">
                    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3.5 8.5l3 3 6-7" />
                    </svg>
                  </span>
                ) : i === index ? (
                  <span aria-hidden className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-border-subtle border-t-blue-600" />
                ) : (
                  <span aria-hidden className="h-5 w-5 shrink-0 rounded-full border-2 border-border-subtle" />
                )}
                <span className={i === index ? "font-semibold" : ""}>{label.replace("…", "")}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-foreground-muted">This usually takes 10 to 30 seconds. Please keep this tab open.</p>
        </div>
      </div>
    );
  }

  if (phase === "result" && doc && result) {
    const shareNote = current?.shareId || shareStopped === "done" ? (
      <p role="status" className="mb-4 rounded-xl border border-border-subtle bg-white px-4 py-3 text-xs text-foreground-muted">
        {shareStopped === "done"
          ? "Sharing stopped. We emptied the copy we had of this build."
          : "You chose to let The Warthens use this session to improve this web application. "}
        {current?.shareId && (
          <button type="button" onClick={() => entryId && void stopSharing(entryId)} disabled={shareStopped === "working"} className="font-semibold text-blue-700 underline underline-offset-2">
            {shareStopped === "working" ? "Stopping…" : "Stop sharing this build"}
          </button>
        )}
        {shareStopped === "failed" && " We couldn't stop it just now. Please try again in a minute."}
      </p>
    ) : null;
    return (
      <>
      {shareNote}
      <ResultView
        key={entryId ?? "new"}
        result={result}
        doc={doc}
        onDoc={setDoc}
        letter={letter}
        letterFailed={letterFailed}
        onLetter={setLetter}
        gaps={gaps}
        onGaps={setGaps}
        changes={changes}
        onChanges={setChanges}
        email={email.trim() || saved?.email || ""}
        emailCopy={mailThis}
        remaining={remaining}
        usage={usage}
        original={original}
        onStartOver={startOver}
        onSaveProfile={exportProfile}
        initialStyle={current?.style}
        onStyleChange={saveStyle}
        applied={current?.status === "applied"}
        onToggleApplied={entryId ? () => toggleApplied(entryId) : undefined}
        messages={current?.messages}
        onMessage={saveMessage}
        answers={current?.answers}
        onAnswer={saveAnswer}
        interview={current?.interview}
        onInterview={saveInterview}
        startOnReach={openFollowUp}
        startTab={intent === "reach" ? "reach" : intent === "interview" ? "interview" : undefined}
        initialPurpose={openFollowUp ? "followup" : "intro"}
        appliedDaysAgo={current ? followUpDue(current).days || null : null}
        onFollowedUp={entryId ? () => markFollowedUp(entryId) : undefined}
      />
      </>
    );
  }

  // The notes panel stays open once there is something in it (for example, notes remembered from last time).
  const notesShown = notesOpen || notes.trim().length > 0;
  const input = "w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm outline-none focus:border-blue-500/50";
  const resumeReady = mode === "scratch" ? scratchReady(scratch) : resume.trim().length >= 150 || resumeFiles.length > 0;
  const postingReady = general ? targetRole.trim().length >= 3 : posting.trim().length >= 80 || postingFiles.length > 0;
  const emailReady = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && Boolean(source);
  const readyCount = Number(resumeReady) + Number(postingReady) + Number(emailReady);
  const missing = [!postingReady && (general ? "the kind of role" : "the job"), !resumeReady && "your resume", !emailReady && "your email and how you found us"].filter(Boolean) as string[];

  // What the quick screen says it is using, in a few words: the first line of the saved resume (usually the name), or the file.
  const savedWords = saved?.resume.trim() ? saved.resume.trim().split(/\s+/).length : 0;
  const savedFirst = saved?.resume.split("\n").map((l) => l.trim()).find(Boolean) ?? "";
  // The first line is usually the person's name. A resume pasted as one long line is cut with an ellipsis, not mid-word.
  const savedFirstLine = savedFirst.length > 70 ? `${savedFirst.slice(0, 70).trimEnd()}…` : savedFirst;
  const savedSummary = saved ? (savedFirstLine ? `${savedFirstLine}${savedWords ? ` · ${savedWords.toLocaleString()} words` : ""}` : saved.files.map((f) => f.name).join(", ")) : "";
  const answerCount = includeStories ? stories.length : 0;
  const jobBox = (
    <ResumeInputBox
      id="rt-posting"
      step={1}
      done={postingReady}
      label="The job you are applying for"
      help="Paste the link to the job posting. We rewrite your resume for this exact job. You can also paste the text or drop in a screenshot."
      placeholder="Paste the link to the job posting here, or paste the posting text, or drop a screenshot onto this box."
      text={posting}
      onText={setPosting}
      files={postingFiles}
      onFiles={setPostingFiles}
      allowLink
    />
  );
  function chooseGeneral() {
    track("general-chosen");
    setGeneral(true);
    setWantLetter(false);
    setLanePref("full");
    window.setTimeout(() => document.getElementById("rt-target")?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
  }
  const jobArea = general ? (
    <GeneralTarget value={targetRole} onChange={setTargetRole} done={postingReady} onBack={() => setGeneral(false)} />
  ) : (
    <div className="space-y-2">
      {jobBox}
      <p className="text-center text-xs text-foreground-muted">
        No specific job yet?{" "}
        <button type="button" onClick={chooseGeneral} className="inline-flex min-h-11 items-center px-1 font-semibold text-blue-600 underline underline-offset-2">
          Build a general resume instead
        </button>
      </p>
    </div>
  );
  function chooseIntent(next: Intent | null) {
    setIntent(next);
    if (next === "explore") chooseGeneral();
    else if (next) {
      setGeneral(false);
      window.setTimeout(() => document.getElementById("rt-posting")?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
    }
  }
  function showFullForm(focusId: string) {
    setLanePref("full");
    window.setTimeout(() => document.getElementById(focusId)?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  }

  return (
    <div className="space-y-10">
    <form id="resume-tool" onSubmit={build} className="space-y-6" noValidate>

      {!fast && (
      <div className="z-30 mx-auto max-w-3xl rounded-2xl border border-border-subtle bg-white/90 px-4 py-3 shadow-md backdrop-blur sm:px-6 md:sticky md:top-16">
        <ol className="flex items-center" aria-label="Your progress">
          {(
            [
              [general ? "Role" : "Job", postingReady, general ? "rt-target" : "rt-posting"],
              ["Resume", resumeReady, mode === "scratch" ? "sc-name" : "rt-resume"],
              ["Email", emailReady, "rt-email"],
            ] as [string, boolean, string][]
          ).map(([label, done, target], i) => (
            <li key={label} className="flex flex-1 items-center last:flex-none">
              <a href={`#${target}`} className="group flex items-center gap-2">
                <span
                  aria-hidden
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    done ? "bg-green-600 text-white" : "bg-gradient-to-br from-blue-600 to-violet-600 text-white group-hover:opacity-90"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className={`text-xs font-semibold sm:text-sm ${done ? "text-green-700" : ""}`}>{label}</span>
              </a>
              {i < 2 && <span aria-hidden className={`mx-3 h-0.5 flex-1 rounded-full transition-colors duration-500 ${done ? "bg-green-600" : "bg-border-subtle"}`} />}
            </li>
          ))}
        </ol>
        <p className="sr-only" role="status">
          {readyCount === 3 ? "You're ready. Build it." : `${readyCount} of 3 steps done`}
        </p>
      </div>
      )}

      {canFast && lanePref === "full" && (
        <p className="mx-auto max-w-3xl text-center text-sm">
          <button type="button" onClick={() => setLanePref("auto")} className="inline-flex min-h-11 items-center font-semibold text-blue-700 underline underline-offset-2">
            ← Back to the quick next-job screen
          </button>
        </p>
      )}

      {hydrated && phase === "form" && mode === "have" && !fast && (
        <ProfilePanel
          applications={library.length}
          hasSaved={saved !== null}
          resumeText={saved?.resume ?? ""}
          notesText={saved?.notes ?? ""}
          stories={stories}
          useStories={includeStories}
          onUseStories={setIncludeStories}
          onRemoveStory={(id) => setStories((cur) => cur.filter((s) => s.id !== id))}
          onImport={importProfile}
          onExport={exportProfile}
          onForget={forgetProfile}
        />
      )}

      {showSaved && mode === "have" && !fast && (
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-500/30 bg-blue-500/5 px-5 py-4">
          <p className="text-sm">
            <span className="font-semibold">Welcome back.</span> We kept your resume and notes on this device, so you can skip step 2.
          </p>
          <div className="flex items-center gap-3">
            <button type="button" onClick={applySaved} className="inline-flex min-h-11 items-center rounded-full bg-blue-600 px-5 text-xs font-semibold text-white transition-colors hover:bg-blue-500 sm:min-h-9">
              Use my saved info
            </button>
            <button type="button" onClick={() => setSaved(null)} className="inline-flex min-h-11 items-center px-2 text-xs text-foreground-muted underline underline-offset-2 sm:min-h-9">
              Forget it
            </button>
          </div>
        </div>
      )}

      {fast ? (
        <div className="mx-auto max-w-3xl space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Next job</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Paste the next job. We&apos;ll do the rest.</h2>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-green-600/30 bg-green-600/5 px-4 py-3">
            <p className="min-w-0 text-sm">
              <span className="font-semibold text-green-800">✓ Using your saved resume</span>
              <span className="block truncate text-xs text-foreground-muted">{savedSummary}</span>
            </p>
            <button type="button" onClick={() => showFullForm("rt-resume")} className="inline-flex min-h-11 items-center rounded-full px-3 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-500/10 sm:min-h-9">
              Change
            </button>
          </div>
          <ResumeInputBox
            id="rt-posting"
            step={1}
            done={postingReady}
            label="The job you're applying for"
            help="Paste its link or the text, or drop a screenshot."
            placeholder="Paste the link to the job posting here, or paste the posting text, or drop a screenshot onto this box."
            text={posting}
            onText={setPosting}
            files={postingFiles}
            onFiles={setPostingFiles}
            allowLink
          />
          <p className="text-center text-xs text-foreground-muted">
            No specific job yet?{" "}
            <button type="button" onClick={chooseGeneral} className="inline-flex min-h-11 items-center px-1 font-semibold text-blue-600 underline underline-offset-2">
              Build a general resume instead
            </button>
          </p>
          <div className="space-y-3 rounded-2xl border border-border-subtle bg-white px-4 py-4 shadow-sm">
            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={wantLetter} onChange={(e) => setWantLetter(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600" />
              <span className="text-sm font-semibold">Also write a cover letter</span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={emailCopy} onChange={(e) => setEmailCopy(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600" />
              <span className="min-w-0 text-sm">
                <span className="font-semibold">Email me a copy</span>
                <span className="block truncate text-xs text-foreground-muted">Goes to {saved?.email}</span>
              </span>
            </label>
            <p className="text-xs text-foreground-muted">
              {tidyNotes(notes) || answerCount > 0 ? `Your saved notes${answerCount > 0 ? ` and ${answerCount} saved ${answerCount === 1 ? "answer" : "answers"}` : ""} are used too. ` : ""}
              <button type="button" onClick={() => showFullForm("rt-resume")} className="font-semibold text-blue-700 underline underline-offset-2">
                Change my resume, email, or notes
              </button>
            </p>
          </div>
        </div>
      ) : mode === "scratch" ? (
        <div className="mx-auto max-w-3xl space-y-6">
        
          <p className="text-center text-xs text-foreground-muted">
            <button type="button" onClick={() => setMode("have")} className="font-semibold text-blue-600 underline underline-offset-2">
              ← Back: I have a resume to tailor
            </button>
          </p>
          {jobArea}
          <ScratchForm value={scratch} onChange={setScratch} done={resumeReady} step={2} />
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-2">
          {jobArea}
          <div className="space-y-3">
            <ResumeInputBox
        id="rt-resume"
        step={2}
        done={resumeReady}
        label="Your current resume"
        help="Upload a file, drag one in, paste a screenshot, or paste the text."
        placeholder="Paste your resume text here, or drop a PDF, Word file, or screenshot onto this box."
        text={resume}
        onText={setResume}
        files={resumeFiles}
        onFiles={setResumeFiles}
        onProfileFile={(p) => importProfile(p, "replace")}
        lookHint
      />
          {resumeFiles.some((f) => Boolean(f.attachment)) && (
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border-subtle bg-background-elevated px-4 py-3 shadow-sm">
              <input type="checkbox" checked={matchDesign} onChange={(e) => setMatchDesign(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600" />
              <span>
                <span className="block text-sm font-semibold">Copy the look of my resume</span>
                <span className="block text-xs text-foreground-muted">We match its font style, colors, header, and section order. We keep one clean column, because hiring software reads that best.</span>
              </span>
            </label>
          )}

          <p className="text-center text-xs text-foreground-muted">
            No resume yet?{" "}
            <button type="button" onClick={() => setMode("scratch")} className="inline-flex min-h-11 items-center px-1 font-semibold text-blue-600 underline underline-offset-2">
              Start from scratch
            </button>
          </p>

          </div>

        </div>
      )}

      <div className="mx-auto max-w-3xl space-y-4">
      {/* Asked after the job and resume boxes, not before them, so the first thing on the page is the box to drop a job into. */}
      {!fast && hydrated && phase === "form" && <StartQuestion value={intent} onChange={chooseIntent} />}
      {!fast && (<>
      <div className="rounded-3xl border border-border-subtle bg-white p-5 shadow-lg shadow-blue-900/5 transition-shadow focus-within:border-blue-500/40 focus-within:shadow-xl sm:p-6">
        <button
          type="button"
          onClick={() => setNotesOpen((o) => !o)}
          aria-expanded={notesShown}
          aria-controls="rt-notes-panel"
          className="flex w-full items-center gap-3 text-left"
        >
          <span aria-hidden className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-bold transition-colors ${tidyNotes(notes) ? "bg-green-600 text-white" : "bg-blue-600/10 text-blue-700"}`}>
            {tidyNotes(notes) ? "✓" : notesShown ? "−" : "+"}
          </span>
          <span className="flex-1">
            <span className="block text-lg font-bold tracking-tight">
              Tell us more about you <span className="text-sm font-normal text-foreground-muted">(optional)</span>
            </span>
            <span className="block text-sm text-foreground-muted">Add anything that isn&apos;t on your resume. It makes your resume and letter sound like you.</span>
          </span>
        </button>
        <div id="rt-notes-panel" hidden={!notesShown} className="mt-3">
        <div className="mt-3 flex flex-wrap gap-2 sm:pl-10">
          {NOTE_STARTERS.map((starter) => (
            <button key={starter} type="button" onClick={() => insertStarter(starter)} className="rounded-full border border-border-subtle bg-background px-3 py-1 text-xs transition-colors hover:border-blue-500/40">
              + {starter.replace(/: $/, "")}
            </button>
          ))}
        </div>
        <textarea
          ref={notesRef}
          id="rt-notes"
          aria-label="Tell us more about you (optional)"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="For example: I volunteer as a youth mentor. I use Canva and Notion every day. I'm finishing a Google Career Certificate. I'm great at calming upset customers."
          className={`${input} mt-3 resize-y`}
        />
        <div className="mt-2 sm:pl-10">
          <VoiceInput onText={(t) => setNotes((prev) => `${prev}${prev && !/\s$/.test(prev) ? " " : ""}${t}`)} />
        </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border-subtle bg-white p-5 shadow-lg shadow-blue-900/5 transition-shadow focus-within:border-blue-500/40 focus-within:shadow-xl sm:p-6">
        <div className="flex items-center gap-3">
          <span aria-hidden className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold text-white shadow-sm transition-colors ${emailReady ? "bg-green-600" : "bg-gradient-to-br from-blue-600 to-violet-600"}`}>
            {emailReady ? "✓" : 3}
          </span>
          <p className="text-lg font-bold tracking-tight">Last step: your email</p>
        </div>
        <p className="mt-1.5 text-sm text-foreground-muted sm:pl-12">We use it to count your 2 free builds, and to email you a copy of your resume if you want one.</p>
        <div className="mt-3 grid gap-3 sm:ml-12 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold" htmlFor="rt-email">
              Your email
            </label>
            <input id="rt-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email" className={`${input} mt-1`} />
            {emailHint && (
              <p role="status" className="mt-1 text-xs text-amber-700">
                Did you mean{" "}
                <button type="button" onClick={() => setEmail(emailHint)} className="font-semibold underline underline-offset-2">
                  {emailHint}
                </button>
                ?
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold" htmlFor="rt-source">
              How did you find us?
            </label>
            <select id="rt-source" value={source} onChange={(e) => setSource(e.target.value)} className={`${input} mt-1`}>
              <option value="" disabled>
                Choose one
              </option>
              {SOURCES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <label className="mt-3 flex cursor-pointer items-start gap-3 sm:ml-12">
          <input type="checkbox" checked={emailCopy} onChange={(e) => setEmailCopy(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600" />
          <span className="text-sm">
            <span className="font-semibold">Email me a copy</span> of my resume (PDF and Word) when it&apos;s ready.
            <span className="block text-xs text-foreground-muted">It goes to the email address above the moment it&apos;s ready, so check that it&apos;s right. You can also download everything on the next screen.</span>
          </span>
        </label>
      </div>

      <div hidden={general} className="rounded-3xl border border-border-subtle bg-white p-5 shadow-lg shadow-blue-900/5 transition-shadow focus-within:border-blue-500/40 focus-within:shadow-xl sm:p-6">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={wantLetter} onChange={(e) => setWantLetter(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600" />
          <span>
            <span className="block text-sm font-semibold">Also write a cover letter</span>
            <span className="block text-xs text-foreground-muted">Matched to this job. Worth including when the posting asks for one or you are writing to a hiring manager. Included with your free build.</span>
          </span>
        </label>
        {wantLetter && (
          <div className="mt-3 sm:ml-7">
            <label className="block text-xs font-semibold" htmlFor="rt-manager">
              Who should it be addressed to? <span className="font-normal text-foreground-muted">(if you know)</span>
            </label>
            <p className="mt-0.5 text-xs text-foreground-muted">Best is the hiring manager&apos;s full name, like Jamie Alvarez. Leave it blank if you can&apos;t find one, and we&apos;ll address it to the company&apos;s hiring team.</p>
            <details className="mt-2 rounded-xl border border-border-subtle bg-background px-3 py-2 text-xs">
              <summary className="cursor-pointer font-semibold">Not sure who to address it to?</summary>
              <div className="mt-2 space-y-2 text-foreground-muted">
                <p>Most career guides agree on this order:</p>
                <ol className="list-decimal space-y-1 pl-5">
                  <li>
                    <span className="font-semibold text-foreground">A real person&apos;s name.</span> It shows you did your homework. Example: &ldquo;Dear Jamie Alvarez,&rdquo;
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">The company&apos;s hiring team.</span> The safe choice when there&apos;s no name. Example: &ldquo;Dear Spotify Hiring Team,&rdquo;
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">The team you&apos;d join,</span> if the posting names it. Example: &ldquo;Dear Customer Success Team,&rdquo;
                  </li>
                </ol>
                <p>&ldquo;To whom it may concern&rdquo; sounds like a form letter, so we never use it. Small details like this rarely decide an application, but a real name is the one that stands out.</p>
                <p className="font-semibold text-foreground">Ways to find a name</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Read the posting again: many name a contact or a recruiter near the bottom.</li>
                  <li>Search the company on LinkedIn for the team&apos;s manager, or a recruiter at that company.</li>
                  <li>Check the company&apos;s careers or &ldquo;Our team&rdquo; page.</li>
                  <li>Call the company and ask who is hiring for the role. Career counselors call this the most reliable way.</li>
                  <li>Ask anyone you know who works there.</li>
                </ul>
                <p>If you only find the manager&apos;s boss, that works too. A wrong guess is worse than no name, so only use a name you&apos;re sure of.</p>
              </div>
            </details>
            <input id="rt-manager" value={hiringManager} onChange={(e) => setHiringManager(e.target.value)} placeholder="Full name, like Jamie Alvarez, or leave blank" className={`${input} mt-1`} />
          </div>
        )}
      </div>
      </>)}

      {outOfBuilds ? (
        <div id="rt-problem">
          <BuyMore
            email={email.trim()}
            afterPayment={justPaid}
            onBeforeCheckout={saveDraft}
            onPlansKnown={setNothingToBuy}
            onTryAnother={() => {
              setOutOfBuilds(false);
              setError("");
              setLanePref("full");
              window.setTimeout(() => document.getElementById("rt-email")?.focus(), 120);
            }}
          />
        </div>
      ) : (
        justPaid && (
          <div role="status" className="rounded-2xl border-2 border-green-600/50 bg-green-600/10 p-4 sm:p-5">
            <p className="text-base font-semibold text-green-900">
              <span aria-hidden>✓ </span>Payment received. One more step: press the button below to build your resume.
            </p>
            <p className="mt-1 text-sm text-green-900/80">
              {draftBack === "yes" && "Your builds are added to the email you paid with, and we kept everything you entered. Your resume has not been built yet."}
              {draftBack === "files" && "Your builds are added to the email you paid with, and we kept what you typed. Add your resume file or screenshot again, then press the button below. Your resume has not been built yet."}
              {draftBack === "" && "Your builds are added to the email address you paid with, so use that same email below. Your resume has not been built yet."}
            </p>
          </div>
        )
      )}

      {fromScanner && !reloadNote && (
        <div role="status" className="rounded-2xl border-2 border-green-600/40 bg-green-600/10 p-4 text-sm sm:p-5">
          <p className="font-semibold text-green-900">We brought your resume and the job posting over from the keyword scanner.</p>
          <p className="mt-1 text-green-900/80">Add your email in step 3, then press the Build button. Check both boxes first and fix anything that looks off.</p>
        </div>
      )}

      {reloadNote && (
        <div role="status" className="rounded-2xl border-2 border-amber-500/50 bg-amber-500/10 p-4 text-sm sm:p-5">
          <p className="font-semibold">The page reloaded while your resume was building.</p>
          <p className="mt-1 text-foreground-muted">
            {reloadNote === "checking" && "Checking that build and putting your answers back…"}
            {reloadNote === "back" && "Phones sometimes do this when you switch apps. We put your answers back, and that build was not counted against you. Press the Build button when you are ready, and stay on this page until it finishes."}
            {reloadNote === "limit" && "We put your answers back, but could not give that build back automatically. Email info@thewarthens.com and we will fix it right away."}
          </p>
        </div>
      )}

      {error && !outOfBuilds && (
        <p id="rt-problem" role="alert" className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {!(outOfBuilds && nothingToBuy && !justPaid) && (
      <div className="pt-1">
        <label className="mb-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-border-subtle bg-white px-4 py-3 shadow-sm">
          <input type="checkbox" checked={shareOk} onChange={(e) => setShareOk(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600" />
          <span className="text-sm">
            I&apos;m willing to let The Warthens use this resume-building session to improve this web application.
          </span>
        </label>
        <button
          ref={buildButton}
          type="submit"
          className={`rb-cta inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-semibold text-white ${justPaid ? "ring-4 ring-green-500/50 ring-offset-2" : ""}`}
        >
          {justPaid ? (wantLetter ? "Press here to build my resume and cover letter" : "Press here to build my resume") : wantLetter ? "Build my resume and cover letter" : "Build my resume"}
          <span aria-hidden>→</span>
        </button>
        {missing.length > 0 && <p className="mt-2 text-center text-xs text-foreground-muted">Still needed: {missing.join(", ")}.</p>}
        <p className="mt-3 text-center text-xs text-foreground-muted">
          Your first 2 builds are free. We send your resume and the posting, including any files or screenshots, to an AI service (Anthropic&apos;s Claude) to write your documents. We use your email to count your free builds, to send the copy you ask for (through our email service, Resend), and we may send the occasional resource. By submitting your email, you consent to receive communications from The Warthens. You can opt out at any time by replying to any email from us. We only reword what&apos;s in your resume and notes. We never add experience you don&apos;t have.
        </p>
      </div>
      )}
      </div>
    </form>

    <ApplicationsList entries={library} onOpen={(id) => openEntry(id)} onFollowUp={(id) => openEntry(id, true)} onResult={markOutcome} onToggleApplied={toggleApplied} onRemove={removeEntry} />

    {fast && hydrated && (
      <ProfilePanel
        applications={library.length}
        hasSaved={saved !== null}
        resumeText={saved?.resume ?? ""}
        notesText={saved?.notes ?? ""}
        stories={stories}
        useStories={includeStories}
        onUseStories={setIncludeStories}
        onRemoveStory={(id) => setStories((cur) => cur.filter((s) => s.id !== id))}
        onImport={importProfile}
        onExport={exportProfile}
        onForget={forgetProfile}
      />
    )}
    </div>
  );
}

