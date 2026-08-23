export type ChecklistItem = {
  id: string;
  text: string;
  why: string;
};

export type ChecklistGroup = {
  id: string;
  title: string;
  note: string;
  items: ChecklistItem[];
};

export const starterChecklist: ChecklistGroup[] = [
  {
    id: "resume",
    title: "Resume Checklist for 2026's AI Screening",
    note: "98.8% of Fortune 500 companies and 80% of mid-size employers now run resumes through an ATS before a human ever sees them, and a growing number add an LLM layer that scores your resume against the job description.",
    items: [
      {
        id: "resume-title",
        text: "Use the exact job title from the posting somewhere in your resume.",
        why: "Resumes containing the exact title get 10.6x more interview invitations than resumes that don't.",
      },
      {
        id: "resume-mirror",
        text: "Mirror the specific posting's language, not a generic keyword list.",
        why: "There's no universal keyword set. Read each posting and match its real wording where your experience genuinely applies.",
      },
      {
        id: "resume-format",
        text: "Keep formatting simple: single column, standard fonts, no tables, icons, or graphics.",
        why: "ATS software scans like a machine, not a designer. Fancy layouts get misread or dropped entirely.",
      },
      {
        id: "resume-skills",
        text: "Put a skills section near the top of the page.",
        why: "76.4% of recruiters start filtering candidates by skills first, before work history or education.",
      },
      {
        id: "resume-chrono",
        text: "Use a reverse-chronological or combination format, not a skills-only layout.",
        why: "Functional-only resumes are the format ATS is most likely to mis-parse, and recruiters trust them the least.",
      },
      {
        id: "resume-length",
        text: "Don't worry about hitting exactly one page.",
        why: "ATS parsers don't penalize length. The one-page rule is a human-reader preference, not a screening rule.",
      },
      {
        id: "resume-ai",
        text: "Use ChatGPT or Claude to help tailor your resume language to each posting.",
        why: "This is now standard competitive practice in 2026, not a shortcut to be embarrassed about.",
      },
    ],
  },
  {
    id: "linkedin",
    title: "LinkedIn Checklist",
    note: "Complete profiles generate 71% higher interview rates. Recruiters are looking here before, sometimes instead of, your resume.",
    items: [
      {
        id: "li-photo",
        text: "Add a professional photo.",
        why: "Profiles with a photo get 21x more views and 9x more connection requests.",
      },
      {
        id: "li-headline",
        text: "Write your headline around your target role, not your current job title.",
        why: "Recruiters search headlines by keyword. A headline stuck on your old title makes you invisible to new-field searches.",
      },
      {
        id: "li-about",
        text: "Make your About section hook someone in the first 2-4 lines.",
        why: "That's all that shows before \"see more\" truncates it. Lead with what you do, who for, then 3-5 concrete wins.",
      },
      {
        id: "li-skills",
        text: "List 30-50 skills, and pin your top 3 to the role you want.",
        why: "Profiles listing 5+ skills are 27x more discoverable in recruiter search.",
      },
      {
        id: "li-open",
        text: 'Turn on "Open to Work."',
        why: "It costs nothing and puts you in front of recruiters actively searching that setting.",
      },
      {
        id: "li-url",
        text: "Customize your profile URL.",
        why: "Small detail, but it reads as intentional, and it's easier to put on a resume or business card.",
      },
      {
        id: "li-visibility",
        text: "Comment and share inside your target industry before you're even applying.",
        why: "Visibility compounds. Showing up in a field's conversation is part of how you get read as already belonging there.",
      },
    ],
  },
];
