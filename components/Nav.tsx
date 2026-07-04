"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import content from "@/lib/content";

/**
 * Fixed site nav. Visible by default; on the home page the
 * `body:has(.nn-stage)` rules in globals.css keep it hidden until the
 * hero's wordmark resolves (driven by --hero-title on :root).
 *
 * Desktop shows the links inline; on mobile they collapse behind a menu
 * toggle so the five links + wordmark never overflow a phone width.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the menu when Escape is pressed. (Tapping a link closes it via the
  // link's own onClick.)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav className="site-nav fixed inset-x-0 top-0 z-30 border-b border-navy/5 bg-offwhite/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:py-5">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight text-ink transition hover:text-signal"
        >
          {content.brand.name}
        </Link>

        {/* Desktop links */}
        <div className="hidden gap-8 md:flex">
          {content.nav.links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`font-mono text-[0.7rem] uppercase tracking-[0.18em] transition hover:text-signal ${
                pathname === l.href ? "text-signal" : "text-navy/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative z-30 flex h-9 w-9 items-center justify-center rounded-full text-navy transition hover:text-signal md:hidden"
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
        className={`overflow-hidden border-navy/5 md:hidden ${
          open ? "border-t" : ""
        }`}
        style={{
          maxHeight: open ? "20rem" : "0",
          transition: "max-height 0.35s cubic-bezier(0.22,0.7,0.24,1)",
        }}
      >
        <div className="flex flex-col px-6 py-2">
          {content.nav.links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`border-b border-navy/5 py-3.5 font-mono text-xs uppercase tracking-[0.18em] transition last:border-b-0 hover:text-signal ${
                pathname === l.href ? "text-signal" : "text-navy/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
