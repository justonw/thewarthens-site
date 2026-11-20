import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { LEGAL_DRAFT, terms } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Terms of Use | The Warthens",
  description: "The terms for using thewarthens.com and the Resume Builder.",
  alternates: { canonical: "/terms" },
  robots: LEGAL_DRAFT ? { index: false, follow: false } : undefined,
};

export default function TermsPage() {
  return <LegalPage doc={terms} />;
}
