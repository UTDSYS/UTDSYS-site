import Link from "next/link";
import content from "@/lib/content";

/**
 * Fixed site nav. Visible by default; on the home page the
 * `body:has(.bp-stage)` rules in globals.css keep it hidden until the
 * hero's bird's-eye finale (driven by --hero-title on :root).
 */
export default function Nav() {
  return (
    <nav className="site-nav fixed inset-x-0 top-0 z-20 border-b border-navy/5 bg-offwhite/75 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight text-ink transition hover:text-signal"
        >
          {content.brand.name}
        </Link>
        <div className="flex gap-6 md:gap-8">
          {content.nav.links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-navy/70 transition hover:text-signal"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
