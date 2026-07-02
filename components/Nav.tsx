"use client";

import Link from "next/link";
import type { MotionValue } from "framer-motion";
import { map, useScrollApply } from "@/lib/scroll";
import content from "@/lib/content";

export default function Nav({
  progress,
}: {
  // Home passes scroll progress so the bar fades in during the transition.
  // Sub-pages omit it and the bar is visible immediately.
  progress?: MotionValue<number>;
}) {
  const ref = useScrollApply<HTMLElement>(progress, (el, p) => {
    el.style.opacity = String(map(p, 0.3, 0.5, 0, 1));
    el.style.pointerEvents = p > 0.4 ? "auto" : "none";
  });

  return (
    <nav
      ref={ref}
      // When progress is provided, start hidden (opacity-0) and let the hook
      // fade it in. Without progress the hook leaves it visible.
      className={`fixed inset-x-0 top-0 z-20 ${progress ? "opacity-0" : ""}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-semibold tracking-tight text-navy transition hover:opacity-70"
        >
          {content.brand.name}
        </Link>
        <div className="flex gap-6">
          {content.nav.links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm text-navy/70 transition hover:text-navy"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
