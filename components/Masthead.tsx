import Crest from "@/components/Crest";

/**
 * The navy page header shared by Team, Get involved and Contact: eyebrow,
 * a large heading and an intro on the left, the crest on the right from md
 * up. Pages render it directly under a `pt` that clears the fixed nav, so
 * the nav's translucent bar never sits over the navy.
 */
export default function Masthead({
  eyebrow,
  heading,
  intro,
}: {
  eyebrow: string;
  heading: string;
  intro?: string;
}) {
  return (
    <header className="team-masthead text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 sm:py-20 md:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="font-display text-[0.9375rem] font-semibold tracking-tight text-white/70 sm:text-base">
            {eyebrow}
          </p>
          <h1 className="font-display mt-4 text-balance text-[clamp(3.25rem,9vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.01em] sm:mt-5">
            {heading}
          </h1>
          {/* the Get involved bars, cut into an equal row like the roster
              below: every member the same size, the last one lit */}
          <div aria-hidden="true" className="mt-8 flex gap-1.5 sm:mt-10">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-2 w-10 bg-white sm:w-14" />
            ))}
            <span className="h-2 w-10 bg-signal sm:w-14" />
          </div>
          {intro && (
            <p className="mt-6 max-w-[34rem] text-balance text-[1.0625rem] leading-[1.45] text-white/75 sm:mt-7 sm:text-xl">
              {intro}
            </p>
          )}
        </div>
        <Crest className="hidden w-[min(26vw,300px)] md:block" />
      </div>
    </header>
  );
}
