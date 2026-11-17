// A plain, honest keyword check: which words and phrases a job posting leans on, and which of them are in a resume.
// It runs entirely in the browser with no AI, so it costs nothing and gives the same answer every time. It is NOT a
// score from any hiring software (nobody outside those companies knows how theirs work). It finds the phrases a
// posting repeats or names, sorts them (tools, skills, people skills, certifications), flags which the posting seems
// to require, checks the job title and the degree, and looks for the same wording in the resume.

export type TermStatus = "found" | "words" | "missing";
export type TermKind = "tool" | "skill" | "soft" | "cert" | "other" | "name";
export type TermTier = "required" | "normal" | "preferred";

export type TermResult = {
  phrase: string;
  /** How many times the posting uses it. */
  count: number;
  /** Used for sorting only. */
  score: number;
  kind: TermKind;
  /** required: under a "requirements" heading, repeated 3+ times, or in the title. preferred: only under "nice to have". */
  tier: TermTier;
  /** found: the exact phrase (or a known short form) is in the resume. words: every word is there, but not as that phrase. */
  status: TermStatus;
  /** The word-roots that count as a match in the resume, used to highlight them. Only set when found. */
  forms: string[];
};

export type Requirement = {
  label: string;
  /** found: the resume shows it. missing: it does not. check: the tool cannot tell, so a person should look. */
  status: "found" | "missing" | "check";
  note: string;
};

export type MatchResult = {
  /** Real key phrases. Capitalized names and places we could not tell apart from tools are in `names`. */
  terms: TermResult[];
  names: TermResult[];
  title: { phrase: string; status: TermStatus } | null;
  requirements: Requirement[];
  found: number;
  words: number;
  missing: number;
  /** The same counts, for the terms that look required. */
  requiredFound: number;
  requiredTotal: number;
};

// Words that cannot be part of a key phrase: everyday words, plus the filler that fills every job posting.
const STOP = new Set(
  (
    "a about above across after again against all also am an and any are as at be because been before being below between both but by can could did do does doing down during each either else few for from further get gets had has have having he her here hers him his how i if in into is it its itself just let may me might more most much must my myself no nor not now of off on once one only onto or other our ours out over own per same she should so some such than that the their theirs them then there these they this those through to too under until up upon us use used using very via was we well were what when where whether which while who whom why will with within without would you your yours " +
    "ability able about additional applicant applicants apply applying benefits bonus candidate candidates company compensation day days deliver desire desired detail determined duties duty eligible employee employees employer employment encouraged equal essential excellent experience experienced exceptional familiarity familiar fast fulfill full great ideal ideally immediate include includes including interested join joining knowledge location looking make making many minimum must need needed needs new nice opportunity opportunities part perform performs plus position positions preferred prior proven qualifications qualified qualify related relevant required requirements requires requirement responsibilities responsibility responsible role roles salary seeking self several skills solid something strong successful take team teams thrive time understanding understand want wants way ways week weeks willing willingness work working works year years " +
    "etc eg ie per responsibilities benefits"
  ).split(/\s+/)
);

const list = (s: string) => s.split("|").map((x) => x.trim()).filter(Boolean);

// Named software and tools.
const TOOLS = new Set(
  list(
    "salesforce|hubspot|zendesk|servicenow|jira|confluence|slack|asana|trello|notion|monday.com|smartsheet|airtable|zoom|teams|microsoft teams|microsoft office|office 365|microsoft 365|word|excel|powerpoint|outlook|sharepoint|google workspace|google sheets|google docs|g suite|" +
    "tableau|power bi|looker|metabase|google analytics|mixpanel|amplitude|segment|snowflake|bigquery|redshift|databricks|airflow|dbt|alteryx|" +
    "sql|mysql|postgresql|postgres|mongodb|oracle|python|r|java|javascript|typescript|c++|c#|dotnet|go|golang|ruby|rails|php|swift|kotlin|scala|rust|html|css|sass|react|angular|vue|next.js|node.js|express|django|flask|spring|graphql|rest|api|apis|json|xml|" +
    "aws|azure|gcp|google cloud|ec2|s3|lambda|docker|kubernetes|terraform|ansible|jenkins|github|gitlab|git|bitbucket|cicd|linux|unix|windows|macos|bash|powershell|vmware|" +
    "splunk|crowdstrike|sentinel|wireshark|nessus|metasploit|burp suite|nmap|okta|active directory|intune|jamf|cisco|palo alto|fortinet|meraki|" +
    "quickbooks|netsuite|sap|workday|adp|paychex|gusto|bamboohr|greenhouse|lever|salesloft|outreach|apollo|zoominfo|gong|clari|linkedin sales navigator|sales navigator|marketo|pardot|mailchimp|klaviyo|hootsuite|canva|figma|sketch|adobe|photoshop|illustrator|premiere|wordpress|shopify|stripe|epic|cerner|meditech|" +
    "autocad|solidworks|revit|bluebeam|procore"
  )
);

