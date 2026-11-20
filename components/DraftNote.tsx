import { SHOW_DRAFT_MARKERS } from "@/lib/data";

/**
 * A handwritten reminder that something needs Rafael's attention before the site goes live.
 * Renders nothing once SHOW_DRAFT_MARKERS is switched off.
 */
export function DraftNote({ children }: { children: React.ReactNode }) {
  if (!SHOW_DRAFT_MARKERS) return null;
  return <p className="hand text-lg text-terra-deep leading-tight -rotate-1 max-w-prose">{children}</p>;
}