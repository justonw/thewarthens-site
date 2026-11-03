import BadgeRoute from "@/components/career-day/BadgeRoute";
import { bands } from "@/lib/play-worlds";

export const dynamicParams = false;

export function generateStaticParams() {
  return bands.map((b) => ({ band: b.id }));
}

export default function BadgePage() {
  return <BadgeRoute />;
}
