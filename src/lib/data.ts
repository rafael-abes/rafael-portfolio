/**
 * Single source of truth for portfolio content.
 *
 * Relationships live in ONE direction only: each project lists the ingredient
 * ids it used. Ingredient -> project lookups are derived (see helpers below),
 * so the two directions can never drift apart.
 *
 * Everything here comes from the project brief or Rafael's stated resume
 * details. Anything inferred is flagged with `verify` so it can be confirmed
 * before publication. Nothing is invented: no metrics, durations, user numbers
 * or links.
 */

/** Set to false before publishing to hide the "verify" pencil markers. */
export const SHOW_DRAFT_MARKERS = true;

export type CategoryId =
  | "languages"
  | "backend"
  | "cloud"
  | "data"
  | "ai"
  | "qualities";

export interface Category {
  id: CategoryId;
  name: string;
  // blurb: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category: CategoryId;
  /** What this ingredient represents in my work. */
  represents: string;
  /** Short practical example, only where the brief supports one. */
  example?: string;
}

export interface MethodStep {
  title: string;
  body: string;
  /** Inferred detail that needs Rafael's confirmation. */
  verify?: string;
  /**
   * Handwritten marginal note: a short prompt plus a longer explanation of how
   * the technique works. These explain the technique in general terms; they do
   * not claim anything about outcomes or about Rafael's reasoning.
   */
  note?: { hint: string; more: string };
}

export interface Placeholder {
  label: string;
  size: string;
  need: string;
}

export interface Project {
  id: string;
  number: string;
  name: string;
  workingTitle?: string;
  kind: "project" | "experience";
  category: string;
  summary: string;
  role: string;
  /** Real duration only. null = not yet supplied. */
  duration: string | null;
  ingredients: string[];
  contributions: string[];
  method: MethodStep[];
  techniques: { title: string; body: string }[];
  deliverables: string[];
  placeholders: Placeholder[];
  /** Chef's notes are Rafael's own reflections: left empty until written. */
  notes: string[];
  links: { github?: string; live?: string };
  verify: string[] | null | undefined;
}

export const categories: Category[] = [
  { id: "languages", name: "Languages" },
  { id: "backend", name: "Backend & application" },
  { id: "cloud", name: "Cloud infrastructure" },
  { id: "data", name: "Databases & data" },
  { id: "ai", name: "AI & machine learning" },
  // { id: "qualities", name: "Engineering qualities", blurb: "The things that aren't on a package label." },
];

