"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { worldById } from "@/lib/play-worlds";
import FactsScreen from "./FactsScreen";
import GiftMission from "./GiftMission";
import HelperMission from "./HelperMission";
import CreatorMission from "./CreatorMission";
import { PLAY_PATH, usePlay } from "./PlayShell";
import { Panel } from "./ui";

// Plays one world. To add a world with its own screen, add a case here and an entry in
// src/lib/play-worlds.ts.
export default function WorldScreen({ worldId }: { worldId: string }) {
  const router = useRouter();
  const { runKey, finishWorld } = usePlay();
  const world = worldById(worldId);

  if (!world || world.status === "soon" || !world.kind) {
    return (
      <Panel className="mx-auto max-w-xl text-center">
        <div aria-hidden className="text-7xl">
          {world?.emoji ?? "🚧"}
        </div>
        <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Coming soon!</h2>
        <p className="mt-2 text-xl text-slate-700">We are building this world now. Try another one.</p>
        <Link
          href={PLAY_PATH}
          className="mt-6 inline-flex min-h-16 items-center rounded-3xl bg-blue-600 px-8 py-4 text-xl font-extrabold text-white shadow-lg transition hover:bg-blue-700 active:scale-95"
        >
          🗺️ Back to the map
        </Link>
      </Panel>
    );
  }

  switch (world.kind) {
    case "helper":
      return <HelperMission key={`helper-${runKey}`} onFinish={(s) => finishWorld(world.id, s)} />;
    case "creator":
      return <CreatorMission key={`creator-${runKey}`} onFinish={() => finishWorld(world.id)} />;
    case "gift":
      return <GiftMission key={`gift-${runKey}`} onFinish={() => finishWorld(world.id)} />;
    case "facts":
      return <FactsScreen onHome={() => router.push(PLAY_PATH)} />;
  }
}
