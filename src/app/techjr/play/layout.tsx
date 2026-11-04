import type { Metadata, Viewport } from "next";
import { Fredoka } from "next/font/google";
import type { ReactNode } from "react";
import PlayShell from "@/components/career-day/PlayShell";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// The game itself, shown with no site header or footer so it also works as a kiosk at a career
// fair table. The age picker and the two age-group pages are indexed (they are what a parent finds
// and taps "Play" on); the individual worlds and the badge screen stay out of the index. The
// manifest lets a parent add the game to a phone's home screen so a child opens it in one tap.
export const metadata: Metadata = {
  title: "Play Tech Journey Jr.",
  description: "Pick a world and become a Tech Pro! A kid-friendly tech career game from Tech Journey with The Warthens.",
  robots: { index: false, follow: true },
  manifest: "/techjr/play/app.webmanifest",
  icons: { apple: "/techjr-icons/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "Tech Jr.", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = { themeColor: "#1a1250" };

export default function PlayLayout({ children }: { children: ReactNode }) {
  return (
    <div className={fredoka.className}>
      <PlayShell>{children}</PlayShell>
    </div>
  );
}
