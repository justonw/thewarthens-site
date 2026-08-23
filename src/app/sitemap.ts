import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";
import { startHereGuides } from "@/lib/start-here";

// Bump this when you make a meaningful content change to a static page
// (home, /tech, /faith, /faith/women-who-seek) so search engines get a
// real freshness signal instead of "just now" on every single crawl.
const SITE_LAST_UPDATED = new Date("2026-08-23");

function parseUpdated(updated: string): Date {
  const parsed = new Date(`1 ${updated}`);
  return Number.isNaN(parsed.getTime()) ? SITE_LAST_UPDATED : parsed;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://thewarthens.com";
  const routes: { path: string; priority: number; lastModified: Date }[] = [
    { path: "", priority: 1, lastModified: SITE_LAST_UPDATED },
    { path: "/tech", priority: 0.9, lastModified: SITE_LAST_UPDATED },
    { path: "/faith", priority: 0.8, lastModified: SITE_LAST_UPDATED },
    { path: "/faith/women-who-seek", priority: 0.7, lastModified: SITE_LAST_UPDATED },
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
  ];

  return routes.map(({ path, priority, lastModified }) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority,
  }));
}
