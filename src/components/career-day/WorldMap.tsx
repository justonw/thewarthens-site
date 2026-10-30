"use client";

import Link from "next/link";
import { useContext } from "react";
import { homeIntro } from "@/lib/career-day";
import { conversationStarters } from "@/lib/tech-jr";
import {
  levelFor,
  starWorlds,
  worldThemes,
  worlds,
  type World,
} from "@/lib/play-worlds";
import { PLAY_PATH, usePlay } from "./PlayShell";
import { AutoReadContext, ReadAloud } from "./ui";

const heroes = ["👩🏽‍💻", "🧑🏻‍💻", "👨🏿‍💻", "👩🏼‍💻"];

function WorldCard({ world, done }: { world: World; done: boolean }) {
  const theme = worldThemes[world.theme];
  const soon = world.status === "soon";
  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-4 ring-white/70 transition ${theme.glow} ${
        soon ? "" : "hover:-translate-y-1"
      }`}
    >
      <div
        className={`relative bg-gradient-to-br px-6 pb-7 pt-6 text-center ${theme.band} ${soon ? "saturate-[0.55]" : ""}`}
      >
        {done && (
          <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-sm font-extrabold text-emerald-700 shadow">
            ✅ Done
          </span>
        )}
        {soon && (
          <span className="absolute right-4 top-4 rounded-full bg-slate-900/70 px-3 py-1 text-sm font-extrabold text-white">
            🔒 Coming soon
          </span>
        )}
        <span
          aria-hidden
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/25 text-6xl ring-4 ring-white/40 backdrop-blur-sm"
        >
          {world.emoji}
        </span>
        <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
          {world.title}
        </h3>
      </div>
      <div className="flex flex-1 flex-col items-center gap-3 p-5 text-center">
        <span className={`rounded-full px-3 py-1 text-sm font-extrabold ${theme.chip}`}>{world.tag}</span>
        <p className="text-lg font-semibold leading-snug text-slate-700">{world.about}</p>
        {soon ? (
          <p className="mt-auto rounded-2xl bg-slate-100 px-4 py-3 text-base font-bold text-slate-500">
            We are building this world now.
          </p>
        ) : (
          <>
            <ReadAloud text={world.about} auto={false} />
            <Link
              href={`${PLAY_PATH}/${world.id}`}
              className={`mt-auto flex min-h-16 w-full items-center justify-center rounded-2xl border-b-[6px] px-6 py-3 text-2xl font-extrabold shadow-lg transition active:translate-y-1 active:border-b-2 ${theme.button}`}
            >
              {done ? "Play again" : "Play"}
            </Link>
          </>
        )}
      </div>
    </article>
  );
}

export default function WorldMap() {
  const { done, stars } = usePlay();
  const autoRead = useContext(AutoReadContext);
  const level = levelFor(stars);
  const total = starWorlds.length;
  const starter = conversationStarters[stars % conversationStarters.length];

  return (
    <div>
      <section className="text-center">
        <div aria-hidden className="flex justify-center gap-1 text-5xl sm:gap-3 sm:text-7xl">
          {heroes.map((h, i) => (
            <span key={h} className="cd-float" style={{ animationDelay: `${i * 0.35}s` }}>
              {h}
            </span>
          ))}
        </div>
        <h1 className="mt-4 bg-gradient-to-r from-amber-200 via-pink-200 to-sky-200 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow-[0_4px_20px_rgba(255,255,255,0.25)] sm:text-7xl">
          Tech Journey Jr.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-2xl font-bold text-indigo-50 sm:text-3xl">{homeIntro}</p>
        <div className="mt-5 flex justify-center">
          <ReadAloud text={homeIntro} auto={false} />
        </div>
        <p className="mt-3 text-base font-semibold text-indigo-200">
          {autoRead
            ? "The voice is on. Every screen will read itself. Tap 🔊 at the top to turn it off."
            : "The voice is off. Tap 🔇 at the top to turn it on."}
        </p>

        <div className="mx-auto mt-7 max-w-md rounded-3xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur">
          <div className="flex items-center justify-between gap-3 text-white">
            <span className="text-xl font-extrabold">
              <span aria-hidden>{level.emoji}</span> Level: {level.name}
            </span>
            <span className="text-lg font-bold text-amber-200">
              {stars} of {total} ⭐
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={stars}
            aria-label="Stars earned"
            className="mt-3 h-4 overflow-hidden rounded-full bg-indigo-950/60"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-300 to-pink-400 transition-all duration-700"
              style={{ width: `${(stars / total) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-semibold text-indigo-200">
            Finish the three star worlds to become a Tech Pro.
          </p>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="worlds-heading">
        <h2 id="worlds-heading" className="text-center text-3xl font-extrabold text-white sm:text-4xl">
          Pick your world
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {worlds.map((w) => (
            <WorldCard key={w.id} world={w} done={!!done[w.id]} />
          ))}
        </div>
      </section>

      {stars > 0 && (
        <div className="mt-10 text-center">
          <Link
            href={`${PLAY_PATH}/badge`}
            className="inline-flex min-h-16 items-center rounded-2xl border-b-[6px] border-amber-700 bg-amber-400 px-8 py-3 text-2xl font-extrabold text-slate-900 shadow-lg transition hover:bg-amber-300 active:translate-y-1 active:border-b-2"
          >
            🏅 See my badge
          </Link>
        </div>
      )}

      <section className="mx-auto mt-14 max-w-3xl rounded-[2rem] bg-white/10 p-6 text-left ring-1 ring-white/20 backdrop-blur sm:p-8">
        <h2 className="text-2xl font-extrabold text-white">
          <span aria-hidden>👨‍👩‍👧 </span>Grown-ups, play along
        </h2>
        <p className="mt-2 text-lg font-semibold text-indigo-100">Ask your child:</p>
        <p className="mt-1 rounded-2xl bg-white/90 p-4 text-xl font-bold text-slate-800">&ldquo;{starter}&rdquo;</p>
        <p className="mt-4 text-base text-indigo-100">
          Every world teaches a real skill, like listening, honesty, and asking good questions. No sign-in, no
          ads, and nothing a child picks or types is saved or sent.{" "}
          <Link href="/techjr#parents" className="font-bold text-amber-200 underline underline-offset-4">
            How this helps kids learn
          </Link>
        </p>
      </section>

      <p className="mx-auto mt-10 max-w-md text-center text-sm text-indigo-200">
        Made with 💙 by Tech Journey with The Warthens.
      </p>
    </div>
  );
}
