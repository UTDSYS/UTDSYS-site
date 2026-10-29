import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Source_Sans_3 } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

// Distinct var names (`--ff-*`) so the Tailwind @theme tokens can reference
// them without circular `--font-display: var(--font-display)` definitions.
const display = Source_Serif_4({
  variable: "--ff-display",
  subsets: ["latin"],
  axes: ["opsz"],
});

// Text, and the small caps labels and figures (`font-mono` in the markup):
// one sans keeps them quiet next to the serif headings.
const body = Source_Sans_3({
  variable: "--ff-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "University of Toronto Decision Systems",
  description:
    "University of Toronto Decision Systems is a student research group in quantitative and fundamental research.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f8fa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Nav lives here (not per-page) so route transitions can animate the
            page content without disturbing the fixed nav. */}
        <Nav />
        {children}
      </body>
    </html>
  );
}
