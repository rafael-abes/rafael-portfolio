"use client";

import { motion, useReducedMotion } from "framer-motion";
import { notes } from "@/lib/content";
import { Annotation } from "./Annotation";
import { DraftNote } from "./DraftNote";

export function ChefNotes() {
  const reduce = useReducedMotion();

  return (
    <section id="notes" aria-labelledby="notes-title" className="py-24 px-5 border-t border-rule/40">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow">05 · The chef’s notes</p>
        <h2 id="notes-title" className="serif text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.98] mt-4 max-w-3xl">
          {notes.heading}
        </h2>
        <div className="mt-4">
          <DraftNote>{notes.draft}</DraftNote>
        </div>

        {/* The recipe-development story */}
        <div className="mt-14 grid md:grid-cols-12 gap-x-12 gap-y-8 items-start">
          <div className="md:col-span-7">
            <h3 className="serif text-4xl leading-tight">{notes.story.title}</h3>
            <div className="mt-4 space-y-4 text-lg text-brown max-w-prose">
              {notes.story.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <figure className="md:col-span-5 md:rotate-1">
            <div className="border border-dashed border-rule bg-paper/60 aspect-[4/5] p-4 flex flex-col justify-between">
              <p className="serif text-2xl leading-tight">{notes.story.image.label}</p>
              <p className="text-xs text-stone">
                <span className="tabular-nums">{notes.story.image.size}</span> px · {notes.story.image.need}
              </p>
            </div>
            <figcaption className="hand text-xl text-terra-deep mt-2">photo to come</figcaption>
          </figure>
        </div>

        {/* Short observations, each with a marginal note */}
        <ul className="mt-20 grid md:grid-cols-2 gap-x-14 gap-y-12">
          {notes.observations.map((o, i) => (
            <motion.li
              key={o.title}
              className="border-t border-rule/50 pt-5"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 2) * 0.06, ease: [0.22, 0.7, 0.2, 1] }}
            >
              <p className="text-xs text-stone tabular-nums">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="serif text-3xl leading-tight mt-1">{o.title}</h3>
              <p className="mt-2 text-brown max-w-prose">{o.body}</p>
              <Annotation hint="a little more">{o.more}</Annotation>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}