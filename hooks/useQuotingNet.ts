"use client";

import { useEffect, type RefObject } from "react";
import content from "@/lib/content";
import {
  clamp,
  createRandom,
  decide,
  driftMid,
  driftStep,
  FEATURE_COUNT,
  forward,
  formatFeature,
  HIDDEN_COUNT,
  hiddenWeight,
  INITIAL_FEATURES,
  INITIAL_MID,
  inputWeight,
  quote,
  signed,
  type Action,
  type Features,
} from "@/lib/quoting";
import {
  RAIL_SETTLE_END,
  RAIL_SETTLE_SPAN,
  RAIL_SETTLE_STAGGER,
  RAIL_SETTLE_START,
} from "@/hooks/useIntroSequence";
import {
  DEC_X,
  DEC_Y,
  HID_SWING,
  HID_X,
  HID_Y,
  IN_SWING,
  IN_X,
  IN_Y,
  VB_H,
} from "@/components/NeuralNet";

/**
 * Makes the hero network compute.
 *
 * Every frame this runs the real quoting model (lib/quoting) and writes the
 * result straight to the DOM: node positions follow their own activations,
 * edges thicken with whatever they're carrying, and the bid/ask beside the
 * wordmark is the model's actual output. React never re-renders for any of
 * it — at 60fps that would be a state update per frame, so we drive the
 * elements imperatively, the same way the intro sequence drives `--p`.
 *
 * The five input nodes are grabbable. Drag one (or focus it and use the
 * arrow keys) and the whole graph re-routes around the change; let go and it
 * resumes drifting after a beat. That's the point of the thing: a visitor's
 * first interaction with the team is making a decision come out differently.
 *
 * Pass the same element ref that useIntroSequence drives — `--p` is read off
 * it, so the build choreography and the live layer compose.
 */

/** How far, in CSS pixels, a drag travels to sweep an input end to end. */
const DRAG_RANGE = 90;

/** Time an input stays pinned after you let go, before it drifts again. */
const HOLD_AFTER_DRAG = 2500;
const HOLD_AFTER_KEY = 4000;

const SEED = 0x2d5bff;
const AMBIENT_INTERVAL = 140;
const ACTIVE_INTERVAL = 34;

/**
 * A value that hasn't resolved yet, rendered with its digits still churning.
 * Characters lock left to right as `u` runs 0..1, and anything that isn't a
 * digit — a sign, a decimal point, the tick suffix — holds its place the whole
 * way, so the number keeps its shape and the rail never reflows.
 */
function scrambleValue(text: string, u: number, random: () => number): string {
  const locked = Math.floor(u * text.length);
  let out = "";
  for (let k = 0; k < text.length; k++) {
    const ch = text[k];
    out += k < locked || ch < "0" || ch > "9" ? ch : String((random() * 10) | 0);
  }
  return out;
}

