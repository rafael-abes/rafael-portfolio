"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { projectsMatching } from "@/src/app/lib/data";

type Phase = "closed" | "open";

interface BookStateValue {
  ready: boolean;
  phase: Phase;
  openBook: () => void;
  closeBook: () => void;

  /** Chapter navigation: a short page-turn, or an instant jump under reduced motion. */
  turn: { id: string; n: number } | null;
  goToChapter: (id: string) => void;
  scrollToChapter: (id: string) => void;
  finishTurn: () => void;

  /** Pantry */
  selected: string[];
  toggleIngredient: (id: string) => void;
  /** Ensure an ingredient is selected (never deselects) and show its card. */
  selectIngredient: (id: string) => void;
  clearIngredients: () => void;
  focusedIngredient: string | null;
  setFocusedIngredient: (id: string | null) => void;
  matchingProjectIds: string[];

  /** Recipes */
  hoverProject: string | null;
  setHoverProject: (id: string | null) => void;
  openProjectId: string | null;
  openProject: (id: string) => void;
  closeProject: () => void;

  /** Tasting menu (persisted) */
  menu: string[];
  addToMenu: (id: string) => void;
  removeFromMenu: (id: string) => void;
  clearMenu: () => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const Ctx = createContext<BookStateValue | null>(null);

const VISITED_KEY = "alr:visited";
const MENU_KEY = "alr:menu";

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable: state simply won't persist */
  }
}

export function BookStateProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<Phase>("closed");
  const [selected, setSelected] = useState<string[]>([]);
  const [focusedIngredient, setFocusedIngredient] = useState<string | null>(null);
  const [hoverProject, setHoverProject] = useState<string | null>(null);
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const [menu, setMenu] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [turn, setTurn] = useState<{ id: string; n: number } | null>(null);
  const turning = useRef(false);

  // Returning visitors skip the cover; the tasting menu survives reloads.
  useEffect(() => {
    if (safeGet(VISITED_KEY) === "1") setPhase("open");
    const saved = safeGet(MENU_KEY);
    if (saved) {
      try {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setMenu(parsed.filter((x): x is string => typeof x === "string"));
      } catch {
        /* ignore corrupt value */
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) safeSet(MENU_KEY, JSON.stringify(menu));
  }, [menu, ready]);

  const openBook = useCallback(() => {
    safeSet(VISITED_KEY, "1");
    setPhase("open");
  }, []);
  const closeBook = useCallback(() => {
    setMenuOpen(false);
    setOpenProjectId(null);
    setPhase("closed");
    window.scrollTo({ top: 0 });
  }, []);

  const scrollToChapter = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "auto", block: "start" });
    try {
      window.history.replaceState(null, "", `#${id}`);
    } catch {
      /* some embedded contexts forbid this: the scroll still happened */
    }
  }, []);

  const goToChapter = useCallback(
    (id: string) => {
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      // Reduced motion, or a turn already in flight: just go there.
      if (reduce || turning.current) {
        scrollToChapter(id);
        return;
      }
      turning.current = true;
      setTurn({ id, n: Date.now() });
    },
    [scrollToChapter],
  );

  const finishTurn = useCallback(() => {
    turning.current = false;
    setTurn(null);
  }, []);

  const toggleIngredient = useCallback((id: string) => {
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
    setFocusedIngredient(id);
  }, []);
  const selectIngredient = useCallback((id: string) => {
    setSelected((cur) => (cur.includes(id) ? cur : [...cur, id]));
    setFocusedIngredient(id);
  }, []);
  const clearIngredients = useCallback(() => {
    setSelected([]);
    setFocusedIngredient(null);
  }, []);

  const addToMenu = useCallback((id: string) => setMenu((cur) => (cur.includes(id) ? cur : [...cur, id])), []);
  const removeFromMenu = useCallback((id: string) => setMenu((cur) => cur.filter((x) => x !== id)), []);
  const clearMenu = useCallback(() => setMenu([]), []);

  const matchingProjectIds = useMemo(() => projectsMatching(selected).map((p) => p.id), [selected]);

  const value: BookStateValue = {
    ready,
    phase,
    openBook,
    closeBook,
    turn,
    goToChapter,
    scrollToChapter,
    finishTurn,
    selected,
    toggleIngredient,
    selectIngredient,
    clearIngredients,
    focusedIngredient,
    setFocusedIngredient,
    matchingProjectIds,
    hoverProject,
    setHoverProject,
    openProjectId,
    openProject: setOpenProjectId,
    closeProject: () => setOpenProjectId(null),
    menu,
    addToMenu,
    removeFromMenu,
    clearMenu,
    menuOpen,
    setMenuOpen,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBook(): BookStateValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBook must be used inside BookStateProvider");
  return v;
}