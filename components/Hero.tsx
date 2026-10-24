import Link from "next/link";
import Crest from "@/components/Crest";
import Button from "@/components/ui/Button";
import content from "@/lib/content";

/* Coordinates are thousandths of an em from the left of the first ı, so the
   net scales with the wordmark. The dots sit 0.7775em apart (measured off
   the set type, tracking included); the hidden layer stays above the "s". */
const IN = { x: 155.5, y: 285 };
const OUT = { x: 933, y: 285 };
const HIDDEN = [45, 165, 285].map((y) => ({ x: 544, y }));

/** A 1 → 3 → 1 net strung between the two lit dots of "Decision". */
function TittleNet() {
  const edges = HIDDEN.flatMap((h, i) => [
    { a: IN, b: h, layer: 0, i },
    { a: h, b: OUT, layer: 1, i },
  ]);
  return (
    <svg className="hero-net" viewBox="0 0 1100 450" aria-hidden="true">
      {edges.map(({ a, b, layer, i }) => (
        <g key={`${layer}-${i}`} style={{ "--layer": layer, "--i": i } as React.CSSProperties}>
          <line className="hero-net-edge" x1={a.x} y1={a.y} x2={b.x} y2={b.y} pathLength={1} />
          <line className="hero-net-spark" x1={a.x} y1={a.y} x2={b.x} y2={b.y} pathLength={1} />
        </g>
      ))}
      {HIDDEN.map((h, i) => (
        <circle key={i} className="hero-net-node" cx={h.x} cy={h.y} r="30" style={{ "--i": i } as React.CSSProperties} />
      ))}
    </svg>
  );
}

/**
 * The home page is one screen: the group crest on a navy panel, and the
 * wordmark beside it. Both dots on the i's in "Decision" are lit in the
 * accent, joined by a miniature net: the first lands with the copy, the net
 * draws across, the second lights, then signal keeps running between them.
 */
export default function Hero() {
  const { eyebrow, lede, desks, primary, secondary } = content.hero;

  return (
    <section className="hero grid min-h-svh lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* Mobile: the panel is held to about a quarter of the first screen
          (below the nav), so the wordmark and buttons land above the fold. */}
      <div className="hero-panel flex min-h-[calc(4.25rem+min(240px,28svh))] items-center justify-center px-6 pb-5 pt-[4.75rem] sm:min-h-0 sm:pb-12 sm:pt-28 lg:p-0">
        <Crest className="w-[156px] sm:w-[260px] lg:w-[min(27.5vw,396px)]" />
      </div>

      <div className="flex flex-col justify-center px-6 pb-12 pt-8 sm:px-10 sm:py-14 lg:py-0 lg:pb-[8svh] lg:pl-24 lg:pr-16">
        <div className="max-w-[40rem]">
          <p className="hero-in font-display text-[0.9375rem] font-semibold tracking-tight text-navy/70 sm:text-base">
            {eyebrow}
          </p>
          <h1 className="hero-in hero-word font-display mt-4 text-[clamp(3.75rem,9vw,7.5rem)] sm:mt-6 font-extrabold leading-[0.9] tracking-[-0.04em] text-ink">
            <span className="sr-only">Decision Systems</span>
            <span aria-hidden="true">
              Dec
              <span className="relative">
                ı<span className="hero-tittle" />
                <TittleNet />
              </span>
              s
              <span className="relative">
                ı<span className="hero-tittle hero-tittle-out" />
              </span>
              on
              <br />
              Systems
            </span>
          </h1>
          <p className="hero-in mt-5 max-w-[34rem] text-balance text-[1.0625rem] leading-[1.45] text-navy/75 sm:mt-8 sm:text-xl">
            {lede}
          </p>

          <ul className="hero-in mt-6 grid max-w-[38rem] gap-x-10 border-t sm:mt-10 border-navy/12 sm:grid-cols-2">
            {desks.map((d) => (
              <li key={d.name} className="pt-4 max-sm:pb-3">
                <Link
                  href={d.href}
                  className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
                >
                  <span className="font-display text-lg font-bold tracking-tight text-ink transition group-hover:text-signal-deep">
                    {d.name}
                  </span>
                  <span className="mt-1 block text-base leading-relaxed text-navy/70">{d.body}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="hero-in mt-6 flex flex-wrap gap-3 sm:mt-10">
            <Button href={primary.href} variant="deep">
              {primary.label}
            </Button>
            <Button href={secondary.href} variant="secondary">
              {secondary.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
