import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  title: "The Warthens | Tech Journey & Faith Journey",
  description:
    "Juston & Atiya Warthen, known as Tech Journey: real steps for a career change into tech, plus our journey of relying on God to discover, understand, and live out truth.",
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
  },
  openGraph: {
    type: "website",
    url: "https://thewarthens.com",
    siteName: "The Warthens",
    title: "The Warthens | Tech Journey & Faith Journey",
    description:
      "Practical steps toward a career and a life that fit, plus our journey of relying on God to discover, understand, and live out truth.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Warthens | Tech Journey & Faith Journey",
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
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
