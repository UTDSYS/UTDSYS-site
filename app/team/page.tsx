import Image from "next/image";
import Masthead from "@/components/Masthead";
import content, { type TeamMember } from "@/lib/content";

export const metadata = {
  title: "Team — UofT Decision Systems",
};

const { eyebrow, heading, intro, members } = content.team;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

/** Every headshot is the same 4:5 portrait, square-cornered. */
function Portrait({ m }: { m: TeamMember }) {
  const base = "relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden";
  if (m.photo)
    return (
      <span className={base}>
        <Image src={m.photo} alt="" fill sizes="(min-width: 1024px) 340px, 45vw" className="object-cover" />
      </span>
    );
  return (
    <span className={`${base} bg-navy/8 font-display text-4xl font-bold text-navy/40 sm:text-6xl`} aria-hidden="true">
      {initials(m.name)}
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
            blue dot in the corner is the crest's decision node. */}
        <ul className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {members.map((m, i) => (
            <li key={i} className="relative border border-navy/20 bg-white p-3 sm:p-6">
              <span
                className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_8px_2px_rgb(45_91_255/0.45)] sm:right-2.5 sm:top-2.5 sm:h-2 sm:w-2"
                aria-hidden="true"
              />
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
