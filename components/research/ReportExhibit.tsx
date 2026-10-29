"use client";

import { useRef, useState } from "react";
import type { ResearchReport } from "@/lib/content";
import ReportCard from "@/components/research/ReportCard";

/**
 * The reports one at a time: the current one in front, its neighbours laid
 * flat beside it and dimmed, and the arrows go round: past the last report
 * the row slides back to the first. A side card brings itself to the front
 * when clicked; only the front card opens its page.
 */
export default function ReportExhibit({ reports, label }: { reports: ResearchReport[]; label: string }) {
  const n = reports.length;
  const [active, setActive] = useState(0);
  const go = (step: number) => setActive((a) => (a + step + n) % n);

  // a swipe on touch screens moves it too
  const start = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") start.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (start.current === null) return;
    const dx = e.clientX - start.current;
    start.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  const arrow =
    "inline-flex h-12 w-12 items-center justify-center rounded-full border border-navy/20 text-ink transition hover:border-signal hover:bg-signal hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
    >
      <div
        className="grid touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (start.current = null)}
      >
        {reports.map((r, i) => {
          const d = i - active;
          const front = d === 0;
          return (
            <div
              key={r.slug}
              className="exhibit-card relative flex flex-col bg-white"
              style={{ "--d": d, "--ad": Math.abs(d) } as React.CSSProperties}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
              aria-hidden={!front}
            >
              <div inert={!front} className="flex flex-1 flex-col [&>a]:flex-1">
                <ReportCard report={r} />
              </div>
              {Math.abs(d) === 1 && (
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  onClick={() => go(d)}
                  className="absolute inset-0 cursor-pointer"
                />
              )}
            </div>
          );
        })}
      </div>

      {n > 1 && (
        <div className="mt-10 flex items-center justify-center gap-6">
          <button type="button" onClick={() => go(-1)} aria-label="Previous report" className={arrow}>
            <span aria-hidden="true">←</span>
          </button>
          <div className="flex items-center gap-2" aria-hidden="true">
            {reports.map((r, i) => (
              <span
                key={r.slug}
                className={`h-1.5 transition-all duration-500 ${i === active ? "w-8 bg-signal" : "w-3 bg-navy/20"}`}
              />
            ))}
          </div>
          <button type="button" onClick={() => go(1)} aria-label="Next report" className={arrow}>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {reports[active].company}, report {active + 1} of {n}
      </p>
    </div>
  );
}
