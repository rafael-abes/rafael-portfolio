"use client";

import { useEffect } from "react";
import { BookStateProvider, useBook } from "./BookState";
import { BookCover } from "./BookCover";
import { ChapterNav } from "../nav/ChapterNav";
import { Intro } from "../Intro";
import { TableOfContents } from "../TableOfContents";
import { Pantry } from "../misc/Pantry";
import { RecipeCollection } from "../recipe/RecipeCollection";
import { RecipePage } from "../recipe/RecipePage";
import { TastingMenu } from "../TastingMenu";
import { PageTurn } from "../nav/PageTurn";
import { ChefJourney } from "../chef/ChefJourney";
import { ChefNotes } from "../chef/ChefNotes";
import { ContactSection } from "../ContactSection";

function BookInner() {
  const { ready, phase, openProjectId, menuOpen } = useBook();

  // Lock page scroll behind the cover and any open overlay.
  const locked = phase === "closed" || openProjectId !== null || menuOpen;
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
    if (ready && phase === "closed") sawCover.current = true;
    if (phase !== "closed" && sawCover.current) {
      sawCover.current = false;
      document.getElementById("contents-title")?.focus({ preventScroll: true });
    }
  }, [ready, phase]);

  // Everything behind the cover or an open overlay is inert: it can't be tabbed into, clicked,
  // or read by a screen reader while it is covered.
  const background = phase === "closed" || openProjectId !== null || menuOpen;

  return (
    <>
      {phase === "closed" && <BookCover />}
      <div inert={ready && background}>
        <a
          href="#main"
          className="eyebrow sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:bg-ink focus:!text-ivory focus:px-4 focus:py-3"
        >
          Skip to content
        </a>
        <ChapterNav />
        <main id="main" tabIndex={-1} className="outline-none">
          <TableOfContents />
          <Intro />
          <Pantry />
          <RecipeCollection />
          <ChefJourney />
          <ContactSection />
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

export function Book() {
  return (
    <BookStateProvider>
      <BookInner />
    </BookStateProvider>
  );
}