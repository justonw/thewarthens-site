// Which words each age group sees inside a world. Ages 8 to 10 use the original content in
// career-day.ts and cyber-defenders.ts. Ages 5 to 7 use play-little.ts.

import {
  allSpokenLines,
  creatorCard,
  creatorCardCloser,
  creatorIntro,
  creatorSafety,
  factGroups,
  factsIntro,
  giftIntro,
  giftQuestions,
  giftResultSpoken,
  giftResults,
  giftWrapUp,
  helperIntro,
  helperRounds,
  posterSpoken,
  techSalesCard,
  type CareerCardData,
  type CoolFact,
  type FactGroup,
  type GiftId,
  type GiftQuestion,
  type GiftResult,
  type HelperRound,
  type Superpower,
} from "./career-day";
import { cyberBig, cyberSpokenLines, type CyberContent } from "./cyber-defenders";
import {
  littleCreator,
  littleCyber,
  littleEpisodeIdeas,
  littleFactGroups,
  littleFactsIntro,
  littleGift,
  littleGiftResults,
  littleGiftResultSpoken,
  littleGiftWrapUp,
  littleHelper,
  littleSpokenLines,
} from "./play-little";
import {
  bigExtraFacts,
  bigFactChecks,
  bigNewGroups,
  factCheckAnswerSpoken,
  factCheckSpoken,
  littleExtraFacts,
  littleFactChecks,
  littleNewGroups,
  type FactCheck,
} from "./play-facts";
import type { BandId } from "./play-worlds";

export type HelperContent = {
  intro: string;
  rounds: HelperRound[];
  card: CareerCardData;
  /** Read the "try again" and "yes!" messages aloud too, for children who are still learning to read. */
  readFeedback: boolean;
};

export type GiftContent = {
  intro: string;
  questions: GiftQuestion[];
  results: Record<GiftId, GiftResult>;
  resultSpoken: (result: GiftResult) => string;
  wrapUp: string;
};

export type CreatorContent = {
  intro: string;
  safety: string;
  /** The line under the pitch on the poster screen. */
  practice: string;
  card: CareerCardData;
  cardCloser: string;
  episodeIdeas: (power: Superpower) => string[];
  posterSpoken: (power: Superpower) => string;
};

export type FactsContent = {
  intro: string;
  groups: FactGroup[];
  /** The True or Made-Up? game. */
  checks: FactCheck[];
  checksIntro: string;
};

export const helperContent: Record<BandId, HelperContent> = {
  "ages-5-7": { ...littleHelper, readFeedback: true },
  "ages-8-10": { intro: helperIntro, rounds: helperRounds, card: techSalesCard, readFeedback: false },
};

export const giftContent: Record<BandId, GiftContent> = {
  "ages-5-7": {
    ...littleGift,
    results: littleGiftResults,
    resultSpoken: littleGiftResultSpoken,
    wrapUp: littleGiftWrapUp,
  },
  "ages-8-10": {
    intro: giftIntro,
    questions: giftQuestions,
    results: giftResults,
    resultSpoken: giftResultSpoken,
    wrapUp: giftWrapUp,
  },
};

export const creatorContent: Record<BandId, CreatorContent> = {
  "ages-5-7": {
    intro: littleCreator.intro,
    safety: littleCreator.safety,
    practice: littleCreator.practice,
    card: littleCreator.card,
    cardCloser: littleCreator.cardCloser,
    episodeIdeas: littleEpisodeIdeas,
    posterSpoken: littleCreator.posterSpoken,
  },
  "ages-8-10": {
    intro: creatorIntro,
    safety: creatorSafety,
    practice: "Real creators practice, show up often, and stay kind and honest.",
    card: creatorCard,
    cardCloser: creatorCardCloser,
    episodeIdeas: (power) => power.episodeIdeas,
    posterSpoken,
  },
};

// The original groups, any extra facts folded into them, and the new groups, in the order shown.
const arrangeGroups = (
  original: FactGroup[],
  extras: Record<string, CoolFact[]>,
  added: FactGroup[],
  order: string[]
): FactGroup[] => {
  const all = [...original, ...added].map((g) => ({ ...g, facts: [...g.facts, ...(extras[g.id] ?? [])] }));
  return order.map((id) => all.find((g) => g.id === id)).filter((g): g is FactGroup => !!g);
};

const checksIntro = "Is it true, or did we make it up? You decide!";

export const factsContent: Record<BandId, FactsContent> = {
  "ages-5-7": {
    intro: littleFactsIntro,
    groups: arrangeGroups(littleFactGroups, littleExtraFacts, littleNewGroups, [
      "helpers",
      "creators",
      "games",
      "internet",
      "robots",
      "computers",
      "heroes",
      "world",
      "lift",
      "kids",
    ]),
    checks: littleFactChecks,
    checksIntro,
  },
  "ages-8-10": {
    intro: factsIntro,
    groups: arrangeGroups(factGroups, bigExtraFacts, bigNewGroups, [
      "helpers",
      "creators",
      "games",
      "internet",
      "robots",
      "space",
      "computers",
      "safe",
      "heroes",
      "world",
      "lift",
      "kids",
    ]),
    checks: bigFactChecks,
    checksIntro,
  },
};

// Everything the facts world can say, including the new facts and the True or Made-Up? game.
const factsSpokenLines = (Object.values(factsContent) as FactsContent[]).flatMap((c) => [
  c.checksIntro,
  ...c.groups.flatMap((g) => g.facts.map((f) => `${f.hook} ${f.answer}`)),
  ...c.checks.flatMap((k) => [factCheckSpoken(k), factCheckAnswerSpoken(k)]),
]);

export const cyberContent: Record<BandId, CyberContent> = {
  "ages-5-7": littleCyber,
  "ages-8-10": cyberBig,
};

/** Every line the voice can say anywhere in the game, for recording clips. */
export const everySpokenLine: string[] = Array.from(
  new Set([...allSpokenLines, ...cyberSpokenLines, ...littleSpokenLines, ...factsSpokenLines])
);
