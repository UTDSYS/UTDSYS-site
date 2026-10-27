type Series = { name: string; values: number[] };
type Data = { start: string; end: string; series: Series[] };

const W = 1000;
const H = 300;
const DD_H = 120;
const START = 10_000;

const stroke: Record<string, { color: string; width: number; dash?: string }> = {
  Robust: { color: "var(--color-signal)", width: 2.25 },
  "Lowest volatility": { color: "rgb(27 42 74 / 0.4)", width: 1.5 },
  "Equal weighting": { color: "var(--color-ink)", width: 1.5, dash: "5 4" },
};

// to the nearest hundred: the series is stored to three decimals of $1
const money = (v: number) => `$${(Math.round(v / 100) * 100).toLocaleString("en-US")}`;

// Fraction below the running high, month by month.
const drawdowns = (w: number[]) => {
  let peak = w[0];
  return w.map((x) => {
    peak = Math.max(peak, x);
    return 1 - x / peak;
  });
};

const path = (ys: number[], y: (v: number) => number) =>
  ys.map((v, i) => `${i ? "L" : "M"}${((i / (ys.length - 1)) * W).toFixed(1)},${y(v).toFixed(1)}`).join("");

function Lines({ sets, y }: { sets: Series[]; y: (v: number) => number }) {
  return (
    // draw the benchmarks first so the robust line sits on top
    [...sets]
      .reverse()
      .map((s) => (
        <path
          key={s.name}
          d={path(s.values, y)}
          fill="none"
          stroke={stroke[s.name].color}
          strokeWidth={stroke[s.name].width}
          strokeDasharray={stroke[s.name].dash}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))
  );
}

/** Growth of $10,000 for each strategy, with each one's decline from its previous high beneath. */
export default function GrowthChart({ data, drawdownLabel }: { data: Data; drawdownLabel: string }) {
  const n = data.series[0].values.length;
  const top = Math.ceil((Math.max(...data.series.flatMap((s) => s.values)) * START) / 25_000) * 25_000;
  const gy = (v: number) => H - ((v * START) / top) * H;
  const gTicks = Array.from({ length: top / 25_000 + 1 }, (_, i) => i * 25_000);

  const dd = data.series.map((s) => ({
    name: s.name,
    values: drawdowns(s.values),
  }));
  const floor = Math.ceil(Math.max(...dd.flatMap((s) => s.values)) * 10) / 10;
  const dy = (v: number) => (v / floor) * DD_H;
  const dTicks = Array.from({ length: Math.round(floor / 0.25) + 1 }, (_, i) => i * 0.25).filter((t) => t <= floor);

  // a label every four years, placed by month
  const [y0, m0] = data.start.split("-").map(Number);
  const years = [];
  for (let y = y0 + 1; y <= Number(data.end.slice(0, 4)); y++) {
    if (y % 4 === 0) years.push({ y, x: ((y - y0) * 12 - m0 + 1) / (n - 1) });
  }

  return (
    <div>
      <ul className="grid gap-x-8 gap-y-2 text-sm sm:flex sm:flex-wrap">
        {data.series.map((s) => (
          <li key={s.name} className="flex items-center gap-2.5">
            <svg width="22" height="4" aria-hidden="true" className="shrink-0">
              <line
                x1="1"
                x2="21"
                y1="2"
                y2="2"
                stroke={stroke[s.name].color}
                strokeWidth={stroke[s.name].width}
                strokeDasharray={stroke[s.name].dash}
              />
            </svg>
            <span className="text-navy/70">{s.name}</span>
            <span className="font-mono tabular-nums text-ink">{money(s.values[n - 1] * START)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_3.25rem] gap-x-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`Growth of $10,000 from ${data.start} to ${data.end}: ${data.series.map((s) => `${s.name} ${money(s.values[n - 1] * START)}`).join(", ")}.`}
          className="h-56 w-full overflow-visible sm:h-72"
        >
          {gTicks.map((t) => (
            <line
              key={t}
              x1="0"
              x2={W}
              y1={gy(t / START)}
              y2={gy(t / START)}
              stroke="rgb(27 42 74 / 0.08)"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <Lines sets={data.series} y={gy} />
        </svg>
        <div aria-hidden="true" className="relative">
          {gTicks.map((t) => (
            <span
              key={t}
              style={{ top: `${(1 - t / top) * 100}%` }}
              className="absolute -translate-y-1/2 font-mono text-[0.65rem] tabular-nums text-navy/45"
            >
              ${t / 1000}k
            </span>
          ))}
        </div>

        <p className="col-span-2 mt-6 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-navy/50">
          {drawdownLabel}
        </p>
        <svg
          viewBox={`0 0 ${W} ${DD_H}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          className="mt-3 h-24 w-full overflow-visible sm:h-28"
        >
          {dTicks.map((t) => (
            <line
              key={t}
              x1="0"
              x2={W}
              y1={dy(t)}
              y2={dy(t)}
              stroke="rgb(27 42 74 / 0.08)"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path d={`${path(dd[0].values, dy)}L${W},0L0,0Z`} fill="var(--color-signal)" fillOpacity="0.1" />
          <Lines sets={dd} y={dy} />
        </svg>
        <div aria-hidden="true" className="relative mt-3">
          {dTicks.map((t) => (
            <span
              key={t}
              style={{ top: `${(t / floor) * 100}%` }}
              className="absolute -translate-y-1/2 font-mono text-[0.65rem] tabular-nums text-navy/45"
            >
              {t ? `−${t * 100}%` : "0%"}
            </span>
          ))}
        </div>

        <div aria-hidden="true" className="relative mt-2 h-5">
          {years.map(({ y, x }) => (
            <span
              key={y}
              style={{ left: `${x * 100}%` }}
              className="absolute -translate-x-1/2 font-mono text-[0.65rem] tabular-nums text-navy/45"
            >
              {y}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
