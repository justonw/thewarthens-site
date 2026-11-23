import type { ReactNode } from "react";
import { Newsreader } from "next/font/google";

// A reading serif for the titles and the Scripture, on the same warm paper as the Source of Life devotional.
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-sol-serif",
  display: "swap",
});

export default function MinistryLayout({ children }: { children: ReactNode }) {
  return <div className={`${newsreader.variable} sol-light min-h-screen bg-sol-paper text-sol-ink`}>{children}</div>;
}
