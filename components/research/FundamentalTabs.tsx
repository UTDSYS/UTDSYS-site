import Link from "next/link";
import content from "@/lib/content";

const { tabs } = content.fundamentalResearch;

/**
 * The two tabs under Fundamental Research: who we are (the landing page)
 * and the published reports. Each tab is its own page, so either can be
 * linked to directly; `active` names the one being shown.
 */
export default function FundamentalTabs({
  active,
  onDark = false,
}: {
  active: string;
  /** set when the tabs sit on the navy hero */
  onDark?: boolean;
}) {
  return (
    <nav aria-label="Fundamental research" className="flex gap-1.5">
      {tabs.map((t) => {
        const current = t.href === active;
        const tone = onDark
          ? current
            ? "bg-white text-ink"
            : "text-white/70 hover:bg-white/10 hover:text-white"
          : current
            ? "bg-ink text-offwhite"
            : "text-navy/60 hover:bg-navy/5 hover:text-ink";
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={current ? "page" : undefined}
            className={`rounded-full px-4 py-2 font-mono text-[0.75rem] uppercase tracking-[0.08em] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal ${tone}`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
