import { notFound } from "next/navigation";
import WorldMap from "@/components/career-day/WorldMap";
import { bandById, bands } from "@/lib/play-worlds";

export const dynamicParams = false;

export function generateStaticParams() {
  return bands.map((b) => ({ band: b.id }));
}

export default async function BandPage({ params }: PageProps<"/techjr/play/[band]">) {
  const { band } = await params;
  const found = bandById(band);
  if (!found) notFound();
  return <WorldMap band={found} />;
}
