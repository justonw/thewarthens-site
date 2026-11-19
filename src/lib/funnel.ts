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
  "numbers-answered", // added a real number to a bullet with the numbers coach
  "answers-opened", // opened "Answers" on a finished resume
  "answers-written", // got a drafted answer to an application question
  "followup-opened", // opened a follow-up message from a nudge on My applications
  "followup-written", // copied a follow-up message
  "next-job", // pressed "Next job" after a build (a second job in one visit)
  "build-reopened", // opened a saved build from "My applications"
  // Which parts of the site get visited (once per visit, no cookies, no person attached).
  "view-home",
  "view-tech",
  "view-faith",
  "view-techjr",
  "view-coaching",
  "view-contact",
  // Which doors on the Home page get used.
  "hero-tech", // the main button in the Home hero
  "door-career", // "Find my next career move"
  "door-resume", // "Get a better resume"
  "door-faith", // "Grow in my faith"
  "door-kids", // "Games for my kids"
  "door-coaching", // "Talk it through with a coach"
  // Things people finished.
  "contact-sent", // sent a message from Contact
  "coaching-requested", // sent the coaching questionnaire
  "notes-signup", // joined the occasional notes list
  "toolkit-requested", // asked for the printable toolkit
] as const;

export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];
export const isFunnelEvent = (v: unknown): v is FunnelEvent => typeof v === "string" && (FUNNEL_EVENTS as readonly string[]).includes(v);

export const dayKey = (now = new Date()) => `funnel/${now.toISOString().slice(0, 10)}`;
export const eventKey = (event: FunnelEvent, now = new Date()) => `${dayKey(now)}/${event}`;
