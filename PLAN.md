# À la Rafael: design and content plan (Phase 1)

## Design direction

**One idea:** a contemporary independent cookbook, translated into an interactive page. Chef Masa's restraint (generous space, quiet colour, one thing at a time) set the tone. Josh Kern-style expressive type and small personal details (handwritten notes, tilted labels) set the personality.

Note on research: the two reference sites could not be fetched directly from this environment (the fetch tool only opens URLs that already appeared in search results, and search surfaced masanyc.com rather than chefmasanyc.com, and nothing usable for kernjosh.com). The direction above is taken from your brief's description of them plus what search returned about Masa's restaurant site (shibui philosophy, ingredient-first copy, monotone grainy photography). Worth sending screenshots of anything specific you want matched.

| Decision | Choice | Why |
|---|---|---|
| Background | Warm ivory `#F5F0E6`, paper `#FAF8F2` for "pages" | Cookbook stock, not screen white |
| Text | Ink `#24231F`, brown `#514439` | Soft but high contrast |
| Accents | Olive (cover, "on your menu"), terracotta (selection, handwriting) | Never both loud at once |
| Metadata colour | Deepened to `#6E675C`; the suggested warm grey `#AAA398` is kept for rules only | The original fails contrast as text |
| Serif | Instrument Serif (headings, names, numerals) | Tall, editorial, one weight |
| Sans | DM Sans | Quiet and readable at small sizes |
| Hand | Caveat, sparingly | Marginalia only: notes, prompts, "verify" flags |
| Texture | One fixed SVG-noise grain layer, 7% opacity | No image downloads, no layout cost |

**Metaphor mapping, as built:** cover → contents → pantry (jars on shelves, not a logo grid) → recipes (an index of dishes, not cards) → recipe page with Ingredients / Method / Finished dish.

## Architecture decisions

