import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://thewarthens.com";
  const routes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/tech", priority: 0.9 },
    { path: "/faith", priority: 0.8 },
    { path: "/faith/women-who-seek", priority: 0.7 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority,
  }));
}
