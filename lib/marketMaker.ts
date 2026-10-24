/**
 * The /quantitative-research desk: a simulated Avellaneda–Stoikov market
 * maker, the textbook starting point for the club's quoting engine.
 *
 *   mid            dS = σ dW
 *   reservation    r  = S − q·γ·σ²·τ
 *   spread         δ  = γ·σ²·τ + (2/γ)·ln(1 + γ/k)
 *   quotes         bid = r − δ/2,  ask = r + δ/2
 *   fills          λ(d) = A·e^(−k·d), d = distance from mid
 *   toxicity       after a fill the mid jumps against us by α, the adverse
 *                  selection that makes inventory genuinely risky
 *
 * τ is held constant (a rolling horizon) so the desk runs indefinitely
 * instead of winding down to a terminal time. Everything is pure and seeded,
 * so it's testable and every visitor sees the same opening tape. The
 * animation loop lives in components/quant/MarketMakerDesk.tsx.
 *
 * All of it is simulated. Nothing here touches a real market.
 */

import { createRandom } from "@/lib/quoting";

export type Params = {
  /** Risk aversion γ. Higher → tighter inventory control, wider quotes. */
  gamma: number;
  /** Volatility σ of the mid, per unit time. */
  sigma: number;
  /** Order-arrival decay k: how fast fill probability falls with distance. */
  k: number;
  /** Order-arrival scale A. */
  A: number;
  /** Rolling horizon τ. */
  tau: number;
  /** Time step. */
  dt: number;
  /** Adverse selection α: how far the mid moves against each fill. */
  toxicity: number;
};

// Tuned so the desk looks like a real one: per-step volatility on the scale
// of the half-spread, thin edge per fill after adverse selection, and P&L
// that grinds up with genuine drawdowns. Low γ fills more but carries more
// inventory; high γ is safer and fills less.
export const DEFAULT_PARAMS: Params = {
  gamma: 0.1,
  sigma: 6,
  k: 1.5,
  A: 25,
  tau: 0.1,
  dt: 0.01,
  toxicity: 0.7,
};

export const INITIAL_MID = 100;
export const MAX_INVENTORY = 25;

export type Fill = { t: number; side: "bid" | "ask"; price: number };

export type State = {
  t: number;
  mid: number;
  bid: number;
  ask: number;
  inventory: number;
  cash: number;
  fills: number;
  /** Sum of |fill price − mid| over all fills: the edge actually captured. */
  edge: number;
  lastFill: Fill | null;
};

/** Reservation price and optimal quotes for the current state. */
export function quotes(mid: number, inventory: number, p: Params) {
  const risk = p.gamma * p.sigma * p.sigma * p.tau;
  const reservation = mid - inventory * risk;
  const spread = risk + (2 / p.gamma) * Math.log(1 + p.gamma / p.k);
  return {
    reservation,
    spread,
    bid: reservation - spread / 2,
    ask: reservation + spread / 2,
  };
}

/** Probability an order at distance `d` from mid fills within one step. */
export const fillProbability = (d: number, p: Params) =>
  Math.min(1, p.A * Math.exp(-p.k * Math.max(0, d)) * p.dt);

/** Standard normal via Box–Muller. */
function gaussian(random: () => number) {
  const u = Math.max(random(), 1e-12);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
}

export function initialState(p: Params = DEFAULT_PARAMS): State {
  const q = quotes(INITIAL_MID, 0, p);
  return {
    t: 0,
    mid: INITIAL_MID,
    bid: q.bid,
    ask: q.ask,
    inventory: 0,
    cash: 0,
    fills: 0,
    edge: 0,
    lastFill: null,
  };
}

/** Advance one step: quote, maybe get filled, then let the mid move. */
export function step(s: State, p: Params, random: () => number): State {
  const { bid, ask } = quotes(s.mid, s.inventory, p);
  let { inventory, cash, fills, edge } = s;
  let lastFill: Fill | null = null;

  // A position limit, like any real desk: stop quoting the side that grows it.
  if (inventory < MAX_INVENTORY && random() < fillProbability(s.mid - bid, p)) {
    inventory += 1;
    cash -= bid;
    fills += 1;
    edge += s.mid - bid;
    lastFill = { t: s.t, side: "bid", price: bid };
  }
  if (inventory > -MAX_INVENTORY && random() < fillProbability(ask - s.mid, p)) {
    inventory -= 1;
    cash += ask;
    fills += 1;
    edge += ask - s.mid;
    lastFill = { t: s.t, side: "ask", price: ask };
  }

  // Informed flow: whoever just traded with us tends to be right.
  const flow = inventory - s.inventory;
  const mid = s.mid + p.sigma * Math.sqrt(p.dt) * gaussian(random) - p.toxicity * flow;
  return { t: s.t + 1, mid, bid, ask, inventory, cash, fills, edge, lastFill };
}

/** Mark-to-market P&L. */
export const pnl = (s: State) => s.cash + s.inventory * s.mid;

export { createRandom };
