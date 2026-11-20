"use client";

import { useEffect, useRef } from "react";
import { animate } from "framer-motion";
import { chapterTitle } from "@/lib/chapters";
import { useBook } from "./BookState";

/**
 * Page-turn transition between chapters: a sheet of paper sweeps across, the
 * scroll jumps while it covers the screen, then it sweeps away. About 0.6s in
 * total, never blocks clicks, and is skipped entirely under reduced motion
 * (BookState scrolls directly in that case).
 */
export function PageTurn() {
  const { turn, scrollToChapter, finishTurn } = useBook();
  const sheet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!turn || !sheet.current) return;
    const el = sheet.current;
    let live = true;

    (async () => {
      try {
        el.style.visibility = "visible";
        await animate(el, { x: ["100%", "0%"] }, { duration: 0.28, ease: [0.5, 0, 0.2, 1] });
        if (live) scrollToChapter(turn.id);
        await animate(el, { x: ["0%", "-100%"] }, { duration: 0.32, ease: [0.5, 0, 0.2, 1] });
      } finally {
        if (live) {
          el.style.visibility = "hidden";
          finishTurn();
        }
      }
    })();

    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn]);

  return (
    <div
      ref={sheet}
      aria-hidden="true"
      className="page-turn fixed inset-0 z-[55] pointer-events-none flex items-center justify-center bg-paper shadow-[-24px_0_40px_-18px_rgba(36,35,31,0.35)]"
      style={{ visibility: "hidden", transform: "translateX(100%)" }}
    >
      <p className="serif italic text-5xl text-ink/80">{turn ? chapterTitle(turn.id) : ""}</p>
    </div>
  );
}