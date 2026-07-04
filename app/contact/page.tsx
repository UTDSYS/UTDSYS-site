import PageShell from "@/components/PageShell";
import content from "@/lib/content";

export const metadata = {
  title: "Contact — UofT Decision Systems",
  description:
    "Reach UofT Decision Systems by email, Discord, GitHub, or LinkedIn.",
};

const { heading, intro, channels } = content.contactPage;

export default function ContactPage() {
  return (
    <PageShell>
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-signal">
        Contact
      </p>
      <h1 className="font-display mt-5 text-5xl font-bold tracking-tight text-ink md:text-6xl">
        {heading}
      </h1>
      <p className="mt-6 w-full max-w-md text-base leading-relaxed text-navy/70">
        {intro}
      </p>

      <ul className="mt-12 w-full max-w-md text-left">
        {channels.map((c) => {
          const external = c.href.startsWith("http");
          return (
            <li key={c.label} className="border-t border-navy/12 last:border-b">
              <a
                href={c.href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex items-center justify-between gap-6 py-5"
              >
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-navy/50">
                  {c.label}
                </span>
                <span className="flex items-center gap-2 font-display text-base font-semibold text-ink transition group-hover:text-signal">
                  {c.value}
                  <span
                    aria-hidden="true"
                    className="text-signal transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}
