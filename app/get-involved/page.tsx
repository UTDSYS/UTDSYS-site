import Link from "next/link";
import Crest from "@/components/Crest";
import Button from "@/components/ui/Button";
import ChannelIcon from "@/components/ChannelIcon";
import ContactForm from "@/components/ContactForm";
import CopyButton from "@/components/CopyButton";
import content from "@/lib/content";

export const metadata = {
  title: "Get Involved — UofT Decision Systems",
  description:
    "Join UofT Decision Systems, or work with us as a sponsor or partner. Open to students in every faculty.",
};

const { eyebrow, heading, steps, doors, desksPrompt, form } =
  content.getInvolved;
const { channels } = content.contactPage;

/** Long addresses may wrap after a slash, never mid-word. */
const breakable = (value: string) =>
  value.split("/").map((part, i) => (
    <span key={i}>
      {i > 0 && (
        <>
          /<wbr />
        </>
      )}
      {part}
    </span>
  ));

/**
 * The site's one dark page. Two doors, one action each: students on the
 * left with the only bright button on the page, sponsors, partners and
 * questions on the right with the message form. Contrast does the
 * directing. Below the navy, a white band holds every direct channel.
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
              {/* two thick bars set off to the side, the second shorter */}
              <div aria-hidden="true" className="mt-8 flex flex-col gap-2 sm:mt-10">
                <div className="h-2 w-40 bg-white sm:w-56" />
                <div className="h-2 w-20 bg-signal sm:w-28" />
              </div>
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
              <p className="mt-4 text-base text-white/70">
                {steps.missed.text}{" "}
                <a
                  href={`mailto:${steps.missed.email}`}
                  className="select-all font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white"
                >
                  {steps.missed.email}
                </a>
                .
              </p>

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

      {/* Every direct channel, on a white band below the navy. This is what
          used to be the Contact page; /contact redirects here. */}
      <section
        id="contact"
        aria-label="Direct contact"
        className="scroll-mt-24 border-t border-navy/10 bg-white"
      >
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
          <ul className="grid border-t-2 border-ink sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((c, i) => {
              const isEmail = c.label === "Email";
              return (
                <li
                  key={c.label}
                  className={`border-b border-navy/12 py-6 sm:pr-6 lg:border-b-0 lg:px-6 lg:first:pl-0 ${i > 0 ? "lg:border-l" : ""} ${i % 2 ? "sm:border-l sm:pl-6 lg:pl-6" : ""}`}
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-navy/70">
                    <ChannelIcon
                      label={c.label}
                      className="h-5 w-5 text-signal-deep"
                    />
                    {c.label}
                  </span>
                  <a
                    id={isEmail ? "direct-email" : undefined}
                    href={c.href}
                    {...(isEmail
                      ? {}
                      : { target: "_blank", rel: "noopener noreferrer" })}
                    className="font-display mt-3 block text-lg font-bold tracking-tight text-ink transition hover:text-signal-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
                  >
                    {breakable(c.value)}
                  </a>
                  {/* a mailto link doesn't open a mail app for everyone */}
                  {isEmail && (
                    <div className="mt-3">
                      <CopyButton value={c.value} targetId="direct-email" />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}
