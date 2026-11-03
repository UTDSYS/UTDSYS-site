import { NextResponse } from "next/server";
import content from "@/lib/content";
import { fetchQuote, QUOTE_TTL } from "@/lib/quotes";

// Only names we actually cover, so this can't be used as an open proxy.
// Each maps to its oldest call, so the history covers every call's life.
const TRACKED = new Map<string, string>();
for (const r of content.fundamentalResearch.reports) {
  if (!r.quoteSymbol) continue;
  const seen = TRACKED.get(r.quoteSymbol);
  if (!seen || r.date < seen) TRACKED.set(r.quoteSymbol, r.date);
}

export async function GET(req: Request) {
  const symbol = new URL(req.url).searchParams.get("symbol") ?? "";
  if (!TRACKED.has(symbol)) {
    return NextResponse.json({ error: "Unknown symbol" }, { status: 404 });
  }
  const quote = await fetchQuote(symbol, TRACKED.get(symbol));
  if (!quote) {
    return NextResponse.json({ error: "Quote unavailable" }, { status: 502 });
  }
  return NextResponse.json(quote, {
    headers: { "Cache-Control": `public, s-maxage=${QUOTE_TTL}, stale-while-revalidate=${QUOTE_TTL * 5}` },
  });
}
