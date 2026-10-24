import Link from "next/link";
import ChannelIcon from "@/components/ChannelIcon";
import ContactForm from "@/components/ContactForm";
import CopyButton from "@/components/CopyButton";
import content from "@/lib/content";

export const metadata = {
  title: "Contact — UofT Decision Systems",
  description:
    "Send UofT Decision Systems a message, or reach the team by email, Discord, GitHub, or LinkedIn.",
};

const { eyebrow, heading, intro, joinPrompt, form, direct, channels } = content.contactPage;

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
 * A light, practical page: the heading across the top, then the message
 * form as the main element, with every direct channel in a compact column
 * beside it. The counterpart to the dark, persuasive Get involved page.
 */
export default function ContactPage() {
  const [emailChannel, ...others] = channels;

  return (
    <main className="relative min-h-screen">
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-32 sm:pt-40">
        <header className="grid gap-8 border-b border-navy/12 pb-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:gap-16 md:pb-14">
          <div>
            <p className="font-display text-[0.9375rem] font-semibold tracking-tight text-navy/70 sm:text-base">
              {eyebrow}
            </p>
            <h1 className="font-display mt-4 text-[clamp(3.25rem,8vw,6.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-ink sm:mt-5">
              {heading}
            </h1>
          </div>
          <div>
            <p className="text-balance text-[1.0625rem] leading-[1.45] text-navy/75 sm:text-xl">{intro}</p>
            <p className="mt-4 text-base text-navy/70">
              {joinPrompt.text}{" "}
              <Link
                href={joinPrompt.href}
                className="font-semibold text-signal-deep underline decoration-signal-deep/30 underline-offset-4 transition hover:decoration-signal-deep"
              >
                {joinPrompt.label}
              </Link>
            </p>
          </div>
        </header>

        <div className="mt-12 grid gap-12 lg:mt-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-14">
          {/* the form, in the site's card */}
          <section
            id="message"
            aria-labelledby="message-heading"
            className="relative scroll-mt-28 border border-navy/20 bg-white p-6 sm:p-9"
          >
            <span
              className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-signal shadow-[0_0_8px_2px_rgb(45_91_255/0.45)]"
              aria-hidden="true"
            />
            <h2 id="message-heading" className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {form.heading}
            </h2>
            <div className="mt-6">
              <ContactForm tone="light" idPrefix="contact" />
            </div>
          </section>

          {/* every other way in */}
          <aside aria-labelledby="direct-heading">
            <h2 id="direct-heading" className="font-display text-lg font-bold tracking-tight text-ink">
              {direct.heading}
            </h2>
            <ul className="mt-4 border-t-2 border-ink">
              <li className="border-b border-navy/12 py-5">
                <span className="flex items-center gap-2.5 text-sm font-medium text-navy/70">
                  <ChannelIcon label={emailChannel.label} className="h-5 w-5 text-signal-deep" />
                  {emailChannel.label}
                </span>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <a
                    id="contact-email"
                    href={emailChannel.href}
                    className="font-display text-xl font-bold tracking-tight text-ink transition hover:text-signal-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
                  >
                    {emailChannel.value}
                  </a>
                  {/* a mailto link doesn't open a mail app for everyone */}
                  <CopyButton value={emailChannel.value} targetId="contact-email" />
                </div>
              </li>
              {others.map((c) => (
                <li key={c.label} className="border-b border-navy/12">
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-x-2.5 gap-y-0.5 py-4 transition hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
                  >
                    <ChannelIcon label={c.label} className="h-5 w-5 text-signal-deep" />
                    <span className="text-sm font-medium text-navy/70">{c.label}</span>
                    <span className="font-display col-start-2 text-lg font-bold tracking-tight text-ink transition group-hover:text-signal-deep">
                      {breakable(c.value)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
