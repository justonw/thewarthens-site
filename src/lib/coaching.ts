// Content for the 1:1 coaching landing page (/tech/coaching) and its intake form.
// Jermell's intake questions are his own wording (from his email), so the form,
// the notification email, and the page all read from this one file.
// Style: no em dashes anywhere in written content.

export const coach = {
  name: "Jermell Mitchell",
  firstName: "Jermell",
  title: "Account Executive",
  // Describes his employer's place in the market without naming it.
  roleLine: "Account Executive at a leading CRM software company",
  linkedin: "https://www.linkedin.com/in/jermell-mitchell-54795427/",
  photo: "/coaching/jermell-mitchell.webp",
} as const;

export const COACHING_PATH = "/tech/coaching";

export const coachingQuestions = [
  {
    question: "Where do I actually start?",
    answer:
      "Your starting point depends on your background, your strengths, and your timeline.",
  },
  {
    question: "How do I move on from where I am now?",
    answer:
      "The next step looks different for a teacher, a veteran, a retail manager, and a rep who wants a bigger seat. You need the one built for you.",
  },
  {
    question: "How do I actually interview?",
    answer:
      "Telling your story clearly, connecting it to the role, and asking questions that make them lean in.",
  },
  {
    question: "How do I network without it feeling fake?",
    answer:
      "Starting real conversations, earning trust, and building relationships that outlast one job search.",
  },
  {
    question: "What about me needs to change?",
    answer:
      "Sometimes the most useful answer is the one nobody has been willing to say to your face.",
  },
];

export const howItWorks = [
  {
    title: "Answer 7 questions",
    body: "Tell Jermell what brought you here and where you are. It takes about 5 to 10 minutes.",
  },
  {
    title: "Free 15-minute intro call",
    body: "If it looks like a fit, you will be invited to a short call to see whether working together makes sense for both of you.",
  },
  {
    title: "Work toward your next move",
    body: "Sessions are built around you, with practical next steps toward a stronger interview, a wider network, or a better offer. The aim is clarity on where you stand and the confidence to take the next step.",
  },
];

export const approach = [
  {
    title: "He gets to know you first",
    body: "What are you working toward? What comes naturally? Where do you get stuck? Your personality, experience, and goals shape the work.",
  },
  {
    title: "He asks and he challenges",
    body: "Expect real questions, assumptions pushed on, and honest feedback. Not a script that was written for someone else.",
  },
  {
    title: "Feedback tailored to your situation",
    body: "Jermell listens first, then gives feedback shaped around you, drawing on conversations that opened doors, deals that took patience, and mistakes that changed how he approaches people.",
  },
];

export type ServiceIcon = "target" | "users" | "message" | "scale" | "user";

// Each area of focus gets its own accent color so the five areas read as clearly different.
export const services: {
  icon: ServiceIcon;
  title: string;
  body: string;
  goodWhen: string;
  chip: string;
  border: string;
}[] = [
  {
    icon: "target",
    title: "Sales and prospecting",
    body: "Strengthen outreach, cold calling, discovery conversations, and follow through.",
    goodWhen: "You want sharper outreach and conversations that actually move forward.",
    chip: "bg-blue-100 text-blue-700",
    border: "border-blue-500",
  },
  {
    icon: "users",
    title: "Networking and relationships",
    body: "Start conversations, build trust, and develop relationships that last.",
    goodWhen: "You want first conversations to turn into real relationships.",
    chip: "bg-violet-100 text-violet-700",
    border: "border-violet-500",
  },
  {
    icon: "message",
    title: "Interview preparation",
    body: "Tell your story clearly, connect your experience to the opportunity, and prepare to answer and ask meaningful questions.",
    goodWhen: "An interview is coming and you want to tell your story with confidence.",
    chip: "bg-emerald-100 text-emerald-700",
    border: "border-emerald-500",
  },
  {
    icon: "scale",
    title: "Negotiation",
    body: "Work through business deals, compensation discussions, and job offers with a clear view of your value, priorities, and options.",
    goodWhen: "You are weighing an offer, a raise, or a deal.",
    chip: "bg-amber-100 text-amber-700",
    border: "border-amber-500",
  },
  {
    icon: "user",
    title: "Personal positioning",
    body: "Communicate what you bring to the table in a way that feels natural and gives others a reason to engage.",
    goodWhen: "You want to say what you bring in a way that feels like you.",
    chip: "bg-rose-100 text-rose-700",
    border: "border-rose-500",
  },
];

export const helpAreas = [
  "Sales",
  "Cold calling",
  "Networking",
  "Relationship building",
  "Interviewing",
  "Negotiating",
  "Communicating my value",
] as const;

