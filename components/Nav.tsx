"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import content from "@/lib/content";
import { CrestBadge } from "@/components/Crest";

/**
 * Fixed site nav. On the home page it sits over the hero instead
 * (`data-home`, styled in globals.css), with a white brand over the crest.
 *
 * Desktop shows the links inline; below lg they collapse behind a menu
 * toggle so the links + wordmark never overflow a narrow viewport.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // Home sits the brand and menu toggle over the navy crest panel.
  const home = pathname === "/";

  // Close the menu when Escape is pressed. (Tapping a link closes it via the
  // link's own onClick.)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav
      data-home={home ? "true" : undefined}
      className="site-nav fixed inset-x-0 top-0 z-30 border-b border-navy/5 bg-offwhite/75 backdrop-blur-md"
    >
      {/* Home runs edge to edge so the link pill can sit wholly in the light
          field, clear of the crest panel's edge; it only fits from 1440px, so
          below that the home page uses the menu toggle. */}
      <div
        className={`mx-auto flex items-center justify-between px-6 py-4 sm:py-5 ${
          home ? "max-w-none lg:px-10" : "max-w-6xl"
        }`}
      >
        <Link
          href="/"
          className={`flex items-center gap-3 font-display text-lg font-bold tracking-tight transition ${
            home ? "text-white hover:text-white/75" : "text-ink hover:text-signal-deep"
          }`}
        >
          <CrestBadge className="h-9 w-9 shrink-0" />
          {content.brand.name}
        </Link>

        {/* Desktop links */}
        <div className={`nav-links hidden items-center gap-8 ${home ? "min-[1440px]:flex" : "lg:flex"}`}>
          {content.nav.links.map((l) =>
            "cta" in l ? (
              <Link
                key={l.label}
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className="nav-cta rounded-full bg-signal-deep px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white shadow-[0_6px_20px_-6px_rgb(29_63_184/0.6)] transition hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
              >
                {l.label}
              </Link>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                className={`font-mono text-[0.7rem] uppercase tracking-[0.18em] transition hover:text-signal ${
                  pathname === l.href ? "text-signal" : "text-navy/70"
                }`}
              >
                {l.label}
              </Link>
            ),
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`relative z-30 flex h-9 w-9 items-center justify-center rounded-full transition ${
            home
              ? "text-white hover:text-white/75 lg:text-navy lg:hover:text-signal min-[1440px]:hidden"
              : "text-navy hover:text-signal lg:hidden"
          }`}
        >
          <span className="sr-only">Menu</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <line
              x1="2"
              x2="18"
              y1={open ? "10" : "6"}
              y2={open ? "10" : "6"}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              className="origin-center transition-transform duration-300"
              style={{ transform: open ? "rotate(45deg)" : "none" }}
            />
            <line
              x1="2"
              x2="18"
              y1="14"
              y2="14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              className="origin-center transition-transform duration-300"
              style={{
                transform: open ? "translateY(-4px) rotate(-45deg)" : "none",
              }}
            />
          </svg>
        </button>
      </div>

      {/* Mobile dropdown panel */}
      <div
        className={`overflow-hidden border-navy/5 ${open ? "border-t" : ""} ${
          home ? "bg-offwhite min-[1440px]:hidden" : "lg:hidden"
        }`}
        style={{
          maxHeight: open ? "24rem" : "0",
          transition: "max-height 0.35s cubic-bezier(0.22,0.7,0.24,1)",
        }}
      >
        <div className="flex flex-col px-6 py-2">
          {content.nav.links.map((l) =>
            "cta" in l ? (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="my-3 rounded-full bg-signal-deep py-3 text-center font-mono text-xs uppercase tracking-[0.18em] text-white transition hover:bg-ink"
              >
                {l.label}
              </Link>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`border-b border-navy/5 py-3.5 font-mono text-xs uppercase tracking-[0.18em] transition hover:text-signal ${
                  pathname === l.href ? "text-signal" : "text-navy/70"
                }`}
              >
                {l.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </nav>
  );
}
