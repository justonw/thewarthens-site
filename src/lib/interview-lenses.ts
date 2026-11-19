// The "role lens" library for Interview prep.
//
// A posting rarely says what an interviewer for that KIND of role actually tests: the numbers people in the role are
// measured on, the exercises and role-plays used, the real situations of the work, and the compliance or confidentiality
// topics. A lens writes that down, once, for one kind of role. When a posting's title (or key terms) matches a lens, its
// notes are added to the prep prompt so the practice questions cover them.
//
// HOW TO ADD A LENS (the file grows over time, one lens at a time):
//   1. Copy an entry below and give it a new unique `id`.
//   2. `titleHints`: words or phrases that appear in job TITLES for this kind of role (lowercase, no punctuation).
//   3. `keywordHints`: terms that appear in the posting's key terms (a weaker signal; two are needed with no title hit).
//   4. Fill measured / exercises / situations / compliance with KINDS of things, in plain words. Never put a number,
//      a benchmark, a pay figure, a company name, or a "typical rate" in a lens: a lens describes what is tested, it
//      never states a fact about the person or the company.
//   5. Leave `status: "draft"` and `reviewedBy: ""`. A draft only reaches the owner's test builds.
//   6. Someone who has worked in that field reads it, fixes it, and then `status` becomes "reviewed" with their name (or
//      "source: <where it was checked>") in `reviewedBy` and the date in `updated`. Only reviewed lenses reach visitors.
//   7. Run `node --experimental-strip-types scripts/check-lenses.mts`. It checks the shape and the rules, tests that sample
//      job titles land on the right lens, and lists common titles that match nothing yet (the next lenses to write).
//
// This file stands on its own (no imports) so a script can test it without a build.

export type LensStatus = "draft" | "reviewed";

export type Lens = {
  id: string;
  name: string;
  status: LensStatus;
  // Who checked it and how ("" while a draft).
  reviewedBy: string;
  // The date it was last written or reviewed (YYYY-MM-DD).
  updated: string;
  titleHints: string[];
  keywordHints: string[];
  // What people in this kind of role are measured on (kinds of numbers, never the numbers).
  measured: string[];
  // Exercises, role-plays, and walkthroughs interviewers use.
  exercises: string[];
  // Real situations of the work that interviewers ask about.
  situations: string[];
  // Rules, privacy, or safety topics that come up. Empty when none do.
  compliance: string[];
};

