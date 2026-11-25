import { ingredientName, projectById, type Project } from "./data";
import { contact, contactLabels, type Contact } from "./contact";

export const RECEIPT_CLOSING =
  "Thanks for taking a look at what I've been working on. There's always another recipe in development.";

const WIDTH = 40;

export function formatReceiptDate(date: Date): string {
  return new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

/** The projects the visitor chose, in the order they chose them. Unknown ids are dropped. */
export function chosenProjects(ids: string[]): Project[] {
  return ids.map((id) => projectById.get(id)).filter((p): p is Project => !!p);
}

/** Technologies shown on the receipt for a project (kept short enough to read on a slip). */
export function receiptTech(p: Project, limit = 8): string[] {
  return p.ingredients.slice(0, limit).map(ingredientName);
}

/** Contact lines that actually have a value. */
export function filledContact(c: Contact = contact): { label: string; value: string }[] {
  return (Object.keys(contactLabels) as (keyof Contact)[])
    .map((k) => ({ label: contactLabels[k], value: c[k] }))
    .filter((x): x is { label: string; value: string } => !!x.value);
}

function wrap(text: string, width = WIDTH, indent = ""): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = indent;
  for (const w of words) {
    if ((line + (line.trim() ? " " : "") + w).length > width && line.trim()) {
      lines.push(line);
      line = indent + w;
    } else {
      line += (line.trim() ? " " : "") + w;
    }
  }
  if (line.trim()) lines.push(line);
  return lines;
}

function centre(text: string, width = WIDTH): string {
  const pad = Math.max(0, Math.floor((width - text.length) / 2));
  return " ".repeat(pad) + text;
}

/** Plain-text receipt for download. Built from the same data as the on-screen receipt. */
export function buildReceiptText(projectIds: string[], date: Date): string {
  const projects = chosenProjects(projectIds);
  const rule = "-".repeat(WIDTH);
  const out: string[] = [];
  out.push(centre("Rafael Abes"), centre("YOUR PERSONAL TASTING MENU"), "", centre("Software engineering Portfolio"), rule);
  out.push(formatReceiptDate(date));
  out.push(`Courses: ${projects.length}`, rule);

  projects.forEach((p, i) => {
    out.push(`${String(i + 1).padStart(2, "0")}  ${p.name.toUpperCase()}`);
    if (p.workingTitle) out.push(...wrap(p.workingTitle, WIDTH, "    "));
    out.push(...wrap(p.summary, WIDTH, "    "));
    out.push(...wrap(`With: ${receiptTech(p).join(", ")}`, WIDTH, "    "));
    out.push("");
  });

  out.push(rule, "TOTAL DUE: a conversation", rule);

  const lines = filledContact();
  if (lines.length > 0) {
    lines.forEach((l) => out.push(`${l.label}: ${l.value}`));
    out.push(rule);
  }

  out.push(...wrap(RECEIPT_CLOSING, WIDTH), "");
  return out.join("\n");
}