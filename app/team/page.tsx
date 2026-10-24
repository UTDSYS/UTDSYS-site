import TeamNet from "@/components/TeamNet";
import content from "@/lib/content";

export const metadata = {
  title: "Team — UofT Decision Systems",
};

const { eyebrow, heading, intro, hint, output, openSeat, divisions } = content.team;

export default function TeamPage() {
  return (
    <main className="relative min-h-screen">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-36">
        <header className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-signal">
            {eyebrow}
          </p>
          <h1 className="font-display mt-5 text-5xl font-bold tracking-tight text-ink md:text-6xl">
            {heading}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-navy/70 md:text-lg">
            {intro}
          </p>
        </header>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-28">
        <TeamNet
          divisions={divisions}
          output={output}
          hint={hint}
          openSeat={openSeat}
        />
      </div>
    </main>
  );
}
