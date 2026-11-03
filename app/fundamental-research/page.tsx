import Link from "next/link";
import Button from "@/components/ui/Button";
import RatingBadge from "@/components/research/RatingBadge";
import ProcessExplorer from "@/components/research/ProcessExplorer";
import content from "@/lib/content";
import { byNewest, formatDate, formatPct, formatPrice, upside } from "@/lib/research";

export const metadata = {
  title: "Who We Are — Fundamental Research — UofT Decision Systems",
  description:
    "UofT Decision Systems Fundamental Research: bottom-up company research with a top-down view of the economy, focused on durable businesses the market has mispriced.",
};

const { about, disclaimer, reports } = content.fundamentalResearch;
const { hero, approach, coverage, process, latest, standards, join } = about;

const label = "font-mono text-[0.75rem] uppercase tracking-[0.1em]";
const num = (i: number) => String(i + 1).padStart(2, "0");
// each section hangs its title off one left rail, as on the quant page
const row = "grid grid-cols-1 gap-8 border-t border-navy/12 pt-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-0";

/** A section's number and title, set large enough to lead the section. */
function SectionTitle({ n, id, children, onDark = false }: { n: number; id: string; children: string; onDark?: boolean }) {
  return (
    <div className="lg:pr-10">
      <span className={`font-mono text-xs tabular-nums ${onDark ? "text-[rgb(122_162_255)]" : "text-signal-deep"}`}>
        {num(n)}
      </span>
      <h2
        id={id}
        className={`font-display mt-2 text-balance text-[1.75rem] font-semibold leading-tight tracking-[-0.01em] sm:text-[2rem] ${
          onDark ? "text-white" : "text-ink"
        }`}
      >
        {children}
      </h2>
    </div>
  );
}

