"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wraps a `.swipe` list (see globals.css) with arrow buttons and position
 * dots on phones. The arrows go round: past the last card is the first
 * again. From sm up the list lays out as a grid and the controls hide.
 */
export default function Swipe({
  label,
  count,
  className = "",
  children,
}: {
  label: string;
  /** how many cards the list holds */
  count: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const track = () => ref.current?.querySelector<HTMLElement>(".swipe") ?? null;
  const cards = (el: HTMLElement) => Array.from(el.children) as HTMLElement[];

  // Follow the swipe: the lit dot is the card nearest the left edge.
  useEffect(() => {
    const el = track();
    if (!el) return;
    const onScroll = () => {
      const items = cards(el);
      const at = el.scrollLeft + items[0].offsetLeft;
      let best = 0;
      items.forEach((c, i) => {
        if (Math.abs(c.offsetLeft - at) < Math.abs(items[best].offsetLeft - at)) best = i;
      });
      // the last card can't reach the left edge, so the end of the row is it
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) best = items.length - 1;
      setIndex(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const go = (i: number) => {
    const el = track();
    if (!el) return;
    const items = cards(el);
    const next = (i + count) % count;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({
      left: items[next].offsetLeft - items[0].offsetLeft,
      behavior: smooth ? "smooth" : "auto",
    });
    setIndex(next);
  };

  const arrow =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-navy/20 bg-white text-ink shadow-[0_6px_18px_-10px_rgb(14_24_48/0.5)] transition active:scale-95 hover:border-navy/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

  return (
    <div ref={ref} role="region" aria-roledescription="carousel" aria-label={label} className={className}>
      {children}
      {count > 1 && (
        <div className="mt-6 flex items-center justify-between gap-4 sm:hidden">
          <button type="button" aria-label="Previous" onClick={() => go(index - 1)} className={arrow}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M10 3 5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="flex items-center gap-2" aria-live="polite">
            <span className="sr-only">
              {index + 1} of {count}
            </span>
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => go(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-signal-deep" : "w-2 bg-navy/20"
                }`}
              />
            ))}
          </div>
          <button type="button" aria-label="Next" onClick={() => go(index + 1)} className={arrow}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="m6 3 5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
