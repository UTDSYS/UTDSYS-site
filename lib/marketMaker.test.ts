import { describe, it, expect } from "vitest";
import {
  createRandom,
  DEFAULT_PARAMS,
  fillProbability,
  initialState,
  MAX_INVENTORY,
  pnl,
  quotes,
  step,
} from "./marketMaker";

describe("quotes", () => {
  it("is symmetric around mid when flat", () => {
    const q = quotes(100, 0, DEFAULT_PARAMS);
    expect(q.reservation).toBe(100);
    expect(100 - q.bid).toBeCloseTo(q.ask - 100);
  });

  it("shades the reservation price down when long and up when short", () => {
    expect(quotes(100, 5, DEFAULT_PARAMS).reservation).toBeLessThan(100);
    expect(quotes(100, -5, DEFAULT_PARAMS).reservation).toBeGreaterThan(100);
  });

  it("widens with risk aversion and volatility", () => {
    const base = quotes(100, 0, DEFAULT_PARAMS).spread;
    expect(quotes(100, 0, { ...DEFAULT_PARAMS, sigma: DEFAULT_PARAMS.sigma * 2 }).spread).toBeGreaterThan(base);
    expect(quotes(100, 0, { ...DEFAULT_PARAMS, gamma: DEFAULT_PARAMS.gamma * 5 }).spread).toBeGreaterThan(base);
  });
});

describe("fillProbability", () => {
  it("falls with distance from mid and stays a probability", () => {
    const near = fillProbability(0.1, DEFAULT_PARAMS);
    const far = fillProbability(2, DEFAULT_PARAMS);
    expect(far).toBeLessThan(near);
    expect(near).toBeLessThanOrEqual(1);
    expect(far).toBeGreaterThanOrEqual(0);
  });
});

describe("step", () => {
  it("is deterministic for a seed", () => {
    const run = () => {
      const rnd = createRandom(42);
      let s = initialState();
      for (let i = 0; i < 500; i++) s = step(s, DEFAULT_PARAMS, rnd);
      return s;
    };
    expect(run()).toEqual(run());
  });

  it("keeps bid below ask and inventory inside the limit", () => {
    const rnd = createRandom(7);
    let s = initialState();
    for (let i = 0; i < 5000; i++) {
      s = step(s, DEFAULT_PARAMS, rnd);
      expect(s.bid).toBeLessThan(s.ask);
      expect(Math.abs(s.inventory)).toBeLessThanOrEqual(MAX_INVENTORY);
    }
  });

  it("books cash and inventory consistently on every fill", () => {
    const rnd = createRandom(3);
    let s = initialState();
    for (let i = 0; i < 2000; i++) {
      const next = step(s, DEFAULT_PARAMS, rnd);
      // With mid frozen at the pre-move price, P&L only changes by edge captured.
      const before = s.cash + s.inventory * s.mid;
      const after = next.cash + next.inventory * s.mid;
      expect(after - before).toBeCloseTo(next.edge - s.edge, 9);
      s = next;
    }
    expect(Number.isFinite(pnl(s))).toBe(true);
  });
});
