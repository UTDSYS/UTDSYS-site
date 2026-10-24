import { describe, it, expect } from "vitest";
import {
  createRandom,
  decide,
  driftStep,
  EARNINGS,
  fairValue,
  forward,
  formatFeature,
  INITIAL_FEATURES,
  INITIAL_MID,
  INVENTORY,
  LEVERAGE,
  quote,
  signed,
  VALUATION,
  VOLATILITY,
  type Features,
} from "./quoting";

const at = (overrides: Partial<Record<number, number>>): Features => {
  const x: Features = [0, 0, 0, 0, 0, 0];
  for (const [i, v] of Object.entries(overrides)) x[Number(i)] = v as number;
  return x;
};

describe("forward", () => {
  it("is deterministic", () => {
    const a = forward(INITIAL_FEATURES);
    const b = forward(INITIAL_FEATURES);
    expect(a.q).toBe(b.q);
    expect(a.hidden).toEqual(b.hidden);
  });

  it("keeps every activation inside the tanh range", () => {
    const x: Features = [1, -1, 1, 1, -1, 1];
    const { hidden, q } = forward(x);
    for (const h of hidden) expect(Math.abs(h)).toBeLessThan(1);
    expect(Math.abs(q)).toBeLessThan(1);
  });

  it("leans away from the bid when inventory is long", () => {
    expect(forward(at({ [INVENTORY]: 0.9 })).q).toBeGreaterThan(0);
  });

  it("leans away from the ask when inventory is short", () => {
    expect(forward(at({ [INVENTORY]: -0.9 })).q).toBeLessThan(0);
  });

  it("leans harder when volatility is high", () => {
    const calm = forward(at({ [INVENTORY]: 0.5, [VOLATILITY]: -1 })).q;
    const wild = forward(at({ [INVENTORY]: 0.5, [VOLATILITY]: 1 })).q;
    expect(wild).toBeGreaterThan(calm);
  });
});

describe("fundamentals", () => {
  it("values the company higher on an earnings beat", () => {
    const miss = fairValue(forward(at({ [EARNINGS]: -0.8 })).hidden);
    const beat = fairValue(forward(at({ [EARNINGS]: 0.8 })).hidden);
    expect(beat).toBeGreaterThan(miss);
  });

  it("values the company lower when it is expensive or levered", () => {
    const base = fairValue(forward(at({})).hidden);
    expect(fairValue(forward(at({ [VALUATION]: 0.8 })).hidden)).toBeLessThan(base);
    expect(fairValue(forward(at({ [LEVERAGE]: 0.8 })).hidden)).toBeLessThan(base);
  });

  it("leans toward buying when the company looks cheap", () => {
    expect(forward(at({ [EARNINGS]: 0.8, [VALUATION]: -0.8 })).q).toBeLessThan(0);
  });

  it("keeps fair value within a few percent of the market", () => {
    for (const h of [-1, 1]) {
      const v = fairValue([0, 0, h]);
      expect(Math.abs(v - INITIAL_MID) / INITIAL_MID).toBeLessThanOrEqual(0.03);
    }
  });
});

describe("decide", () => {
  it("quotes both sides when the model has no strong view", () => {
    expect(decide(0)).toBe("quote-both");
    expect(decide(0.19)).toBe("quote-both");
    expect(decide(-0.19)).toBe("quote-both");
  });

  it("skews before it pulls", () => {
    expect(decide(0.4)).toBe("skew-ask");
    expect(decide(-0.4)).toBe("skew-bid");
  });

  it("pulls a side at the extremes", () => {
    expect(decide(0.9)).toBe("pull-bid");
    expect(decide(-0.9)).toBe("pull-ask");
  });
});

describe("quote", () => {
  it("always returns a bid below the ask", () => {
    for (const q of [-1, -0.5, 0, 0.5, 1]) {
      const { bid, ask } = quote(INITIAL_MID, INITIAL_FEATURES, q);
      expect(bid).toBeLessThan(ask);
    }
  });

  it("widens as volatility grows", () => {
    const tight = quote(INITIAL_MID, at({ [VOLATILITY]: -1 }), 0);
    const wide = quote(INITIAL_MID, at({ [VOLATILITY]: 1 }), 0);
    expect(wide.ask - wide.bid).toBeGreaterThan(tight.ask - tight.bid);
  });

  it("shifts both sides down when the model leans away from the bid", () => {
    const flat = quote(INITIAL_MID, INITIAL_FEATURES, 0);
    const leaning = quote(INITIAL_MID, INITIAL_FEATURES, 0.8);
    expect(leaning.bid).toBeLessThan(flat.bid);
    expect(leaning.ask).toBeLessThan(flat.ask);
  });
});

describe("display", () => {
  it("uses a real minus sign so the rail stays optically even", () => {
    expect(signed(0.5, 2)).toBe("+0.50");
    expect(signed(-0.5, 2)).toBe("−0.50");
  });

  it("gives each feature its own natural units", () => {
    expect(formatFeature(INVENTORY, 0.5)).toBe("+250");
    expect(formatFeature(VOLATILITY, 0)).toBe("0.50");
    expect(formatFeature(EARNINGS, 0.5)).toBe("+4.0%");
    expect(formatFeature(VALUATION, 0)).toBe("16.0x");
    expect(formatFeature(LEVERAGE, -1)).toBe("0.0x");
  });
});

describe("drift", () => {
  it("is reproducible from a seed", () => {
    const a = createRandom(42);
    const b = createRandom(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("stays inside the feature range", () => {
    const random = createRandom(1);
    let v = 0.9;
    for (let i = 0; i < 5000; i++) v = driftStep(v, random(), 1 / 60);
    expect(v).toBeGreaterThanOrEqual(-1);
    expect(v).toBeLessThanOrEqual(1);
  });

  it("reverts toward the middle of the range", () => {
    let v = 1;
    for (let i = 0; i < 200; i++) v = driftStep(v, 0.5, 1 / 60);
    expect(Math.abs(v)).toBeLessThan(1);
  });
});
