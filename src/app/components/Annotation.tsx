"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Pencil } from "lucide-react";

/**
 * A handwritten marginal note. The short prompt is always visible; selecting it
 * reveals the longer explanation. A real disclosure button, so it works with
 * keyboard and screen readers.
 */
export function Annotation({ hint, children }: { hint: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const panelId = useId();

  return (
    <div className="mt-2">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="hand text-xl text-terra-deep inline-flex items-center gap-1.5 -rotate-1 hover:rotate-0 transition-transform underline decoration-wavy decoration-terra/60 underline-offset-4"
      >
        <Pencil size={14} aria-hidden="true" />
        {hint}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 0.7, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="hand text-xl leading-snug text-brown border-l-2 border-terra/60 pl-3 mt-2 max-w-prose">
              {children}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
