"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BadgeScreen from "./BadgeScreen";
import { PLAY_PATH, usePlay } from "./PlayShell";

export default function BadgeRoute() {
  const router = useRouter();
  const { stars, skills, resetAll } = usePlay();

  // Nothing to show until a child has earned a star, so send a direct visit back to the map.
  useEffect(() => {
    if (stars === 0) router.replace(PLAY_PATH);
  }, [stars, router]);

  if (stars === 0) return null;
  return <BadgeScreen stars={stars} skills={skills} onMore={() => router.push(PLAY_PATH)} onNext={resetAll} />;
}
