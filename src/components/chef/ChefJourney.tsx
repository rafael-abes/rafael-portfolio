"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ingredientName } from "@/src/lib/data";
import { education, journey } from "@/src/lib/content";
import { useBook } from "../book/BookState";
import { DraftNote } from "../misc/DraftNote";

export function ChefJourney() {
  const reduce = useReducedMotion();
  const { selectIngredient, goToChapter, openProject } = useBook();

  const showInPantry = (id: string) => {
    selectIngredient(id);
    goToChapter("pantry");
  };

  return (
    <section id="journey" aria-labelledby="journey-title" className="py-24 px-5 border-t border-rule/40">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow">04 · The experience</p>
        <h2 id="journey-title" className="serif text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] mt-4">
          The chef’s journey.
        </h2>
        <p className="mt-4 text-brown max-w-prose">
          Professional experience first, then education. Select a technology to find it in the pantry.
        </p>

        <ol className="mt-14 border-t border-rule/50">
          {journey.map((e) => (
            <motion.li
              key={e.id}
              className="grid md:grid-cols-[13rem_1fr] gap-x-10 gap-y-3 py-9 border-b border-rule/50"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.22, 0.7, 0.2, 1] }}
            >
              <div>
                <p className="eyebrow">{e.kind}</p>
                <p className="serif text-xl mt-2 leading-snug">{e.dates}</p>
                {e.place && <p className="text-sm text-stone mt-1">{e.place}</p>}
              </div>

              <div>
                <h3 className="serif text-4xl leading-tight">{e.org}</h3>
                <p className="serif italic text-xl text-brown mt-1">{e.role}</p>

                {e.points.length > 0 && (
                  <ul className="mt-4 space-y-2 text-brown max-w-prose">
                    {e.points.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span aria-hidden="true" className="text-terra-deep">–</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {e.draft && (
                  <div className="mt-3">
                    <DraftNote>{e.draft}</DraftNote>
                  </div>
                )}

                {e.ingredients.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Technologies used at ${e.org}`}>
                    {e.ingredients.map((id) => (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => showInPantry(id)}
                          className="eyebrow border border-rule px-3 py-1.5 hover:bg-paper hover:border-ink transition-colors"
                        >
                          {ingredientName(id)}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* {e.recipeId && (
                  <button type="button" onClick={() => openProject(e.recipeId!)} className="eyebrow ulink mt-5">
                    Read this as a recipe
                  </button>
                )} */}
              </div>
            </motion.li>
          ))}
        </ol>

        <div className="mt-16 grid md:grid-cols-[13rem_1fr] gap-x-10 gap-y-3">
          <div>
            <p className="eyebrow">Education</p>
            <p className="serif text-xl mt-2 leading-snug">{education.dates}</p>
            <p className="text-sm text-stone mt-1">{education.place}</p>
          </div>
          <div>
            <h3 className="serif text-4xl leading-tight">{education.school}</h3>
            <p className="serif italic text-xl text-brown mt-1">{education.degree}</p>
            <p className="eyebrow mt-5 mb-2">Relevant coursework</p>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-brown">
              {education.coursework.map((c) => (
                <li key={c} className="flex gap-3">
                  <span aria-hidden="true" className="text-terra-deep">–</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}