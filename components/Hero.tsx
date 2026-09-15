"use client";

import { useIntroSequence } from "@/hooks/useIntroSequence";
import { useQuotingNet } from "@/hooks/useQuotingNet";
import NeuralNet from "@/components/NeuralNet";
import Button from "@/components/ui/Button";
import content from "@/lib/content";

/**
 * The home page is one immersive screen, and the intro is the model taking
 * its first decision — not a curtain that plays in front of one.
 *
 * The scaffold draws as hairlines; the five market features scramble in their
 * rail and settle onto real values; every edge draws itself on, flooding with
 * signal as it lands; the convergence arrives and the decision node blooms
 * with the wordmark; the quote it produces goes live. One continuous idea,
 * about 2.4s, then it keeps running.
 *
 * Both hooks share one ref. useIntroSequence writes `--p` to it and every CSS
 * phase derives from that; useQuotingNet reads `--p` back off the same inline
 * style to know how far the rail has settled. The intro and the computation
 * compose instead of fighting.
 */

export default function Hero() {
  const ref = useIntroSequence<HTMLElement>();
  useQuotingNet(ref);

  const { net } = content.hero;

  return (
    <section ref={ref} className="nn-stage relative overflow-hidden" data-end="false">
      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center gap-8 px-6 py-24 sm:gap-10">
        <p className="nn-overline w-full text-center font-mono text-[0.7rem] uppercase tracking-[0.28em] text-navy/55 sm:text-xs sm:tracking-[0.45em]">
          {content.brand.name} · University of Toronto
        </p>

        {/* the network converges rightward, flush into the wordmark */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:gap-8">
          <div className="nn-net w-[min(88vw,440px)] shrink-0 md:w-[min(46vw,480px)]">
            <NeuralNet />
          </div>

          <div className="flex flex-col items-center gap-4 md:items-start">
            <h1 className="nn-word font-display text-center text-5xl font-extrabold leading-[0.9] tracking-tight text-ink sm:text-6xl md:text-left lg:text-7xl">
              Decision
              <br />
              Systems
            </h1>

            {/* the quote the network is producing right now */}
            <div className="nn-quote flex flex-col items-center gap-2 font-mono tabular-nums md:items-start">
              <div className="flex gap-6 text-base sm:text-lg">
                {(["bid", "ask", "skew"] as const).map((key) => (
                  <div key={key} className="flex flex-col gap-0.5">
                    <span className="text-[0.6rem] uppercase tracking-[0.22em] text-navy/45">
                      {net.readout[key]}
                    </span>
                    <span className="nn-figure font-medium text-ink" data-qn={key}>
                      {net.loading}
                    </span>
                  </div>
                ))}
              </div>

              <span
                className="nn-action inline-flex items-center rounded-full border border-navy/10 bg-white/45 px-3.5 py-1.5 text-[0.7rem] uppercase tracking-[0.18em] text-navy/70"
                data-qn="action"
              >
                <span data-qn="action-text">{net.actions["quote-both"]}</span>
              </span>
            </div>
          </div>
        </div>

        <p className="nn-word w-full max-w-md text-center text-base text-navy/70 sm:text-lg">
          {content.hero.mission}
        </p>

        <div className="nn-endcap flex w-full flex-col items-center gap-5">
          <p className="nn-meta text-center font-mono text-[0.66rem] uppercase tracking-[0.18em] text-navy/45">
            <span>
              <b className="font-medium text-navy" data-qn="count">
                0
              </b>{" "}
              {net.meta.decisions}
            </span>
          </p>

          <div className="flex w-full max-w-xs flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:justify-center">
            <Button href={content.hero.primary.href}>
              {content.hero.primary.label}
            </Button>
            <Button href={content.hero.secondary.href} variant="secondary">
              {content.hero.secondary.label}
            </Button>
          </div>
        </div>
      </div>

      {/* the current call, for screen readers */}
      <p className="sr-only" aria-live="polite" data-qn="status" />
    </section>
  );
}
