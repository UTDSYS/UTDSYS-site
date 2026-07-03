import ComingSoon from "@/components/ComingSoon";
import content from "@/lib/content";

export const metadata = {
  title: "Projects — UofT Decision Systems",
  description:
    "Decision systems built by the UofT Decision Systems team. Project write-ups are coming soon.",
};

export default function ProjectsPage() {
  return (
    <ComingSoon
      title={content.pages.projects.title}
      body={content.pages.projects.body}
    />
  );
}

/*
  Project gallery — commented out for now. Restore this (and the items in
  lib/content.ts) when the projects are ready to show. It renders the
  content.projects.items as a responsive card grid.

  import Link from "next/link";
  const { eyebrow, heading, intro, items } = content.projects;

  export default function ProjectsPage() {
    return (
      <main className="relative min-h-screen">
        <div className="mx-auto max-w-5xl px-6 pb-28 pt-36">
          <header className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-signal">
              {eyebrow}
            </p>
            <h1 className="font-display mt-5 text-5xl font-bold tracking-tight text-ink md:text-6xl">
              {heading}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-navy/70 md:text-lg">
              {intro}
            </p>
          </header>

          <ol className="mt-14 grid gap-5 sm:grid-cols-2">
            {items.map((p, i) => (
              <li key={p.name}>
                <article className="project-card group flex h-full flex-col rounded-3xl border border-navy/12 bg-white/50 p-7 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-signal/50">
                  <div className="flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.22em] text-navy/45">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span className="inline-flex items-center gap-1.5 text-navy/55">
                      <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                      {p.status}
                    </span>
                  </div>
                  <h2 className="font-display mt-6 text-2xl font-bold tracking-tight text-ink transition-colors group-hover:text-signal">
                    {p.name}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-navy/70">
                    {p.summary}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-navy/12 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-navy/60"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </main>
    );
  }
*/
