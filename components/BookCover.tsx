"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useBook } from "./BookState";

/** A line-drawn plate and sprig. A real food photograph should replace this (see PLAN.md). */
function Plate() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" role="img" aria-label="Line drawing of a plate with a sprig of herbs">
      <g fill="none" stroke="#f5f0e6" strokeWidth="1.2" strokeLinecap="round">
        <circle cx="100" cy="100" r="86" opacity="0.9" />
        <circle cx="100" cy="100" r="70" opacity="0.5" />
        <circle cx="100" cy="100" r="46" opacity="0.35" />
        <path d="M70 128 C 92 104, 112 90, 134 70" />
        {[
          [84, 114, 74, 104],
          [94, 106, 90, 92],
          [104, 98, 116, 100],
          [114, 88, 112, 74],
          [122, 80, 134, 82],
          [92, 112, 104, 120],
          [106, 100, 98, 88],
        ].map(([x1, y1, x2, y2], i) => (
          <path key={i} d={`M${x1} ${y1} Q ${(x1 + x2) / 2 + 4} ${(y1 + y2) / 2 - 4} ${x2} ${y2}`} />
        ))}
      </g>
    </svg>
  );
}

export function BookCover() {
  const { openBook } = useBook();
  const reduce = useReducedMotion();
  const [opening, setOpening] = useState(false);

  const open = () => {
    if (reduce) {
      openBook();
      return;
    }
    setOpening(true);
  };

  // Enter or Space opens the book straight away, without having to Tab to the cover first.
  // Only when nothing is focused: a focused button (cover or skip) handles its own key.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && !opening && document.activeElement === document.body) {
        e.preventDefault();
        open();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opening, reduce]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-ivory flex items-center justify-center p-4"
      initial={{ opacity: 1 }}
      animate={{ opacity: opening ? 0 : 1 }}
      transition={{ duration: 0.4, delay: opening ? 0.75 : 0, ease: "easeOut" }}
      onAnimationComplete={() => {
        if (opening) openBook();
      }}
    >
      <button
        type="button"
        onClick={openBook}
        className="absolute top-4 right-4 eyebrow ulink px-1 py-2"
      >
        Skip intro →
      </button>

      <div className="relative" style={{ perspective: "1600px" }}>
        <div className="relative w-[min(84vw,24rem)] aspect-[5/7]">
          {/* The first page, revealed as the cover swings open */}
          <div className="absolute inset-0 bg-paper book-shadow rounded-r-sm flex flex-col justify-center px-8" aria-hidden="true">
            <p className="eyebrow mb-4">Contents</p>
            {["A little introduction", "The pantry", "The recipes", "The experience", "The chef’s notes", "The next course"].map(
              (t, i) => (
                <div key={t} className="flex gap-3 items-baseline border-b border-rule/40 py-2">
                  <span className="text-xs text-stone tabular-nums">0{i + 1}</span>
                  <span className="serif text-lg">{t}</span>
                </div>
              ),
            )}
          </div>

          {/* The cover */}
          <motion.button
            type="button"
            onClick={open}
            aria-label="Open the cookbook"
            className="cover-cloth book-shadow absolute inset-0 rounded-r-sm text-left text-ivory overflow-hidden focus-visible:outline-offset-8"
            style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
            animate={{ rotateY: opening ? -112 : 0 }}
            whileHover={opening || reduce ? undefined : { rotateY: -7 }}
            transition={{ duration: opening ? 0.9 : 0.35, ease: [0.22, 0.7, 0.2, 1] }}
          >
            <span className="absolute inset-3 border border-ivory/40 pointer-events-none" aria-hidden="true" />
            <span className="absolute left-0 top-0 bottom-0 w-3 bg-black/15" aria-hidden="true" />

            <span className="relative flex flex-col h-full px-7 sm:px-8 pt-9 pb-9">
              <span className="eyebrow !text-ivory/70 flex justify-between">
                <span>Vol. 01</span>
                <span>2026</span>
              </span>

              <span className="mt-6 block">
                <span className="block eyebrow !text-ivory/80 tracking-[0.5em]">À LA</span>
                <span className="serif block text-[4.6rem] leading-[0.9] italic -ml-1">Rafael</span>
              </span>

              <span className="mt-5 mx-auto w-[58%] aspect-square block opacity-95">
                <Plate />
              </span>

              <span className="mt-auto">
                <span className="serif italic block text-lg leading-snug text-ivory/95 max-w-[17rem]">
                  A collection of ingredients, experiments and things I’ve built.
                </span>
                <span className="block mt-4 text-[0.7rem] tracking-[0.28em] uppercase font-medium">Rafael Abes</span>
                <span className="block text-[0.58rem] tracking-[0.14em] sm:tracking-[0.2em] uppercase text-ivory/75 mt-1 leading-relaxed">
                  Personal portfolio · Software engineering
                </span>
              </span>
            </span>
          </motion.button>
        </div>

        <p className="hand text-terra-deep text-2xl text-center mt-8 select-none">
          {opening ? " " : "tap the cover to open ↑"}
        </p>
      </div>
    </motion.div>
  );
}