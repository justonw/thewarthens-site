// Guides that sit around the Resume Builder (rendered by src/app/resume/guides/[slug]/page.tsx). Each one answers
// a question people really type into a search box, in plain words, and points to the builder. Rules: every number
// has a source on this site (see components/resume/EvidenceDropdown.tsx and lib/starter-checklist.ts), no promises
// about outcomes, no made-up statistics, no em dashes. Example resume lines are labeled as examples.

import { moreResumeGuides } from "./resume-guides-more";

export const RESUME_GUIDES_UPDATED = "2026-11-16";

export type Item = { title: string; text: string };

export type Block =
  | { type: "p"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "numbered"; items: Item[] }
  | { type: "note"; text: string }
  | { type: "compare"; before: string; after: string; why: string }
  | { type: "links"; items: { label: string; href: string; text: string }[] };

export type Section = { id: string; heading: string; blocks: Block[] };

export type ResumeGuide = {
  slug: string;
  /** The <title> tag. Keep it under about 60 characters. */
  title: string;
  h1: string;
  /** The meta description. Keep it under about 160 characters. */
  description: string;
  eyebrow: string;
  updated: string;
  keywords: string[];
  intro: string[];
  sections: Section[];
  faq: { question: string; answer: string }[];
  related: string[];
  /** The short name used in link lists. */
  short: string;
  blurb: string;
};

const EVIDENCE_LINKS = [
  {
    label: "Huntr, 2025 Annual Job Search Trends Report",
    href: "https://huntr.co/research/2025-annual-job-search-trends-report",
    text: "Tailored resumes: 5.8% reached an interview, offer, or hire. Untailored: 3.73%. From outcomes reported by users of Huntr's job-tracking app.",
  },
  {
    label: "Jobscan, State of the Job Search 2025",
    href: "https://www.jobscan.co/blog/interview-rates-study",
    text: "Resumes whose title matched the listing had an interview rate 10.6 times higher. A company's own data, showing a correlation.",
  },
];

