import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ingredientName, projectById, projects } from "@/src/lib/data";
import { isComplete, siteUrl } from "@/src/lib/site";

/**
 * A plain, fast, fully server-rendered page for each recipe. The cookbook on the home page is the
 * designed experience; these pages exist so each project has a stable URL that links, search
 * engines and no-JavaScript readers can reach.
 */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projectById.get(slug);
  if (!p) return {};
  const complete = isComplete(p);
  return {
    title: `${p.name}${p.workingTitle ? `: ${p.workingTitle}` : ""} · Rafael Abes`,
    description: complete ? p.summary : `${p.name}: a recipe still in development.`,
    alternates: { canonical: `${siteUrl}/recipes/${p.id}` },
    robots: complete ? undefined : { index: false, follow: true },
    openGraph: { title: `${p.name} · Rafael Abes`, description: p.summary, url: `${siteUrl}/recipes/${p.id}`, type: "article" },
  };
}

export default async function RecipeRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectById.get(slug);
  if (!p) notFound();
  const complete = isComplete(p);

  return (
    <main id="main" className="mx-auto max-w-3xl px-5 py-16">
      <Link href="/#recipes" className="eyebrow ulink">
        ← Back to the cookbook
      </Link>

      <article className="mt-10">
        <p className="eyebrow">
          {p.kind === "experience" ? "Experience" : "Recipe"} {p.number} · {p.category}
        </p>
        <h1 className="serif text-[clamp(2.8rem,8vw,5rem)] leading-[0.95] mt-3">{p.name}</h1>
        {p.workingTitle && <p className="serif italic text-2xl text-brown mt-2">{p.workingTitle}</p>}
        <p className="mt-6 text-lg text-brown">{p.summary}</p>

        {!complete ? (
          <p className="hand text-2xl text-terra-deep mt-10">This recipe is still being written.</p>
        ) : (
          <>
            <dl className="mt-8 text-sm grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
              <dt className="eyebrow">Chef’s role</dt>
              <dd>{p.role}</dd>
              {p.duration && (
                <>
                  <dt className="eyebrow">Prep time</dt>
                  <dd>{p.duration}</dd>
                </>
              )}
            </dl>

            <section aria-labelledby="ing" className="mt-12">
              <h2 id="ing" className="serif text-3xl">Ingredients</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {p.ingredients.map((id) => (
                  <li key={id} className="border border-rule px-3 py-1 text-sm">{ingredientName(id)}</li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="did" className="mt-12">
              <h2 id="did" className="serif text-3xl">What I did</h2>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                {p.contributions.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="method" className="mt-12">
              <h2 id="method" className="serif text-3xl">Method</h2>
              <ol className="mt-3 space-y-6">
                {p.method.map((m, i) => (
                  <li key={m.title}>
                    <h3 className="serif text-2xl"><span className="text-stone tabular-nums">{i + 1}. </span>{m.title}</h3>
                    <p className="mt-1 text-brown">{m.body}</p>
                  </li>
                ))}
              </ol>
            </section>

            {p.techniques.length > 0 && (
              <section aria-labelledby="tech" className="mt-12">
                <h2 id="tech" className="serif text-3xl">Techniques</h2>
                <dl className="mt-3 space-y-3">
                  {p.techniques.map((t) => (
                    <div key={t.title}>
                      <dt className="font-medium">{t.title}</dt>
                      <dd className="text-brown">{t.body}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {p.deliverables.length > 0 && (
              <section aria-labelledby="out" className="mt-12">
                <h2 id="out" className="serif text-3xl">The finished dish</h2>
                <ul className="mt-3 list-disc pl-5 space-y-2">
                  {p.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </article>
    </main>
  );
}