// Job skills and methods that are not a named product.
const SKILLS = new Set(
  list(
    "crm|saas|b2b|b2c|cold calling|cold outreach|prospecting|pipeline|quota|lead generation|outbound|inbound|sdr|bdr|account executive|account management|customer success|onboarding|upselling|cross selling|negotiation|forecasting|closing|discovery calls|demos|sales cycle|territory management|business development|" +
    "data analysis|data analytics|data visualization|dashboards|reporting|etl|machine learning|statistics|a b testing|data entry|data modeling|" +
    "devops|cicd|automation|scripting|software development|web development|api development|code review|unit testing|test automation|quality assurance|debugging|system design|microservices|" +
    "help desk|service desk|troubleshooting|networking|tcp/ip|tcpip|dns|dhcp|vpn|firewall|firewalls|siem|incident response|penetration testing|vulnerability management|vulnerability assessment|threat detection|threat hunting|risk assessment|risk management|compliance|nist|soc 2|iso 27001|hipaa|gdpr|pci|security operations|endpoint security|identity and access management|iam|cloud security|network security|log analysis|" +
    "project management|program management|product management|agile|scrum|kanban|stakeholder management|budgeting|budget management|process improvement|change management|vendor management|cross functional|crossfunctional|strategic planning|operations management|supply chain|inventory management|logistics|procurement|" +
    "seo|sem|content marketing|email marketing|social media|copywriting|paid search|marketing automation|brand management|market research|public relations|event planning|" +
    "customer service|customer support|customer experience|client relations|account management|conflict resolution|de escalation|call center|" +
    "training|coaching|mentoring|scheduling|recruiting|talent acquisition|onboarding|employee relations|payroll|benefits administration|" +
    "patient care|patient safety|medication administration|charting|triage|phlebotomy|infection control|case management|" +
    "accounts payable|accounts receivable|reconciliation|auditing|financial reporting|financial analysis|bookkeeping|budget|general ledger|month end close|" +
    "bilingual|spanish|customer retention|churn|upsell|renewals|contract negotiation|proposal writing|grant writing|technical writing|public speaking|presentations"
  )
);

// People skills.
const SOFT = new Set(
  list(
    "communication|written communication|verbal communication|collaboration|teamwork|leadership|problem solving|critical thinking|time management|adaptability|flexibility|organization|attention to detail|multitasking|initiative|self motivated|self starter|empathy|active listening|decision making|creativity|reliability|work ethic|accountability|resilience|interpersonal|relationship building|customer focused|detail oriented|results driven|strategic thinking|prioritization|curiosity|growth mindset|coachable"
  )
);

// Certifications and licenses.
const CERTS = new Set(
  list(
    "cissp|cism|ceh|oscp|security+|network+|a+|comptia|casp|ccna|ccnp|aws certified|azure fundamentals|pmp|capm|prince2|csm|psm|itil|six sigma|green belt|black belt|cpa|cfa|shrm|phr|sphr|rn|lpn|cna|bls|acls|cpr|pals|cdl|osha|osha 10|osha 30|forklift|food handler|servsafe|notary|series 7|series 63|cma|ccma|nremt|emt"
  )
);

