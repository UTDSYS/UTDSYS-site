import { ogSize, sectionCard } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Published Research — UTDSYS Fundamental Research";

export default function Image() {
  return sectionCard(
    "Published Research",
    "Every call we publish, dated, with its entry price and target, and tracked against its benchmark.",
  );
}
