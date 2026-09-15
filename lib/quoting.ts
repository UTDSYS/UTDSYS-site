/**
 * The hero's quoting model.
 *
 * The landing network isn't decorative: it's a real 5 → 3 → 1 feed-forward
 * net that turns five live market features into one quoting decision. The
 * bid, ask and skew shown beside the wordmark are this model's output.
 *
 * Everything here is pure and deterministic so it can be unit-tested and so
 * the page renders the same opening sequence for every visitor. The stateful
 * parts — the animation loop, the drift clock, dragging an input — live in
 * `hooks/useQuotingNet.ts`.
 */

/** Feature vector, each component normalised to [-1, 1]. */
export type Features = [number, number, number, number, number];
export type Hidden = [number, number, number];

/** Index into `Features`, in the order the input nodes are drawn top-to-bottom. */
export const SPREAD = 0;
export const IMBALANCE = 1;
export const INVENTORY = 2;
export const VOLATILITY = 3;
export const FLOW = 4;

export const FEATURE_COUNT = 5;
export const HIDDEN_COUNT = 3;

/**
 * Hand-tuned weights. Negative (inhibitory) weights are drawn in navy rather
 * than signal blue, so the sign of every contribution is readable on the page.
 * The hidden units each stand for something:
 *   h0  "room to quote"          — wide spread and calm tape invite a quote
 *   h1  "which way is it going"  — book imbalance and order flow
 *   h2  "how exposed am I"       — inventory, amplified by volatility
 */
export const W1: readonly (readonly number[])[] = [
  [0.85, -0.3, 0.25, -0.7, -0.45],
  [-0.2, 0.95, -0.4, 0.35, 0.8],
  [-0.35, 0.15, 1.1, 0.6, 0.3],
];
export const B1: readonly number[] = [0.1, -0.05, 0.0];
export const W2: readonly number[] = [-0.55, -0.7, 1.05];
export const B2 = 0.02;

/** The starting feature vector — the frame the page opens on. */
export const INITIAL_FEATURES: Features = [0.15, 0.35, -0.24, -0.1, 0.05];

/** Mid price the simulated book drifts around. */
export const INITIAL_MID = 100;

/** One tick, in price units. */
export const TICK = 0.01;

/**
 * Forward pass. `q` is the single decision scalar in (-1, 1): positive means
 * lean away from the bid (we're long and want to sell), negative the reverse.
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

/** Half-spread in price units, from the spread feature (1–9 ticks wide). */
export function halfSpread(spread: number): number {
  return ((1 + (spread + 1) * 4) * TICK) / 2;
}

/** The two-sided quote the decision produces, skewed by `q`. */
export function quote(
  mid: number,
  x: Features,
  q: number,
): { bid: number; ask: number } {
  const half = halfSpread(x[SPREAD]);
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
    case SPREAD:
      return (1 + (value + 1) * 4).toFixed(1) + "t";
    case INVENTORY:
      return signed(Math.round(value * 500), 0);
    case VOLATILITY:
      return ((value + 1) / 2).toFixed(2);
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