// Words that look like names or tools when they start with a capital letter, but are not skills: places and common
// posting words. These are kept out of the main list.
const NOT_SKILLS = new Set(
  list(
    "alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|hampshire|jersey|mexico|york|carolina|dakota|ohio|oklahoma|oregon|pennsylvania|rhode|tennessee|texas|utah|vermont|virginia|washington|wisconsin|wyoming|" +
    "atlanta|austin|boston|chicago|dallas|denver|houston|miami|seattle|phoenix|portland|nashville|charlotte|brooklyn|manhattan|angeles|francisco|diego|jose|orlando|tampa|raleigh|columbus|detroit|minneapolis|philadelphia|pittsburgh|baltimore|remote|hybrid|onsite|usa|america|american|united|states|canada|london|toronto|" +
    "eeo|eoe|llc|inc|ltd|corp|co|pto|ceo|cfo|coo|cto|vp|covid|faq|ok|am|pm|est|pst|cst|" +
    "tx|ca|ny|fl|ga|il|oh|pa|nc|va|wa|az|ma|nj|tn|mi|mn|md|wi|mo|sc|al|ky|la|ct|ut|nv|ks|ar|ms|ia|nm|wv|ri|nh|vt|mt|nd|sd|wy|ak|dc|" +
    "monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|june|july|august|september|october|november|december"
  )
);

// Different ways of writing the same thing. A resume with any one of them counts as having the term.
const ALIAS_GROUPS: string[][] = [
  ["javascript", "js"],
  ["typescript", "ts"],
  ["kubernetes", "k8s"],
  ["artificial intelligence", "ai"],
  ["machine learning", "ml"],
  ["search engine optimization", "seo"],
  ["customer relationship management", "crm"],
  ["business to business", "b2b"],
  ["business to consumer", "b2c"],
  ["sales development representative", "sdr"],
  ["business development representative", "bdr"],
  ["key performance indicators", "kpis", "kpi"],
  ["application programming interface", "api", "apis"],
  ["software as a service", "saas"],
  ["identity and access management", "iam"],
  ["security information and event management", "siem"],
  ["user experience", "ux"],
  ["user interface", "ui"],
  ["human resources", "hr"],
  ["return on investment", "roi"],
  ["quality assurance", "qa"],
  ["information technology", "it"],
  ["amazon web services", "aws"],
  ["google cloud platform", "gcp", "google cloud"],
  ["cross functional", "crossfunctional"],
  ["microsoft office", "ms office", "office 365", "microsoft 365"],
  ["postgresql", "postgres"],
  ["golang", "go"],
  ["registered nurse", "rn"],
  ["customer support", "customer service"],
  ["problem solving", "troubleshooting"],
  ["detail oriented", "attention to detail"],
  ["self motivated", "self starter"],
  ["project management", "project manager"],
  ["cybersecurity", "cyber security", "information security"],
];

