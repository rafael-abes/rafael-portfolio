"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { chapterById, isPlainClick } from "@/src/lib/chapters";
import { useBook } from "./(book)/BookState";

interface Entry {
  n: string;
  title: string;
  blurb: string;
  /** Chapter id, resolved to its page in lib/chapters.ts. */
  id: string;
}

const entries: Entry[] = [
  { n: "01", id: "intro", title: "A little introduction", blurb: "Meet Rafael." },
  { n: "02", id: "pantry", title: "The pantry", blurb: "The ingredients, technologies and skills behind my work." },
  { n: "03", id: "recipes", title: "The recipes", blurb: "Selected engineering projects." },
  { n: "04", id: "journey", title: "The experience", blurb: "Professional experience and education." },
  { n: "05", id: "contact", title: "The next course", blurb: "Get in touch." },
];

export function TableOfContents() {
  const reduce = useReducedMotion();
  const { goToChapter } = useBook();

  return (
    <section id="contents" aria-labelledby="contents-title" className="min-h-screen pt-28 pb-24 px-5">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow">Rafael Abes · Vol. 01</p>
        <h1 id="contents-title" tabIndex={-1} className="outline-none serif text-[clamp(3.2rem,9vw,7rem)] leading-[0.95] mt-4">
          Contents
        </h1>
        <p className="hand text-terra-deep text-2xl mt-3 -rotate-1 inline-block">
          a collection of ingredients, experiments &amp; things I’ve built
        </p>

        <ol className="mt-14">
          {entries.map((e, i) => {
            const inner = (
              <>
                <span className="text-sm text-stone tabular-nums pt-3 w-10 shrink-0">{e.n}</span>
                <span className="flex-1 min-w-0">
                  <span className="serif block text-[clamp(1.8rem,4.6vw,3rem)] leading-tight uppercase tracking-wide">
                    {e.title}
                  </span>
                  <span className="block text-stone text-sm mt-1">{e.blurb}</span>
                </span>
                <span className="eyebrow pt-4 shrink-0" aria-hidden="true">→</span>
              </>
            );
            return (
              <motion.li
                key={e.n}
                className="border-t border-rule/50 last:border-b"
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.22, 0.7, 0.2, 1] }}
              >
                <Link
                  href={chapterById(e.id)?.href ?? "/"}
                  onClick={(ev) => {
                    if (!isPlainClick(ev)) return;
                    ev.preventDefault();
                    goToChapter(e.id);
                  }}
                  className="group flex gap-4 py-5 hover:bg-paper/70 transition-colors px-2 -mx-2"
                >
                  {inner}
                </Link>
              </motion.li>
            );
          })}
        </ol>

        <p className="hand text-xl text-brown mt-10 max-w-md">
          Pick recipes as you go. They collect in the tasting menu up in the corner, and turn into a receipt.
        </p>
      </div>
    </section>
  );
}