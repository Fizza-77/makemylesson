import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Manrope } from "next/font/google";

import Footer from "@marketing/components/Footer";

import "./marketing-page.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Make My Lesson — AI Lesson Planner for Teachers",
  description:
    "Create complete lessons in 4 simple stages. Plan, present, assess and teach — a full lesson pack in minutes.",
};

export default function MarketingPageLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${inter.variable} ${manrope.variable} ${inter.className} mml-marketing-page`}
      style={{ background: "#0f1b2d", minHeight: "100vh" }}
    >
      {children}
      <Footer />
    </div>
  );
}
