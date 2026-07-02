"use client";

import type { MotionValue } from "framer-motion";
import { map, useScrollApply } from "@/lib/scroll";
import content from "@/lib/content";

export default function Landing({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const ref = useScrollApply<HTMLDivElement>(progress, (el, p) => {
    el.style.opacity = String(map(p, 0, 0.25, 1, 0));
    el.style.transform = `translateY(${map(p, 0, 0.25, 0, -40)}px)`;
  });
  const cueRef = useScrollApply<HTMLDivElement>(progress, (el, p) => {
    el.style.opacity = String(map(p, 0, 0.15, 1, 0));
  });

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
    >
      <h1 className="text-7xl font-semibold tracking-tight text-navy md:text-9xl">
        {content.brand.name}
      </h1>
      <p className="mt-5 text-xs uppercase tracking-[0.35em] text-navy/70 md:text-sm">
        {content.landing.tagline}
      </p>
      <div
        ref={cueRef}
        className="absolute bottom-10 text-[0.7rem] uppercase tracking-[0.3em] text-navy/60"
      >
        {content.landing.scrollCue}
      </div>
    </div>
  );
}
