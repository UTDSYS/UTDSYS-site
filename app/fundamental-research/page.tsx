import Link from "next/link";
import Button from "@/components/ui/Button";
import RatingBadge from "@/components/research/RatingBadge";
import content from "@/lib/content";
import { byNewest, formatDate, formatPct, formatPrice, upside } from "@/lib/research";

export const metadata = {
  title: "Fundamental Research — UofT Decision Systems",
  description:
    "UofT Decision Systems Fundamental Research: bottom-up company research with a top-down view of the economy, focused on durable businesses the market has mispriced.",
};

const { about, disclaimer, reports } = content.fundamentalResearch;
const { hero, approach, coverage, process, latest, standards, join } = about;

const label = "font-mono text-[0.75rem] uppercase tracking-[0.1em]";
const num = (i: number) => String(i + 1).padStart(2, "0");
// each section hangs its label off one left rail, as on the quant page
const row = "grid grid-cols-1 gap-8 border-t border-navy/12 pt-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-0";
const sectionTitle = `${label} text-navy/55`;

export default function FundamentalAboutPage() {
  const newest = [...reports].filter((r) => !r.sample).sort(byNewest).slice(0, 2);

  return (
    <main className="relative min-h-screen overflow-x-clip">
      {/* hero: the name over a photo, darkened on the left so the text reads */}
      <section
        aria-labelledby="hero"
        className="relative isolate overflow-hidden bg-crest text-white"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero.image})` }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(6_14_36/0.96)_0%,rgb(6_14_36/0.82)_38%,rgb(6_14_36/0.35)_75%,rgb(6_14_36/0.2)_100%)]"
        />
        {/* phones put the text over the whole photo, so darken it all */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgb(6_14_36/0.55)] md:hidden" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-[linear-gradient(0deg,rgb(6_14_36/0.85),transparent)]"
        />

        <div className="mx-auto flex min-h-[min(44rem,86vh)] max-w-7xl flex-col justify-center px-6 pb-20 pt-32 sm:pt-36">
          <div className="max-w-2xl">
            <p className={`${label} text-[rgb(122_162_255)]`}>{hero.eyebrow}</p>
            <h1
              id="hero"
              className="font-display mt-6 text-balance text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.02em]"
            >
              {hero.title}
            </h1>
            <div aria-hidden="true" className="mt-8 flex gap-1.5">
              <span className="h-1.5 w-24 bg-white sm:w-32" />
              <span className="h-1.5 w-10 bg-signal sm:w-14" />
            </div>
            <p className="mt-8 max-w-[34rem] text-lg leading-relaxed text-white/75 sm:text-xl">{hero.body}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button href={hero.primary.href} variant="signal">
                {hero.primary.label}
              </Button>
              <Link href={hero.secondary.href} className={`${label} group text-white/75 transition hover:text-white`}>
                {hero.secondary.label}{" "}
                <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-24 px-6 py-24 sm:space-y-28 sm:py-28">
        {/* philosophy: where we sit, then the three principles */}
        <section aria-labelledby="approach" className={row}>
          <h2 id="approach" className={sectionTitle}>
            {approach.heading}
          </h2>
          <div>
            <p className="font-display max-w-4xl text-balance text-2xl leading-snug tracking-[-0.01em] text-ink sm:text-[2rem]">
              {approach.intro}
            </p>
            <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {approach.items.map((a, i) => (
                <li key={a.title} className="border-t-2 border-ink pt-5">
                  <span className="font-mono text-xs tabular-nums text-signal-deep">{num(i)}</span>
                  <h3 className="font-display mt-3 text-xl font-semibold tracking-tight text-ink">{a.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-navy/70">{a.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* coverage: three areas */}
        <section aria-labelledby="coverage" className={row}>
          <h2 id="coverage" className={sectionTitle}>
            {coverage.heading}
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {coverage.items.map((c) => (
              <li key={c.title} className="flex flex-col rounded-sm border border-navy/12 bg-white p-7">
                <span className={`${label} text-[0.7rem] text-signal-deep`}>{c.detail}</span>
                <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight text-ink">{c.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-navy/70">{c.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* process, on a full-width navy band */}
      <section id="process" aria-labelledby="process-heading" className="blue-band scroll-mt-20 text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-0">
            <h2 id="process-heading" className={`${label} text-white/55`}>
              {process.heading}
            </h2>
            <div>
              <p className="font-display max-w-3xl text-balance text-2xl leading-snug tracking-[-0.01em] sm:text-[2rem]">
                {process.intro}
              </p>
              <ol className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {process.steps.map((s, i) => (
                  <li key={s.title} className="border-t border-white/15 pt-5">
                    <span className="font-mono text-xs tabular-nums text-[rgb(122_162_255)]">{num(i)}</span>
                    <h3 className="font-display mt-3 text-xl font-semibold tracking-tight">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{s.body}</p>
                    {"layers" in s && (
                      <ol className="mt-4 flex flex-wrap items-center gap-2">
                        {s.layers.map((l, j) => (
                          <li key={l} className="flex items-center gap-2">
                            {j > 0 && (
                              <span aria-hidden="true" className="text-[rgb(122_162_255)]">
                                →
                              </span>
                            )}
                            <span className="rounded-full border border-white/20 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-white/85">
                              {l}
                            </span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-24 px-6 py-24 sm:space-y-28 sm:py-28">
        {/* the newest calls, straight from the record */}
        {newest.length > 0 && (
          <section aria-labelledby="latest" className={row}>
            <div className="flex flex-col gap-4">
              <h2 id="latest" className={sectionTitle}>
                {latest.heading}
              </h2>
              <Link
                href="/fundamental-research/reports"
                className={`${label} group hidden text-[0.7rem] text-signal-deep lg:inline`}
              >
                {latest.all}{" "}
                <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
            <div>
              <ul className="grid gap-4 md:grid-cols-2">
                {newest.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/fundamental-research/${r.slug}`}
                      className="group flex h-full flex-col rounded-sm border border-navy/12 bg-white p-7 transition hover:border-navy/30 hover:shadow-[0_14px_40px_-20px_rgb(14_24_48/0.35)]"
                    >
                      <div className={`${label} flex items-center justify-between gap-4 text-[0.7rem] text-navy/55`}>
                        <span className="font-semibold text-ink">
                          {r.exchange}: {r.ticker}
                        </span>
                        <span>{formatDate(r.date)}</span>
                      </div>
                      <h3 className="font-display mt-5 text-2xl font-semibold tracking-tight text-ink transition group-hover:text-signal-deep">
                        {r.company}
                      </h3>
                      <p className="font-display mb-7 mt-2 text-lg leading-snug text-signal-deep">{r.headline}</p>
                      <div className="mt-auto flex items-end justify-between gap-4 border-t border-navy/10 pt-5">
                        <div className="flex items-center gap-3">
                          <RatingBadge rating={r.rating} />
                          <span className="font-mono text-xs uppercase tracking-[0.08em] text-navy/50">
                            {r.horizon ?? "12-month"} target
                          </span>
                        </div>
                        <div className="text-right font-mono tabular-nums">
                          <div className="text-lg text-ink">{formatPrice(r.currency, r.priceTarget)}</div>
                          <div className="text-xs text-navy/55">{formatPct(upside(r))} at publication</div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/fundamental-research/reports"
                className={`${label} group mt-6 inline-block text-[0.7rem] text-signal-deep lg:hidden`}
              >
                {latest.all} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>
        )}

        {/* accountability: one statement */}
        <section aria-labelledby="standards" className={row}>
          <h2 id="standards" className={sectionTitle}>
            {standards.heading}
          </h2>
          <p className="font-display max-w-4xl text-balance text-xl leading-snug tracking-[-0.005em] text-ink sm:text-2xl">
            {standards.body}
          </p>
        </section>

        <footer>
          <div className="flex flex-col gap-6 border-t border-navy/12 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{join.text}</p>
            <Button href={join.href} variant="primary">
              {join.label}
            </Button>
          </div>
          <p className="mt-8 max-w-4xl text-xs leading-relaxed text-navy/45">{disclaimer}</p>
        </footer>
      </div>
    </main>
  );
}
