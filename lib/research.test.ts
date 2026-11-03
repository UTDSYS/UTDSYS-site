import { describe, it, expect } from "vitest";
import type { ResearchReport } from "./content";
import { callStatus } from "./research";

const DAY = 86_400_000;
const t0 = Date.parse("2026-01-05T00:00:00Z");
// a daily close series starting on the publication day
const series = (closes: number[]) => closes.map((close, i) => ({ t: t0 + i * DAY, close }));

const call = (over: Partial<ResearchReport> = {}): ResearchReport => ({
  slug: "x",
  company: "X",
  ticker: "X",
  exchange: "NYSE",
  sector: "",
  date: "2026-01-05",
  rating: "Buy",
  currency: "US$",
  priceAtPublication: 100,
  priceTarget: 120,
  headline: "",
  summary: "",
  analysts: [],
  metrics: [],
  pdf: null,
  horizon: "1-year",
  ...over,
});

describe("callStatus", () => {
  it("locks the return on the first close at the target, even if the stock falls after", () => {
    const s = callStatus(call(), series([100, 110, 121, 90, 80]));
    expect(s).toMatchObject({ state: "closed", reason: "target", price: 121, t: t0 + 2 * DAY });
    if (s.state === "closed") expect(s.ret).toBeCloseTo(0.21);
  });

  it("stays open while the target hasn't been reached and the horizon hasn't ended", () => {
    expect(callStatus(call(), series([100, 105, 119, 95]))).toEqual({ state: "open" });
  });

  it("closes a Sell when the stock closes at or below its target", () => {
    const s = callStatus(call({ rating: "Sell", priceTarget: 80 }), series([100, 90, 80, 95]));
    expect(s).toMatchObject({ state: "closed", reason: "target", price: 80 });
  });

  it("ignores the publication day's own close", () => {
    expect(callStatus(call({ priceTarget: 100 }), series([100]))).toEqual({ state: "open" });
  });

  it("closes at the last close of the horizon when the target was never reached", () => {
    const closes = Array.from({ length: 400 }, (_, i) => 100 + (i % 10));
    const s = callStatus(call(), series(closes));
    expect(s).toMatchObject({ state: "closed", reason: "horizon", t: t0 + 365 * DAY });
  });

  it("never closes a Hold on a target, only at the horizon", () => {
    expect(callStatus(call({ rating: "Hold" }), series([100, 130, 140]))).toEqual({ state: "open" });
  });

  it("lets a close entered by hand win over the rule", () => {
    const s = callStatus(
      call({ closed: { date: "2026-01-06", price: 104, reason: "Downgraded to Hold" } }),
      series([100, 104, 125]),
    );
    expect(s).toMatchObject({ state: "closed", reason: "manual", label: "Downgraded to Hold", price: 104 });
  });
});
