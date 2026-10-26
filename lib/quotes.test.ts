import { describe, it, expect } from "vitest";
import { parseChart } from "./quotes";

const chart = (over: Record<string, unknown> = {}) => ({
  chart: {
    result: [
      {
        meta: {
          symbol: "FUTU",
          currency: "USD",
          regularMarketPrice: 101.34,
          regularMarketTime: 1_700_000_300,
          currentTradingPeriod: { regular: { start: 1_700_000_000, end: 1_700_023_400 } },
          ...over,
        },
        timestamp: [1_699_800_000, 1_699_900_000, 1_700_000_000],
        indicators: { quote: [{ close: [95.1, null, 99.2] }] },
      },
    ],
  },
});

describe("parseChart", () => {
  it("drops null bars and pins the last bar to the live price", () => {
    const q = parseChart(chart(), 1_700_000_500_000);
    expect(q?.points).toEqual([
      { t: 1_699_800_000_000, close: 95.1 },
      { t: 1_700_000_000_000, close: 101.34 },
    ]);
    expect(q?.last).toBe(101.34);
    expect(q?.asOf).toBe(1_700_000_300_000);
  });

  it("reports whether the regular session is open", () => {
    expect(parseChart(chart(), 1_700_000_500_000)?.open).toBe(true);
    expect(parseChart(chart(), 1_700_030_000_000)?.open).toBe(false);
  });

  it("rejects payloads without a price", () => {
    expect(parseChart(chart({ regularMarketPrice: undefined }))).toBeNull();
    expect(parseChart({ chart: { result: [] } })).toBeNull();
    expect(parseChart(null)).toBeNull();
  });
});
