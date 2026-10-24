"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  createRandom,
  DEFAULT_PARAMS,
  initialState,
  pnl,
  quotes,
  step,
  type Params,
  type State,
} from "@/lib/marketMaker";

/**
 * A live, simulated market maker running lib/marketMaker, built to be read
 * by someone who has never seen an order book. The chart has one line (the
 * market price), one shaded band (our buy and sell prices) and dots where we
 * trade, labelled in place rather than through a legend. Three plain numbers
 * sit above it; the full readouts, book and live formula are tucked under
 * "Under the hood" for people who want them.
 *
 * It pre-runs a full window on mount so it opens populated, steps only while
 * on screen, and starts paused for reduced motion.
 */

const WINDOW = 200;
const STEPS_PER_SECOND = 14;
const SEED = 42;
const LADDER_TICK = 0.25;
const LADDER_LEVELS = 6;

type Frame = State & { pnl: number };

type Labels = {
  ask: string;
  mid: string;
  bid: string;
  bought: string;
  sold: string;
  profit: string;
  position: string;
  trades: string;
  spread: string;
  positionChart: string;
  profitChart: string;
  flat: string;
  long: string;
  short: string;
};

type Control = { name: string; hint: string };

const toFrame = (s: State): Frame => ({ ...s, pnl: pnl(s) });

