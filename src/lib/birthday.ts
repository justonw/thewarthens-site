// Atiya's birthday lunch invitation page (/birthday). A private link: it is not in the sitemap, not linked from the site,
// and tells search engines not to list it, but anyone who has the link can open it and RSVP.
// Everything here is plain data and pure functions so it can be tested without a server.

export const EVENT = {
  title: "Atiya's Birthday Lunch",
  dateLabel: "Sunday, December 6",
  dateShort: "Sun, Dec 6",
  arriveLabel: "12:28 to 12:43 PM",
  venue: "Chattahoochee Food Works",
  addressLine: "1235 Chattahoochee Ave NW, Ste 130",
  cityLine: "Atlanta, GA 30318",
  // 12:28 PM Eastern on Dec 6, 2026 (Eastern Standard Time, UTC-5).
  startUtc: "2026-12-06T17:28:00Z",
  // Arrival window ends 12:43 PM Eastern.
  arriveEndUtc: "2026-12-06T17:43:00Z",
  // The RSVP closes at the end of Nov 28, Eastern time.
  cutoffUtc: "2026-11-29T05:00:00Z",
  cutoffLabel: "Saturday, November 28",
} as const;

// When the automatic emails go out (all Eastern Standard Time, so UTC-5).
export const SCHEDULE = {
  // The last chance to change an answer: a friendly nudge the morning before the cutoff.
  nudgeUtc: "2026-11-27T15:00:00Z", // Fri Nov 27, 10:00 AM
  fiveDaysUtc: "2026-12-01T15:00:00Z", // Tue Dec 1, 10:00 AM (five days before)
  eveningBeforeUtc: "2026-12-06T00:00:00Z", // Sat Dec 5, 7:00 PM
} as const;

export type RsvpStatus = "yes" | "maybe" | "no";

export type Rsvp = {
  email: string;
  status: RsvpStatus;
  /** Everyone coming, the person who answered first. */
  names: string[];
  createdAt: string;
  updatedAt: string;
  /** Resend ids of reminder emails waiting to be sent, kept so an update can cancel them. */
  scheduled: string[];
};

// The page shows nothing about other guests: only whether the RSVP is still open.
export type PublicView = { closed: boolean };

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
const MAX_NAMES = 10;
const MAX_NAME_LEN = 60;

export const firstName = (full: string) => full.trim().split(/\s+/)[0] ?? "";

