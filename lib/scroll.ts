import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { clamp01, lerp } from "@/lib/network/model";

/**
 * Linear-map a scroll `progress` value from an input range to an output range,
 * clamped at both ends. `map(p, 0, 0.25, 1, 0)` fades 1→0 over progress 0→0.25
 * then holds 0.
 */
export function map(
  p: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
): number {
  return lerp(outStart, outEnd, clamp01((p - inStart) / (inEnd - inStart)));
}

/**
 * Subscribe to a Framer Motion `progress` value and apply scroll-driven styles
 * imperatively to a ref'd element. We intentionally bypass `motion` style
 * bindings here: Framer hardware-accelerates scroll-linked `opacity` onto a
 * separate timeline that desyncs from the scroll position (transforms are
 * fine, opacity is not). Writing styles ourselves on each change keeps the
 * whole Landing→Hero cross-fade locked to the scroll.
 *
 * `apply` is read through a ref so passing a fresh closure each render does not
 * re-subscribe; only `progress` identity drives (un)subscription.
 */
export function useScrollApply<T extends HTMLElement>(
  progress: MotionValue<number> | undefined,
  apply: (el: T, p: number) => void,
) {
  const ref = useRef<T>(null);
  const applyRef = useRef(apply);
  applyRef.current = apply;

  useEffect(() => {
    if (!progress) return;
    const run = (p: number) => {
      if (ref.current) applyRef.current(ref.current, p);
    };
    run(progress.get());
    return progress.on("change", run);
  }, [progress]);

  return ref;
}
