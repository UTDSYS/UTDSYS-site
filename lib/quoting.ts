/**
 * The hero's quoting model.
 *
 * The landing network isn't decorative: it's a real 6 → 3 → 1 feed-forward
 * net that combines both research desks into one quoting decision. Three
 * inputs are market signals (the quantitative desk), three are company
 * fundamentals (the fundamental desk). The fair value, bid and ask shown
 * under the graph are this model's output.
 *
 * Everything here is pure and deterministic so it can be unit-tested and so
 * the page renders the same opening sequence for every visitor. The stateful
 * parts — the animation loop, the drift clock, dragging an input — live in
 * `hooks/useQuotingNet.ts`.
 */

/** Feature vector, each component normalised to [-1, 1]. */
export type Features = [number, number, number, number, number, number];
export type Hidden = [number, number, number];

/** Index into `Features`, in the order the input nodes are drawn top-to-bottom. */
// quantitative desk: the market
export const FLOW = 0;
export const VOLATILITY = 1;
export const INVENTORY = 2;
// fundamental desk: the company
export const EARNINGS = 3;
export const VALUATION = 4;
export const LEVERAGE = 5;

export const FEATURE_COUNT = 6;
export const HIDDEN_COUNT = 3;

/**
 * Hand-tuned weights. Negative (inhibitory) weights are drawn in navy rather
 * than signal blue, so the sign of every contribution is readable on the page.
 * The hidden units each stand for something, and sit between the desks that
 * feed them most:
 *   h0  "market pressure" — order flow, sharpened by volatility  (quant)
 *   h1  "how exposed am I" — inventory, volatility, and leverage (both)
 *   h2  "what is it worth" — earnings up, valuation and leverage down
 *                                                            (fundamental)
 */
export const W1: readonly (readonly number[])[] = [
  [0.95, 0.35, -0.2, 0.3, -0.15, 0.0],
  [0.2, 0.55, 1.1, -0.1, 0.25, 0.5],
  [0.15, -0.3, -0.1, 0.9, -0.85, -0.55],
];
export const B1: readonly number[] = [0.05, 0.0, -0.05];
/** Buying pressure and a cheap company pull the quote up; exposure pushes it down. */
export const W2: readonly number[] = [-0.6, 1.05, -0.7];
export const B2 = 0.02;

/** The starting feature vector — the frame the page opens on. */
export const INITIAL_FEATURES: Features = [0.35, -0.1, -0.24, 0.2, 0.1, -0.15];

/** Mid price the simulated book drifts around. */
export const INITIAL_MID = 100;

/** One tick, in price units. */
export const TICK = 0.01;

/**
 * Forward pass. `q` is the single decision scalar in (-1, 1): positive means
 * lean away from the bid (we'd rather sell), negative the reverse.
 * Volatility acts as a gain — the more uncertain the tape, the harder the
 * model leans on whatever edge it thinks it has.
 */
export function forward(x: Features): { hidden: Hidden; q: number } {
  const hidden = [0, 0, 0] as Hidden;

  for (let j = 0; j < HIDDEN_COUNT; j++) {
    let sum = B1[j];
    for (let i = 0; i < FEATURE_COUNT; i++) sum += W1[j][i] * x[i];
    hidden[j] = Math.tanh(sum);
  }

  let sum = B2;
  for (let j = 0; j < HIDDEN_COUNT; j++) sum += W2[j] * hidden[j];

  const gain = 1.25 + (0.6 * (x[VOLATILITY] + 1)) / 2;
  return { hidden, q: Math.tanh(sum * gain) };
}

/**
 * The fundamental desk's answer: what the company is worth, read off the
 * value unit. It sits within a few percent of where the market trades.
 */
export function fairValue(hidden: Hidden): number {
  return INITIAL_MID * (1 + 0.025 * hidden[2]);
}

/** The five calls the model can make. Labels live in `lib/content.ts`. */
export type Action =
  | "pull-bid"
  | "skew-ask"
  | "quote-both"
  | "skew-bid"
  | "pull-ask";

/** Read the action off the decision scalar. */
export function decide(q: number): Action {
  if (q > 0.66) return "pull-bid";
  if (q > 0.2) return "skew-ask";
  if (q < -0.66) return "pull-ask";
  if (q < -0.2) return "skew-bid";
  return "quote-both";
}

/** Half-spread in price units: calm tape quotes 1 tick wide, wild tape 5. */
export function halfSpread(volatility: number): number {
  return ((1 + (volatility + 1) * 2) * TICK) / 2;
}

/** The two-sided quote the decision produces, skewed by `q`. */
export function quote(
  mid: number,
  x: Features,
  q: number,
): { bid: number; ask: number } {
  const half = halfSpread(x[VOLATILITY]);
  const skew = q * 0.035;
  return { bid: mid - half - skew, ask: mid + half - skew };
}

/** Contribution of input `i` to hidden unit `j`, normalised to [0, 1]. */
export function inputWeight(x: Features, i: number, j: number): number {
  return Math.min(1, Math.abs(x[i] * W1[j][i]) * 1.5);
}

/** Contribution of hidden unit `j` to the decision, normalised to [0, 1]. */
export function hiddenWeight(hidden: Hidden, j: number): number {
  return Math.min(1, Math.abs(hidden[j] * W2[j]) * 1.5);
}

/* ------------------------------------------------------------------ */
/* Display                                                             */
/* ------------------------------------------------------------------ */

/** Signed value with a real minus sign, so the rail stays optically even. */
export function signed(value: number, digits: number): string {
  const magnitude =
    digits === 0
      ? String(Math.abs(value))
      : Math.abs(value).toFixed(digits);
  return (value < 0 ? "−" : "+") + magnitude;
}

/** Each feature reads in its own natural units on the input rail. */
export function formatFeature(index: number, value: number): string {
  switch (index) {
    case VOLATILITY:
      return ((value + 1) / 2).toFixed(2);
    case INVENTORY:
      return signed(Math.round(value * 500), 0);
    case EARNINGS: // surprise vs consensus
      return signed(value * 8, 1) + "%";
    case VALUATION: // P/E
      return (16 + value * 8).toFixed(1) + "x";
    case LEVERAGE: // net debt / EBITDA
      return (1.5 + value * 1.5).toFixed(1) + "x";
    default:
      return signed(value, 2);
  }
}

/* ------------------------------------------------------------------ */
/* Drift                                                               */
/* ------------------------------------------------------------------ */

/** Seeded PRNG (mulberry32), so every visitor sees the same opening. */
export function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/**
 * One mean-reverting step. Features wander on their own so the page is alive
 * with nobody touching it, but always pull back toward the middle of their
 * range instead of pinning to an extreme.
 */
export function driftStep(value: number, random: number, dtSeconds: number) {
  const next = value + (random - 0.5) * 0.9 * dtSeconds - value * 0.22 * dtSeconds;
  return clamp(next, -1, 1);
}

/** The mid price wanders more slowly, and reverts to where it started. */
export function driftMid(mid: number, random: number, dtSeconds: number) {
  return (
    mid + (random - 0.5) * 0.11 * dtSeconds - (mid - INITIAL_MID) * 0.1 * dtSeconds
  );
}
