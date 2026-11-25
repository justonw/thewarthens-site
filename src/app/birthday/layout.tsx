import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Newsreader } from "next/font/google";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-bd-serif",
  display: "swap",
});

// A private link: search engines are told not to list it, and it is not in the sitemap.
export const metadata: Metadata = {
  title: "You're invited: Atiya's Birthday Lunch",
  description: "Click to reveal the details, and tell us how many people are coming.",
  robots: { index: false, follow: false, nocache: true },
  openGraph: {
    title: "You're invited: Atiya's Birthday Lunch",
    description: "Click to reveal the details. Tell us how many people are coming.",
    type: "website",
    url: "https://thewarthens.com/birthday",
  },
  twitter: { card: "summary_large_image", title: "You're invited: Atiya's Birthday Lunch", description: "Click to reveal the details. Tell us how many people are coming." },
};

export default function BirthdayLayout({ children }: { children: ReactNode }) {
  return <div className={`${newsreader.variable} min-h-screen bg-[#fbf7ff] text-[#2a1a3d]`}>{children}</div>;
}
