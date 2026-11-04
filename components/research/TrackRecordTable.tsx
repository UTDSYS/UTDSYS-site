"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Rating } from "@/lib/content";
import { formatDate, formatPct, formatPrice } from "@/lib/research";
import RatingBadge from "@/components/research/RatingBadge";

/** One published call, with its performance worked out on the server. */
export type TrackRow = {
  slug: string;
  company: string;
  ticker: string;
  exchange: string;
  date: string;
  rating: Rating;
  currency: string;
  entry: number;
  target: number;
  /** Open, or how and when the call closed; null when prices are unavailable */
  status: { label: string; t: number | null } | null;
  /** the live price while open, the exit price once closed; null when unavailable */
  current: number | null;
  ret: number | null;
  /** stock return minus benchmark return over the same period */
  relative: number | null;
  benchmark: string;
};

type Key = "company" | "date" | "rating" | "status" | "entry" | "target" | "current" | "ret" | "relative";

const columns: { key: Key; label: string; numeric?: boolean }[] = [
  { key: "company", label: "Company" },
  { key: "date", label: "Published" },
  { key: "rating", label: "Rating" },
  { key: "status", label: "Status" },
  { key: "entry", label: "Entry", numeric: true },
  { key: "target", label: "Target", numeric: true },
  { key: "current", label: "Last / Exit", numeric: true },
  { key: "ret", label: "Return", numeric: true },
  { key: "relative", label: "vs Benchmark", numeric: true },
];

const ratingOrder: Record<Rating, number> = { Buy: 0, Hold: 1, Sell: 2 };

function sortValue(r: TrackRow, key: Key): number | string | null {
  if (key === "rating") return ratingOrder[r.rating];
  if (key === "status") return r.status?.label ?? null;
  return r[key];
}

/** A signed return, coloured only by direction. */
function Move({ value }: { value: number | null }) {
  if (value === null) return <span className="text-navy/35">—</span>;
  return (
    <span className={value >= 0 ? "text-[#047857]" : "text-[#b91c1c]"}>{formatPct(value)}</span>
  );
}

/** The sort direction marker; it keeps its space so headings don't shift. */
function Arrow({ show, dir }: { show: boolean; dir: 1 | -1 }) {
  return (
    <span aria-hidden="true" className={`text-[0.6rem] ${show ? "opacity-100" : "opacity-0"}`}>
      {dir === 1 ? "▲" : "▼"}
    </span>
  );
}

/**
 * Every published call as a sortable table: click a heading to sort by it
 * (again to flip the order); click a row to open the report.
 */
export default function TrackRecordTable({ rows }: { rows: TrackRow[] }) {
  const router = useRouter();
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: "date", dir: -1 });

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const x = sortValue(a, sort.key);
      const y = sortValue(b, sort.key);
      // missing values always sink to the bottom
      if (x === null && y === null) return 0;
      if (x === null) return 1;
      if (y === null) return -1;
      return (x < y ? -1 : x > y ? 1 : 0) * sort.dir;
    });
  }, [rows, sort]);

  const toggle = (key: Key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: key === "company" ? 1 : -1 }));

  return (
    <div className="overflow-x-auto rounded-sm border border-navy/12 bg-white">
      <table className="w-full min-w-[64rem] border-collapse font-mono text-sm tabular-nums">
        <thead>
          <tr className="border-b border-navy/12 bg-offwhite/70">
            {columns.map((c) => {
              const active = sort.key === c.key;
              return (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"}
                  className={`px-4 py-3 font-normal ${c.numeric ? "text-right" : "text-left"}`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(c.key)}
                    className={`inline-flex items-center gap-1 text-[0.7rem] uppercase tracking-[0.08em] transition hover:text-ink ${
                      active ? "text-ink" : "text-navy/50"
                    }`}
                  >
                    {c.numeric && <Arrow show={active} dir={sort.dir} />}
                    {c.label}
                    {!c.numeric && <Arrow show={active} dir={sort.dir} />}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr
              key={r.slug}
              onClick={() => router.push(`/fundamental-research/${r.slug}`)}
              className="cursor-pointer border-b border-navy/8 transition last:border-0 hover:bg-signal/[0.04]"
            >
              <td className="px-4 py-4">
                <Link
                  href={`/fundamental-research/${r.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="font-sans text-[0.9375rem] font-semibold text-ink hover:text-signal-deep"
                >
                  {r.company}
                </Link>
                <div className="mt-0.5 text-[0.7rem] uppercase tracking-[0.08em] text-navy/50">
                  {r.exchange}: {r.ticker}
                </div>
              </td>
              <td className="px-4 py-4 text-navy/70">{formatDate(r.date)}</td>
              <td className="px-4 py-4">
                <RatingBadge rating={r.rating} />
              </td>
              <td className="px-4 py-4">
                {r.status === null ? (
                  <span className="text-navy/35">—</span>
                ) : r.status.t === null ? (
                  <span className="inline-flex items-center gap-1.5 font-sans text-sm text-navy/75">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />
                    {r.status.label}
                  </span>
                ) : (
                  <span className="block">
                    <span className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-ink">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ink" />
                      {r.status.label}
                    </span>
                    <span className="mt-0.5 block text-[0.7rem] text-navy/50">{formatDate(new Date(r.status.t).toISOString().slice(0, 10))}</span>
                  </span>
                )}
              </td>
              <td className="px-4 py-4 text-right text-navy/70">{formatPrice(r.currency, r.entry)}</td>
              <td className="px-4 py-4 text-right text-ink">{formatPrice(r.currency, r.target)}</td>
              <td className="px-4 py-4 text-right text-ink">
                {r.current === null ? <span className="text-navy/35">—</span> : formatPrice(r.currency, r.current)}
              </td>
              <td className="px-4 py-4 text-right">
                <Move value={r.ret} />
              </td>
              <td className="px-4 py-4 text-right">
                <Move value={r.relative} />
                <div className="mt-0.5 font-sans text-xs text-navy/45">{r.benchmark}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
