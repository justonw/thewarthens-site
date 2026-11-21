// "10 Ways to Make $10,000 a Month": the content for /10k, the page linked from the video description.
// Nine ideas that are easy to start and one that uses a job as the tool. Every idea shows the math to $10,000 as an
// illustration (units times profit), never as a promise. The only outside numbers are in idea 10, each with its source.

export type TenKIdea = {
  n: number;
  emoji: string;
  title: string;
  hook: string;
  what: string;
  goodIf: string[];
  start: string[];
  math: string;
  reality: string;
};

export const TEN_K_UPDATED = "November 2026";

export const TEN_K_DISCLAIMER =
  "These are examples of how the math could work, not promises and not typical results. Most people who try any of these will earn less than $10,000 a month, especially at first, and some will lose money. We have not tested each one ourselves. Numbers marked \"for example\" are ours, made up to show the math. Profit means what is left after what you paid for the item or supplies, fees, shipping, gas, and your helpers. Taxes, licenses, permits and insurance depend on where you live, so check your city and state rules and ask a tax professional before you start.";

export const TEN_K_IDEAS: TenKIdea[] = [
  {
    n: 1,
    emoji: "🔁",
    title: "The Trade-Up Chain",
    hook: "Start with something small. Trade up. Repeat until it pays your rent.",
    what: "Buy something cheap that is worth more to the right buyer, sell it, then put the profit into something a little bigger. Each step you move up in price. Film the chain and your audience becomes your buyers.",
    goodIf: ["You enjoy the hunt and love a good deal.", "You can negotiate without getting awkward.", "You are not shy on camera, because the story is half the value."],
    start: [
      "Pick one category and stay in it for a month (tools, sneakers, vintage electronics, camera gear).",
      "Learn what things actually sold for, not what sellers are asking.",
      "Set one rule: only buy if you can resell for at least double.",
      "Write down every deal: what you paid, what you sold it for, and what it cost you in fees and shipping.",
      "Post each trade as a short video. Your followers will start sending you leads.",
    ],
    math: "For example: if the average flip leaves you $100 of profit, 100 flips is $10,000. That is about 3 a day. If you move up to $250 items, it is 40 flips a month.",
    reality: "The real cost is your time. Early profits are small, and inventory can sit for weeks. Count fees, shipping and gas before you call anything profit.",
  },
  {
    n: 2,
    emoji: "📦",
    title: "The Pallet Detective",
    hook: "Buy a mystery pallet. Turn what is inside into money, one item at a time.",
    what: "Liquidation companies sell pallets of returned or overstocked goods. You buy a pallet, sort it, test it, clean it, and resell the pieces for more than the pallet cost.",
    goodIf: ["You are organized and do not mind sorting and cleaning.", "You have space to store things.", "You can handle a gamble that does not always pay."],
    start: [
      "Start with one small pallet from a source that lists exactly what is on it.",
      "Test and photograph everything, and sell each item where its buyers are.",
      "Track what you paid against what the pallet actually earned, so you learn which kinds are worth it.",
      "Keep the buyers who keep coming back and drop the pallet types that lose money.",
    ],
    math: "For example: if a pallet nets $300 of profit after what you paid, fees, shipping and what you throw away, you need about 33 pallets a month. At $600 a pallet it is about 17.",
    reality: "A pallet's listed value is not what it sells for. Some pallets lose money. This one needs space, time and a stomach for risk.",
  },
  {
    n: 3,
    emoji: "🎬",
    title: "The Backyard Movie Night",
    hook: "Own the gear. Rent out the experience.",
    what: "Buy a projector, a big screen, a sound system and some cozy extras, then rent complete backyard movie nights for birthdays, neighborhoods, churches and schools. You deliver, set up and pick up. Other gear works the same way: party games, a photo booth, a bounce house.",
    goodIf: ["You are reliable and show up on time.", "You are friendly with parents, kids and event planners.", "You like building something you can repeat."],
    start: [
      "Buy or borrow one full setup and practice until you can set it up in 20 minutes.",
      "Price it as a package (screen, sound, projector, popcorn machine) and not as separate items.",
      "Get a simple rental agreement and ask about insurance for your gear and for events.",
      "Photograph a real night, post it, and ask your first customers for reviews.",
    ],
    math: "For example: at $250 a night, 40 nights a month is $10,000. With 4 sets of gear, each set needs to work about 10 nights a month, mostly weekends.",
    reality: "Weekends fill up and weekdays stay empty. Gear wears out and needs replacing, and weather and cancellations are part of the job.",
  },
  {
    n: 4,
    emoji: "🎤",
    title: "The Street Performer Who Gets Booked",
    hook: "The sidewalk is the audition. The paid event is the goal.",
    what: "Use a real talent (music, magic, dance, comedy, art, even a balloon act) in public to build a crowd, then turn that crowd into private bookings, lessons and online fans.",
    goodIf: ["You already have a skill people stop to watch.", "You are comfortable with strangers watching you.", "You do not mind hearing no a lot while you improve."],
    start: [
      "Check your city's rules for performing in public, and whether you need a permit.",
      "Film every set. The clips are what get you booked.",
      "Put a clear way to hire you on a sign, a card, or a link in your bio.",
      "Offer a simple event package to local businesses, restaurants and venues.",
      "Add a second income stream, such as lessons, merch or online tips.",
    ],
    math: "For example: 10 paid events a month at $1,000 is $10,000. Or 6 events at $1,000 plus 40 lessons at $100.",
    reality: "Tips alone rarely reach this level. The money is in bookings, and bookings take months of showing up and building a reputation.",
  },
  {
    n: 5,
    emoji: "📺",
    title: "The Live Selling Show",
    hook: "Turn your inventory into a show people tune in to.",
    what: "Host a regular live stream where you sell items (things you flipped, collectibles, crafts, clothing) on a live selling platform. It is part shopping, part entertainment, and the best hosts have regulars.",
    goodIf: ["You can talk comfortably for an hour.", "You know a product category well enough to be the expert in the room.", "You can keep energy up and a calm head when a sale falls through."],
    start: [
      "Pick a niche you know, and sell items you already know how to price.",
      "Watch 10 live shows in your niche and notice what keeps people watching.",
      "Start with a short show on a regular day and time so people can plan on it.",
      "Learn each platform's rules, fees and shipping requirements before you go live.",
    ],
    math: "For example: 16 shows a month (4 a week) that each make $625 of profit is $10,000. Or 8 shows at $1,250.",
    reality: "Audience building is slow, and a platform can change its rules or fees. Your profit is what is left after the item cost, platform fees and shipping.",
  },
  {
    n: 6,
    emoji: "🧼",
    title: "The Before-and-After Business",
    hook: "Clean something filthy on camera. Get hired by the neighbors.",
    what: "Pressure washing, mobile car detailing, window cleaning or gutter cleaning. The work is simple, the results are visual, and a good before-and-after video sells itself.",
    goodIf: ["You are hardworking and do not mind getting dirty.", "You take pride in details and finishing the job right.", "You are good with customers and show up when you say you will."],
    start: [
      "Pick one service and get the equipment for it, new or used.",
      "Do 5 jobs for friends and neighbors at a low price and film every one.",
      "Post the before-and-after clips and ask each customer for a review.",
      "Offer a package price and a repeat-visit discount, and keep a simple calendar.",
      "Check what license or insurance your city requires.",
    ],
    math: "For example: $200 an average job and 50 jobs a month is $10,000. Or a $400 driveway-and-patio package and 25 jobs.",
    reality: "That is 12 or 13 jobs a week, which is a full schedule. Equipment, supplies, gas and insurance come out of what you earn, and bad weather is a real cost.",
  },
  {
    n: 7,
    emoji: "📱",
    title: "Short-Video Retainers for Local Businesses",
    hook: "Local businesses need videos. Most of them do not have the time.",
    what: "Film and edit short videos for restaurants, gyms, salons and shops, on a monthly package. You are not a big agency. You are the person who actually shows up with a phone and posts consistently.",
    goodIf: ["You are creative and already edit videos for fun.", "You can talk to business owners in plain language.", "You are dependable on deadlines."],
    start: [
      "Make 3 sample videos for a local business for free, so you have real work to show.",
      "Offer a simple monthly package: a set number of videos, a posting schedule, and one monthly check-in.",
      "Show owners results they care about (calls, bookings, foot traffic), not just views.",
      "Ask each happy client for a referral to another local business.",
    ],
    math: "For example: $1,000 a month from each of 10 clients is $10,000. Or $1,500 from each of 7 clients is $10,500.",
    reality: "Landing the first few clients is the hard part. Every client needs steady, on-time work, so ten clients is a real job, and you may need help.",
  },
  {
    n: 8,
    emoji: "🎓",
    title: "The Saturday Workshop",
    hook: "Teach one thing you are good at, in person, for one afternoon.",
    what: "Run a paid live workshop on a skill people want to learn: budgeting, resume writing, photography, cooking, a trade skill, a hobby. Sell tickets, teach for a few hours, send everyone home with a result.",
    goodIf: ["You are good at something and can explain it simply.", "You enjoy being in front of a room.", "You are organized and can handle details like tickets, space and reminders."],
    start: [
      "Pick a topic where people want a result by the end of the day.",
      "Book a library room, a church hall or a co-working space instead of buying a venue.",
      "Sell tickets early and fill it with your existing audience first.",
      "Teach, give every person a take-home worksheet, and ask for reviews at the end.",
    ],
    math: "For example: 20 seats at $500 is $10,000. Or 50 seats at $200 is $10,000. Or two workshops a month with 10 seats each at $500.",
    reality: "Filling seats takes an audience that already trusts you. Venue costs, materials and refunds come out of the total. Your first workshop will probably be smaller.",
  },
  {
    n: 9,
    emoji: "🔑",
    title: "The Turnover Crew",
    hook: "Short-term rentals need to be reset fast. Be the people who do it.",
    what: "Clean, restock and reset short-term rental properties between guests. Hosts want someone dependable, and a good crew can handle several properties in a day.",
    goodIf: ["You are detail-oriented and fast.", "You can manage other people's schedules.", "You are trustworthy, since you will have keys to people's properties."],
    start: [
      "Start with one or two hosts, a clear checklist and photos as proof of every turnover.",
      "Quote a flat price per turnover, with an extra fee for same-day jobs.",
      "Hire a helper only when you have steady work to give them.",
      "Get insured and keep a simple record of every property and key.",
    ],
    math: "For example: $125 per turnover and 80 turnovers a month is $10,000. That is about 20 a week. If you pay crew members, your own profit is smaller.",
    reality: "You have to be there when guests check out, and that is not on your schedule. Pay your crew first, and plan for supplies, travel and the occasional bad review.",
  },
  {
    n: 10,
    emoji: "💼",
    title: "Use Your Job as the Tool",
    hook: "The fastest way to $10,000 a month may be a job that pays it.",
    what: "Every idea above is a side business. This one is the opposite: pick a career where $10,000 a month, about $120,000 a year before taxes, is a normal goal, and use the job as the tool to get there. Tech sales is one of the doors people ask about most.",
    goodIf: ["You are comfortable with rejection, talking to strangers and a pay plan that depends on results.", "You are coachable and willing to learn a product and a process.", "You can stay steady through a slow start."],
    start: [
      "Learn how the job actually works, including the hard parts, before you spend money on a course. Our honest guide to tech sales covers both.",
      "Build a resume tailored to each job you apply for, and apply widely.",
      "Plan for a first role at an entry-level pay, then a promotion path toward higher pay.",
      "Look at related roles too, like sales engineering, where the median pay is higher.",
    ],
    math: "RepVue shows median entry-level sales development (SDR) on-target earnings of $90,000 a year, about $7,500 a month if you hit quota, and top performers at $133,738, about $11,100 a month. BLS puts the median pay for sales engineers at $124,900 a year, about $10,400 a month. All before taxes.",
    reality: "A median SDR does not reach $10,000 a month. Most people get there by being promoted, or by moving to a role like sales engineering, and that takes time. Only 57.5% of SDRs hit quota, per RepVue. Read our full, sourced Hype vs. Reality guide before you decide.",
  },
];

export const TEN_K_SOURCES: { label: string; url: string }[] = [
  { label: "RepVue, Sales Development Representative salary page (viewed Nov 21, 2026)", url: "https://www.repvue.com/salaries/sales-development-representative" },
  { label: "U.S. Bureau of Labor Statistics, Occupational Outlook Handbook: Sales Engineers (2025 median pay $124,900)", url: "https://www.bls.gov/ooh/sales/sales-engineers.htm" },
];
