// The text of the privacy policy, terms, and refund policy. This file is the source of truth for the legal pages (the older
// drafts in docs/legal are kept for history and for the attorney).
//
// Rules for editing this text:
//   - Say only what is true and what the code does. If a promise is not backed by something that actually happens, do not make it.
//   - Describe KINDS of providers (AI provider, email service, payment processor, host, video platform), never company names, so the
//     text stays true when a provider changes. The real names live in docs/legal/third-parties.json and docs/legal/data-map.md.
//   - No postal address appears here on purpose (the business has none to publish yet).
//
// LEGAL_DRAFT is the one switch. While it is true, every legal page shows a DRAFT banner and asks search engines to skip it.
// scripts/check-legal.mts fails if it is false while any [BLANK] is left in the text.
export const LEGAL_DRAFT = false;

export const EFFECTIVE = "Effective November 20, 2026";
export const CONTACT_EMAIL = "info@thewarthens.com";

export type Block = { p: string } | { sub: string } | { bullets: string[] };
export type Section = { heading: string; blocks: Block[] };
export type LegalDoc = { slug: string; title: string; intro: string; effective: string; sections: Section[] };

export const privacy: LegalDoc = {
  slug: "privacy",
  title: "Privacy Policy",
  effective: EFFECTIVE,
  intro:
    "This policy explains what **Warthen Enterprise LLC**, a Georgia limited liability company (\"we\", \"us\"), collects on thewarthens.com, why, who helps us handle it, and the choices you have. It covers the Resume Builder, Tech Journey, Faith Journey, and Tech Journey Jr. This site is run from the United States and is meant for people in the United States.",
  sections: [
    {
      heading: "The short version",
      blocks: [
        {
          bullets: [
            "The Resume Builder sends your resume and the job to an AI service to write your documents. We do not save the text of your resume or the job posting on our servers (our providers may keep copies for a short time, described below), unless you tick the optional box that lets us use that one build to improve the site (see \"Sharing a build to help us improve this site\" below).",
            "We use your email to count your free builds, to send the copy you ask for, and, if you opt in or are on our list, an occasional note. Every note has an unsubscribe link.",
            "We do not sell your information, and we do not use ad trackers.",
            "We do not use what you send us to train AI models, including anything you choose to share.",
            "Sharing a build with us is optional, off by default, covers only that one build, and you can stop it at any time.",
            "You can ask us to delete your information at any time.",
          ],
        },
      ],
    },
    {
      heading: "What we collect",
      blocks: [
        { sub: "When you build a resume or use its tools" },
        {
          bullets: [
            "Your resume (typed, pasted, uploaded, or a screenshot), the job posting or a link to it, notes, and anything you type into the tools (answers, stories, names of people you want to write to).",
            "Your email address, and how you found us.",
            "We pass your resume and the job to our AI provider to write the result, then return it to your browser. **We do not save the text of your resume, the posting, or what you typed on our servers, except for a build you choose to share with us (see below).**",
            "We keep a count of how many builds you have used, stored under a scrambled version of your email address, so we can honor the free builds and anything you purchase.",
            "Each time someone builds a resume, we get an alert with their email address, the job title from the posting, and how they found us. These alerts stay in our email inbox.",
          ],
        },
        { sub: "When you give us your email or contact us" },
        {
          bullets: [
            "The \"occasional note\" list, the waitlist, the contact form, and the coaching form each collect what the form asks for (such as your name, email, phone, and LinkedIn address). We keep list and waitlist addresses until you ask us to remove them or unsubscribe. Messages from forms arrive in our email inbox.",
          ],
        },
        { sub: "When you buy a pack of builds" },
        {
          bullets: [
            "Payments are handled by our payment processor. You enter your card on the processor's own page, and we never see or store your card number. We receive your email, the amount, and a payment reference, and we keep a record of purchases for tax and accounting.",
          ],
        },
        { sub: "Automatically" },
        {
          bullets: [
            "We count how many people reach each step of our tools, once per visit, with no name, email, or anything you typed attached. We do not use advertising or analytics trackers.",
            "Our hosting provider keeps standard server logs (which can include your IP address and the pages requested) for security and reliability, for a limited time under its own terms.",
          ],
        },
        { sub: "What stays on your device" },
        {
          bullets: [
            "Your saved drafts, saved builds, stories, and application tracker are kept in your own browser. We do not receive them unless you send them through one of our tools. Clearing your browser data erases them.",
          ],
        },
        { sub: "Voice input" },
        {
          bullets: [
            "If you use the microphone, your browser's own speech recognition turns your voice into text. In some browsers (for example Chrome), the browser's maker processes the audio. We never receive the audio.",
          ],
        },
        { sub: "Videos" },
        { bullets: ["Some pages embed videos from a third-party video platform. That platform may set cookies and see that you viewed the page, under its own policy."] },
      ],
    },
    {
      heading: "How we use it",
      blocks: [
        {
          bullets: [
            "To write your resume and the other documents you ask for.",
            "To count and honor free and purchased builds, process payments, and prevent abuse.",
            "To email you the copy you ask for, answer your messages, and, if you are on the list, send occasional notes.",
            "To keep the site working and secure.",
            "To understand, in counts only, which steps people finish, so we can improve the tools.",
            "To read the builds that people choose to share with us, so we can improve this web application.",
          ],
        },
      ],
    },
    {
      heading: "Sharing a build to help us improve this site",
      blocks: [
        {
          p: "After you build, you may see a box that says you are willing to let The Warthens use this resume-building session to improve this web application. **It is off unless you tick it, and you get everything either way.**",
        },
        { sub: "What it covers" },
        {
          bullets: [
            "Only the one build you ticked the box for. It does not carry over to your next build or to anything you do later. If you come back, you will be asked again.",
            "What we keep from that build: the resume text and job posting text you pasted, your notes, and the finished result.",
            "We never keep a file you attached (such as a PDF or a screenshot), and we do not keep your contact details from it.",
          ],
        },
        { sub: "What we remove, and what we cannot promise" },
        {
          bullets: [
            "Before we keep it, our system replaces email addresses, phone numbers, links, ID-like numbers, and your name with a plain placeholder in their place (for example, the word \"email\" or \"name\" in brackets).",
            "**This removal is automatic and is not perfect.** Other details that could point to you, such as an employer, a school, or a town, may remain. Please do not tick the box if your resume holds something you would not want us to read.",
            "We keep your email address only as a scrambled code (so we can tell whether a build is yours when you ask us to stop sharing it) and a masked version of it, such as d***@example.com, that our team sees when it reviews shared builds.",
          ],
        },
        { sub: "Who reads it and what we do with it" },
        {
          bullets: [
            "Only our team, using a private review tool, to see where the Resume Builder does well and where it falls short.",
            "We do not sell it, share it with other people, use it for advertising, or use it to train AI models.",
            "Shared text sits with our website host, which also stores our counters and lists.",
          ],
        },
        { sub: "How long we keep it, and how to stop" },
        {
          bullets: [
            "We keep a shared build until you stop sharing it or ask us to delete it.",
            "To stop, use the \"Stop sharing this build\" button shown with that build on the same device, or email **info@thewarthens.com** from the address you used. When you stop, we empty the saved copy and keep only a note that it was stopped.",
            "A build you ticked on another device or in a browser you have cleared will not show that button. Email us and we will find it.",
          ],
        },
      ],
    },
    {
      heading: "The AI service",
      blocks: [
        {
          p: "Your resume and the job are sent to **our AI provider**, which runs the AI that writes your documents. We only ask the AI to reword what is in your resume and notes, and we have rules that stop it from adding experience you do not have. You should read every document before you send it, and everything in it must be true.",
        },
        {
          p: "Our AI provider's published terms say that it deletes the inputs and outputs of our requests within 30 days, keeps them longer only if its safety systems flag them for misuse (up to two years) or if the law requires it, and does not use them to train its models by default. These are the provider's terms, not ours. They can change, and we do not control them.",
        },
      ],
    },
    {
      heading: "Who we share information with",
      blocks: [
        { p: "We share information with service providers and other third parties who help us run the site and our business, under their own terms or agreements with us. They include these kinds:" },
        {
          bullets: [
            "An AI provider that writes your documents.",
            "An email service that sends our messages.",
            "A payment processor that takes payments.",
            "Our website host, which also stores our counters and lists.",
            "A video platform for the videos embedded on some pages.",
            "Other service providers and third parties that are relevant to what we offer, such as tools for support, scheduling, security, and record keeping, and professional advisers such as accountants and lawyers.",
          ],
        },
        {
          p: "This list is not exhaustive. As our business grows we may add or change the providers and third parties we work with, and we may share information with them for the purposes described in this policy. We expect them to use it only to provide their services to us.",
        },
        {
          p: "We may also share information if the law requires it, to protect our rights or someone's safety, or as part of a sale or transfer of our business. We do not sell your personal information or share it for advertising.",
        },
        {
          p: "Copies of your information may exist with these providers for the periods their own terms allow, even after we delete ours. For example, our email service keeps a log of the emails it sends, including their contents, for about 30 days.",
        },
      ],
    },
    {
      heading: "Email",
      blocks: [
        {
          bullets: [
            "We send emails you ask for (such as a copy of your resume), notices about your builds or purchases, and, if you are on our list, occasional notes.",
            "Every note we send to our list has an unsubscribe link. You can also reply to any email from us to opt out.",
          ],
        },
      ],
    },
    {
      heading: "How long we keep information",
      blocks: [
        {
          bullets: [
            "Resume, posting, and what you type in the tools: not saved by us, except a build you choose to share (kept until you stop sharing it or ask us to delete it).",
            "Build counts and balances: kept until you ask us to delete them. They are stored under a scrambled version of your email address.",
            "Occasional-note and waitlist addresses: until you unsubscribe or ask us to remove them. We keep an unsubscribe record so we do not email you again.",
            "Contact and coaching messages, and build alerts: kept in our email inbox for as long as we need them to reply and keep our records. We delete them when you ask.",
            "Purchase records: kept for as long as needed for tax and accounting, which can be several years.",
          ],
        },
        {
          p: "**We do not delete our own records automatically.** We remove information when you ask us to, when you stop sharing a build, or when we decide we no longer need it. How long our outside providers keep information is set by their own terms, which can change, and we do not control it. Any period we mention for a provider is based on what its published terms say today, and it may be different when you read this or when your information is handled. We cannot guarantee that a provider has deleted your information by any given date.",
        },
      ],
    },
    {
      heading: "Your choices and rights",
      blocks: [
        {
          p: "You can ask us to tell you what we have about you, correct it, or delete it by emailing **info@thewarthens.com** from the address in question. We may need to confirm it is you. We will respond within 45 days. Residents of some states have additional rights under state privacy laws, and we honor them for everyone. We will not treat you differently for making a request.",
        },
        { p: "You can unsubscribe from any note at any time with the link in it." },
      ],
    },
    {
      heading: "Security",
      blocks: [
        {
          p: "We use reasonable measures to protect information, including keeping card handling with our payment processor, keeping email addresses in our usage counters only as one-way codes, limiting who can access our records, and signed unsubscribe links. No system is completely secure, and we cannot guarantee it. If a breach affects your information, we will notify you as the law requires.",
        },
        { p: "If you find a security problem on our site, please email **info@thewarthens.com**. Our contact details are also at /.well-known/security.txt." },
      ],
    },
    {
      heading: "Children",
      blocks: [
        {
          p: "The Resume Builder and our coaching are for adults and people old enough to work. They are not directed to children under 13, and we do not knowingly collect information from them.",
        },
        {
          p: "**Tech Journey Jr.** is made for children and their parents. The game and quiz have no sign-in or accounts. A child may type an optional first name for their character. It stays in the browser and is not sent to us or saved. If you believe a child has given us personal information, email **info@thewarthens.com** and we will delete it.",
        },
      ],
    },
    {
      heading: "Changes",
      blocks: [{ p: "If we change this policy, we will post the new version with a new date. If the change is significant, we will say so on the site." }],
    },
    {
      heading: "Contact",
      blocks: [{ p: "**Warthen Enterprise LLC**. Email **info@thewarthens.com**." }],
    },
  ],
};

