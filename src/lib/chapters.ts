/**
 * Chapters of the book, in reading order. Each chapter is its own page (`href`); "intro" shares the
 * home page with the contents and is reached by anchor, so it has no entry of its own in the nav.
 * The chef's notes chapter is intentionally left out for now (see components/ChefNotes.tsx).
 */
export const chapters = [
  { id: "contents", label: "Contents", title: "Contents", href: "/", nav: true },
  { id: "intro", label: "Intro", title: "A little introduction", href: "/#intro", nav: false },
  { id: "pantry", label: "Pantry", title: "The pantry", href: "/pantry", nav: true },
  { id: "recipes", label: "Recipes", title: "The recipes", href: "/recipes", nav: true },
  { id: "journey", label: "Experience", title: "The experience", href: "/experience", nav: true },
  { id: "contact", label: "Contact", title: "The next course", href: "/contact", nav: true },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];

export const chapterById = (id: string) => chapters.find((c) => c.id === id);

/** The path part of a chapter's href, without any #anchor. */
export const chapterPath = (id: string) => chapterById(id)?.href.split("#")[0] ?? "/";

/** True for an ordinary left click, so ctrl/cmd/middle-click can still open a link in a new tab. */
export function isPlainClick(e: { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean }) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

export function chapterTitle(id: string): string {
  return chapterById(id)?.title ?? "";
}