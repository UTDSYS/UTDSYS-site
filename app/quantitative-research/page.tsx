import Button from "@/components/ui/Button";
import Swipe from "@/components/Swipe";
import content from "@/lib/content";

export const metadata = {
  title: "Quantitative Research — UofT Decision Systems",
  description:
    "The UofT Decision Systems quantitative desk: portfolio research, tested on past data and then in paper trading.",
};

const { eyebrow, heading, intro, disclaimer, studies, reading, join } = content.quantResearch;

// References are numbered continuously across groups, in the order listed,
// so a study can point at one by number.
const groups = reading.groups.reduce<{ name: string; start: number; items: readonly string[] }[]>(
  (acc, g) => {
    const prev = acc[acc.length - 1];
    acc.push({ ...g, start: prev ? prev.start + prev.items.length : 1 });
    return acc;
  },
  [],
);

// "Garlappi, L., Uppal, R. and Wang, T. (2007). …" → "Garlappi et al. (2007)":
// drop the initials, then name one or two authors and abbreviate three or more.
const refs: string[] = reading.groups.flatMap((g) => g.items);
const shortCite = (n: number) => {
  const [authors, rest = ""] = (refs[n - 1] ?? "").split(" (");
  const names = authors.replace(/,\s*(?:[A-ZÀ-Ý]\.(?:-|\s(?=[A-ZÀ-Ý]\.))?)+/g, "").split(/, | and /);
  const who = names.length === 1 ? names[0] : names.length === 2 ? names.join(" and ") : `${names[0]} et al.`;
  return `${who} (${rest.slice(0, 4)})`;
};

const ordinals = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"];
const ordinal = (i: number) => ordinals[i] ?? `No. ${i + 1}`;

// One left column runs the length of the page, so the reading list and the
// footer hang off the same edge.
const rail = "lg:grid-cols-[15rem_minmax(0,1fr)]";
const label = "font-mono text-[0.7rem] uppercase tracking-[0.16em]";

