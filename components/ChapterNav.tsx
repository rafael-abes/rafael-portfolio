"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { chapters, isPlainClick } from "@/lib/chapters";
import { useBook } from "./BookState";

export function ChapterNav() {
  const { closeBook, menu, setMenuOpen, goToChapter } = useBook();
  const [active, setActive] = useState<string>("contents");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-ivory/90 backdrop-blur border-b border-rule/40">
      <nav aria-label="Chapters" className="mx-auto max-w-6xl px-5 h-14 flex items-center justify-between">
        <button type="button" onClick={closeBook} className="serif italic text-xl ulink" aria-label="Back to the cover">
          À la Rafael
        </button>

        <ul className="hidden md:flex gap-4 lg:gap-7">
          {chapters.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                onClick={(e) => {
                  if (!isPlainClick(e)) return;
                  e.preventDefault();
                  goToChapter(c.id);
                }}
                aria-current={active === c.id ? "true" : undefined}
                className={`eyebrow ulink pb-1 ${active === c.id ? "!text-ink" : ""}`}
                style={active === c.id ? { backgroundSize: "100% 1px" } : undefined}
              >
                {c.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="eyebrow border border-rule px-3 py-2 hover:bg-paper transition-colors"
            aria-label={`Open your tasting menu, ${menu.length} selected`}
          >
            Tasting menu · <span className="tabular-nums">{menu.length}</span>
          </button>
          <button
            type="button"
            className="md:hidden p-2 -mr-2"
            aria-expanded={mobileOpen}
            aria-controls="mobile-chapters"
            aria-label={mobileOpen ? "Close chapter list" : "Open chapter list"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <ul id="mobile-chapters" className="md:hidden border-t border-rule/40 bg-ivory px-5 py-3">
          {chapters.map((c, i) => (
            <li key={c.id} className="border-b border-rule/30 last:border-0">
              <a
                href={`#${c.id}`}
                onClick={(e) => {
                  setMobileOpen(false);
                  if (!isPlainClick(e)) return;
                  e.preventDefault();
                  goToChapter(c.id);
                }}
                className="flex gap-4 items-baseline py-3"
              >
                <span className="text-xs text-stone tabular-nums">{i === 0 ? "—" : `0${i}`}</span>
                <span className="serif text-2xl">{c.label}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}