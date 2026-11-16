// A plain, honest keyword check: which words and phrases a job posting leans on, and which of them are in a resume.
// It runs entirely in the browser with no AI, so it costs nothing and gives the same answer every time. It is NOT a
// score from any hiring software (nobody outside those companies knows how theirs works). It finds the phrases a
// posting repeats or names, and checks the resume for the same wording.

export type TermStatus = "found" | "words" | "missing";

export type TermResult = {
  phrase: string;
  /** How many times the posting uses it. */
  count: number;
  /** Used for sorting only. */
  score: number;
  /** found: the exact phrase (or a known short form) is in the resume. words: every word is there, but not as that phrase. */
  status: TermStatus;
};

export type MatchResult = {
  terms: TermResult[];
  found: number;
  words: number;
  missing: number;
};

// Words that cannot be part of a key phrase: everyday words, plus the filler that fills every job posting.
const STOP = new Set(
  (
    "a about above across after again against all also am an and any are as at be because been before being below between both but by can could did do does doing down during each either else few for from further get gets had has have having he her here hers him his how i if in into is it its itself just let may me might more most much must my myself no nor not now of off on once one only onto or other our ours out over own per same she should so some such than that the their theirs them then there these they this those through to too under until up upon us use used using very via was we well were what when where whether which while who whom why will with within without would you your yours " +
    "ability able about additional applicant applicants apply applying benefits bonus candidate candidates company compensation day days deliver desire desired detail determined duties duty eligible employee employees employer employment encouraged equal essential excellent experience experienced exceptional familiarity familiar fast fulfill full great ideal ideally immediate include includes including interested join joining knowledge location looking make making many minimum must need needed needs new nice opportunity opportunities part perform performs plus position positions preferred prior proven qualifications qualified qualify related relevant required requirements requires requirement responsibilities responsibility responsible role roles salary seeking self several skills solid something strong successful take team teams thrive time understanding understand want wants way ways week weeks willing willingness work working works year years " +
    "etc eg ie per etc responsibilities benefits"
  ).split(/\s+/)
);

// Short phrases that are real, specific skills. Seeing one of these once is enough to list it.
const SKILLS = new Set(
  (
    "crm|salesforce|hubspot|saas|b2b|b2c|cold calling|prospecting|pipeline|quota|lead generation|outbound|inbound|sdr|bdr|account executive|account management|customer success|onboarding|upselling|cross selling|negotiation|forecasting|" +
    "sql|python|javascript|typescript|react|node.js|java|c++|c#|html|css|aws|azure|gcp|excel|tableau|power bi|looker|jira|confluence|zendesk|servicenow|git|github|docker|kubernetes|ci/cd|devops|linux|windows|macos|bash|powershell|rest|api|apis|json|etl|data analysis|data analytics|data visualization|dashboards|reporting|machine learning|" +
    "help desk|service desk|troubleshooting|active directory|networking|tcp/ip|dns|dhcp|vpn|firewall|firewalls|siem|splunk|incident response|penetration testing|vulnerability management|threat detection|risk assessment|compliance|nist|soc 2|iso 27001|hipaa|gdpr|pci|security operations|endpoint security|identity and access management|iam|" +
    "project management|program management|product management|agile|scrum|kanban|stakeholder management|budgeting|budget management|process improvement|change management|vendor management|cross functional|" +
    "seo|sem|content marketing|email marketing|google analytics|social media|copywriting|paid search|marketing automation|" +
    "leadership|mentoring|coaching|training|scheduling|customer service|customer support|patient care|quickbooks|payroll|accounts payable|accounts receivable|reconciliation|auditing|bilingual|spanish"
  ).split("|")
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
  ["google cloud platform", "gcp"],
  ["cross functional", "crossfunctional"],
];