export const ingredients: Ingredient[] = [
  // Languages
  { id: "python", name: "Python", category: "languages", represents: "My default for backend services, data pipelines and ML-adjacent work.", example: "Ingestion logic for the EcoGuard pipeline and the FastAPI inference service in SmartPark." },
  { id: "swift", name: "Swift", category: "languages", represents: "Native iOS development.", example: "The whole of Happs, written in Swift with SwiftUI." },
  { id: "java", name: "Java", category: "languages", represents: "Object-oriented foundations from my degree." },
  { id: "js-ts", name: "JavaScript / TypeScript", category: "languages", represents: "Web and Node work, including this site." },
  { id: "sql", name: "SQL", category: "languages", represents: "Relational querying and schema design." },

  // Backend & application
  { id: "swiftui", name: "SwiftUI", category: "backend", represents: "Declarative UI for the Happs iOS app." },
  { id: "fastapi", name: "FastAPI", category: "backend", represents: "Python web framework for service endpoints.", example: "The inference service that wraps the YOLO model in SmartPark." },
  { id: "rest", name: "REST APIs", category: "backend", represents: "Service-to-service and client-to-service contracts.", example: "Shared contracts between components in the EcoGuard team project." },
  { id: "firebase", name: "Firebase", category: "backend", represents: "Authentication, data, storage and AI features behind Happs.", example: "Auth, Firestore, Storage and Firebase AI all used in Happs." },
  { id: "node", name: "Node.js", category: "backend", represents: "JavaScript on the server.", example: "The runtime behind Little Chef." },
  { id: "express", name: "Express", category: "backend", represents: "Minimal Node web framework for routes and APIs.", example: "The web layer of Little Chef." },

  // Cloud
  { id: "aws", name: "AWS", category: "cloud", represents: "Serverless building blocks for ingestion and processing.", example: "Lambda, S3, EventBridge, DynamoDB and Cognito in EcoGuard." },
  { id: "lambda", name: "AWS Lambda", category: "cloud", represents: "Event-driven compute for the processing steps." },
  { id: "s3", name: "Amazon S3", category: "cloud", represents: "Object storage where uploaded files land." },
  { id: "eventbridge", name: "EventBridge", category: "cloud", represents: "Routes upload events to the right processing." },
  { id: "cognito", name: "Cognito", category: "cloud", represents: "Machine-to-machine authentication between services." },
  { id: "sam", name: "AWS SAM", category: "cloud", represents: "Infrastructure defined as code for the serverless stack." },
  { id: "gcp", name: "Google Cloud", category: "cloud", represents: "Deploying and running services on GCP.", example: "SmartPark on GKE; n8n task runners during the Globe internship." },
  { id: "docker", name: "Docker", category: "cloud", represents: "Packaging services into containers.", example: "The SmartPark components." },
  { id: "kubernetes", name: "Kubernetes (GKE)", category: "cloud", represents: "Running and connecting containerised services.", example: "SmartPark: init containers pull the model artefacts before the service starts." },
  { id: "serverless", name: "Serverless architectures", category: "cloud", represents: "Designing around events instead of servers.", example: "EcoGuard's Lambda and EventBridge workflow." },

  // Databases & data
  { id: "dynamodb", name: "DynamoDB", category: "data", represents: "Key-based data modelling for files, checksums, tag indexes and subscriptions." },
  { id: "firestore", name: "Firestore", category: "data", represents: "Real-time synchronised data.", example: "Used to achieve live friend map sychronisation in Happs." },
  { id: "postgres", name: "PostgreSQL", category: "data", represents: "Relational storage.", example: "The database behind Little Chef." },
  { id: "data-modelling", name: "Data modelling", category: "data", represents: "Deciding what the tables or documents should look like before writing the code." },
  { id: "ingestion", name: "Data ingestion & processing", category: "data", represents: "Getting files in reliably, once." },

  // AI & ML
  { id: "rag", name: "RAG", category: "ai", represents: "Retrieval-augmented generation for internal knowledge retrieval.", example: "n8n-based RAG workflows used by multiple teams at Globe Telecom." },
  { id: "gemini", name: "Gemini", category: "ai", represents: "LLM features and Gemini Gems.", example: "Natural-language event creation in Happs; documentation work at Globe." },
  { id: "n8n", name: "n8n", category: "ai", represents: "Workflow automation tying AI to everyday tools." },
  { id: "notebooklm", name: "NotebookLM", category: "ai", represents: "Turning scattered process knowledge into usable documentation." },
  { id: "yolo", name: "YOLO", category: "ai", represents: "Object detection model for vehicles.", example: "Vehicle detection inside SmartPark." },
  { id: "ml-inference", name: "ML inference integration", category: "ai", represents: "Getting a trained model to run inside a real service." },
  { id: "load-testing", name: "Load testing", category: "ai", represents: "Checking a system holds up before and after it goes live.", example: "Locust for SmartPark; JMeter before a go-live at Globe." },

  // // Qualities
  // { id: "system-design", name: "System design", category: "qualities", represents: "Seeing how the components fit together." },
  // { id: "collaboration", name: "Collaboration", category: "qualities", represents: "Shared contracts and integration across a team." },
  // { id: "experimentation", name: "Experimentation", category: "qualities", represents: "Changing one thing, tasting, repeating." },
  // { id: "learning", name: "Independent learning", category: "qualities", represents: "Picking up unfamiliar tools to get something working." },
  // { id: "communication", name: "Technical communication", category: "qualities", represents: "Documentation that other people can actually use." },
];

