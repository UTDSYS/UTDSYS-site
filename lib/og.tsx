import { ImageResponse } from "next/og";
import type { ResearchReport } from "@/lib/content";
import { formatDate, formatPct, formatPrice, upside } from "@/lib/research";

/** Link-preview cards (LinkedIn, iMessage, X): 1200×630, in the site's navy. */
export const ogSize = { width: 1200, height: 630 };

const NAVY = "#0a1838";
const SIGNAL = "#2d5bff";
const SOFT = "rgba(255,255,255,0.62)";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: `radial-gradient(circle at 82% 40%, rgba(45,91,255,0.32), transparent 55%), ${NAVY}`,
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      {children}
    </div>
  );
}

function Masthead({ section }: { section: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 24, letterSpacing: 3, color: SOFT }}>
      <span style={{ color: "white", fontWeight: 700, letterSpacing: 1 }}>UTDSYS</span>
      <span style={{ width: 1, height: 26, background: "rgba(255,255,255,0.3)" }} />
      <span style={{ textTransform: "uppercase" }}>{section}</span>
    </div>
  );
}

/** The site's two bars, the long white one then the short blue one. */
function Bars() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <div style={{ width: 150, height: 8, background: "white" }} />
      <div style={{ width: 64, height: 8, background: SIGNAL }} />
    </div>
  );
}

/** A section page: its name and one line about it. */
export function sectionCard(title: string, line: string) {
  return new ImageResponse(
    (
      <Frame>
        <Masthead section="Fundamental Research" />
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1, letterSpacing: -2 }}>{title}</div>
          <Bars />
          <div style={{ fontSize: 32, lineHeight: 1.35, color: SOFT, maxWidth: 900 }}>{line}</div>
        </div>
        <div style={{ fontSize: 22, color: SOFT }}>University of Toronto Decision Systems</div>
      </Frame>
    ),
    ogSize,
  );
}

/** A published call: company, headline, rating, and target. */
export function reportCard(r: ResearchReport) {
  return new ImageResponse(
    (
      <Frame>
        <Masthead section="Equity Research" />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 28, letterSpacing: 2, color: SOFT }}>
            {`${r.exchange}: ${r.ticker} · ${formatDate(r.date)}`}
          </div>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1, letterSpacing: -2 }}>{r.company}</div>
          <div style={{ fontSize: 36, lineHeight: 1.3, color: "#a9c0ff", maxWidth: 980 }}>{r.headline}</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div
              style={{
                display: "flex",
                padding: "10px 30px",
                borderRadius: 999,
                background: r.rating === "Hold" ? "transparent" : r.rating === "Buy" ? SIGNAL : "white",
                color: r.rating === "Sell" ? NAVY : "white",
                border: r.rating === "Hold" ? "2px solid rgba(255,255,255,0.6)" : "none",
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              {r.rating}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 22, color: SOFT, textTransform: "uppercase", letterSpacing: 2 }}>
                {`${r.horizon ?? "12-month"} target`}
              </div>
              <div style={{ fontSize: 52, fontWeight: 700 }}>{formatPrice(r.currency, r.priceTarget)}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ fontSize: 22, color: SOFT, textTransform: "uppercase", letterSpacing: 2 }}>At publication</div>
            <div style={{ fontSize: 40, fontWeight: 700 }}>
              {`${formatPct(upside(r))} from ${formatPrice(r.currency, r.priceAtPublication)}`}
            </div>
          </div>
        </div>
      </Frame>
    ),
    ogSize,
  );
}
