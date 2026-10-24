import Link from "next/link";
import Crest from "@/components/Crest";
import Button from "@/components/ui/Button";
import ContactForm from "@/components/ContactForm";
import content from "@/lib/content";

export const metadata = {
  title: "Get Involved — UofT Decision Systems",
  description:
    "Join UofT Decision Systems, or work with us as a sponsor or partner. Open to students in every faculty.",
};

const { eyebrow, heading, intro, steps, doors, desksPrompt, form } =
  content.getInvolved;

/**
 * The site's one dark page. Two doors, one action each: students on the
 * left with the only bright button on the page, sponsors and partners on
 * the right with a quiet outline one. Contrast does the directing.
 */
export default function GetInvolvedPage() {
  return (
    // pt clears the fixed nav, which stays on its light bar above the navy
    <main className="flex min-h-screen flex-col pt-[4.1rem] sm:pt-[4.6rem]">
      <div className="team-masthead flex-1 text-white">
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pb-28 sm:pt-20">
          <header className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <p className="font-display text-[0.9375rem] font-semibold tracking-tight text-white/70 sm:text-base">
                {eyebrow}
              </p>
              <h1 className="font-display mt-4 text-[clamp(3.25rem,9vw,7.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em] sm:mt-5">
                {heading}
              </h1>
              <p className="mt-6 max-w-[34rem] text-balance text-[1.0625rem] leading-[1.45] text-white/75 sm:text-xl">
                {intro}
              </p>
            </div>
            <Crest className="hidden w-[min(22vw,260px)] md:block" />
          </header>

          {/* two doors */}
          <div className="mt-14 grid border border-white/15 bg-white/[0.04] sm:mt-16 md:grid-cols-2">
            <section
              aria-labelledby="students"
              className="flex flex-col p-7 sm:p-10"
            >
              <p className="text-sm font-medium text-[#9db3ff]">
                {doors.students.label}
              </p>
              <h2
                id="students"
                className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
              >
                {doors.students.heading}
              </h2>
              <p className="mt-3 max-w-[28rem] text-base leading-relaxed text-white/75">
                {doors.students.body}
              </p>

              {/* a real sequence, so numbered */}
              <ol className="mt-7 space-y-3 border-t border-white/12 pt-6">
                {steps.items.map((s, i) => (
                  <li
                    key={s.name}
                    className="grid grid-cols-[1.75rem_minmax(0,1fr)] text-base"
                  >
                    <span className="font-display font-bold tabular-nums text-[#9db3ff]">
                      {i + 1}
                    </span>
                    <span>
                      <span className="font-semibold text-white">
                        {s.name}.
                      </span>{" "}
                      <span className="text-white/70">{s.body}</span>
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-auto pt-9">
                <Button
                  href={form.disabled.discord.href}
                  variant="signal"
                  className="w-full sm:w-auto"
                >
                  {doors.students.action}
                </Button>
              </div>
            </section>

            <section
              aria-labelledby="partners"
              className="flex flex-col border-t border-white/15 p-7 sm:p-10 md:border-l md:border-t-0"
            >
              <p className="text-sm font-medium text-white/60">
                {doors.partners.label}
              </p>
              <h2
                id="partners"
                className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
              >
                {doors.partners.heading}
              </h2>
              <p className="mt-3 max-w-[28rem] text-base leading-relaxed text-white/75">
                {doors.partners.body}
              </p>

              <div className="mt-8">
                {/* the form, in its dark tone; topic defaults to sponsorship */}
                <ContactForm
                  tone="dark"
                  defaultTopic="Sponsorship or partnership"
                  idPrefix="partners"
                />
              </div>
            </section>
          </div>

          <p className="mt-10 text-base text-white/70">
            {desksPrompt}{" "}
            <Link
              href="/quantitative-research"
              className="font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white"
            >
              Quantitative
            </Link>{" "}
            and{" "}
            <Link
              href="/fundamental-research"
              className="font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white"
            >
              Fundamental
            </Link>{" "}
            desks.
          </p>
        </div>
      </div>
    </main>
  );
}
