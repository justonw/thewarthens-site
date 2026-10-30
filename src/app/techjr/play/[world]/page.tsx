import WorldScreen from "@/components/career-day/WorldScreen";
import { worlds } from "@/lib/play-worlds";

export const dynamicParams = false;

export function generateStaticParams() {
  return worlds.map((w) => ({ world: w.id }));
}

export default async function WorldPage({ params }: PageProps<"/techjr/play/[world]">) {
  const { world } = await params;
  return <WorldScreen worldId={world} />;
}
