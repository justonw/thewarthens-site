// Counts of what kinds of jobs people build resumes for, so the owner can see which fields show up and which job titles have no
// role lens yet (the next lenses to write). It stores numbers only: a count per day per field, and a count per day per job title
// from the POSTING (never a name, an email, or anything from the person's resume).
//
//   funnel/<day>/field/<lens id | none>     builds for that kind of job
//   funnel/<day>/field-general              builds with no posting (a general resume)
//   funnel/<day>/nolens/<slug of the title> builds whose job title matched no lens
import { LENSES, matchLenses } from "./interview-lenses";
import { bumpCounter, type Kv } from "./resume-limits";

const NO_CAP = Number.MAX_SAFE_INTEGER;
const day = (now: Date) => now.toISOString().slice(0, 10);
export const fieldKey = (id: string, now = new Date()) => `funnel/${day(now)}/field/${id}`;
export const generalKey = (now = new Date()) => `funnel/${day(now)}/field-general`;
export const noLensKey = (slug: string, now = new Date()) => `funnel/${day(now)}/nolens/${slug}`;

// A job title reduced to a few plain lowercase words, so "Sr. Dental Assistant (Remote)!" and "senior dental assistant" can be
// told apart from nothing at all but never carry anything personal. Empty when there is nothing usable.
export function titleSlug(title: string): string {
  const words = title
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .slice(0, 5);
  return words.join("-").slice(0, 40);
}

// Called once for a finished build from a real visitor. Never throws, and never matters to the build.
export async function countField(kv: Kv, title: string, keywords: string[], general: boolean, now = new Date()): Promise<string> {
  const id = matchLenses(title, keywords, true)[0]?.lens.id ?? "none";
  try {
    await bumpCounter(kv, fieldKey(id, now), 1, NO_CAP);
    if (general) await bumpCounter(kv, generalKey(now), 1, NO_CAP);
    if (id === "none") {
      const slug = titleSlug(title);
      if (slug) await bumpCounter(kv, noLensKey(slug, now), 1, NO_CAP);
    }
  } catch {
    /* a failed count is never worth failing a build */
  }
  return id;
}

export type FieldReport = {
  days: number;
  builds: number;
  fields: { id: string; name: string; n: number }[];
  general: number;
  nolens: { title: string; n: number }[];
};

const num = async (kv: Kv, key: string) => (((await kv.has(key)) ? ((await kv.get(key))?.data as { n?: number } | null)?.n : 0) ?? 0) as number;

// Adds up the last N days for the owner's report.
export async function fieldReport(kv: Kv, days: number, now = new Date()): Promise<FieldReport> {
  const names = new Map<string, string>([["none", "No lens yet"], ...LENSES.map((l) => [l.id, l.name] as [string, string])]);
  const totals = new Map<string, number>();
  const nolens = new Map<string, number>();
  let general = 0;
  for (let i = 0; i < days; i++) {
    const d = new Date(now.getTime() - i * 86_400_000);
    for (const id of names.keys()) totals.set(id, (totals.get(id) ?? 0) + (await num(kv, fieldKey(id, d))));
    general += await num(kv, generalKey(d));
    const prefix = `funnel/${day(d)}/nolens/`;
    for (const key of await kv.list(prefix)) nolens.set(key.slice(prefix.length), (nolens.get(key.slice(prefix.length)) ?? 0) + (await num(kv, key)));
  }
  const fields = [...names.entries()].map(([id, name]) => ({ id, name, n: totals.get(id) ?? 0 })).filter((f) => f.n > 0).sort((a, b) => b.n - a.n);
  return {
    days,
    builds: fields.reduce((n, f) => n + f.n, 0),
    fields,
    general,
    nolens: [...nolens.entries()].map(([title, n]) => ({ title: title.replace(/-/g, " "), n })).sort((a, b) => b.n - a.n).slice(0, 40),
  };
}
