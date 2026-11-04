"use client";

import Link from "next/link";
import { pickerPrompt } from "@/lib/play-little";
import { bandPath, bands, worldsFor, worldThemes, type Band } from "@/lib/play-worlds";
import { crewById } from "@/lib/career-avatar";
import Avatar from "./Avatar";
import { CardArt } from "./Scenery";
import { ReadAloud } from "./ui";

const heroes = ["maya", "kenji", "emma", "jamal", "joy", "jackson"];

const parentGuides = [
  { href: "/techjr/internet-safety-for-kids", label: "Internet safety for kids" },
  { href: "/techjr/how-to-choose-safe-educational-games", label: "Safe educational games checklist" },
  { href: "/techjr/things-to-do-when-kids-are-bored", label: "When your kid is bored" },
  { href: "/techjr/cool-tech-facts-for-kids", label: "Cool tech facts for kids" },
];

function BandCard({ band }: { band: Band }) {
  const theme = worldThemes[band.theme];
  const names = worldsFor(band.id)
    .filter((w) => w.status === "live")
    .map((w) => w.title);
  return (
    <Link
      href={bandPath(band.id)}
      className={`group flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-4 ring-white/70 transition hover:-translate-y-1 active:scale-[0.98] ${theme.glow}`}
    >
      <span className={`relative block bg-gradient-to-br px-6 pb-10 pt-7 text-center [&>*:not(svg)]:relative ${theme.band}`}>
        <CardArt />
        <span
          aria-hidden
          className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white/25 text-7xl ring-4 ring-white/40 backdrop-blur-sm"
        >
          {band.emoji}
        </span>
        <span className="mt-3 block text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
          {band.name}
        </span>
        <span className="mt-1 block text-3xl font-extrabold text-white/95 drop-shadow">Ages {band.ages}</span>
      </span>
      <span className="flex flex-1 flex-col items-center gap-3 p-5 text-center">
        <span className={`rounded-full px-3 py-1 text-sm font-extrabold ${theme.chip}`}>{band.grades}</span>
        <span className="text-lg font-semibold leading-snug text-slate-700">{band.blurb}</span>
        <span className="text-base font-semibold text-slate-500">{names.join(" · ")}</span>
        <span
          className={`mt-auto flex min-h-16 w-full items-center justify-center rounded-2xl border-b-[6px] px-6 py-3 text-2xl font-extrabold shadow-lg transition group-active:translate-y-1 group-active:border-b-2 ${theme.button}`}
        >
          Play
        </span>
      </span>
    </Link>
  );
}

// The first screen. A child picks an age group, and everything after it (words, questions, how
// much there is to read) is made for that group. Nothing is saved about the choice.
export default function AgePicker() {
  return (
    <div>
      <section className="text-center">
        <ul className="flex flex-wrap justify-center gap-1 sm:gap-3">
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
        <h1 className="mt-4 bg-gradient-to-r from-amber-200 via-pink-200 to-sky-200 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow-[0_4px_20px_rgba(255,255,255,0.25)] sm:text-7xl">
          Tech Journey Jr.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-3xl font-bold text-indigo-50 sm:text-4xl">How old are you?</p>
        <p className="mx-auto mt-2 max-w-2xl text-xl font-semibold text-indigo-200">Tap your group to play.</p>
        <div className="mt-5 flex justify-center">
          <ReadAloud text={pickerPrompt} auto={false} />
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2" aria-label="Age groups">
        {bands.map((b) => (
          <BandCard key={b.id} band={b} />
        ))}
      </section>

      <section className="mx-auto mt-12 max-w-3xl rounded-[2rem] bg-white/10 p-6 text-left ring-1 ring-white/20 backdrop-blur sm:p-8">
        <h2 className="text-2xl font-extrabold text-white">
          <span aria-hidden>🧑🏾🧒🏽 </span>Grown-ups, which group?
        </h2>
        <p className="mt-2 text-base text-indigo-100">
          Pick by how comfortable your child is with reading, not only by age. Tech Sprouts has short
          stories and a voice that reads every screen. Tech Trailblazers has trickier choices and more to
          think about. If it feels too easy or too hard, tap Start over at the top and try the other group.
        </p>
        <p className="mt-3 text-base text-indigo-100">
          Want it on your phone? Add this page to your home screen: in Safari tap Share, then Add to Home
          Screen. In Chrome tap the menu, then Add to Home screen. Your child can then open the game in one
          tap, with no store and no download.
        </p>
        <p className="mt-3 text-base text-indigo-100">
          No sign-in, no ads, and nothing a child picks or types is saved or sent.{" "}
          <Link href="/techjr#parents" className="font-bold text-amber-200 underline underline-offset-4">
            How this helps kids learn
          </Link>
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
