"use client";

import { Check, Plus } from "lucide-react";
import { ingredientName, projects } from "@/lib/data";
import { useBook } from "./BookState";

export function RecipeCollection() {
  const { selected, matchingProjectIds, setHoverProject, openProject, menu, addToMenu, removeFromMenu } = useBook();

  return (
    <section id="recipes" aria-labelledby="recipes-title" className="py-24 px-5 border-t border-rule/40">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow">Chapter 03</p>
        <h2 id="recipes-title" className="serif text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.95] mt-3">
          The recipes
        </h2>
        <p className="mt-4 max-w-xl text-brown">
          Selected engineering projects, written up as recipes: ingredients, method, and the finished dish. Add the ones
          that interest you to your tasting menu.
        </p>

        <ol className="mt-12 border-t border-rule/60">
          {projects.map((p) => {
            const matches = matchingProjectIds.includes(p.id);
            const missing = selected.filter((id) => !p.ingredients.includes(id));
            const inMenu = menu.includes(p.id);
            return (
              <li
                key={p.id}
                className={`border-b border-rule/60 transition-opacity duration-300 ${matches ? "opacity-100" : "opacity-35"}`}
                onMouseEnter={() => setHoverProject(p.id)}
                onMouseLeave={() => setHoverProject(null)}
                onFocus={() => setHoverProject(p.id)}
                onBlur={() => setHoverProject(null)}
              >
                <div className="grid md:grid-cols-12 gap-x-6 gap-y-3 py-8">
                  <span className="md:col-span-1 serif text-3xl text-stone tabular-nums">{p.number}</span>

                  <div className="md:col-span-7">
                    <p className="eyebrow">
                      {p.kind === "experience" ? "Experience" : "Recipe"} · {p.category}
                    </p>
                    <h3 className="serif text-[clamp(2.2rem,5vw,3.6rem)] leading-[1] mt-2">
                      <button type="button" onClick={() => openProject(p.id)} className="text-left ulink">
                        {p.name}
                      </button>
                    </h3>
                    {p.workingTitle && <p className="serif italic text-xl text-brown mt-1">{p.workingTitle}</p>}
                    <p className="mt-3 text-brown max-w-xl">{p.summary}</p>
                    {selected.length > 0 && !matches && (
                      <p className="hand text-xl text-terra-deep mt-2">
                        doesn’t use {missing.map(ingredientName).join(", ")}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-4 flex md:flex-col md:items-end gap-3 md:justify-between">
                    <dl className="text-sm md:text-right">
                      <dt className="eyebrow">Chef’s role</dt>
                      <dd className="mt-1">{p.role}</dd>
                      {p.duration && (
                        <>
                          <dt className="eyebrow mt-3">Prep time</dt>
                          <dd className="mt-1">{p.duration}</dd>
                        </>
                      )}
                    </dl>
                    <div className="flex flex-wrap gap-2 md:justify-end mt-auto">
                      <button
                        type="button"
                        onClick={() => openProject(p.id)}
                        className="eyebrow !text-ivory bg-ink px-4 py-3 hover:bg-brown transition-colors active:scale-[0.98]"
                      >
                        Open recipe
                      </button>
                      <button
                        type="button"
                        aria-pressed={inMenu}
                        onClick={() => (inMenu ? removeFromMenu(p.id) : addToMenu(p.id))}
                        className="eyebrow border border-ink px-4 py-3 flex items-center gap-2 hover:bg-paper transition-colors active:scale-[0.98] aria-pressed:bg-olive-deep aria-pressed:text-paper aria-pressed:border-olive-deep"
                      >
                        {inMenu ? <Check size={13} aria-hidden="true" /> : <Plus size={13} aria-hidden="true" />}
                        {inMenu ? "On your menu" : "Add to menu"}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}