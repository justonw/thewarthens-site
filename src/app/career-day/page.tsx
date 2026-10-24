import type { Metadata } from "next";
import CareerDayKiosk from "@/components/career-day/CareerDayKiosk";

// Built for a school career fair table. Not for search engines: no indexing,
// not in the sitemap, and the page collects nothing from children.
export const metadata: Metadata = {
  title: "Tech Journey Jr. | Career Day",
  description: "Be a tech pro for a day! A kid-friendly career game from Tech Journey with The Warthens.",
  robots: { index: false, follow: false },
};

export default function CareerDayPage() {
  return <CareerDayKiosk />;
}
