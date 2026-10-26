/**
 * Price history for the live call tracker. Data comes from Yahoo Finance's
 * public chart endpoint (no key), fetched on the server and cached briefly so
 * every visitor doesn't hit it.
 */

export type PricePoint = { t: number; close: number };

export type Quote = {
  symbol: string;
  currency: string;
  /** Daily closes, oldest first; today's bar carries the latest price. */
  points: PricePoint[];
  last: number;
  /** Epoch ms of the last trade. */
  asOf: number;
  /** True while the regular session is open. */
  open: boolean;
};

/** How far back to load: a year covers the run-up and every range toggle. */
const LOOKBACK_DAYS = 400;

/** Seconds the server keeps a quote before refetching. */
export const QUOTE_TTL = 60;

type YahooChart = {
  chart?: {
    result?: {
      meta?: {
        symbol?: string;
        currency?: string;
        regularMarketPrice?: number;
        regularMarketTime?: number;
        currentTradingPeriod?: { regular?: { start?: number; end?: number } };
      };
      timestamp?: number[];
      indicators?: { quote?: { close?: (number | null)[] }[] };
    }[];
  };
};

/** Turn Yahoo's chart payload into a Quote, or null if it's unusable. */
export function parseChart(json: unknown, now = Date.now()): Quote | null {
  const r = (json as YahooChart)?.chart?.result?.[0];
  const meta = r?.meta;
  const stamps = r?.timestamp ?? [];
  const closes = r?.indicators?.quote?.[0]?.close ?? [];
  if (!meta?.symbol || typeof meta.regularMarketPrice !== "number") return null;

  const points: PricePoint[] = [];
  stamps.forEach((s, i) => {
    const c = closes[i];
    if (typeof c === "number" && Number.isFinite(c)) points.push({ t: s * 1000, close: c });
  });
  if (points.length < 2) return null;

  // Daily bars lag the tape intraday; pin the newest one to the live price.
  const last = meta.regularMarketPrice;
  points[points.length - 1] = { ...points[points.length - 1], close: last };

  const session = meta.currentTradingPeriod?.regular;
  const open =
    !!session?.start && !!session?.end && now >= session.start * 1000 && now < session.end * 1000;

  return {
    symbol: meta.symbol,
    currency: meta.currency ?? "USD",
    points,
    last,
    asOf: (meta.regularMarketTime ?? points[points.length - 1].t / 1000) * 1000,
    open,
  };
}

export async function fetchQuote(symbol: string): Promise<Quote | null> {
  const from = Math.floor(Date.now() / 1000) - LOOKBACK_DAYS * 86_400;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol,
  )}?period1=${from}&period2=9999999999&interval=1d`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (utdsys.com research tracker)" },
      next: { revalidate: QUOTE_TTL },
    });
    if (!res.ok) return null;
    return parseChart(await res.json());
  } catch {
    return null;
  }
}
