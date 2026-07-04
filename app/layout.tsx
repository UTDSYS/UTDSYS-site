import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import "./globals.css";

// Distinct var names (`--ff-*`) so the Tailwind @theme tokens can reference
// them without circular `--font-display: var(--font-display)` definitions.
const display = Schibsted_Grotesk({
  variable: "--ff-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const body = Instrument_Sans({
  variable: "--ff-body",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--ff-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "University of Toronto Decision Systems",
  description:
    "A student design team at the University of Toronto building intelligent decision systems.",
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
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        {/* Nav lives here (not per-page) so route transitions can animate the
            page content without disturbing the fixed nav. */}
        <Nav />
        {children}
      </body>
    </html>
  );
}
