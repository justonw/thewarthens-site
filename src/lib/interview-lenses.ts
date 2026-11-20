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
//   4. Fill measured / exercises / situations / compliance with KINDS of things, in plain words, and `opening` (what proof to lead with,
//      which kinds of true personal moments can bridge to which part of the work, and the voice). Never put a number,
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
  // Kinds of real experience that count for this field, especially for someone moving into it from another field. Used to decide what
  // to bring forward when tailoring a resume (only where the resume really shows it), and later to ask for missing evidence.
  transferable: string[];
  // Notes for the "tell me about yourself" opening in this kind of role. Craft advice only: what kind of proof to lead with, which kinds of
  // true personal moments can bridge to which part of the work, and the voice. Never a fact about a person or a company.
  opening: { proof: string; bridges: string[]; tone: string };
};

export const LENSES: Lens[] = [
  {
    id: "sales",
    name: "Sales",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["sales", "account executive", "account manager", "business development", "sdr", "bdr", "inside sales", "outside sales", "territory manager"],
    keywordHints: ["quota", "pipeline", "prospecting", "cold calling", "lead generation", "closing", "discovery", "crm"],
    measured: ["quota attainment", "pipeline built", "meetings or demos booked", "conversion between stages", "average deal size", "sales cycle length", "activity volume"],
    exercises: ["walk through a discovery call from the opening to the agreed next step", "a sell-me-this or pitch-the-product exercise", "handling a common objection such as price or timing", "a mock cold call or outreach message", "how they would plan a territory or a list of accounts"],
    situations: ["a prospect who goes quiet", "a deal lost to a competitor", "a stalled deal that needs a push", "handing a closed deal to the team that delivers it"],
    compliance: ["honest claims about the product", "do-not-call and email consent rules where they apply", "accurate records in the CRM"],
    transferable: ["prospecting or outreach to new people", "running discovery-style conversations or interviews", "following up and keeping people engaged", "tracking contacts or a pipeline in a system", "presenting or persuading a group", "meeting targets or goals"],
    opening: { proof: "a result that moved a number, such as leads followed up, meetings booked, deals won, or goals met, said as one plain result", bridges: ["a first job where they had to earn a stranger's trust, which can speak to opening conversations", "a time they kept going after hearing no, which can speak to follow-up and staying with a deal", "growing up around a family business or selling something small, which can speak to understanding what a customer cares about"], tone: "direct, warm, and specific; confident without bragging; never salesy" },
  },
  {
    id: "admin-office",
    name: "Administrative and office support",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["administrative", "executive assistant", "office manager", "office coordinator", "receptionist", "secretary", "clerk", "data entry"],
    keywordHints: ["calendar management", "scheduling", "travel arrangements", "microsoft office", "filing", "phones", "correspondence"],
    measured: ["accuracy of the work", "turnaround on requests", "scheduling conflicts resolved", "supplies and vendor costs kept in line", "response time to messages and calls"],
    exercises: ["prioritize several competing requests from different people right now", "a scheduling puzzle with conflicts", "write or proofread a short professional email", "how they would organize a messy shared folder or process", "what they do when someone asks for information that is confidential", "how they decide what to handle themselves and what to bring to the person they support"],
    situations: ["two leaders who each want priority", "a last-minute change to travel or a meeting", "an error found after something was sent", "an upset caller or visitor", "overhearing or seeing something private", "a temporary assignment that ends and the handoff to the next person"],
    compliance: ["confidentiality of what they see and hear", "handling sensitive documents", "access to private calendars and email"],
    transferable: ["coordinating schedules, calendars, or travel", "handling email or messages for others", "keeping records and files organized", "handling confidential information", "supporting a team or a leader", "front-desk or phone work"],
    opening: { proof: "keeping things running: schedules handled, requests turned around, records kept right, people supported", bridges: ["being the person at home or in a group who keeps everyone organized, which can speak to coordination", "a past job where small mistakes mattered, which can speak to accuracy", "helping a relative or a small family business with paperwork, which can speak to being trusted with private details"], tone: "calm, organized, and plain; reliability shown through one specific example, never just claimed" },
  },
  {
    id: "healthcare-front-office",
    name: "Healthcare front office and billing",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["patient access", "patient registration", "medical receptionist", "medical office", "medical secretary", "medical biller", "medical billing", "medical coder", "patient scheduler", "unit clerk", "insurance verification"],
    keywordHints: ["ehr", "epic", "hipaa", "insurance verification", "prior authorization", "copay", "registration", "patient scheduling"],
    measured: ["accuracy of registration and insurance information", "claims rejected or denied because of front-end errors", "copays collected at check-in", "check-in time and patient wait", "no-shows and how full the schedule is"],
    exercises: ["a patient arrives with missing or wrong insurance information, what are the steps", "explain a cost or copay to a patient clearly and kindly", "verify details on a described record and catch what does not match"],
    situations: ["an upset patient who has been waiting", "a patient in pain or distress at the desk", "a caller asking about another person's information", "a double-booked schedule", "the system going down at a busy time"],
    compliance: ["HIPAA privacy: who may be told what, and checking identity first", "sharing only the minimum needed", "accurate, complete patient records"],
    transferable: ["registering or checking in people", "handling insurance or payment details", "scheduling appointments", "handling private information carefully", "calming upset or worried people", "accurate data entry"],
    opening: { proof: "patients checked in, records or billing handled correctly, calls and scheduling kept moving", bridges: ["time spent in a waiting room or caring for a relative, which can speak to how patients feel at the front desk", "a past job where privacy mattered, which can speak to handling sensitive information", "being the calm one when others are stressed, which can speak to patients who are worried"], tone: "warm, careful, and steady; privacy and accuracy matter more than speed" },
  },
  {
    id: "nursing-clinical",
    name: "Nursing and clinical care",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["nurse", "rn", "lpn", "lvn", "cna", "nursing assistant", "patient care technician", "patient care", "medical assistant", "phlebotomist", "emt", "paramedic", "respiratory therapist", "pharmacy technician"],
    keywordHints: ["charting", "medication administration", "vital signs", "bls", "acls", "patient assessment", "ehr", "care plan"],
    measured: ["patient load handled safely", "timely and accurate charting", "patient and family feedback", "safety events and near misses", "medication accuracy", "response to call lights and alarms"],
    exercises: ["a patient's condition changes during the shift, what do you do first", "prioritize several patients who all need something now", "give a handoff report at shift change", "describe how they double-check a medication or a procedure"],
    situations: ["an upset family member", "a disagreement with a colleague or provider", "a near miss or an error", "being short-staffed", "a patient who refuses care"],
    compliance: ["patient privacy", "scope of practice: what they may and may not do", "infection control", "accurate and timely documentation", "reporting safety concerns", "licenses and certifications they actually hold"],
    transferable: ["direct care for people, including family or volunteer care", "noticing changes and reporting them", "charting or documentation", "safety and infection-control routines", "working with a care team", "care-related training such as first aid or CPR"],
    opening: { proof: "the care actually given: the patient load handled, teaching done, safety habits, and being part of a care team", bridges: ["their own or a family member's time as a patient, which can speak to explaining things clearly and sitting with fear", "a past job or season that taught them to stay steady when things change fast, which can speak to noticing changes", "caring for someone at home, which can speak to the patience of direct care"], tone: "calm, plain, and specific with no heroics; patient safety comes first, and never overstate what they are licensed or trained to do" },
  },
  {
    id: "skilled-trades",
    name: "Skilled trades and maintenance",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["electrician", "plumber", "hvac", "carpenter", "welder", "mechanic", "machinist", "maintenance", "installer", "millwright", "lineman", "journeyman", "apprentice", "foreman", "service technician", "field technician"],
    keywordHints: ["osha", "blueprints", "troubleshooting", "installation", "repair", "building codes", "hand tools", "preventive maintenance"],
    measured: ["work done right the first time, without callbacks", "jobs finished on schedule", "safety record", "accuracy of material and time estimates", "customer feedback on site"],
    exercises: ["troubleshoot a described fault out loud, step by step", "read or explain a plan, drawing, or work order", "how they check their work before leaving", "describe the safety steps before starting a job"],
    situations: ["finding a hazard on site", "a customer who wants something outside the job", "a part or material that is not available", "a job running behind", "working around other trades"],
    compliance: ["safety rules and protective equipment", "lockout and tagout where it applies", "local codes and inspections", "licenses and certifications they actually hold"],
    transferable: ["hands-on installation or repair", "reading plans or instructions", "working with tools and equipment", "following safety rules and training", "troubleshooting", "working on a crew"],
    opening: { proof: "work done and done right: jobs finished, what was built or fixed, safety habits, and working on a crew", bridges: ["growing up around a shop or a family business, or fixing things at home, which can speak to hands-on comfort and doing it right the first time", "a job where carelessness cost something, which can speak to safety and checking their work", "learning from an older worker, which can speak to taking direction and wanting to learn the trade"], tone: "plain and practical in short sentences; pride in the work shown through detail, not adjectives" },
  },
  {
    id: "driving-logistics",
    name: "Driving, delivery, and logistics",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["driver", "cdl", "delivery", "courier", "dispatcher", "dispatch", "logistics", "freight", "transportation", "route", "shipping coordinator"],
    keywordHints: ["cdl", "dot", "hours of service", "eld", "route planning", "freight", "dispatch", "deliveries"],
    measured: ["on-time delivery", "safe driving record", "accuracy of paperwork and delivery counts", "stops or loads handled", "vehicle inspection completion", "fuel and route efficiency"],
    exercises: ["how they plan a route when there is a delay", "walk through their pre-trip inspection", "what they do when their hours are running short", "for dispatch: how they prioritize loads and keep drivers informed"],
    situations: ["bad weather or heavy traffic", "damaged or missing freight", "a difficult customer at delivery", "a breakdown on the road", "pressure to skip a safety step to save time"],
    compliance: ["hours of service rules", "vehicle inspections", "safety rules", "accurate logs and paperwork", "license class and endorsements they actually hold"],
    transferable: ["driving or delivery work", "planning routes or schedules", "handling paperwork or logs", "vehicle checks", "safe driving records the resume shows", "customer handoffs"],
    opening: { proof: "reliability on the road or the dock: routes, deliveries, on-time work, safe driving, and accurate records", bridges: ["a job or season that depended on being on time, which can speak to reliability", "helping with a family trip, move, or delivery business, which can speak to planning a route and handling the unexpected", "staying calm in traffic or bad weather, which can speak to safe judgment"], tone: "straight and steady; safety and reliability without exaggeration" },
  },
  {
    id: "warehouse-production",
    name: "Warehouse and production",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["warehouse", "forklift", "material handler", "picker", "packer", "production", "assembler", "machine operator", "manufacturing", "shipping and receiving", "inventory", "quality inspector"],
    keywordHints: ["forklift", "osha", "wms", "picking", "packing", "inventory", "lean", "quality control"],
    measured: ["pick and pack accuracy", "output per hour", "error and damage rates", "on-time shipment", "attendance and reliability", "safety record", "quality defects caught"],
    exercises: ["how they keep accuracy when output goals are high", "walk through safe equipment or forklift checks", "what they would do on finding a quality defect", "how they would organize a stock area"],
    situations: ["a count that does not match", "a coworker taking an unsafe shortcut", "a machine going down", "an order due soon", "a change of task or shift at short notice"],
    compliance: ["safety rules", "equipment certifications they actually hold", "lifting and ergonomics", "quality procedures"],
    transferable: ["handling, packing, or assembling goods", "accuracy and counts", "operating equipment", "meeting production goals", "following safety and quality steps", "shift work"],
    opening: { proof: "output and accuracy: orders picked, items packed correctly, machines run, safety and quality habits, and showing up", bridges: ["a job where pace mattered, which can speak to keeping up without cutting corners", "a team sport, a crew, or a family business, which can speak to working as part of a team", "a past mistake that taught them to double-check, which can speak to quality"], tone: "plain, practical, and to the point; reliability and safety over big words" },
  },
  {
    id: "retail-hospitality",
    name: "Retail, food service, and hospitality",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["retail", "cashier", "sales associate", "store associate", "barista", "server", "bartender", "host", "cook", "line cook", "restaurant", "hotel", "front desk agent", "housekeeper", "stocker"],
    keywordHints: ["pos", "cash handling", "food safety", "upselling", "customer service", "guest services"],
    measured: ["sales per hour or add-on sales", "speed of service", "accuracy of orders and the cash drawer", "customer or guest feedback", "attendance", "waste or inventory loss"],
    exercises: ["handle an upset customer who has a point", "how they handle a rush with a short team", "suggest an add-on without being pushy", "habits that keep orders and the drawer accurate"],
    situations: ["a customer complaint", "a long line", "a coworker who does not show up", "a customer who disagrees with a policy", "suspected theft"],
    compliance: ["cash handling", "age-restricted sales where they apply", "food safety and allergens", "workplace safety"],
    transferable: ["serving customers face to face", "handling cash or orders", "working a rush", "resolving complaints", "product or menu knowledge", "recommending or upselling"],
    opening: { proof: "guests or customers served: how they handled a rush, a complaint, or a regular who came back", bridges: ["a family kitchen, a first job on their feet, or hosting at home, which can speak to making people feel welcome", "learning to stay cheerful while busy, which can speak to handling a rush", "being the one people bring problems to, which can speak to complaints"], tone: "warm, friendly, and upbeat but real; energy shown through a specific moment" },
  },
  {
    id: "teaching-education",
    name: "Teaching and education",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["teacher", "instructor", "tutor", "teaching assistant", "paraprofessional", "professor", "school counselor", "principal", "educator"],
    keywordHints: ["curriculum", "classroom management", "iep", "lesson plans", "differentiation", "assessment", "standards"],
    measured: ["student growth and progress", "attendance and engagement", "how they use assessment results to adjust teaching", "parent and family communication", "feedback from observations"],
    exercises: ["describe a lesson they would teach and how they know students understood", "a classroom management scenario", "how they would support a student far behind or far ahead", "a short mock lesson or explanation"],
    situations: ["a disruptive student", "a frustrated parent", "very different needs in one room", "a lesson that did not work", "working with other staff"],
    compliance: ["student privacy", "mandated reporting duties", "supporting students with learning plans", "student safety", "the license or certification they actually hold"],
    transferable: ["training or onboarding others", "mentoring or coaching", "presenting or explaining complex topics", "creating educational content or materials", "working with parents or families", "leading a group, class, workshop, or study, including youth or faith groups", "tutoring"],
    opening: { proof: "what learners did because of them: progress, a lesson that landed, a student they helped, and how they managed a room", bridges: ["a teacher, coach, or relative who changed how they saw themselves, which can speak to why they teach", "tutoring, coaching, or mentoring on the side, which can speak to meeting a learner where they are", "a time they struggled to learn something, which can speak to patience"], tone: "warm, clear, and learner-centered; examples from real learners kept private, with no names" },
  },
  {
    id: "accounting-finance",
    name: "Accounting and finance",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["accountant", "bookkeeper", "accounts payable", "accounts receivable", "payroll", "financial analyst", "controller", "auditor", "collections", "billing specialist"],
    keywordHints: ["reconciliation", "gaap", "month-end close", "quickbooks", "audit", "budgeting", "journal entries", "excel"],
    measured: ["accuracy of entries and reconciliations", "timeliness of the close and of payments", "time to collect or to pay", "errors found at review", "budget variances explained"],
    exercises: ["walk through how they reconcile an account and chase a difference", "a short spreadsheet or numbers exercise", "explain a variance to someone outside finance", "what they do when two numbers do not agree"],
    situations: ["a deadline at month end", "a vendor or employee disputing an amount", "an error found after posting", "being asked to adjust the numbers"],
    compliance: ["internal controls and separation of duties", "confidentiality of financial and pay information", "honest reporting", "certifications they actually hold"],
    transferable: ["accurate record keeping", "reconciling or checking numbers", "budgets or tracking money", "spreadsheets", "meeting deadlines", "handling confidential financial information"],
    opening: { proof: "accuracy and closing the loop: records kept right, errors caught, deadlines met, reconciliations or reports finished", bridges: ["growing up with a family budget or small business, which can speak to caring where money goes", "a past job where numbers had to match, which can speak to accuracy", "being the one who double-checks, which can speak to catching errors"], tone: "precise and measured; trustworthy over flashy, with no overstatement" },
  },
  {
    id: "customer-service",
    name: "Customer service and support",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["customer service", "customer support", "customer success", "customer experience", "call center", "contact center", "client services", "support specialist", "care representative"],
    keywordHints: ["tickets", "zendesk", "csat", "nps", "handle time", "de-escalation", "crm", "first contact resolution"],
    measured: ["customer satisfaction", "first-contact resolution", "response and handle time", "quality review results", "escalation rate", "retention or renewal for customer success roles"],
    exercises: ["role-play an angry customer", "explain a hard no kindly", "balance speed against thoroughness", "write a short reply to a described complaint"],
    situations: ["a customer demanding a refund against policy", "a problem the team cannot fix", "a long wait", "an abusive caller", "the same issue reported by many customers"],
    compliance: ["customer data privacy and checking identity", "accurate promises", "following refund and escalation policy"],
    transferable: ["helping customers solve problems", "handling complaints calmly", "explaining products or policies", "working a queue or tickets", "following up until it is resolved", "onboarding customers"],
    opening: { proof: "problems solved: customers helped through a hard moment, fixes made on first contact, and how they stayed calm", bridges: ["being the calm one in a family or on a team, which can speak to upset customers", "a time they were the customer who got helped well or badly, which can speak to what good service feels like", "a first job dealing with the public, which can speak to patience"], tone: "steady, warm, and plain; empathy shown through what they did, not by saying they are empathetic" },
  },
  {
    id: "software-it",
    name: "Software, IT, and data",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["software", "developer", "programmer", "web developer", "devops", "qa engineer", "it support", "help desk", "systems administrator", "network administrator", "security analyst", "data analyst", "data engineer", "technical support"],
    keywordHints: ["python", "javascript", "sql", "aws", "git", "api", "debugging", "active directory", "ticketing"],
    measured: ["tickets resolved and time to resolve", "reliability and incidents", "quality of work in code review", "delivery against estimates", "uptime for administrators"],
    exercises: ["talk through how they debug a problem step by step", "a coding or SQL exercise, or a walkthrough of a past project", "explain a technical idea to a non-technical person", "design or plan a small system at their level"],
    situations: ["a production issue under pressure", "a disagreement in code review", "unclear requirements", "a mistake they caused", "learning an unfamiliar tool quickly"],
    compliance: ["access and data security", "least access", "change control", "handling customer data"],
    transferable: ["building or fixing software or systems", "troubleshooting problems", "scripts or automation", "writing documentation", "supporting users", "learning new tools quickly"],
    opening: { proof: "something they built, fixed, or learned: a problem traced to its cause, a tool or script, a project, and how they help people who are stuck", bridges: ["tinkering with computers or games growing up, which can speak to curiosity and learning on their own", "being the family or office tech helper, which can speak to explaining things without talking down", "a project or course they finished while working, which can speak to follow-through and learning fast"], tone: "plain, curious, and specific; name the problem and the fix, and avoid piles of jargon" },
  },
  {
    id: "management-supervision",
    name: "Management and supervision",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["manager", "supervisor", "team lead", "shift lead", "director", "operations manager", "store manager", "lead"],
    keywordHints: ["team leadership", "coaching", "performance reviews", "scheduling", "budget", "kpi", "hiring"],
    measured: ["team results against goals", "retention and attendance", "quality and safety on the team", "budget managed", "how quickly new hires become productive", "feedback from the team"],
    exercises: ["how they would handle an underperformer, step by step", "how they would run their first month in the role", "how they prioritize when the team is short", "how they give hard feedback"],
    situations: ["conflict between two team members", "an employee with a personal issue", "pressure from above that conflicts with the team", "an unpopular decision", "a mistake by the team they own"],
    compliance: ["fair and consistent treatment", "documenting performance issues", "workplace safety", "confidentiality of personnel matters"],
    transferable: ["leading or training others", "scheduling work", "giving feedback", "handling conflict", "meeting team goals", "running projects or events"],
    opening: { proof: "what the team did under them: people trained or coached, goals met, a problem handled, and how they kept things running", bridges: ["leading somewhere that was not work, like a team, church, or family, which can speak to leading people", "someone who coached them well or badly, which can speak to how they lead", "stepping up when no one else would, which can speak to taking ownership"], tone: "grounded and humble; credit the team and put people before process" },
  },
  {
    id: "marketing-content",
    name: "Marketing and content",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["marketing", "content", "social media", "copywriter", "brand", "communications", "seo", "graphic designer", "community manager", "email marketing"],
    keywordHints: ["campaigns", "seo", "analytics", "content calendar", "conversion", "social media", "copywriting"],
    measured: ["reach and engagement", "leads or conversions from campaigns", "cost per lead or per customer", "growth in audience or traffic", "deadlines kept"],
    exercises: ["walk through a campaign from goal to result", "critique a described ad or post", "a small content plan for a described audience", "what they do when a campaign underperforms"],
    situations: ["a post that gets a negative reaction", "a tight budget", "conflicting feedback from several people", "a result that cannot be tied to one action"],
    compliance: ["honest advertising claims", "permission for images and music", "disclosure rules for sponsored content", "brand and privacy rules"],
    transferable: ["creating content such as video, writing, or design", "growing an audience", "measuring engagement", "running campaigns or events", "social media or email", "working with partners"],
    opening: { proof: "work that reached people: posts, campaigns, or writing, with one result tied to a real change", bridges: ["telling stories or making things since they were young, which can speak to creativity", "paying attention to what people respond to, which can speak to understanding an audience", "a project they made for fun or for a cause, which can speak to initiative"], tone: "lively but specific; show the work and its result, not adjectives" },
  },
  {
    id: "hr-recruiting",
    name: "Human resources and recruiting",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["recruiter", "human resources", "hr", "talent acquisition", "people operations", "benefits", "onboarding"],
    keywordHints: ["ats", "sourcing", "employee relations", "hris", "benefits administration", "onboarding"],
    measured: ["time to fill a role", "how long hires stay in the first stage", "candidate or employee satisfaction", "offers accepted", "accuracy of records"],
    exercises: ["how they would find people for a hard-to-fill role", "screen a described candidate", "handle a hiring manager who wants to skip steps", "respond to a described employee complaint"],
    situations: ["a manager and a candidate who want different things", "a concern raised in confidence", "turning down a candidate kindly", "an urgent hire"],
    compliance: ["fair hiring and never asking about protected topics", "confidentiality", "consistent documentation"],
    transferable: ["finding and contacting people", "interviewing or screening", "onboarding", "keeping confidential records", "explaining policies or benefits", "coordinating schedules"],
    opening: { proof: "people helped: hires made, onboarding smoothed, a hard conversation handled with care, and records kept confidential", bridges: ["a time someone gave them a chance, which can speak to why they care about hiring well", "being someone people confide in, which can speak to discretion", "their own job search, which can speak to how candidates feel"], tone: "warm and fair and confidential by habit; people first, never gossip or names" },
  },
  {
    id: "caregiving-direct-support",
    name: "Caregiving and direct support",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["caregiver", "home health aide", "personal care aide", "direct support professional", "direct support", "companion", "nanny", "childcare", "child care", "daycare", "youth worker", "behavioral health technician", "residential counselor", "support worker"],
    keywordHints: ["activities of daily living", "personal care", "client care", "care plan", "medication reminders", "supervision", "behavior support", "respite"],
    measured: ["safe, consistent care for each person", "following the care plan", "accurate notes after each visit or shift", "trust from the person and their family", "showing up on time"],
    exercises: ["what they would do if the person they care for refuses help", "how they would handle an emergency or a fall", "how they keep notes after a visit", "how they would set a routine for someone who resists it"],
    situations: ["a family member who is worried or critical", "a person who is upset or confused", "a safety concern the family does not want to hear", "being alone with someone during a hard moment", "a coworker who cuts corners"],
    compliance: ["privacy and dignity of the person", "scope of what they may and may not do", "reporting abuse, neglect, or safety concerns", "accurate notes", "training and certifications they actually hold"],
    transferable: ["caring for a relative, neighbor, or child", "patience with people who are struggling", "keeping simple notes or logs", "staying calm in an emergency", "first aid or CPR", "volunteering with people who need support"],
    opening: { proof: "the care actually given and kept steady: routines, safety, patience, notes, and a family who trusted them", bridges: ["caring for a family member, which can speak to patience and dignity", "a hard season that taught them to sit with someone who is struggling, which can speak to staying steady", "being the dependable one in a family, which can speak to consistency"], tone: "gentle, plain, and steady; respect and dignity, with no stories about named people" },
  },
  {
    id: "social-services-nonprofit",
    name: "Social services and nonprofit programs",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["social worker", "case manager", "caseworker", "counselor", "program coordinator", "program assistant", "outreach", "community health worker", "volunteer coordinator", "grant writer", "fundraiser", "development associate", "eligibility specialist", "community organizer", "youth coordinator"],
    keywordHints: ["case management", "client intake", "community outreach", "grant writing", "donor", "resource referral", "program evaluation", "crisis"],
    measured: ["clients helped to their next step", "accurate and timely case notes", "follow through on referrals", "program goals and outcomes reported", "funds raised or grants written, for development roles", "volunteer or community participation"],
    exercises: ["walk through how they would do an intake with a person in a hard moment", "describe how they would match a person to a resource", "how they would handle a case with too many needs at once", "explain how they would tell a funder what a program achieved"],
    situations: ["a client who is angry or hopeless", "limited resources and a long waiting list", "a boundary a client keeps pushing", "a confidential concern that must be reported", "burnout or a hard week"],
    compliance: ["confidentiality of client information", "mandatory reporting where it applies", "professional boundaries", "accurate records and honest reporting to funders", "licenses and certifications they actually hold"],
    transferable: ["helping people through a hard time, paid or volunteer", "connecting people to resources", "keeping confidential notes", "community or faith-based service", "organizing events or drives", "writing or reporting on results"],
    opening: { proof: "people helped to a next step: what they did and what changed for the person, with details kept private", bridges: ["their own hard season or a time someone helped them, which can speak to why they do this work", "volunteering or service growing up, which can speak to showing up consistently", "a family role as the one who knew where to find help, which can speak to connecting people to resources"], tone: "humble, respectful, and grounded; the person helped is the focus, never a hero story" },
  },
  {
    id: "protective-services-public-safety",
    name: "Security and public safety",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["security officer", "security guard", "loss prevention", "police officer", "firefighter", "corrections officer", "patrol", "safety officer", "public safety", "probation officer", "asset protection", "investigator"],
    keywordHints: ["patrol", "incident reports", "de-escalation", "surveillance", "access control", "emergency response", "first aid", "cpr"],
    measured: ["incidents handled safely and reported accurately", "being present and on time for every shift", "calm and professional contact with the public", "following post orders and procedures", "accuracy and timeliness of reports"],
    exercises: ["walk through how they would respond to a described incident", "how they would calm a person who is upset or angry", "how they would write up an incident report", "what they do on a quiet shift to stay alert"],
    situations: ["a person who will not leave or follow rules", "a conflict between two people", "a situation where they are alone and cannot reach help right away", "a coworker or friend who breaks a rule", "a report they would rather not write"],
    compliance: ["use of force limits and laws", "reporting and honesty in reports", "fair and respectful treatment of everyone", "privacy and surveillance rules", "licenses and certifications they actually hold"],
    transferable: ["staying calm in tense situations", "working in the military or on a team with clear procedures", "customer-facing work that involved difficult people", "first aid, CPR, or emergency training", "careful written notes", "working nights or long shifts"],
    opening: { proof: "judgment under pressure and reliability: situations handled calmly, reports written, and shifts covered", bridges: ["a past job or role where they had to keep people safe or calm, which can speak to de-escalation", "service in the military, on a team, or in a volunteer role with clear rules, which can speak to following procedure", "growing up as the peacemaker, which can speak to defusing conflict"], tone: "calm, professional, and matter-of-fact; no tough-guy talk, with judgment and honesty over bravado" },
  },
  {
    id: "engineering-technical",
    name: "Engineering and technical support",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["mechanical engineer", "electrical engineer", "civil engineer", "process engineer", "quality engineer", "manufacturing engineer", "project engineer", "engineering technician", "drafter", "cad", "lab technician", "test technician", "field engineer"],
    keywordHints: ["cad", "solidworks", "autocad", "specifications", "tolerances", "testing", "root cause", "standards"],
    measured: ["designs or tests done right and on schedule", "accuracy of drawings, calculations, and documentation", "problems traced to their cause", "meeting safety and quality standards", "clear handoffs to the people who build or use it"],
    exercises: ["walk through how they would find the cause of a described failure", "explain a past project to a non-engineer", "how they would check a design or a calculation", "how they would decide between two approaches with tradeoffs"],
    situations: ["a requirement that changes late", "a design that fails a test", "a disagreement with a manufacturing or customer team", "a deadline that cannot move", "a safety concern that will cost time"],
    compliance: ["safety and quality standards", "accurate documentation and change records", "licenses and certifications they actually hold", "honest reporting of test results"],
    transferable: ["building or fixing things as a hobby or job", "reading drawings or specifications", "testing and measuring", "school or lab projects", "documenting work so others can follow it", "working with technicians or a shop"],
    opening: { proof: "something they designed, tested, or fixed, and how they traced it to a cause", bridges: ["taking things apart or building things growing up, which can speak to curiosity and hands-on thinking", "a project that failed and what it taught them, which can speak to honest testing", "explaining a technical thing to a family member, which can speak to clear communication"], tone: "precise, plain, and curious; name the problem, the method, and the result, with no piles of buzzwords" },
  },
  {
    id: "project-operations-purchasing",
    name: "Projects, operations, and purchasing",
    status: "reviewed",
    reviewedBy: "Juston Warthen, owner review, 2026-11-20",
    updated: "2026-11-20",
    titleHints: ["project manager", "project coordinator", "program manager", "product manager", "scrum master", "operations analyst", "supply chain", "buyer", "purchasing", "procurement", "event coordinator", "operations coordinator", "business analyst"],
    keywordHints: ["stakeholders", "timeline", "budget", "vendor", "scope", "requirements", "agile", "procurement"],
    measured: ["work delivered on time and within scope", "a budget kept in line", "clear communication to everyone involved", "vendor or supplier reliability", "problems raised early"],
    exercises: ["walk through how they would plan a described project", "how they would handle a task that is falling behind", "how they would compare two vendors", "how they would explain a delay to a frustrated stakeholder"],
    situations: ["a deadline that cannot move and a team that is stretched", "two people who want opposite things", "a vendor that does not deliver", "a change in scope late in the work", "an unclear request"],
    compliance: ["honest reporting of status", "fair and documented vendor decisions", "budget and approval rules", "privacy and confidentiality of project information"],
    transferable: ["planning events or moves for a group", "coordinating several people toward one date", "tracking a budget or a list of tasks", "working with vendors or suppliers", "running a volunteer drive", "writing clear updates"],
    opening: { proof: "something they got across the finish line: what was at stake, who they coordinated, and how they kept it on track", bridges: ["organizing a family event, a move, or a community effort, which can speak to coordinating people toward a date", "being the one who keeps a list and follows up, which can speak to follow-through", "a project that went sideways and how they recovered, which can speak to calm problem solving"], tone: "organized, calm, and specific, in plain status-style sentences; credit the people they worked with" },
  },
  {
    id: "banking-insurance-real-estate",
    name: "Banking, insurance, and real estate",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-20",
    titleHints: ["bank teller", "teller", "personal banker", "banker", "loan officer", "mortgage", "insurance agent", "claims adjuster", "underwriter", "real estate agent", "property manager", "leasing consultant", "leasing agent", "financial advisor", "branch"],
    keywordHints: ["compliance", "kyc", "cash handling", "underwriting", "licensing", "leasing", "closing", "client portfolio"],
    measured: ["accuracy with money and records", "clients helped and kept", "accounts, policies, or leases opened and renewed", "meeting compliance and licensing rules", "response time to clients"],
    exercises: ["explain a financial or insurance idea to someone with no background", "walk through how they would handle a customer who is angry about a fee or a decision", "how they would verify who they are talking to", "how they would show a described property or product"],
    situations: ["a customer who wants something the rules do not allow", "a mistake with someone's money", "a client who is anxious about a big decision", "something that looks like fraud", "a deal that is about to fall through"],
    compliance: ["privacy of customer financial information", "fraud and identity checks", "fair treatment and honest explanations of terms", "licenses and certifications they actually hold", "accurate records"],
    transferable: ["handling cash or reconciling a drawer", "customer service where trust mattered", "explaining something complicated simply", "sales with follow-up", "careful record keeping", "working with the public"],
    opening: { proof: "trust and accuracy: customers helped, money or records handled correctly, and a problem caught", bridges: ["a family experience with money, a home, or insurance, which can speak to why the stakes matter to people", "a job where they handled cash or records, which can speak to being trusted", "helping a relative make a big decision, which can speak to explaining things honestly"], tone: "trustworthy, measured, and plain; never promise outcomes, and put honesty over polish" },
  },
  {
    id: "creative-media",
    name: "Creative and media production",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-20",
    titleHints: ["video editor", "photographer", "videographer", "motion designer", "illustrator", "ux designer", "product designer", "ui designer", "art director", "producer", "animator", "audio engineer", "creative"],
    keywordHints: ["adobe", "premiere", "after effects", "figma", "portfolio", "storyboard", "editing", "design systems"],
    measured: ["work delivered to the brief and on time", "revisions needed before approval", "audience or client response", "consistency with a brand or style", "usability or engagement of what they made"],
    exercises: ["walk through a piece from their portfolio from brief to result", "how they would respond to feedback they disagree with", "critique a described design or video", "how they would handle a tight turnaround"],
    situations: ["conflicting feedback from several people", "a client who changes the brief", "a deadline with too little time", "work they are proud of that gets cut", "a tool or file that fails"],
    compliance: ["rights and permission for images, music, and fonts", "honest credit for others' work", "brand and privacy rules", "file and client confidentiality"],
    transferable: ["making things for school, church, friends, or a cause", "a personal portfolio or channel", "working to a client's brief", "learning tools on their own", "giving and taking feedback", "meeting deadlines on creative work"],
    opening: { proof: "one piece of work and what it did for the person who asked for it", bridges: ["making things since they were young, which can speak to their eye and their drive to improve", "a project for a cause or a friend, which can speak to caring about the person it is for", "a time feedback made the work better, which can speak to taking direction"], tone: "specific and visual; point to real work, and show confidence without adjectives" },
  },
  {
    id: "personal-services-wellness",
    name: "Personal services and wellness",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-20",
    titleHints: ["cosmetologist", "hair stylist", "stylist", "barber", "esthetician", "massage therapist", "personal trainer", "fitness instructor", "nail technician", "groomer", "trainer", "spa"],
    keywordHints: ["clientele", "licensure", "sanitation", "booking", "consultation", "retail sales", "memberships", "wellness"],
    measured: ["repeat and referred clients", "booked time kept full", "client results and satisfaction", "sanitation and safety", "retail or membership sales where they apply"],
    exercises: ["walk through a first consultation with a new client", "how they would handle a client who is unhappy with the result", "how they would fill a slow week", "how they keep their space clean and safe"],
    situations: ["a client who wants something that will not work or is not safe", "a late or no-show client", "a disagreement about a result", "a busy day with an overbooked schedule", "a client who shares something personal"],
    compliance: ["state license and sanitation rules", "safe products and practices", "privacy of client information", "what they may and may not do under their license", "honest claims about results"],
    transferable: ["customer service where people left happy", "building a regular clientele", "learning a craft by practice", "working on their feet with people", "booking and handling money", "a training or license they hold"],
    opening: { proof: "clients who came back and what they did to earn it", bridges: ["practicing on family or friends growing up, which can speak to their craft and ease with people", "how a great stylist or trainer once made them feel, which can speak to the experience they want to give", "learning to listen before suggesting, which can speak to the consultation"], tone: "warm, confident, and easygoing; show craft through one detail, and keep clients' details private" },
  },
  {
    id: "legal-support",
    name: "Legal and compliance support",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-20",
    titleHints: ["legal assistant", "paralegal", "legal secretary", "court clerk", "compliance assistant", "compliance analyst", "contracts administrator", "records clerk", "litigation support", "legal intake"],
    keywordHints: ["case files", "discovery", "filings", "contracts", "deadlines", "confidentiality", "e-filing", "compliance"],
    measured: ["accuracy of documents and filings", "deadlines never missed", "organized files others can find", "confidentiality kept", "clear communication with clients and attorneys"],
    exercises: ["how they would keep track of several deadlines at once", "how they would proofread a described document and what they would look for", "how they would respond to a client who asks for legal advice", "how they would organize a messy file"],
    situations: ["a deadline that is about to be missed", "an attorney who gives conflicting instructions", "a client who is upset or anxious", "a document with an error found late", "a confidential thing they overhear"],
    compliance: ["client confidentiality", "not giving legal advice", "conflicts of interest", "honest and accurate records", "deadlines and court rules"],
    transferable: ["careful writing and proofreading", "keeping organized records", "deadline-driven work", "working with confidential information", "research", "customer service for anxious people"],
    opening: { proof: "accuracy and deadlines: documents prepared, files organized, and deadlines kept", bridges: ["being the one who reads the fine print, which can speak to care with documents", "a time something was lost or missed and it mattered, which can speak to deadlines", "being trusted with private information, which can speak to confidentiality"], tone: "precise, discreet, and calm; never share client details, and put reliability over flair" },
  },
  {
    id: "dental-vet-therapy",
    name: "Dental, veterinary, and therapy support",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-20",
    titleHints: ["dental assistant", "dental hygienist", "veterinary technician", "vet tech", "veterinary assistant", "physical therapy assistant", "physical therapist", "occupational therapy", "therapy aide", "pharmacist", "optician", "audiology"],
    keywordHints: ["chairside", "sterilization", "patient charting", "x-rays", "exam room", "treatment plan", "animal handling", "rehabilitation"],
    measured: ["safe, correct procedures and sterilization", "patient or animal comfort and trust", "accurate charting", "a smooth schedule between appointments", "communication with owners or families"],
    exercises: ["describe how they would calm an anxious patient or animal", "walk through setting up and cleaning a room between visits", "how they would explain aftercare to an owner or patient", "how they would handle a procedure that is not going as planned"],
    situations: ["an anxious or hurting patient or animal", "an owner or family member who is upset about cost or news", "a busy schedule with an emergency", "a mistake in the chart", "a hard goodbye or bad news"],
    compliance: ["infection control and sterilization", "patient privacy", "scope of practice", "safe handling of medications and radiation", "licenses and certifications they actually hold"],
    transferable: ["caring for animals or people", "working with sterile or careful routines", "calming nervous people", "charting or detailed notes", "comfort with blood, needles, or hard moments", "volunteering at a clinic or shelter"],
    opening: { proof: "care given and comfort earned: how they kept a patient or animal calm and safe", bridges: ["a pet, a family member, or their own visit that left an impression, which can speak to comfort and trust", "a hard moment they stayed steady through, which can speak to calm under pressure", "volunteering with animals or people, which can speak to patience"], tone: "gentle, steady, and plain; care and safety first, with privacy for patients and owners" },
  },
  {
    id: "facilities-grounds-labor",
    name: "Facilities, grounds, and construction labor",
    status: "draft",
    reviewedBy: "",
    updated: "2026-11-20",
    titleHints: ["janitor", "custodian", "groundskeeper", "landscaper", "laborer", "construction laborer", "general laborer", "facilities", "building maintenance", "porter", "painter", "roofer", "concrete", "crew member"],
    keywordHints: ["safety", "equipment", "cleaning", "grounds", "ppe", "building maintenance", "landscaping", "job site"],
    measured: ["work finished to a good standard", "safety record", "reliable attendance and starting on time", "care of equipment and materials", "feedback from a supervisor or the people who use the space"],
    exercises: ["describe how they would plan a day's work with a list of tasks", "how they would handle a tool or machine they have not used", "how they check their work before leaving", "what safety steps they take before starting"],
    situations: ["a task that is bigger than expected", "an unsafe condition on site", "a coworker who is not pulling their weight", "bad weather or a deadline", "a person who complains about the work"],
    compliance: ["safety rules and protective equipment", "safe handling of chemicals and equipment", "site rules and respect for others' property", "licenses and certifications they actually hold"],
    transferable: ["physical work done well", "keeping a place clean or in order", "using tools or equipment", "working outdoors or in all weather", "working on a crew", "taking pride in small details"],
    opening: { proof: "work done well and reliably: what they kept up or built, how they kept it safe, and showing up", bridges: ["a family member who worked hard with their hands, which can speak to their work ethic", "a first job that taught them to show up, which can speak to reliability", "taking care of their own home or yard, which can speak to pride in the work"], tone: "plain, humble, and steady; reliability and care shown through specific details" },
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
    .map((l) => `Kind of role: ${l.name}\n- Measured on: ${list(l.measured)}\n- Exercises and role-plays: ${list(l.exercises)}\n- Real situations of the work: ${list(l.situations)}${l.compliance.length ? `\n- Rules, privacy, or safety topics: ${list(l.compliance)}` : ""}\n- Opening notes: lead the proof with ${l.opening.proof}. Bridges that fit this kind of work (use one ONLY when the person's own moment really matches it): ${list(l.opening.bridges)}. Voice: ${l.opening.tone}.`)
    .join("\n\n");
  return `

Role lens. This job is the kind of role below. These notes list what interviewers for this kind of role usually test. They are not facts about the person or the company.

${blocks}

How to use the lens:
- Ask 10 questions instead of 8. Keep every question the posting itself calls for (including anything specific to this job, such as a contract, a shift, or a setting), and add two to four from the lens: choose the ones that fit this posting and this resume best, and cover at least one metric and one exercise or situation, and, when the lens lists rules, privacy, or safety topics, one of the 10 questions MUST be about one of them, the one that fits this role best (confidentiality, privacy, safety, or following policy), even if that means dropping a question about a skill the resume already shows. Only skip it when a question you are already asking covers a topic on the list.
- For a question about what the person was measured on, ask what numbers they were measured on, and set "storyAsk" to ask for their real figures. Never fill in a figure for them.
- For an exercise, role-play, or situation, say in "approach" what the interviewer is looking for. In "points" use only real history from the resume or stories. When none fits, leave "points" short and set "storyAsk" to ask for a true example.
- For a rules, privacy, or safety topic, ask how they handle it in their own words, and never claim a license, certification, or training the material does not show.
- The opening: follow the opening notes above for the proof and the voice. The bridge notes apply only when the person has given a personal moment and picked a part of the job. They are patterns, never material: do not use a bridge the person did not live, and never invent or stretch a moment to fit.
- Do not write a script, a pitch, or an answer for the person. Never state a fact about the company. Never invent a metric or a number.`;
}

// Field notes for tailoring a resume (owner-only for now): what counts as relevant experience in the field the person is aiming for.
export function fieldNotes(lenses: Lens[]): string {
  if (lenses.length === 0) return "";
  return lenses.map((l) => `Field: ${l.name}. Kinds of experience that count for it: ${l.transferable.join("; ")}.`).join("\n");
}

// Used for the owner's test builds when no lens matches, so a gap can still be tried out.
export const GENERIC_LENS = `

Role lens. First decide what kind of role this is. Then, in addition to the posting's own terms, ask 10 questions instead of 8, and add two to four that cover what interviewers for that kind of role usually test: the numbers people in the role are measured on, the exercises or role-plays they use, the real situations of the work, and any rules, privacy, or safety topics. Keep every question the posting itself calls for. For a question about numbers, ask what numbers the person was measured on and set "storyAsk" to ask for their real figures. For an exercise or situation, say in "approach" what the interviewer is looking for. Do not write a script, a pitch, or an answer for the person. Never state a fact about the company, never invent a metric or a number, and every point must come from the person's own history.`;
