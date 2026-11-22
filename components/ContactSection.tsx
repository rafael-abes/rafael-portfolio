"use client";

import { ArrowUpRight } from "lucide-react";
import { SHOW_DRAFT_MARKERS } from "@/lib/data";
import { contact, contactLabels, type Contact } from "@/lib/contact";
import { contactCopy } from "@/lib/content";
import { useBook } from "./BookState";
import { DraftNote } from "./DraftNote";

/** Turn a stored value into a link. Email becomes mailto:, bare domains get https://. */
function hrefFor(key: keyof Contact, value: string): string {
  if (key === "email") return `mailto:${value}`;
  return /^https?:\/\//.test(value) ? value : `https://${value}`;
}

export function ContactSection() {
  const { menu, setMenuOpen } = useBook();
  const keys = Object.keys(contactLabels) as (keyof Contact)[];

  return (
    <section id="contact" aria-labelledby="contact-title" className="py-24 px-5 border-t border-rule/40">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow">06 · The next course</p>
        <h2 id="contact-title" className="serif text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] mt-4">
          {contactCopy.heading}
        </h2>
        <p className="mt-4 text-lg text-brown max-w-prose">{contactCopy.body}</p>

        <ul className="mt-12 border-t border-rule/50">
          {keys.map((k) => {
            const value = contact[k];
            if (!value && !SHOW_DRAFT_MARKERS) return null;
            return (
              <li key={k} className="border-b border-rule/50">
                {value ? (
                  <a
                    href={hrefFor(k, value)}
                    {...(k === "email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                    className="group flex items-baseline gap-6 py-5 px-2 -mx-2 hover:bg-paper/70 transition-colors"
                  >
                    <span className="eyebrow w-28 shrink-0">{contactLabels[k]}</span>
                    <span className="serif text-[clamp(1.4rem,3.4vw,2.2rem)] leading-tight break-all">{value}</span>
                    <ArrowUpRight
                      size={20}
                      aria-hidden="true"
                      className="ml-auto shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                ) : (
                  <div className="flex items-baseline gap-6 py-5">
                    <span className="eyebrow w-28 shrink-0">{contactLabels[k]}</span>
                    <DraftNote>add a public link before publishing (a PDF under /public works).</DraftNote>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-12">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="eyebrow border border-ink px-5 py-3 hover:bg-paper transition-colors active:scale-[0.98]"
          >
            {menu.length > 0 ? `Open your tasting menu (${menu.length})` : "Build a tasting menu from the recipes"}
          </button>
        </div>
      </div>
    </section>
  );
}