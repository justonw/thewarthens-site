// "What to do next" after a resume is built: which field the person is going into, and which of our
// free guides, partner programs, and coaching fit. It reuses the career paths and guides the Tech
// Journey page already uses, so what we recommend here matches what we recommend there.
import { careerPaths, type CareerPath, type PathId } from "./quiz";
import { getStartHereForPath } from "./start-here";
import { freeResources } from "./tech-links";

// Words in a job title or posting that point to a field. The path with the most hits wins.
const FIELD_WORDS: Record<PathId, string[]> = {
  sales: ["sales", "sdr", "bdr", "account executive", "business development", "account manager", "outbound", "prospecting", "quota", "revenue", "pipeline", "inside sales", "outside sales", "sales representative", "sales associate", "sales manager", "territory", "customer success", "insurance agent", "real estate agent", "realtor", "biz dev"],
  swe: ["software engineer", "software developer", "developer", "programmer", "front-end", "frontend", "back-end", "backend", "full stack", "full-stack", "javascript", "python", "react", "web developer"],
  data: ["data analyst", "data analytics", "data scientist", "business intelligence", "bi analyst", "tableau", "power bi", "sql", "analytics"],
  itsec: ["cybersecurity", "cyber security", "security analyst", "soc analyst", "information security", "help desk", "it support", "systems administrator", "network administrator", "grc", "penetration", "infosec", "technical support"],
  uxui: ["ux", "ui designer", "product designer", "user experience", "user interface", "figma", "interaction design"],
  trades: ["electrician", "hvac", "plumber", "plumbing", "welder", "construction", "apprentice", "carpenter"],
  supplychain: ["supply chain", "logistics", "procurement", "warehouse", "inventory", "purchasing", "demand planner", "freight"],
  bizops: ["accountant", "accounting", "bookkeeper", "bookkeeping", "human resources", "hr generalist", "property manager", "office manager", "operations manager", "project coordinator", "marketing"],
  healthcare: ["medical billing", "medical coding", "health information", "clinical", "patient", "healthcare", "medical assistant"],
};

function wordScore(text: string, words: string[]) {
  const haystack = ` ${text.toLowerCase().replace(/[^a-z0-9+#./ -]+/g, " ")} `;
  let score = 0;
  for (const word of words) {
    // Whole words only, so "ui" does not match inside "build".
    const pattern = new RegExp(`[^a-z0-9]${word.replace(/[.+*?^${}()|[\]\\]/g, "\\$&")}[^a-z0-9]`);
    if (pattern.test(haystack)) score += word.includes(" ") || word.length > 4 ? 2 : 1;
  }
  return score;
}

// The job title counts three times as much as the rest of the posting's words.
export function detectPath(title: string, rest = ""): PathId | null {
  let best: PathId | null = null;
  let bestScore = 0;
  for (const id of Object.keys(FIELD_WORDS) as PathId[]) {
    const score = wordScore(title, FIELD_WORDS[id]) * 3 + wordScore(rest, FIELD_WORDS[id]);
    if (score > bestScore) {
      best = id;
      bestScore = score;
    }
  }
  return bestScore >= 3 ? best : null;
}

export function providerName(href: string): string {
  if (href.includes("higherlevels.com")) return "Higher Levels";
  if (href.includes("springboard.com")) return "Springboard";
  if (href.includes("coursecareers.com")) return "CourseCareers";
  if (href.includes("get.apollo.io")) return "Apollo.io";
  if (href.includes("perscholas.org")) return "Per Scholas";
  if (href.includes("freecodecamp.org")) return "freeCodeCamp";
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "Partner";
  }
}

export type NextStepLink = { label: string; href: string; by: string; external: boolean };

export type NextSteps = {
  path: CareerPath | null;
  // Our free Start Here guide for the field, if there is one.
  guide: { label: string; href: string } | null;
  // Free places to learn that fit the field.
  free: NextStepLink[];
  // Paid programs from partners (we may earn compensation), or a neutral source when we have no partner.
  programs: NextStepLink[];
  hasPartner: boolean;
};

const FREE_BY_PATH: Partial<Record<PathId, string[]>> = {
  swe: ["freecodecamp.org"],
  itsec: ["perscholas.org"],
  data: ["freecodecamp.org"],
  sales: ["get.apollo.io"],
};

export function nextStepsFor(pathId: PathId | null): NextSteps {
  if (!pathId) return { path: null, guide: null, free: [], programs: [], hasPartner: false };
  const path = careerPaths[pathId];
  const guide = getStartHereForPath(pathId);

  const programs: NextStepLink[] = [];
  const seen = new Set<string>();
  for (const l of path.links) {
    const key = `${l.href}|${l.label}`;
    if (seen.has(key)) continue;
    seen.add(key);
    programs.push({ label: l.label, href: l.href, by: providerName(l.href), external: true });
  }

  const wanted = FREE_BY_PATH[pathId] ?? [];
  const free: NextStepLink[] = freeResources.links
    .filter((l) => wanted.some((w) => l.href.includes(w)))
    .map((l) => ({ label: l.label, href: l.href, by: providerName(l.href), external: true }));

  return {
    path,
    guide: guide ? { label: `${path.title}: the free Start Here guide`, href: `/tech/start-here/${guide.slug}` } : null,
    free,
    programs,
    hasPartner: path.affiliate,
  };
}
