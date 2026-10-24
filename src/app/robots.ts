import type { MetadataRoute } from "next";

// Search engines and AI answer engines are welcome: we want to be found and cited.
// Named bots get their own rule because a bot that matches a specific rule ignores the "*" rule,
// so the same disallow has to be repeated for each. Training-only crawlers (GPTBot, ClaudeBot,
// Google-Extended, CCBot) fall under "*" and are allowed. Add them here to opt out of training.
const answerEngineBots = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
];

const privatePaths = ["/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: privatePaths },
      { userAgent: answerEngineBots, allow: "/", disallow: privatePaths },
    ],
    sitemap: "https://thewarthens.com/sitemap.xml",
  };
}
