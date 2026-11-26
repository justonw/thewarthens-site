import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { LEGAL_DRAFT, terms } from "@/lib/legal-content";

const title = "Terms of Use: Website and Resume Builder | The Warthens";
const description =
  "The terms of use for thewarthens.com and the Resume Builder from The Warthens. Please read them before using the site or buying.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terms" },
  openGraph: { title, description, url: "/terms", siteName: "The Warthens", type: "website", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  robots: LEGAL_DRAFT ? { index: false, follow: false } : undefined,
};

export default function TermsPage() {
  return <LegalPage doc={terms} />;
}
