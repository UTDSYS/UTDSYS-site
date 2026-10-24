import Link from "next/link";
import content from "@/lib/content";

export const metadata = {
  title: "Quantitative Research — UofT Decision Systems",
  description:
    "The UofT Decision Systems quantitative desk: its projects, how it reviews the literature, and the annotated reading list it works from.",
};

const { heading, intro, disclaimer, projects, method, reading, reviews, join } = content.quantResearch;

// References are numbered continuously across groups, in the order listed,
// so a review can point at one by number.
type Ref = { cite: string; note: string };

const groups = reading.groups.reduce<{ name: string; start: number; items: readonly Ref[] }[]>(
  (acc, g) => {
    const prev = acc[acc.length - 1];
    acc.push({ ...g, start: prev ? prev.start + prev.items.length : 1 });
    return acc;
  },
  [],
);

// "Cartea, Á., Jaimungal, S. and Penalva, J. (2015). …" → "Cartea et al. (2015)":
// drop the initials, then name one or two authors and abbreviate three or more.
// References are flattened in reading-list order, matching their numbers.
const refs: Ref[] = reading.groups.flatMap((g): readonly Ref[] => g.items);
const shortCite = (n: number) => {
  const cite = refs[n - 1]?.cite ?? "";
  const [authors, rest = ""] = cite.split(" (");
  const names = authors.replace(/,\s*(?:[A-ZÀ-Ý]\.(?:-|\s(?=[A-ZÀ-Ý]\.))?)+/g, "").split(/, | and /);
  const who = names.length === 1 ? names[0] : names.length === 2 ? names.join(" and ") : `${names[0]} et al.`;
  return `${who} (${rest.slice(0, 4)})`;
};

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="grid gap-6 border-t border-navy/12 py-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12 lg:py-14"
    >
      <h2 id={id} className="font-display text-xl font-bold tracking-tight text-ink">
        {title}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export default function QuantitativeResearchPage() {
  return (
    <main className="relative min-h-screen">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-36">
        <header className="max-w-3xl pb-14">
          <h1 className="font-display text-5xl font-bold tracking-tight text-ink md:text-6xl">
            {heading}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy/75">{intro}</p>
        </header>

        <Section id="projects" title={projects.heading}>
          <div className="space-y-12">
            {projects.items.map((p) => {
              const current = p.stages.findIndex((s) => s.name === p.stage);
              const status = (i: number) =>
                i < current ? "Complete" : i === current ? "In progress" : i === current + 1 ? "Next" : "Planned";
              return (
                <article key={p.name} className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
                  <div className="max-w-[38rem]">
                    <h3 className="font-display text-2xl font-bold tracking-tight text-ink">{p.name}</h3>
                    <p className="mt-3 text-base leading-relaxed text-navy/75">{p.summary}</p>
                    <p className="mt-5 text-sm text-navy/55">
                      {projects.readingLabel}{" "}
                      {p.reading.map((n, i) => (
                        <span key={n}>
                          {i > 0 && ", "}
                          <a
                            href={`#ref-${n}`}
                            className="text-signal-deep underline decoration-signal-deep/25 underline-offset-4 transition hover:decoration-signal-deep"
                          >
                            {shortCite(n)} [{n}]
                          </a>
                        </span>
                      ))}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-navy/55">Status</h4>
                    <ol className="mt-3 border-t border-navy/12">
                      {p.stages.map((s, i) => {
                        const here = i === current;
                        return (
                          <li
                            key={s.name}
                            aria-current={here ? "step" : undefined}
                            className="grid grid-cols-[1fr_auto] gap-x-4 border-b border-navy/12 py-3"
                          >
                            <span className={`text-sm font-medium ${i <= current ? "text-ink" : "text-navy/50"}`}>
                              {s.name}
                            </span>
                            <span
                              className={`text-xs ${
                                here
                                  ? "font-medium text-signal-deep"
                                  : i < current
                                    ? "text-navy/60"
                                    : "text-navy/40"
                              }`}
                            >
                              {status(i)}
                            </span>
                            <span className="col-span-2 mt-0.5 text-xs leading-relaxed text-navy/50">{s.detail}</span>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </article>
              );
            })}
          </div>
        </Section>

        <Section id="method" title={method.heading}>
          <ol className="max-w-[40rem] border-t border-navy/12">
            {method.steps.map((s, i) => (
              <li key={s.name} className="grid grid-cols-[2rem_1fr] border-b border-navy/12 py-4">
                <span className="text-sm tabular-nums text-signal-deep">{i + 1}</span>
                <div>
                  <h3 className="text-base font-medium text-ink">{s.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-navy/65">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="reading" title={reading.heading}>
          <div className="space-y-10">
            {groups.map((g) => (
              <div key={g.name}>
                <h3 className="font-display text-base font-semibold tracking-tight text-ink">{g.name}</h3>
                <ol className="mt-3 max-w-[44rem] divide-y divide-navy/10 border-y border-navy/10">
                  {g.items.map((it, i) => (
                    <li
                      key={it.cite}
                      id={`ref-${g.start + i}`}
                      className="grid grid-cols-[2.25rem_1fr] py-4"
                    >
                      <span className="text-sm tabular-nums text-navy/40">[{g.start + i}]</span>
                      <div>
                        <p className="text-sm leading-relaxed text-ink">{it.cite}</p>
                        <p className="mt-1 text-sm leading-relaxed text-navy/55">{it.note}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Section>

        <Section id="reviews" title={reviews.heading}>
          {reviews.items.length === 0 ? (
            <p className="max-w-[38rem] text-base leading-relaxed text-navy/60">{reviews.empty}</p>
          ) : (
            <ul className="max-w-[44rem] divide-y divide-navy/10 border-y border-navy/10">
              {reviews.items.map((r) => (
                <li key={r.title} className="grid gap-2 py-5 md:grid-cols-[7rem_1fr_auto] md:gap-6">
                  <span className="text-sm tabular-nums text-navy/50">{r.date}</span>
                  <div>
                    <h3 className="font-display text-base font-semibold tracking-tight text-ink">{r.title}</h3>
                    <p className="mt-1 text-sm text-navy/55">
                      {r.reviewer}, on{" "}
                      <a href={`#ref-${r.ref}`} className="text-signal-deep">
                        [{r.ref}]
                      </a>
                    </p>
                  </div>
                  {r.pdf && (
                    <a
                      href={r.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="self-start text-sm font-medium text-signal-deep underline decoration-signal-deep/30 underline-offset-4 hover:decoration-signal-deep"
                    >
                      PDF
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Section>

        <footer className="grid gap-6 border-t border-navy/12 pt-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
          <p className="text-sm text-navy/60">
            {join.text}{" "}
            <Link
              href={join.href}
              className="font-medium text-signal-deep underline decoration-signal-deep/30 underline-offset-4 transition hover:decoration-signal-deep"
            >
              {join.label}
            </Link>
          </p>
          <p className="max-w-[40rem] text-xs leading-relaxed text-navy/45">{disclaimer}</p>
        </footer>
      </div>
    </main>
  );
}
