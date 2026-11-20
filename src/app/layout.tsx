import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteChrome from "@/components/SiteChrome";
import SiteGuide from "@/components/SiteGuide";
import SiteTracker from "@/components/SiteTracker";
import { siteGraph } from "@/lib/site-schema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thewarthens.com"),
  title: "The Warthens: Career Change to Tech & Faith Journey",
  description:
    "Juston & Atiya Warthen share real steps for a career change into tech, plus their faith journey of relying on God to discover, understand, and live out truth.",
  keywords: [
    "tech journey warthen",
    "career change to tech",
    "career change no experience no degree",
    "tech career pivot",
    "is tech sales worth it",
    "is software engineering still a good career",
    "coding bootcamp worth it",
    "cybersecurity training",
    "faith journey",
    "Christian community",
  ],
  authors: [{ name: "Juston & Atiya Warthen" }],
  robots: {
    index: true,
    follow: true,
    // Lets Google show a large picture and a full snippet in results (a bigger, more eye-catching result).
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    url: "https://thewarthens.com",
    siteName: "The Warthens",
    title: "The Warthens: Career Change to Tech & Faith Journey",
    description:
      "Practical steps toward a career and a life that fit, plus our journey of relying on God to discover, understand, and live out truth.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Warthens: Career Change to Tech & Faith Journey",
    description:
      "Practical steps toward a career and a life that fit, plus our journey of relying on God to discover, understand, and live out truth.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraph) }} />
        {/* Impact.com (affiliate network) domain verification for Coursera partnership. Uses `value` per Impact.com's own snippet, not the usual `content`. */}
        <meta
          {...({
            name: "impact-site-verification",
            value: "e22c3751-67fe-4f30-8483-d23a24530698",
          } as React.DetailedHTMLProps<React.MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>)}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteChrome>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow-xl"
          >
            Skip to content
          </a>
          <Header />
        </SiteChrome>
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteChrome>
          <Footer />
          <SiteGuide />
          <SiteTracker />
        </SiteChrome>
      </body>
    </html>
  );
}