export const terms: LegalDoc = {
  slug: "terms",
  title: "Terms of Use",
  effective: EFFECTIVE,
  intro: "By using thewarthens.com or its tools you agree to these terms. If you do not agree, please do not use them. The site is operated by Warthen Enterprise LLC, a Georgia limited liability company.",
  sections: [
    {
      heading: "What we offer",
      blocks: [
        {
          p: "Free articles and videos, and tools such as the Resume Builder, which uses AI to write resumes, cover letters, messages, answers, and interview practice from information you give us. Some tools have a free allowance and then require a paid pack.",
        },
      ],
    },
    {
      heading: "You are responsible for what you send",
      blocks: [
        {
          bullets: [
            "Only submit information you have the right to use. For messages to other people, only add material about them that you gathered legitimately.",
            "**Everything in a document you send to an employer must be true.** Our tools are built to reword what you gave us and not to add experience you do not have, but AI can make mistakes. Read every document, and fix anything that is not accurate, before you use it.",
            "You are responsible for how you use the documents and for what you submit to employers.",
          ],
        },
      ],
    },
    {
      heading: "No guarantees about jobs",
      blocks: [
        {
          p: "We cannot promise interviews, job offers, or any particular result. Hiring decisions belong to employers. Tailoring a resume is widely seen as helpful, but no one can guarantee an outcome. Tools that check keywords or how hiring software reads a resume are guides and cannot test every system.",
        },
      ],
    },
    {
      heading: "AI-written content",
      blocks: [
        {
          p: "Documents are written by AI based on what you provide. They may contain errors or phrasing you would not choose. They are not legal, career, or professional advice.",
        },
      ],
    },
    {
      heading: "Your content",
      blocks: [
        {
          p: "You keep ownership of what you submit and of the documents you produce. You give us permission to process what you submit, through our service providers (including our AI provider), only to provide the tools to you. See the Privacy Policy for what we keep.",
        },
      ],
    },
    {
      heading: "Free allowance, purchases, and fair use",
      blocks: [
        {
          bullets: [
            "Each email address gets a set number of free builds, and tools have monthly limits per email. We may change them.",
            "Do not try to get around limits, use the tools to send unsolicited messages to other people, copy our site in bulk with automated tools, or interfere with the site.",
            "Paid packs add builds to the email address used at checkout. Payments are processed by our payment processor. **All sales are final.** See the Refund Policy.",
          ],
        },
      ],
    },
    {
      heading: "Our content",
      blocks: [
        {
          p: "The site's text, designs, videos, and software belong to us or our licensors. You may use the documents you create for your own job search. You may not copy or resell our site content or tools.",
        },
      ],
    },
    {
      heading: "Links and other sites",
      blocks: [
        {
          p: "We link to other sites and recommend some courses and tools. We do not control them, and your use of them is under their terms. We may receive compensation for some links, and we say so where it applies.",
        },
      ],
    },
    {
      heading: "Disclaimers",
      blocks: [
        {
          p: "The site and tools are provided \"as is\" and \"as available,\" without warranties of any kind to the extent the law allows. We do not promise they will always be available or error-free.",
        },
      ],
    },
    {
      heading: "Limit of liability",
      blocks: [
        {
          p: "To the extent the law allows, Warthen Enterprise LLC is not liable for indirect or consequential damages, or for lost opportunities, and our total liability for any claim is limited to the amount you paid us in the 12 months before the claim (or $100 if you paid nothing).",
        },
      ],
    },
    {
      heading: "Ending use",
      blocks: [{ p: "You can stop using the tools at any time. We may suspend access if someone breaks these terms or abuses the service." }],
    },
    {
      heading: "Changes",
      blocks: [{ p: "We may update these terms, and will post the new date. Using the site after a change means you accept it." }],
    },
    {
      heading: "Governing law",
      blocks: [
        {
          p: "These terms are governed by the laws of the State of Georgia. Any dispute will be handled in the state or federal courts located in Georgia.",
        },
      ],
    },
    {
      heading: "Contact",
      blocks: [{ p: "**Warthen Enterprise LLC**. Email **info@thewarthens.com**." }],
    },
  ],
};

export const refunds: LegalDoc = {
  slug: "refunds",
  title: "Refund Policy",
  effective: EFFECTIVE,
  intro: "Packs of resume builds are digital and used immediately.",
  sections: [
    {
      heading: "All sales are final",
      blocks: [
        {
          p: "Once you buy a pack, **all sales are final and we do not offer refunds.** Please use your 2 free builds first to see if the tools are right for you.",
        },
      ],
    },
    {
      heading: "Builds that do not work are given back",
      blocks: [
        {
          p: "If a build fails, or a result never reaches you, we give that build back automatically. This is not a refund: you never use up a build for a document you did not receive. If you think a build was lost, email **info@thewarthens.com** from the address you used at checkout.",
        },
      ],
    },
    {
      heading: "Billing mistakes",
      blocks: [
        {
          p: "If you were charged twice for the same pack, or you see a charge you did not make, contact us at **info@thewarthens.com** right away and we will fix it. Please contact us before disputing the charge with your bank, so we can resolve it quickly.",
        },
      ],
    },
    {
      heading: "Where the law gives you rights",
      blocks: [{ p: "Nothing in this policy limits any right you have under the law where you live." }],
    },
  ],
};

export const legalDocs = [privacy, terms, refunds];
