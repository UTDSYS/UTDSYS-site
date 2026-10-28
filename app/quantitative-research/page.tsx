import Button from "@/components/ui/Button";
import Crest from "@/components/Crest";
import Swipe from "@/components/Swipe";
import VarianceSurface from "@/components/quant/VarianceSurface";
import StudyCard from "@/components/quant/StudyCard";
import content from "@/lib/content";

export const metadata = {
  title: "Quantitative Research — UofT Decision Systems",
  description:
    "The UofT Decision Systems quantitative desk: portfolio research, tested on past data and then in paper trading.",
};

const { eyebrow, heading, intro, story, disclaimer, studies, reading, join } = content.quantResearch;

// References are numbered continuously across groups, in the order listed,
// so a study's report can cite one by number.
const groups = reading.groups.reduce<{ name: string; start: number; items: readonly string[] }[]>(
  (acc, g) => {
    const prev = acc[acc.length - 1];
    acc.push({ ...g, start: prev ? prev.start + prev.items.length : 1 });
    return acc;
  },
  [],
);

// One left column runs the length of the page, so the reading list
// and the footer hang off the same edge.
const rail = "lg:grid-cols-[15rem_minmax(0,1fr)]";
const label = "font-mono text-[0.7rem] uppercase tracking-[0.16em]";

export default function QuantitativeResearchPage() {
  return (
    <main className="relative min-h-screen pb-24">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-12 px-6 pt-28 sm:pt-40">
        <div className="min-w-0">
          <p className={`${label} text-signal-deep`}>{eyebrow}</p>
          <h1 className="font-display mt-5 text-balance text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink">
            {heading}
          </h1>
          {/* the Get involved bars, stood upright beside the intro: the first
              runs its full height, the second is shorter */}
          <div className="mt-6 flex items-stretch gap-5 sm:gap-6">
            <div aria-hidden="true" className="flex shrink-0 gap-1.5">
              <span className="w-1.5 bg-ink" />
              <span className="h-3/5 w-1.5 bg-signal" />
            </div>
            <p className="max-w-[36rem] text-lg leading-relaxed text-navy/70 sm:text-xl">{intro}</p>
          </div>
        </div>
        {/* the seal, turning beside the headline */}
        <Crest tone="light" className="hidden w-[min(22vw,250px)] shrink-0 md:block" />
      </header>

      {/* the story, for someone who has never heard of the desk, beside the
          kind of problem it means: a real variance surface, solved live */}
      <section aria-labelledby="story" className="blue-band mt-20 text-white sm:mt-28">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div>
            <h2 id="story" className={`${label} text-white/55`}>
              {story.label}
            </h2>
            <p className="font-display mt-5 text-balance text-3xl font-bold leading-[1.15] tracking-[-0.025em] sm:text-[2.6rem]">
              {story.lede}
            </p>
            <p className="mt-6 max-w-[36rem] text-lg leading-relaxed text-white/70">{story.body}</p>
          </div>
          <VarianceSurface label={story.figure} />
        </div>
      </section>

      {/* each study is a card; its report has its own page */}
      <section aria-labelledby="studies" className="mx-auto mt-24 max-w-6xl px-6 sm:mt-28">
        <h2 id="studies" className="font-display text-3xl font-extrabold tracking-[-0.03em] text-ink">
          {studies.heading}
        </h2>
        <ul className="mt-8 space-y-6">
          {studies.items.map((s) => (
            <li key={s.slug}>
              <StudyCard study={s} />
            </li>
          ))}
        </ul>
      </section>

      {/* the reading list, as a bibliography on the same rail */}
      <section
        aria-labelledby="reading"
        className={`mx-auto mt-24 grid max-w-6xl grid-cols-1 gap-8 px-6 sm:mt-28 ${rail} lg:gap-0`}
      >
        <div className="lg:pr-10">
          <h2 id="reading" className="font-display text-3xl font-extrabold tracking-[-0.03em] text-ink">
            {reading.heading}
          </h2>
        </div>
        {/* on phones each group is a card in a swipe row */}
        <Swipe label={reading.heading} count={groups.length}>
          <div className="swipe space-y-10 [--swipe-w:86%]">
            {groups.map((g) => (
              <div key={g.name}>
                <h3 className={`${label} border-b border-navy/12 pb-3 text-navy/55`}>{g.name}</h3>
                <ol className="mt-4 space-y-3.5">
                  {g.items.map((cite, i) => (
                    <li
                      key={cite}
                      id={`ref-${g.start + i}`}
                      className="grid scroll-mt-28 grid-cols-[2.5rem_minmax(0,1fr)] target:bg-signal/[0.07]"
                    >
                      <span className="font-mono text-xs tabular-nums leading-relaxed text-signal-deep">
                        [{g.start + i}]
                      </span>
                      <p className="text-[0.9375rem] leading-relaxed text-navy/80">{cite}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Swipe>
      </section>

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
