import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";
import { startHereGuides } from "@/lib/start-here";
import { faithWritings } from "@/lib/faith-writings";
import { articles } from "@/lib/techjr-articles";
import { RESUME_GUIDES_UPDATED, resumeGuides } from "@/lib/resume-guides";

// Categories of writing that have at least one piece (each has its own listing page).
const faithCategories = [...new Set(faithWritings.map((w) => w.category))];

// Bump this when you make a meaningful content change to a static page
// (home, /tech, /faith, /faith/women-who-seek) so search engines get a
// real freshness signal instead of "just now" on every single crawl.
const SITE_LAST_UPDATED = new Date("2026-10-24");

function parseUpdated(updated: string): Date {
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(updated) ? new Date(updated) : new Date(`1 ${updated}`);
  return Number.isNaN(parsed.getTime()) ? SITE_LAST_UPDATED : parsed;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://thewarthens.com";
  const routes: { path: string; priority: number; lastModified: Date }[] = [
    { path: "", priority: 1, lastModified: SITE_LAST_UPDATED },
    { path: "/tech", priority: 0.9, lastModified: SITE_LAST_UPDATED },
    { path: "/about", priority: 0.7, lastModified: new Date("2026-11-16") },
    { path: "/privacy", priority: 0.3, lastModified: new Date("2026-11-20") },
    { path: "/terms", priority: 0.3, lastModified: new Date("2026-11-20") },
    { path: "/refunds", priority: 0.3, lastModified: new Date("2026-11-20") },
    { path: "/tech/guides", priority: 0.8, lastModified: new Date("2026-11-16") },
    { path: "/tech/start-here", priority: 0.8, lastModified: new Date("2026-11-16") },
    { path: "/tech/coaching", priority: 0.8, lastModified: new Date("2026-10-24") },
    { path: "/resume", priority: 0.9, lastModified: new Date("2026-11-16") },
    { path: "/resume/keyword-matcher", priority: 0.8, lastModified: new Date("2026-11-16") },
    { path: "/resume/guides", priority: 0.8, lastModified: new Date(RESUME_GUIDES_UPDATED) },
    ...resumeGuides.map((g) => ({ path: `/resume/guides/${g.slug}`, priority: 0.8, lastModified: new Date(g.updated) })),
    { path: "/techjr", priority: 0.9, lastModified: new Date("2026-11-03") },
    { path: "/techjr/play", priority: 0.8, lastModified: new Date("2026-11-03") },
    { path: "/techjr/play/ages-5-7", priority: 0.8, lastModified: new Date("2026-11-03") },
    { path: "/techjr/play/ages-8-10", priority: 0.8, lastModified: new Date("2026-11-03") },
    ...articles.map((a) => ({
      path: `/techjr/${a.slug}`,
      priority: 0.8,
      lastModified: parseUpdated(a.updated),
    })),
    { path: "/contact", priority: 0.6, lastModified: new Date("2026-11-12") },
    { path: "/magnets", priority: 0.7, lastModified: new Date("2026-11-12") },
    { path: "/jesus", priority: 0.7, lastModified: new Date("2026-11-14") },
    { path: "/source-of-life", priority: 0.7, lastModified: new Date("2026-11-14") },
    { path: "/source-of-life/leader-guide", priority: 0.5, lastModified: new Date("2026-11-14") },
    { path: "/faith", priority: 0.8, lastModified: new Date("2026-11-14") },
    { path: "/faith/women-who-seek", priority: 0.7, lastModified: SITE_LAST_UPDATED },
    { path: "/faith/present-but-missing", priority: 0.7, lastModified: new Date("2026-11-07") },
    ...guides.map((g) => ({
      path: `/tech/guides/${g.slug}`,
      priority: 0.7,
      lastModified: parseUpdated(g.updated),
    })),
    ...startHereGuides.map((g) => ({
      path: `/tech/start-here/${g.slug}`,
      priority: 0.7,
      lastModified: parseUpdated(g.updated),
    })),
    ...faithCategories.map((c) => ({ path: `/faith/${c}`, priority: 0.7, lastModified: parseUpdated(faithWritings.filter((w) => w.category === c).map((w) => w.date).sort().at(-1) ?? "2026-11-16") })),
    ...faithWritings.map((w) => ({
      path: `/faith/${w.category}/${w.slug}`,
      priority: 0.7,
      lastModified: parseUpdated(w.date),
    })),
  ];

  return routes.map(({ path, priority, lastModified }) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority,
  }));
}