const REQ_HEADING =
  /^\s*(?:[-*•#]+\s*)?(?:requirements?|qualifications?|minimum qualifications?|basic qualifications?|required skills|what you(?:'|’)?ll need|what you will need|what we(?:'|’)?re looking for|what we are looking for|must haves?|you have|you bring|who you are|about you|skills)\b/i;
const NICE_HEADING = /^\s*(?:[-*•#]+\s*)?(?:nice to haves?|bonus(?: points)?|preferred(?: qualifications| skills| experience)?|a plus|pluses|extra credit|ideally)\b/i;
const OTHER_HEADING =
  /^\s*(?:[-*•#]+\s*)?(?:about (?:us|the (?:role|company|team|job))|responsibilities|what you(?:'|’)?ll do|what you will do|benefits|perks|compensation|why join|our (?:mission|culture)|the role|overview|equal opportunity)\b/i;

/** Cuts a word back to a rough root so "managed", "managing" and "manages" all look the same. Used on both sides. */
export function stem(word: string): string {
  let w = word;
  if (w.length > 4 && w.endsWith("ies")) w = w.slice(0, -3) + "y";
  else if (w.length > 5 && w.endsWith("ing")) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith("ed")) w = w.slice(0, -2);
  else if (w.length > 4 && w.endsWith("es") && /(?:ss|x|ch|sh|z)es$/.test(w)) w = w.slice(0, -2);
  else if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") && !w.endsWith("us") && !w.endsWith("is")) w = w.slice(0, -1);
  if (w.length > 4 && w.endsWith("e")) w = w.slice(0, -1);
  return w;
}

type Tok = { raw: string; low: string; stem: string; start: boolean };
type Segment = { toks: Tok[]; req: boolean; nice: boolean; title: boolean };

function prepare(text: string): string {
  return text
    .replace(/ci\/cd/gi, "cicd")
    .replace(/\.net\b/gi, "dotnet")
    .replace(/\btcp\/ip\b/gi, "tcpip")
    .replace(/\bq&a\b/gi, "qa")
    .replace(/\br&d\b/gi, "rd")
    .replace(/[’']s\b/g, "")
    .replace(/[’']/g, "")
    .replace(/[ \t][-‐‑‒–—|@][ \t]/g, ", ")
    .replace(/[-‐‑‒–—]/g, " ")
    .replace(/\r/g, "\n");
}

function segments(text: string, markSections: boolean): Segment[] {
  const out: Segment[] = [];
  let inReq = false;
  let inNice = false;
  let firstLine = true;
  for (const line of prepare(text).split("\n")) {
    if (!line.trim()) {
      continue;
    }
    if (markSections && line.trim().length < 60) {
      // Section headings switch the "requirements" and "nice to have" flags, so a term under "Requirements" counts for more.
      if (OTHER_HEADING.test(line)) {
        inReq = false;
        inNice = false;
      } else if (NICE_HEADING.test(line)) {
        inNice = true;
        inReq = false;
      } else if (REQ_HEADING.test(line)) {
        inReq = true;
        inNice = false;
      }
    }
    let first = true;
    for (const piece of line.split(/[,;:()[\]{}!?"“”•·|●▪►\t/]+|\.(?=\s|$)|\s&\s/)) {
      const toks: Tok[] = [];
      const re = /[A-Za-z0-9][A-Za-z0-9+#.]*/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(piece))) {
        const raw = m[0].replace(/\.+$/, "");
        if (!raw) continue;
        const low = raw.toLowerCase();
        toks.push({ raw, low, stem: stem(low), start: toks.length === 0 });
      }
      if (toks.length) {
        out.push({ toks, req: inReq, nice: inNice, title: firstLine && first && markSections });
        first = false;
      }
    }
    firstLine = false;
  }
  return out;
}

const isStop = (t: Tok) => STOP.has(t.low) || /^[\d+#.]+$/.test(t.low) || t.low.length < 2;

type Cand = { phrase: string; stems: string[]; n: number; count: number; req: number; nice: number; title: boolean; acronym: boolean; proper: boolean };

function candidates(posting: Segment[]): Map<string, Cand> {
  const map = new Map<string, Cand>();
  for (const seg of posting) {
    let run: Tok[] = [];
    const flush = () => {
      for (let n = 1; n <= 3; n++) {
        for (let i = 0; i + n <= run.length; i++) {
          const slice = run.slice(i, i + n);
          const key = slice.map((t) => t.stem).join(" ");
          const phrase = slice.map((t) => t.low).join(" ");
          const c = map.get(key) ?? { phrase, stems: slice.map((t) => t.stem), n, count: 0, req: 0, nice: 0, title: false, acronym: false, proper: false };
          c.count += 1;
          if (seg.req) c.req += 1;
          if (seg.nice) c.nice += 1;
          if (seg.title) c.title = true;
          if (n === 1) {
            const t = slice[0];
            if (/^[A-Z]{2,6}s?$/.test(t.raw) || /[+#]|\d/.test(t.raw)) c.acronym = true;
            if (/^[A-Z][a-z]+/.test(t.raw) && !t.start && !seg.title) c.proper = true;
          }
          map.set(key, c);
        }
      }
      run = [];
    };
    for (const t of seg.toks) {
      if (isStop(t)) flush();
      else run.push(t);
    }
    flush();
  }
  return map;
}

function resumeGrams(resume: Segment[]): { grams: Set<string>; words: Set<string> } {
  const grams = new Set<string>();
  const words = new Set<string>();
  for (const seg of resume) {
    const s = seg.toks.map((t) => t.stem);
    for (const t of s) words.add(t);
    for (let n = 1; n <= 6; n++) for (let i = 0; i + n <= s.length; i++) grams.add(s.slice(i, i + n).join(" "));
  }
  return { grams, words };
}

const stemsOf = (phrase: string) => segments(phrase, false).flatMap((s) => s.toks.map((t) => t.stem)).join(" ");

const aliasStems = (group: string[]) => group.map(stemsOf);
const ALIASES: string[][] = ALIAS_GROUPS.map(aliasStems);
const stemSet = (words: Set<string>) => new Set([...words].map(stemsOf));
const TOOL_STEMS = stemSet(TOOLS);
const SKILL_STEMS = stemSet(SKILLS);
const SOFT_STEMS = stemSet(SOFT);
const CERT_STEMS = stemSet(CERTS);
const NOT_SKILL_STEMS = stemSet(NOT_SKILLS);

function aliasGroupOf(key: string): string[] {
  return ALIASES.find((g) => g.includes(key)) ?? [];
}

function inResume(key: string, grams: Set<string>): boolean {
  if (grams.has(key)) return true;
  const group = aliasGroupOf(key);
  return group.some((g) => grams.has(g));
}

const MAX_TERMS = 45;

function kindOf(key: string, c: Cand): TermKind {
  if (CERT_STEMS.has(key)) return "cert";
  if (TOOL_STEMS.has(key)) return "tool";
  if (SOFT_STEMS.has(key)) return "soft";
  if (SKILL_STEMS.has(key)) return "skill";
  // A capitalized word we do not know that is a place, a month, or a company-style word is a name, not a skill.
  if (NOT_SKILL_STEMS.has(key) || c.stems.every((s) => NOT_SKILL_STEMS.has(s))) return "name";
  // A capitalized word in the middle of a sentence that we do not recognize: could be a tool, could be a company.
  if (c.n === 1 && c.proper && !c.acronym) return "name";
  return "other";
}

// The degree words, ranked, so "a bachelor's degree" is met by a master's too.
const DEGREES: { rank: number; label: string; re: RegExp }[] = [
  { rank: 1, label: "an associate degree", re: /\bassociate(?:'s|s)?\b|\bA\.?A\.?S?\b/i },
  { rank: 2, label: "a bachelor's degree", re: /\bbachelor|\bB\.?\s?[AS]\.?\b|\bBSc\b|\bBBA\b|\bBSN\b/i },
  { rank: 3, label: "a master's degree", re: /\bmaster(?:'s|s)?\b|\bM\.?\s?[AS]\.?\b|\bMBA\b|\bMSc\b/i },
  { rank: 4, label: "a doctorate", re: /\bphd\b|\bph\.d\b|\bdoctorate\b|\bdoctor of\b/i },
];

function degreeRank(text: string): number {
  let best = 0;
  for (const d of DEGREES) if (d.re.test(text)) best = Math.max(best, d.rank);
  return best;
}

function requirementsFrom(postingText: string, resumeText: string): Requirement[] {
  const out: Requirement[] = [];
  const lines = postingText.split(/\n|(?<=[.!?])\s+/).map((l) => l.replace(/^[-*•·\s]+/, "").trim()).filter(Boolean);

  const years: { n: number; line: string }[] = [];
  for (const line of lines) {
    const m = line.match(/(\d{1,2})\s*\+?\s*(?:(?:-|to)\s*\d{1,2}\s*)?(?:\+\s*)?years?/i);
    if (m && /experience|exp\b|working|background|in\s+\w+/i.test(line) && line.length < 220) years.push({ n: Number(m[1]), line });
  }
  const top = years.sort((a, b) => b.n - a.n)[0];
  if (top && top.n >= 1 && top.n <= 20) {
    out.push({
      label: `${top.n}+ years: "${top.line.length > 110 ? `${top.line.slice(0, 107)}...` : top.line}"`,
      status: "check",
      note: `The posting asks for about ${top.n} years. Check that the dates on your resume add up to that, and say so in your summary if they do.`,
    });
  }

  const need = postingText
    .split("\n")
    .filter((l) => /degree|bachelor|master|associate|ph\.?d|high school|diploma|ged\b/i.test(l))
    .map(degreeRank)
    .filter((r) => r > 0);
  const hasHs = /high school|diploma|\bged\b/i.test(postingText) && need.length === 0;
  if (need.length) {
    const required = Math.min(...need);
    const have = degreeRank(resumeText);
    const label = DEGREES.find((d) => d.rank === required)?.label ?? "a degree";
    const equivalent = /equivalent|or related experience|in lieu/i.test(postingText);
    out.push({
      label: `Education: ${label}`,
      status: have >= required ? "found" : equivalent ? "check" : "missing",
      note:
        have >= required
          ? "Your resume lists a degree at or above this level."
          : equivalent
            ? "Your resume does not list this degree, but the posting accepts equivalent experience. Say so in your summary."
            : "Your resume does not list a degree at this level. If you have one, add it to Education. If not, apply anyway if the rest fits, and lead with your experience.",
    });
  } else if (hasHs) {
    out.push({ label: "Education: a high school diploma or GED", status: /high school|diploma|\bged\b|degree|bachelor|associate|master/i.test(resumeText) ? "found" : "check", note: "Most postings that ask for this only need it listed under Education." });
  }
  return out;
}

/** Finds the key phrases in a posting and checks which are in the resume. Returns the strongest terms first. */
export function matchKeywords(resumeText: string, postingText: string): MatchResult {
  const posting = segments(postingText, true);
  const resume = resumeGrams(segments(resumeText, false));
  const all = candidates(posting);

  const keyOf = (c: Cand) => c.stems.join(" ");
  const isListed = (c: Cand) => {
    const k = keyOf(c);
    return TOOL_STEMS.has(k) || SKILL_STEMS.has(k) || SOFT_STEMS.has(k) || CERT_STEMS.has(k);
  };

  const kept: Cand[] = [];
  for (const c of all.values()) {
    // One mention is enough only for a named skill, an acronym, a tool-like capitalised name, or the job title itself.
    const signal = isListed(c) || c.acronym || (c.n === 1 && c.proper) || (c.n > 1 && c.title);
    if (c.count >= 2 || signal) {
      // A single ordinary word needs to be said at least three times to matter.
      if (c.n === 1 && c.count < 3 && !signal) continue;
      kept.push(c);
    }
  }

  // Drop a shorter phrase when a longer kept phrase accounts for every use of it ("customer" inside "customer success"),
  // or when both are part of the job title.
  const keep = kept.filter((c) => !kept.some((o) => o !== c && o.n > c.n && o.count >= c.count && (o.count >= 2 || (o.title && c.title)) && containsRun(o.stems, c.stems)));

  const kinds = new Map<Cand, TermKind>();
  for (const c of keep) if (c.n === 1) kinds.set(c, kindOf(keyOf(c), c));
  const nameStems = new Set(keep.filter((c) => kinds.get(c) === "name").map((c) => c.stems[0]));
  for (const c of keep) {
    if (c.n === 1) continue;
    const k = kindOf(keyOf(c), c);
    kinds.set(c, k === "other" && c.stems.every((x) => nameStems.has(x) || NOT_SKILL_STEMS.has(x)) ? "name" : k);
  }

  const scored = keep.map((c) => {
    const key = keyOf(c);
    const kind = kinds.get(c) ?? "other";
    const listed = isListed(c);
    const weight = c.n === 1 ? 1 : c.n === 2 ? 1.6 : 2;
    const score = c.count * weight + (c.req ? 1.5 : 0) + (listed ? 2 : 0) + (c.acronym || c.proper ? 1 : 0) + (c.title ? 3 : 0);
    const onlyNice = c.nice > 0 && c.nice >= c.count && c.req === 0;
    const tier: TermTier = onlyNice ? "preferred" : c.req > 0 || c.count >= 3 || c.title ? "required" : "normal";
    let status: TermStatus;
    let forms: string[] = [];
    if (inResume(key, resume.grams)) {
      status = "found";
      forms = [key, ...aliasGroupOf(key)];
    } else if (c.n > 1 && c.stems.every((x) => resume.words.has(x))) status = "words";
    else status = "missing";
    return { phrase: c.phrase, count: c.count, score, kind, tier, status, forms, key } satisfies TermResult & { key: string };
  });

  scored.sort((a, b) => b.score - a.score || a.phrase.localeCompare(b.phrase));

  // The job title is the first line of the posting, cut before a company or location.
  const firstLine = postingText.split("\n").map((l) => l.trim()).find(Boolean) ?? "";
  const titleText = firstLine.split(/\s[-–—|@]\s|\sat\s|\sin\s|,|\(/i)[0]?.trim() ?? "";
  let title: MatchResult["title"] = null;
  let titleKey = "";
  if (titleText && titleText.split(/\s+/).length <= 8 && titleText.length >= 4 && !/[.!?]$/.test(titleText)) {
    const stems = segments(titleText, false).flatMap((s) => s.toks.map((t) => t.stem));
    if (stems.length) {
      titleKey = stems.join(" ");
      // "Senior Account Executive" is close to "Account Executive": keep the title without its leading modifiers.
      const core = stems.length > 2 && stems.slice(1).some((_, k) => stems.length - (k + 1) >= 2 && resume.grams.has(stems.slice(k + 1).join(" ")));
      title = { phrase: titleText, status: resume.grams.has(titleKey) ? "found" : core || stems.every((x) => resume.words.has(x)) ? "words" : "missing" };
    }
  }

  const clean = (t: TermResult & { key: string }): TermResult => ({ phrase: t.phrase, count: t.count, score: t.score, kind: t.kind, tier: t.tier, status: t.status, forms: t.forms });
  const real = scored.filter((t) => t.kind !== "name" && t.key !== titleKey);
  // A name that is just part of a longer real phrase ("six" inside "six sigma") is not worth showing.
  const names = scored.filter((t) => t.kind === "name" && !real.some((r) => containsRun(r.key.split(" "), t.key.split(" ")))).map(clean);
  const terms = real.slice(0, MAX_TERMS).map(clean);

  const required = terms.filter((t) => t.tier === "required");
  return {
    terms,
    names,
    title,
    requirements: requirementsFrom(postingText, resumeText),
    found: terms.filter((t) => t.status === "found").length,
    words: terms.filter((t) => t.status === "words").length,
    missing: terms.filter((t) => t.status === "missing").length,
    requiredFound: required.filter((t) => t.status === "found").length,
    requiredTotal: required.length,
  };
}

function containsRun(long: string[], short: string[]): boolean {
  for (let i = 0; i + short.length <= long.length; i++) {
    if (short.every((s, j) => long[i + j] === s)) return true;
  }
  return false;
}

export type Piece = { text: string; hit: boolean };

/** Splits the resume into pieces, marking the stretches that match a found term, so the page can highlight them. */
export function markResume(resumeText: string, terms: TermResult[]): Piece[] {
  const forms = new Set<string>();
  let longest = 1;
  for (const t of terms) {
    if (t.status !== "found") continue;
    for (const f of t.forms) {
      forms.add(f);
      longest = Math.max(longest, f.split(" ").length);
    }
  }
  if (!forms.size) return [{ text: resumeText, hit: false }];
  const prepared = resumeText;
  const toks: { start: number; end: number; stem: string }[] = [];
  const re = /[A-Za-z0-9][A-Za-z0-9+#.]*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(prepared))) {
    const raw = m[0].replace(/\.+$/, "");
    if (!raw) continue;
    toks.push({ start: m.index, end: m.index + raw.length, stem: stem(raw.toLowerCase()) });
  }
  const hits: [number, number][] = [];
  let i = 0;
  while (i < toks.length) {
    let matched = 0;
    for (let n = Math.min(longest, toks.length - i); n >= 1; n--) {
      const slice = toks.slice(i, i + n);
      // The words must be next to each other, with only spaces or hyphens between them.
      let joined = true;
      for (let j = 1; j < slice.length; j++) if (!/^[\s\-‐‑‒–—]+$/.test(prepared.slice(slice[j - 1].end, slice[j].start))) joined = false;
      if (joined && forms.has(slice.map((t) => t.stem).join(" "))) {
        matched = n;
        break;
      }
    }
    if (matched) {
      hits.push([toks[i].start, toks[i + matched - 1].end]);
      i += matched;
    } else i += 1;
  }
  const out: Piece[] = [];
  let at = 0;
  for (const [s, e] of hits) {
    if (s > at) out.push({ text: resumeText.slice(at, s), hit: false });
    out.push({ text: resumeText.slice(s, e), hit: true });
    at = e;
  }
  if (at < resumeText.length) out.push({ text: resumeText.slice(at), hit: false });
  return out;
}
