"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Download, Printer, X } from "lucide-react";
import { ingredientName } from "@/lib/data";
import { buildReceiptText, chosenProjects } from "@/lib/receipt";
import { useBook } from "./BookState";
import { Receipt } from "./Receipt";

type View = "list" | "receipt";

/** Drawer for the visitor's selection, with a receipt generated from it. */
export function TastingMenu() {
  const { menuOpen, setMenuOpen, menu, removeFromMenu, clearMenu, openProject, goToChapter } = useBook();
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [view, setView] = useState<View>("list");
  const [receiptDate, setReceiptDate] = useState(() => new Date());

  const chosen = chosenProjects(menu);
  const showReceipt = view === "receipt" && chosen.length > 0;

  // Always reopen on the list.
  useEffect(() => {
    if (!menuOpen) setView("list");
  }, [menuOpen]);

  // Focus management: move focus in, trap Tab, restore on close, close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]");
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [menuOpen, setMenuOpen]);

  // The view swap removes the button that was just pressed, so hand focus to the new heading.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (menuOpen) headingRef.current?.focus();
  }, [view, menuOpen]);

  const browse = () => {
    setMenuOpen(false);
    requestAnimationFrame(() => goToChapter("recipes"));
  };

  const openReceipt = () => {
    setReceiptDate(new Date());
    setView("receipt");
  };

  const download = () => {
    const text = buildReceiptText(menu, receiptDate);
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "a-la-rafael-tasting-menu.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu-overlay"
            className="fixed inset-0 z-50 flex justify-end bg-ink/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setMenuOpen(false);
            }}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Your personal tasting menu"
              className="bg-paper w-full max-w-md h-full overflow-y-auto shadow-2xl px-6 py-6"
              initial={reduce ? false : { x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={reduce ? undefined : { x: 40, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 0.7, 0.2, 1] }}
            >
              <div className="flex items-center justify-between">
                <p className="eyebrow">Your personal tasting menu</p>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="p-2 -mr-2"
                  aria-label="Close tasting menu"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              {showReceipt ? (
                <div>
                  <h2 ref={headingRef} tabIndex={-1} className="serif text-5xl leading-none mt-4 outline-none">
                    Your receipt
                  </h2>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="eyebrow !text-ivory bg-ink px-4 py-3 inline-flex items-center gap-2 hover:bg-brown transition-colors active:scale-[0.98]"
                    >
                      <Printer size={14} aria-hidden="true" />
                      Print or save as PDF
                    </button>
                    <button
                      type="button"
                      onClick={download}
                      className="eyebrow border border-ink px-4 py-3 inline-flex items-center gap-2 hover:bg-ivory transition-colors active:scale-[0.98]"
                    >
                      <Download size={14} aria-hidden="true" />
                      Download .txt
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    className="eyebrow ulink mt-4 inline-flex items-center gap-2 py-2"
                  >
                    <ArrowLeft size={14} aria-hidden="true" />
                    Back to your menu
                  </button>

                  <div className="mt-6 pb-8">
                    <Receipt projectIds={menu} date={receiptDate} />
                  </div>
                </div>
              ) : (
                <>
                  <h2 ref={headingRef} tabIndex={-1} className="serif text-5xl leading-none mt-4 outline-none">
                    Tasting menu
                  </h2>

                  {chosen.length === 0 ? (
                    <div className="mt-8">
                      <p className="text-brown">Nothing selected yet. Add recipes from the book and they’ll collect here.</p>
                      <button
                        type="button"
                        onClick={browse}
                        className="eyebrow border border-ink px-4 py-3 mt-6 hover:bg-ivory transition-colors"
                      >
                        Browse the recipes
                      </button>
                    </div>
                  ) : (
                    <>
                      <ol className="mt-8 border-t border-rule/50">
                        {chosen.map((p, i) => (
                          <li key={p.id} className="py-5 border-b border-rule/50">
                            <div className="flex items-baseline gap-3">
                              <span className="text-xs text-stone tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                              <h3 className="serif text-3xl leading-tight">{p.name}</h3>
                            </div>
                            <p className="text-sm text-brown mt-2">{p.summary}</p>
                            <p className="text-xs text-stone mt-2">
                              {p.ingredients.slice(0, 6).map(ingredientName).join(" · ")}
                            </p>
                            <div className="flex gap-4 mt-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setMenuOpen(false);
                                  openProject(p.id);
                                }}
                                className="eyebrow ulink"
                              >
                                Read recipe
                              </button>
                              <button type="button" onClick={() => removeFromMenu(p.id)} className="eyebrow ulink">
                                Remove
                              </button>
                            </div>
                          </li>
                        ))}
                      </ol>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={openReceipt}
                          className="eyebrow !text-ivory bg-ink px-5 py-3 hover:bg-brown transition-colors active:scale-[0.98]"
                        >
                          Get your receipt
                        </button>
                        <button
                          type="button"
                          onClick={browse}
                          className="eyebrow border border-ink px-4 py-3 hover:bg-ivory transition-colors active:scale-[0.98]"
                        >
                          Add more
                        </button>
                        <button type="button" onClick={clearMenu} className="eyebrow px-4 py-3 ulink">
                          Clear all
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Print copy: lives directly under <body> so print CSS can show it and nothing else. */}
      {menuOpen && showReceipt && typeof document !== "undefined" &&
        createPortal(
          <div id="print-root">
            <Receipt projectIds={menu} date={receiptDate} />
          </div>,
          document.body,
        )}
    </>
  );
}