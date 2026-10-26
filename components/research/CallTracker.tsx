"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ResearchReport } from "@/lib/content";
import type { PricePoint, Quote } from "@/lib/quotes";
import { DOWN, UP, formatPct, formatPrice, moveColor } from "@/lib/research";

const NAVY = "#1b2a4a";
const TARGET = "#1d3fb8";
const POLL_MS = 60_000;
const DAY = 86_400_000;

type Range = "call" | "ytd" | "1y";
const RANGES: { id: Range; label: string }[] = [
  { id: "call", label: "Since the call" },
  { id: "ytd", label: "YTD" },
  { id: "1y", label: "1Y" },
];

// The market's clock, not the viewer's: identical on server and client.
const dayFmt = new Intl.DateTimeFormat("en-CA", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "America/New_York",
});
const timeFmt = new Intl.DateTimeFormat("en-CA", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/New_York",
});

const PAD = { top: 28, right: 76, bottom: 28, left: 8 };

/** The call, charted live: entry, target, and where it trades now. */
export default function CallTracker({
  report,
  initial,
  label,
}: {
  report: ResearchReport;
  initial: Quote | null;
  label: string;
}) {
  const [quote, setQuote] = useState(initial);
  const [range, setRange] = useState<Range>("call");
  const [hover, setHover] = useState<number | null>(null);
  // Unknown until measured; the chart waits so it never forces the layout wide.
  const [width, setWidth] = useState<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const gid = useId().replace(/:/g, "");

  const callT = Date.parse(`${report.date}T00:00:00Z`);
  const call = report.priceAtPublication;
  const target = report.priceTarget;
  const years = parseInt(report.horizon ?? "1", 10) || 1;
  const horizonEnd = callT + years * 365 * DAY;
  const tone = (v: number) => moveColor(v - call);

  // Refresh while the tab is visible; the server caches, so this is cheap.
  useEffect(() => {
    if (!report.quoteSymbol) return;
    const pull = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch(`/api/quote?symbol=${encodeURIComponent(report.quoteSymbol!)}`);
        if (res.ok) setQuote(await res.json());
      } catch {
        /* keep the last good quote */
      }
    };
    pull();
    const id = setInterval(pull, POLL_MS);
    document.addEventListener("visibilitychange", pull);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", pull);
    };
  }, [report.quoteSymbol]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const height = width !== null && width < 640 ? 240 : 340;

  const points = useMemo<PricePoint[]>(() => {
    if (!quote) return [];
    const from =
      range === "call"
        ? callT - DAY
        : range === "ytd"
          ? Date.parse(`${new Date(quote.asOf).getUTCFullYear()}-01-01T00:00:00Z`)
          : quote.asOf - 365 * DAY;
    return quote.points.filter((p) => p.t >= from);
  }, [quote, range, callT]);

  const last = quote?.last ?? null;
  const sinceCall = last === null ? null : last / call - 1;
  const toTarget = last === null ? null : target / last - 1;
  const priceProgress =
    last === null ? 0 : Math.min(1, Math.max(0, (last - call) / (target - call)));
  const asOf = quote?.asOf ?? callT;
  const timeProgress = Math.min(1, Math.max(0, (asOf - callT) / (horizonEnd - callT)));
  const dayN = Math.max(0, Math.floor((asOf - callT) / DAY));

  // scales
  const chart = useMemo(() => {
    if (width === null || points.length < 2) return null;
    const t0 = points[0].t;
    const t1 = points[points.length - 1].t;
    const prices = points.map((p) => p.close);
    const lo = Math.min(...prices, call) * 0.94;
    const hi = Math.max(...prices, target) * 1.04;
    const w = width - PAD.left - PAD.right;
    const h = height - PAD.top - PAD.bottom;
    const x = (t: number) => PAD.left + ((t - t0) / (t1 - t0 || 1)) * w;
    const y = (v: number) => PAD.top + (1 - (v - lo) / (hi - lo)) * h;
    const path = (ps: PricePoint[]) =>
      ps.map((p, i) => `${i ? "L" : "M"}${x(p.t).toFixed(1)},${y(p.close).toFixed(1)}`).join("");

    const before = points.filter((p) => p.t < callT);
    const after = points.filter((p) => p.t >= callT);
    // Join the two halves so the line doesn't break at the call.
    if (before.length && after.length) before.push(after[0]);
    const afterLine = path(after);
    // Fill between the price and the call price: green above, red below.
    const area = after.length
      ? `${afterLine}L${x(after[after.length - 1].t).toFixed(1)},${y(call).toFixed(1)}L${x(after[0].t).toFixed(1)},${y(call).toFixed(1)}Z`
      : "";
    // Where the call price sits in the plot, for the green/red split.
    const split = Math.min(1, Math.max(0, (y(call) - PAD.top) / h));

    const step = (hi - lo) / 4;
    const ticks = [1, 2, 3].map((i) => lo + step * i);
    return {
      width,
      x,
      y,
      w,
      h,
      t0,
      beforeLine: path(before),
      afterLine,
      area,
      split,
      ticks,
      callX: x(Math.max(callT, t0)),
    };
  }, [points, width, height, call, target, callT]);

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    if (!chart) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left + PAD.left;
    let best = 0;
    points.forEach((p, i) => {
      if (Math.abs(chart.x(p.t) - px) < Math.abs(chart.x(points[best].t) - px)) best = i;
    });
    setHover(best);
  };

  const hp = hover !== null ? points[hover] : null;
  const lastPt = points[points.length - 1];

  return (
    <section
      aria-labelledby="tracker"
      className="relative mt-6 overflow-hidden rounded-sm border border-navy/12 bg-white p-6 md:p-10"
    >
      <div className="relative flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-navy/50">
            <h2 id="tracker">{label}</h2>
            <span aria-hidden="true">·</span>
            <span>
              {report.exchange}:{report.ticker}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <span
              key={last ?? "none"}
              className="tracker-tick font-display text-5xl font-semibold tracking-tight text-ink md:text-6xl"
              style={{ "--tick": last === null ? NAVY : tone(last) } as React.CSSProperties}
            >
              {last === null ? "—" : formatPrice(report.currency, last)}
            </span>
            {sinceCall !== null && (
              <span className="font-mono text-sm tabular-nums" style={{ color: moveColor(sinceCall) }}>
                {formatPct(sinceCall)} since the call
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end sm:text-right">
          {quote ? (
            <span className="inline-flex items-center gap-2 rounded-sm border border-navy/15 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-navy/70">
              <span className="relative flex h-2 w-2">
                {quote.open && (
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ background: UP }}
                  />
                )}
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ background: quote.open ? UP : "rgb(27 42 74 / 0.3)" }}
                />
              </span>
              {quote.open ? "Live" : "Market closed"}
            </span>
          ) : (
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-navy/40">
              Live price unavailable
            </span>
          )}
          {quote && (
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-navy/40">
              As of {timeFmt.format(quote.asOf)} ET
            </span>
          )}
        </div>
      </div>

      <div className="relative mt-8 flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRange(r.id)}
            aria-pressed={range === r.id}
            className={`rounded-sm border px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] transition ${
              range === r.id
                ? "border-ink bg-ink text-white"
                : "border-navy/15 text-navy/60 hover:border-navy/40 hover:text-navy"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* the chart */}
      <div ref={boxRef} className="relative mt-4 select-none" style={{ height }}>
        {chart && (
          <svg
            width={chart.width}
            height={height}
            className="absolute inset-0 overflow-visible"
            role="img"
            aria-label={`${report.company} share price, ${points.length} trading days. Called at ${formatPrice(report.currency, call)}, target ${formatPrice(report.currency, target)}${last !== null ? `, now ${formatPrice(report.currency, last)}` : ""}.`}
          >
            <defs>
              {/* hard stop at the call price: green above it, red below */}
              <linearGradient
                id={`${gid}-line`}
                gradientUnits="userSpaceOnUse"
                x1="0"
                x2="0"
                y1={PAD.top}
                y2={PAD.top + chart.h}
              >
                <stop offset={chart.split} stopColor={UP} />
                <stop offset={chart.split} stopColor={DOWN} />
              </linearGradient>
              <linearGradient
                id={`${gid}-area`}
                gradientUnits="userSpaceOnUse"
                x1="0"
                x2="0"
                y1={PAD.top}
                y2={PAD.top + chart.h}
              >
                <stop offset="0" stopColor={UP} stopOpacity="0.22" />
                <stop offset={chart.split} stopColor={UP} stopOpacity="0.03" />
                <stop offset={chart.split} stopColor={DOWN} stopOpacity="0.03" />
                <stop offset="1" stopColor={DOWN} stopOpacity="0.22" />
              </linearGradient>
            </defs>

            {/* price scale: labels only, no gridlines */}
            {chart.ticks.map((v) => (
              <text
                key={v}
                x={chart.width - 4}
                y={chart.y(v) + 3}
                textAnchor="end"
                className="fill-navy/40 font-mono text-[10px] tabular-nums"
              >
                {v.toFixed(0)}
              </text>
            ))}

            {/* target */}
            <line
              x1={PAD.left}
              x2={PAD.left + chart.w}
              y1={chart.y(target)}
              y2={chart.y(target)}
              stroke={TARGET}
              strokeOpacity="0.7"
              strokeDasharray="6 6"
              className="tracker-march"
            />
            <g transform={`translate(${PAD.left + chart.w + 6}, ${chart.y(target)})`}>
              <rect x="0" y="-11" width={PAD.right - 8} height="22" rx="2" fill={TARGET} />
              <text
                x={(PAD.right - 8) / 2}
                y="3.5"
                textAnchor="middle"
                className="fill-white font-mono text-[10px] font-medium tabular-nums"
              >
                {target.toFixed(2)}
              </text>
            </g>
            <text
              x={PAD.left + chart.w - 4}
              y={chart.y(target) - 10}
              textAnchor="end"
              className="font-mono text-[10px] uppercase tracking-[0.2em]"
              fill={TARGET}
            >
              {report.horizon ?? "12-month"} target
            </text>

            {/* the call */}
            {callT >= chart.t0 && (
              <g>
                <line
                  x1={chart.callX}
                  x2={chart.callX}
                  y1={PAD.top - 12}
                  y2={PAD.top + chart.h}
                  stroke={NAVY}
                  strokeOpacity="0.35"
                  strokeDasharray="2 4"
                />
                <line
                  x1={chart.callX}
                  x2={PAD.left + chart.w}
                  y1={chart.y(call)}
                  y2={chart.y(call)}
                  stroke={NAVY}
                  strokeOpacity="0.25"
                  strokeDasharray="2 4"
                />
                <text
                  x={chart.callX + 8}
                  y={PAD.top - 4}
                  className="fill-ink font-mono text-[10px] uppercase tracking-[0.2em]"
                >
                  The call · {formatPrice(report.currency, call)}
                </text>
              </g>
            )}

            {/* price */}
            <g key={range}>
              {chart.beforeLine && (
                <path
                  d={chart.beforeLine}
                  fill="none"
                  stroke={NAVY}
                  strokeOpacity="0.3"
                  strokeWidth="1.5"
                  pathLength={1}
                  className="tracker-draw"
                />
              )}
              {chart.area && (
                <path d={chart.area} fill={`url(#${gid}-area)`} className="tracker-fade" />
              )}
              <path
                d={chart.afterLine}
                fill="none"
                stroke={`url(#${gid}-line)`}
                strokeWidth="2.25"
                strokeLinejoin="round"
                strokeLinecap="round"
                pathLength={1}
                className="tracker-draw"
              />
            </g>

            {callT >= chart.t0 && (
              <g transform={`translate(${chart.callX}, ${chart.y(call)})`}>
                <circle r="8" fill={NAVY} fillOpacity="0.1" />
                <circle r="3.5" fill={NAVY} />
              </g>
            )}

            {/* now */}
            {lastPt && (
              <g transform={`translate(${chart.x(lastPt.t)}, ${chart.y(lastPt.close)})`}>
                {quote?.open && <circle r="6" fill={tone(lastPt.close)} className="tracker-pulse" />}
                <circle r="5" fill={tone(lastPt.close)} stroke="white" strokeWidth="2" />
              </g>
            )}

            {/* hover */}
            {hp && (
              <g pointerEvents="none">
                <line
                  x1={chart.x(hp.t)}
                  x2={chart.x(hp.t)}
                  y1={PAD.top}
                  y2={PAD.top + chart.h}
                  stroke={NAVY}
                  strokeOpacity="0.3"
                />
                <circle
                  cx={chart.x(hp.t)}
                  cy={chart.y(hp.close)}
                  r="4"
                  fill={tone(hp.close)}
                  stroke="white"
                  strokeWidth="2"
                />
              </g>
            )}

            <rect
              x={PAD.left}
              y={0}
              width={chart.w}
              height={height}
              fill="transparent"
              style={{ touchAction: "pan-y" }}
              onPointerMove={onMove}
              onPointerDown={onMove}
              onPointerLeave={() => setHover(null)}
            />
          </svg>
        )}

        {hp && chart && (
          <div
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-sm border border-navy/12 bg-white/95 px-3 py-2 font-mono text-[0.65rem] tabular-nums shadow-lg backdrop-blur"
            style={{ left: Math.min(Math.max(chart.x(hp.t), 70), chart.width - 70) }}
          >
            <div className="uppercase tracking-[0.16em] text-navy/45">{dayFmt.format(hp.t)}</div>
            <div className="mt-1 text-sm text-ink">{formatPrice(report.currency, hp.close)}</div>
            <div style={{ color: tone(hp.close) }}>{formatPct(hp.close / call - 1)} vs call</div>
          </div>
        )}

        {!chart && width !== null && (
          <div className="flex h-full items-center justify-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-navy/35">
            {quote ? "Not enough data for this range" : "Waiting for the market feed"}
          </div>
        )}
      </div>

      {/* progress: price vs time */}
      <dl className="relative mt-8 grid gap-6 border-t border-navy/10 pt-6 font-mono text-[0.65rem] uppercase tracking-[0.16em] md:grid-cols-3">
        <div>
          <dt className="text-navy/45">To target</dt>
          <dd className="font-display mt-1 text-2xl font-semibold normal-case tracking-tight text-ink">
            {toTarget === null ? "—" : formatPct(toTarget)}
          </dd>
        </div>
        <Rail
          label="Price, call → target"
          value={priceProgress}
          note={`${Math.round(priceProgress * 100)}% of the way`}
          color={UP}
        />
        <Rail
          label={`Time, ${report.horizon ?? "12-month"} hold`}
          value={timeProgress}
          note={`Day ${dayN} of ${Math.round((horizonEnd - callT) / DAY)}`}
          color="rgb(27 42 74 / 0.4)"
        />
      </dl>
    </section>
  );
}

function Rail({
  label,
  value,
  note,
  color,
}: {
  label: string;
  value: number;
  note: string;
  color: string;
}) {
  return (
    <div>
      <dt className="flex justify-between text-navy/45">
        <span>{label}</span>
        <span className="tabular-nums text-navy/70">{note}</span>
      </dt>
      <dd className="mt-3 h-1.5 overflow-hidden rounded-sm bg-navy/10">
        <div
          className="tracker-grow h-full rounded-sm"
          style={{ width: `${Math.max(value * 100, 1.5)}%`, background: color }}
        />
      </dd>
    </div>
  );
}
