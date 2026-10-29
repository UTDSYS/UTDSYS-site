import Link from "next/link";
import Crest from "@/components/Crest";
import Button from "@/components/ui/Button";
import content from "@/lib/content";

/**
 * The home page is one screen: the group crest on a navy panel, and the
 * wordmark beside it.
 */
export default function Hero() {
  const { eyebrow, desks, primary } = content.hero;

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
          <h1 className="hero-in font-display mt-4 text-[clamp(3.75rem,9vw,7.5rem)] sm:mt-6 font-semibold leading-[0.9] tracking-[-0.01em] text-ink">
            Decision
            <br />
            Systems
          </h1>
          <ul className="hero-in mt-6 grid max-w-[38rem] gap-x-10 border-t sm:mt-10 border-navy/12 sm:grid-cols-2">
            {desks.map((d) => (
              <li key={d.name} className="pt-4 max-sm:pb-3">
                <Link
                  href={d.href}
                  className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
                >
                  <span className="font-display text-lg font-semibold tracking-tight text-ink transition group-hover:text-signal-deep">
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
          </div>
        </div>
      </div>
    </section>
  );
}
