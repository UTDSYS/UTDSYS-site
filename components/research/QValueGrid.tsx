import content from "@/lib/content";

const { axes, quadrants } = content.fundamentalResearch.about.qvalue;

type Tone = (typeof quadrants)[number]["tone"];

// light ground: the target is solid signal blue, the rest stay quiet
const lightTone: Record<Tone, string> = {
  target: "bg-signal-deep text-white border-signal-deep",
  warn: "bg-white text-ink border-navy/15",
  watch: "bg-white text-ink border-navy/15",
  avoid: "bg-navy/[0.04] text-navy/60 border-navy/10",
};
// dark ground (the hero): same idea, on navy
const darkTone: Record<Tone, string> = {
  target: "bg-signal text-white border-signal shadow-[0_18px_50px_-12px_rgb(45_91_255/0.65)]",
  warn: "bg-white/[0.06] text-white border-white/15",
  watch: "bg-white/[0.06] text-white border-white/15",
  avoid: "bg-transparent text-white/45 border-white/10",
};

/**
 * The Q-value grid: valuation up the side (cheap at the top), business
 * quality along the bottom (higher to the right). The top-right square
 * is the target. `onDark` draws it for the navy hero.
 */
export default function QValueGrid({
  onDark = false,
  label,
  compact = false,
}: {
  onDark?: boolean;
  /** read to screen readers in place of the grid */
  label?: string;
  /** hide each quadrant's description (the hero) */
  compact?: boolean;
}) {
  const tones = onDark ? darkTone : lightTone;
  const axis = `font-mono text-[0.7rem] uppercase tracking-[0.08em] ${onDark ? "text-white/50" : "text-navy/50"}`;

  return (
    <figure
      role={label ? "img" : undefined}
      aria-label={label}
      className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2.5 sm:gap-3"
    >
      {/* the valuation axis, read top to bottom */}
      <span className={`${axis} row-start-1 flex items-center justify-end pr-1 [writing-mode:vertical-rl] rotate-180`}>
        {axes.cheap}
      </span>
      <span className={`${axis} row-start-2 flex items-center justify-end pr-1 [writing-mode:vertical-rl] rotate-180`}>
        {axes.expensive}
      </span>

      {quadrants.map((q, i) => (
        <div
          key={q.title}
          aria-hidden={label ? "true" : undefined}
          style={{ gridRow: Math.floor(i / 2) + 1, gridColumn: (i % 2) + 2 }}
          className={`flex flex-col justify-between rounded-lg border p-4 sm:p-5 ${
            compact ? "aspect-square" : "min-h-[9.5rem]"
          } ${tones[q.tone]}`}
        >
          <span className="font-display text-base font-semibold leading-tight tracking-tight sm:text-lg">
            {q.title}
          </span>
          {!compact && (
            <p className={`mt-3 text-sm leading-relaxed ${q.tone === "target" ? "text-white/80" : "opacity-75"}`}>
              {q.body}
            </p>
          )}
          {compact && q.tone === "target" && (
            <span aria-hidden="true" className="h-2 w-10 bg-white/90" />
          )}
        </div>
      ))}

      {/* the quality axis, left to right */}
      <span className={`${axis} col-start-2 row-start-3 pt-1 text-center`}>{axes.lower}</span>
      <span className={`${axis} col-start-3 row-start-3 pt-1 text-center`}>{axes.higher} →</span>
    </figure>
  );
}
