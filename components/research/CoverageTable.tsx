"use client";

import { useState } from "react";
import type { Rating, ResearchReport } from "@/lib/content";
import { formatDate, formatPct, formatPrice, upside } from "@/lib/research";
import RatingBadge from "@/components/research/RatingBadge";

const RATINGS: Rating[] = ["Buy", "Hold", "Sell"];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] transition ${
        active
          ? "border-ink bg-ink text-white"
          : "border-navy/15 text-navy/60 hover:border-navy/40 hover:text-navy"
      }`}
    >
      {children}
    </button>
  );
}

function ReportLink({ report }: { report: ResearchReport }) {
  if (!report.pdf) {
    return (
      <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-navy/30">
        Soon
      </span>
    );
  }
  return (
    <a
      href={report.pdf}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-signal-deep underline decoration-signal-deep/30 underline-offset-4 transition hover:decoration-signal-deep"
    >
      PDF ↗
    </a>
  );
}

/** Every published report, newest first, filterable by sector and rating. */
export default function CoverageTable({ reports }: { reports: ResearchReport[] }) {
  const [sector, setSector] = useState<string | null>(null);
  const [rating, setRating] = useState<Rating | null>(null);

  const sectors = [...new Set(reports.map((r) => r.sector))].sort();
  const rows = reports.filter(
    (r) => (!sector || r.sector === sector) && (!rating || r.rating === rating),
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Chip active={sector === null} onClick={() => setSector(null)}>
          All sectors
        </Chip>
        {sectors.map((s) => (
          <Chip key={s} active={sector === s} onClick={() => setSector(sector === s ? null : s)}>
            {s}
          </Chip>
        ))}
        <span className="mx-2 hidden h-4 w-px bg-navy/15 sm:block" aria-hidden="true" />
        {RATINGS.map((r) => (
          <Chip key={r} active={rating === r} onClick={() => setRating(rating === r ? null : r)}>
            {r}
          </Chip>
        ))}
      </div>

      {/* md+: a proper table */}
      <table className="mt-8 hidden w-full border-collapse text-left md:table">
        <thead>
          <tr className="border-b border-navy/15 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-navy/45">
            <th className="py-3 pr-4 font-normal">Date</th>
            <th className="py-3 pr-4 font-normal">Company</th>
            <th className="py-3 pr-4 font-normal">Sector</th>
            <th className="py-3 pr-4 font-normal">Rating</th>
            <th className="py-3 pr-4 text-right font-normal">Price</th>
            <th className="py-3 pr-4 text-right font-normal">Target</th>
            <th className="py-3 pr-4 text-right font-normal">Upside</th>
            <th className="py-3 text-right font-normal">Report</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {rows.map((r) => (
            <tr
              key={`${r.ticker}-${r.date}`}
              className="group border-b border-navy/8 transition-colors hover:bg-white/70"
            >
              <td className="py-5 pr-4 align-top font-mono text-xs text-navy/55">
                {formatDate(r.date)}
              </td>
              <td className="py-5 pr-4 align-top">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-base font-semibold tracking-tight text-ink">
                    {r.company}
                  </span>
                  <span className="font-mono text-[0.65rem] tracking-[0.1em] text-navy/50">
                    {r.exchange}:{r.ticker}
                  </span>
                  {r.sample && (
                    <span className="rounded-sm border border-dashed border-navy/25 px-1.5 font-mono text-[0.55rem] uppercase tracking-[0.15em] text-navy/40">
                      Sample
                    </span>
                  )}
                </div>
                <p className="mt-1 max-w-md text-sm text-navy/60">{r.headline}</p>
              </td>
              <td className="py-5 pr-4 align-top text-sm text-navy/70">{r.sector}</td>
              <td className="py-5 pr-4 align-top">
                <RatingBadge rating={r.rating} />
              </td>
              <td className="py-5 pr-4 text-right align-top font-mono text-sm text-navy/70">
                {formatPrice(r.currency, r.priceAtPublication)}
              </td>
              <td className="py-5 pr-4 text-right align-top font-mono text-sm text-ink">
                {formatPrice(r.currency, r.priceTarget)}
              </td>
              <td className="py-5 pr-4 text-right align-top font-mono text-sm text-ink">
                {formatPct(upside(r))}
              </td>
              <td className="py-5 text-right align-top">
                <ReportLink report={r} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* below md: stacked rows */}
      <ul className="mt-6 divide-y divide-navy/10 border-y border-navy/10 md:hidden">
        {rows.map((r) => (
          <li key={`${r.ticker}-${r.date}`} className="py-5">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[0.65rem] text-navy/50">
                {formatDate(r.date)} · {r.sector}
              </span>
              <RatingBadge rating={r.rating} />
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
              <span className="font-display text-lg font-semibold tracking-tight text-ink">
                {r.company}
              </span>
              <span className="font-mono text-[0.65rem] text-navy/50">
                {r.exchange}:{r.ticker}
              </span>
              {r.sample && (
                <span className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-navy/40">
                  Sample
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-navy/60">{r.headline}</p>
            <div className="mt-3 flex items-center justify-between font-mono text-xs tabular-nums text-navy/70">
              <span>
                PT {formatPrice(r.currency, r.priceTarget)}{" "}
                <span className="text-ink">({formatPct(upside(r))})</span>
              </span>
              <ReportLink report={r} />
            </div>
          </li>
        ))}
      </ul>

      {rows.length === 0 && (
        <p className="py-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-navy/40">
          No reports match those filters
        </p>
      )}
    </div>
  );
}
