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

  if (!ready) return null;

  return (
    <>
      {phase === "closed" && <BookCover />}
      <ChapterNav />
      <main>
        <TableOfContents />
        <Intro />
        <Pantry />
        <RecipeCollection />
        <ChefJourney />
        {/* <ChefNotes /> */}
        <ContactSection />
      </main>
      <footer className="border-t border-rule/40 px-5 py-10 text-center">
        <p className="serif italic text-2xl">There’s always another recipe in development.</p>
        <p className="eyebrow mt-3">Rafael Abes · Vol. 01 · Prototype</p>
      </footer>
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