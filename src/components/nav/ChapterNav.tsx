"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { chapters, isPlainClick } from "@/src/lib/chapters";
import { useBook } from "../(book)/BookState";

export function ChapterNav() {
  const { closeBook, menu, setMenuOpen, goToChapter } = useBook();
  const pathname = usePathname();
  const navChapters = chapters.filter((c) => c.nav);
  const isActive = (href: string) => href.split("#")[0] === pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);

  // Escape closes the chapter list and hands focus back to its button.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        burger.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-ivory/90 backdrop-blur border-b border-rule/40">
      <nav aria-label="Chapters" className="mx-auto max-w-6xl px-5 h-14 flex items-center justify-between">
        <button type="button" onClick={closeBook} className="serif italic text-xl ulink whitespace-nowrap" aria-label="Back to the cover">
          À la Rafael
        </button>

        <ul className="hidden lg:flex gap-7">
          {navChapters.map((c) => (
            <li key={c.id}>
              <Link
                href={c.href}
                onClick={(e) => {
                  if (!isPlainClick(e)) return;
                  e.preventDefault();
                  goToChapter(c.id);
                }}
                aria-current={isActive(c.href) ? "page" : undefined}
                className={`eyebrow ulink pb-1 ${isActive(c.href) ? "!text-ink" : ""}`}
                style={isActive(c.href) ? { backgroundSize: "100% 1px" } : undefined}
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="eyebrow border border-rule px-3 py-2 hover:bg-paper transition-colors whitespace-nowrap"
            aria-label={`Open your tasting menu, ${menu.length} selected`}
          >
            Tasting menu · <span className="tabular-nums">{menu.length}</span>
          </button>
          <button
            ref={burger}
            type="button"
            className="lg:hidden p-2 -mr-2"
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
        <ul id="mobile-chapters" className="lg:hidden border-t border-rule/40 bg-ivory px-5 py-3">
          {navChapters.map((c, i) => (
            <li key={c.id} className="border-b border-rule/30 last:border-0">
              <Link
                href={c.href}
                onClick={(e) => {
                  setMobileOpen(false);
                  if (!isPlainClick(e)) return;
                  e.preventDefault();
                  goToChapter(c.id);
                }}
                aria-current={isActive(c.href) ? "page" : undefined}
                className="flex gap-4 items-baseline py-3"
              >
                <span className="text-xs text-stone tabular-nums">{i === 0 ? "—" : `0${i}`}</span>
                <span className="serif text-2xl">{c.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}