export const LENSES: Lens[] = [
  {
    id: "sales",
    name: "Sales",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-19",
    titleHints: ["sales", "account executive", "account manager", "business development", "sdr", "bdr", "inside sales", "outside sales", "territory manager"],
    keywordHints: ["quota", "pipeline", "prospecting", "cold calling", "lead generation", "closing", "discovery", "crm"],
    measured: ["quota attainment", "pipeline built", "meetings or demos booked", "conversion between stages", "average deal size", "sales cycle length", "activity volume"],
    exercises: ["walk through a discovery call from the opening to the agreed next step", "a sell-me-this or pitch-the-product exercise", "handling a common objection such as price or timing", "a mock cold call or outreach message", "how they would plan a territory or a list of accounts"],
    situations: ["a prospect who goes quiet", "a deal lost to a competitor", "a stalled deal that needs a push", "handing a closed deal to the team that delivers it"],
    compliance: ["honest claims about the product", "do-not-call and email consent rules where they apply", "accurate records in the CRM"],
  },
  {
    id: "admin-office",
    name: "Administrative and office support",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-19",
    titleHints: ["administrative", "executive assistant", "office manager", "office coordinator", "receptionist", "secretary", "clerk", "data entry"],
    keywordHints: ["calendar management", "scheduling", "travel arrangements", "microsoft office", "filing", "phones", "correspondence"],
    measured: ["accuracy of the work", "turnaround on requests", "scheduling conflicts resolved", "supplies and vendor costs kept in line", "response time to messages and calls"],
    exercises: ["prioritize several competing requests from different people right now", "a scheduling puzzle with conflicts", "write or proofread a short professional email", "how they would organize a messy shared folder or process", "what they do when someone asks for information that is confidential", "how they decide what to handle themselves and what to bring to the person they support"],
    situations: ["two leaders who each want priority", "a last-minute change to travel or a meeting", "an error found after something was sent", "an upset caller or visitor", "overhearing or seeing something private", "a temporary assignment that ends and the handoff to the next person"],
    compliance: ["confidentiality of what they see and hear", "handling sensitive documents", "access to private calendars and email"],
  },
  {
    id: "healthcare-front-office",
    name: "Healthcare front office and billing",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-19",
    titleHints: ["patient access", "patient registration", "medical receptionist", "medical office", "medical secretary", "medical biller", "medical billing", "medical coder", "patient scheduler", "unit clerk", "insurance verification"],
    keywordHints: ["ehr", "epic", "hipaa", "insurance verification", "prior authorization", "copay", "registration", "patient scheduling"],
    measured: ["accuracy of registration and insurance information", "claims rejected or denied because of front-end errors", "copays collected at check-in", "check-in time and patient wait", "no-shows and how full the schedule is"],
    exercises: ["a patient arrives with missing or wrong insurance information, what are the steps", "explain a cost or copay to a patient clearly and kindly", "verify details on a described record and catch what does not match"],
    situations: ["an upset patient who has been waiting", "a patient in pain or distress at the desk", "a caller asking about another person's information", "a double-booked schedule", "the system going down at a busy time"],
    compliance: ["HIPAA privacy: who may be told what, and checking identity first", "sharing only the minimum needed", "accurate, complete patient records"],
  },
  {
    id: "nursing-clinical",
    name: "Nursing and clinical care",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-19",
    titleHints: ["nurse", "rn", "lpn", "lvn", "cna", "nursing assistant", "patient care technician", "patient care", "medical assistant", "phlebotomist", "emt", "paramedic", "respiratory therapist", "pharmacy technician"],
    keywordHints: ["charting", "medication administration", "vital signs", "bls", "acls", "patient assessment", "ehr", "care plan"],
    measured: ["patient load handled safely", "timely and accurate charting", "patient and family feedback", "safety events and near misses", "medication accuracy", "response to call lights and alarms"],
    exercises: ["a patient's condition changes during the shift, what do you do first", "prioritize several patients who all need something now", "give a handoff report at shift change", "describe how they double-check a medication or a procedure"],
    situations: ["an upset family member", "a disagreement with a colleague or provider", "a near miss or an error", "being short-staffed", "a patient who refuses care"],
    compliance: ["patient privacy", "scope of practice: what they may and may not do", "infection control", "accurate and timely documentation", "reporting safety concerns", "licenses and certifications they actually hold"],
  },
  {
    id: "skilled-trades",
    name: "Skilled trades and maintenance",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-19",
    titleHints: ["electrician", "plumber", "hvac", "carpenter", "welder", "mechanic", "machinist", "maintenance", "installer", "millwright", "lineman", "journeyman", "apprentice", "foreman", "service technician", "field technician"],
    keywordHints: ["osha", "blueprints", "troubleshooting", "installation", "repair", "building codes", "hand tools", "preventive maintenance"],
    measured: ["work done right the first time, without callbacks", "jobs finished on schedule", "safety record", "accuracy of material and time estimates", "customer feedback on site"],
    exercises: ["troubleshoot a described fault out loud, step by step", "read or explain a plan, drawing, or work order", "how they check their work before leaving", "describe the safety steps before starting a job"],
    situations: ["finding a hazard on site", "a customer who wants something outside the job", "a part or material that is not available", "a job running behind", "working around other trades"],
    compliance: ["safety rules and protective equipment", "lockout and tagout where it applies", "local codes and inspections", "licenses and certifications they actually hold"],
  },
  {
    id: "driving-logistics",
    name: "Driving, delivery, and logistics",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-19",
    titleHints: ["driver", "cdl", "delivery", "courier", "dispatcher", "dispatch", "logistics", "freight", "transportation", "route", "shipping coordinator"],
    keywordHints: ["cdl", "dot", "hours of service", "eld", "route planning", "freight", "dispatch", "deliveries"],
    measured: ["on-time delivery", "safe driving record", "accuracy of paperwork and delivery counts", "stops or loads handled", "vehicle inspection completion", "fuel and route efficiency"],
    exercises: ["how they plan a route when there is a delay", "walk through their pre-trip inspection", "what they do when their hours are running short", "for dispatch: how they prioritize loads and keep drivers informed"],
    situations: ["bad weather or heavy traffic", "damaged or missing freight", "a difficult customer at delivery", "a breakdown on the road", "pressure to skip a safety step to save time"],
    compliance: ["hours of service rules", "vehicle inspections", "safety rules", "accurate logs and paperwork", "license class and endorsements they actually hold"],
  },
  {
    id: "warehouse-production",
    name: "Warehouse and production",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-19",
    titleHints: ["warehouse", "forklift", "material handler", "picker", "packer", "production", "assembler", "machine operator", "manufacturing", "shipping and receiving", "inventory", "quality inspector"],
    keywordHints: ["forklift", "osha", "wms", "picking", "packing", "inventory", "lean", "quality control"],
    measured: ["pick and pack accuracy", "output per hour", "error and damage rates", "on-time shipment", "attendance and reliability", "safety record", "quality defects caught"],
    exercises: ["how they keep accuracy when output goals are high", "walk through safe equipment or forklift checks", "what they would do on finding a quality defect", "how they would organize a stock area"],
    situations: ["a count that does not match", "a coworker taking an unsafe shortcut", "a machine going down", "an order due soon", "a change of task or shift at short notice"],
    compliance: ["safety rules", "equipment certifications they actually hold", "lifting and ergonomics", "quality procedures"],
  },
  {
    id: "retail-hospitality",
    name: "Retail, food service, and hospitality",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-19",
    titleHints: ["retail", "cashier", "sales associate", "store associate", "barista", "server", "bartender", "host", "cook", "line cook", "restaurant", "hotel", "front desk agent", "housekeeper", "stocker"],
    keywordHints: ["pos", "cash handling", "food safety", "upselling", "customer service", "guest services"],
    measured: ["sales per hour or add-on sales", "speed of service", "accuracy of orders and the cash drawer", "customer or guest feedback", "attendance", "waste or inventory loss"],
    exercises: ["handle an upset customer who has a point", "how they handle a rush with a short team", "suggest an add-on without being pushy", "habits that keep orders and the drawer accurate"],
    situations: ["a customer complaint", "a long line", "a coworker who does not show up", "a customer who disagrees with a policy", "suspected theft"],
    compliance: ["cash handling", "age-restricted sales where they apply", "food safety and allergens", "workplace safety"],
  },
  {
    id: "teaching-education",
    name: "Teaching and education",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-19",
    titleHints: ["teacher", "instructor", "tutor", "teaching assistant", "paraprofessional", "professor", "school counselor", "principal", "educator"],
    keywordHints: ["curriculum", "classroom management", "iep", "lesson plans", "differentiation", "assessment", "standards"],
    measured: ["student growth and progress", "attendance and engagement", "how they use assessment results to adjust teaching", "parent and family communication", "feedback from observations"],
    exercises: ["describe a lesson they would teach and how they know students understood", "a classroom management scenario", "how they would support a student far behind or far ahead", "a short mock lesson or explanation"],
    situations: ["a disruptive student", "a frustrated parent", "very different needs in one room", "a lesson that did not work", "working with other staff"],
    compliance: ["student privacy", "mandated reporting duties", "supporting students with learning plans", "student safety", "the license or certification they actually hold"],
  },
  {
    id: "accounting-finance",
    name: "Accounting and finance",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-19",
    titleHints: ["accountant", "bookkeeper", "accounts payable", "accounts receivable", "payroll", "financial analyst", "controller", "auditor", "collections", "billing specialist"],
    keywordHints: ["reconciliation", "gaap", "month-end close", "quickbooks", "audit", "budgeting", "journal entries", "excel"],
    measured: ["accuracy of entries and reconciliations", "timeliness of the close and of payments", "time to collect or to pay", "errors found at review", "budget variances explained"],
    exercises: ["walk through how they reconcile an account and chase a difference", "a short spreadsheet or numbers exercise", "explain a variance to someone outside finance", "what they do when two numbers do not agree"],
    situations: ["a deadline at month end", "a vendor or employee disputing an amount", "an error found after posting", "being asked to adjust the numbers"],
    compliance: ["internal controls and separation of duties", "confidentiality of financial and pay information", "honest reporting", "certifications they actually hold"],
  },
  {
    id: "customer-service",
    name: "Customer service and support",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-19",
    titleHints: ["customer service", "customer support", "customer success", "customer experience", "call center", "contact center", "client services", "support specialist", "care representative"],
    keywordHints: ["tickets", "zendesk", "csat", "nps", "handle time", "de-escalation", "crm", "first contact resolution"],
    measured: ["customer satisfaction", "first-contact resolution", "response and handle time", "quality review results", "escalation rate", "retention or renewal for customer success roles"],
    exercises: ["role-play an angry customer", "explain a hard no kindly", "balance speed against thoroughness", "write a short reply to a described complaint"],
    situations: ["a customer demanding a refund against policy", "a problem the team cannot fix", "a long wait", "an abusive caller", "the same issue reported by many customers"],
    compliance: ["customer data privacy and checking identity", "accurate promises", "following refund and escalation policy"],
  },
  {
    id: "software-it",
    name: "Software, IT, and data",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-19",
    titleHints: ["software", "developer", "programmer", "web developer", "devops", "qa engineer", "it support", "help desk", "systems administrator", "network administrator", "security analyst", "data analyst", "data engineer", "technical support"],
    keywordHints: ["python", "javascript", "sql", "aws", "git", "api", "debugging", "active directory", "ticketing"],
    measured: ["tickets resolved and time to resolve", "reliability and incidents", "quality of work in code review", "delivery against estimates", "uptime for administrators"],
    exercises: ["talk through how they debug a problem step by step", "a coding or SQL exercise, or a walkthrough of a past project", "explain a technical idea to a non-technical person", "design or plan a small system at their level"],
    situations: ["a production issue under pressure", "a disagreement in code review", "unclear requirements", "a mistake they caused", "learning an unfamiliar tool quickly"],
    compliance: ["access and data security", "least access", "change control", "handling customer data"],
  },
  {
    id: "management-supervision",
    name: "Management and supervision",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-19",
    titleHints: ["manager", "supervisor", "team lead", "shift lead", "director", "operations manager", "store manager", "lead"],
    keywordHints: ["team leadership", "coaching", "performance reviews", "scheduling", "budget", "kpi", "hiring"],
    measured: ["team results against goals", "retention and attendance", "quality and safety on the team", "budget managed", "how quickly new hires become productive", "feedback from the team"],
    exercises: ["how they would handle an underperformer, step by step", "how they would run their first month in the role", "how they prioritize when the team is short", "how they give hard feedback"],
    situations: ["conflict between two team members", "an employee with a personal issue", "pressure from above that conflicts with the team", "an unpopular decision", "a mistake by the team they own"],
    compliance: ["fair and consistent treatment", "documenting performance issues", "workplace safety", "confidentiality of personnel matters"],
  },
  {
    id: "marketing-content",
    name: "Marketing and content",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-19",
    titleHints: ["marketing", "content", "social media", "copywriter", "brand", "communications", "seo", "graphic designer", "community manager", "email marketing"],
    keywordHints: ["campaigns", "seo", "analytics", "content calendar", "conversion", "social media", "copywriting"],
    measured: ["reach and engagement", "leads or conversions from campaigns", "cost per lead or per customer", "growth in audience or traffic", "deadlines kept"],
    exercises: ["walk through a campaign from goal to result", "critique a described ad or post", "a small content plan for a described audience", "what they do when a campaign underperforms"],
    situations: ["a post that gets a negative reaction", "a tight budget", "conflicting feedback from several people", "a result that cannot be tied to one action"],
    compliance: ["honest advertising claims", "permission for images and music", "disclosure rules for sponsored content", "brand and privacy rules"],
  },
  {
    id: "hr-recruiting",
    name: "Human resources and recruiting",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-19",
    titleHints: ["recruiter", "human resources", "hr", "talent acquisition", "people operations", "benefits", "onboarding"],
    keywordHints: ["ats", "sourcing", "employee relations", "hris", "benefits administration", "onboarding"],
    measured: ["time to fill a role", "how long hires stay in the first stage", "candidate or employee satisfaction", "offers accepted", "accuracy of records"],
    exercises: ["how they would find people for a hard-to-fill role", "screen a described candidate", "handle a hiring manager who wants to skip steps", "respond to a described employee complaint"],
    situations: ["a manager and a candidate who want different things", "a concern raised in confidence", "turning down a candidate kindly", "an urgent hire"],
    compliance: ["fair hiring and never asking about protected topics", "confidentiality", "consistent documentation"],
  },
];

