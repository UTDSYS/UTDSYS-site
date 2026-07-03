"use client";

import { useEffect, useRef } from "react";

/**
 * Cinematic load sequence for the neural-net hero. On mount this plays the
 * whole assembly once, on a timed tween — input nodes fire, signals draw
 * along the edges, everything converges on the single DECISION node, and the
 * wordmark + CTAs resolve alongside it. You land on the finished page; there
 * is deliberately nothing to scroll to.
 *
 * It writes `--p` (0..1 build progress); every phase in the CSS derives from
 * it, so the whole choreography plays from this one value. Respects
 * prefers-reduced-motion by resolving to the finished frame instantly.
 */

const P_END = 0.92; // resting progress: decision bloomed, wordmark + CTAs in
const DURATION = 4400; // ms — the full build, paced to be watchable
const SKIP_MS = 420; // fast-forward to the finished frame on scroll intent

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Gentle S-curve for the overall timeline: eases in, settles softly. */
const easeInOut = (t: number) =>
  t < 0.5 ? Math.pow(2 * t, 1.35) / 2 : 1 - Math.pow(2 - 2 * t, 1.35) / 2;

/** Ease-out for the skip fast-forward: quick, then settles. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function useIntroSequence<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = (p: number) => {
      el.style.setProperty("--p", p.toFixed(4));
      el.dataset.end = p > 0.78 ? "true" : "false";
      // Exposed on :root so the Nav (outside the stage) fades in as the
      // wordmark resolves.
      document.documentElement.style.setProperty(
        "--hero-title",
        clamp01((p - 0.64) / 0.1).toFixed(4),
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
      cur = easeInOut(u) * P_END;
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