function simulate(params: Params, seed: number) {
  const random = createRandom(seed);
  let s = initialState(params);
  const frames: Frame[] = [];
  for (let i = 0; i < WINDOW; i++) {
    s = step(s, params, random);
    frames.push(toFrame(s));
  }
  return { random, frames };
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** Small deterministic hash in [0, 1) for synthetic book depth. */
const hash = (a: number, b: number) => {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const fmt = (n: number, d = 2) => n.toFixed(d);
const money = (n: number) => `${n >= 0 ? "+" : "−"}$${Math.abs(n).toFixed(2)}`;

export default function MarketMakerDesk({
  title,
  simulated,
  note,
  labels: L,
  controls,
  underTheHood,
}: {
  title: string;
  simulated: string;
  note: string;
  labels: Labels;
  controls: { gamma: Control; sigma: Control };
  underTheHood: string;
}) {
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS);
  const [frames, setFrames] = useState<Frame[]>(() => simulate(DEFAULT_PARAMS, SEED).frames);
  const reducedMotion = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
  // null until the visitor presses Run/Pause; reduced motion starts paused.
  const [userRunning, setRunning] = useState<boolean | null>(null);
  const running = userRunning ?? !reducedMotion;
  const [visible, setVisible] = useState(false);

  const sim = useRef<{ random: () => number; state: State } | null>(null);
  const paramsRef = useRef(params);
  const panelRef = useRef<HTMLDivElement>(null);
  const [chartRef, chartW] = useWidth<HTMLDivElement>();
  const [subRef, subW] = useWidth<HTMLDivElement>();

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const reset = () => {
    const { random, frames: fresh } = simulate(paramsRef.current, SEED);
    sim.current = { random, state: fresh[fresh.length - 1] };
    setFrames(fresh);
  };

  // Seed the live engine from the pre-run window.
  useEffect(() => {
    const { random, frames: fresh } = simulate(DEFAULT_PARAMS, SEED);
    sim.current = { random, state: fresh[fresh.length - 1] };
  }, []);

  // Only burn cycles while the desk is on screen.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.1,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running || !visible) return;
    let raf = 0;
    let last = performance.now();
    let carry = 0;
    const tick = (now: number) => {
      carry += ((now - last) / 1000) * STEPS_PER_SECOND;
      last = now;
      const n = Math.min(5, Math.floor(carry));
      if (n > 0 && sim.current) {
        carry -= n;
        const added: Frame[] = [];
        for (let i = 0; i < n; i++) {
          sim.current.state = step(sim.current.state, paramsRef.current, sim.current.random);
          added.push(toFrame(sim.current.state));
        }
        setFrames((f) => [...f, ...added].slice(-WINDOW));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, visible]);

  const cur = frames[frames.length - 1];
  const q = quotes(cur.mid, cur.inventory, params);
  // Narrow screens show half the window so the tape stays legible.
  const shown = chartW > 0 && chartW < 600 ? frames.slice(-WINDOW / 2) : frames;
  const N = shown.length;

  // --- price chart: one line, one band, dots --------------------------
  const PH = 320;
  const GUTTER = 92; // room on the right for the in-place labels
  const plotW = Math.max(0, chartW - GUTTER);
  const pad = 0.6;
  const lo = Math.min(...shown.map((f) => f.bid)) - pad;
  const hi = Math.max(...shown.map((f) => f.ask)) + pad;
  const X = (i: number, w: number) => (i / (N - 1)) * w;
  const Y = (v: number) => PH - ((v - lo) / (hi - lo)) * PH;
  const line = (get: (f: Frame) => number) =>
    shown.map((f, i) => `${i ? "L" : "M"}${X(i, plotW).toFixed(1)},${Y(get(f)).toFixed(1)}`).join("");
  const band =
    shown.map((f, i) => `${i ? "L" : "M"}${X(i, plotW).toFixed(1)},${Y(f.ask).toFixed(1)}`).join("") +
    [...shown]
      .reverse()
      .map((f, i) => `L${X(N - 1 - i, plotW).toFixed(1)},${Y(f.bid).toFixed(1)}`)
      .join("") +
    "Z";

  // Keep the three end labels from colliding.
  const endY = [Y(cur.ask), Y(cur.mid), Y(cur.bid)];
  const MIN_GAP = 30;
  if (endY[1] - endY[0] < MIN_GAP) endY[0] = endY[1] - MIN_GAP;
  if (endY[2] - endY[1] < MIN_GAP) endY[2] = endY[1] + MIN_GAP;

  // --- position + profit charts ----------------------------------------
  const SH = 76;
  const subChartW = subW > 0 ? (subW - 24) / 2 : 0;
  const invMax = Math.max(4, ...shown.map((f) => Math.abs(f.inventory)));
  const pnls = shown.map((f) => f.pnl);
  const pLo = Math.min(0, ...pnls);
  const pHi = Math.max(1, ...pnls);
  const PY = (v: number) => SH - ((v - pLo) / (pHi - pLo)) * (SH - 8) - 4;
  const pnlPath = shown
    .map((f, i) => `${i ? "L" : "M"}${X(i, subChartW).toFixed(1)},${PY(f.pnl).toFixed(1)}`)
    .join("");

  // --- under the hood ---------------------------------------------------
  const tradesInView = shown.filter((f) => f.lastFill).length;
  let peak = -Infinity;
  let maxDD = 0;
  for (const v of pnls) {
    peak = Math.max(peak, v);
    maxDD = Math.max(maxDD, peak - v);
  }
  const center = Math.round(cur.mid / LADDER_TICK) * LADDER_TICK;
  const epoch = Math.floor(cur.t / 8);
  const depth = (price: number, i: number) =>
    Math.round(40 * Math.exp(-0.18 * i) * (0.45 + 0.55 * hash(Math.round(price * 4), epoch)) + 4);
  // Our resting quotes are the live ones, the same as the readouts.
  const ourBid = Math.round(q.bid / LADDER_TICK) * LADDER_TICK;
  const ourAsk = Math.round(q.ask / LADDER_TICK) * LADDER_TICK;
  const asks = Array.from({ length: LADDER_LEVELS }, (_, i) => {
    const price = center + (LADDER_LEVELS - i) * LADDER_TICK;
    return { price, size: depth(price, LADDER_LEVELS - i), ours: Math.abs(price - ourAsk) < 1e-6 };
  });
  const bids = Array.from({ length: LADDER_LEVELS }, (_, i) => {
    const price = center - (i + 1) * LADDER_TICK;
    return { price, size: depth(price, i + 1), ours: Math.abs(price - ourBid) < 1e-6 };
  });
  const maxSize = Math.max(...asks.map((a) => a.size), ...bids.map((b) => b.size));

  const position =
    cur.inventory === 0
      ? L.flat
      : `${Math.abs(cur.inventory)} ${cur.inventory > 0 ? L.long : L.short}`;

  const slider = (key: "gamma" | "sigma", greek: string, min: number, max: number, s: number) => (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-ink">
          {controls[key].name}{" "}
          <span className="font-mono text-xs font-normal text-navy/40">{greek}</span>
        </span>
        <span className="font-mono text-xs tabular-nums text-navy/60">
          {params[key].toFixed(key === "gamma" ? 2 : 1)}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={s}
        value={params[key]}
        onChange={(e) => setParams((p) => ({ ...p, [key]: Number(e.target.value) }))}
        className="quant-range mt-2 w-full"
        aria-label={controls[key].name}
      />
      <span className="mt-1.5 block text-xs text-navy/50">{controls[key].hint}</span>
    </label>
  );

  return (
    <div
      ref={panelRef}
      className="overflow-hidden rounded-2xl border border-navy/12 bg-white/70 shadow-[0_30px_80px_-40px_rgb(14_24_48/0.35)]"
    >
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-navy/10 px-5 py-4 md:px-7">
        <div className="flex items-center gap-3">
          <span className="font-display text-lg font-semibold tracking-tight text-ink">{title}</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-signal-deep/30 bg-signal-deep/5 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-signal-deep">
            <span className={`h-1.5 w-1.5 rounded-full bg-signal-deep ${running && visible ? "quant-live" : ""}`} />
            {simulated}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRunning(!running)}
            className="rounded-full border border-navy/20 px-3.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-navy transition hover:border-ink hover:text-ink"
          >
            {running ? "Pause" : "Run"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-navy/20 px-3.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-navy transition hover:border-ink hover:text-ink"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_260px]">
        <div className="min-w-0 p-5 md:p-7">
          {/* the three numbers that matter */}
          <dl className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              [L.profit, money(cur.pnl)],
              [L.position, position],
              [L.trades, String(cur.fills)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-navy/45">{k}</dt>
                <dd className="font-display mt-1 text-lg font-semibold tracking-tight text-ink [font-variant-numeric:lining-nums] sm:text-2xl md:text-3xl">
                  {v}
                </dd>
              </div>
            ))}
          </dl>

          {/* price chart */}
          <div ref={chartRef} className="relative mt-8" style={{ height: PH }}>
            {chartW > 0 && (
              <svg width={chartW} height={PH} className="block overflow-visible" aria-hidden="true">
                <path d={band} fill="rgb(29 63 184 / 0.1)" />
                <path d={line((f) => f.ask)} fill="none" stroke="rgb(29 63 184 / 0.45)" strokeWidth={1} />
                <path d={line((f) => f.bid)} fill="none" stroke="rgb(29 63 184 / 0.45)" strokeWidth={1} />
                <path d={line((f) => f.mid)} fill="none" stroke="var(--color-ink)" strokeWidth={1.75} />
                {shown.map((f, i) =>
                  f.lastFill ? (
                    <circle
                      key={f.t}
                      cx={X(i, plotW)}
                      cy={Y(f.lastFill.price)}
                      r={3.5}
                      className={
                        f.lastFill.side === "bid"
                          ? "fill-white stroke-signal-deep"
                          : "fill-signal-deep stroke-white"
                      }
                      strokeWidth={1.5}
                    />
                  ) : null,
                )}

                {/* labels in place, at the live edge */}
                {(
                  [
                    [L.ask, cur.ask, endY[0], "fill-signal-deep"],
                    [L.mid, cur.mid, endY[1], "fill-ink"],
                    [L.bid, cur.bid, endY[2], "fill-signal-deep"],
                  ] as const
                ).map(([label, v, y, cls]) => (
                  <g key={label}>
                    <line x1={plotW} x2={plotW + 8} y1={Y(v)} y2={y} stroke="rgb(27 42 74 / 0.25)" />
                    <text
                      x={plotW + 12}
                      y={y - 3}
                      className={`${cls} font-mono text-[9px] uppercase tracking-[0.12em]`}
                    >
                      {label}
                    </text>
                    <text x={plotW + 12} y={y + 10} className="fill-ink font-mono text-[11px] tabular-nums">
                      ${fmt(v)}
                    </text>
                  </g>
                ))}
              </svg>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-navy/50">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border-[1.5px] border-signal-deep bg-white" /> {L.bought}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-signal-deep" /> {L.sold}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-4 bg-signal-deep/15" /> {L.spread}: ${fmt(q.spread)}
            </span>
          </div>

          {/* position + profit */}
          <div ref={subRef} className="mt-8 grid grid-cols-2 gap-6 border-t border-navy/10 pt-6">
            <div>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-navy/50">{L.positionChart}</p>
              {subChartW > 0 && (
                <svg width={subChartW} height={SH} className="mt-3 block" aria-hidden="true">
                  <line x1={0} x2={subChartW} y1={SH / 2} y2={SH / 2} stroke="rgb(27 42 74 / 0.15)" />
                  {shown.map((f, i) => {
                    const h = (f.inventory / invMax) * (SH / 2 - 2);
                    const w = Math.max(1, subChartW / N - 0.5);
                    return f.inventory === 0 ? null : (
                      <rect
                        key={f.t}
                        x={X(i, subChartW) - w / 2}
                        y={h > 0 ? SH / 2 - h : SH / 2}
                        width={w}
                        height={Math.abs(h)}
                        className="fill-navy/35"
                      />
                    );
                  })}
                </svg>
              )}
            </div>
            <div>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-navy/50">{L.profitChart}</p>
              {subChartW > 0 && (
                <svg width={subChartW} height={SH} className="mt-3 block" aria-hidden="true">
                  <line x1={0} x2={subChartW} y1={PY(0)} y2={PY(0)} stroke="rgb(27 42 74 / 0.15)" />
                  <path d={`${pnlPath}L${subChartW},${PY(0)}L0,${PY(0)}Z`} fill="rgb(29 63 184 / 0.08)" />
                  <path d={pnlPath} fill="none" stroke="var(--color-signal-deep)" strokeWidth={1.5} />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* controls */}
        <div className="space-y-7 border-t border-navy/10 bg-offwhite/50 p-5 md:p-7 lg:border-l lg:border-t-0">
          {slider("gamma", "γ", 0.02, 0.5, 0.01)}
          {slider("sigma", "σ", 2, 12, 0.5)}
          <p className="text-xs leading-relaxed text-navy/45">{note}</p>
        </div>
      </div>

      {/* the detail, for people who want it */}
      <details className="group border-t border-navy/10">
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-navy/55 transition hover:text-ink md:px-7">
          {underTheHood}
          <span className="transition-transform group-open:rotate-45" aria-hidden="true">
            +
          </span>
        </summary>
        <div className="grid gap-8 px-5 pb-6 md:grid-cols-[1fr_260px] md:px-7">
          <div>
            <dl className="grid grid-cols-2 gap-x-6 font-mono text-xs tabular-nums sm:grid-cols-3">
              {(
                [
                  ["Mid", fmt(cur.mid)],
                  ["Reservation price", fmt(q.reservation)],
                  ["Spread δ", fmt(q.spread)],
                  ["Inventory q", String(cur.inventory)],
                  ["Edge / fill", fmt(cur.fills ? cur.edge / cur.fills : 0, 3)],
                  ["Trades in view", String(tradesInView)],
                  ["Max drawdown", fmt(maxDD)],
                  ["Step t", String(cur.t)],
                  ["Seed", String(SEED)],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between border-b border-navy/8 py-2">
                  <dt className="text-[0.58rem] uppercase tracking-[0.12em] text-navy/45">{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 font-mono text-[0.7rem] tabular-nums text-navy/55">
              r = S − q·γ·σ²·τ = {fmt(cur.mid)} − ({cur.inventory})({fmt(params.gamma)})(
              {fmt(params.sigma, 1)}²)({params.tau}) = <span className="text-ink">{fmt(q.reservation)}</span>
            </p>
          </div>
          <div>
            <div className="flex justify-between font-mono text-[0.58rem] uppercase tracking-[0.14em] text-navy/45">
              <span>Order book</span>
              <span>Size</span>
            </div>
            <ol className="mt-2 font-mono text-[0.68rem] tabular-nums">
              {asks.map((a) => (
                <li key={`a${a.price.toFixed(2)}`} className="relative flex h-5 items-center justify-between px-2">
                  <span
                    className="absolute inset-y-0.5 right-0 bg-signal-deep/10"
                    style={{ width: `${(a.size / maxSize) * 100}%` }}
                  />
                  <span className={`relative ${a.ours ? "font-semibold text-signal-deep" : "text-signal-deep/70"}`}>
                    {fmt(a.price)}
                    {a.ours && <span className="ml-2 text-[0.55rem] tracking-[0.14em]">◂ us</span>}
                  </span>
                  <span className="relative text-navy/60">{a.size}</span>
                </li>
              ))}
              <li className="my-1 flex h-6 items-center justify-between border-y border-navy/10 px-2 text-ink">
                <span className="text-[0.58rem] uppercase tracking-[0.14em] text-navy/45">Mid</span>
                <span className="font-semibold">{fmt(cur.mid)}</span>
              </li>
              {bids.map((b) => (
                <li key={`b${b.price.toFixed(2)}`} className="relative flex h-5 items-center justify-between px-2">
                  <span
                    className="absolute inset-y-0.5 right-0 bg-navy/8"
                    style={{ width: `${(b.size / maxSize) * 100}%` }}
                  />
                  <span className={`relative ${b.ours ? "font-semibold text-ink" : "text-navy/60"}`}>
                    {fmt(b.price)}
                    {b.ours && <span className="ml-2 text-[0.55rem] tracking-[0.14em]">◂ us</span>}
                  </span>
                  <span className="relative text-navy/60">{b.size}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </details>
    </div>
  );
}
