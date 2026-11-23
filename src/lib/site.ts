import { projects, type Project } from "./data";
import { contact } from "./contact";

/**
 * The canonical site URL, used for metadata, the sitemap and social previews.
 * Set NEXT_PUBLIC_SITE_URL once you have a custom domain. On Vercel it falls back to the
 * production domain Vercel assigns, and locally to http://localhost:3000.
 */
export const siteUrl: string = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

export const siteTitle = "Rafael Abes";
export const siteDescription =
  "The software engineering portfolio of Rafael Abes, laid out as a cookbook: a pantry of skills and a book of project recipes.";

/**
 * A recipe is only indexed by search engines once it has real content.
 * Skeleton recipes (no contributions or method written yet) stay reachable but are marked noindex.
 */
export function isComplete(p: Project): boolean {
  return p.contributions.length > 0 && p.method.length > 0;
}

export const indexableProjects = projects.filter(isComplete);

export const sameAs = [contact.linkedin, contact.github].filter((x): x is string => !!x).map((x) => `https://${x}`);
