import type { Metadata } from "next";
import CareerDayKiosk from "@/components/career-day/CareerDayKiosk";

// The game itself, shown with no site header or footer so it works as a kiosk at a career
// fair table. The page people find on search is /techjr; this one stays out of the index.
export const metadata: Metadata = {
  title: "Play Tech Journey Jr.",
  description: "Be a tech pro for a day! A kid-friendly career game from Tech Journey with The Warthens.",
  robots: { index: false, follow: false },
};

export default function TechJrPlayPage() {
  return <CareerDayKiosk />;
}
