"use client";

import Link from "next/link";
import { useContext } from "react";
import { conversationStarters } from "@/lib/tech-jr";
import {
  PLAY_PATH,
  aboutFor,
  badgePath,
  levelFor,
  levels,
  starWorldsFor,
  worldPath,
  worldThemes,
  worldsFor,
  type Band,
  type World,
} from "@/lib/play-worlds";
import { usePlay } from "./PlayShell";
import ArtIcon, { bandArt, levelArt, worldArt } from "./ArtIcon";
import { CardArt, Glint, HeroFloaters, WorldScene } from "./Scenery";
import { crewById } from "@/lib/career-avatar";
import Avatar from "./Avatar";
import { AutoReadContext, ReadAloud } from "./ui";

const heroes = ["maya", "kenji", "emma", "jamal", "joy", "jackson"];

const parentGuides = [
  { href: "/techjr/internet-safety-for-kids", label: "Internet safety for kids" },
  { href: "/techjr/how-to-choose-safe-educational-games", label: "Safe educational games checklist" },
  { href: "/techjr/things-to-do-when-kids-are-bored", label: "When your kid is bored" },
  { href: "/techjr/cool-tech-facts-for-kids", label: "Cool tech facts for kids" },
];

function WorldCard({ world, band, done }: { world: World; band: Band; done: boolean }) {
  const about = aboutFor(world, band.id);
  const theme = worldThemes[world.theme];
  const soon = world.status === "soon";
  return (
    <article
      className={`cd-card relative flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-4 ring-white/70 transition ${theme.glow} ${
        soon ? "" : "hover:-translate-y-1"
      }`}
    >
      <div className={`relative overflow-hidden bg-gradient-to-br px-6 pb-11 pt-14 text-center ${theme.band} ${soon ? "saturate-[0.55]" : ""}`}>
        <WorldScene id={world.id} />
        <CardArt />
        {!soon && <Glint />}
        {!soon && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/25 py-1 pl-1.5 pr-3 text-sm font-extrabold text-white backdrop-blur-sm">
            <ArtIcon name={world.star ? "star" : "facts"} className="h-6 w-6" />
            {world.star ? "Earn a star" : "Bonus world"}
          </span>
        )}
        {done && (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white py-1 pl-1.5 pr-3 text-sm font-extrabold text-emerald-700 shadow">
            <ArtIcon name="check" className="h-6 w-6" />
            Done
          </span>
        )}
        {soon && (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-slate-900/70 py-1 pl-1.5 pr-3 text-sm font-extrabold text-white">
            <ArtIcon name="lock" className="h-6 w-6" />
            Coming soon
          </span>
        )}
        <span
          aria-hidden
          className="cd-icon relative mx-auto flex h-28 w-28 -rotate-3 items-center justify-center rounded-[2rem] bg-white shadow-[0_8px_0_rgba(0,0,0,0.18),0_18px_30px_rgba(0,0,0,0.2)] ring-4 ring-white/60"
        >
          <ArtIcon name={worldArt[world.id] ?? "star"} className={`h-20 w-20 ${soon ? "opacity-60 grayscale" : ""}`} />
        </span>
        <h3 className="relative mt-4 text-3xl font-extrabold tracking-tight text-white drop-shadow-md">{world.title}</h3>
      </div>
      <div className="flex flex-1 flex-col items-center gap-3 p-5 text-center">
        <span className={`rounded-full px-3 py-1 text-sm font-extrabold ${theme.chip}`}>{world.tag}</span>
        <p className="text-lg font-semibold leading-snug text-slate-700">{about}</p>
        {soon ? (
          <p className="mt-auto rounded-2xl bg-slate-100 px-4 py-3 text-base font-bold text-slate-500">
            We are building this world now.
          </p>
        ) : (
          <>
            <ReadAloud text={about} auto={false} />
            <Link
              href={worldPath(band.id, world.id)}
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

export default function WorldMap({ band }: { band: Band }) {
  const { done, stars } = usePlay();
  const autoRead = useContext(AutoReadContext);
  const level = levelFor(stars);
  const total = starWorldsFor(band.id).length;
  const bandWorlds = worldsFor(band.id);
  const starter = conversationStarters[stars % conversationStarters.length];

  return (
    <div>
      <section className="relative text-center">
        <HeroFloaters icons={["techpro", "cyber", "creator", "gift"]} />
        <ul className="relative flex flex-wrap justify-center gap-1 sm:gap-3">
          {heroes.map((id, i) => {
            const member = crewById(id);
            if (!member) return null;
            return (
              <li key={id} className="cd-float" style={{ animationDelay: `${i * 0.35}s` }}>
                <Avatar look={member.look} size={76} label={member.name} className="drop-shadow-lg sm:h-24 sm:w-24" />
              </li>
            );
          })}
        </ul>
        <p className="relative mt-4 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full bg-white/10 px-5 py-2 text-lg font-extrabold text-amber-100 ring-1 ring-white/20">
          <span className="inline-flex items-center gap-2">
            <ArtIcon name={bandArt[band.id] ?? "star"} className="h-7 w-7" />
            {band.name}, ages {band.ages}
          </span>
          <Link
            href={PLAY_PATH}
            className="text-base font-bold text-sky-200 underline underline-offset-4 hover:text-white"
          >
            Switch group
          </Link>
        </p>
        <h1 className="relative mt-4 bg-gradient-to-r from-amber-200 via-pink-200 to-sky-200 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow-[0_4px_20px_rgba(255,255,255,0.25)] sm:text-7xl">
          Tech Journey Jr.
        </h1>
        <svg aria-hidden viewBox="0 0 300 20" className="mx-auto -mt-1 h-4 w-56 sm:w-80">
          <path d="M6 12 C60 2 110 18 160 9 S256 4 294 12" fill="none" stroke="#FDE047" strokeWidth="5" strokeLinecap="round" />
        </svg>
        <p className="relative mx-auto mt-4 max-w-2xl text-2xl font-bold text-indigo-50 sm:text-3xl">{band.intro}</p>
        <div className="mt-5 flex justify-center">
          <ReadAloud text={band.intro} auto={false} />
        </div>
        <p className="mt-3 text-base font-semibold text-indigo-200">
          {autoRead
            ? "The voice is on. Every screen will read itself. Tap 🔊 at the top to turn it off."
            : "The voice is off. Tap 🔇 at the top to turn it on."}
        </p>

        <div className="relative mx-auto mt-7 max-w-md rounded-3xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur">
          <div className="flex items-center justify-between gap-3 text-white">
            <span className="inline-flex items-center gap-2 text-xl font-extrabold">
              <ArtIcon name={levelArt[level.name] ?? "rookie"} className="h-9 w-9" />
              Level: {level.name}
            </span>
            <span className="inline-flex items-center gap-1.5 text-lg font-bold text-amber-200">
              {stars} of {total}
              <ArtIcon name="star" className="h-6 w-6" />
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
          <ol aria-hidden className="mt-4 flex items-end justify-between px-1">
            {levels.map((l, i) => (
              <li key={l.name} className={`flex flex-col items-center gap-1 ${i <= stars ? "" : "opacity-40 grayscale"}`}>
                <ArtIcon name={levelArt[l.name]} className={i === Math.min(stars, levels.length - 1) ? "h-11 w-11" : "h-8 w-8"} />
                <span className="text-xs font-extrabold text-indigo-100">{l.name}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm font-semibold text-indigo-200">
            Finish the three star worlds to become a Tech Pro.
          </p>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="worlds-heading">
        <h2 id="worlds-heading" className="text-center text-3xl font-extrabold text-white sm:text-4xl">
          Pick your world
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bandWorlds.map((w) => (
            <WorldCard key={w.id} world={w} band={band} done={!!done[w.id]} />
          ))}
        </div>
      </section>

      {stars > 0 && (
        <div className="mt-10 text-center">
          <Link
            href={badgePath(band.id)}
            className="inline-flex min-h-16 items-center rounded-2xl border-b-[6px] border-amber-700 bg-amber-400 px-8 py-3 text-2xl font-extrabold text-slate-900 shadow-lg transition hover:bg-amber-300 active:translate-y-1 active:border-b-2"
          >
            <ArtIcon name="medal" className="mr-2 h-9 w-9" />
            See my badge
          </Link>
        </div>
      )}

      <section className="mx-auto mt-14 max-w-3xl rounded-[2rem] bg-white/10 p-6 text-left ring-1 ring-white/20 backdrop-blur sm:p-8">
        <h2 className="text-2xl font-extrabold text-white">
          <span aria-hidden>🧑🏾🧒🏽 </span>Grown-ups, play along
        </h2>
        <p className="mt-2 text-lg font-semibold text-indigo-100">Ask your child:</p>
        <p className="mt-1 rounded-2xl bg-white/90 p-4 text-xl font-bold text-slate-800">&ldquo;{starter}&rdquo;</p>
        <p className="mt-4 text-base text-indigo-100">
          Every world teaches a real skill, like listening, honesty, and asking good questions. No sign-in and no
          ads.{" "}
          <Link href="/techjr#parents" className="font-bold text-amber-200 underline underline-offset-4">
            How this helps kids learn
          </Link>
        </p>
        <p className="mt-3 text-base text-indigo-100">
          Add this page to your phone&apos;s home screen (Safari: Share, then Add to Home Screen. Chrome: menu,
          then Add to Home screen) and your child can open the game in one tap.
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {parentGuides.map((g) => (
            <li key={g.href}>
              <Link href={g.href} className="text-sky-200 underline underline-offset-4 hover:text-white">
                {g.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mx-auto mt-10 max-w-md text-center text-sm text-indigo-200">
        Made with 💙 by Tech Journey with The Warthens.
      </p>
    </div>
  );
}