// Jermell's seven intake questions. `short` is the label used in the progress header.
export const intakeQuestions = [
  {
    short: "What brought you here",
    question: "What prompted you to reach out now?",
    hint: "Tell me about the opportunity, challenge, or upcoming conversation that brought you here.",
  },
  {
    short: "What you want help with",
    question: "What would you like help with?",
    hint: "This might include sales, cold calling, networking, relationship building, interviewing, negotiating, or communicating your value. Share what matters most to you.",
  },
  {
    short: "Your situation",
    question: "What should I know about you and your current situation?",
    hint: "Tell me about your work, background, experience, or anything else that would help me understand your perspective.",
  },
  {
    short: "Where you feel confident",
    question: "When do you feel most comfortable and confident connecting with people?",
    hint: "Share an example, whether it comes from work or everyday life.",
  },
  {
    short: "Where you get stuck",
    question: "Where do you tend to get stuck, and what have you tried so far?",
    hint: "Tell me what happens, what you've done to work through it, and how it turned out.",
  },
  {
    short: "How you learn",
    question: "How do you learn best, and what makes feedback useful to you?",
    hint: "You might prefer talking things through, seeing examples, practicing conversations, or trying something and reviewing it together.",
  },
  {
    short: "What success looks like",
    question: "What would make this coaching worth the investment for you?",
    hint: "Describe the outcome you want, how you would recognize progress, and any deadline you're working toward.",
  },
] as const;

// The free session: on a set cadence, one person who sends in the form wins a free 30-minute
// session with Jermell. The number is deliberately never shown here or on the page.
export const freeSession = {
  title: "A free session, now and then",
  lead: "On a set cadence, one request lands on the mark and wins a free 30-minute session with Jermell, built around what they shared.",
  sub: "There is nothing extra to do or to answer. If you have sent in the form, you are in the mix, and the winning request is told right away.",
  points: [
    {
      title: "What you win",
      body: "A free 30-minute one-on-one session with Jermell, built around your situation and your goals.",
    },
    {
      title: "How it is chosen",
      body: "Requests are counted in the order they arrive, and the one that lands on the schedule wins.",
    },
    {
      title: "Whatever happens",
      body: "Every request gets read, and you can still have the free 15-minute intro call if it looks like a fit.",
    },
  ],
  fineprint:
    "One winner for each set number of completed requests, chosen automatically by the order received.",
  // Shown on screen to a winner right after they send the form.
  winnerLine: "what did you do, get that out of a cereal box?",
  winnerHeadline: "You just won a free 30-minute session with Jermell.",
} as const;

export const INTAKE_MIN_CHARS = 10;
export const INTAKE_MAX_CHARS = 2000;

// Juston's commentary, in his words, cleaned up.
export const justonPullQuote =
  "You seem like a really smart, educated dude. Whatever this lack of confidence thing you're facing, you need to figure that out and get rid of it.";

export const justonCommentary = [
  "I came from nonprofit leadership, where I was typically the most honored person in the room. Then I entered the marketplace full time and met someone who told me what he observed about me and questioned my motives. It was shocking, humbling, and sobering.",
  "Jermell moved me to think clearly about where I actually was: limited maturity and real personal doubt. He made me believe I was an Account Executive and that I deserved a spot on the team. He also pushed me toward a better temperament and presence for my wife and children.",
  "Did I land a higher paying job after Jermell invested in me? Yes. Did the way I interview change? Yes. Did I learn valuable details about selling and negotiating? Absolutely. But beyond all of that, the way I saw myself shifted. I genuinely believed something different about who I was, and that produced qualities my family and the marketplace could appreciate.",
  "Needless to say, I think differently now.",
];

export const textMessages = [
  {
    src: "/coaching/text-own-way.webp",
    width: 589,
    height: 379,
    caption: "On getting out of your own way",
    alt: "Text message from Jermell: If you continue to get in your own way, you will remain in the same spot because of your actions. Juston replies that the conversation has much value and that he wants to change from getting in his own way.",
  },
  {
    src: "/coaching/text-razor-sharp.webp",
    width: 589,
    height: 372,
    caption: "On being sharp when the market is tough",
    alt: "Text messages from Jermell: You have nothing to lose. The job market is super competitive right now which is why it's important to really be razor sharp.",
  },
  {
    src: "/coaching/text-your-value.webp",
    width: 1150,
    height: 935,
    caption: "On knowing your value",
    quote:
      "Don't let someone else determine what your value is. That is totally up to you and within your control.",
    alt: "A text conversation with Jermell with most messages blurred for privacy. The visible message reads: Don't let someone else determine what your value is. That is totally up to you and within your control.",
  },
];
