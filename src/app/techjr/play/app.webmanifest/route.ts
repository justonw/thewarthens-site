// Lets a parent add the game to a phone's home screen so a child can open it in one tap.
export const dynamic = "force-static";

export function GET() {
  const manifest = {
    id: "/techjr/play",
    name: "Tech Journey Jr.",
    short_name: "Tech Jr.",
    description: "Free games for kids ages 5 to 10: online safety, careers, and cool facts. No ads, no sign-in.",
    start_url: "/techjr/play",
    scope: "/techjr/play",
    display: "standalone",
    orientation: "any",
    background_color: "#1a1250",
    theme_color: "#1a1250",
    categories: ["education", "kids", "games"],
    icons: [
      { src: "/techjr-icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/techjr-icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/techjr-icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
  return new Response(JSON.stringify(manifest), {
    headers: { "content-type": "application/manifest+json" },
  });
}
