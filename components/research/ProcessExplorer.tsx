"use client";

import { useRef, useState } from "react";

type Step = {
  title: string;
  body: string;
  detail: string;
  layers?: readonly { title: string; body: string }[];
};

const num = (i: number) => String(i + 1).padStart(2, "0");

/**
 * The six research steps as tabs on a dark band: pick a step and its full
 * detail opens below. Arrow keys move between steps, as with any tab list.
 */
export default function ProcessExplorer({
  steps,
  label,
  initial = steps.findIndex((s) => s.layers) === -1 ? 0 : steps.findIndex((s) => s.layers),
}: {
  steps: readonly Step[];
  label: string;
  /** the step open on arrival: by default the one with the most to show */
  initial?: number;
}) {
  const [active, setActive] = useState(initial);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const step = steps[active];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (i + 1) % steps.length
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? (i - 1 + steps.length) % steps.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? steps.length - 1
              : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div>
      <p className="mb-4 text-sm text-white/50">Select any step to read more.</p>
      {/* the steps: a progress rail with the active step lit */}
      <div role="tablist" aria-label={label} className="grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-3 lg:grid-cols-6">
        {steps.map((s, i) => {
          const on = i === active;
          return (
            <button
              key={s.title}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`step-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls="step-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={`group relative flex h-full flex-col items-start justify-start bg-crest px-5 pb-5 pt-6 text-left transition focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-signal ${
                on ? "bg-[rgb(18_34_78)]" : "hover:bg-[rgb(12_26_62)]"
              }`}
            >
              {/* the lit bar along the top */}
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 top-0 h-[3px] transition ${on ? "bg-signal" : "bg-white/10 group-hover:bg-white/25"}`}
              />
              <span className={`font-mono text-xs tabular-nums ${on ? "text-[rgb(122_162_255)]" : "text-white/40"}`}>
                {num(i)}
              </span>
              <span className={`font-display mt-2 block text-lg font-semibold tracking-tight ${on ? "text-white" : "text-white/70"}`}>
                {s.title}
              </span>
              <span className={`mt-1 block text-[0.8125rem] leading-snug ${on ? "text-white/70" : "text-white/45"}`}>
                {s.body}
              </span>
            </button>
          );
        })}
      </div>

      {/* the selected step in full */}
      <div
        id="step-panel"
        role="tabpanel"
        aria-labelledby={`step-tab-${active}`}
        className="border border-t-0 border-white/10 bg-white/[0.03] p-6 sm:p-10"
      >
        <div key={active} className="step-in grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
          <div>
            <span className="text-sm font-medium text-[rgb(122_162_255)]">
              Step {active + 1} of {steps.length}
            </span>
            <h3 className="font-display mt-3 text-3xl font-semibold tracking-tight text-white">{step.title}</h3>
            <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">{step.detail}</p>
          </div>
          {step.layers ? (
            <ol className="space-y-3">
              {step.layers.map((l, j) => (
                <li key={l.title} className="rounded-sm border border-white/12 bg-white/[0.04] p-5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs tabular-nums text-[rgb(122_162_255)]">{j + 1}</span>
                    <span className="font-display text-lg font-semibold tracking-tight text-white">{l.title}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{l.body}</p>
                </li>
              ))}
            </ol>
          ) : (
            // the other steps get the bars motif, filled to where this step sits
            <div aria-hidden="true" className="hidden items-end lg:flex">
              <div className="flex w-full gap-1.5">
                {steps.map((s, i) => (
                  <span
                    key={s.title}
                    className={`h-1.5 flex-1 transition-colors duration-300 ${i <= active ? "bg-signal" : "bg-white/12"}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {/* step through without going back up to the tabs */}
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={() => setActive((active - 1 + steps.length) % steps.length)}
            className="text-sm font-medium text-white/60 transition hover:text-white"
          >
            ← {steps[(active - 1 + steps.length) % steps.length].title}
          </button>
          <button
            type="button"
            onClick={() => setActive((active + 1) % steps.length)}
            className="text-sm font-medium text-white/60 transition hover:text-white"
          >
            {steps[(active + 1) % steps.length].title} →
          </button>
        </div>
      </div>
    </div>
  );
}
