import Image from "next/image";
import PhotoSwipe from "@/components/birthday/PhotoSwipe";
import RsvpParty from "@/components/birthday/RsvpParty";
import { EVENT, HALL_RATING, PARKING, PHOTOS, STALLS, publicView, type Stall } from "@/lib/birthday";

const MAPS_Q = encodeURIComponent(PARKING.mapsQuery);
const MAP_EMBED = `https://www.google.com/maps?q=${MAPS_Q}&t=k&z=18&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_Q}`;
const APPLE_LINK = `https://maps.apple.com/?q=${MAPS_Q}`;
const serif = "font-[family-name:var(--font-bd-serif)]";

function Eyebrow({ children, tone = "purple" }: { children: React.ReactNode; tone?: "purple" | "red" }) {
  return <p className={`text-xs font-extrabold uppercase tracking-[0.22em] ${tone === "red" ? "text-[#e11d48]" : "text-[#7c3aed]"}`}>{children}</p>;
}

function StallCard({ stall }: { stall: Stall }) {
  const max = Math.max(1, ...stall.picks.map((p) => p.mentions ?? 0));
  const star = Boolean(stall.star);
  return (
    <article
      className={`rounded-[2rem] p-6 ${
        star ? "bg-gradient-to-br from-[#7c3aed] via-[#a21caf] to-[#e11d48] text-white shadow-[0_28px_60px_-28px_rgba(162,28,175,0.8)] sm:p-8" : "border-2 border-[#eadcf7] bg-white"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-4">
          <div className={`flex shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-md ${star ? "h-28 w-28 sm:h-32 sm:w-32" : "h-20 w-24"}`}>
            <Image src={stall.logo.src} alt={stall.logo.alt} width={stall.logo.w} height={stall.logo.h} sizes="128px" className="max-h-full w-auto max-w-full object-contain" />
          </div>
          <div>
          {star && <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#fde68a]">Atiya&apos;s pick</p>}
          <h3 className={`${serif} mt-1 text-3xl font-semibold ${star ? "sm:text-4xl" : "text-[#2e1065]"}`}>{stall.name}</h3>
          <p className={`mt-1 ${star ? "text-white/90" : "text-[#5b4a6e]"}`}>{stall.tagline}</p>
          </div>
        </div>
        <p className={`rounded-full px-3 py-1 text-sm font-bold ${star ? "bg-white text-[#86198f]" : "bg-[#f3e8ff] text-[#5b21b6]"}`}>
          <span aria-hidden className="text-[#f59e0b]">★</span> {stall.rating} · {stall.reviews} Google reviews
        </p>
      </div>

      <ul className="mt-5 space-y-3">
        {stall.picks.map((p) => (
          <li key={p.dish}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-lg font-bold">{p.dish}</span>
              {p.mentions ? (
                <span className={`shrink-0 text-sm ${star ? "text-[#fde68a]" : "text-[#be123c]"}`}>
                  {p.mentions} {p.mentions === 1 ? "review mentions" : "reviews mention"} it
                </span>
              ) : null}
            </div>
            {p.mentions ? (
              <div className={`mt-1 h-2.5 overflow-hidden rounded-full ${star ? "bg-white/25" : "bg-[#f3e8ff]"}`} aria-hidden>
                <div className={`h-full rounded-full ${star ? "bg-[#fde68a]" : "bg-gradient-to-r from-[#7c3aed] to-[#e11d48]"}`} style={{ width: `${Math.max(8, (p.mentions / max) * 100)}%` }} />
              </div>
            ) : null}
            {p.note && <p className={`mt-1 text-sm ${star ? "text-white/90" : "text-[#5b4a6e]"}`}>{p.note}</p>}
          </li>
        ))}
      </ul>
      {stall.heads && <p className={`mt-5 rounded-xl px-4 py-3 text-sm ${star ? "bg-white/15 text-white" : "bg-[#f3e8ff] text-[#4c1d95]"}`}>{stall.heads}</p>}
      {stall.listing && <p className={`mt-3 text-xs ${star ? "text-white/80" : "text-[#6b5a80]"}`}>{stall.listing}</p>}
    </article>
  );
}

export default function BirthdayPage() {
  const initial = publicView([]);
  const [star, ...others] = STALLS;
  const portrait = PHOTOS[0];
  return (
    <main>
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#7c3aed] via-[#c026d3] to-[#f43f5e] text-white">
        <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-[#fde68a]/30 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 right-10 h-80 w-80 rounded-full bg-[#fb7185]/50 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute left-1/3 top-10 h-3 w-3 rotate-12 rounded-sm bg-[#fde68a]" />
        <div aria-hidden className="pointer-events-none absolute left-2/3 top-24 h-2.5 w-5 -rotate-12 rounded-sm bg-white/80" />
        <div aria-hidden className="pointer-events-none absolute left-[12%] bottom-16 h-3 w-3 rounded-full bg-white/70" />
        <div aria-hidden className="pointer-events-none absolute right-[8%] top-12 h-4 w-4 rotate-45 rounded-sm bg-[#fde68a]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <div>
            <div className="flex items-center gap-4">
              <Image src={portrait.src} alt="" width={72} height={72} sizes="72px" className="h-[72px] w-[72px] rounded-full border-4 border-white object-cover object-top shadow-lg md:hidden" />
              <p className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-extrabold uppercase tracking-[0.22em] backdrop-blur">You are invited</p>
            </div>
            <h1 className={`${serif} mt-4 text-5xl font-semibold leading-[1.02] drop-shadow-sm sm:text-7xl`}>
              Atiya&apos;s <span className="text-[#fde68a]">Birthday</span> Lunch
            </h1>
            <p className="mt-5 text-xl font-semibold sm:text-2xl">{EVENT.dateLabel} · arrive {EVENT.arriveLabel}</p>
            <p className="mt-1 text-lg text-white/90">{EVENT.venue}, Atlanta</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#rsvp" className="inline-flex min-h-14 items-center rounded-full bg-white px-7 text-lg font-extrabold text-[#be123c] shadow-lg transition hover:scale-[1.03]">
                RSVP and list everyone attending
              </a>
              <a href="#menu" className="inline-flex min-h-14 items-center rounded-full border-2 border-white/80 px-7 text-lg font-extrabold text-white transition hover:bg-white/15">
                What to order
              </a>
            </div>
            <p className="mt-5 text-sm text-white/90">Please answer by <b className="text-[#fde68a]">{EVENT.cutoffLabel}</b>.</p>
          </div>
          <div className="mx-auto hidden w-full max-w-[300px] md:block md:max-w-none">
            <div className="rotate-2 overflow-hidden rounded-[2rem] border-[6px] border-white shadow-[0_30px_60px_-20px_rgba(76,5,100,0.7)]">
              <Image src={portrait.src} alt={portrait.alt} width={portrait.w} height={portrait.h} priority sizes="(min-width: 768px) 30vw, 300px" className="h-auto w-full" />
            </div>
          </div>
        </div>
        <svg aria-hidden viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 block h-8 w-full text-[#fbf7ff] sm:h-12">
          <path fill="currentColor" d="M0 60V30C240 0 480 0 720 24s480 28 720-4v40H0Z" />
        </svg>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* RSVP: the first thing to do */}
        <section className="pb-14 pt-6 sm:pt-8" aria-label="RSVP">
          <RsvpParty initial={initial} />
        </section>

        {/* Details */}
        <section id="details" className="scroll-mt-6 pb-14">
          <Eyebrow tone="red">The plan</Eyebrow>
          <h2 className={`${serif} mt-1 text-4xl font-semibold text-[#2e1065] sm:text-5xl`}>One lunch. One birthday. All of us.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { icon: "🗓️", label: "When", title: EVENT.dateLabel, body: <>Please arrive between <b>{EVENT.arriveLabel}</b> so we can all get settled together. The hall opens at 11 AM on Sundays.</>, tint: "from-[#f3e8ff] to-white", bar: "bg-[#7c3aed]" },
              { icon: "📍", label: "Where", title: EVENT.venue, body: <>{EVENT.addressLine}<br />{EVENT.cityLine}<br /><span className="text-sm text-[#6b5a80]">Rated {HALL_RATING.rating} on Google from {HALL_RATING.reviews} reviews.</span></>, tint: "from-[#ffe4e6] to-white", bar: "bg-[#e11d48]" },
              { icon: "🍽️", label: "How it works", title: "Order what you love", body: <>It is a food hall, so everyone picks a stall, orders, and finds a place to sit. We do not have a table reserved: we will all show up and pick a spot. Menu picks are below.</>, tint: "from-[#fae8ff] to-white", bar: "bg-[#c026d3]" },
            ].map((c) => (
              <div key={c.label} className={`overflow-hidden rounded-3xl border-2 border-[#eadcf7] bg-gradient-to-b ${c.tint}`}>
                <div className={`h-2 ${c.bar}`} />
                <div className="p-6">
                  <p className="text-3xl" aria-hidden>{c.icon}</p>
                  <h3 className="mt-2 text-sm font-extrabold uppercase tracking-[0.16em] text-[#7c3aed]">{c.label}</h3>
                  <p className={`${serif} mt-1 text-2xl font-semibold text-[#2e1065]`}>{c.title}</p>
                  <p className="mt-1 text-[#5b4a6e]">{c.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border-2 border-[#eadcf7] bg-white">
            <iframe
              title="Satellite map of Chattahoochee Food Works"
              src={MAP_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[320px] w-full border-0 sm:h-[420px]"
              allowFullScreen
            />
            <div className="flex flex-wrap gap-3 p-4">
              <a href={MAP_LINK} className="inline-flex min-h-12 items-center rounded-full bg-[#7c3aed] px-5 font-bold text-white">Open in Google Maps</a>
              <a href={APPLE_LINK} className="inline-flex min-h-12 items-center rounded-full border-2 border-[#7c3aed] px-5 font-bold text-[#6d28d9]">Open in Apple Maps</a>
              <a href="/birthday/atiya-birthday-lunch.ics" download className="inline-flex min-h-12 items-center rounded-full border-2 border-[#e11d48] px-5 font-bold text-[#be123c]">Add to my calendar</a>
            </div>
          </div>
        </section>

        {/* Menu */}
        <section id="menu" className="scroll-mt-6 pb-14">
          <Eyebrow>What to order</Eyebrow>
          <h2 className={`${serif} mt-1 text-4xl font-semibold text-[#2e1065] sm:text-5xl`}>The dishes people rave about</h2>
          <p className="mt-3 max-w-3xl text-lg text-[#5b4a6e]">
            We read the Google reviews for each stall inside Chattahoochee Food Works and kept the dishes people mention most. &quot;Mentions&quot; is how many reviews talk about that dish. Atiya&apos;s stall comes first.
          </p>
          <div className="mt-6 space-y-5">
            <StallCard stall={star} />
            <div className="grid gap-5 md:grid-cols-2">
              {others.map((s) => (
                <StallCard key={s.name} stall={s} />
              ))}
            </div>
          </div>
          <p className="mt-5 text-sm text-[#6b5a80]">
            Ratings and dish mentions come from each stall&apos;s own Google Maps listing at The Works, viewed November 24, 2026. 504 Seafood has a small number of reviews, so treat its list as a friendly hint. Menus and prices can change.
          </p>
        </section>

        {/* Parking */}
        <section id="parking" className="scroll-mt-6 pb-14">
          <Eyebrow tone="red">Parking</Eyebrow>
          <h2 className={`${serif} mt-1 text-4xl font-semibold text-[#2e1065] sm:text-5xl`}>Park free for two hours</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border-2 border-[#16a34a] bg-[#f0fdf4] p-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#15803d]">Free for the first two hours</p>
              <h3 className={`${serif} mt-1 text-2xl font-semibold text-[#14532d]`}>Orange Deck, Westbound Deck, or Up Front</h3>
              <p className="mt-2 text-[#355c43]">{PARKING.free}</p>
            </div>
            <div className="rounded-3xl border-2 border-[#f59e0b] bg-[#fffbeb] p-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#b45309]">Pay when you leave</p>
              <h3 className={`${serif} mt-1 text-2xl font-semibold text-[#78350f]`}>Yellow Deck (additional parking)</h3>
              <p className="mt-2 text-[#6b4a1a]">{PARKING.paid}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              ["Our plan", PARKING.tip],
              ["How to pay", PARKING.pay],
              ["Rideshare", PARKING.rideshare],
            ].map(([t, b]) => (
              <p key={t} className="rounded-2xl bg-white p-5 text-[#5b4a6e] ring-2 ring-[#eadcf7]">
                <b className="block text-[#6d28d9]">{t}</b>
                {b}
              </p>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#6b5a80]">
            Source: <a className="underline" href={PARKING.sourceUrl} target="_blank" rel="noopener noreferrer">{PARKING.sourceLabel}</a>. Please check The Works&apos; parking page on the day, since rules can change.
          </p>
        </section>

        {/* Photos */}
        <section className="pb-14" aria-labelledby="bd-photos">
          <Eyebrow>The birthday girl</Eyebrow>
          <h2 id="bd-photos" className={`${serif} mt-1 text-4xl font-semibold text-[#2e1065] sm:text-5xl`}>Come celebrate her</h2>
          <div className="mt-6">
            <PhotoSwipe />
          </div>
        </section>
      </div>

      {/* Closing push */}
      <section className="bg-gradient-to-r from-[#7c3aed] via-[#c026d3] to-[#e11d48] px-4 py-14 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <p className={`${serif} text-4xl font-semibold sm:text-5xl`}>Ready to RSVP?</p>
          <p className="mt-3 text-lg text-white/90">Tell us who is coming by {EVENT.cutoffLabel}.</p>
          <a href="#rsvp" className="mt-7 inline-flex min-h-14 items-center rounded-full bg-white px-8 text-lg font-extrabold text-[#be123c] shadow-lg hover:scale-[1.03]">
            RSVP now
          </a>
        </div>
      </section>
      <footer className="bg-[#f3e8ff] px-4 py-6 text-center text-xs text-[#6b5a80]">A private invitation. Please do not post this link publicly.</footer>
    </main>
  );
}
