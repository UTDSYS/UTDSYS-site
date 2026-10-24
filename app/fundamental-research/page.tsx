import Link from "next/link";
import content from "@/lib/content";
import { byNewest, formatDate, formatPct, formatPrice, upside } from "@/lib/research";
import RatingBadge from "@/components/research/RatingBadge";
import CoverageTable from "@/components/research/CoverageTable";

export const metadata = {
  title: "Fundamental Research — UofT Decision Systems",
  description:
    "Equity research from UofT Decision Systems: institutional-style reports on public companies, with ratings, price targets, and full write-ups.",
};

const {
  eyebrow,
  heading,
  intro,
  sampleNotice,
  featuredLabel,
  coverageHeading,
  process,
  ratings,
  disclaimer,
  reports,
} = content.fundamentalResearch;

export default function FundamentalResearchPage() {
  const sorted = [...reports].sort(byNewest);
  const [featured] = sorted;
  const hasSamples = sorted.some((r) => r.sample);
  const sectorCount = new Set(sorted.map((r) => r.sector)).size;

  return (
    <main className="relative min-h-screen">
      <div className="mx-auto max-w-7xl px-6 pb-28 pt-36">
        {/* masthead */}
        <header className="grid gap-10 border-b border-navy/12 pb-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-signal-deep">
              {eyebrow}
            </p>
            <h1 className="font-display mt-5 text-5xl font-bold tracking-tight text-ink md:text-6xl">
              {heading}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-navy/70 md:text-lg">{intro}</p>
          </div>
          <dl className="flex gap-10 font-mono tabular-nums">
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-navy/45">Reports</dt>
              <dd className="font-display mt-1 text-3xl font-semibold text-ink">{sorted.length}</dd>
            </div>
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-navy/45">Sectors</dt>
              <dd className="font-display mt-1 text-3xl font-semibold text-ink">{sectorCount}</dd>
            </div>
          </dl>
        </header>

        {hasSamples && (
          <p className="mt-6 rounded-md border border-dashed border-navy/20 px-4 py-3 font-mono text-[0.65rem] uppercase leading-relaxed tracking-[0.14em] text-navy/50">
            {sampleNotice}
          </p>
        )}

        {/* featured report */}
        {featured && (
          <section aria-labelledby="featured" className="mt-12">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-navy/45">
              {featuredLabel}
            </p>
            <article className="mt-4 grid overflow-hidden rounded-2xl border border-navy/12 bg-white/60 lg:grid-cols-[1.6fr_1fr]">
              <div className="p-8 md:p-10">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-navy/50">
                  <span>{formatDate(featured.date)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{featured.sector}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {featured.exchange}:{featured.ticker}
                  </span>
                  {featured.sample && (
                    <span className="rounded-sm border border-dashed border-navy/25 px-1.5 text-navy/40">
                      Sample
                    </span>
                  )}
                </div>
                <h2 id="featured" className="font-display mt-5 text-3xl font-bold tracking-tight text-ink md:text-4xl">
                  {featured.company}
                </h2>
                <p className="font-display mt-3 text-xl leading-snug tracking-tight text-signal-deep md:text-2xl">
                  {featured.headline}
                </p>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-navy/70">
                  {featured.summary}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                  {featured.pdf ? (
                    <a
                      href={featured.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-offwhite transition hover:bg-signal-deep"
                    >
                      Read the full report <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-navy/15 px-6 py-3 text-sm font-medium text-navy/40">
                      Full report coming soon
                    </span>
                  )}
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-navy/50">
                    {featured.analysts.join(" · ")}
                  </span>
                </div>
              </div>

              {/* the call and the numbers */}
              <aside className="border-t border-navy/10 bg-offwhite/70 p-8 md:p-10 lg:border-l lg:border-t-0">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-navy/45">
                    Rating
                  </span>
                  <RatingBadge rating={featured.rating} size="lg" />
                </div>
                <div className="mt-8 font-mono tabular-nums">
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] text-navy/45">
                    12-month price target
                  </span>
                  <div className="font-display mt-2 text-5xl font-semibold tracking-tight text-ink [font-variant-numeric:lining-nums]">
                    {formatPrice(featured.currency, featured.priceTarget)}
                  </div>
                  <div className="mt-2 text-sm text-navy/60">
                    {formatPct(upside(featured))} from{" "}
                    {formatPrice(featured.currency, featured.priceAtPublication)}
                  </div>
                </div>
                <dl className="mt-8 divide-y divide-navy/10 border-t border-navy/10 font-mono text-sm tabular-nums">
                  {featured.metrics.map((m) => (
                    <div key={m.label} className="flex items-center justify-between py-3">
                      <dt className="text-[0.65rem] uppercase tracking-[0.14em] text-navy/50">
                        {m.label}
                      </dt>
                      <dd className="text-ink">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </article>
          </section>
        )}

        {/* the full coverage list */}
        <section aria-labelledby="coverage" className="mt-20">
          <h2 id="coverage" className="font-display text-2xl font-bold tracking-tight text-ink">
            {coverageHeading}
          </h2>
          <div className="mt-6">
            <CoverageTable reports={sorted} />
          </div>
        </section>

        {/* process */}
        <section aria-labelledby="process" className="mt-24">
          <h2 id="process" className="font-display text-2xl font-bold tracking-tight text-ink">
            {process.heading}
          </h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process.steps.map((s, i) => (
              <li key={s.title} className="border-t border-navy/15 pt-5">
                <span className="font-mono text-[0.65rem] tracking-[0.2em] text-signal-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-3 text-lg font-semibold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/65">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ratings + disclosures */}
        <footer className="mt-24 grid gap-10 border-t border-navy/12 pt-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-navy/50">
              Rating definitions
            </h2>
            <dl className="mt-4 space-y-3">
              {ratings.map((r) => (
                <div key={r.rating} className="flex items-center gap-4">
                  <dt className="w-16 shrink-0">
                    <RatingBadge rating={r.rating} />
                  </dt>
                  <dd className="text-sm text-navy/65">{r.definition}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-navy/50">
              Disclosures
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-navy/55">{disclaimer}</p>
            <p className="mt-4 text-sm text-navy/55">
              Want to cover a name with us?{" "}
              <Link
                href="/get-involved"
                className="font-medium text-signal-deep underline decoration-signal-deep/30 underline-offset-4 transition hover:decoration-signal-deep"
              >
                Get involved
              </Link>
              .
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
