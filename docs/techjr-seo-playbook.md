# Tech Journey Jr. SEO playbook

Written Nov 3 2026. Scope: the kids' section (`/techjr`, the game at `/techjr/play`, and the parent guides). Everything marked **Built** is in the code; everything marked **You** needs a person with the Google or Bing login.

## 1. What I found (audit)

| Area | Before | Problem |
| --- | --- | --- |
| Game pages | `noindex, nofollow` on every `/techjr/play/*` page | The page a parent taps "Play" on could never be found in search, and link equity could not flow. |
| Targeting | `/techjr` aimed only at "career day" and "tech careers for kids" | No page matched what parents type when a child is bored or they want something safe on the phone. |
| Content | One landing page | No pages for internet safety, safe-game checklists, bored-kid ideas, cool facts, or tech heroes. |
| Link previews | `/techjr` had a plain text card; the game pages had none of their own | Shared links looked generic. |
| Structured data | `/techjr` had a LearningResource graph | No game entity for the play pages, no Article or breadcrumb data for guides. |
| Phone use | Nothing for "put it on my kid's phone" | No home-screen install, no guidance. |
| Sitemap | `/techjr` only | Play pages and guides absent. |

## 2. Who we are up against (SERP review)

I could not pull search volumes (no keyword-tool access), so this is a ranking-difficulty read from live results.

