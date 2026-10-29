type Row = { name: string; ratio: number; ci: number[] | null };
type Market = { name: string; period: string; rows: Row[] };

// The axis runs from 70% to 105% of equal weighting's volatility.
const LO = 0.7;
const HI = 1.05;
const at = (v: number) => `${((v - LO) / (HI - LO)) * 100}%`;
const TICKS = [0.7, 0.8, 0.9, 1];

const tone: Record<string, string> = {
  Robust: "bg-signal",
  "Lowest volatility": "bg-navy/45",
};

/** Each strategy's volatility as a share of equal weighting's, with its 95% interval, one row per market. */
export default function RatioChart({ markets }: { markets: Market[] }) {
  const shown = markets[0].rows.filter((r) => r.ci);
  return (
    <div>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy/70">
        {shown.map((r) => (
          <li key={r.name} className="inline-flex items-center gap-2">
            <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${tone[r.name]}`} />
            {r.name}
          </li>
        ))}
        <li className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-3.5 w-px bg-ink" />
          Equal weighting
        </li>
      </ul>

      <div className="mt-8 grid grid-cols-1 gap-y-8 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-y-0">
        {markets.map((m) => (
          <div key={m.name} className="contents">
            <div className="sm:border-b sm:border-navy/8 sm:py-6">
              <p className="font-medium text-ink">{m.name}</p>
              <p className="mt-0.5 text-xs text-navy/50">{m.period}</p>
            </div>
            <div className="relative border-b border-navy/8 py-4 sm:py-6">
              {/* gridlines, and equal weighting at 100% */}
              {TICKS.map((t) => (
                <span
                  key={t}
                  aria-hidden="true"
                  style={{ left: at(t) }}
                  className={`absolute inset-y-0 w-px ${t === 1 ? "bg-ink" : "bg-navy/8"}`}
                />
              ))}
              {m.rows
                .filter((r) => r.ci)
                .map((r) => (
                  <div key={r.name} className="relative h-7">
                    <span
                      aria-hidden="true"
                      style={{
                        left: at(r.ci![0]),
                        width: `calc(${at(r.ci![1])} - ${at(r.ci![0])})`,
                      }}
                      className={`absolute top-1/2 h-px -translate-y-1/2 ${tone[r.name]}`}
                    />
                    <span
                      style={{ left: at(r.ratio) }}
                      className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white ${tone[r.name]}`}
                    >
                      <span className="sr-only">
                        {r.name}: {Math.round(r.ratio * 100)}% of equal weighting
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      style={{ left: `calc(${at(r.ci![1])} + 0.5rem)` }}
                      className="absolute top-1/2 -translate-y-1/2 font-mono text-[0.8rem] tabular-nums text-navy/60"
                    >
                      {Math.round(r.ratio * 100)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
        <div className="hidden sm:block" />
        <div aria-hidden="true" className="relative h-6">
          {TICKS.map((t) => (
            <span
              key={t}
              style={{ left: at(t) }}
              className="absolute top-2 -translate-x-1/2 font-mono text-[0.75rem] tabular-nums text-navy/45"
            >
              {Math.round(t * 100)}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
