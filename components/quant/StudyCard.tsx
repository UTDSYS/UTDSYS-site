import Link from "next/link";
import content from "@/lib/content";

type Study = (typeof content.quantResearch.studies.items)[number];

const { label, readLabel } = content.quantResearch.studies;
const mono = "font-mono text-[0.7rem] uppercase tracking-[0.16em]";

const bar: Record<string, string> = {
  Robust: "bg-signal",
  "Lowest volatility": "bg-navy/35",
  "Equal weighting": "bg-ink",
};

/** A study on the index: its finding up front, one figure beside it; the whole card opens the report. */
export default function StudyCard({ study, index }: { study: Study; index: number }) {
  // the most recent market, the one paper trading runs on
  const market = study.markets[study.markets.length - 1];
  const vols = market.rows.map((r) => ({ ...r, v: parseFloat(r.vol) }));
  const max = Math.max(...vols.map((r) => r.v));

  return (
    <Link
      href={`/quantitative-research/${study.slug}`}
      className="group grid border border-navy/15 bg-white transition hover:border-navy/35 hover:shadow-[0_18px_44px_-24px_rgb(14_24_48/0.3)] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"
    >
      <div className="flex flex-col p-6 sm:p-10">
        <p className={`${mono} text-signal-deep`}>
          {label} {String(index + 1).padStart(2, "0")} <span className="text-navy/40">· {study.status}</span>
        </p>
        <h3 className="font-display mt-4 text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">
          {study.name}
        </h3>
        <p className="font-display mt-4 max-w-[34rem] text-balance text-xl leading-snug tracking-tight text-signal-deep sm:text-2xl">
          {study.finding}
        </p>
        <p className="mt-5 max-w-[34rem] text-base leading-relaxed text-navy/65">{study.question}</p>
        <span className={`${mono} mt-auto inline-flex items-center gap-2 pt-10 text-signal-deep`}>
          {readLabel}
          <span aria-hidden="true" className="transition group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>

      <figure className="border-t border-navy/10 bg-navy/[0.03] p-6 sm:p-10 lg:border-l lg:border-t-0">
        <figcaption>
          <p className={`${mono} text-navy/55`}>Volatility</p>
          <p className="mt-1 text-sm text-navy/55">
            {market.name}, {market.period}
          </p>
        </figcaption>
        <dl className="mt-8 space-y-5">
          {vols.map((r) => (
            <div key={r.name}>
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <dt className={r.name === "Robust" ? "font-medium text-ink" : "text-navy/70"}>{r.name}</dt>
                <dd className="font-mono tabular-nums text-ink">{r.vol}</dd>
              </div>
              <div aria-hidden="true" className="mt-2 h-2 bg-navy/[0.06]">
                <div style={{ width: `${(r.v / max) * 100}%` }} className={`h-full ${bar[r.name]}`} />
              </div>
            </div>
          ))}
        </dl>
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-navy/10 pt-6">
          {study.figures.slice(0, 2).map((f) => (
            <div key={f.label}>
              <p className="font-display text-3xl font-extrabold tracking-tight text-ink">
                {f.value}
                {f.unit && <span className="ml-1.5 text-base font-semibold text-navy/60">{f.unit}</span>}
              </p>
              <p className="mt-1 text-xs leading-snug text-navy/55">{f.label}</p>
            </div>
          ))}
        </div>
      </figure>
    </Link>
  );
}