const baseGuides: ResumeGuide[] = [
  /* ---------------------------------------------------------------- */
  {
    slug: "tailor-resume-to-job-description",
    short: "Tailor a resume to a job",
    title: "How to Tailor Your Resume to a Job Description (2026)",
    h1: "How to Tailor Your Resume to a Job Description",
    description:
      "Tailor your resume to any job posting in 7 steps: what to pull from the posting, what to change, and what never to make up. With before-and-after examples.",
    eyebrow: "Resume guide",
    updated: "2026-11-16",
    keywords: ["tailor resume to job description", "how to tailor your resume", "customize resume for job", "resume keywords from job posting", "match resume to job description"],
    intro: [
      "Tailoring means rewriting the top of your resume, your skills, and your strongest bullets so they answer what one specific job posting asks for. You keep every fact true. You change what comes first and which words you use.",
      "Below is the process we use ourselves, in order, with examples. It takes about 30 to 45 minutes by hand the first time. If you would rather not do it by hand, the Resume Builder follows these same steps for you.",
    ],
    sections: [
      {
        id: "does-it-work",
        heading: "Does tailoring a resume actually help?",
        blocks: [
          {
            type: "p",
            text: "The evidence points one way, though it is not as strong as marketing pages make it sound. In Huntr's data, tailored resumes turned into interviews or offers about 1.6 to 2.1 times as often as generic ones. In Jobscan's data, resumes whose job title matched the listing had an interview rate 10.6 times higher.",
          },
          {
            type: "note",
            text: "Be careful with those numbers. They come from job-search companies and from what their users reported, not from controlled experiments, and we found no independent randomized study of resume tailoring. Treat tailoring as the best-supported thing you can do, not a guarantee.",
          },
          { type: "links", items: EVIDENCE_LINKS },
        ],
      },
      {
        id: "steps",
        heading: "The 7 steps",
        blocks: [
          {
            type: "numbered",
            items: [
              {
                title: "Read the posting and sort it",
                text: "Copy the posting into a document. Mark three groups: the must-haves (usually under 'requirements' or 'minimum qualifications'), the main day-to-day responsibilities, and the nice-to-haves. The must-haves and the first few responsibilities are what the employer cares about most.",
              },
              {
                title: "Pull out the posting's own words",
                text: "List the 8 to 15 skills, tools, and phrases that repeat or sit near the top. Note the exact wording. 'Net-new accounts', 'executive stakeholders', and 'cross-functional teams' are examples of phrases that are worth matching exactly, but only where they are true for you.",
              },
              {
                title: "Put the exact job title under your name",
                text: "Add the title from the posting as a headline under your name, and keep it short, like 'Account Executive, New Business Sales'. This is the target role, not a job you claim to have held. Jobscan's data links a matching title to far higher interview rates, and 55% of the recruiters it surveyed say they filter by title.",
              },
              {
                title: "Rewrite your summary around their top requirements",
                text: "In three sentences or fewer, name the two or three main requirements you clearly meet, with your strongest proof for each, in the posting's words. Skip 'I don't have direct experience, but'. Lead with the value you bring. Do not use 'I', 'my', or other pronouns: resumes leave the subject out.",
              },
              {
                title: "Reorder and reword your bullets",
                text: "In each job, move the bullets that prove what the posting asks for to the top, and reword them using the posting's language where it truly describes what you did. Keep the numbers, the kind of customer, and what you sold or fixed. Cut generic filler like 'worked with the team'.",
              },
              {
                title: "Match your skills section to the posting",
                text: "Put the skills and tools the posting names first, in its wording, but only the ones you really have. A skills section near the top helps both the software and the person skimming: 76.4% of the recruiters Jobscan surveyed said they filter candidates by skills.",
              },
              {
                title: "Check it against the posting one last time",
                text: "Read the posting again, then your resume. Could someone see each of the top five requirements within ten seconds? Is anything in your resume not true? Remove it. Then save the file as a PDF with a clear name.",
              },
            ],
          },
          { type: "links", items: [{ label: "Try the free resume keyword scanner", href: "/resume/keyword-matcher", text: "Paste your resume and the posting to see which of its key phrases you already have, which are missing, and which are almost there. Free, no sign-up." }] },
        ],
      },
      {
        id: "example",
        heading: "A before-and-after example",
        blocks: [
          {
            type: "p",
            text: "This is a made-up example to show the idea. Suppose a posting asks to 'resolve customer issues quickly' and 'follow up with new leads'.",
          },
          {
            type: "compare",
            before: "Handled customer complaints and called people back about catering.",
            after: "Resolved customer complaints on the spot and followed up with new catering leads within 24 hours.",
            why: "The facts are the same. The second version uses the posting's phrases 'resolved customer', 'followed up', and 'new leads', and says what happened. It only works if you really did call back within a day. If you did not, do not write it.",
          },
        ],
      },
      {
        id: "never",
        heading: "What never to do",
        blocks: [
          {
            type: "bullets",
            items: [
              "Never add a skill, tool, job, number, or result you do not have. Employers check, and interviewers ask about every line.",
              "Never copy a whole paragraph from the posting. Match phrases, not sentences.",
              "Never stuff keywords in a hidden block of white text. Recruiters and software both treat it as a red flag.",
              "Never merge two jobs or change a job title to sound better. Dates and titles have to match what an employer will confirm.",
              "Never leave a requirement you meet unmentioned just because your old job used different words. Translate it.",
            ],
          },
          {
            type: "p",
            text: "If the posting asks for something you do not have, leave it out of the resume. If you are close, you may mention it in your cover letter honestly, for example the related thing you have done and your plan to learn the rest.",
          },
        ],
      },
      {
        id: "faster",
        heading: "Doing it in about a minute",
        blocks: [
          {
            type: "p",
            text: "The Resume Builder does these steps for you. You add your resume and the job posting (as text, a file, a screenshot, or a link). It returns a tailored one-column resume and, if you want, a matching cover letter, as PDF and Word files, built only from your real experience. It also shows you what it changed and why, and lists anything the posting asks for that your resume does not show, so you can add it only if it is true. Your first two builds are free.",
          },
        ],
      },
    ],
    faq: [
      {
        question: "How long does it take to tailor a resume?",
        answer:
          "By hand, about 30 to 45 minutes for the first posting and 15 to 20 for later ones once you have a strong base resume. The Resume Builder does it in about a minute.",
      },
      {
        question: "Should I rewrite my whole resume for every job?",
        answer:
          "No. Keep one complete master resume, then change the headline, summary, skills order, and the first one or two bullets of each job for every posting. That is where tailoring has the most effect.",
      },
      {
        question: "How many keywords should I use?",
        answer:
          "There is no magic number. Use the posting's own phrases wherever they honestly describe your work, usually 8 to 15 of them, each used naturally once or twice. Repeating a phrase to stuff keywords reads badly and does not help.",
      },
      {
        question: "Is it okay to use ChatGPT or another AI to tailor a resume?",
        answer:
          "Yes, as long as you check every line. The risk is that an AI invents experience to match the posting. Read everything it writes and delete anything that is not true. A tool built for this should never add facts you did not give it.",
      },
    ],
    related: ["ats-friendly-resume", "career-change-resume"],
    blurb: "The 7 steps we use, with a before-and-after example and what never to do.",
  },
  /* ---------------------------------------------------------------- */
  {
    slug: "ats-friendly-resume",
    short: "ATS-friendly resume",
    title: "ATS-Friendly Resume: What Hiring Software Actually Reads",
    h1: "ATS-Friendly Resume: What Hiring Software Actually Reads",
    description:
      "What applicant tracking systems do with your resume, the formatting that causes problems, and a short checklist to make sure your resume reads cleanly.",
    eyebrow: "Resume guide",
    updated: "2026-11-16",
    keywords: ["ats friendly resume", "ats resume format", "applicant tracking system resume", "ats resume tips", "resume formatting for ats"],
    intro: [
      "An applicant tracking system (ATS) is the software employers use to collect applications, read the resume into searchable fields, and help recruiters sort and filter. Most large employers use one. Jobscan reports that 98.8% of Fortune 500 companies and about 80% of mid-size employers run resumes through one.",
      "What matters for you is simpler: the software has to read your resume correctly, and the person who opens it has to find what they are looking for in a few seconds. Here is how to make both true.",
    ],
    sections: [
      {
        id: "what-it-does",
        heading: "What an ATS does with your resume",
        blocks: [
          {
            type: "p",
            text: "It converts your file to text and tries to sort that text into fields: name, contact details, job titles, employers, dates, skills, education. Recruiters can then search and filter those fields. How much an ATS ranks or rejects automatically differs by employer and by how they set it up, so no one can promise you a score that gets past every system.",
          },
          {
            type: "note",
            text: "What you can control is whether the text comes out clean. A resume that reads badly as plain text can lose its job titles, dates, or skills in the conversion.",
          },
        ],
      },
      {
        id: "format",
        heading: "The formatting that causes problems",
        blocks: [
          {
            type: "bullets",
            items: [
              "Tables, text boxes, and columns. Text can be read in the wrong order, or skipped. Use a single column.",
              "Icons, skill bars, photos, and graphics. They carry no text the software can read, and they can push real text out of place.",
              "Contact details in the page header or footer. Some systems skip headers and footers. Put your email and phone under your name in the body.",
              "Unusual fonts, or headings that are pictures. Use a standard font and plain section names: Summary, Skills, Experience, Education.",
              "Skills-only layouts with no work history in date order. They are the format most likely to be mis-parsed, and recruiters tend to trust them least. A reverse-chronological or combination layout is the safe choice.",
              "A file saved as an image or a scan. Save a real text PDF or a Word file.",
            ],
          },
        ],
      },
      {
        id: "checklist",
        heading: "A seven-point check",
        blocks: [
          {
            type: "numbered",
            items: [
              { title: "The exact job title from the posting appears under your name", text: "As a headline, not as a job you claim you held." },
              { title: "Language from the posting appears in your resume", text: "Where it honestly describes your work. If the posting says 'executive stakeholders', say that, not only 'senior contacts'." },
              { title: "Simple formatting", text: "One column, a standard font, no tables or graphics." },
              { title: "A skills section near the top", text: "Right under your summary, using the posting's names for tools and skills." },
              { title: "Reverse-chronological experience", text: "Newest job first, with dates on every job." },
              { title: "Contact details in the body", text: "Email and phone, so a recruiter can reach you." },
              { title: "Dates on every job", text: "A missing date can make a timeline unreadable to software and raises questions for a person." },
            ],
          },
          { type: "links", items: [{ label: "Try the free resume keyword scanner", href: "/resume/keyword-matcher", text: "Paste your resume and the posting to see which of its key phrases you already have, which are missing, and which are almost there. Free, no sign-up." }] },
          {
            type: "p",
            text: "These are the same seven checks the Resume Builder runs on every resume it makes, and it updates the list as you edit.",
          },
        ],
      },
      {
        id: "length",
        heading: "Does length matter?",
        blocks: [
          {
            type: "p",
            text: "Parsers do not penalize a second page. The one-page rule is a preference of human readers, and it is a good default for under ten years of experience. If you have more experience, two pages is fine. Make the first half-page count, because that is where a recruiter decides whether to keep reading.",
          },
        ],
      },
    ],
    faq: [
      {
        question: "Is a PDF or a Word file better for an ATS?",
        answer:
          "Either works if it is a real text file. Follow the employer's instructions if they state a preference. If they do not, a clean PDF keeps your formatting, and a Word file is safest when you are unsure. Never submit a scan or an image of a resume.",
      },
      {
        question: "Do ATS systems automatically reject resumes?",
        answer:
          "It depends on the employer and how they set up the system. Many are used mainly to organize applications and let recruiters search them. Do not assume a rejection is automatic, and do not assume a high score guarantees a read. Aim for a resume the software reads cleanly and a person understands quickly.",
      },
      {
        question: "Should I use a fancy template?",
        answer:
          "For most jobs, no. A plain one-column layout is the lowest-risk choice. If you have a design you like, check it by copying all the text out of the file into a plain text editor: if the order is wrong or text is missing, a scanner may read it the same way.",
      },
    ],
    related: ["tailor-resume-to-job-description", "career-change-resume"],
    blurb: "What the software reads, the formatting that breaks it, and a seven-point check.",
  },
  /* ---------------------------------------------------------------- */
  {
    slug: "career-change-resume",
    short: "Career change resume",
    title: "Career Change Resume: How to Write One That Gets Read",
    h1: "How to Write a Career Change Resume",
    description:
      "How to write a resume when you are changing fields: the layout that works, how to translate your old experience, and how to handle the gaps without lying.",
    eyebrow: "Resume guide",
    updated: "2026-11-16",
    keywords: ["career change resume", "resume for career change", "career changer resume", "resume with no experience in the field", "transferable skills resume"],
    intro: [
      "A career change resume has one job: make a recruiter see, in about ten seconds, that your past work points toward the role you want. You do that with a clear target at the top, a short list of relevant skills, and your old experience described in the new field's language.",
      "None of that requires stretching the truth. It requires choosing which true things to put first.",
    ],
    sections: [
      {
        id: "layout",
        heading: "Use the combination layout",
        blocks: [
          {
            type: "p",
            text: "Put your target job title under your name, a short summary, and a skills section at the top. Then list your work history in reverse order, with dates. This combination layout shows the skills up front, which helps when your job titles do not match the new field, while still giving the reader the dates and employers they expect. Avoid a skills-only layout with no work history: software mis-reads it more often, and recruiters trust it less.",
          },
        ],
      },
      {
        id: "summary",
        heading: "Write a summary that points forward",
        blocks: [
          {
            type: "p",
            text: "Three sentences or fewer. Say who you are, the strongest proof from your real experience that applies to the new role, and the role you are aiming for. Lead with what you bring. Do not open with an apology such as 'I do not have direct experience, but'. Do not use 'I' or 'my': resume sentences leave the subject out.",
          },
          {
            type: "compare",
            before: "Restaurant manager looking to change careers and break into sales.",
            after: "Customer-facing leader with 8 years managing teams and following up with leads, aiming for an Account Executive role where fast follow-up and steady relationships drive results.",
            why: "This is an example only. The second version names real strengths and the target role. Only use years and numbers that you can check against your own dates.",
          },
        ],
      },
      {
        id: "translate",
        heading: "Translate your old experience",
        blocks: [
          {
            type: "p",
            text: "Read three postings for the role you want. Write down the words they use. Then go through your old jobs and describe what you actually did in those words, wherever it is the same activity.",
          },
          {
            type: "bullets",
            items: [
              "'Handled guest complaints' can become 'resolved customer complaints'. That is the same activity.",
              "'Trained new hires' can become 'onboarded and coached new team members'.",
              "'Followed up on catering inquiries' can become 'followed up with new leads'.",
              "Do not rename an activity into a different skill. Handling complaints is not 'objection handling', and scheduling is not 'project management', unless that is truly what you did.",
            ],
          },
        ],
      },
      {
        id: "gaps",
        heading: "Handle what you do not have, honestly",
        blocks: [
          {
            type: "bullets",
            items: [
              "Put certifications, courses, and bootcamps you have finished in a Training section. If you are partway through, say 'in progress' with the expected date.",
              "Add a project or volunteer role that shows the skill, as its own entry with dates, if it is real.",
              "Leave off a requirement you cannot honestly claim. Do not hide it in the cover letter either: say what you have done that is close, and that you are learning the rest.",
              "Keep recent jobs even when they are unrelated. Shorten them to a bullet or two instead of dropping them and leaving a gap in the dates.",
            ],
          },
        ],
      },
      {
        id: "builder",
        heading: "Let the builder do the translating",
        blocks: [
          {
            type: "p",
            text: "The Resume Builder is made for this situation. You add your current resume and the job posting, and it rewrites your experience in the posting's language, keeps your facts, and lists anything the posting asks for that your resume does not show, so you decide whether it is true for you. If you have skills or experience that are not on your resume, add them in a short note and they are used in your own words. Your first two builds are free.",
          },
        ],
      },
    ],
    faq: [
      {
        question: "Should I explain my career change in my resume?",
        answer:
          "Say it once, briefly, in your summary by naming the role you are aiming for, and use your cover letter for a sentence on why. Do not apologize for the change or spend space on it.",
      },
      {
        question: "Can I list skills I am still learning?",
        answer:
          "Only if you label them honestly, for example in a Training section marked 'in progress'. Do not list a tool as a skill if you could not answer an interviewer's questions about it.",
      },
      {
        question: "How far back should my work history go?",
        answer:
          "About ten to fifteen years for most roles. Keep older jobs only if they are relevant to the new field, and keep any job that would otherwise leave a visible gap in the last ten years, shortened to a bullet or two.",
      },
    ],
    related: ["tailor-resume-to-job-description", "who-to-address-a-cover-letter-to"],
    blurb: "The layout, the summary, and how to translate your old experience honestly.",
  },
  /* ---------------------------------------------------------------- */
  {
    slug: "who-to-address-a-cover-letter-to",
    short: "Who to address a cover letter to",
    title: "Who to Address a Cover Letter To (Even With No Name)",
    h1: "Who to Address a Cover Letter To When You Have No Name",
    description:
      "Start a cover letter with a real name if you can find one, then the hiring team, then the team you would join. Plus ways to find a name.",
    eyebrow: "Cover letter guide",
    updated: "2026-11-16",
    keywords: ["who to address a cover letter to", "cover letter greeting no name", "dear hiring manager alternative", "how to start a cover letter", "to whom it may concern alternative"],
    intro: [
      "The greeting is a small part of a cover letter, but it is the first thing the reader sees. Most career guides agree on the same order of preference, and it is simple.",
    ],
    sections: [
      {
        id: "order",
        heading: "The order that works",
        blocks: [
          {
            type: "numbered",
            items: [
              { title: "A real person's name", text: "It shows you did your homework. Example: 'Dear Jamie Alvarez,'. Use the full name, and do not add Mr. or Ms. unless you are certain, because a guess can be wrong." },
              { title: "The company's hiring team", text: "The safe choice when you cannot find a name. Example: 'Dear Spotify Hiring Team,'." },
              { title: "The team you would join", text: "If the posting names it. Example: 'Dear Customer Success Team,'." },
            ],
          },
          {
            type: "p",
            text: "'To whom it may concern' sounds like a form letter, so most guides advise against it. Small details like this rarely decide an application, but a real name is the one that stands out.",
          },
        ],
      },
      {
        id: "find",
        heading: "Ways to find a name",
        blocks: [
          {
            type: "bullets",
            items: [
              "Read the posting again. Many name a contact or a recruiter near the bottom.",
              "Search the company on LinkedIn for the team's manager, or for a recruiter at that company.",
              "Check the company's careers page or its 'Our team' page.",
              "Call the company and ask who is hiring for the role. Career counselors often call this the most reliable way.",
              "Ask anyone you know who works there.",
            ],
          },
          {
            type: "note",
            text: "If you only find the manager's boss, that works too. A wrong guess is worse than no name, so only use a name you are sure of.",
          },
        ],
      },
      {
        id: "avoid",
        heading: "What to avoid",
        blocks: [
          {
            type: "bullets",
            items: [
              "Guessing a name from a company's email pattern or from a photo.",
              "Titles you are unsure about, like Dr., Mr., Ms., or Mrs.",
              "'Dear Sir or Madam' and 'To whom it may concern'.",
              "Using a recruiter's name when the posting is from a different department.",
            ],
          },
        ],
      },
      {
        id: "builder",
        heading: "In the Resume Builder",
        blocks: [
          {
            type: "p",
            text: "When you ask the Resume Builder for a cover letter, there is a box for who it should be addressed to. Add the full name if you found one. If you leave it blank, the letter is addressed to the company's hiring team, or to 'Dear Hiring Team' if the company is unknown.",
          },
        ],
      },
    ],
    faq: [
      {
        question: "Is 'Dear Hiring Manager' okay?",
        answer:
          "It is acceptable and common, but 'Dear [Company] Hiring Team' reads as more specific, and a real name is best. If you do use 'Dear Hiring Manager', make sure the rest of the letter names the company and the role.",
      },
      {
        question: "What if the posting names a recruiter, not the hiring manager?",
        answer:
          "Addressing the recruiter is a reasonable choice, since they are the first reader. If you also find the hiring manager's name and you are sure of it, you can address that person instead.",
      },
      {
        question: "Does the greeting really matter?",
        answer:
          "Rarely on its own. The body of the letter matters far more. A good greeting just avoids a small negative and, with a real name, can make a small positive.",
      },
    ],
    related: ["career-change-resume", "tailor-resume-to-job-description"],
    blurb: "A real name, then the hiring team, then the team you would join, and how to find a name.",
  },
];

export const resumeGuides: ResumeGuide[] = [...baseGuides, ...moreResumeGuides];

export const guideBySlug = (slug: string) => resumeGuides.find((g) => g.slug === slug);
