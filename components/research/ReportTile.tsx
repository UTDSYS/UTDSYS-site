import Link from "next/link";
import type { ResearchReport } from "@/lib/content";
import { formatDate, formatPct, formatPrice, upside } from "@/lib/research";
import RatingBadge from "@/components/research/RatingBadge";

/** A report in brief, for the index's list of everything; opens its page. */
export default function ReportTile({ report }: { report: ResearchReport }) {
  return (
    <Link
      href={`/fundamental-research/${report.slug}`}
      className="group flex h-full flex-col rounded-sm border border-navy/12 bg-white p-5 transition hover:border-navy/30 hover:shadow-[0_12px_40px_-20px_rgb(14_24_48/0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
    >
      <div className="flex items-center justify-between gap-3 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-navy/60">
        <span className="font-semibold text-ink">
          {report.exchange}: {report.ticker}
        </span>
        <span>{formatDate(report.date)}</span>
      </div>
      <h3 className="font-display mt-4 text-xl font-semibold tracking-tight text-ink transition group-hover:text-signal-deep">
        {report.company}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-navy/70">{report.headline}</p>
      <p className="mb-5 mt-2 text-sm font-medium text-ink">{report.analysts.join(" · ")}</p>
      <div className="mt-auto flex items-end justify-between gap-3 border-t border-navy/10 pt-4">
        <RatingBadge rating={report.rating} />
        <div className="text-right font-mono tabular-nums">
          <div className="text-base text-ink">{formatPrice(report.currency, report.priceTarget)}</div>
          <div className="text-xs text-navy/55">{formatPct(upside(report))}</div>
        </div>
      </div>
    </Link>
  );
}
