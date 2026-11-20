import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { LEGAL_DRAFT, privacy } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Privacy Policy | The Warthens",
  description: "What we collect on thewarthens.com, why, who helps us handle it, and the choices you have.",
  alternates: { canonical: "/privacy" },
  // Hidden from search engines until LEGAL_DRAFT is switched off.
  robots: LEGAL_DRAFT ? { index: false, follow: false } : undefined,
};

export default function PrivacyPage() {
  return <LegalPage doc={privacy} />;
}