const REQ_HEADING =
  /^\s*(?:[-*•#]+\s*)?(?:requirements?|qualifications?|minimum qualifications?|basic qualifications?|required skills|what you(?:'|’)ll need|what you will need|what we(?:'|’)re looking for|what we are looking for|must haves?|you have|you bring|who you are|about you|skills)\b/i;
const OTHER_HEADING =
  /^\s*(?:[-*•#]+\s*)?(?:about (?:us|the (?:role|company|team|job))|responsibilities|what you(?:'|’)ll do|what you will do|benefits|perks|compensation|why join|our (?:mission|culture)|the role|overview|equal opportunity)\b/i;

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
type Segment = { toks: Tok[]; req: boolean; title: boolean };

function prepare(text: string): string {
  return text
    .replace(/ci\/cd/gi, "cicd")
    .replace(/\.net\b/gi, "dotnet")
    .replace(/\btcp\/ip\b/gi, "tcpip")
    .replace(/\bq&a\b/gi, "qa")
    .replace(/\br&d\b/gi, "rd")
    .replace(/[’']s\b/g, "")
    .replace(/[’']/g, "")
    .replace(/[-‐‑‒–—]/g, " ")
    .replace(/\r/g, "\n");
}

function segments(text: string, markSections: boolean): Segment[] {
  const out: Segment[] = [];
  let inReq = false;
  let firstLine = true;
  for (const line of prepare(text).split("\n")) {
    if (!line.trim()) {
      continue;
    }
    if (markSections) {
      // Section headings switch the "requirements" flag, so a term under "Requirements" counts for more.
      if (OTHER_HEADING.test(line) && line.trim().length < 60) inReq = false;
      else if (REQ_HEADING.test(line) && line.trim().length < 60) inReq = true;
    }
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
      if (toks.length) out.push({ toks, req: inReq, title: firstLine && markSections });
    }
    firstLine = false;
  }
  return out;
}

const isStop = (t: Tok) => STOP.has(t.low) || /^\d+$/.test(t.low) || (t.low.length === 1 && !/^[a-z]$/.test(t.low) ) || t.low.length < 2;

type Cand = { phrase: string; stems: string[]; n: number; count: number; req: number; title: boolean; acronym: boolean; proper: boolean };

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
          const c = map.get(key) ?? { phrase, stems: slice.map((t) => t.stem), n, count: 0, req: 0, title: false, acronym: false, proper: false };
          c.count += 1;
          if (seg.req) c.req += 1;
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
    for (let n = 1; n <= 4; n++) for (let i = 0; i + n <= s.length; i++) grams.add(s.slice(i, i + n).join(" "));
  }
  return { grams, words };
}

const aliasStems = (group: string[]) => group.map((g) => segments(g, false).flatMap((s) => s.toks.map((t) => t.stem)).join(" "));

const ALIASES: string[][] = ALIAS_GROUPS.map(aliasStems);
const SKILL_STEMS = new Set([...SKILLS].map((k) => aliasStems([k])[0]));

function inResume(stems: string[], grams: Set<string>): boolean {
  const key = stems.join(" ");
  if (grams.has(key)) return true;
  for (const group of ALIASES) if (group.includes(key) && group.some((g) => grams.has(g))) return true;
  return false;
}

const MAX_TERMS = 40;

/** Finds the key phrases in a posting and checks which are in the resume. Returns the strongest terms first. */
export function matchKeywords(resumeText: string, postingText: string): MatchResult {
  const posting = segments(postingText, true);
  const resume = resumeGrams(segments(resumeText, false));
  const all = candidates(posting);

  const isSkill = (c: Cand) => SKILL_STEMS.has(c.stems.join(" "));
  const kept: Cand[] = [];
  for (const c of all.values()) {
    // One mention is enough only for a named skill, an acronym, a tool-like capitalised name, or the job title itself.
    const signal = isSkill(c) || c.acronym || (c.n === 1 && c.proper) || (c.n > 1 && c.title);
    if (c.count >= 2 || signal) {
      // A single ordinary word needs to be said at least three times to matter.
      if (c.n === 1 && c.count < 3 && !signal) continue;
      kept.push(c);
    }
  }

  // Drop a shorter phrase when a longer kept phrase accounts for every use of it ("customer" inside "customer success"),
  // or when both are part of the job title.
  const keep = kept.filter((c) => !kept.some((o) => o !== c && o.n > c.n && o.count >= c.count && (o.count >= 2 || (o.title && c.title)) && containsRun(o.stems, c.stems)));

  const scored = keep.map((c) => {
    const weight = c.n === 1 ? 1 : c.n === 2 ? 1.6 : 2;
    const score = c.count * weight + (c.req ? 1.5 : 0) + (isSkill(c) ? 2 : 0) + (c.acronym || c.proper ? 1 : 0) + (c.title ? 3 : 0);
    let status: TermStatus;
    if (inResume(c.stems, resume.grams)) status = "found";
    else if (c.n > 1 && c.stems.every((s) => resume.words.has(s))) status = "words";
    else status = "missing";
    return { phrase: c.phrase, count: c.count, score, status } satisfies TermResult;
  });

  scored.sort((a, b) => b.score - a.score || a.phrase.localeCompare(b.phrase));
  const terms = scored.slice(0, MAX_TERMS);
  return {
    terms,
    found: terms.filter((t) => t.status === "found").length,
    words: terms.filter((t) => t.status === "words").length,
    missing: terms.filter((t) => t.status === "missing").length,
  };
}

function containsRun(long: string[], short: string[]): boolean {
  for (let i = 0; i + short.length <= long.length; i++) {
    if (short.every((s, j) => long[i + j] === s)) return true;
  }
  return false;
}
