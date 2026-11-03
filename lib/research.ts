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
