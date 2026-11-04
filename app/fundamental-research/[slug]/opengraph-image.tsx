import content from "@/lib/content";
import { ogSize, reportCard, sectionCard } from "@/lib/og";

const { reports } = content.fundamentalResearch;

export const size = ogSize;
export const contentType = "image/png";
export const alt = "UTDSYS equity research call";

// one card per report, built at deploy time
export const generateStaticParams = () => reports.map((r) => ({ slug: r.slug }));

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = reports.find((r) => r.slug === slug);
  return report ? reportCard(report) : sectionCard("Published Research", "UTDSYS Fundamental Research");
}
