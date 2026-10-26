import Image from "next/image";
import Masthead from "@/components/Masthead";
import content, { type TeamMember } from "@/lib/content";

export const metadata = {
  title: "Team — UofT Decision Systems",
};

const { eyebrow, heading, intro, members } = content.team;

/** Every headshot is the same 4:5 portrait, square-cornered. */
function Portrait({ m }: { m: TeamMember }) {
  const base = "relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden";
  if (m.photo)
    return (
      <span className={base}>
        <Image src={m.photo} alt="" fill sizes="(min-width: 1024px) 340px, 45vw" className="object-cover" />
      </span>
    );
  // no photo yet: a generic head-and-shoulders silhouette rising from the
  // bottom edge, in the navy tint
  return (
    <span className={`${base} bg-navy/8`} aria-hidden="true">
      <svg viewBox="0 0 80 100" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 h-full w-full text-navy/25">
        <circle cx="40" cy="44" r="15" fill="currentColor" />
        <path d="M10 100 C10 78 23 66 40 66 C57 66 70 78 70 100 Z" fill="currentColor" />
      </svg>
    </span>
  );
}

export default function TeamPage() {
  return (
    // pt clears the fixed nav, so its translucent bar sits on the light
    // ground rather than turning grey over the navy
    <main className="relative min-h-screen pt-[4.1rem] sm:pt-[4.6rem]">
      <Masthead eyebrow={eyebrow} heading={heading} intro={intro} />

      {/* one roster: the same portrait card for everyone */}
      <section aria-label="Members" className="mx-auto max-w-6xl px-6 pb-28 pt-14 sm:pt-20">
        {/* Large, framed cards: the photo sits inset like an ID card. The
            Get involved heading's two bars sit on the frame: the long navy
            one along the top from the left corner, the short blue one along
            the bottom into the right corner. */}
        <ul className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {members.map((m, i) => (
            <li key={i} className="relative border border-navy/20 bg-white p-3 sm:p-6">
              <span className="absolute -left-px -top-px h-1.5 w-2/5 bg-ink sm:h-2" aria-hidden="true" />
              <span className="absolute -bottom-px -right-px h-1.5 w-1/5 bg-signal sm:h-2" aria-hidden="true" />
              <Portrait m={m} />
              <div className="mt-3 border-t border-navy/12 pt-3 sm:mt-5 sm:pt-4">
                <p className="font-display text-lg font-bold tracking-tight text-ink sm:text-2xl">{m.name}</p>
                <p className="mt-0.5 whitespace-pre-line text-[0.9375rem] leading-snug text-navy/70 sm:mt-1 sm:text-base">
                  {m.role}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
