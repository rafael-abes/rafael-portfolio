/**
 * Prose and timeline content for the introduction, experience, notes and contact chapters.
 *
 * Sources: the supplied resume for every role, date and coursework item. Anything that is
 * not on the resume is marked `draft` so the site shows a reminder until it is confirmed.
 * The introduction and chef's notes are drafts in Rafael's voice, built from the themes in
 * the brief and facts from the resume. Rewrite them freely.
 */

export const intro = {
  heading: "I'm Rafael!",
  aside: "(Rafa for short)",
  paragraphs: [
    "I’m finishing a Bachelor of Computer Science at Monash University in December 2026. I like finding out how things work underneath, and then building something practical on top of that.",
    "So far that has meant a serverless ingestion pipeline on AWS, an iOS app on Firebase, and RAG automation workflows at Globe Telecom. I came up with the idea of turning my portfolio into a cookbook to reflect my love for cooking, and as it turns out cooking and software engineering have a lot in common.",
  ],
  facts: [
    { label: "Studying", value: "Computer Science, Monash University" },
    { label: "Graduating", value: "December 2026" },
    { label: "Most recently", value: "AI Practitioner Intern, Globe Telecom" },
  ],
} as const;

export interface JourneyEntry {
  id: string;
  /** Short place-in-the-kitchen label shown above the role. */
  kind: string;
  role: string;
  org: string;
  place?: string;
  dates: string;
  points: string[];
  /** Ingredient ids this role used; each links into the pantry. */
  ingredients: string[];
  /** Recipe this role is also told as. */
  recipeId?: string;
  /** Shown as a handwritten reminder until confirmed. */
  draft?: string;
}

/** Most recent first, so a recruiter sees the latest kitchen straight away. */
export const journey: JourneyEntry[] = [
  {
    id: "globe",
    kind: "Professional kitchen",
    role: "AI Practitioner Intern",
    org: "Globe Telecom",
    dates: "November 2025 – February 2026",
    points: [
      "Designed and built RAG-based automation workflows in n8n: reusable AI solutions adopted by 2+ cross-functional teams, saving 5+ hours of manual work per week.",
      "Deployed and configured n8n task runners on Google Cloud, resolving infrastructure and configuration issues to restore code-node functionality across 10+ existing production workflows after a platform migration.",
      "Load tested with Apache JMeter at up to 200 concurrent virtual users, finding and fixing reliability and performance bottlenecks ahead of production release.",
    ],
    ingredients: ["n8n", "rag", "gcp", "load-testing", "gemini", "notebooklm"],
    recipeId: "globe",
  },
  {
    id: "mac",
    kind: "Community kitchen",
    role: "Industry Director",
    org: "Monash Association of Coding",
    dates: "September 2024 – October 2025",
    points: [
        "Led a team in planning and delivering a networking event for 250+ attendees and 11 industry partners, delegating responsibilities and adapting to last-minute changes."
    ],
    ingredients: ["collaboration"],
  },
  {
    id: "dashlabs",
    kind: "First kitchen",
    role: "Knowledge Enterprise and Management Engineering Intern",
    org: "Dashlabs.ai",
    dates: "October 2023 – January 2024",
    points: [
      "Developed and deployed 15+ responsive HTML/CSS web forms for laboratory and patient services, working with supervisors and fellow interns in an Agile environment to incorporate feedback, refine solutions and meet user requirements.",
    ],
    ingredients: ["collaboration"],
  },
];

export const education = {
  school: "Monash University",
  degree: "Bachelor of Computer Science",
  place: "Clayton",
  dates: "Completed December 2026",
  coursework: [
    "Data Structures and Algorithms (Python)",
    "Object-Oriented Design and Implementation (Java)",
    "Database Systems",
    "Full Stack Development",
    "iOS App Development",
    "Distributed Systems and Cloud Computing",
    "Parallel Computing",
  ],
} as const;

export const notes = {
  heading: "Beyond the kitchen and the keyboard.",
  story: {
    title: "Tuna crudo, gochujang mayo",
    paragraphs: [
      "When I was working on a tuna crudo with gochujang mayo, I kept adjusting the ratio of mayonnaise to gochujang until I was happy with it. Taste, change one thing, taste again.",
      "That loop is the part of software I enjoy most: change one thing, check what happened, and go round again.",
    ],
    image: { label: "Tuna crudo with gochujang mayo", size: "1200 × 1500", need: "Your own photo of the dish" },
  },
  observations: [
    {
      title: "Under the surface",
      body: "I’d rather know why something works than only that it does.",
      more: "EcoGuard’s duplicate check is a good example. A conditional write isn’t a fancier version of “check, then write”. It closes a gap that the simple version leaves open.",
    },
    {
      title: "Unfamiliar tools",
      body: "Swift and SwiftUI for Happs, n8n at Globe Telecom. Both started as things I hadn’t used.",
      more: "I learn a tool fastest by building something real with it and reading the docs when I get stuck.",
    },
    {
      title: "Practical things",
      body: "Happs started from an everyday problem: organising spontaneous hangouts at university.",
      more: "I like starting from a problem a real person has, then working out which parts of the stack it needs.",
    },
    {
      title: "How parts fit together",
      body: "EcoGuard’s pipeline had to hand files cleanly to an ML tagging service running on another cloud.",
      more: "Most of the interesting problems were at the joins: what each side promises the other, and who is allowed to call whom.",
    },
    {
      title: "Working with people",
      body: "EcoGuard was a team project, and at Dashlabs.ai I worked with supervisors and other interns in an Agile team.",
      more: "I like shared contracts. When the interface between two pieces is written down, two people can work in parallel without stepping on each other.",
    },
  ],
  draft:
    "This chapter is a draft in your voice. The crudo story comes from your brief and the rest from your resume. Please rewrite anything that doesn’t sound like you, and add real stories where you have them.",
} as const;

export const contactCopy = {
  heading: "The next course.",
  body: "If something here made you curious, I’d like to hear from you.",
} as const;
