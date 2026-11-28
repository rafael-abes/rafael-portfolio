"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { BookStateProvider, useBook } from "./BookState";
import { BookCover } from "./BookCover";
import { ChapterNav } from "../nav/ChapterNav";
import { RecipePage } from "../recipe/RecipePage";
import { TastingMenu } from "../TastingMenu";
import { PageTurn } from "../nav/PageTurn";

/**
 * The shell shared by every chapter page: cover, nav, footer and the overlays (recipe sheet,
 * tasting menu, page-turn). It lives in app/(book)/layout.tsx, so it stays mounted while you move
 * between chapters. That is what keeps the tasting menu and pantry selection alive across pages.
 */
function BookInner({ children }: { children: React.ReactNode }) {
  const { ready, phase, openProjectId, menuOpen } = useBook();
  const pathname = usePathname();

  // The cover only exists on the home page.
  const coverShown = phase === "closed" && pathname === "/";

  // Lock page scroll behind the cover and any open overlay.
  const locked = coverShown || openProjectId !== null || menuOpen;
  useEffect(() => {
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);

  // After the cover opens, move focus to the first heading so keyboard and screen-reader users
  // land in the book rather than nowhere. Returning visitors (no cover) are not interrupted.
  const sawCover = useRef(false);
  useEffect(() => {
    if (ready && coverShown) sawCover.current = true;
    if (!coverShown && sawCover.current) {
      sawCover.current = false;
      document.getElementById("contents-title")?.focus({ preventScroll: true });
    }
  }, [ready, coverShown]);

  // When a new chapter page opens, move focus to the top of it so keyboard users start there and
  // screen readers announce the change. Skipped on the first load.
  const firstPath = useRef(pathname);
  useEffect(() => {
    if (pathname === firstPath.current) return;
    firstPath.current = pathname;
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      {coverShown && <BookCover />}
      {/* Everything behind the cover or an open overlay is inert: it can't be tabbed into, clicked,
          or read by a screen reader while it is covered. */}
      <div inert={ready && locked} className="min-h-screen flex flex-col">
        <a
          href="#main"
          className="eyebrow sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:bg-ink focus:!text-ivory focus:px-4 focus:py-3"
        >
          Skip to content
        </a>
        <ChapterNav />
        <main id="main" tabIndex={-1} className="outline-none flex-1">
          {children}
        </main>
        <footer className="border-t border-rule/40 px-5 py-10 text-center">
          <p className="serif italic text-2xl">There’s always another recipe in development.</p>
          <p className="eyebrow mt-3">Rafael Abes · Vol. 01</p>
        </footer>
      </div>
      <RecipePage />
      <TastingMenu />
      <PageTurn />
    </>
  );
}

export function Book({ children }: { children: React.ReactNode }) {
  return (
    <BookStateProvider>
      <BookInner>{children}</BookInner>
    </BookStateProvider>
  );
}