import content from "@/lib/content";
import { byNewest } from "@/lib/research";
import ReportExhibit from "@/components/research/ReportExhibit";
import ReportTile from "@/components/research/ReportTile";
import Disclosures from "@/components/research/Disclosures";
import Swipe from "@/components/Swipe";
import Crest from "@/components/Crest";

export const metadata = {
  title: "Fundamental Research — UofT Decision Systems",
  description:
    "Fundamental research from UofT Decision Systems: institutional-style reports on public companies, with ratings, price targets, and full write-ups.",
};

const {
  heading,
  sampleNotice,
  coverageHeading,
  allHeading,
  process,
  reports,
} = content.fundamentalResearch;

export default function FundamentalResearchPage() {
  const sorted = [...reports].sort(byNewest);
  const hasSamples = sorted.some((r) => r.sample);

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <div className="mx-auto max-w-7xl px-6 pt-28 sm:pt-36">
        {/* masthead */}
        <header className="grid gap-10 border-b border-navy/12 pb-12 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-2xl">
            <h1 className="font-display text-balance text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.01em] text-ink">
              {heading}
            </h1>
            {/* the Get involved bars laid end to end on one line: where the
                price is, then the shorter run to the target */}
            <div aria-hidden="true" className="mt-7 flex gap-1.5">
              <span className="h-2 w-32 bg-ink sm:w-44" />
              <span className="h-2 w-14 bg-signal sm:w-20" />
            </div>
          </div>
          {/* the seal, turning beside the headline */}
          <Crest tone="light" className="hidden w-[min(20vw,230px)] md:block" />
        </header>

        {hasSamples && (
          <p className="mt-6 rounded-md border border-dashed border-navy/20 px-4 py-3 font-mono text-[0.75rem] uppercase leading-relaxed tracking-[0.08em] text-navy/50">
            {sampleNotice}
          </p>
        )}

        {/* every report, newest first, one at a time with its neighbours
            beside it; the front card opens its page */}
        <section aria-labelledby="coverage" className="mt-12">
          <h2 id="coverage" className="sr-only">
            {coverageHeading}
          </h2>
          <ReportExhibit reports={sorted} label={coverageHeading} />
        </section>

        {/* everything at a glance, newest first */}
        <section aria-labelledby="all-reports" className="mt-20">
          <div className="flex items-baseline justify-between gap-4 border-b border-navy/12 pb-4">
            <h2 id="all-reports" className="font-display text-2xl font-semibold tracking-tight text-ink">
              {allHeading}
            </h2>
            <span className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-navy/50">
              {sorted.length} {sorted.length === 1 ? "report" : "reports"}
            </span>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sorted.map((r) => (
              <li key={r.slug}>
                <ReportTile report={r} />
              </li>
            ))}
          </ul>
        </section>

      </div>

      {/* process, on a full-width blue band */}
      <section aria-labelledby="process" className="blue-band mt-24 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <h2 id="process" className="font-display text-2xl font-semibold tracking-tight">
            {process.heading}
          </h2>
          <Swipe label={process.heading} count={process.steps.length} className="mt-8" onDark>
            <ol className="swipe grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {process.steps.map((s, i) => (
                <li key={s.title} className="border-t border-white/15 pt-5">
                  <span className="font-mono text-[0.75rem] tracking-[0.08em] text-[rgb(122_162_255)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display mt-3 text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{s.body}</p>
                </li>
              ))}
            </ol>
          </Swipe>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-28">
        <Disclosures />
      </div>
    </main>
  );
}
