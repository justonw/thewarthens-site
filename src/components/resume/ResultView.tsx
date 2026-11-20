"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildLabel, usageLine, type Usage } from "@/lib/resume-usage";
import { contactGaps, type CoverLetter, type ResumeDoc, type ResumeGap, type TailorResult } from "@/lib/resume-tailor";
import { keywordCoverage, runAtsCheck } from "@/lib/resume-ats";
import { RESUME_STYLES, buildCoverLetterDocx, buildCoverLetterPdf, buildDocx, buildPdf, coverLetterFileName, resumeFileName, resumeToPlainText, type ResumeStyle } from "@/lib/resume-files";
import { downloadBlob } from "@/lib/download";
import { track } from "@/lib/track";
import { usePersistentState } from "@/lib/use-persistent-state";
import { NO_TRACKER_ENTRIES, TRACKER_KEY, type TrackerEntry } from "@/lib/job-tracker";
import ResumeEditor from "./ResumeEditor";
import CoverLetterEditor from "./CoverLetterEditor";
import NextSteps from "./NextSteps";
import { Confetti, ReadinessRing } from "./Celebrate";
import ShareCard from "./ShareCard";
import StrengthenPanel from "./StrengthenPanel";
import OutreachPanel from "./OutreachPanel";
import AnswersPanel from "./AnswersPanel";
import InterviewPanel from "./InterviewPanel";
import { sheetToPlainText, type PrepSheet } from "@/lib/interview";
import { answersToText, cleanLetter, fileSlug, messagesToText } from "@/lib/kit-export";
import LookPanel from "./LookPanel";
import { DEFAULT_LOOK, LOOK_KEY, cleanLook, type LookOptions } from "@/lib/resume-look";
import NumbersCoach from "./NumbersCoach";
import KitNav, { type KitId, type KitItem } from "./KitNav";
import BeforeYouSend, { type ReadyItem } from "./BeforeYouSend";
import DownloadHub, { type HubRow } from "./DownloadHub";
import MakeStronger from "./MakeStronger";
import { STORIES_KEY, addStoryTo, newStory, noStories, type Story } from "@/lib/resume-profile";
import { cleanDoc, sameJob, type SavedAnswer, type SavedMessage } from "@/lib/resume-library";
import type { Purpose } from "@/lib/outreach";

type Tab = "resume" | "letter" | "reach" | "answers" | "interview";

const card = "rounded-2xl border border-border-subtle bg-background-elevated p-5";
const input =
  "w-full rounded-xl border border-border-subtle bg-background px-3 py-2 text-sm outline-none focus:border-blue-500/50";

const refineErrors: Record<string, string> = {
  "refine-limit": "You've used this month's quick updates. You can still edit your resume by hand.",
  "slow-down": "That was a lot of tries in a short time. Wait a few minutes and try again.",
  upstream: "That didn't work this time. Try again in a moment.",
  cap: "We've reached our limit for quick updates this month. You can still edit your resume by hand.",
  email: "Add your email address above to use quick updates.",
};

function Highlighted({ text, keywords }: { text: string; keywords: string[] }) {
  const escaped = keywords.map((k) => k.trim()).filter(Boolean).map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (escaped.length === 0) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "gi"));
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded bg-amber-200/80 px-0.5 text-foreground">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

// Your original next to the tailored one, with the posting's key terms highlighted in both. The counts are real.
function Compare({ original, tailored, keywords }: { original: string; tailored: string; keywords: string[] }) {
  const before = keywordCoverage(original, keywords);
  const after = keywordCoverage(tailored, keywords);
  return (
    <details className="group rounded-2xl border border-border-subtle bg-background-elevated">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 text-sm font-semibold">
        <span>
          See what changed
          {keywords.length > 0 && (
            <span className="ml-2 font-normal text-foreground-muted">
              Posting terms found: {before.found.length} of {keywords.length} before, {after.found.length} of {keywords.length} now
            </span>
          )}
        </span>
        <span aria-hidden className="shrink-0 text-foreground-muted transition-transform group-open:rotate-180">⌄</span>
      </summary>
      <div className="grid gap-4 px-5 pb-5 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Your original</p>
          <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-background p-3 text-xs leading-relaxed">
            <Highlighted text={original} keywords={keywords} />
          </pre>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-700">Tailored for this job</p>
          <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-background p-3 text-xs leading-relaxed">
            <Highlighted text={tailored} keywords={keywords} />
          </pre>
        </div>
        <p className="text-xs text-foreground-muted md:col-span-2">Highlighted words are the key terms from the job posting.</p>
      </div>
    </details>
  );
}

