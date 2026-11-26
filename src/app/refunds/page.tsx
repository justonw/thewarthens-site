import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { LEGAL_DRAFT, refunds } from "@/lib/legal-content";

const title = "Refund Policy for the Resume Builder | The Warthens";
const description =
  "All sales are final. Read what happens when a Resume Builder build does not work, and how The Warthens fixes billing mistakes.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/refunds" },
  openGraph: { title, description, url: "/refunds", siteName: "The Warthens", type: "website", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  robots: LEGAL_DRAFT ? { index: false, follow: false } : undefined,
};

export default function RefundsPage() {
  return <LegalPage doc={refunds} />;
}
