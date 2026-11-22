"use client";

import { motion, useReducedMotion } from "framer-motion";
import { intro } from "@/lib/content";
import { useBook } from "./BookState";
import { DraftNote } from "./DraftNote";

export function Intro() {
  const reduce = useReducedMotion();
  const { goToChapter } = useBook();

  return (
    <section id="intro" aria-labelledby="intro-title" className="py-24 px-5 border-t border-rule/40">
      <div className="mx-auto max-w-5xl grid lg:grid-cols-12 gap-x-12 gap-y-10">
        <div className="lg:col-span-6">
          <p className="eyebrow">01 · A little introduction</p>
          <h2 id="intro-title" className="serif text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] mt-4">
            {intro.heading}
          </h2>
          <p className="hand text-terra-deep text-2xl mt-3 -rotate-2 inline-block">{intro.aside}</p>
        </div>

        <motion.div
          className="lg:col-span-6 lg:pt-10"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 0.7, 0.2, 1] }}
        >
          <div className="space-y-5 text-lg text-brown max-w-prose">
            {intro.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <dl className="mt-8 border-t border-rule/50">
            {intro.facts.map((f) => (
              <div key={f.label} className="flex gap-6 py-3 border-b border-rule/50">
                <dt className="eyebrow w-32 shrink-0 pt-1">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => goToChapter("recipes")}
              className="eyebrow !text-ivory bg-ink px-5 py-3 hover:bg-brown transition-colors active:scale-[0.98]"
            >
              See the recipes
            </button>
            <button
              type="button"
              onClick={() => goToChapter("journey")}
              className="eyebrow border border-ink px-5 py-3 hover:bg-paper transition-colors active:scale-[0.98]"
            >
              Experience
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}