import type { Metadata, Viewport } from "next";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/dm-sans";
import "@fontsource/caveat/400.css";
import "@fontsource/caveat/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rafael Abes, the portfolio: ingredients, experiments and things I've built",
  description:
    "The software engineering portfolio of Rafael Abes, laid out as a cookbook: a pantry of skills and a book of project recipes.",
};

export const viewport: Viewport = {
  themeColor: "#F5F0E6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
