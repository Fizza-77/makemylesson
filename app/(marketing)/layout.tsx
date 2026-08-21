import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Manrope } from "next/font/google";

import JsonLd from "@marketing/components/JsonLd";
import MarketingChrome from "@marketing/components/MarketingChrome";
import { buildCoreOrganizationGraph } from "@marketing/lib/organizationSchema";

import "../marketing-globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "Online AI Lesson Planner for Teachers",
    template: "%s | Make My Lesson",
  },
  description:
    "Plan complete, curriculum-aligned lessons in minutes with AI. Create lesson plans, slides, activities and assessments in one connected teaching pack.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon-32x32.png",
    apple: [{ url: "/logo.png", sizes: "512x512", type: "image/png" }],
  },
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const fontVars = `${inter.variable} ${manrope.variable} ${inter.className}`;

  return (
    <>
      <JsonLd data={buildCoreOrganizationGraph()} />
      <MarketingChrome
        siteClassName={`${fontVars} flex min-h-screen flex-col bg-white font-sans text-[#1a1e3a] antialiased`}
        homeClassName={`${fontVars} mml-marketing-page`}
      >
        {children}
      </MarketingChrome>
    </>
  );
}
