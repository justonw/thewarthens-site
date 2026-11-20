import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { LEGAL_DRAFT, refunds } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Refund Policy | The Warthens",
  description: "All sales are final. What happens when a build does not work, and how billing mistakes are fixed.",
  alternates: { canonical: "/refunds" },
  robots: LEGAL_DRAFT ? { index: false, follow: false } : undefined,
};

export default function RefundsPage() {
  return <LegalPage doc={refunds} />;
}
