import { Book } from "@/src/components/(book)/Book";

/**
 * Every chapter page shares this layout, so the cover, nav, tasting menu and pantry selection
 * stay mounted as you move between pages. Each page file below renders just its own chapter.
 */
export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <Book>{children}</Book>;
}