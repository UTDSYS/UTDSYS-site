"use client";

import { useEffect, useRef } from "react";

/**
 * Cinematic load sequence for the hero: the network assembling itself and
 * taking its first decision. The scaffold draws as hairlines, the five market
 * features scramble in their rail and lock onto real values, every edge draws
 * itself on and floods with signal as it lands, the convergence arrives and
 * the decision node blooms with the wordmark, and the quote it produces goes
 * live. You land on the finished page; there is deliberately nothing to
 * scroll to.
 *
 * It writes `--p` (0..1 build progress); every phase in the CSS derives from
 * it, so the whole choreography plays from this one value. Respects
 * prefers-reduced-motion by resolving to the finished frame instantly.
 */

const P_END = 0.92; // resting progress: decision landed, wordmark + CTAs in
const DURATION = 2400; // ms — scaffold, settle, converge, decide

/**
 * Where the CTAs stop being visibility:hidden. It must equal the start of the
 * `--endcap` window in globals.css — flip it any later and they appear
 * part-faded, because their opacity is already off zero by then.
 */
const P_ENDCAP = 0.12;

/**
 * The window in which each input's digits stop scrambling and lock onto their
 * real value. useQuotingNet owns the rail text, so it reads `--p` back off the
 * stage and uses these to decide how much of each value has resolved.
 */
export const RAIL_SETTLE_START = 0.14;
export const RAIL_SETTLE_STAGGER = 0.04; // per input, so they lock top-down
export const RAIL_SETTLE_SPAN = 0.22;
export const RAIL_SETTLE_END =
  RAIL_SETTLE_START + RAIL_SETTLE_STAGGER * 4 + RAIL_SETTLE_SPAN;

const SKIP_MS = 260; // fast-forward to the finished frame on scroll intent

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Mild ease-out. The scaffold wants to be up immediately, but the build is the
 * long movement and the edges need real time on screen to read as drawing
 * themselves — front-load any harder and the convergence collapses into the
 * first few hundred milliseconds.
 */
const easeOutBuild = (t: number) => 1 - Math.pow(1 - t, 1.35);

/** Ease-out for the skip fast-forward: quick, then settles. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function useIntroSequence<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = (p: number) => {
      el.style.setProperty("--p", p.toFixed(4));
      el.dataset.end = p >= P_ENDCAP ? "true" : "false";
      // Exposed on :root so the Nav (outside the stage) fades in as the
      // wordmark resolves.
      document.documentElement.style.setProperty(
        "--hero-title",
        clamp01((p - 0.04) / 0.12).toFixed(4),
      );
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      apply(P_END);
      return () => {
        document.documentElement.style.removeProperty("--hero-title");
      };
    }

    let raf = 0;
    let start = 0;
    let cur = 0; // last-applied progress
    let skip = false; // fast-forwarding to the finished frame?
    let skipStart = 0;
    let skipFrom = 0;

    const tick = (now: number) => {
      if (skip) {
        const u = clamp01((now - skipStart) / SKIP_MS);
        cur = skipFrom + (P_END - skipFrom) * easeOut(u);
        apply(cur);
        raf = u < 1 ? requestAnimationFrame(tick) : 0;
        return;
      }
      if (!start) start = now;
      const u = clamp01((now - start) / DURATION);
      cur = easeOutBuild(u) * P_END;
      apply(cur);
      raf = u < 1 ? requestAnimationFrame(tick) : 0;
    };

    // Any scroll intent bypasses the slow build — quickly finish to the
    // landed frame. (The page is a single screen, so there's nothing to
    // scroll; we just skip the animation.)
    const SCROLL_KEYS = new Set([
      " ",
      "PageDown",
      "PageUp",
      "ArrowDown",
      "ArrowUp",
      "Home",
      "End",
    ]);
    const onKey = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) requestSkip();
    };
    const requestSkip = () => {
      removeSkipListeners();
      if (skip || cur >= P_END) return;
      skip = true;
      skipFrom = cur;
      skipStart = performance.now();
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const removeSkipListeners = () => {
      window.removeEventListener("wheel", requestSkip);
      window.removeEventListener("touchmove", requestSkip);
      window.removeEventListener("scroll", requestSkip);
      window.removeEventListener("keydown", onKey);
    };
    window.addEventListener("wheel", requestSkip, { passive: true });
    window.addEventListener("touchmove", requestSkip, { passive: true });
    window.addEventListener("scroll", requestSkip, { passive: true });
    window.addEventListener("keydown", onKey);

    apply(0);
    raf = requestAnimationFrame(tick);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      removeSkipListeners();
      document.documentElement.style.removeProperty("--hero-title");
    };
  }, []);

  return ref;
}
