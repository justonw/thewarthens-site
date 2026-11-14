import type { ReactNode } from "react";
import { Newsreader } from "next/font/google";

// A reading serif for the headlines and the Scripture, set against the site's sans for everything else.
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-sol-serif",
  display: "swap",
});

// Warm paper by default. Individual sections switch to the deep-navy mood with the sol-night class.
export default function SourceOfLifeLayout({ children }: { children: ReactNode }) {
  return <div className={`${newsreader.variable} sol-light min-h-screen bg-sol-paper text-sol-ink`}>{children}</div>;
}
