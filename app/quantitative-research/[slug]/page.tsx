import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import GrowthChart from "@/components/quant/GrowthChart";
import RatioChart from "@/components/quant/RatioChart";
import content from "@/lib/content";
import etf from "@/lib/data/robust-portfolios-etf.json";

const { studies, reading, disclaimer, join } = content.quantResearch;
const { sections } = studies;

// Monthly growth series exported from the research repo, by study.
const growth: Record<string, typeof etf> = { "robust-portfolios": etf };

// References are numbered continuously across the reading list's groups.
const refs: string[] = reading.groups.flatMap((g) => g.items);

type Props = { params: Promise<{ slug: string }> };

// Only the studies in content exist; anything else is a 404.
export const dynamicParams = false;
export const generateStaticParams = () => studies.items.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = studies.items.find((s) => s.slug === slug);
  if (!study) return {};
  return {
    title: `${study.name} — UofT Decision Systems`,
    description: `${study.finding} ${study.question}`,
  };
}

const rail = "lg:grid-cols-[15rem_minmax(0,1fr)]";
const label = "font-mono text-[0.7rem] uppercase tracking-[0.16em]";

/** A section of the report: its name on the left rail, its body to the right. */
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section
      aria-labelledby={id}
      className={`mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-6 px-6 sm:mt-24 ${rail} lg:gap-0`}
    >
      <h2 id={id} className="font-display text-2xl font-extrabold tracking-[-0.03em] text-ink lg:pr-10">
        {title}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function Figure({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="border border-navy/15 bg-white p-6 sm:p-8">
      <p className="font-display text-xl font-bold tracking-tight text-ink">{title}</p>
      <div className="mt-6">{children}</div>
      <figcaption className="mt-6 border-t border-navy/8 pt-4 text-sm leading-relaxed text-navy/60">
        {caption}
      </figcaption>
    </figure>
  );
}

