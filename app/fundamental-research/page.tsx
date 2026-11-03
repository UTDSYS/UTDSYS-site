import Button from "@/components/ui/Button";
import Swipe from "@/components/Swipe";
import FundamentalTabs from "@/components/research/FundamentalTabs";
import QValueGrid from "@/components/research/QValueGrid";
import content from "@/lib/content";

export const metadata = {
  title: "Fundamental Research — UofT Decision Systems",
  description:
    "Who we are at UofT Decision Systems Fundamental Research: our coverage, investment philosophy, six-step research process, and the Q-value framework.",
};

const { about, reports } = content.fundamentalResearch;
const { hero, who, coverage, philosophy, process, qvalue, accountability, standards, join } = about;

const label = "font-mono text-[0.75rem] uppercase tracking-[0.08em]";
const h2 = "font-display text-3xl font-semibold tracking-[-0.01em] text-ink sm:text-[2.4rem]";
const num = (i: number) => String(i + 1).padStart(2, "0");

export default function FundamentalAboutPage() {
  // the hero's quick facts, read off the page's own content
  const facts = [
    { value: String(coverage.items.length), label: "Coverage areas" },
    { value: String(process.steps.length), label: "Step research process" },
    { value: String(reports.filter((r) => !r.sample).length), label: "Published calls" },
    { value: "1+", label: "Peer reviewer per report" },
  ];

  return (
    <main className="relative min-h-screen overflow-x-clip pb-24">
      {/* hero: the division in one line, beside the grid every idea is scored on */}
      <section aria-labelledby="hero" className="blue-band text-white">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-24 sm:pb-20 sm:pt-28">
          <FundamentalTabs active="/fundamental-research" onDark />

          <div className="mt-14 grid grid-cols-1 items-center gap-14 sm:mt-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
            <div>
              <p className={`${label} text-[rgb(122_162_255)]`}>{hero.eyebrow}</p>
              <h1
                id="hero"
                className="font-display mt-5 text-balance text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.015em]"
              >
                {hero.title}
              </h1>
              <p className="mt-7 max-w-[38rem] text-lg leading-relaxed text-white/70">{hero.body}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href={hero.primary.href} variant="signal">
                  {hero.primary.label}
                </Button>
                <Button href={hero.secondary.href} variant="outline-light">
                  {hero.secondary.label}
                </Button>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[26rem]">
              <QValueGrid onDark compact label={hero.figure} />
            </div>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:mt-20 lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col-reverse bg-crest/80 px-5 py-5">
                <dt className={`${label} mt-1 text-white/50`}>{f.label}</dt>
                <dd className="font-display text-3xl font-semibold tracking-tight">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* who we are, then the three things we cover */}
      <section aria-labelledby="who" className="mx-auto mt-24 max-w-7xl px-6 sm:mt-28">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-0">
          <h2 id="who" className={h2}>
            {who.heading}
          </h2>
          <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-navy/80">
            {who.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-0">
          <h3 className={`${label} pt-2 text-navy/55`}>{coverage.heading}</h3>
          <ul className="grid gap-4 md:grid-cols-3">
            {coverage.items.map((c, i) => (
              <li key={c.title} className="rounded-lg border border-navy/12 bg-white p-6">
                <span className={`${label} text-signal-deep`}>{num(i)}</span>
                <h4 className="font-display mt-4 text-xl font-semibold tracking-tight text-ink">{c.title}</h4>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy/70">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* philosophy: three principles */}
      <section aria-labelledby="philosophy" className="mx-auto mt-24 max-w-7xl px-6 sm:mt-28">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-0">
          <h2 id="philosophy" className={`${h2} lg:pr-8`}>
            {philosophy.heading}
          </h2>
          <ol className="divide-y divide-navy/12 border-y border-navy/12">
            {philosophy.items.map((p, i) => (
              <li key={p.title} className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-[4rem_12rem_minmax(0,1fr)] sm:gap-6">
                <span className="font-mono text-sm tabular-nums text-signal-deep">{num(i)}</span>
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{p.title}</h3>
                <p className="text-[0.9375rem] leading-relaxed text-navy/75">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* process, on a full-width blue band */}
      <section id="process" aria-labelledby="process-heading" className="blue-band mt-24 scroll-mt-20 text-white sm:mt-28">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="max-w-3xl">
            <h2 id="process-heading" className="font-display text-3xl font-semibold tracking-[-0.01em] sm:text-[2.4rem]">
              {process.heading}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/70">{process.intro}</p>
          </div>
          <Swipe label={process.heading} count={process.steps.length} className="mt-12" onDark>
            <ol className="swipe grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {process.steps.map((s, i) => (
                <li key={s.title} className="border-t border-white/15 pt-5">
                  <span className="font-mono text-[0.75rem] tracking-[0.08em] text-[rgb(122_162_255)]">{num(i)}</span>
                  <h3 className="font-display mt-3 text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{s.body}</p>
                  {"layers" in s && (
                    <ol className="mt-4 space-y-2">
                      {s.layers.map((l, j) => (
                        <li key={l.title} className="rounded-md border border-white/12 bg-white/[0.04] px-3.5 py-3">
                          <span className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-white">
                            {j > 0 && <span aria-hidden="true" className="mr-1.5 text-[rgb(122_162_255)]">↓</span>}
                            {l.title}
                          </span>
                          <p className="mt-1 text-[0.8125rem] leading-relaxed text-white/60">{l.body}</p>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              ))}
            </ol>
          </Swipe>
        </div>
      </section>

      {/* Q-value: the grid, the value-trap check, and how each axis is measured */}
      <section aria-labelledby="qvalue" className="mx-auto mt-24 max-w-7xl px-6 sm:mt-28">
        <div className="max-w-3xl">
          <h2 id="qvalue" className={h2}>
            {qvalue.heading}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-navy/75">{qvalue.intro}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <QValueGrid />
          <div className="space-y-6">
            <div className="rounded-lg border-l-4 border-signal-deep bg-signal/[0.06] p-6">
              <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{qvalue.trapCheck.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy/75">{qvalue.trapCheck.body}</p>
            </div>
            {qvalue.measures.map((m) => (
              <div key={m.title} className="border-t border-navy/12 pt-5">
                <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{m.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy/75">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* accountability and standards, side by side */}
      <section aria-label="Accountability and research standards" className="mx-auto mt-24 max-w-7xl px-6 sm:mt-28">
        <div className="grid grid-cols-1 gap-12 border-t border-navy/12 pt-12 md:grid-cols-2 md:gap-16">
          {[accountability, standards].map((block) => (
            <div key={block.heading}>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">{block.heading}</h2>
              <ul className="mt-6 space-y-4">
                {block.items.map((item) => (
                  <li key={item} className="grid grid-cols-[1.25rem_minmax(0,1fr)] text-[0.9375rem] leading-relaxed text-navy/75">
                    <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 bg-signal-deep" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto mt-24 max-w-7xl px-6 sm:mt-28">
        <div className="flex flex-col gap-5 border-t border-navy/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-2xl font-semibold tracking-tight text-ink">{join.text}</p>
          <Button href={join.href} variant="signal">
            {join.label}
          </Button>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-navy/50">{content.fundamentalResearch.disclaimer}</p>
      </footer>
    </main>
  );
}