- **Head terms** ("free educational games for kids", "educational games for phone"): owned by PBS KIDS, Khan Academy Kids, ABCya, Starfall, app-store lists. A new site will not win these soon. We target them indirectly through the parent guides and the game pages.
- **Online safety games**: Google Interland, FBI SOS, Common Sense, NetSmartzKids, Cyber Five. Real gap: **ages 5 to 7** with read-aloud, and "internet safety for 6 year olds".
- **Career games for kids**: Y Explorers, Virginia Career VIEW, CrazyGames "Professions". Gap: **tech and creator careers** specifically, in kid words.
- **Read-aloud games for kindergarten**: lists are thin and often low quality. Gap: a free game that reads every screen and puts a picture on every choice.
- **Tech facts for kids**: crowded with auto-generated trivia pages. Our edge is checked facts and **named, diverse tech heroes** (Black History Month and Women's History Month demand).

## 3. Strategy

Win long-tail, high-intent, parent-phrased searches first, then let the head-term pages gain authority from them. Every page has one job and one primary query, links to the game, and links to two sibling guides.

### Keyword map

| Page | Primary query | Also targets |
| --- | --- | --- |
| `/techjr` (hub) | free educational games for kids ages 5-10 | games for kids when bored, internet safety game for kids, career day activities |
| `/techjr/play` | play Tech Journey Jr., free games for kids | kids tech game |
| `/techjr/play/ages-5-7` | free games for 5, 6 and 7 year olds | games for kids who can't read yet, read aloud games kindergarten |
| `/techjr/play/ages-8-10` | free games for 8, 9 and 10 year olds | online safety game 3rd 4th 5th grade |
| `/techjr/internet-safety-for-kids` | internet safety for kids | online safety rules, internet safety for 6 year olds, how to teach kids internet safety |
| `/techjr/how-to-choose-safe-educational-games` | safe educational games for kids | free educational games no ads, what to put on my child's phone |
| `/techjr/things-to-do-when-kids-are-bored` | what to do when your kid is bored | car ride and waiting room activities, games to play when bored |
| `/techjr/cool-tech-facts-for-kids` | cool tech facts for kids | computer facts for kids, video game facts for kids, first thing sold on eBay |
| `/techjr/black-inventors-and-tech-heroes-for-kids` | black inventors for kids | Black History Month tech heroes, who invented video game cartridges |
| `/techjr/women-in-tech-and-stem-for-kids` | women in tech for kids | first computer programmer, Women's History Month STEM |

## 4. What I built

**Built: technical**
- Game picker and both age-group pages are now **indexable** with their own titles, descriptions, canonicals, breadcrumb and `WebApplication` / `LearningResource` structured data. Individual worlds and the badge screen stay `noindex, follow`.
- Titles are 45 to 60 characters, descriptions 140 to 160, one H1 per page.
- Sitemap now lists the play pages and all guides with real dates. `llms.txt` added for AI answer engines. `robots.txt` already welcomed search and AI crawlers.
- A web app manifest and home-screen icons for the game, so a parent can add it to a phone and a child opens it in one tap (iPhone and Android instructions are on the page).
- Every page has its own **share preview** (see section 6).

**Built: content (6 new pages, about 6,400 words)** with Article, BreadcrumbList and FAQPage structured data, a table of contents, "Ask your child" prompts, sibling links, and a play button. Facts are checked against more than one source and use "one of the first" when the record is unclear.

**Built: internal links**: hub page guide grid, footer links, a guides list inside the grown-ups panel on the age picker and the age-group pages, "Keep reading" blocks on every guide.

## 5. Things you need to do (I cannot log in for you)

1. **Google Search Console**: add `thewarthens.com` as a Domain property (DNS TXT record at your registrar), open Sitemaps and submit `https://thewarthens.com/sitemap.xml`.
2. In Search Console, use **URL Inspection, then Request Indexing** on: `/techjr`, `/techjr/play`, both age pages, and the six guides. Do this once after the deploy.
3. **Bing Webmaster Tools**: import the site from Search Console (one click). Bing powers many AI and voice answers.
4. After a week, check **Performance, Pages** for the `/techjr` URLs. Note impressions and queries; they will tell us what to write next.
5. Share previews are cached. To see the new card in iMessage or WhatsApp for a URL you already sent, send it with a throwaway suffix (for example `?v=2`). Facebook's Sharing Debugger and LinkedIn Post Inspector can re-scrape a URL.
6. Set the Anthropic key and spend limit for the site guide (separate task).

## 6. Link previews

Every page now has its own 1200 x 630 card:

- **Home, Tech, Faith, Women Who Seek, Coaching**: real photos with page-specific headlines.
- **All Tech Journey Jr. pages** (hub, picker, each age group, each world, each guide): a night-sky game card with the Tech Crew, the headline, and "Free, No ads, No sign-in".
- The crew pictures for these cards are saved in `public/og/crew/`. If a character's look changes in `src/lib/career-avatar.ts`, save a fresh SVG of that avatar there.

## 7. Off-page plan (links and mentions)

Search engines trust pages other sites point to. For a kids' site, quality beats quantity.

1. **Your own channels**: put the guide links in the description of the YouTube videos where you mention the kids' game, in your Instagram and TikTok bios (`/techjr`), and in your email signature.
2. **Teacher and homeschool lists**: submit `/techjr` to homeschool resource directories and "free career day resources" lists; post in teacher and PTA Facebook groups (follow each group's promo rules).
3. **School and library outreach**: offer the career day kit (`/techjr#host`) to school counselors, librarians, and community centers. A single `.edu` or `.org` link is worth more than dozens of directory links.
4. **Pinterest**: pin the guide titles (parents search Pinterest for bored-kid ideas). Use a vertical image per guide; link each pin to its guide.
5. **Seasonal pushes**: Safer Internet Day (February) for internet safety; Black History Month (February) and Women's History Month (March) for the two heroes pages, with updates in January; Computer Science Education Week (December); career day season (fall and spring).
6. **Do not** buy links or post in bulk. It can get a kids' site demoted.

## 8. Roadmap (next 90 days)

- **Weeks 1 to 2**: deploy, submit, request indexing. Fix anything Search Console flags.
- **Weeks 2 to 6**: write from real queries in Search Console. Likely next pages: career day activities for elementary students (split the hosting kit out of `/techjr`), "games for 5 year olds / 6 year olds / 7 year olds" by-age pages, "what is a cybersecurity job for kids", printable PDFs (online-safety poster, tech heroes cards, certificate), each a strong link magnet for teachers.
- **Weeks 6 to 12**: offline play (so it works on a car ride with no signal, a very high-intent parent search), a Spanish version (large audience, low competition), and a short video per guide for YouTube with the guide's link.
- **Measurement**: track in Search Console: impressions, clicks, and average position for the ten primary queries above; track "Pages indexed" for the `/techjr` URLs; plan a monthly 30-minute review.

## 9. Honest expectations

New pages usually take weeks to be indexed and a few months to rank. Head terms will stay with the big brands. The realistic early wins are long-tail searches (internet safety for 6 year olds, black inventors for kids, read-aloud games for non-readers). Nobody can promise rankings; this setup gives the pages the best technical and content footing and a clear measurement loop.

## 10. Content rules to keep

- Say only what is true and visible on the page. No pay numbers, no promises about outcomes, no medical claims.
- Do not call the site "COPPA compliant" or similar; say what it does ("no ads, no sign-in, nothing a child picks is saved or sent").
- Fact-check any new fact against two sources and keep careful wording.
- Keep guide titles near 60 characters and descriptions under 160.
