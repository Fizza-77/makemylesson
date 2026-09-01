import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Manrope } from "next/font/google";

import MarketingChrome from "@marketing/components/MarketingChrome";

import "../marketing-chrome.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  adjustFontFallback: true,
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/** Lesson preview routes: noindex, no JSON-LD. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: {
    default: "Make My Lesson",
    template: "%s | Make My Lesson",
  },
};

export default function MarketingAppLayout({ children }: { children: ReactNode }) {
  const fontVars = `${inter.variable} ${manrope.variable} ${inter.className}`;

  return (
    <MarketingChrome
      siteClassName={`${fontVars} flex min-h-screen flex-col bg-white font-sans text-[#1a1e3a] antialiased`}
      homeClassName={`${fontVars} mml-marketing-page`}
    >
      {children}
    </MarketingChrome>
  );
}
