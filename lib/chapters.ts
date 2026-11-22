/** Chapters that exist in the book today. Used by the nav and the page-turn transition. */
export const chapters = [
  { id: "contents", label: "Contents", title: "Contents" },
  { id: "intro", label: "Intro", title: "A little introduction" },
  { id: "pantry", label: "Pantry", title: "The pantry" },
  { id: "recipes", label: "Recipes", title: "The recipes" },
  { id: "journey", label: "Experience", title: "The experience" },
  { id: "notes", label: "Notes", title: "The chef’s notes" },
  { id: "contact", label: "Contact", title: "The next course" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];

/** True for an ordinary left click, so ctrl/cmd/middle-click can still open a link in a new tab. */
export function isPlainClick(e: { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean }) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

export function chapterTitle(id: string): string {
  return chapters.find((c) => c.id === id)?.title ?? "";
}