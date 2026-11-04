import type { Rating, ResearchReport } from "@/lib/content";

/** Implied return from publication price to target, as a fraction. */
export const upside = (r: ResearchReport) => r.priceTarget / r.priceAtPublication - 1;

export const formatPrice = (currency: string, n: number) =>
  `${currency}${n.toFixed(2)}`;

/** "+23.4%" / "−8.1%" with a true minus sign. */
export const formatPct = (x: number) =>
  `${x >= 0 ? "+" : "−"}${Math.abs(x * 100).toFixed(1)}%`;

// Dates are stored as plain ISO days; format in UTC so server and client agree.
const dateFmt = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
export const formatDate = (iso: string) => dateFmt.format(new Date(`${iso}T00:00:00Z`));

export const byNewest = (a: ResearchReport, b: ResearchReport) => b.date.localeCompare(a.date);

/** Single-accent ratings: no green/red, the scale is carried by weight. */
export const ratingClass: Record<Rating, string> = {
  Buy: "bg-signal-deep text-white border-signal-deep",
  Hold: "bg-transparent text-navy border-navy/30",
  Sell: "bg-ink text-white border-ink",
};

/** Price moves, and only price moves, read green up and red down. */
export const UP = "#059669";
export const DOWN = "#dc2626";
export const moveColor = (change: number) => (change >= 0 ? UP : DOWN);

/** The benchmark a call is measured against: S&P/TSX for Canadian listings, S&P 500 otherwise. */
export const benchmarkFor = (r: ResearchReport) =>
  r.exchange === "TSX"
    ? { symbol: "^GSPTSE", name: "S&P/TSX Composite", short: "S&P/TSX" }
    : { symbol: "^GSPC", name: "S&P 500", short: "S&P 500" };

/** First close on or after an ISO day, or null when the history doesn't reach back that far. */
export function closeOnOrAfter(points: { t: number; close: number }[], iso: string): number | null {
  const from = Date.parse(`${iso}T00:00:00Z`);
  if (!points.length || points[0].t > from + 7 * 86_400_000) return null;
  const p = points.find((x) => x.t >= from);
  return p ? p.close : null;
}

/** Last close on or before a moment, or null if the history starts later. */
export function closeOnOrBefore(points: { t: number; close: number }[], t: number): number | null {
  let found: number | null = null;
  for (const p of points) {
    if (p.t > t) break;
    found = p.close;
  }
  return found;
}

/** Epoch ms of a call's publication and of the end of its horizon. */
export function callWindow(r: ResearchReport) {
  const start = Date.parse(`${r.date}T00:00:00Z`);
  const years = parseInt(r.horizon ?? "1", 10) || 1;
  return { start, end: start + years * 365 * 86_400_000 };
}

export type CallStatus =
  | { state: "open" }
  | {
      state: "closed";
      /** why it closed: reached its target, ran out its horizon, or closed by hand */
      reason: "target" | "horizon" | "manual";
      /** what to show, e.g. "Target reached" */
      label: string;
      /** epoch ms of the closing day */
      t: number;
      price: number;
      /** price return from entry to the close, locked */
      ret: number;
    };

/**
 * Where a call stands, by a fixed rule so no result is picked by hand:
 *  1. a close entered in content (e.g. a downgrade) always wins;
 *  2. otherwise the call closes on the first day the stock CLOSES at or
 *     beyond its target (at or above for Buy, at or below for Sell), and
 *     the return is locked at that close;
 *  3. otherwise it closes at the last close of its horizon;
 *  4. until then it is open, and its return moves with the price.
 * Hold calls have no target to hit, so only 1, 3 and 4 apply.
 */
export function callStatus(r: ResearchReport, points: { t: number; close: number }[]): CallStatus {
  const entry = r.priceAtPublication;
  if (r.closed) {
    return {
      state: "closed",
      reason: "manual",
      label: r.closed.reason,
      t: Date.parse(`${r.closed.date}T00:00:00Z`),
      price: r.closed.price,
      ret: r.closed.price / entry - 1,
    };
  }
  const { start, end } = callWindow(r);
  // the publication day's own close is the entry, so look from the day after
  const life = points.filter((p) => p.t > start + 86_400_000 / 2 && p.t <= end);
  if (r.rating !== "Hold") {
    const hit = life.find((p) => (r.rating === "Buy" ? p.close >= r.priceTarget : p.close <= r.priceTarget));
    if (hit) {
      return { state: "closed", reason: "target", label: "Target Reached", t: hit.t, price: hit.close, ret: hit.close / entry - 1 };
    }
  }
  const lastT = points.length ? points[points.length - 1].t : 0;
  if (lastT >= end && life.length) {
    const p = life[life.length - 1];
    return { state: "closed", reason: "horizon", label: "Horizon Ended", t: p.t, price: p.close, ret: p.close / entry - 1 };
  }
  return { state: "open" };
}
