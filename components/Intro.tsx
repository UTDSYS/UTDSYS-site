"use client";

import Link from "next/link";
import type { MotionValue } from "framer-motion";
import { map, useScrollApply } from "@/lib/scroll";
import content from "@/lib/content";

/** The home/intro section revealed by the neural-network transition. */
export default function Intro({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const ref = useScrollApply<HTMLDivElement>(progress, (el, p) => {
    el.style.opacity = String(map(p, 0.25, 0.5, 0, 1));
    el.style.transform = `translateY(${map(p, 0.25, 0.5, 40, 0)}px)`;
    el.style.pointerEvents = p > 0.4 ? "auto" : "none";
  });

  return (
    <div
      ref={ref}
      // opacity-0 (CSS class, not React-controlled inline style) so the
      // imperative opacity writes are never reconciled away by a re-render.
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center opacity-0"
    >
      <h1 className="max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-navy md:text-5xl">
        {content.intro.headline}
      </h1>
      <p className="mt-6 max-w-xl text-base text-navy/70 md:text-lg">
        {content.intro.subhead}
      </p>
      <Link
        href={content.intro.cta.href}
        className="mt-10 inline-block rounded-full bg-navy px-8 py-3 text-sm font-medium text-white transition hover:opacity-90"
      >
        {content.intro.cta.label}
      </Link>
    </div>
  );
}
