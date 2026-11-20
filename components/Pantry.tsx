"use client";

import { motion, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { categories, ingredientById, ingredientName, ingredients, projectById, projects, projectsFor, SHOW_DRAFT_MARKERS } from "@/lib/data";
import { useBook } from "./BookState";

/** Deterministic tilt so the shelf feels hand-arranged but never jitters between renders. */
function tiltFor(id: string): number {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 7;
  return (h - 3) * 0.5;
}

function IngredientDetail() {
  const { focusedIngredient, openProject } = useBook();
  const ing = focusedIngredient ? ingredientById.get(focusedIngredient) : null;

  if (!ing) {
    return (
      <div className="bg-paper border border-rule/60 p-6">
        <p className="eyebrow">Ingredient card</p>
        <p className="serif text-3xl mt-3 leading-tight">Pick a jar.</p>
        <p className="text-stone text-sm mt-3">
          Select one ingredient to see where I’ve used it, or several to find the recipes that combine them.
        </p>
        <p className="hand text-xl text-terra-deep mt-4 -rotate-1">try Python + AWS</p>
      </div>
    );
  }

  const used = projectsFor(ing.id);
  const category = categories.find((c) => c.id === ing.category);

  return (
    <div className="bg-paper border border-rule/60 p-6" aria-live="polite">
      <p className="eyebrow">{category?.name}</p>
      <h3 className="serif text-4xl mt-2 leading-tight">{ing.name}</h3>
      <p className="mt-3 text-brown">{ing.represents}</p>

      {ing.example && (
        <p className="hand text-xl text-terra-deep mt-4 leading-snug">{ing.example}</p>
      )}

      <hr className="rule my-5" />
      <p className="eyebrow mb-2">Used in</p>
      {used.length > 0 ? (
        <ul>
          {used.map((p) => (
            <li key={p.id} className="border-b border-rule/30 last:border-0">
              <button
                type="button"
                onClick={() => openProject(p.id)}
                className="w-full flex gap-3 items-baseline py-2 text-left group"
              >
                <span className="text-xs text-stone tabular-nums">{p.number}</span>
                <span className="serif text-xl ulink group-hover:[background-size:100%_1px]">{p.name}</span>
                <span className="ml-auto text-xs text-stone">open →</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-stone">
          Not tied to a featured recipe yet.
          {SHOW_DRAFT_MARKERS && (
            <span className="hand text-lg text-terra-deep block mt-1">verify: add where this was used</span>
          )}
        </p>
      )}
    </div>
  );
}

export function Pantry() {
  const reduce = useReducedMotion();
  const {
    selected,
    toggleIngredient,
    clearIngredients,
    focusedIngredient,
    hoverProject,
    matchingProjectIds,
    openProject,
  } = useBook();

  const relatedIds = new Set(hoverProject ? (projectById.get(hoverProject)?.ingredients ?? []) : []);

  return (
    <section id="pantry" aria-labelledby="pantry-title" className="py-24 px-5 border-t border-rule/40">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow">Chapter 02</p>
        <h2 id="pantry-title" className="serif text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.95] mt-3">
          The pantry
        </h2>
        <p className="mt-4 max-w-xl text-brown">
          Everything I cook with. Select an ingredient to see where it’s been used, or pick a few to find the recipes
          that combine them. Hovering over a recipe lights up its ingredients here.
        </p>

        {/* Selection bar */}
        <div className="mt-8 border-y border-rule/50 py-4 flex flex-wrap items-center gap-x-4 gap-y-2 min-h-[4.25rem]" aria-live="polite">
          {selected.length === 0 ? (
            <p className="text-sm text-stone">No ingredients selected. Showing all {matchingProjectIds.length} recipes.</p>
          ) : (
            <>
              <p className="text-sm">
                <span className="tabular-nums">{matchingProjectIds.length}</span> of {projects.length} recipes use{" "}
                {selected.map((id, i) => (
                  <span key={id}>
                    <strong className="font-medium">{ingredientName(id)}</strong>
                    {i < selected.length - 1 ? " + " : ""}
                  </span>
                ))}
              </p>
              {matchingProjectIds.length > 0 && (
                <ul className="flex gap-3">
                  {matchingProjectIds.map((id) => (
                    <li key={id}>
                      <button type="button" onClick={() => openProject(id)} className="serif text-lg ulink">
                        {projectById.get(id)?.name} →
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {matchingProjectIds.length === 0 && (
                <p className="hand text-xl text-terra-deep">no recipe uses that exact combination yet</p>
              )}
              <button
                type="button"
                onClick={clearIngredients}
                className="ml-auto eyebrow flex items-center gap-2 border border-rule px-3 py-2 hover:bg-paper transition-colors"
              >
                <RotateCcw size={13} aria-hidden="true" /> Reset
              </button>
            </>
          )}
        </div>

        <div className="mt-10 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-12">
            {categories.map((cat) => {
              const items = ingredients.filter((i) => i.category === cat.id);
              return (
                <div key={cat.id}>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h3 className="serif text-3xl">{cat.name}</h3>
                    <p className="text-sm text-stone">{cat.blurb}</p>
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-5 pb-4 border-b-[3px] border-brown/30">
                    {items.map((ing, i) => {
                      const pressed = selected.includes(ing.id);
                      const related = relatedIds.has(ing.id);
                      const dim = hoverProject !== null && !related && !pressed;
                      return (
                        <motion.li
                          key={ing.id}
                          initial={reduce ? false : { opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ delay: i * 0.04, duration: 0.4 }}
                        >
                          <button
                            type="button"
                            className="jar"
                            aria-pressed={pressed}
                            data-related={related}
                            data-dim={dim}
                            style={{ ["--tilt" as string]: `${tiltFor(ing.id)}deg` }}
                            onClick={() => toggleIngredient(ing.id)}
                          >
                            <span className="eyebrow !text-[0.62rem] opacity-80" style={pressed ? { color: "inherit" } : undefined}>
                              {projectsFor(ing.id).length > 0 ? `${projectsFor(ing.id).length} recipe${projectsFor(ing.id).length > 1 ? "s" : ""}` : "pantry staple"}
                            </span>
                            <span className="serif text-xl leading-tight mt-1">{ing.name}</span>
                          </button>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <IngredientDetail key={focusedIngredient ?? "none"} />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}