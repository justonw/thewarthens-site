// More resume and cover letter guides (rendered by src/app/resume/guides/[slug]/page.tsx, listed from lib/resume-guides.ts).
// Same rules as the first guides: plain words, no invented statistics, no promises about outcomes, no em dashes, and
// example lines are labeled as examples. Each one points to the free keyword scanner or the Resume Builder.
import type { ResumeGuide } from "./resume-guides";

const TOOLS = {
  scanner: { label: "Try the free resume keyword scanner", href: "/resume/keyword-matcher", text: "Paste your resume and a job posting to see which key phrases you already have, which are missing, and which are almost there. Free, no sign-up." },
  builder: { label: "Open the Resume Builder", href: "/resume", text: "Add your resume and a job posting. Get a tailored resume and a matching cover letter as PDF and Word files, built only from your real experience. Your first 2 builds are free." },
};

export const moreResumeGuides: ResumeGuide[] = [
  /* ---------------------------------------------------------------- */
  {
    slug: "resume-keywords-from-job-description",
    short: "Find resume keywords in a job posting",
    title: "How to Find Resume Keywords in a Job Description",
    h1: "How to Find the Right Keywords in a Job Description",
    description: "Find the keywords that matter in any job posting in 5 steps: where to look, what to skip, and how to work them into your resume without stretching the truth.",
    eyebrow: "Resume guide",
    updated: "2026-11-16",
    keywords: ["resume keywords", "how to find keywords in a job description", "keywords for resume", "resume keywords from job posting", "ats keywords"],
    intro: [
      "Hiring teams and the software they use often look for the words a posting uses. Keywords are simply those words: the skills, tools, titles, and phrases the employer repeats. Finding them takes about ten minutes, and it is the first half of tailoring a resume.",
      "The goal is not to stuff in as many words as you can. It is to make sure the words that truly describe you are the same words the posting uses.",
    ],
    sections: [
      {
        id: "where",
        heading: "Where the keywords are hiding",
        blocks: [
          {
            type: "numbered",
            items: [
              { title: "The job title", text: "Copy it exactly. 'Customer Success Manager' and 'Account Manager' can be the same work with different names, and the posting's name is the one to use as your headline when it is honest." },
              { title: "The requirements list", text: "Look under headings like 'Requirements', 'Qualifications', or 'What you'll need'. These are the must-haves, so their words matter most." },
              { title: "The responsibilities", text: "The first few bullets under 'What you'll do' show the day-to-day work. Note the verbs: manage, build, analyze, coordinate." },
              { title: "Anything that repeats", text: "A word or phrase that appears three or more times is telling you what the employer cares about." },
              { title: "The nice-to-haves", text: "These matter less. Use them only where they are true for you, and do not let them push out a must-have." },
            ],
          },
        ],
      },
      {
        id: "types",
        heading: "The four kinds of keywords",
        blocks: [
          {
            type: "bullets",
            items: [
              "Hard skills and tools, such as SQL, Salesforce, or forklift certification.",
              "Role words, such as outbound prospecting, inventory control, or patient intake.",
              "Credentials, such as a degree, PMP, or a state license.",
              "Soft skills, such as communication or problem solving. These are real, but they count most when you show them in a result, not just name them.",
            ],
          },
          { type: "note", text: "Skip filler words that appear in nearly every posting, like 'team player', 'fast-paced', and 'self-starter'. They do not help you stand out." },
        ],
      },
      {
        id: "use",
        heading: "How to use them without lying",
        blocks: [
          { type: "p", text: "For each keyword, ask one question: have I really done this? If yes, make sure your resume says so in the posting's words. If you did the work under a different name, rename it. If you have not done it, leave it out. Adding a skill you do not have usually gets found out in the interview, and it can cost you the job." },
          { type: "compare", before: "Helped customers with their accounts and fixed problems.", after: "Resolved customer account issues in Zendesk and escalated billing problems to the finance team.", why: "This is a made-up example. The second line uses the tool and the task the posting names. It is only right if you really used that tool and did that task." },
        ],
      },
      {
        id: "check",
        heading: "Check your work in a minute",
        blocks: [
          { type: "p", text: "After you update your resume, compare it with the posting. A scanner does this for you: it lists the posting's key phrases and shows which ones your resume has, which are missing, and which are almost there." },
          { type: "links", items: [TOOLS.scanner, TOOLS.builder] },
        ],
      },
    ],
    faq: [
      { question: "How many keywords should I use?", answer: "There is no magic number. Aim to include the posting's most important skills, tools, and its job title, wherever they are honestly true for you. A resume that reads naturally to a person matters more than one packed with words." },
      { question: "Should I copy the whole job description into my resume?", answer: "No. Copying a posting reads as lazy to a person, and it often includes things you have not done. Use the posting's words only to describe your real experience." },
      { question: "Do keywords matter if a person reads my resume?", answer: "Yes. A person skimming for the job's main requirements finds them faster when your resume uses the same words, which is why this helps with both software and people." },
    ],
    related: ["tailor-resume-to-job-description", "ats-friendly-resume"],
    blurb: "Where to find the keywords in a posting, which to skip, and how to use them honestly.",
  },
  /* ---------------------------------------------------------------- */
  {
    slug: "resume-summary-examples",
    short: "Write a resume summary",
    title: "Resume Summary: How to Write One (With Examples)",
    h1: "How to Write a Resume Summary That Gets Read",
    description: "A resume summary is 2 to 3 lines that tell the reader why you fit this job. How to write one in 4 steps, with examples for a career changer and a new grad.",
    eyebrow: "Resume guide",
    updated: "2026-11-16",
    keywords: ["resume summary examples", "how to write a resume summary", "professional summary for resume", "career change resume summary", "resume profile"],
    intro: [
      "A resume summary sits at the top, under your name. Its job is simple: in two or three lines, tell the reader why you are a fit for this job, so they keep reading. It is the part most worth rewriting for each posting.",
      "If you have nothing to say that is specific, skip the summary. A vague one ('hard-working professional seeking a challenging role') uses prime space and says nothing.",
    ],
    sections: [
      {
        id: "formula",
        heading: "A simple formula",
        blocks: [
          {
            type: "numbered",
            items: [
              { title: "Say who you are in the posting's terms", text: "Use the job title or the field the posting names, and how long or in what setting you have worked. Example: 'Customer support specialist with 4 years in software.'" },
              { title: "Name your two or three strongest matches", text: "Pick the main requirements you clearly meet, in the posting's words. If the posting asks for CRM experience and you used HubSpot, say HubSpot." },
              { title: "Add one proof point", text: "A real result, number, or scale. 'Handled about 60 tickets a day' is stronger than 'handled many tickets'. Only use numbers you can stand behind." },
              { title: "Leave out 'I'", text: "Resumes drop the pronoun. Start with the description, not with 'I am'." },
            ],
          },
        ],
      },
      {
        id: "examples",
        heading: "Three made-up examples",
        blocks: [
          { type: "p", text: "These are examples to show the shape, not lines to copy. Every detail would need to be true for you." },
          { type: "compare", before: "Hard-working professional looking for a new opportunity.", after: "Customer support specialist with 4 years in software. Resolved about 60 tickets a day in Zendesk and trained 5 new teammates. Ready to move into customer success.", why: "The first says nothing a reader can use. The second names the field, the tool, a number, and the target role." },
          { type: "compare", before: "Career changer interested in tech.", after: "Restaurant shift lead moving into tech sales. Led a team of 8, handled daily customer complaints, and followed up with catering leads. Completed a free CRM course.", why: "For a career change, translate your old work into the new job's terms, and say what you did to prepare. Do not claim tech experience you do not have." },
          { type: "compare", before: "Recent graduate seeking an entry-level position.", after: "Business graduate with internship experience in marketing. Built a weekly report in Excel and managed a class project's social posts. Looking for a marketing coordinator role.", why: "With little paid experience, use internships, projects, and volunteer work, and name the role you want." },
        ],
      },
      {
        id: "mistakes",
        heading: "Common mistakes",
        blocks: [
          { type: "bullets", items: ["Writing the same summary for every job. It is the easiest thing to tailor.", "Listing traits ('motivated, detail-oriented') with no proof.", "Going past three or four lines. If it is a paragraph, it will not be read.", "Claiming skills or experience you do not have."] },
          { type: "links", items: [TOOLS.builder] },
        ],
      },
    ],
    faq: [
      { question: "Is a resume summary still necessary?", answer: "It is optional. A specific summary helps, especially when you are changing careers and the reader needs a quick reason to keep reading. A vague one is better left out." },
      { question: "What is the difference between a summary and an objective?", answer: "An objective says what you want. A summary says what you bring to this job. A summary written for the employer is usually more useful than an objective." },
      { question: "How long should a resume summary be?", answer: "Two to three lines, or about 40 to 60 words. If you cannot say it briefly, you probably need to pick your strongest points." },
    ],
    related: ["career-change-resume", "tailor-resume-to-job-description"],
    blurb: "A 4-step formula for 2 to 3 lines that tell the reader why you fit, with examples.",
  },
  /* ---------------------------------------------------------------- */
  {
    slug: "how-long-should-a-resume-be",
    short: "How long a resume should be",
    title: "How Long Should a Resume Be? One Page or Two",
    h1: "How Long Should a Resume Be?",
    description: "One page or two? A plain rule for how long your resume should be, when a second page is fine, and how to cut it down without losing what matters.",
    eyebrow: "Resume guide",
    updated: "2026-11-16",
    keywords: ["how long should a resume be", "one page resume", "two page resume", "resume length", "how many pages should a resume be"],
    intro: [
      "The short answer: one page if you can fit your strongest, most relevant experience on it, and two pages if you have enough relevant experience to fill them well. A resume is not a life history. It is a sales page for one job.",
      "What matters is not the page count but how fast a reader can see that you fit. A tight one-page resume that matches the job beats a two-page one that makes the reader hunt.",
    ],
    sections: [
      {
        id: "rule",
        heading: "A simple rule of thumb",
        blocks: [
          { type: "bullets", items: ["Under about 10 years of experience, or changing careers: aim for one page.", "More than about 10 years of relevant experience, or a field that expects detail (such as research, senior leadership, or technical work): two pages can be right.", "Never one and a quarter pages. If you spill over by a few lines, trim until it fits on one.", "Page two should be as strong as page one, not leftovers."] },
          { type: "note", text: "These are widely given guidelines from career advisors, not rules, and they vary by field and country. When in doubt, look at the posting and at resumes from people in that role." },
        ],
      },
      {
        id: "cut",
        heading: "How to cut a resume down",
        blocks: [
          {
            type: "numbered",
            items: [
              { title: "Start from the posting", text: "Keep what proves you can do this job. Cut what does not, even if you are proud of it." },
              { title: "Shorten old jobs", text: "Give recent roles 3 to 5 bullets and older ones 1 or 2. Roles from more than 10 to 15 years ago can be one line, or dropped if they are not relevant." },
              { title: "Remove filler", text: "Cut 'responsible for', 'duties included', and tasks anyone in the role would do. Keep results and the specific tools you used." },
              { title: "Tighten the format", text: "Use clean margins and a readable font. Do not shrink the font below about 10 points to squeeze things in." },
              { title: "Drop what is dated", text: "An objective statement, 'references available on request', and outdated skills add length without value." },
            ],
          },
        ],
      },
      {
        id: "tailor",
        heading: "Length is part of tailoring",
        blocks: [
          { type: "p", text: "Because you are choosing what to include for each job, your resume's length can change from one application to the next. The free keyword scanner shows what the posting asks for, so you can keep the matching lines and cut the rest." },
          { type: "links", items: [TOOLS.scanner, TOOLS.builder] },
        ],
      },
    ],
    faq: [
      { question: "Is a two-page resume bad?", answer: "No. It is fine when you have enough relevant experience to fill two pages well. The problem is a second page with only a few lines or with old, unrelated jobs." },
      { question: "Should my resume be one page if I am changing careers?", answer: "Usually, yes. A career changer's strongest points are the transferable ones, and one focused page makes them easy to see." },
      { question: "Do applicant tracking systems care about length?", answer: "Most care about whether they can read the content, not the page count. A person reading it is the reason to keep it short and focused." },
    ],
    related: ["tailor-resume-to-job-description", "resume-summary-examples"],
    blurb: "One page or two: a plain rule, and how to cut a resume down.",
  },
  /* ---------------------------------------------------------------- */
  {
    slug: "resume-with-no-experience",
    short: "Resume with no work experience",
    title: "Resume With No Experience: What to Put on It",
    h1: "How to Write a Resume With No Work Experience",
    description: "No job history? You still have something to show. What to put on a resume with no work experience: projects, school, volunteering, and skills, with examples.",
    eyebrow: "Resume guide",
    updated: "2026-11-16",
    keywords: ["resume with no experience", "first resume no work experience", "resume for first job", "no experience resume examples", "how to write a resume with no experience"],
    intro: [
      "If you have never held a job in the field, or never held a job at all, you are not starting from nothing. Employers hiring for entry-level roles expect that, and they look for signs that you can learn, show up, and finish things.",
      "The trick is to show those signs honestly, using what you really have done, and to lead with the most relevant.",
    ],
    sections: [
      {
        id: "what",
        heading: "What to put on it",
        blocks: [
          {
            type: "numbered",
            items: [
              { title: "A short summary", text: "Two lines that name the job you want and your strongest relevant point. Example: 'Business graduate seeking a customer support role. Strong written communication and experience managing a class project.'" },
              { title: "Projects", text: "School, personal, or online-course projects count. Say what you built or solved, with the tools you used." },
              { title: "Volunteering and community work", text: "Unpaid work is still work. Describe what you did and any scale, such as events you helped run or people you helped." },
              { title: "Education and training", text: "Degrees, certificates, and free courses you finished. List what you completed, not what you started." },
              { title: "Skills", text: "The tools and abilities the posting names, only the ones you really have." },
              { title: "Informal work", text: "Babysitting, helping a family business, selling things online, caring for family, and gig work all show responsibility. Include them when they relate to the job." },
            ],
          },
        ],
      },
      {
        id: "order",
        heading: "How to arrange it",
        blocks: [
          { type: "p", text: "Put your summary first, then the section that is strongest for this job (often projects or education), then volunteering and skills. Skip a long 'work history' section if you have none. Use the posting's own words where they truly describe what you did." },
          { type: "compare", before: "Worked on a group project in school.", after: "Led a 4-person class project that built a budget tracker in Excel, presented to a panel of 3 instructors.", why: "This is a made-up example. The second line shows a role, a result, a tool, and an audience. Only write what is true." },
        ],
      },
      {
        id: "honest",
        heading: "What not to do",
        blocks: [
          { type: "bullets", items: ["Do not invent jobs, dates, or titles. A background check or a quick question in an interview can undo it.", "Do not pad with every class you took.", "Do not leave big blank space. A focused half page is better than a padded full one."] },
          { type: "links", items: [TOOLS.builder, TOOLS.scanner] },
        ],
      },
    ],
    faq: [
      { question: "Can I put school projects on a resume?", answer: "Yes. For a first job, projects are one of the best ways to show what you can do. Describe what you made or solved, the tools you used, and the result." },
      { question: "Should I include a skills section with no experience?", answer: "Yes, as long as the skills are real and match the job. Pair them with a project or activity that shows you using them." },
      { question: "How long should a resume with no experience be?", answer: "One page at most, and it can be less. Focused and honest beats long." },
    ],
    related: ["resume-summary-examples", "career-change-resume"],
    blurb: "What to put on a resume when you have no work history: projects, school, volunteering, skills.",
  },
  /* ---------------------------------------------------------------- */
  {
    slug: "how-to-explain-a-resume-gap",
    short: "Explain a gap in your resume",
    title: "How to Explain a Resume Gap Honestly (With Examples)",
    h1: "How to Explain a Gap in Your Resume Honestly",
    description: "Time away from work? How to handle a resume gap honestly: how to show it, what to say in a cover letter or interview, and what never to do.",
    eyebrow: "Resume guide",
    updated: "2026-11-16",
    keywords: ["how to explain a resume gap", "employment gap on resume", "resume gap explanation", "gap in work history", "returning to work after a break resume"],
    intro: [
      "Gaps happen: caring for family, health, a layoff, a move, school, or a search that took longer than planned. Employers see gaps all the time. What matters is that you handle yours calmly, briefly, and honestly.",
      "The goal is not to hide the gap. It is to give a short, true reason and then move the reader's attention to what you can do now.",
    ],
    sections: [
      {
        id: "resume",
        heading: "On the resume",
        blocks: [
          {
            type: "numbered",
            items: [
              { title: "Use years when you can", text: "Listing only years, such as 2021 to 2023, makes short gaps less noticeable. Be accurate. Do not stretch dates to cover a gap." },
              { title: "List what you really did", text: "Caring for a family member, freelance work, a course, or volunteering can go on the resume as a line of its own, with the dates." },
              { title: "Do not leave a long unexplained hole", text: "A one-line note is better than a mystery. 'Full-time caregiver for a family member, 2022 to 2024' is clear and honest." },
              { title: "Keep recent skills visible", text: "Add anything you learned or did in that time that relates to the job." },
            ],
          },
        ],
      },
      {
        id: "say",
        heading: "What to say about it",
        blocks: [
          { type: "p", text: "In a cover letter or interview, give one short, true sentence and then pivot to the future. You do not owe anyone private details, especially about health or family." },
          { type: "compare", before: "I was out of work for a while because of some personal stuff and then it was hard to get back in.", after: "I took two years to care for a family member. That has ended, and I am ready to return full time. During that time I kept my skills current by completing a CRM course.", why: "This is a made-up example. The second version is short, true, calm, and points forward. Only mention a course if you really took one." },
        ],
      },
      {
        id: "never",
        heading: "What never to do",
        blocks: [
          { type: "bullets", items: ["Do not invent a job, a client, or a business to fill the gap.", "Do not change dates to hide time away. Employers can verify dates.", "Do not apologize at length. A gap is not a character flaw.", "Do not overshare. Keep it to what is relevant."] },
          { type: "note", text: "If you are not sure how much to share, a short true statement is almost always enough." },
          { type: "links", items: [TOOLS.builder] },
        ],
      },
    ],
    faq: [
      { question: "Do I have to explain a gap on my resume?", answer: "Not always. Short gaps often need no explanation. Longer ones are easier on the reader if you add one short, true line." },
      { question: "Is it okay to leave months off my resume?", answer: "Listing years only is common and acceptable as long as it is accurate. Never change a date to hide time away." },
      { question: "What if I do not have anything to show for that time?", answer: "That is fine. Caring for family, health recovery, and job searching are real reasons. State it briefly and focus on what you can do now." },
    ],
    related: ["career-change-resume", "resume-summary-examples"],
    blurb: "How to show and talk about a gap honestly, with a calm example and what never to do.",
  },
  /* ---------------------------------------------------------------- */
  {
    slug: "how-to-write-a-short-cover-letter",
    short: "Write a short cover letter",
    title: "How to Write a Short Cover Letter That Gets Read",
    h1: "How to Write a Short Cover Letter That Gets Read",
    description: "A cover letter does not need to be long. A simple 4-paragraph structure, a before-and-after example, and what to leave out so the reader reaches your point.",
    eyebrow: "Cover letter guide",
    updated: "2026-11-16",
    keywords: ["how to write a cover letter", "short cover letter", "cover letter structure", "cover letter examples", "cover letter for a job application"],
    intro: [
      "A good cover letter answers one question for the reader: why you, for this job? It does not retell your resume. It connects what they need to something you have really done, in a few short paragraphs.",
      "Shorter usually works better. If a reader can finish it in under a minute, they are more likely to.",
    ],
    sections: [
      {
        id: "structure",
        heading: "A simple 4-paragraph structure",
        blocks: [
          {
            type: "numbered",
            items: [
              { title: "Open with the role and a reason", text: "Name the job and one specific thing about the company or role that interests you. Skip 'I am writing to apply for'." },
              { title: "Show one strong match", text: "Pick the requirement that matters most and give one real example of doing it, with a result if you have one." },
              { title: "Add a second match or a bridge", text: "A second example, or, if you are changing fields, how your past work connects to this job." },
              { title: "Close simply", text: "Say you would like to talk, thank them, and sign off. Keep it warm and short." },
            ],
          },
        ],
      },
      {
        id: "example",
        heading: "A before-and-after",
        blocks: [
          { type: "compare", before: "I am a hard-working person with many skills who would be a great fit for your company and I am excited to apply.", after: "I would like to join your support team because your help center is the clearest I have used. In my current role I resolve about 60 tickets a day and wrote the guides that cut repeat questions.", why: "This is a made-up example. The second opens with a specific reason and shows proof. Only use numbers that are true." },
        ],
      },
      {
        id: "leave",
        heading: "What to leave out",
        blocks: [
          { type: "bullets", items: ["A paragraph that repeats your resume line by line.", "Generic praise ('your company is a leader in its industry').", "Apologies for what you lack. Lead with what you offer.", "Anything that is not true or that you could not talk about in an interview."] },
          { type: "p", text: "Not sure who to address it to? See our guide on who to address a cover letter to. The free Resume Builder can also write a short matching letter from your real experience." },
          { type: "links", items: [{ label: "Who to address a cover letter to", href: "/resume/guides/who-to-address-a-cover-letter-to", text: "A real name, then the hiring team, then the team you would join." }, TOOLS.builder] },
        ],
      },
    ],
    faq: [
      { question: "How long should a cover letter be?", answer: "Aim for under one page, and often about three to four short paragraphs. Shorter is usually fine if it makes a clear case." },
      { question: "Do I need a cover letter if the posting does not ask for one?", answer: "It is optional in that case. A short, specific one can help, especially if you are changing careers and want to connect the dots." },
      { question: "Should my cover letter repeat my resume?", answer: "No. Use it to connect one or two real experiences to what this job needs, and let the resume carry the details." },
    ],
    related: ["who-to-address-a-cover-letter-to", "tailor-resume-to-job-description"],
    blurb: "A 4-paragraph structure for a short cover letter, with an example and what to leave out.",
  },
];
