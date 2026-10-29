import Link from "next/link";
import content from "@/lib/content";

type Study = (typeof content.quantResearch.studies.items)[number];

const { readLabel } = content.quantResearch.studies;
const mono = "font-mono text-[0.8rem] uppercase tracking-[0.08em]";

const bar: Record<string, string> = {
  Robust: "bg-signal",
  "Equal weighting": "bg-ink",
};

/** A study on the index: its finding up front, one figure beside it; the whole card opens the report. */
export default function StudyCard({ study }: { study: Study }) {
  // the most recent market, the one paper trading runs on
  const market = study.markets[study.markets.length - 1];
  // the card compares against equal weighting only; the report has the rest
  const vols = market.rows
    .filter((r) => r.name in bar)
    .map((r) => ({ ...r, v: parseFloat(r.vol) }));
  const max = Math.max(...vols.map((r) => r.v));

  return (
    <Link
      href={`/quantitative-research/${study.slug}`}
      className="group grid border border-navy/15 bg-white transition hover:border-navy/35 hover:shadow-[0_18px_44px_-24px_rgb(14_24_48/0.3)] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"
    >
      <div className="flex flex-col p-6 sm:p-10">
        <h3 className="font-display text-3xl font-semibold tracking-[-0.01em] text-ink sm:text-4xl">
          {study.name}
        </h3>
        <p className="font-display mt-4 max-w-[34rem] text-balance text-xl leading-snug tracking-tight text-signal-deep sm:text-2xl">
          {study.finding}
        </p>
        {/* where it trades now, under the finding it is testing */}
        <div className="mt-8 max-w-[34rem] border border-navy/15 bg-navy/[0.03] px-5 py-4 sm:px-6 sm:py-5">
          <p className={`${mono} text-navy/55`}>Paper trading</p>
          <p className="font-display mt-2 text-xl font-semibold tracking-tight text-ink">
            Trading on {study.paper.broker} from {study.paper.start}
          </p>
        </div>
        <span className={`${mono} mt-auto inline-flex items-center gap-2 pt-10 text-signal-deep`}>
          {readLabel}
          <span aria-hidden="true" className="transition group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>

      <figure className="border-t border-navy/10 bg-navy/[0.03] p-6 sm:p-10 lg:border-l lg:border-t-0">
        <figcaption className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          Backtested volatility
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
            <div key={f.value}>
              <p className="font-display text-3xl font-semibold tracking-tight text-ink">
                {f.value}
                {f.unit && <span className="ml-1.5 text-base font-semibold text-navy/60">{f.unit}</span>}
              </p>
              {f.label && <p className="mt-1 text-xs leading-snug text-navy/55">{f.label}</p>}
            </div>
          ))}
        </div>
      </figure>
    </Link>
  );
}
