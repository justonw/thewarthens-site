import { notFound } from "next/navigation";
import WorldScreen from "@/components/career-day/WorldScreen";
import { bandById, bands, worldsFor } from "@/lib/play-worlds";

export const dynamicParams = false;

export function generateStaticParams() {
  return bands.flatMap((b) => worldsFor(b.id).map((w) => ({ band: b.id, world: w.id })));
}

export default async function WorldPage({ params }: PageProps<"/techjr/play/[band]/[world]">) {
  const { band, world } = await params;
  const found = bandById(band);
  if (!found) notFound();
  return <WorldScreen band={found} worldId={world} />;
}
