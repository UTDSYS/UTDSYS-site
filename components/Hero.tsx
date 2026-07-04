"use client";

import { useIntroSequence } from "@/hooks/useIntroSequence";
import NeuralNet from "@/components/NeuralNet";
import Button from "@/components/ui/Button";
import content from "@/lib/content";

/**
 * The home page is one immersive screen. On load the network builds itself
 * as a cinematic sequence (see useIntroSequence) and flows, converging, into
 * the wordmark: input signals fire, edges draw, the single DECISION node
 * blooms right where "Decision Systems" resolves. Progress is written to
 * `--p` and all animation derives from it in CSS. You land on the finished
 * page — nothing to scroll to.
 */
export default function Hero() {
  const ref = useIntroSequence<HTMLElement>();

  return (
    <section ref={ref} className="nn-stage relative" data-end="false">
      <div className="flex min-h-svh flex-col items-center justify-center gap-8 px-6 py-24 sm:gap-10">
        <p className="nn-overline w-full text-center font-mono text-[0.7rem] uppercase tracking-[0.28em] text-navy/55 sm:text-xs sm:tracking-[0.45em]">
          {content.brand.name} · University of Toronto
        </p>

        {/* the network converges rightward, flush into the wordmark */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:gap-7">
          <div className="nn-net w-[min(70vw,340px)] shrink-0">
            <div className="relative aspect-[320/210] w-full">
              <NeuralNet />
            </div>
          </div>
          <h1 className="nn-word font-display text-center text-5xl font-extrabold leading-[0.9] tracking-tight text-ink sm:text-6xl md:text-left lg:text-7xl">
            Decision
            <br />
            Systems
          </h1>
        </div>

        <p className="nn-word w-full max-w-md text-center text-base text-navy/70 sm:text-lg">
          {content.hero.mission}
        </p>

        <div className="nn-endcap flex w-full max-w-xs flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:justify-center">
          <Button href={content.hero.primary.href}>
            {content.hero.primary.label}
          </Button>
          <Button href={content.hero.secondary.href} variant="secondary">
            {content.hero.secondary.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