// The nudge toward "Reach out": a short message to a real person. Shown under the result and again near the bottom,
// so someone who finishes the resume sees it without hunting.
function ReachCallout({ company, onOpen }: { company: string; onOpen: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-600/10 via-background-elevated to-violet-600/10 p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-3 sm:gap-4">
        <span aria-hidden className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-md shadow-blue-900/20">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" />
            <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
          </svg>
        </span>
        <div>
          <p className="font-semibold">Next: get it in front of a real person</p>
          <p className="mt-0.5 text-sm text-foreground-muted">
            We&apos;ll write a short message to a recruiter or the hiring manager{company ? ` at ${company}` : ""}, using this resume. About 15 seconds.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-500 sm:w-auto"
      >
        Write my message
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}

export default function ResultView({
  result,
  doc,
  onDoc,
  letter,
  letterFailed = false,
  onLetter,
  gaps,
  onGaps,
  onSaveProfile,
  changes,
  onChanges,
  email,
  emailCopy = false,
  remaining,
  usage,
  original,
  onStartOver,
  initialStyle,
  onStyleChange,
  applied = false,
  onToggleApplied,
  messages,
  onMessage,
  startOnReach = false,
  startTab,
  answers,
  onAnswer,
  interview,
  onInterview,
  initialPurpose,
  appliedDaysAgo,
  onFollowedUp,
}: {
  result: TailorResult;
  doc: ResumeDoc;
  onDoc: (d: ResumeDoc) => void;
  letter: CoverLetter | null;
  letterFailed?: boolean;
  onLetter: (l: CoverLetter) => void;
  gaps: ResumeGap[];
  onGaps: (g: ResumeGap[]) => void;
  // Downloads the saved profile as a file (shown as a card once a resume is built).
  onSaveProfile?: () => void;
  changes: string[];
  onChanges: (c: string[]) => void;
  email: string;
  emailCopy?: boolean;
  remaining: number | null;
  usage?: Usage | null;
  // The resume text the person gave us, for the before-and-after view. Null when it came from a file or from scratch.
  original: string | null;
  onStartOver: () => void;
  // A saved build keeps the template the person chose, and whether they have applied to the job.
  initialStyle?: ResumeStyle;
  onStyleChange?: (s: ResumeStyle) => void;
  applied?: boolean;
  onToggleApplied?: () => void;
  // The messages already written for this job (from "My applications"), and a way to keep each new one.
  messages?: SavedMessage[];
  onMessage?: (m: SavedMessage) => void;
  // Opened from a follow-up nudge: start on "Reach out", on the follow-up message.
  startOnReach?: boolean;
  // Which part of the kit to open first after a build, from the starting question. Ignored for a general resume.
  startTab?: "reach" | "interview";
  // Application answers already drafted for this job, and a way to keep each new one.
  answers?: SavedAnswer[];
  onAnswer?: (a: SavedAnswer) => void;
  // The interview prep sheet already built for this job, and a way to keep a new one.
  interview?: PrepSheet | null;
  onInterview?: (s: PrepSheet) => void;
  initialPurpose?: Purpose;
  appliedDaysAgo?: number | null;
  onFollowedUp?: () => void;
}) {
  const [tab, setTab] = useState<Tab>(startOnReach ? "reach" : result.general !== true && startTab ? startTab : "resume");
  // Opens "Answers" the same way.
  function openAnswers() {
    setTab("answers");
    track("answers-opened");
    window.setTimeout(() => document.getElementById("rt-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  }
  // Opens "Interview prep" the same way.
  function openInterview() {
    setTab("interview");
    track("interview-opened");
    window.setTimeout(() => document.getElementById("rt-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  }
  // Opens "Reach out" and brings the tabs into view, so the new step is the first thing on screen.
  function openReach() {
    setTab("reach");
    track("outreach-opened");
    window.setTimeout(() => document.getElementById("rt-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  }
  // Each true answer to a gap-coach question is kept in this browser as a "story", for the next resume.
  const [stories, setStories] = usePersistentState<Story[]>(STORIES_KEY, noStories);
  // How the files are laid out (skills, summary, size). Remembered for the next resume; it never changes the words.
  const [lookRaw, setLookRaw] = usePersistentState<LookOptions>(LOOK_KEY, DEFAULT_LOOK);
  const look = useMemo(() => cleanLook(lookRaw), [lookRaw]);
  const [busy, setBusy] = useState<"" | "pdf" | "docx">("");
  const [justAdded, setJustAdded] = useState("");
  const design = result.design;
  // When we could see the original's look, start with it, as the person asked for.
  const [style, setStyleState] = useState<ResumeStyle>(initialStyle ?? (design ? "custom" : "classic"));
  const setStyle = (next: ResumeStyle) => {
    setStyleState(next);
    onStyleChange?.(next);
  };
  // The preview is shown from the start: choosing a template changes only the download, so without a preview
  // nothing on the page would seem to change.
  // Phones cannot show a PDF inside a page (Android shows a blank box, iPhones show only the first page), so there the
  // preview opens in its own tab instead. This screen only ever renders in the browser, so the check is safe here.
  const [onPhone] = useState(() => typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  // Instagram, TikTok, Facebook, LinkedIn and similar apps open links in their own mini browser, which often blocks
  // file downloads without saying so. Warn people there and point them to the email copy or their real browser.
  const [inApp] = useState(() => typeof navigator !== "undefined" && /FBAN|FBAV|FB_IAB|Instagram|LinkedInApp|TikTok|musical_ly|BytedanceWebview|Snapchat|Pinterest|Line\/|MicroMessenger|; wv\)/i.test(navigator.userAgent));
  const [preview, setPreview] = useState(true);
  const [built, setBuilt] = useState<{ url: string; key: string }>({ url: "", key: "" });
  const previewUrl = built.url;

  const finalDoc = useMemo(() => cleanDoc(doc), [doc]);
  const ats = useMemo(() => runAtsCheck(finalDoc, result.postingTitle, result.postingKeywords), [finalDoc, result.postingTitle, result.postingKeywords]);
  const flags = ats.rows.filter((r) => r.status === "flag").length;
  const contactMissing = contactGaps(finalDoc.contact);

  // Add to the job tracker (kept in this browser, the same list as the tracker on the Tech Journey page).
  const [entries, setEntries] = usePersistentState<TrackerEntry[]>(TRACKER_KEY, NO_TRACKER_ENTRIES);
  const [company, setCompany] = useState(result.postingCompany);
  const [role, setRole] = useState(result.postingTitle);
  const [tracked, setTracked] = useState<"" | "added" | "exists">("");
  // The builder puts every new job in the tracker, so most of the time this is already done.
  // A general resume (no posting): there is no company to reach, no job to answer for, and nothing to track yet.
  const general = result.general === true;
  const inTracker = entries.some((x) => sameJob(x, { company: result.postingCompany, role: result.postingTitle }));

  // "Before you send": what is needed, with the button that fixes each thing. Reading it through is the person's own tick.
  const [readThrough, setReadThrough] = useState(false);
  // How many optional improvements are still open, reported by the gap coach and the numbers coach for the one shared progress.
  const [gapStat, setGapStat] = useState({ open: 0, total: 0, visible: false });
  const [numStat, setNumStat] = useState({ open: 0, total: 0, visible: false });
  const onGapStatus = useCallback((x: { open: number; total: number; visible: boolean }) => setGapStat((p) => (p.open === x.open && p.total === x.total && p.visible === x.visible ? p : x)), []);
  const onNumStatus = useCallback((x: { open: number; total: number; visible: boolean }) => setNumStat((p) => (p.open === x.open && p.total === x.total && p.visible === x.visible ? p : x)), []);
  function jumpTo(id: string, focus = false) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    if (focus) window.setTimeout(() => el.focus(), 350);
  }
  // Missing contact details already have their own line, so they are not counted again under "Resume check".
  const otherFlags = ats.rows.filter((r) => r.status === "flag" && r.id !== "contact");
  const missingContact = [contactMissing.email && "email address", contactMissing.phone && "phone number"].filter(Boolean).join(" or ");
  const readyItems: ReadyItem[] = [
    missingContact
      ? { id: "contact", label: "Contact details", detail: `No ${missingContact} made it onto the resume. A recruiter needs a way to reach you.`, state: "fix", action: { label: "Add it", onClick: () => jumpTo("rt-contact-fix", true) } }
      : { id: "contact", label: "Contact details", detail: "Your email and phone are on it.", state: "ok" },
    otherFlags.length > 0
      ? { id: "checks", label: "Resume check", detail: `${otherFlags.map((r) => r.label).join(", ")}.`, state: "fix", action: { label: "See what", onClick: () => jumpTo("resume-check") } }
      : { id: "checks", label: "Resume check", detail: `All ${ats.rows.length} checks pass.`, state: "ok" },
  ];
  // The kit: every part a finished resume leads to, in the order a job search happens, each marked done or needing something.
  // The same count the "Before you send" card shows: open needed items, including reading it through.
  const resumeNeeds = readyItems.filter((i) => i.state === "fix").length + (readThrough ? 0 : 1);
  const hasMessage = (messages?.length ?? 0) > 0;
  const hasAnswer = (answers?.length ?? 0) > 0;
  const kitItems: KitItem[] = [
    {
      id: "resume",
      short: "Resume",
      title: "Polish your resume",
      when: "Now",
      state: resumeNeeds > 0 ? "needs" : "done",
      count: resumeNeeds,
      note: resumeNeeds > 0 ? `${resumeNeeds} thing${resumeNeeds === 1 ? "" : "s"} to do before you send` : "Ready to send",
    },
  ];
  if (letter) kitItems.push({ id: "letter", short: "Letter", title: "Cover letter", when: "Send with it", state: "done", note: "Written, ready to edit" });
  if (!general) {
    kitItems.push(
      { id: "reach", short: "Message", title: "Message someone there", when: "Before you apply", state: hasMessage ? "done" : "todo", note: hasMessage ? "A message is saved" : "A short note to a real person" },
      { id: "answers", short: "Answers", title: "Answer the application questions", when: "When you apply", state: hasAnswer ? "done" : "todo", note: hasAnswer ? "An answer is saved" : "Drafts for the questions they ask" },
      { id: "interview", short: "Interview", title: "Get ready for the interview", when: "When they reply", state: interview ? "done" : "todo", note: interview ? "Your prep sheet is saved" : "Likely questions for this job" }
    );
  }
  // What to do next: fix the resume first, then the first step not started.
  const nextKit: KitId | null = resumeNeeds > 0 ? "resume" : (kitItems.find((k) => k.state === "todo")?.id ?? null);
  function selectKit(id: KitId) {
    if (id === "reach") openReach();
    else if (id === "answers") openAnswers();
    else if (id === "interview") openInterview();
    else {
      setTab(id);
      window.setTimeout(() => document.getElementById("rt-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
    }
  }
  // "Your files": the panel that gathers every download, reachable from the strip, the rail, and the phone bar.
  const [hubOpen, setHubOpen] = useState(false);
  const [letterBusy, setLetterBusy] = useState<"" | "pdf" | "docx">("");
  const jobLine = `${result.postingTitle || doc.headline}${result.postingCompany ? ` at ${result.postingCompany}` : ""}`;
  const jobSlug = fileSlug(result.postingTitle || doc.headline);
  const textFile = (text: string, name: string) => downloadBlob(new Blob([text], { type: "text/plain;charset=utf-8" }), name);
  async function downloadLetter(kind: "pdf" | "docx") {
    if (!letter) return;
    setLetterBusy(kind);
    try {
      const clean = cleanLetter(letter);
      if (kind === "pdf") downloadBlob(new Blob([(await buildCoverLetterPdf(clean, finalDoc)) as BlobPart], { type: "application/pdf" }), coverLetterFileName(finalDoc, "pdf"));
      else downloadBlob(await buildCoverLetterDocx(clean, finalDoc), coverLetterFileName(finalDoc, "docx"));
    } finally {
      setLetterBusy("");
    }
  }
  const goTo = (id: KitId) => {
    setHubOpen(false);
    selectKit(id);
  };
  const hubRows: HubRow[] = [
    {
      id: "resume",
      title: "Resume",
      detail: `PDF or Word, in the ${RESUME_STYLES.find((x) => x.id === style)?.label ?? "Classic"} template.`,
      actions: [
        { label: "Download PDF", onClick: () => void download("pdf"), busy: busy === "pdf" },
        { label: "Download Word", onClick: () => void download("docx"), busy: busy === "docx" },
      ],
    },
  ];
  if (letter) {
    hubRows.push({
      id: "letter",
      title: "Cover letter",
      detail: "PDF or Word.",
      actions: [
        { label: "Download PDF", onClick: () => void downloadLetter("pdf"), busy: letterBusy === "pdf" },
        { label: "Download Word", onClick: () => void downloadLetter("docx"), busy: letterBusy === "docx" },
      ],
    });
  }
  if (!general) {
    hubRows.push(
      {
        id: "messages",
        title: "Messages",
        detail: hasMessage ? `${messages?.length ?? 0} saved for this job.` : "Short notes to a real person.",
        actions: hasMessage ? [{ label: "Download as text", onClick: () => textFile(messagesToText(messages ?? [], jobLine), `messages-${jobSlug}.txt`) }] : [],
        empty: { text: "Not written yet.", action: { label: "Write one", onClick: () => goTo("reach") } },
      },
      {
        id: "answers",
        title: "Application answers",
        detail: hasAnswer ? `${answers?.length ?? 0} saved for this job.` : "Drafts for the questions an application asks.",
        actions: hasAnswer ? [{ label: "Download as text", onClick: () => textFile(answersToText(answers ?? [], jobLine), `answers-${jobSlug}.txt`) }] : [],
        empty: { text: "Not drafted yet.", action: { label: "Draft one", onClick: () => goTo("answers") } },
      },
      {
        id: "interview",
        title: "Interview prep sheet",
        detail: interview ? "Likely questions and the facts from your history to use." : "Likely questions for this job.",
        actions: interview ? [{ label: "Download as text", onClick: () => textFile(sheetToPlainText(interview, jobLine), `interview-prep-${jobSlug}.txt`) }] : [],
        empty: { text: "Not built yet.", action: { label: "Build it", onClick: () => goTo("interview") } },
      }
    );
  }

  function addToTracker(e: React.FormEvent) {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;
    const exists = entries.some((x) => x.company.toLowerCase() === company.trim().toLowerCase() && x.role.toLowerCase() === role.trim().toLowerCase());
    if (exists) {
      setTracked("exists");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    setEntries((prev) => [
      { id: crypto.randomUUID(), company: company.trim(), role: role.trim(), status: "Not Yet Applied", dateApplied: today, notes: "Resume tailored for this job." },
      ...prev,
    ]);
    setTracked("added");
  }

  // Emails the person their files (the same ones the download buttons make). Sent once on its own if they
  // ticked the box, and again whenever they ask, so the copy can include their edits.
  const [mailed, setMailed] = useState<"" | "sending" | "sent" | "failed">("");
  // When the email did not go, say why in plain words (a daily limit is not a fault, and the files can still be downloaded).
  const [mailWhy, setMailWhy] = useState("");
  // They ticked "email me a copy" on the form next to the address they typed, which is their say-so. The copy goes
  // out once, when the result first appears. A mistyped address is caught on the form, where the address is entered.
  const autoSent = useRef(false);
  useEffect(() => {
    if (!emailCopy || autoSent.current) return;
    const timer = window.setTimeout(() => {
      autoSent.current = true;
      void sendCopy();
    }, 300);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendCopy() {
    setMailed("sending");
    try {
      const b64 = async (blob: Blob) => {
        const bytes = new Uint8Array(await blob.arrayBuffer());
        let bin = "";
        for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        return btoa(bin);
      };
      // A job title can be very long, so the names sent by email are kept to a sensible length.
      const short = (name: string) => {
        const dot = name.lastIndexOf(".");
        const base = name.slice(0, dot);
        return base.length > 90 ? `${base.slice(0, 90).replace(/-+$/, "")}${name.slice(dot)}` : name;
      };
      const files = [
        { name: short(resumeFileName(finalDoc, "pdf")), data: await b64(new Blob([(await buildPdf(finalDoc, style, design, look)) as BlobPart])) },
        { name: short(resumeFileName(finalDoc, "docx")), data: await b64(await buildDocx(finalDoc, style, design, look)) },
      ];
      if (letter) {
        files.push(
          { name: short(coverLetterFileName(finalDoc, "pdf")), data: await b64(new Blob([(await buildCoverLetterPdf(letter, finalDoc)) as BlobPart])) },
          { name: short(coverLetterFileName(finalDoc, "docx")), data: await b64(await buildCoverLetterDocx(letter, finalDoc)) }
        );
      }
      const res = await fetch("/api/resume-email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, jobTitle: result.postingTitle, files, buildNote: usage ? buildLabel(usage) ?? undefined : undefined }),
      });
      if (!res.ok) {
        const why = (await res.json().catch(() => ({}))) as { error?: string };
        setMailWhy(
          why.error === "copies-used"
            ? "The emailed copies that come with your builds (2 per build: the one sent automatically and one resend) are used up. Your files are still here to download."
            : why.error === "send-failed"
              ? "We couldn't send your email just now, and it didn't use up one of your copies. Your files are ready to download below, and you can press \"Email me a copy\" again in a little while."
              : why.error === "slow-down"
              ? "That was a lot of copies in a short time. Wait a few minutes and press \"Email me a copy\", or download your files below."
              : ""
        );
      } else setMailWhy("");
      setMailed(res.ok ? "sent" : "failed");
    } catch {
      setMailed("failed");
    }
  }

  async function download(kind: "pdf" | "docx") {
    track("download");
    setBusy(kind);
    try {
      if (kind === "pdf") {
        downloadBlob(new Blob([(await buildPdf(finalDoc, style, design, look)) as BlobPart], { type: "application/pdf" }), resumeFileName(finalDoc, "pdf"));
      } else {
        downloadBlob(await buildDocx(finalDoc, style, design, look), resumeFileName(finalDoc, "docx"));
      }
    } finally {
      setBusy("");
    }
  }

  // A live preview of the PDF in the chosen style. It is rebuilt a moment after any edit or style change, and the
  // old one stays on screen (marked as updating) until the new one is ready.
  const previewKey = useMemo(() => `${style}|${JSON.stringify(finalDoc)}|${design ? design.accent : ""}|${JSON.stringify(look)}`, [style, finalDoc, design, look]);
  const updating = preview && built.key !== previewKey;
  useEffect(() => {
    if (!preview) return;
    let cancelled = false;
    let url = "";
    const timer = setTimeout(async () => {
      const bytes = await buildPdf(finalDoc, style, design, look);
      if (cancelled) return;
      url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
      setBuilt({ url, key: previewKey });
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      // The address of an older preview is released once a newer one has replaced it.
      if (url) window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    };
  }, [preview, finalDoc, style, design, look, previewKey]);

  // "I have this": the person tells us in a sentence, and we add it to the resume.
  async function addGap(index: number, answer: string): Promise<string | null> {
    if (!email) return refineErrors.email;
    try {
      const res = await fetch("/api/resume-refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          doc: finalDoc,
          requirement: gaps[index].question ? `${gaps[index].requirement}. Question asked: ${gaps[index].question}` : gaps[index].requirement,
          answer,
          postingTitle: result.postingTitle,
          postingCompany: result.postingCompany,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) return refineErrors[data.error as string] ?? refineErrors.upstream;
      if (!data.added) return data.note || "Add a little more detail, like where you used it and for how long.";
      onDoc(data.resume as ResumeDoc);
      track("gap-answered");
      setStories((cur) => addStoryTo(cur, newStory(gaps[index].requirement, gaps[index].question ?? "", answer)));
      onGaps(gaps.filter((_, k) => k !== index));
      onChanges([data.note as string, ...changes]);
      setJustAdded(data.note as string);
      return null;
    } catch {
      return refineErrors.upstream;
    }
  }

  return (
    <div id="resume-tool" className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-gradient-to-br from-green-500/10 via-background-elevated to-violet-500/10 p-5 shadow-sm sm:p-6">
        <Confetti />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ReadinessRing passed={ats.rows.length - flags} total={ats.rows.length} />
            <div>
              {flags === 0 ? (
                <p className="rb-pop inline-flex items-center rounded-full bg-green-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">All checks passed</p>
              ) : (
                <p className="rb-pop inline-flex items-center rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  {flags} check{flags === 1 ? "" : "s"} to fix
                </p>
              )}
              <h2 className="mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">
                Your {general ? "general resume" : letter ? "resume and cover letter" : "resume"} for {result.postingTitle || doc.headline}
                {result.postingCompany ? ` at ${result.postingCompany}` : ""}
              </h2>
              {mailed !== "" && (
                <p role="status" className="mt-1 text-sm font-medium">
                  {mailed === "sending" && "Emailing you a copy…"}
                  {mailed === "sent" && <span className="text-green-700">A copy is on its way to {email}. If it doesn&apos;t show up, check spam.</span>}
                  {mailed === "failed" && <span className="text-red-700">{mailWhy || "We couldn't email your copy. You can still download your files below."}</span>}
                </p>
              )}
              <p className="mt-1 text-sm text-foreground-muted">
                Click any text to edit it. Read it through once before you send it.
                {usage ? ` ${usageLine(usage)}` : remaining !== null && (remaining > 0 ? ` You have ${remaining} ${remaining === 1 ? "build" : "builds"} left.` : " That was your last build, but you can keep editing and downloading this one.")}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setHubOpen(true)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-500">
              Download
              <span aria-hidden>↓</span>
            </button>
            <button type="button" onClick={onStartOver} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border-subtle bg-background px-5 py-2.5 text-sm font-semibold transition-colors hover:border-blue-500/40">
              {general ? "Tailor it to a job" : "Next job"}
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>

      {general && (
        <div role="note" className="rounded-3xl border border-violet-500/30 bg-violet-500/10 p-5">
          <p className="font-semibold">This is a general resume for {result.postingTitle || doc.headline}</p>
          <p className="mt-1 text-sm text-foreground-muted">It is not tailored to a specific job yet. A resume matched to one job description is the one that gets read. When you find a job you want, add it and we&apos;ll rebuild this resume for it, with a cover letter, outreach messages, and answers for the application.</p>
          <button type="button" onClick={onStartOver} className="mt-3 inline-flex min-h-10 items-center rounded-full border border-violet-500/40 bg-white px-5 text-sm font-semibold shadow-sm transition-colors hover:border-violet-500">
            Add a job and tailor this resume →
          </button>
        </div>
      )}

      {kitItems.length > 1 && <KitNav title={general ? "Your documents" : "Your job search kit"} items={kitItems} current={tab} nextId={nextKit} onSelect={selectKit} onOpenDownloads={() => setHubOpen(true)} />}

      {tab === "resume" && (
        <BeforeYouSend items={readyItems} readThrough={readThrough} onReadThrough={setReadThrough} openOptional={gapStat.open + numStat.open} onReviewOptional={() => jumpTo("make-stronger")} onJumpToDownload={() => jumpTo("rt-download")} />
      )}

      <div hidden={tab === "reach" || tab === "answers" || tab === "interview"} className="space-y-6">
    {(contactMissing.email || contactMissing.phone) && (
        <div role="alert" className="rounded-2xl border border-amber-500/50 bg-amber-500/10 p-5">
          <p className="font-semibold">
            {contactMissing.email && contactMissing.phone ? "No email or phone number made it onto this resume." : contactMissing.email ? "No email address made it onto this resume." : "No phone number made it onto this resume."}
          </p>
          <p className="mt-1 text-sm text-foreground-muted">A recruiter needs a way to reach you. Type your contact details here, separated by &ldquo;|&rdquo;, and they go straight into the header.</p>
          <label htmlFor="rt-contact-fix" className="sr-only">
            Your contact details
          </label>
          <input
            id="rt-contact-fix"
            type="text"
            value={doc.contact.join(" | ")}
            onChange={(e) => onDoc({ ...doc, contact: e.target.value.split("|") })}
            placeholder="Atlanta, GA | (555) 123-4567 | you@example.com"
            className="mt-3 w-full rounded-xl border border-border-subtle bg-background px-3 py-2 text-sm"
          />
        </div>
      )}

      <MakeStronger open={gapStat.open + numStat.open} total={gapStat.total + numStat.total} visible={gapStat.visible || numStat.visible}>
        <StrengthenPanel gaps={gaps} fit={result.fit} justAdded={justAdded} onAdd={addGap} embedded onStatus={onGapStatus} />
        <NumbersCoach
          doc={doc}
          onDoc={onDoc}
          email={email}
          keywords={result.postingKeywords}
          onAnswered={(topic, question, answer) => setStories((cur) => addStoryTo(cur, newStory(topic, question, answer)))}
          embedded
          onStatus={onNumStatus}
        />
      </MakeStronger>

      {letterFailed && !letter && (
        <p role="status" className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
          Your resume is ready, but the cover letter did not come through this time. You can download the resume now, and use &ldquo;Next job&rdquo; to try the letter again. Your resume and notes are saved here, so it only takes a moment.
        </p>
      )}
      </div>

      {!general && <div hidden={tab !== "reach"}>
        <OutreachPanel doc={finalDoc} result={result} gaps={gaps} email={email} saved={messages ?? []} onSave={onMessage} initialPurpose={initialPurpose} appliedDaysAgo={appliedDaysAgo} onFollowedUp={onFollowedUp} onBack={() => setTab("resume")} />
      </div>}

      {!general && <div hidden={tab !== "answers"}>
        <AnswersPanel
          doc={finalDoc}
          result={result}
          email={email}
          stories={stories}
          saved={answers ?? []}
          onSave={onAnswer}
          onStory={(topic, question, answer) => setStories((cur) => addStoryTo(cur, newStory(topic, question, answer)))}
          onBack={() => setTab("resume")}
        />
      </div>}

      {!general && tab === "interview" && (
        <InterviewPanel
          doc={finalDoc}
          result={result}
          email={email}
          stories={stories}
          saved={interview ?? null}
          onSave={onInterview}
          onStory={(topic, question, answer) => setStories((cur) => addStoryTo(cur, newStory(topic, question, answer)))}
          onBack={() => setTab("resume")}
        />
      )}

      {inApp && (
        <p role="status" className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
          You&apos;re in an app&apos;s built-in browser, which often blocks downloads. If a download doesn&apos;t start, use &ldquo;Email me a copy&rdquo; below, or open this page in Safari or Chrome (look for the menu or the &ldquo;Open in browser&rdquo; option).
        </p>
      )}

      {tab === "reach" || tab === "answers" || tab === "interview" ? null : tab === "letter" && letter ? (
        <CoverLetterEditor letter={letter} doc={finalDoc} onChange={onLetter} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <div id="rt-download" className="flex scroll-mt-28 flex-wrap items-center gap-2">
              <button onClick={() => download("pdf")} disabled={busy !== ""} className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60">
                {busy === "pdf" ? "Preparing…" : "Download PDF"}
              </button>
              <button onClick={() => download("docx")} disabled={busy !== ""} className="rounded-full border border-border-subtle bg-background-elevated px-5 py-2.5 text-sm font-semibold transition-colors hover:border-blue-500/40 disabled:opacity-60">
                {busy === "docx" ? "Preparing…" : "Download Word"}
              </button>
              <button onClick={sendCopy} disabled={mailed === "sending"} title={`Sends to ${email}`} className="rounded-full border border-border-subtle bg-background-elevated px-5 py-2.5 text-sm font-semibold transition-colors hover:border-blue-500/40 disabled:opacity-60">
                {mailed === "sending" ? "Sending…" : mailed === "sent" ? "Email it again" : "Email me a copy"}
              </button>
            </div>
            <p className="-mt-1 text-xs text-foreground-muted">{email ? `Email copies go to ${email}.` : "Add your email address on the form to email a copy."} Emailing sends your resume and cover letter through our email service (Resend).</p>
            <div className="space-y-2" role="group" aria-label="Download style">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="text-xs font-semibold text-foreground-muted">Template for your download</span>
                <div className="inline-flex flex-wrap rounded-2xl border border-border-subtle bg-white p-1 shadow-sm">
                  {design && (
                    <button
                      type="button"
                      aria-pressed={style === "custom"}
                      onClick={() => setStyle("custom")}
                      className={`rounded-full px-3.5 py-2.5 text-xs font-semibold transition-colors sm:py-1.5 ${style === "custom" ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white" : "text-blue-700 hover:text-blue-900"}`}
                    >
                      Match my resume
                    </button>
                  )}
                  {RESUME_STYLES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      aria-pressed={style === st.id}
                      title={st.note}
                      onClick={() => setStyle(st.id)}
                      className={`rounded-full px-3.5 py-2.5 text-xs font-semibold transition-colors sm:py-1.5 ${style === st.id ? "bg-foreground text-background" : "text-foreground-muted hover:text-foreground"}`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setPreview((v) => !v)} aria-expanded={preview} className="inline-flex min-h-11 items-center text-xs font-semibold sm:min-h-0 text-blue-600 underline underline-offset-2">
                  {preview ? "Hide preview" : "Preview the download"}
                </button>
              </div>
              <p className="text-xs text-foreground-muted">
                {style === "custom" && design ? (
                  <>
                    Matched your resume: {design.font === "serif" ? "serif" : "sans-serif"} type, {design.headerAlign} header
                    {design.accent && (
                      <>
                        , accent <span aria-hidden className="inline-block h-2.5 w-2.5 translate-y-px rounded-full align-baseline" style={{ backgroundColor: design.accent }} /> {design.accent}
                      </>
                    )}
                    , {design.columns > 1 ? "sections in the standard order (summary, skills, experience, training, education)" : "sections in your original order"}.
                    {(design.columns > 1 || design.hasGraphics) &&
                      " Your original used columns or graphics, which many hiring systems misread, so we kept one clean column."}
                  </>
                ) : (
                  RESUME_STYLES.find((x) => x.id === style)?.note
                )}
              </p>
              <LookPanel value={look} onChange={setLookRaw} />
              {preview && (
                <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm">
                  <p className="border-b border-border-subtle bg-background-elevated px-4 py-2 text-xs font-semibold text-foreground-muted">
                    Preview of your download ({style === "custom" ? "Match my resume" : (RESUME_STYLES.find((x) => x.id === style)?.label ?? style)})
                  </p>
                  {previewUrl && onPhone ? (
                    <p className="p-5 text-sm text-foreground-muted">
                      Phones can&apos;t show the preview inside the page.{" "}
                      <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold text-blue-600 underline underline-offset-2">
                        Open the preview in a new tab
                      </a>
                      . Come back here to keep editing.
                    </p>
                  ) : previewUrl ? (
                    <iframe title="Preview of your resume download" src={`${previewUrl}#toolbar=0&navpanes=0&view=FitH`} className="h-[560px] w-full" />
                  ) : (
                    <p className="p-6 text-center text-sm text-foreground-muted">Building the preview…</p>
                  )}
                  {updating && previewUrl && (
                    <span role="status" className="absolute right-3 top-10 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background shadow">
                      Updating…
                    </span>
                  )}
                  {previewUrl && !onPhone && (
                    <p className="border-t border-border-subtle px-4 py-2 text-xs text-foreground-muted">
                      Not showing on your phone?{" "}
                      <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 underline underline-offset-2">
                        Open the preview in a new tab
                      </a>
                      .
                    </p>
                  )}
                </div>
              )}
            </div>
            <ResumeEditor doc={doc} onChange={onDoc} />
            {original && <Compare original={original} tailored={resumeToPlainText(finalDoc)} keywords={result.postingKeywords} />}
          </div>

          <div className="space-y-4">
            <div id="resume-check" className={card}>
              <p className="font-semibold">Resume check</p>
              <p className="mt-1 text-xs text-foreground-muted">
                {flags === 0 ? "Everything on our checklist is covered." : `${flags} thing${flags === 1 ? "" : "s"} to look at.`} This updates as you edit.
              </p>
              <ul className="mt-3 space-y-2.5">
                {ats.rows.map((r) => (
                  <li key={r.id} className="flex gap-2.5 text-sm">
                    <span
                      aria-hidden
                      className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        r.status === "pass" ? "bg-green-600/15 text-green-700" : "bg-amber-500/20 text-amber-700"
                      }`}
                    >
                      {r.status === "pass" ? "✓" : "!"}
                    </span>
                    <span>
                      <span className="sr-only">{r.status === "pass" ? "Covered: " : "Look at this: "}</span>
                      <span className="font-medium">{r.label}.</span> <span className="text-foreground-muted">{r.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {onSaveProfile && (
              <div className={card}>
                <p className="font-semibold">Take your profile with you</p>
                <p className="mt-1 text-xs text-foreground-muted">
                  Your resume, notes, and the true answers you gave are saved on this device, so your next resume starts faster. Download a copy to keep it safe, or to use on another phone or computer.
                </p>
                <button type="button" onClick={onSaveProfile} className="mt-3 inline-flex min-h-10 items-center rounded-full border border-border-subtle bg-white px-5 text-sm font-semibold shadow-sm transition-colors hover:border-blue-500/40">
                  Download my profile
                </button>
              </div>
            )}

            {general ? null : inTracker ? (
              <div className={card}>
                <p className="font-semibold">In your job tracker ✓</p>
                <p className="mt-1 text-xs text-foreground-muted">
                  {result.postingTitle}
                  {result.postingCompany ? ` at ${result.postingCompany}` : ""}.{" "}
                  <Link href="/tech#tracker" className="font-semibold text-blue-600 underline underline-offset-2">
                    Open my tracker
                  </Link>
                </p>
                {onToggleApplied && (
                  <button
                    type="button"
                    onClick={onToggleApplied}
                    aria-pressed={applied}
                    className={`mt-3 inline-flex min-h-10 items-center rounded-full px-5 text-sm font-semibold transition-colors ${applied ? "bg-green-600 text-white hover:bg-green-700" : "border border-border-subtle bg-white shadow-sm hover:border-blue-500/40"}`}
                  >
                    {applied ? "Applied ✓ (tap to undo)" : "I applied for this job"}
                  </button>
                )}
              </div>
            ) : (
            <form onSubmit={addToTracker} className={card}>
              <p className="font-semibold">Applying for this job?</p>
              <p className="mt-1 text-xs text-foreground-muted">Add it to your job tracker so you remember to follow up.</p>
              <div className="mt-3 space-y-2">
                <input aria-label="Company" value={company} onChange={(e) => { setCompany(e.target.value); setTracked(""); }} placeholder="Company" className={input} />
                <input aria-label="Role" value={role} onChange={(e) => { setRole(e.target.value); setTracked(""); }} placeholder="Role" className={input} />
              </div>
              <button type="submit" disabled={!company.trim() || !role.trim()} className="mt-3 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50">
                Add to my tracker
              </button>
              {tracked && (
                <p role="status" className="mt-2 text-xs text-foreground-muted">
                  {tracked === "added" ? "Added. " : "That one is already in your tracker. "}
                  <Link href="/tech#tracker" className="font-semibold text-blue-600 underline underline-offset-2">
                    Open my tracker
                  </Link>
                </p>
              )}
            </form>
            )}

            {changes.length > 0 && (
              <div className={card}>
                <p className="font-semibold">What we did, and why</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-foreground-muted">
                  {changes.map((c, i) => (
                    <li key={`${i}-${c}`}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            <details className={`${card} text-sm`}>
              <summary className="cursor-pointer py-1 font-semibold">How a scanner reads it</summary>
              <p className="mt-2 text-xs text-foreground-muted">Hiring software first turns your resume into plain text like this. Ours is one column with standard headings, which most systems read well. We can&apos;t test every system, so a clean view here is a good sign, not a guarantee.</p>
              <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-background p-3 text-xs">{resumeToPlainText(finalDoc, look)}</pre>
            </details>
          </div>
        </div>
      )}

      {!general && tab !== "reach" && tab !== "answers" && tab !== "interview" && <ReachCallout company={result.postingCompany} onOpen={openReach} />}

      {!general && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-background-elevated p-4 sm:p-5">
          <p className="min-w-0 text-sm">
            <span className="font-semibold">Applying to more than one job?</span> <span className="text-foreground-muted">Each job gets its own resume, so it matches that posting.</span>
          </p>
          <button type="button" onClick={onStartOver} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-500">
            Next job
            <span aria-hidden>→</span>
          </button>
        </div>
      )}

      <NextSteps title={`${result.postingTitle} ${doc.headline}`} extra={result.postingKeywords.join(" ")} />

      <ShareCard />
      <DownloadHub open={hubOpen} onClose={() => setHubOpen(false)} rows={hubRows} email={email} mail={{ state: mailed, onSend: () => void sendCopy() }} onProfile={onSaveProfile} inApp={inApp} />
      {kitItems.length > 2 && <div className="h-16 xl:hidden" aria-hidden />}
    </div>
  );
}
