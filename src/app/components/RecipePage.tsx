"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { categories, ingredientById, projectById, SHOW_DRAFT_MARKERS, type Project } from "@/src/app/lib/data";
import { Annotation } from "./Annotation";
import { useBook } from "./BookState";
// import { ProjectArchitecture } from "./ProjectArchitecture";

const tabs = [
  { id: "ingredients", label: "Ingredients" },
  { id: "method", label: "Method" },
  { id: "dish", label: "Finished dish" },
] as const;
type TabId = (typeof tabs)[number]["id"];

function Verify({ children }: { children: React.ReactNode }) {
  if (!SHOW_DRAFT_MARKERS) return null;
  return <span className="hand text-lg text-terra-deep block leading-tight mt-1">verify: {children}</span>;
}

/** Placeholder for a section that hasn't been written yet. Draft-only: invisible once markers are off. */
function ToWrite({ children }: { children: React.ReactNode }) {
  if (!SHOW_DRAFT_MARKERS) return null;
  return <p className="hand text-xl text-terra-deep -rotate-1">still to write: {children}</p>;
}

function IngredientsTab({ project, onPick }: { project: Project; onPick: (id: string) => void }) {
  const byCat = categories
    .map((c) => ({ cat: c, items: project.ingredients.map((id) => ingredientById.get(id)).filter((i) => i?.category === c.id) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
      {byCat.map(({ cat, items }) => (
        <div key={cat.id}>
          <h4 className="eyebrow mb-2">{cat.name}</h4>
          <ul>
            {items.map((ing) =>
              ing ? (
                <li key={ing.id} className="border-b border-rule/30 last:border-0">
                  <button type="button" onClick={() => onPick(ing.id)} className="w-full text-left py-2 group">
                    <span className="serif text-2xl ulink">{ing.name}</span>
                    <span className="block text-sm text-stone">{ing.represents}</span>
                  </button>
                </li>
              ) : null,
            )}
          </ul>
        </div>
      ))}
      <p className="sm:col-span-2 hand text-xl text-brown">Select any ingredient to find it on the pantry shelf.</p>
    </div>
  );
}

function MethodTab({ project }: { project: Project }) {
  return (
    <div>
      {project.method.length === 0 && <ToWrite>how it was built, step by step.</ToWrite>}
      <ol className="space-y-6">
        {project.method.map((s, i) => (
          <li key={s.title} className="grid grid-cols-[2.5rem_1fr] gap-3">
            <span className="serif text-3xl text-terra-deep tabular-nums leading-none pt-1">{i + 1}</span>
            <div>
              <h4 className="serif text-2xl leading-tight">{s.title}</h4>
              <p className="text-brown mt-1 max-w-prose">{s.body}</p>
              {s.note && <Annotation hint={s.note.hint}>{s.note.more}</Annotation>}
              {s.verify && <Verify>{s.verify}</Verify>}
            </div>
          </li>
        ))}
      </ol>

      {(project.techniques.length > 0 || SHOW_DRAFT_MARKERS) && (
        <>
          <hr className="rule my-8" />
          <h4 className="eyebrow mb-3">Special techniques</h4>
          {project.techniques.length === 0 && <ToWrite>the technical decisions worth pointing out.</ToWrite>}
          <ul className="grid sm:grid-cols-3 gap-4">
            {project.techniques.map((t) => (
              <li key={t.title} className="bg-paper border border-rule/50 p-4">
                <p className="serif text-xl leading-tight">{t.title}</p>
                <p className="text-sm text-stone mt-1">{t.body}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function DishTab({ project }: { project: Project }) {
  return (
    <div className="space-y-8">
      {(project.deliverables.length > 0 || SHOW_DRAFT_MARKERS) && (
        <div>
          <h4 className="eyebrow mb-3">What came out of it</h4>
          {project.deliverables.length === 0 && <ToWrite>what it does and what was delivered.</ToWrite>}
          <ul className="space-y-2">
            {project.deliverables.map((d) => (
              <li key={d} className="flex gap-3">
                <span aria-hidden="true" className="text-terra-deep">•</span>
                <span className="text-brown">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* {project.id === "ecoguard" && <ProjectArchitecture />} */}

      <div>
        <h4 className="eyebrow mb-3">Images needed</h4>
        <ul className="grid sm:grid-cols-2 gap-4">
          {project.placeholders.map((ph) => (
            <li
              key={ph.label}
              className="border border-dashed border-rule p-4 bg-paper/60 min-h-[8rem] flex flex-col justify-between"
            >
              <p className="serif text-xl leading-tight">{ph.label}</p>
              <p className="text-xs text-stone mt-3">
                <span className="tabular-nums">{ph.size}</span> px · {ph.need}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="eyebrow mb-2">Chef’s notes</h4>
        {project.notes.length === 0 ? (
          <p className="hand text-2xl text-terra-deep -rotate-1">
            Challenges and lessons: in Rafael’s own words, still to be written.
          </p>
        ) : (
          project.notes.map((n) => (
            <p key={n} className="hand text-2xl text-brown">{n}</p>
          ))
        )}
      </div>

      {/* {SHOW_DRAFT_MARKERS && project.verify.length > 0 && (
        <div className="border-t border-rule/50 pt-5">
          <h4 className="eyebrow mb-2">To confirm before publishing</h4>
          <ul className="list-disc pl-5 text-sm text-stone space-y-1">
            {project.verify.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
}

export function RecipePage() {
  const { openProjectId, closeProject, selectIngredient, goToChapter, menu, addToMenu, removeFromMenu } = useBook();
  const project = openProjectId ? projectById.get(openProjectId) : undefined;
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<TabId>("ingredients");
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  // Reset to the first tab whenever a different recipe opens.
  useEffect(() => {
    setTab("ingredients");
  }, [openProjectId]);

  // Focus management: move focus in, trap Tab, restore on close, close on Escape.
  useEffect(() => {
    if (!project) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeProject();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [project, closeProject]);

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else return;
    e.preventDefault();
    setTab(tabs[next].id);
    document.getElementById(`tab-${tabs[next].id}`)?.focus();
  };

  const pickIngredient = (id: string) => {
    selectIngredient(id);
    closeProject();
    // Let the overlay release the scroll lock first, then turn the page to the pantry.
    requestAnimationFrame(() => goToChapter("pantry"));
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="recipe-overlay"
          className="fixed inset-0 z-50 flex justify-end bg-ink/45"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeProject();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative bg-paper w-full max-w-3xl h-full overflow-y-auto shadow-2xl"
            initial={reduce ? false : { x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduce ? undefined : { x: 40, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 0.7, 0.2, 1] }}
          >
            <div className="sticky top-0 z-10 bg-paper/95 backdrop-blur flex items-center justify-between px-6 py-3 border-b border-rule/40">
              <p className="eyebrow">Recipe no. {project.number}</p>
              <button
                ref={closeRef}
                type="button"
                onClick={closeProject}
                className="eyebrow flex items-center gap-2 px-2 py-2 -mr-2 ulink"
                aria-label="Close recipe and return to the book"
              >
                Close <X size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="px-6 sm:px-10 pt-8 pb-16">
              <p className="eyebrow">{project.category}</p>
              <h2 id={titleId} className="serif text-[clamp(2.8rem,8vw,5rem)] leading-[0.95] mt-3">
                {project.name}
              </h2>
              {project.workingTitle && <p className="serif italic text-2xl text-brown mt-2">{project.workingTitle}</p>}
              <p className="mt-4 text-brown max-w-prose">{project.summary}</p>

              {/* Essentials stay visible whichever tab is open */}
              <div className="mt-8 grid sm:grid-cols-[14rem_1fr] gap-x-10 gap-y-6 border-y border-rule/50 py-6">
                <dl>
                  <dt className="eyebrow">Chef’s role</dt>
                  <dd className="mt-1">{project.role}</dd>
                  <dt className="eyebrow mt-4">Prep time</dt>
                  <dd className="mt-1">
                    {project.duration ?? <span className="text-stone">not yet added</span>}
                  </dd>
                </dl>
                <div>
                  <p className="eyebrow mb-2">My contribution</p>
                  {project.contributions.length === 0 && <ToWrite>what you built.</ToWrite>}
                  <ul className="space-y-1.5 text-sm text-brown">
                    {project.contributions.map((c) => (
                      <li key={c} className="flex gap-2">
                        <span aria-hidden="true" className="text-terra-deep">–</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Tabs */}
              <div role="tablist" aria-label={`${project.name} recipe sections`} className="mt-8 flex gap-6 border-b border-rule/50">
                {tabs.map((t, i) => (
                  <button
                    key={t.id}
                    id={`tab-${t.id}`}
                    role="tab"
                    type="button"
                    aria-selected={tab === t.id}
                    aria-controls={`panel-${t.id}`}
                    tabIndex={tab === t.id ? 0 : -1}
                    onClick={() => setTab(t.id)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    className={`tab-underline eyebrow py-3 -mb-px border-b-2 transition-colors ${
                      tab === t.id ? "!text-ink border-terra-deep" : "border-transparent hover:!text-ink"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="mt-8 min-h-[18rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={tab}
                    id={`panel-${tab}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${tab}`}
                    initial={reduce ? false : { opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduce ? undefined : { opacity: 0, x: -18 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    {tab === "ingredients" && <IngredientsTab project={project} onPick={pickIngredient} />}
                    {tab === "method" && <MethodTab project={project} />}
                    {tab === "dish" && <DishTab project={project} />}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-12 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => (menu.includes(project.id) ? removeFromMenu(project.id) : addToMenu(project.id))}
                  className="eyebrow !text-ivory bg-ink px-5 py-3 hover:bg-brown transition-colors active:scale-[0.98]"
                >
                  {menu.includes(project.id) ? "Remove from tasting menu" : "Add to tasting menu"}
                </button>
                <button
                  type="button"
                  onClick={closeProject}
                  className="eyebrow border border-ink px-5 py-3 hover:bg-ivory transition-colors active:scale-[0.98]"
                >
                  Back to the recipes
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}