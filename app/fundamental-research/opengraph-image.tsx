import { ogSize, sectionCard } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "What We Do — UTDSYS Fundamental Research";

export default function Image() {
  return sectionCard(
    "What We Do",
    "Bottom-up company research with a top-down view of the economy, to find durable businesses the market has mispriced.",
  );
}
