"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import BadgeScreen from "./BadgeScreen";
import { usePlay } from "./PlayShell";

export default function BadgeRoute() {
  const router = useRouter();
  const { stars, skills, resetAll, mapPath } = usePlay();
  // "Next player" clears the stars and heads to the age picker. Without this, the redirect below
  // would see zero stars and send the next player to the old group's map instead.
  const startingOver = useRef(false);

  // Nothing to show until a child has earned a star, so send a direct visit back to the map.
  useEffect(() => {
    if (stars === 0 && !startingOver.current) router.replace(mapPath);
  }, [stars, router, mapPath]);

  if (stars === 0) return null;
  return (
    <BadgeScreen
      stars={stars}
      skills={skills}
      onMore={() => router.push(mapPath)}
      onNext={() => {
        startingOver.current = true;
        resetAll();
      }}
    />
  );
}