export default async function StudyPage({ params }: Props) {
  const { slug } = await params;
  const index = studies.items.findIndex((s) => s.slug === slug);
  if (index < 0) notFound();
  const study = studies.items[index];
  const series = growth[study.slug];

  return (
    <main className="relative min-h-screen pb-24">
      <header className="mx-auto max-w-6xl px-6 pt-28 sm:pt-36">
        <Link
          href="/quantitative-research"
          className={`${label} group inline-flex items-center gap-2 text-navy/50 transition hover:text-signal-deep`}
        >
          <span aria-hidden="true" className="transition group-hover:-translate-x-1">
            ←
          </span>
          {studies.backLabel}
        </Link>
        <p className={`${label} mt-10 text-signal-deep`}>
          {studies.label} {String(index + 1).padStart(2, "0")} <span className="text-navy/40">· {study.status}</span>
        </p>
        <h1 className="font-display mt-5 text-balance text-[clamp(2.5rem,6vw,4.75rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink">
          {study.name}
        </h1>
        <p className="font-display mt-6 max-w-[46rem] text-balance text-xl leading-snug tracking-tight text-signal-deep sm:text-2xl">
          {study.finding}
        </p>

      </header>

      {/* the study in four numbers, on a full-width blue band */}
      <div className="blue-band mt-14 text-white">
        <p className={`${label} mx-auto max-w-6xl px-6 pt-10 text-white/55`}>{studies.backtestLabel}</p>
        <dl className="mx-auto grid max-w-6xl grid-cols-2 px-6 pb-6 sm:pb-8 lg:grid-cols-4">
          {study.figures.map((f, i) => (
            <div
              key={f.label}
              className={`flex flex-col-reverse justify-end py-6 pr-4 ${i % 2 ? "border-l border-white/12 pl-4 sm:pl-6" : ""} ${i > 0 ? "lg:border-l lg:border-white/12 lg:pl-6" : ""} ${i > 1 ? "border-t border-white/12 lg:border-t-0" : ""}`}
            >
              <dt className="mt-2 text-sm leading-snug text-white/60">{f.label}</dt>
              <dd className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                {f.value}
                {f.unit && <span className="ml-2 text-lg font-semibold text-white/60">{f.unit}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <Section id="overview" title={sections.overview}>
        <p className="font-display max-w-[44rem] text-balance text-xl leading-snug tracking-tight text-ink sm:text-2xl">
          {study.question}
        </p>
        <div className="mt-6 max-w-[42rem] space-y-4 text-lg leading-relaxed text-navy/70">
          {study.overview.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Section>

      <Section id="findings" title={sections.findings}>
        <ol className="max-w-[44rem] divide-y divide-navy/10 border-y border-navy/10">
          {study.findings.map((f, i) => (
            <li key={f} className="grid grid-cols-[2.5rem_minmax(0,1fr)] py-5">
              <span className="font-mono text-xs tabular-nums leading-7 text-signal-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-base leading-relaxed text-navy/80 sm:text-lg">{f}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 space-y-8">
          <Figure title={study.charts.ratio.title} caption={study.charts.ratio.caption}>
            <RatioChart markets={study.markets} />
          </Figure>
          {series && (
            <Figure title={study.charts.growth.title} caption={study.charts.growth.caption}>
              <GrowthChart data={series} drawdownLabel={study.charts.growth.drawdownLabel} />
            </Figure>
          )}
        </div>
      </Section>

      <Section id="results" title={sections.results}>
        <div className="space-y-10">
          {study.markets.map((m) => (
            <div key={m.name}>
              <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-navy/15 pb-3">
                <span className="font-medium text-ink">{m.name}</span>
                <span className={`${label} text-navy/50`}>{m.period}</span>
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[28rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-navy/10 text-navy/55">
                      {studies.resultsColumns.map((c, j) => (
                        <th key={c} scope="col" className={`py-2.5 font-medium ${j > 0 ? "text-right" : ""}`}>
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="tabular-nums">
                    {m.rows.map((r) => (
                      <tr key={r.name} className="border-b border-navy/8 last:border-b-0">
                        <th
                          scope="row"
                          className={`py-2.5 font-medium ${r.name === "Robust" ? "text-ink" : "text-navy/75"}`}
                        >
                          {r.name}
                        </th>
                        {[r.vol, r.maxdd, r.sharpe].map((v, k) => (
                          <td key={k} className="py-2.5 text-right font-mono text-navy/75">
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="paper" title={sections.paper}>
        <div className="border border-navy/15 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-[34rem] text-base leading-relaxed text-navy/70">{study.paper.intro}</p>
            <p className="inline-flex items-center gap-2 bg-navy/[0.05] px-3 py-1 text-xs font-medium text-navy/70">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full border border-navy/50" />
              {study.paper.status}
            </p>
          </div>
          <dl className="mt-6 grid gap-4 border-t border-navy/8 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {study.paper.terms.map((t) => (
              <div key={t.label}>
                <dt className="text-sm text-navy/55">{t.label}</dt>
                <dd className="mt-0.5 text-base font-medium text-ink">{t.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section id="references" title={sections.references}>
        <ol className="max-w-[44rem] space-y-3.5">
          {study.reading.map((n) => (
            <li key={n} className="grid grid-cols-[2.5rem_minmax(0,1fr)]">
              <span className="font-mono text-xs tabular-nums leading-relaxed text-signal-deep">[{n}]</span>
              <p className="text-[0.9375rem] leading-relaxed text-navy/80">{refs[n - 1]}</p>
            </li>
          ))}
        </ol>
      </Section>

      <footer className={`mx-auto mt-24 grid max-w-6xl grid-cols-1 gap-8 px-6 sm:mt-28 ${rail} lg:gap-0`}>
        <div />
        <div>
          <div className="flex flex-col gap-5 border-t border-navy/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-2xl font-bold tracking-tight text-ink">{join.text}</p>
            <Button href={join.href} variant="signal">
              {join.label}
            </Button>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-navy/50">{disclaimer}</p>
        </div>
      </footer>
    </main>
  );
}
