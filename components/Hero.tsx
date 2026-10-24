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
 * The scaffold draws as hairlines; both desks' inputs scramble in their
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
      <div className="relative z-10 mx-auto flex min-h-svh max-w-6xl items-center px-6 pb-10 pt-20 sm:pb-14 sm:pt-28">
        {/* Figure left, wordmark right: the network converges rightward,
            flush into the name. Stacked, it converges down into it. */}
        <div className="grid w-full items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
          <figure className="mx-auto w-full max-w-[520px] lg:mx-0">
            <div className="nn-net">
              <NeuralNet />
            </div>

            {/* the quote the network is producing right now */}
            <div className="nn-quote mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-t border-navy/10 pt-4 font-mono tabular-nums">
              <div className="flex gap-5 text-[0.95rem] sm:gap-8 sm:text-lg">
                {(["fair", "bid", "ask"] as const).map((key) => (
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
                className="nn-action inline-flex items-center rounded-full border border-navy/10 bg-white/45 px-3.5 py-1.5 text-[0.66rem] uppercase tracking-[0.18em] text-navy/70"
                data-qn="action"
              >
                <span data-qn="action-text">{net.actions["quote-both"]}</span>
              </span>
            </div>

            <figcaption className="nn-meta mt-3 flex flex-col gap-2 sm:mt-4">
              <p className="hidden max-w-md text-xs leading-relaxed text-navy/55 sm:block">
                <span className="font-mono text-navy/80">{net.caption.label}</span>
                {"\u2002"}
                {net.caption.body}
              </p>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-navy/45">
                {net.caption.note} ·{" "}
                <b className="font-medium text-navy" data-qn="count">
                  0
                </b>{" "}
                {net.meta.decisions}
              </p>
            </figcaption>
          </figure>

          <div className="flex flex-col items-start">
            <p className="nn-overline font-mono text-[0.7rem] uppercase tracking-[0.32em] text-signal sm:text-xs">
              {content.hero.eyebrow}
            </p>
            <h1 className="nn-word font-display mt-4 text-5xl font-extrabold sm:mt-5 sm:text-6xl md:text-7xl leading-[0.9] tracking-tight text-ink xl:text-8xl">
              Decision
              <br />
              Systems
            </h1>
            <p className="nn-word mt-4 max-w-md text-lg leading-relaxed sm:mt-6 text-navy/70 sm:text-xl">
              {content.hero.mission}
            </p>

            <div className="nn-endcap mt-7 flex flex-wrap gap-3 sm:mt-9">
              <Button href={content.hero.primary.href}>
                {content.hero.primary.label}
              </Button>
              <Button href={content.hero.secondary.href} variant="secondary">
                {content.hero.secondary.label}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* the current call, for screen readers */}
      <p className="sr-only" aria-live="polite" data-qn="status" />
    </section>
  );
}
