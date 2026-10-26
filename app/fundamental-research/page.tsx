import content from "@/lib/content";
import { byNewest } from "@/lib/research";
import ReportCard from "@/components/research/ReportCard";
import Disclosures from "@/components/research/Disclosures";

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
  coverageHeading,
  process,
  reports,
} = content.fundamentalResearch;

export default function FundamentalResearchPage() {
  const sorted = [...reports].sort(byNewest);
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

        {/* every report, newest first; each card opens its page */}
        <section aria-labelledby="coverage" className="mt-12">
          <h2 id="coverage" className="sr-only">
            {coverageHeading}
          </h2>
          <ul className="space-y-6">
            {sorted.map((r) => (
              <li key={r.slug}>
                <ReportCard report={r} />
              </li>
            ))}
          </ul>
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

        <Disclosures />
      </div>
    </main>
  );
}