- Next.js 15 App Router, TypeScript, Tailwind 4, Framer Motion. Fonts come from `@fontsource` packages so they bundle with the build (no runtime Google Fonts request).
- `lib/data.ts` is the single source of content. **Relationships are stored once**: each project lists its ingredient ids, and ingredient → project lookups are derived. Both directions of the pantry/recipe interaction read from that, so they cannot disagree. (This deliberately differs from the brief's "each ingredient references project IDs", which would duplicate every link.)
- `components/BookState.tsx` is the shared client state: cover phase, ingredient selection, hover/open project, tasting menu. The menu and "visited" flag persist in `localStorage` (wrapped in try/catch).
- Everything interactive is a client component; the page shell stays a server component.

## Built in this prototype

1. **Cover**: cloth-style olive cover, CSS 3D swing on a left hinge, first page revealed behind it. Click, Enter or Space opens it. "Skip intro" is always visible. Reduced motion opens instantly. Returning visitors skip it.
2. **Contents**: numbered tasting-menu list. Chapters not built yet are shown as inactive and labelled, not as dead links.
3. **Pantry**: 6 shelves, 38 jars. Multi-select with AND filtering, a live "N of 4 recipes use X + Y" bar, reset, and an ingredient card (what it represents, example, where used). Hovering a recipe lights up its ingredients on the shelves.
4. **Recipe page**: slide-in sheet with focus trap, Esc to close, arrow-key tabs. Chef's role, prep time and contributions stay visible above the tabs. Ingredient names jump back to the pantry. EcoGuard has an architecture diagram.
5. **Tasting menu**: add/remove from recipe rows and the recipe page, persistent count in the nav, drawer with remove and clear.

## Built in Phase 3

1. **Receipt**: generated from the visitor's actual selection, in the order they chose. "Print or save as PDF" prints the receipt alone (a print-only copy mounted under `<body>`; everything else is hidden by print CSS). "Download .txt" builds a plain-text slip from the same data (`lib/receipt.ts`). Missing contact details show as an on-screen reminder only and never reach the print or the download.
2. **Page-turn navigation**: nav, contents, recipe-sheet and tasting-menu links now sweep a sheet of paper across (about 0.6s, never blocks clicks) and update the URL hash. Reduced motion jumps instantly. Ctrl/cmd-click still opens normally.
3. **Chef's annotations**: handwritten marginal notes on method steps, as real disclosure buttons (keyboard and screen-reader friendly). Six are in, each explaining how a technique works in general terms (why a conditional write, why an init container, and so on). None claims an outcome or your reasoning; your own reflections stay in the Chef's notes, which are still yours to write.
4. **Cover**: Enter or Space now opens the book even before anything is focused.

**Deliberately not built yet:** the image lightbox. There are no real images to enlarge, and a lightbox around labelled placeholders would be decoration. It goes in with the real screenshots in Phase 4.

## Content status: what is verified and what is not

Everything in `lib/data.ts` comes from your brief or your stated resume details. Items that I inferred are flagged in the UI with a red handwritten **verify:** note (switch them all off with `SHOW_DRAFT_MARKERS = false` in `lib/data.ts`).

**Needs your confirmation**
- EcoGuard: real project name, duration, which parts the wider team built, and the actual service flow. The diagram is drawn from the brief and marked as a draft. I assumed uploads land in S3 and that a rejected duplicate is simply not processed twice.
- Happs, SmartPark: durations, team vs solo, and the "why Firebase" reasoning for the case study.
- Globe Telecom: dates (Nov 2025 – Feb 2026) and the n8n-on-GCP detail came from your saved profile; confirm what is fine to show publicly.
- Pantry staples with no linked project: Java, JavaScript/TypeScript, SQL, PostgreSQL, REST APIs beyond EcoGuard. Say where each was really used, or they stay as "pantry staple".
- Not included yet, though they're on your resume: Little Chef (Node/Express/PostgreSQL), Tiger Tutor. Say whether either should be a recipe.

**Nothing invented:** no metrics, user counts, awards, repo links or live links appear anywhere. Chef's notes are left as a visible "still to be written" because those need to be in your voice.

## Assets needed from you

| Asset | Size | Used for |
|---|---|---|
| Resume (PDF) | n/a | Resume link, experience chapter, verifying dates |
| Cover photograph (your own food photo) | 1200 × 1680 | Replaces the line-drawn plate on the cover |
| Happs screenshots (3–4) | 1170 × 2532 each | Happs finished dish |
| SmartPark: detection frame, Locust report, deployment diagram | 1200 × 800, 1200 × 700, 1600 × 900 | SmartPark finished dish |
| EcoGuard: real architecture diagram, test run output | 1600 × 900, 1200 × 700 | Replaces my draft diagram |
| Globe: sanitised n8n workflow screenshot | 1600 × 900 | Only if shareable |
| Cooking photos (tuna crudo, kitchen, notebook) | 1600 wide | Chef's notes chapter |
| LinkedIn and GitHub URLs, contact email, resume link | n/a | Fill in `lib/contact.ts`: the receipt and contact chapter pick them up automatically |

## Remaining phases

- **Phase 3 (done):** receipt with print/download, page-turn chapter transitions, chef's annotations. Image lightbox moves to Phase 4.
- **Phase 4:** introduction, experience and education (from your resume), chef's notes, contact, real content and images.
- **Phase 5–6:** tablet/mobile polish, accessibility audit, Lighthouse pass.
- **Phase 7:** Vercel deployment (steps in README).

## Phase 4 progress (content from the resume)

**Decisions:** Little Chef is a recipe (04). Tiger Tutor is left out. Globe Telecom is now 05.

**Now verified against the resume:** EcoGuard's name, SHA-256 checksums, presigned-URL uploads, GCP-hosted ML tagging called through Cognito; Happs' Firestore listeners and transactions, App Check, Core Location media sharing; Globe's figures (2+ teams, 5+ hours/week, 10+ workflows, up to 200 JMeter users); contact email, LinkedIn and GitHub (phone number deliberately not published).

**Needs your input (also shown as red handwriting on screen while `SHOW_DRAFT_MARKERS` is on):**
- **Little Chef:** only the stack (Node, Express, PostgreSQL) is known. What it does, your role, how it was built, duration, screenshots and GitHub link are all unwritten. Its sections show "still to write" markers rather than invented text.
- **SmartPark:** not on the supplied resume. Confirm it should be featured and that the description is right.
- **Happs:** the resume mentions using Claude Code with every change reviewed. Decide whether the recipe says so too.
- **Resume link:** no public URL yet. Add a PDF under `/public` and set `resume` in `lib/contact.ts`.
- **Still to build:** Chef's journey (Globe, Dashlabs.ai, Monash with the real coursework list), Chef's notes, contact chapter, real images and the lightbox.