export default function FundamentalAboutPage() {
  const newest = [...reports].filter((r) => !r.sample).sort(byNewest).slice(0, 2);

  return (
    <main className="relative min-h-screen overflow-x-clip">
      {/* hero: the page's name over a photo, darkened on the left so the text reads */}
      <section aria-labelledby="hero" className="relative isolate overflow-hidden bg-crest text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero.image})` }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(6_14_36/0.96)_0%,rgb(6_14_36/0.82)_38%,rgb(6_14_36/0.35)_75%,rgb(6_14_36/0.2)_100%)]"
        />
        {/* phones put the text over the whole photo, so darken it all */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgb(6_14_36/0.55)] md:hidden" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-[linear-gradient(0deg,rgb(6_14_36/0.85),transparent)]"
        />

        <div className="mx-auto flex min-h-[min(40rem,80vh)] max-w-7xl flex-col justify-center px-6 pb-20 pt-32 sm:pt-36">
          <div className="max-w-2xl">
            <p className={`${label} text-[rgb(122_162_255)]`}>{hero.eyebrow}</p>
            {/* same size as the Published Research title, so the two pages pair */}
            <h1
              id="hero"
              className="font-display mt-4 text-balance text-[clamp(2.5rem,5.5vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.015em]"
            >
              {hero.title}
            </h1>
            <div aria-hidden="true" className="mt-7 flex gap-1.5">
              <span className="h-1.5 w-24 bg-white sm:w-32" />
              <span className="h-1.5 w-10 bg-signal sm:w-14" />
            </div>
            <p className="mt-7 max-w-[34rem] text-lg leading-relaxed text-white/75 sm:text-xl">{hero.body}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button href={hero.primary.href} variant="signal">
                {hero.primary.label}
              </Button>
              <Link href={hero.secondary.href} className={`${label} group text-white/75 transition hover:text-white`}>
                {hero.secondary.label}{" "}
                <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-24 px-6 py-24 sm:space-y-28 sm:py-28">
        {/* philosophy: where we sit, then the three principles */}
        <section aria-labelledby="approach" className={row}>
          <SectionTitle n={0} id="approach">
            {approach.heading}
          </SectionTitle>
          <div>
            <p className="max-w-3xl text-lg leading-relaxed text-navy/75 sm:text-xl">{approach.intro}</p>
            <ol className="mt-12 grid gap-4 md:grid-cols-3">
              {approach.items.map((a, i) => (
                <li
                  key={a.title}
                  className="group rounded-sm border border-navy/12 bg-white p-7 transition hover:-translate-y-0.5 hover:border-navy/25 hover:shadow-[0_14px_40px_-22px_rgb(14_24_48/0.35)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tabular-nums text-signal-deep">{num(i)}</span>
                    <span aria-hidden="true" className="h-[3px] w-6 bg-navy/15 transition-all group-hover:w-10 group-hover:bg-signal" />
                  </div>
                  <h3 className="font-display mt-5 text-xl font-semibold tracking-tight text-ink">{a.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-navy/70">{a.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* coverage: three areas */}
        <section aria-labelledby="coverage" className={row}>
          <SectionTitle n={1} id="coverage">
            {coverage.heading}
          </SectionTitle>
          <ul className="grid gap-4 md:grid-cols-3">
            {coverage.items.map((c) => (
              <li
                key={c.title}
                className="flex flex-col rounded-sm border border-navy/12 bg-white p-7 transition hover:border-navy/25"
              >
                <span className={`${label} text-[0.7rem] text-signal-deep`}>{c.detail}</span>
                <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight text-ink">{c.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-navy/70">{c.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* process, on a full-width navy band: pick a step to read it in full */}
      <section id="process" aria-labelledby="process-heading" className="blue-band scroll-mt-20 text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-end lg:gap-0">
            <SectionTitle n={2} id="process-heading" onDark>
              {process.heading}
            </SectionTitle>
            <p className="max-w-2xl text-lg leading-relaxed text-white/70">{process.intro}</p>
          </div>
          <div className="mt-12">
            <ProcessExplorer steps={process.steps} label={process.heading} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-24 px-6 py-24 sm:space-y-28 sm:py-28">
        {/* the newest calls, straight from the record */}
        {newest.length > 0 && (
          <section aria-labelledby="latest" className={row}>
            <div className="flex flex-col gap-5">
              <SectionTitle n={3} id="latest">
                {latest.heading}
              </SectionTitle>
              <Link
                href="/fundamental-research/reports"
                className={`${label} group hidden text-[0.7rem] text-signal-deep lg:inline`}
              >
                {latest.all}{" "}
                <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
            <div>
              <ul className="grid gap-4 md:grid-cols-2">
                {newest.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/fundamental-research/${r.slug}`}
                      className="group flex h-full flex-col rounded-sm border border-navy/12 bg-white p-7 transition hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-[0_14px_40px_-20px_rgb(14_24_48/0.35)]"
                    >
                      <div className={`${label} flex items-center justify-between gap-4 text-[0.7rem] text-navy/55`}>
                        <span className="font-semibold text-ink">
                          {r.exchange}: {r.ticker}
                        </span>
                        <span>{formatDate(r.date)}</span>
                      </div>
                      <h3 className="font-display mt-5 text-2xl font-semibold tracking-tight text-ink transition group-hover:text-signal-deep">
                        {r.company}
                      </h3>
                      <p className="font-display mb-7 mt-2 text-lg leading-snug text-signal-deep">{r.headline}</p>
                      <div className="mt-auto flex items-end justify-between gap-4 border-t border-navy/10 pt-5">
                        <div className="flex items-center gap-3">
                          <RatingBadge rating={r.rating} />
                          <span className="font-mono text-xs uppercase tracking-[0.08em] text-navy/50">
                            {r.horizon ?? "12-month"} target
                          </span>
                        </div>
                        <div className="text-right font-mono tabular-nums">
                          <div className="text-lg text-ink">{formatPrice(r.currency, r.priceTarget)}</div>
                          <div className="text-xs text-navy/55">{formatPct(upside(r))} at publication</div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/fundamental-research/reports"
                className={`${label} group mt-6 inline-block text-[0.7rem] text-signal-deep lg:hidden`}
              >
                {latest.all} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>
        )}

        {/* accountability: one statement */}
        <section aria-labelledby="standards" className={row}>
          <SectionTitle n={newest.length > 0 ? 4 : 3} id="standards">
            {standards.heading}
          </SectionTitle>
          <p className="font-display max-w-4xl text-balance text-xl leading-snug tracking-[-0.005em] text-ink sm:text-2xl">
            {standards.body}
          </p>
        </section>

        <footer>
          <div className="flex flex-col gap-6 border-t border-navy/12 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{join.text}</p>
            <Button href={join.href} variant="primary">
              {join.label}
            </Button>
          </div>
          <p className="mt-8 max-w-4xl text-xs leading-relaxed text-navy/45">{disclaimer}</p>
        </footer>
      </div>
    </main>
  );
}