export function useQuotingNet(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const q$ = <T extends Element>(name: string) =>
      Array.from(root.querySelectorAll<T>(`[data-qn="${name}"]`));
    const one = (name: string) =>
      root.querySelector<HTMLElement>(`[data-qn="${name}"]`);

    const inputEls = q$<SVGGElement>("input");
    if (inputEls.length !== FEATURE_COUNT) return;

    const inputs = inputEls.map((g) => ({
      g,
      nodes: Array.from(g.querySelectorAll<SVGCircleElement>('[data-qn="node"]')),
      grip: g.querySelector<SVGLineElement>('[data-qn="grip"]'),
      value: g.querySelector<SVGTextElement>('[data-qn="value"]'),
      lit: g.querySelector<SVGCircleElement>(".nn-node-lit"),
      label: g.getAttribute("aria-label") ?? "",
      text: "", // what the rail currently shows (may still be scrambling)
      real: "", // what the model actually says it is
      settling: false,
    }));

    const hiddens = q$<SVGGElement>("hidden").map((g) => ({
      nodes: Array.from(g.querySelectorAll<SVGCircleElement>('[data-qn="node"]')),
      lit: g.querySelector<SVGCircleElement>(".nn-node-lit"),
    }));

    const decision = one("decision");
    const decisionLit = root.querySelector<SVGCircleElement>('[data-qn="decision-lit"]');

    const edgesIH = q$<SVGPathElement>("edge-ih").map((el) => ({
      el,
      base: el.previousElementSibling as SVGPathElement | null,
      i: Number(el.dataset.i),
      j: Number(el.dataset.j),
    }));
    const edgesHD = q$<SVGPathElement>("edge-hd").map((el) => ({
      el,
      base: el.previousElementSibling as SVGPathElement | null,
      pulse: el.nextElementSibling as SVGPathElement | null,
      j: Number(el.dataset.j),
    }));

    const svg = root.querySelector<SVGSVGElement>(".nn-svg");
    const elBid = one("bid");
    const elAsk = one("ask");
    const elSkew = one("skew");
    const elAction = one("action");
    const elActionText = one("action-text");
    const elCount = one("count");
    const elStatus = one("status");
    const elHint = one("hint");

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = media.matches;
    if (elHint) {
      elHint.textContent = reduced
        ? content.hero.net.hint.keyboard
        : content.hero.net.hint.pointer;
    }

    /* ---------------- state ---------------- */

    const x = [...INITIAL_FEATURES] as Features;
    const held = new Array(FEATURE_COUNT).fill(0); // ms left on a manual hold
    const random = createRandom(SEED);
    // A stream of its own: the scramble draws as many digits as there are
    // frames, and frame timing isn't deterministic. Sharing `random` would
    // make the drift depend on the visitor's refresh rate.
    const scrambleRandom = createRandom(SEED ^ 0x9e37);

    /**
     * How far the intro has run. useIntroSequence writes `--p` as an inline
     * style on this same element, so reading it back is just a string off the
     * style map — no getComputedStyle, no layout.
     */
    const progress = () =>
      Number.parseFloat(root.style.getPropertyValue("--p")) || 0;
    let mid = INITIAL_MID;
    let count = 0;
    let lastAction: Action | null = null;
    let lastBid = "";
    let lastAsk = "";

    const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const yIn = (i: number) => IN_Y[i] + x[i] * IN_SWING;

    /* ---------------- paint ---------------- */

    function paint() {
      const { hidden, q } = forward(x);
      count++;

      const p = progress();

      for (let i = 0; i < FEATURE_COUNT; i++) {
        const n = inputs[i];
        const y = yIn(i);
        for (const c of n.nodes) c.setAttribute("cy", String(y));
        n.grip?.setAttribute("y1", String(y));
        n.grip?.setAttribute("y2", String(y));
        n.lit?.style.setProperty("--a", Math.abs(x[i]).toFixed(3));

        // Assistive tech tracks the real value throughout — the scramble is
        // decoration, and announcing churning digits would be noise.
        const real = formatFeature(i, x[i]);
        if (real !== n.real) {
          n.real = real;
          n.g.setAttribute("aria-valuenow", String(Math.round(x[i] * 100)));
          n.g.setAttribute("aria-valuetext", `${n.label} ${real}`);
        }

        // On load each input resolves in turn, top-down: its digits churn,
        // then lock left to right onto what the model actually reads.
        const settle = reduced
          ? 1
          : clamp01((p - (RAIL_SETTLE_START + i * RAIL_SETTLE_STAGGER)) / RAIL_SETTLE_SPAN);
        const shown = settle >= 1 ? real : scrambleValue(real, settle, scrambleRandom);
        if (shown !== n.text) {
          n.text = shown;
          if (n.value) n.value.textContent = shown;
        }

        const settling = settle < 1;
        if (settling !== n.settling) {
          n.settling = settling;
          n.value?.classList.toggle("is-settling", settling);
        }
      }

      for (let j = 0; j < HIDDEN_COUNT; j++) {
        const y = HID_Y[j] + hidden[j] * HID_SWING;
        for (const c of hiddens[j].nodes) c.setAttribute("cy", String(y));
        hiddens[j].lit?.style.setProperty("--a", Math.abs(hidden[j]).toFixed(3));
      }

      decisionLit?.style.setProperty("--a", Math.min(1, Math.abs(q) * 1.6).toFixed(3));

      // edges follow the nodes they connect, and carry what the model routes
      for (const e of edgesIH) {
        const d = `M ${IN_X} ${yIn(e.i)} L ${HID_X} ${HID_Y[e.j] + hidden[e.j] * HID_SWING}`;
        e.el.setAttribute("d", d);
        e.base?.setAttribute("d", d);
        e.el.style.setProperty("--a", inputWeight(x, e.i, e.j).toFixed(3));
      }
      for (const e of edgesHD) {
        const d = `M ${HID_X} ${HID_Y[e.j] + hidden[e.j] * HID_SWING} L ${DEC_X} ${DEC_Y}`;
        e.el.setAttribute("d", d);
        e.base?.setAttribute("d", d);
        e.pulse?.setAttribute("d", d);
        const a = hiddenWeight(hidden, e.j).toFixed(3);
        e.el.style.setProperty("--a", a);
        e.pulse?.style.setProperty("--a", a);
      }

      // the quote this decision actually produces
      const { bid, ask } = quote(mid, x, q);
      const bidText = bid.toFixed(2);
      const askText = ask.toFixed(2);
      if (elBid && bidText !== lastBid) {
        elBid.textContent = bidText;
        lastBid = bidText;
        flash(elBid);
      }
      if (elAsk && askText !== lastAsk) {
        elAsk.textContent = askText;
        lastAsk = askText;
        flash(elAsk);
      }
      if (elSkew) elSkew.textContent = signed(q, 2);

      const action = decide(q);
      if (action !== lastAction) {
        lastAction = action;
        const label = content.hero.net.actions[action];
        if (elActionText) elActionText.textContent = label;
        if (elStatus) elStatus.textContent = `${content.hero.net.statusPrefix} ${label}`;
        bloom();
      }

      if (elCount) elCount.textContent = count.toLocaleString();
    }

    function flash(el: HTMLElement) {
      if (reduced) return;
      el.classList.add("is-bump");
      window.setTimeout(() => el.classList.remove("is-bump"), 450);
    }

    function bloom() {
      if (reduced || !decision) return;
      decision.classList.add("is-bloom");
      elAction?.classList.add("is-flip");
      window.setTimeout(() => decision.classList.remove("is-bloom"), 600);
      window.setTimeout(() => elAction?.classList.remove("is-flip"), 450);
    }

    /* ---------------- the loop ---------------- */

    let timer = 0;
    let last = 0;

    const anyHeld = () => held.some((h) => h > 0);
    const anyActiveDrag = () => held.some((h) => h === Infinity);
    // The rail is still resolving, so the digits need to churn at something
    // that reads as motion rather than at the ambient 7fps.
    const settlingRail = () => !reduced && progress() < RAIL_SETTLE_END;
    const nextInterval = () =>
      anyActiveDrag() || settlingRail() ? ACTIVE_INTERVAL : AMBIENT_INTERVAL;

    const schedule = () => {
      if (timer || (reduced && !anyHeld()) || document.hidden) return;
      timer = window.setTimeout(frame, nextInterval());
    };

    const frame = () => {
      timer = 0;
      const now = performance.now();
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;

      const seconds = dt / 1000;
      for (let i = 0; i < FEATURE_COUNT; i++) {
        if (held[i] > 0) {
          held[i] -= dt;
          continue;
        }
        if (!reduced) {
          x[i] = driftStep(x[i], random(), seconds);
        }
      }
      if (!reduced) {
        mid = driftMid(mid, random(), seconds);
      }

      paint();

      // Under reduced motion nothing moves on its own, so the loop only runs
      // while someone is actually adjusting an input.
      schedule();
    };

    const start = () => {
      if (!timer) {
        last = 0;
        schedule();
      }
    };
    const stop = () => {
      if (timer) window.clearTimeout(timer);
      timer = 0;
    };

    // Don't burn frames on a tab nobody is looking at.
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const onMotionChange = () => {
      reduced = media.matches;
      if (elHint) {
        elHint.textContent = reduced
          ? content.hero.net.hint.keyboard
          : content.hero.net.hint.pointer;
      }
      start();
    };
    media.addEventListener("change", onMotionChange);

    paint();
    if (!reduced) start();

    /* ---------------- grab an input ---------------- */

    const cleanups: (() => void)[] = [];

    inputs.forEach((n, i) => {
      let pointerId: number | null = null;
      let startY = 0;
      let startValue = 0;

      const onPointerDown = (e: PointerEvent) => {
        e.preventDefault();
        pointerId = e.pointerId;
        startY = e.clientY;
        startValue = x[i];
        held[i] = Infinity;
        n.g.classList.add("is-held");
        n.g.setPointerCapture(e.pointerId);
        start();
      };

      const onPointerMove = (e: PointerEvent) => {
        if (pointerId === null || e.pointerId !== pointerId) return;
        // Map screen travel to feature range through the SVG's current scale.
        const scale = svg ? svg.getBoundingClientRect().height / VB_H : 1;
        x[i] = clamp(startValue + (startY - e.clientY) / (DRAG_RANGE * scale), -1, 1);
        paint();
      };

      const release = () => {
        if (pointerId === null) return;
        pointerId = null;
        held[i] = HOLD_AFTER_DRAG;
        n.g.classList.remove("is-held");
      };

      const onKeyDown = (e: KeyboardEvent) => {
        const step = e.shiftKey ? 0.2 : 0.05;
        if (e.key === "ArrowUp" || e.key === "ArrowRight") x[i] = clamp(x[i] + step, -1, 1);
        else if (e.key === "ArrowDown" || e.key === "ArrowLeft")
          x[i] = clamp(x[i] - step, -1, 1);
        else return;
        e.preventDefault();
        held[i] = HOLD_AFTER_KEY;
        paint();
        start();
      };

      n.g.addEventListener("pointerdown", onPointerDown);
      n.g.addEventListener("pointermove", onPointerMove);
      n.g.addEventListener("pointerup", release);
      n.g.addEventListener("pointercancel", release);
      n.g.addEventListener("keydown", onKeyDown);

      cleanups.push(() => {
        n.g.removeEventListener("pointerdown", onPointerDown);
        n.g.removeEventListener("pointermove", onPointerMove);
        n.g.removeEventListener("pointerup", release);
        n.g.removeEventListener("pointercancel", release);
        n.g.removeEventListener("keydown", onKeyDown);
      });
    });

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      media.removeEventListener("change", onMotionChange);
      for (const off of cleanups) off();
    };
  }, [ref]);
}
