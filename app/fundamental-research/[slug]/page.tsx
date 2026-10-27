import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import content from "@/lib/content";
import { formatDate, formatPct, formatPrice, upside } from "@/lib/research";
import { fetchQuote } from "@/lib/quotes";
import RatingBadge from "@/components/research/RatingBadge";
import CallTracker from "@/components/research/CallTracker";
import Disclosures from "@/components/research/Disclosures";

const { backLabel, trackerLabel, reportHeading, reportPending, reports } =
  content.fundamentalResearch;

type Props = { params: Promise<{ slug: string }> };

// Only the reports in content exist; anything else is a 404.
export const dynamicParams = false;
export const generateStaticParams = () => reports.map((r) => ({ slug: r.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const report = reports.find((r) => r.slug === slug);
  if (!report) return {};
  return {
    title: `${report.company} (${report.exchange}:${report.ticker}) — UofT Decision Systems`,
    description: `${report.rating}: ${report.headline}. ${report.summary}`,
  };
}

export default async function ReportPage({ params }: Props) {
  const { slug } = await params;
  const report = reports.find((r) => r.slug === slug);
  if (!report) notFound();
  const quote = report.quoteSymbol ? await fetchQuote(report.quoteSymbol) : null;

  return (
    <main className="relative min-h-screen">
      <div className="mx-auto max-w-7xl px-6 pb-28 pt-28 sm:pt-36">
        <Link
          href="/fundamental-research"
          className="group inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-navy/50 transition hover:text-signal-deep"
        >
          <span aria-hidden="true" className="transition group-hover:-translate-x-1">
            ←
          </span>
          {backLabel}
        </Link>

        {/* the call in one line; the full card lives on the index */}
        <header className="mt-6 flex flex-wrap items-end justify-between gap-8 border-b border-navy/12 pb-8">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-navy/50">
              <span>{formatDate(report.date)}</span>
              <span aria-hidden="true">·</span>
              <span>{report.sector}</span>
              <span aria-hidden="true">·</span>
              <span>
                {report.exchange}:{report.ticker}
              </span>
              <span aria-hidden="true">·</span>
              <span>{report.analysts.join(", ")}</span>
            </div>
            <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-ink md:text-5xl">
              {report.company}
            </h1>
            <p className="font-display mt-3 text-xl leading-snug tracking-tight text-signal-deep md:text-2xl">
              {report.headline}
            </p>
          </div>
          <div className="flex items-center gap-6 font-mono tabular-nums">
            <RatingBadge rating={report.rating} size="lg" />
            <div>
              <div className="text-[0.6rem] uppercase tracking-[0.2em] text-navy/45">
                {report.horizon ?? "12-month"} target
              </div>
              <div className="font-display mt-1 text-2xl font-semibold tracking-tight text-ink [font-variant-numeric:normal]">
                {formatPrice(report.currency, report.priceTarget)}
              </div>
              <div className="text-xs text-navy/55">
                {formatPct(upside(report))} from{" "}
                {formatPrice(report.currency, report.priceAtPublication)}
              </div>
            </div>
          </div>
        </header>

        {report.quoteSymbol && <CallTracker report={report} initial={quote} label={trackerLabel} />}

        {/* the write-up itself */}
        <section aria-labelledby="full-report" className="mt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2
              id="full-report"
              className="font-display text-2xl font-bold tracking-tight text-ink"
            >
              {reportHeading}
            </h2>
            {report.pdf && (
              <a
                href={report.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-signal-deep underline decoration-signal-deep/30 underline-offset-4 transition hover:decoration-signal-deep"
              >
                Open PDF ↗
              </a>
            )}
          </div>
          {report.pdf ? (
            <object
              data={report.pdf}
              type="application/pdf"
              className="mt-6 h-[85vh] w-full rounded-sm border border-navy/12 bg-white"
            >
              <p className="p-8 text-sm text-navy/60">
                This browser can&apos;t show the PDF inline.{" "}
                <a href={report.pdf} className="text-signal-deep underline">
                  Download it
                </a>
                .
              </p>
            </object>
          ) : (
            <div className="mt-6 flex min-h-[14rem] sm:min-h-[22rem] flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-navy/20 bg-white/40 px-6 text-center">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-navy/45">
                PDF · {report.exchange}:{report.ticker}
              </span>
              <p className="font-display text-xl font-semibold tracking-tight text-ink">
                Full report coming soon
              </p>
              <p className="max-w-md text-sm text-navy/55">{reportPending}</p>
            </div>
          )}
        </section>

        <Disclosures />
      </div>
    </main>
  );
}