// Lowercase, letters and digits only, single spaces, so hints match whole words.
const norm = (s: string) => ` ${s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()} `;
const has = (haystack: string, hint: string) => {
  const h = norm(hint);
  return haystack.includes(h) || haystack.includes(h.replace(/ $/, "s ")) || haystack.includes(h.replace(/ $/, "es "));
};

export type LensMatch = { lens: Lens; score: number };

// The lenses that fit a posting: those with a title hit first (best two), otherwise one lens with two or more key-term hits.
// Drafts are only used for the owner's test builds; visitors only ever get reviewed lenses.
export function matchLenses(title: string, keywords: string[], includeDrafts: boolean, library: Lens[] = LENSES): LensMatch[] {
  const t = norm(title);
  const k = norm(keywords.join(" "));
  const scored = library
    .filter((lens) => includeDrafts || lens.status === "reviewed")
    .map((lens) => {
      const titleHits = lens.titleHints.filter((hint) => has(t, hint)).length;
      const keywordHits = lens.keywordHints.filter((hint) => has(k, hint) || has(t, hint)).length;
      return { lens, titleHits, keywordHits, score: titleHits * 3 + keywordHits };
    });
  const byTitle = scored.filter((s) => s.titleHits > 0).sort((a, b) => b.score - a.score).slice(0, 2);
  if (byTitle.length > 0) return byTitle.map(({ lens, score }) => ({ lens, score }));
  const byKeywords = scored.filter((s) => s.keywordHits >= 2).sort((a, b) => b.score - a.score).slice(0, 1);
  return byKeywords.map(({ lens, score }) => ({ lens, score }));
}

