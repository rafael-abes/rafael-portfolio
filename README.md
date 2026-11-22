# Portfolio Website

An interactive cookbook-style software engineering portfolio. Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion.

Status: **Phase 3** (cover, contents, pantry, recipes, tasting menu with receipt print/download, page-turn navigation, marginal notes). See `PLAN.md` for the design plan, content status and remaining phases.

## Requirements

- Node.js 20 or newer

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
```

The cover is skipped on repeat visits (stored in `localStorage`). Use the "À la Rafael" title in the nav to return to it, or clear site data.

## Build

```bash
npm run lint       # type-check (tsc --noEmit)
npm run build
npm start          # serve the production build
```

## Where things live

| Path | Purpose |
|---|---|
| `lib/data.ts` | All content: categories, ingredients, projects. Edit here, not in components. |
| `lib/contact.ts` | Email, LinkedIn, GitHub, resume link (all empty until supplied) |
| `lib/receipt.ts` / `components/Receipt.tsx` | Receipt text and on-screen/print receipt, built from the selection |
| `components/PageTurn.tsx` | Chapter-to-chapter page-turn transition |
| `components/Annotation.tsx` | Handwritten marginal notes |
| `components/BookState.tsx` | Shared client state (cover, pantry selection, open recipe, tasting menu) |
| `components/BookCover.tsx` | Cover and opening animation |
| `components/Pantry.tsx` | Jars, multi-select filter, ingredient card |
| `components/RecipeCollection.tsx` / `RecipePage.tsx` | Recipe index and recipe sheet with tabs |
| `components/ProjectArchitecture.tsx` | EcoGuard architecture diagram (SVG) |
| `app/globals.css` | Design tokens, grain texture, jar styling |

## Before publishing

- Set `SHOW_DRAFT_MARKERS = false` in `lib/data.ts` to hide the handwritten "verify" notes.
- Resolve every "verify" item listed in `PLAN.md`.
- Replace the image placeholders with real screenshots and diagrams.

## Environment variables

None.

## Deploying to Vercel

1. Push the repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Framework preset: Next.js (auto-detected). Leave the build command and output directory at their defaults.
4. Deploy. Every push to the main branch redeploys.

Or from the CLI: `npx vercel` (preview) and `npx vercel --prod`.
