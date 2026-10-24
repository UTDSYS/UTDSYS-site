import content from "@/lib/content";
import MarketMakerDesk from "@/components/quant/MarketMakerDesk";

export const metadata = {
  title: "Quantitative Research — UofT Decision Systems",
  description:
    "Quantitative research from UofT Decision Systems: a live, simulated market-making desk, the model behind it, and our working papers.",
};

const { eyebrow, heading, intro, explainer, desk, model, project, focus, papers, disclaimer } =
  content.quantResearch;

export default function QuantitativeResearchPage() {
  const current = project.stages.indexOf(project.stage);

  return (
    <main className="relative min-h-screen">
      <div className="mx-auto max-w-7xl px-6 pb-28 pt-36">
        {/* masthead */}
        <header className="max-w-3xl pb-12">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-signal-deep">{eyebrow}</p>
          <h1 className="font-display mt-5 text-5xl font-bold tracking-tight text-ink md:text-6xl">
            {heading}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-navy/70 md:text-lg">{intro}</p>
        </header>

        {/* how to read the desk */}
        <ol className="mb-8 grid gap-6 sm:grid-cols-3">
          {explainer.map((e, i) => (
            <li key={e.title} className="flex gap-4">
              <span className="font-display flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-signal-deep/30 text-sm font-semibold text-signal-deep">
                {i + 1}
              </span>
              <div>
                <h2 className="font-display text-base font-semibold tracking-tight text-ink">{e.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-navy/65">{e.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <MarketMakerDesk {...desk} />

        {/* the model */}
        <section aria-labelledby="model" className="mt-24">
          <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <div>
              <h2 id="model" className="font-display text-2xl font-bold tracking-tight text-ink">
                {model.heading}
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-navy/65">{model.intro}</p>
            </div>
            <ol className="grid gap-px overflow-hidden rounded-xl border border-navy/10 bg-navy/10 sm:grid-cols-3">
              {model.terms.map((t, i) => (
                <li key={t.name} className="bg-offwhite p-5">
                  <span className="font-mono text-[0.6rem] tracking-[0.2em] text-signal-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display mt-2 text-base font-semibold tracking-tight text-ink">
                    {t.name}
                  </h3>
                  <p className="mt-3 rounded-md bg-white/70 px-3 py-2 font-mono text-[0.72rem] text-ink">
                    {t.formula}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-navy/60">{t.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* current project + pipeline */}
        <section aria-labelledby="project" className="mt-24 border-t border-navy/12 pt-10">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-navy/45">
            {project.label}
          </p>
          <div className="mt-3 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-end">
            <div>
              <h2 id="project" className="font-display text-3xl font-bold tracking-tight text-ink">
                {project.name}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-navy/65">{project.summary}</p>
            </div>
            <ol className="flex items-start">
              {project.stages.map((s, i) => {
                const done = i < current;
                const here = i === current;
                return (
                  <li key={s} className="relative flex flex-1 flex-col items-center text-center">
                    {i > 0 && (
                      <span
                        className={`absolute right-1/2 top-[7px] h-px w-full ${
                          i <= current ? "bg-signal-deep" : "bg-navy/15"
                        }`}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={`relative z-10 block h-[15px] w-[15px] rounded-full border-2 ${
                        here
                          ? "border-signal-deep bg-white shadow-[0_0_0_4px_rgb(29_63_184/0.15)]"
                          : done
                            ? "border-signal-deep bg-signal-deep"
                            : "border-navy/20 bg-offwhite"
                      }`}
                    />
                    <span
                      className={`mt-3 font-mono text-[0.58rem] uppercase tracking-[0.12em] sm:text-[0.62rem] ${
                        here ? "text-signal-deep" : done ? "text-ink" : "text-navy/40"
                      }`}
                    >
                      {s}
                    </span>
                    {here && <span className="sr-only">(current stage)</span>}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* focus areas */}
        <section aria-labelledby="focus" className="mt-24">
          <h2 id="focus" className="font-display text-2xl font-bold tracking-tight text-ink">
            {focus.heading}
          </h2>
          <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {focus.areas.map((a) => (
              <li key={a.name} className="border-t border-navy/15 pt-5">
                <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{a.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/65">{a.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* working papers */}
        <section aria-labelledby="papers" className="mt-24">
          <h2 id="papers" className="font-display text-2xl font-bold tracking-tight text-ink">
            {papers.heading}
          </h2>
          {papers.items.length === 0 ? (
            <p className="mt-6 border-y border-navy/10 py-8 font-mono text-xs uppercase tracking-[0.18em] text-navy/40">
              {papers.empty}
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-navy/10 border-y border-navy/10">
              {papers.items.map((p) => (
                <li key={p.title} className="grid gap-2 py-6 md:grid-cols-[8rem_1fr_auto] md:gap-6">
                  <span className="font-mono text-xs text-navy/50">{p.date}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{p.title}</h3>
                    <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-navy/50">
                      {p.authors.join(" · ")}
                    </p>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy/65">{p.abstract}</p>
                  </div>
                  {p.pdf && (
                    <a
                      href={p.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="self-start font-mono text-[0.65rem] uppercase tracking-[0.16em] text-signal-deep underline decoration-signal-deep/30 underline-offset-4 hover:decoration-signal-deep"
                    >
                      PDF ↗
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="mt-16 max-w-3xl text-xs leading-relaxed text-navy/45">{disclaimer}</p>
      </div>
    </main>
  );
}