export const projects: Project[] = [
  {
    id: "ecoguard",
    number: "01",
    name: "EcoGuard",
    workingTitle: "Cloud data ingestion pipeline",
    kind: "project",
    category: "Backend engineering · Cloud infrastructure",
    summary:
      "The AWS ingestion pipeline for EcoGuard, a team-built, multi-cloud serverless platform that identifies and tags invasive pests and pets in wildlife images and videos. Files come in, duplicates are caught, and processing is triggered without anyone polling for it.",
    role: "Ingestion pipeline and data lead",
    duration: "3 weeks",
    ingredients: ["python", "aws", "lambda", "s3", "eventbridge", "cognito", "sam", "dynamodb", "serverless", "ingestion", "data-modelling", "rest", "system-design", "collaboration"],
    contributions: [
      "Designed the DynamoDB structures for files, checksums, tag indexes and subscriptions.",
      "Implemented checksum-based duplicate detection using conditional writes.",
      "Built serverless workflows with Lambda and S3.",
      "Configured EventBridge to trigger processing for relevant uploads.",
      "Built secure service-to-service integration with Cognito machine-to-machine authentication.",
      "Wrote automated tests with Moto and configured least-privilege IAM policies.",
      "Contributed to the shared contracts used to integrate team components.",
    ],
    method: [
      { title: "The architecture", body: "A serverless pipeline on AWS: S3 for the files, EventBridge for routing, Lambda for processing, DynamoDB for state. The stack is defined with AWS SAM." },
      { title: "How uploads come in", body: "Clients upload through presigned URLs, so files go straight into S3, and that upload becomes the trigger for everything downstream." },
      { title: "How duplicates are caught", body: "Each file's SHA-256 checksum is verified and written to DynamoDB with a conditional write. If that checksum is already recorded, the write fails and the file is treated as a duplicate rather than being processed twice.", note: { hint: "why a conditional write?", more: "DynamoDB checks the condition and writes in one atomic step, so two uploads with the same checksum can't both get through. Checking first and writing second leaves a gap where both could." } },
      { title: "How processing is triggered", body: "EventBridge rules fire processing only for uploads that are relevant, so Lambda runs on events rather than on a schedule." },
      { title: "How data is indexed", body: "Separate DynamoDB structures hold files, checksums, tag indexes and subscriptions, so lookups by tag or subscriber don't mean scanning everything." },
      { title: "How services trust each other", body: "The pipeline hands files to the GCP-hosted ML tagging service, authenticating with Cognito machine-to-machine credentials. IAM policies are scoped to least privilege.", note: { hint: "why least privilege?", more: "Each function's policy lists only what it needs, so a mistake or a leaked credential in one place can only reach as far as that one policy allows." } },
      { title: "How it's tested", body: "Automated tests run against AWS services mocked with Moto, so the pipeline logic can be exercised without deploying.", note: { hint: "what does Moto do?", more: "Moto stands in for AWS inside the test process, so S3 and DynamoDB calls run against a fake rather than a real account. Tests run fast and cost nothing." } },
    ],
    techniques: [
      { title: "Conditional writes for deduplication", body: "Letting the database enforce uniqueness removes a read-then-write race." },
      { title: "Least-privilege IAM", body: "Each function gets only the permissions it needs." },
      { title: "Machine-to-machine auth", body: "Services authenticate as services, not as borrowed user sessions." },
    ],
    deliverables: [
      "Working ingestion pipeline integrated with the wider team's components.",
      "Automated test suite built on Moto.",
      "Shared integration contracts (contribution, alongside teammates).",
    ],
    placeholders: [
      { label: "Architecture diagram (final)", size: "1600 × 900", need: "Rafael's own draw.io / Excalidraw export of the real architecture" }
    ],
    notes: ["I learned first-hand how powerful serverless workflows and cloud infrastructure can be if implemented properly."],
    links: {},
    verify: [],
  },
  {
    id: "happs",
    number: "02",
    name: "Happs",
    workingTitle: "Campus social activities app",
    kind: "project",
    category: "iOS engineering · Application development",
    summary:
      "A campus social app that helps university students organise spontaneous activities and connect with friends, built end to end in SwiftUI on Firebase.",
    role: "iOS engineer",
    duration: "Ongoing",
    ingredients: ["swift", "swiftui", "firebase", "firestore", "gemini", "data-modelling"],
    contributions: [
      "SwiftUI application development.",
      "Firebase integration: Authentication, Firestore, Storage and Firebase AI.",
      "User and social data modelling, with real-time synchronisation.",
      "Firestore real-time listeners and transactions to keep shared event data consistent across concurrent users.",
      "Firebase Authentication and App Check.",
      "Location-aware media sharing with Core Location and Firebase Storage.",
      "Event creation and management, friend requests and invitations, notifications.",
      "Access controls and blocked-user safeguards.",
      "Gemini-powered natural-language event creation.",
      "Event recaps using Firebase Storage.",
    ],
    method: [
      { title: "Model the social graph first", body: "Users, friendships, invitations and events are shaped as Firestore data before any screens are built." },
      { title: "Build the app in SwiftUI", body: "Screens for creating and managing events, handling friend requests and responding to invitations." },
      { title: "Keep it live", body: "Real-time synchronisation so changes to an event show up for everyone involved." },
      { title: "Protect users", body: "Access controls and blocked-user safeguards decide who can see and reach whom." },
      { title: "Add natural-language event creation", body: "Gemini, through Firebase AI, turns a plain-language description into an event." },
      { title: "Let events be remembered", body: "Recaps use Firebase Storage for media attached to an event." },
    ],
    techniques: [
      { title: "Firebase as a single backend", body: "Auth, data, files and AI behind one SDK keeps the app's moving parts small." },
      { title: "Safeguards in the data layer", body: "Blocked-user rules are part of the design, not an afterthought." },
    ],
    deliverables: [
      "A working iOS application covering the event lifecycle, social features and AI-assisted event creation.",
    ],
    placeholders: [
      { label: "App screens (3–4)", size: "1170 × 2532 each", need: "Real screenshots from the app" },
      { label: "Data model diagram", size: "1600 × 900", need: "Firestore collections and relationships" },
    ],
    notes: ["A major challenge was working with all of the different Apple developer kits, as it was my first time developing an application in Swift. However by studying the documentation well and watching tutorials, it became a fun challenge to myself and I enjoyed building an application from scratch."],
    links: {},
    verify: [],
  },
  {
    id: "smartpark",
    number: "03",
    name: "SmartPark",
    workingTitle: "Parking detection on Google Cloud",
    kind: "project",
    category: "Machine learning · Cloud engineering",
    summary:
      "A computer-vision parking detection system: a YOLO model behind a FastAPI service, containerised and deployed on Google Kubernetes Engine.",
    role: "Inference service and cloud deployment",
    duration: "2 weeks",
    ingredients: ["python", "fastapi", "yolo", "ml-inference", "docker", "kubernetes", "gcp", "load-testing", "system-design"],
    contributions: [
      "Developed the FastAPI inference service.",
      "Integrated YOLO for vehicle detection.",
      "Containerised the application components.",
      "Deployed services on GKE.",
      "Retrieved model artefacts from Google Cloud Storage using Kubernetes init containers.",
      "Configured inter-service communication.",
      "Performance-tested with Locust.",
    ],
    method: [
      { title: "Wrap the model in a service", body: "A FastAPI service receives images and returns YOLO vehicle detections." },
      { title: "Containerise", body: "Each component is packaged with Docker so it runs the same everywhere." },
      { title: "Keep the model out of the image", body: "Model artefacts live in Google Cloud Storage; a Kubernetes init container fetches them before the service starts.", note: { hint: "why an init container?", more: "Init containers run to completion before the main container starts, so the model is already on disk when the service comes up. Swapping in a new model doesn't mean rebuilding the image." } },
      { title: "Deploy on GKE", body: "Services are deployed to Google Kubernetes Engine and wired together for inter-service communication." },
      { title: "Test under load", body: "Locust drives traffic at the deployed service to see how it performs.", note: { hint: "how does Locust work?", more: "Locust describes simulated users as Python code and ramps up how many run at once against a live endpoint, so you can watch response times as the load climbs." } },
    ],
    techniques: [
      { title: "Init containers for model artefacts", body: "Separates model versioning from the container image." },
      { title: "Load testing a model service", body: "Inference is the expensive part, so it's the part worth hammering." },
    ],
    deliverables: [
      "A deployed, containerised inference system on GKE.",
      "Locust load-test scenarios.",
    ],
    placeholders: [
      { label: "Deployment diagram", size: "1600 × 900", need: "GKE services, init container and GCS flow" },
      { label: "Detection output", size: "1200 × 800", need: "A real detection frame from the system" },
      { label: "Locust results", size: "1200 × 700", need: "Screenshot of the load-test report" },
    ],
    notes: ["Once again, I learned the importance of building to scale. During development, my initial test results showed a bottleneck which I worked through to achieve a more stable service."],
    links: {},
    verify: [],
  },
  {
    id: "littlechef",
    number: "04",
    name: "Little Chef",
    workingTitle: "Node, Express and PostgreSQL",
    kind: "project",
    category: "Backend engineering · Web application",
    summary: "A web application built on Node, Express and PostgreSQL. Interactive front end built on top of a CRON job web scraper backend, used as a tool to make the process of selecting a recipe to cook easier.",
    role: "Full stack developer",
    duration: "Ongoing",
    ingredients: ["js-ts", "node", "express", "postgres", "sql", "rest", "data-modelling"],
    contributions: [
      "Engineered a full-stack platform in Node.js/Express.js with an automated data pipeline (Cheerio, node-cron), applying clean API design and modular architecture principles",
      "Designed a fuzzy search feature (pg_trgm, GIN index) for typo-tolerant querying, backed by a RESTful API deployed via Cloudflare and Railway",
    ],
    method: [],
    techniques: [],
    deliverables: [],
    placeholders: [
      { label: "App screens (3–4)", size: "1440 × 900 each", need: "coming soon." },
      { label: "Schema diagram", size: "1600 × 900", need: "coming soon." },
    ],
    notes: ["A passion project of mine meant to solve a problem that I face too often: figuring out what to cook for lunch/dinner."],
    links: {},
    verify: [],
  }
];

/* ---------- derived lookups ---------- */

export const ingredientById = new Map(ingredients.map((i) => [i.id, i]));
export const projectById = new Map(projects.map((p) => [p.id, p]));

export function projectsFor(ingredientId: string): Project[] {
  return projects.filter((p) => p.ingredients.includes(ingredientId));
}

/** Projects that use EVERY one of the selected ingredients. */
export function projectsMatching(selected: string[]): Project[] {
  if (selected.length === 0) return projects;
  return projects.filter((p) => selected.every((id) => p.ingredients.includes(id)));
}

export function ingredientName(id: string): string {
  return ingredientById.get(id)?.name ?? id;
}