const list = (items: string[]) => items.join("; ");

// The text added to the prep prompt for the matched lenses.
export function lensRules(lenses: Lens[]): string {
  const blocks = lenses
    .map((l) => `Kind of role: ${l.name}\n- Measured on: ${list(l.measured)}\n- Exercises and role-plays: ${list(l.exercises)}\n- Real situations of the work: ${list(l.situations)}${l.compliance.length ? `\n- Rules, privacy, or safety topics: ${list(l.compliance)}` : ""}`)
    .join("\n\n");
  return `

Role lens. This job is the kind of role below. These notes list what interviewers for this kind of role usually test. They are not facts about the person or the company.

${blocks}

How to use the lens:
- Ask 10 questions instead of 8. Keep every question the posting itself calls for (including anything specific to this job, such as a contract, a shift, or a setting), and add two to four from the lens: choose the ones that fit this posting and this resume best, and cover at least one metric and one exercise or situation, and, when the lens lists rules, privacy, or safety topics, one of the 10 questions MUST be about one of them, the one that fits this role best (confidentiality, privacy, safety, or following policy), even if that means dropping a question about a skill the resume already shows. Only skip it when a question you are already asking covers a topic on the list.
- For a question about what the person was measured on, ask what numbers they were measured on, and set "storyAsk" to ask for their real figures. Never fill in a figure for them.
- For an exercise, role-play, or situation, say in "approach" what the interviewer is looking for. In "points" use only real history from the resume or stories. When none fits, leave "points" short and set "storyAsk" to ask for a true example.
- For a rules, privacy, or safety topic, ask how they handle it in their own words, and never claim a license, certification, or training the material does not show.
- Do not write a script, a pitch, or an answer for the person. Never state a fact about the company. Never invent a metric or a number.`;
}

// Used for the owner's test builds when no lens matches, so a gap can still be tried out.
export const GENERIC_LENS = `

Role lens. First decide what kind of role this is. Then, in addition to the posting's own terms, ask 10 questions instead of 8, and add two to four that cover what interviewers for that kind of role usually test: the numbers people in the role are measured on, the exercises or role-plays they use, the real situations of the work, and any rules, privacy, or safety topics. Keep every question the posting itself calls for. For a question about numbers, ask what numbers the person was measured on and set "storyAsk" to ask for their real figures. For an exercise or situation, say in "approach" what the interviewer is looking for. Do not write a script, a pitch, or an answer for the person. Never state a fact about the company, never invent a metric or a number, and every point must come from the person's own history.`;
