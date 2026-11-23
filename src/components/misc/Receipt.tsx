import { SHOW_DRAFT_MARKERS } from "@/src/lib/data";
import { contact, contactLabels, type Contact } from "@/src/lib/contact";
import { RECEIPT_CLOSING, chosenProjects, formatReceiptDate, receiptTech } from "@/src/lib/receipt";

/**
 * The tasting-menu receipt. Pure presentation: it renders whatever project ids
 * it is given, so the on-screen copy and the print copy can never differ.
 */
export function Receipt({ projectIds, date }: { projectIds: string[]; date: Date }) {
  const projects = chosenProjects(projectIds);
  const keys = Object.keys(contactLabels) as (keyof Contact)[];
  const hasContact = keys.some((k) => !!contact[k]);

  return (
    <article className="receipt" aria-label="Your personal tasting menu receipt">
      <header className="text-center">
        <p className="serif text-4xl leading-none tracking-wide">À LA RAFAEL</p>
        <p className="receipt-label mt-3">Your personal tasting menu</p>
        <p className="text-xs mt-2">Rafael Abes · Software engineering</p>
      </header>

      <hr className="receipt-rule" />
      <div className="flex justify-between text-xs">
        <span>{formatReceiptDate(date)}</span>
        <span>
          Courses: <span className="tabular-nums">{projects.length}</span>
        </span>
      </div>
      <hr className="receipt-rule" />

      <ol>
        {projects.map((p, i) => (
          <li key={p.id} className="receipt-item">
            <div className="flex gap-3 items-baseline">
              <span className="text-xs tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="serif text-2xl leading-tight">{p.name}</h3>
            </div>
            {p.workingTitle && <p className="serif italic text-base ml-7">{p.workingTitle}</p>}
            <p className="text-xs leading-relaxed ml-7 mt-1">{p.summary}</p>
            <p className="text-xs ml-7 mt-1.5">
              <span className="receipt-label">With </span>
              {receiptTech(p).join(", ")}
            </p>
          </li>
        ))}
      </ol>

      <hr className="receipt-rule" />
      <p className="flex justify-between text-sm">
        <span className="receipt-label">Total due</span>
        <span className="serif italic text-lg">a conversation</span>
      </p>
      <hr className="receipt-rule" />

      {/* Contact block. Missing values show as a reminder on screen only, never in print. */}
      {(hasContact || SHOW_DRAFT_MARKERS) && (
        <div className={hasContact ? "" : "receipt-draft"}>
          <dl className="text-xs space-y-1">
            {keys.map((k) => {
              const value = contact[k];
              if (!value && !SHOW_DRAFT_MARKERS) return null;
              return (
                <div key={k} className={`flex justify-between gap-4 ${value ? "" : "receipt-draft"}`}>
                  <dt className="receipt-label">{contactLabels[k]}</dt>
                  <dd className="text-right break-all">
                    {value ?? <span className="hand text-base text-terra-deep">add before publishing</span>}
                  </dd>
                </div>
              );
            })}
          </dl>
          <hr className="receipt-rule" />
        </div>
      )}

      <p className="serif italic text-lg leading-snug text-center">“{RECEIPT_CLOSING}”</p>
    </article>
  );
}