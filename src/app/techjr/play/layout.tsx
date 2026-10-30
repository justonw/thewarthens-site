import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import type { ReactNode } from "react";
import PlayShell from "@/components/career-day/PlayShell";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// The game itself, shown with no site header or footer so it also works as a kiosk at a career
// fair table. The page people find on search is /techjr; the game pages stay out of the index.
export const metadata: Metadata = {
  title: "Play Tech Journey Jr.",
  description: "Pick a world and become a Tech Pro! A kid-friendly tech career game from Tech Journey with The Warthens.",
  robots: { index: false, follow: false },
};

export default function PlayLayout({ children }: { children: ReactNode }) {
  return (
    <div className={fredoka.className}>
      <PlayShell>{children}</PlayShell>
    </div>
  );
}
