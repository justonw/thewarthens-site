import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { LEGAL_DRAFT, privacy } from "@/lib/legal-content";

const title = "Privacy Policy: What We Collect | The Warthens";
const description =
  "What we collect on thewarthens.com, why we collect it, who helps us handle it, and the choices you have about your information.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: { title, description, url: "/privacy", siteName: "The Warthens", type: "website", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  // Hidden from search engines until LEGAL_DRAFT is switched off.
  robots: LEGAL_DRAFT ? { index: false, follow: false } : undefined,
};

export default function PrivacyPage() {
  return <LegalPage doc={privacy} />;
}
