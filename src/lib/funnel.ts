// A private, first-party count of what people do on the resume tools, so we can see where they finish and where they leave.
// It records only "this step happened today", with no name, email, address, or anything they typed. The page sends each
// step at most once per visit.

export const FUNNEL_EVENTS = [
  "resume-visit", // opened the Resume Builder page
  "resume-added", // a resume was added (typed, pasted, or uploaded)
  "job-added", // a job posting was added
  "email-entered", // a valid email and "how you found us" were filled in
  "build-started", // pressed "Build my resume"
  "build-finished", // a resume came back
  "download", // downloaded a PDF or Word file
  "gap-answered", // answered a gap-coach question and it was added
  "profile-saved", // downloaded a profile file
  "returning-visit", // came back with a saved profile on this device
  "scanner-visit", // opened the free keyword scanner
  "scanner-checked", // ran the scanner
  "outreach-opened", // opened "Reach out" on a finished resume
  "outreach-written", // got a message back from "Reach out"
  "next-job", // pressed "Next job" after a build (a second job in one visit)
  "build-reopened", // opened a saved build from "My applications"
] as const;

export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];
export const isFunnelEvent = (v: unknown): v is FunnelEvent => typeof v === "string" && (FUNNEL_EVENTS as readonly string[]).includes(v);

export const dayKey = (now = new Date()) => `funnel/${now.toISOString().slice(0, 10)}`;
export const eventKey = (event: FunnelEvent, now = new Date()) => `${dayKey(now)}/${event}`;
