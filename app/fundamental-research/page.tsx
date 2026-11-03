import Link from "next/link";
import Button from "@/components/ui/Button";
import Crest from "@/components/Crest";
import content from "@/lib/content";

export const metadata = {
  title: "Fundamental Research — UofT Decision Systems",
  description:
    "UofT Decision Systems Fundamental Research: bottom-up company research with a top-down view of the economy, focused on quality businesses at the right price.",
};

const { about, disclaimer } = content.fundamentalResearch;
const { hero, approach, coverage, process, standards, join } = about;

const label = "font-mono text-[0.75rem] uppercase tracking-[0.1em]";
const num = (i: number) => String(i + 1).padStart(2, "0");
// each section hangs its label off one left rail, as on the quant page
const row = "grid grid-cols-1 gap-8 border-t border-navy/12 pt-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-0";

export default function FundamentalAboutPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      {/* hero: one statement, one action */}
      <section aria-labelledby="hero" className="blue-band text-white">
        <div className="mx-auto flex min-h-[min(46rem,88vh)] max-w-7xl flex-col px-6 pb-16 pt-24 sm:pb-20 sm:pt-28">
          <div className="my-auto grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="max-w-3xl">
              <p className={`${label} text-white/55`}>{hero.eyebrow}</p>
              <h1
                id="hero"
                className="font-display mt-6 text-balance text-[clamp(2.75rem,7vw,5.75rem)] font-semibold leading-[0.95] tracking-[-0.02em]"
              >
                {hero.title}
              </h1>
              <p className="mt-8 max-w-[34rem] text-lg leading-relaxed text-white/65 sm:text-xl">{hero.body}</p>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Button href={hero.primary.href} variant="signal">
                  {hero.primary.label}
                </Button>
                <Link
                  href={hero.secondary.href}
                  className={`${label} group text-white/70 transition hover:text-white`}
                >
                  {hero.secondary.label}{" "}
                  <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
            <Crest className="hidden w-[min(24vw,300px)] opacity-80 lg:block" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-24 px-6 py-24 sm:space-y-32 sm:py-32">
        {/* approach: where we sit, then three principles */}
        <section aria-labelledby="approach" className={row}>
          <h2 id="approach" className={`${label} text-navy/55`}>
            {approach.heading}
          </h2>
          <div>
            <p className="font-display max-w-4xl text-balance text-2xl leading-snug tracking-[-0.01em] text-ink sm:text-[2rem]">
              {approach.intro}
            </p>
            <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {approach.items.map((a, i) => (
                <li key={a.title}>
                  <span className="font-mono text-xs tabular-nums text-signal-deep">{num(i)}</span>
                  <h3 className="font-display mt-3 text-xl font-semibold tracking-tight text-ink">{a.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-navy/70">{a.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* coverage: three lines */}
        <section aria-labelledby="coverage" className={row}>
          <h2 id="coverage" className={`${label} text-navy/55`}>
            {coverage.heading}
          </h2>
          <dl className="grid gap-8 sm:grid-cols-3">
            {coverage.items.map((c) => (
              <div key={c.title}>
                <dt className="font-display text-2xl font-semibold tracking-tight text-ink">{c.title}</dt>
                <dd className="mt-2 text-[0.9375rem] text-navy/65">{c.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* process: six steps on one line */}
        <section aria-labelledby="process" className={row}>
          <h2 id="process" className={`${label} text-navy/55`}>
            {process.heading}
          </h2>
          <ol className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 xl:grid-cols-6 xl:gap-6">
            {process.steps.map((s, i) => (
              <li key={s.title} className="border-l border-navy/15 pl-4">
                <span className="font-mono text-xs tabular-nums text-signal-deep">{num(i)}</span>
                <h3 className="font-display mt-2 text-lg font-semibold tracking-tight text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/65">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* accountability: one statement */}
        <section aria-labelledby="standards" className={row}>
          <h2 id="standards" className={`${label} text-navy/55`}>
            {standards.heading}
          </h2>
          <p className="max-w-3xl text-lg leading-relaxed text-navy/75">{standards.body}</p>
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
