"use client";

import { useEffect } from "react";
import { BookStateProvider, useBook } from "./BookState";
import { BookCover } from "./BookCover";
import { ChapterNav } from "./ChapterNav";
import { TableOfContents } from "./TableOfContents";
import { Pantry } from "./Pantry";
import { RecipeCollection } from "./RecipeCollection";
import { RecipePage } from "./RecipePage";
import { TastingMenu } from "./TastingMenu";
import { PageTurn } from "./PageTurn";

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
        <Pantry />
        <RecipeCollection />
      </main>
      <footer className="border-t border-rule/40 px-5 py-10 text-center">
        <p className="serif italic text-2xl">There’s always another recipe in development.</p>
        <p className="eyebrow mt-3">À la Rafael · Vol. 01 · Prototype</p>
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