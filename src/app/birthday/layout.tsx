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
  description: "Sunday, December 6 at Chattahoochee Food Works in Atlanta. Tap the link for the details, the menu picks, parking, and to RSVP by November 28.",
  robots: { index: false, follow: false, nocache: true },
  openGraph: {
    title: "You're invited: Atiya's Birthday Lunch",
    description: "Tap the link for details and to RSVP by November 28.",
    type: "website",
    url: "https://thewarthens.com/birthday",
  },
  twitter: { card: "summary_large_image", title: "You're invited: Atiya's Birthday Lunch", description: "Tap the link for details and to RSVP by November 28." },
};

export default function BirthdayLayout({ children }: { children: ReactNode }) {
  return <div className={`${newsreader.variable} min-h-screen bg-[#fbf7ff] text-[#2a1a3d]`}>{children}</div>;
}
