import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Manrope, Poppins } from "next/font/google";

import MarketingChrome from "@marketing/components/MarketingChrome";

import "../marketing-globals.css";
import "@marketing/home-landing/marketing-page.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
  adjustFontFallback: true,
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/logo.png", sizes: "512x512", type: "image/png" }],
  },
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const fontVars = `${inter.variable} ${manrope.variable} ${poppins.variable} ${inter.className}`;

  return (
    <MarketingChrome
      siteClassName={`${fontVars} flex min-h-screen flex-col bg-white font-sans text-[#1a1e3a] antialiased`}
      homeClassName={`${fontVars} mml-marketing-page`}
    >
      {children}
    </MarketingChrome>
  );
}