// Names are shown on the page and put in emails, so they are kept to plain letters, spaces, and common name marks.
export function cleanName(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw
    .normalize("NFC")
    .replace(/[^\p{L}\p{M}\s'’.\-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_NAME_LEN);
}

export type Parsed = { ok: true; email: string; status: RsvpStatus; names: string[] } | { ok: false; error: string };

export function parseRsvp(body: unknown): Parsed {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 200) return { ok: false, error: "Please enter a valid email address, so we can send your confirmation." };
  const status = b.status === "yes" || b.status === "maybe" || b.status === "no" ? b.status : null;
  if (!status) return { ok: false, error: "Please choose Yes, Maybe, or No." };
  const raw = Array.isArray(b.names) ? b.names : [];
  const names = raw.map(cleanName).filter(Boolean).slice(0, MAX_NAMES);
  if (names.length === 0) return { ok: false, error: "Please type your name." };
  const unique = names.filter((n, i) => names.findIndex((m) => m.toLowerCase() === n.toLowerCase()) === i);
  return { ok: true, email, status, names: status === "no" ? unique.slice(0, 1) : unique };
}

export function isClosed(now = new Date()): boolean {
  return now.getTime() >= new Date(EVENT.cutoffUtc).getTime();
}

export function publicView(_all: Rsvp[], now = new Date()): PublicView {
  return { closed: isClosed(now) };
}

// Running totals, for the note that goes to Juston. Never sent to the page.
export function totals(all: Rsvp[]): { yes: number; maybe: number; no: number } {
  let yes = 0;
  let maybe = 0;
  let no = 0;
  for (const r of all) {
    if (r.status === "yes") yes += r.names.length;
    else if (r.status === "maybe") maybe += r.names.length;
    else no += 1;
  }
  return { yes, maybe, no };
}

// A reminder only goes out if its time is still ahead (with a minute to spare).
export const stillAhead = (iso: string, now = new Date()) => new Date(iso).getTime() - now.getTime() > 60_000;

export type Reminder = { key: "nudge" | "fiveDays" | "eveningBefore"; at: string };

export function remindersFor(status: RsvpStatus, now = new Date()): Reminder[] {
  const all: Reminder[] =
    status === "yes"
      ? [
          { key: "fiveDays", at: SCHEDULE.fiveDaysUtc },
          { key: "eveningBefore", at: SCHEDULE.eveningBeforeUtc },
        ]
      : [{ key: "nudge", at: SCHEDULE.nudgeUtc }];
  return all.filter((r) => stillAhead(r.at, now));
}

// ---------- What is where: the facts on the page ----------

export const PARKING = {
  free: "Your first two hours are free in the Orange Deck, the Westbound Deck, or Up Front parking. In the Orange Deck your session starts on its own when you drive in. In the Westbound Deck and Up Front, scan the QR code when you arrive.",
  paid: "The Yellow Deck is additional parking: it starts on its own when you drive in and you pay when you leave. After the free two hours, The Works does not post its rate online. A few visitors report about $10 for the next two hours, so please treat that as a rough guess.",
  tip: "Plan on about a two-hour lunch. If we stay longer, a small parking charge is possible, so keep an eye on the clock.",
  pay: "You can pay with the AAA Parking app, by scanning the QR code in your zone, or with a card at the gate. Intercoms at the exit gates can help if something goes wrong.",
  rideshare: "Uber and Lyft have a drop-off right by the food hall, at Camp Street and Makers Way.",
  mapUrl: "https://theworksatl.com/parking/",
  sourceLabel: "The Works, Parking and Getting Here pages (checked Nov 24, 2026)",
  sourceUrl: "https://theworksatl.com/getting-here/",
  mapsQuery: "Chattahoochee Food Works, 1235 Chattahoochee Ave NW, Atlanta, GA 30318",
  hours: "Open 11 AM to 9 PM on Sundays.",
} as const;

export type Pick = { dish: string; mentions?: number; note?: string };
export type Stall = {
  name: string;
  tagline: string;
  rating: string;
  reviews: number;
  star?: boolean;
  listing?: string;
  logo: { src: string; w: number; h: number; alt: string };
  picks: Pick[];
  heads?: string;
};

// Logos are the stalls' own, from the Chattahoochee Food Works vendor pages (chattahoocheefoodworks.com), used to identify each stall.
// From each stall's own Google Maps listing inside Chattahoochee Food Works, viewed Nov 24, 2026 (each listing says "Located in: Chattahoochee Food Works" or "The Works"). "Mentions" is the number of reviews Google groups under that dish name.
export const STALLS: Stall[] = [
  {
    name: "504 Seafood",
    logo: { src: "/birthday/brands/504-seafood.webp", w: 639, h: 640, alt: "504 Seafood logo" },
    tagline: "New Orleans style Cajun seafood: garlic noodles, boils, po'boys, and baskets.",
    rating: "4.5",
    reviews: 28,
    star: true,
    listing: "Google listing \"504 Seafood 2 (CFW)\" at 1235 Chattahoochee Ave NW Ste 130, inside The Works. Only the reviews for this food hall stall are used here.",
    picks: [
      { dish: "Garlic noodles with shrimp", mentions: 5, note: "\"Omg the garlic noodles & shrimp are AMAZING.\"" },
      { dish: "Shrimp", mentions: 5, note: "\"The shrimp was so big and juicy, the sauce was just perfect.\"" },
      { dish: "Oysters", mentions: 3 },
      { dish: "Oyster po'boy", mentions: 2 },
      { dish: "Basket", mentions: 2 },
      { dish: "Lobster roll and Cajun fried rice", note: "A recent reviewer called the lobster roll \"the best I had\" and went back for more fried rice." },
    ],
    heads: "One reviewer found the corn soggy and another thought the staff seemed unorganized on a busy day, so the garlic noodles with shrimp and the shrimp are the safest bets.",
  },
  {
    name: "Tyde Tate Kitchen",
    logo: { src: "/birthday/brands/tyde-tate-kitchen.webp", w: 640, h: 308, alt: "Tyde Tate Kitchen logo" },
    tagline: "Thai favorites.",
    rating: "4.4",
    reviews: 159,
    picks: [
      { dish: "Basil chicken", mentions: 17 },
      { dish: "Curry puffs", mentions: 10 },
      { dish: "Panang curry beef", mentions: 7 },
      { dish: "Thai tea", note: "A favorite drink that comes up in reviews." },
    ],
  },
  {
    name: "Philly G Steaks",
    logo: { src: "/birthday/brands/philly-g-steaks.webp", w: 640, h: 215, alt: "Philly G Steaks logo" },
    tagline: "Cheesesteaks and more.",
    rating: "4.3",
    reviews: 159,
    picks: [
      { dish: "Cheesesteak", mentions: 59 },
      { dish: "Chicken Philly", mentions: 7 },
      { dish: "Ribeye Philly", mentions: 4 },
    ],
  },
  {
    name: "Belen de la Cruz",
    logo: { src: "/birthday/brands/belen-de-la-cruz.webp", w: 606, h: 640, alt: "Belen de la Cruz logo" },
    tagline: "Argentinian empanadas and pastries.",
    rating: "4.6",
    reviews: 94,
    picks: [
      { dish: "Empanadas", mentions: 38 },
      { dish: "Beef empanadas", mentions: 8 },
      { dish: "Cheesy chicken empanada", mentions: 7 },
    ],
  },
  {
    name: "Munster Cravings",
    logo: { src: "/birthday/brands/munster-cravings.webp", w: 640, h: 295, alt: "Munster Cravings logo" },
    tagline: "The dessert stop: fresh cookies, with vegan flavors too.",
    rating: "4.5",
    reviews: 191,
    picks: [
      { dish: "Cookies", mentions: 85 },
      { dish: "Chocolate chip cookie", mentions: 49 },
      { dish: "Vegan flavors", mentions: 20 },
      { dish: "S'mores cookie", mentions: 14 },
    ],
  },
];

export const HALL_RATING = { rating: "4.7", reviews: "2,461" };

export const PHOTOS = [
  { src: "/birthday/atiya-profile.jpg", alt: "Atiya smiling in a black blazer", w: 1100, h: 1375 },
] as const;

// The swipe gallery: every photo that was sent, shown whole (not cropped), metadata removed.
export const GALLERY = [
  { src: "/birthday/g-23.jpg", alt: "Atiya smiling in a black blazer", w: 1400, h: 1138 },
  { src: "/birthday/g-21.jpg", alt: "Atiya in a green sweater with a sparkling white collar", w: 1050, h: 1400 },
  { src: "/birthday/g-22.jpg", alt: "Atiya smiling in hoop earrings", w: 1050, h: 1400 },
  { src: "/birthday/g-30.jpg", alt: "Atiya smiling in a white faux fur jacket in a red car", w: 1400, h: 1050 },
  { src: "/birthday/g-35.jpg", alt: "Atiya laughing next to Juston outdoors", w: 1400, h: 1050 },
  { src: "/birthday/g-36.jpg", alt: "Atiya in a tan hat at an evening event", w: 1400, h: 1050 },
  { src: "/birthday/g-24.jpg", alt: "Atiya smiling with her dog", w: 1050, h: 1400 },
  { src: "/birthday/g-28.jpg", alt: "Atiya working at a laptop", w: 1400, h: 1050 },
  { src: "/birthday/g-29.jpg", alt: "Atiya smiling at an event", w: 1050, h: 1400 },
  { src: "/birthday/g-31.jpg", alt: "Atiya outdoors with a friend", w: 1400, h: 1050 },
  { src: "/birthday/g-33.jpg", alt: "Atiya at a gathering", w: 1050, h: 1400 },
  { src: "/birthday/g-27.jpg", alt: "Juston and Atiya with the kids in a selfie", w: 1400, h: 1050 },
  { src: "/birthday/g-34.jpg", alt: "Atiya holding her daughter outdoors", w: 1050, h: 1400 },
  { src: "/birthday/g-37.jpg", alt: "Atiya helping her son with homework", w: 1400, h: 1050 },
  { src: "/birthday/g-38.jpg", alt: "Atiya with her son in front of the house", w: 1050, h: 1400 },
  { src: "/birthday/g-39.jpg", alt: "Atiya and her son in the driveway", w: 968, h: 1400 },
  { src: "/birthday/g-40.jpg", alt: "Atiya with her daughter on her lap", w: 991, h: 1400 },
  { src: "/birthday/g-25.jpg", alt: "Atiya at the front door of the house", w: 1050, h: 1400 },
  { src: "/birthday/g-26.jpg", alt: "Atiya and Juston on a screen", w: 1050, h: 1400 },
] as const;
