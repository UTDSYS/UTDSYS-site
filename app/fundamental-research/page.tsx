import content from "@/lib/content";
import { byNewest } from "@/lib/research";
import ReportCard from "@/components/research/ReportCard";
import Disclosures from "@/components/research/Disclosures";
import Swipe from "@/components/Swipe";
import Crest from "@/components/Crest";

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

  return (
    <main className="relative min-h-screen">
      <div className="mx-auto max-w-7xl px-6 pt-28 sm:pt-36">
        {/* masthead */}
        <header className="grid gap-10 border-b border-navy/12 pb-12 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-signal-deep">
              {eyebrow}
            </p>
            <h1 className="font-display mt-5 text-5xl font-bold tracking-tight text-ink md:text-6xl">
              {heading}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-navy/70 md:text-lg">{intro}</p>
          </div>
          {/* the seal, turning beside the headline */}
          <Crest tone="light" className="hidden w-[min(20vw,230px)] md:block" />
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

      </div>

      {/* process, on a full-width blue band */}
      <section aria-labelledby="process" className="blue-band mt-24 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <h2 id="process" className="font-display text-2xl font-bold tracking-tight">
            {process.heading}
          </h2>
          <Swipe label={process.heading} count={process.steps.length} className="mt-8" onDark>
            <ol className="swipe grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {process.steps.map((s, i) => (
                <li key={s.title} className="border-t border-white/15 pt-5">
                  <span className="font-mono text-[0.65rem] tracking-[0.2em] text-[rgb(122_162_255)]">
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