export default function QuantitativeResearchPage() {
  return (
    <main className="relative min-h-screen pb-24">
      <header className="mx-auto max-w-6xl px-6 pt-28 sm:pt-40">
        <p className={`${label} text-signal-deep`}>{eyebrow}</p>
        <h1 className="font-display mt-5 text-balance text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink">
          {heading}
        </h1>
        {/* the Get involved bars, stood upright beside the intro: the first
            runs its full height, the second is shorter */}
        <div className="mt-6 flex items-stretch gap-5 sm:gap-6">
          <div aria-hidden="true" className="flex shrink-0 gap-1.5">
            <span className="w-1.5 bg-ink" />
            <span className="h-3/5 w-1.5 bg-signal" />
          </div>
          <p className="max-w-[36rem] text-lg leading-relaxed text-navy/70 sm:text-xl">{intro}</p>
        </div>
      </header>

      {/* Each study: the question, what it is compared with, and its paper
          trading, which carries the results once they exist. New studies
          only need an entry in content. */}
      {studies.items.map((p, i) => {
        const results = p.paper.results;
        const rows = results?.rows ?? [...p.strategies, ...p.benchmarks].map((name) => ({ name, ret: "", vol: "", sharpe: "" }));
        return (
          <article
            key={p.name}
            id={`study-${i + 1}`}
            aria-labelledby={`study-${i + 1}-name`}
            className="mx-auto mt-16 max-w-6xl scroll-mt-28 px-6 sm:mt-20"
          >
            {/* each study is its own box, so later studies stack as peers */}
            <div className="border border-navy/15 bg-navy/[0.03] p-6 shadow-[0_1px_2px_rgb(14_24_48/0.04),0_18px_44px_-24px_rgb(14_24_48/0.2)] sm:p-10">
              <p className={`${label} text-signal-deep`}>
                {ordinal(i)} {studies.label}
              </p>
              <h2
                id={`study-${i + 1}-name`}
                className="font-display mt-4 text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-4xl"
              >
                {p.name}
              </h2>
              <p className="font-display mt-4 max-w-[46rem] text-balance text-lg leading-snug tracking-tight text-navy/85 sm:text-xl">
                {p.question}
              </p>

              <div className="mt-10 grid grid-cols-1 gap-8 sm:mt-12">
                {/* paper trading: setup, then results */}
                <section
                  aria-labelledby={`study-${i + 1}-paper`}
                  className="border border-navy/15 bg-white"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-6 sm:px-8 sm:pt-7">
                    <h3 id={`study-${i + 1}-paper`} className="font-display text-xl font-bold tracking-tight text-ink">
                      {studies.paperLabel}
                    </h3>
                    <p className="inline-flex items-center gap-2 bg-navy/[0.05] px-3 py-1 text-xs font-medium text-navy/70">
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${results ? "bg-signal" : "border border-navy/50"}`}
                      />
                      {p.paper.status}
                    </p>
                  </div>

                  <dl className="mt-5 grid gap-4 px-6 sm:grid-cols-3 sm:px-8">
                    {p.paper.terms.map((t) => (
                      <div key={t.label}>
                        <dt className="text-sm text-navy/55">{t.label}</dt>
                        <dd className="mt-0.5 text-base font-medium text-ink">{t.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-7 border-t border-navy/8 px-6 pb-6 pt-5 sm:px-8 sm:pb-7">
                    <p className={`${label} text-navy/55`}>
                      {studies.resultsLabel}
                      {results && <span className="text-navy/40"> · {results.asOf}</span>}
                    </p>
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full min-w-[26rem] text-left text-sm">
                        <thead>
                          <tr className="border-b border-navy/10 text-navy/55">
                            {studies.resultsColumns.map((c, j) => (
                              <th key={c} scope="col" className={`py-2.5 font-medium ${j > 0 ? "text-right" : ""}`}>
                                {c}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="tabular-nums">
                          {rows.map((r, j) => (
                            <tr key={r.name} className="border-b border-navy/8 last:border-b-0">
                              <th scope="row" className={`py-2.5 font-medium ${j === 0 ? "text-ink" : "text-navy/75"}`}>
                                {r.name}
                              </th>
                              {[r.ret, r.vol, r.sharpe].map((v, k) => (
                                <td key={k} className="py-2.5 text-right font-mono text-navy/75">
                                  {v || <span className="text-navy/30">—</span>}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {!results && <p className="mt-3 text-xs text-navy/50">{studies.resultsPending}</p>}
                  </div>
                </section>

                {/* historical testing: the headline finding and its table */}
                <section
                  aria-labelledby={`study-${i + 1}-backtest`}
                  className="border border-navy/15 bg-white"
                >
                  <div className="px-6 pt-6 sm:px-8 sm:pt-7">
                    <h3 id={`study-${i + 1}-backtest`} className="font-display text-xl font-bold tracking-tight text-ink">
                      {studies.backtestLabel}
                    </h3>
                    <p className="font-display mt-3 text-lg font-semibold leading-snug tracking-tight text-ink">
                      {p.backtest.headline}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-navy/65">{p.backtest.summary}</p>
                  </div>
                  <div className="mt-6 border-t border-navy/8 px-6 pb-6 pt-5 sm:px-8 sm:pb-7">
                    <p className={`${label} text-navy/55`}>{p.backtest.period}</p>
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full min-w-[26rem] text-left text-sm">
                        <thead>
                          <tr className="border-b border-navy/10 text-navy/55">
                            {studies.backtestColumns.map((c, j) => (
                              <th key={c} scope="col" className={`py-2.5 font-medium ${j > 0 ? "text-right" : ""}`}>
                                {c}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="tabular-nums">
                          {p.backtest.rows.map((r) => (
                            <tr key={r.name} className="border-b border-navy/8 last:border-b-0">
                              <th
                                scope="row"
                                className={`py-2.5 font-medium ${(p.strategies as readonly string[]).includes(r.name) ? "text-ink" : "text-navy/75"}`}
                              >
                                {r.name}
                              </th>
                              {[r.vol, r.maxdd, r.sharpe].map((v, k) => (
                                <td key={k} className="py-2.5 text-right font-mono text-navy/75">
                                  {v}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                <dl className="mt-2">
                  <div>
                    <dt className={`${label} border-b border-navy/12 pb-3 text-navy/55`}>{studies.readingLabel}</dt>
                    <dd className="mt-3 flex flex-col gap-2">
                      {p.reading.map((n) => (
                        <a
                          key={n}
                          href={`#ref-${n}`}
                          className="w-fit text-base text-signal-deep underline decoration-signal-deep/25 underline-offset-4 transition hover:decoration-signal-deep"
                        >
                          {shortCite(n)}
                        </a>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </article>
        );
      })}

      {/* the reading list, as a bibliography on the same rail */}
      <section
        aria-labelledby="reading"
        className={`mx-auto mt-24 grid max-w-6xl grid-cols-1 gap-8 px-6 sm:mt-28 ${rail} lg:gap-0`}
      >
        <div className="lg:pr-10">
          <h2 id="reading" className="font-display text-3xl font-extrabold tracking-[-0.03em] text-ink">
            {reading.heading}
          </h2>
        </div>
        {/* on phones each group is a card in a swipe row */}
        <Swipe label={reading.heading} count={groups.length}>
          <div className="swipe space-y-10 [--swipe-w:86%]">
            {groups.map((g) => (
              <div key={g.name}>
                <h3 className={`${label} border-b border-navy/12 pb-3 text-navy/55`}>{g.name}</h3>
                <ol className="mt-4 space-y-3.5">
                  {g.items.map((cite, i) => (
                    <li
                      key={cite}
                      id={`ref-${g.start + i}`}
                      className="grid scroll-mt-28 grid-cols-[2.5rem_minmax(0,1fr)] target:bg-signal/[0.07]"
                    >
                      <span className="font-mono text-xs tabular-nums leading-relaxed text-signal-deep">
                        [{g.start + i}]
                      </span>
                      <p className="text-[0.9375rem] leading-relaxed text-navy/80">{cite}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Swipe>
      </section>

      <footer className={`mx-auto mt-24 grid max-w-6xl grid-cols-1 gap-8 px-6 sm:mt-28 ${rail} lg:gap-0`}>
        <div />
        <div>
          <div className="flex flex-col gap-5 border-t border-navy/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-2xl font-bold tracking-tight text-ink">{join.text}</p>
            <Button href={join.href} variant="signal">
              {join.label}
            </Button>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-navy/50">{disclaimer}</p>
        </div>
      </footer>
    </main>
  );
}
