import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";

import CookieConsent from "@marketing/components/CookieConsent";
import Footer from "@marketing/components/Footer";
import Navbar from "@marketing/components/Navbar";

import "../marketing-globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: "Make My Lesson — AI Lesson Planner for Teachers",
    template: "%s | Make My Lesson",
  },
  description:
    "Generate complete, curriculum-aligned teaching packs in minutes. Lesson plan, presentation, activity and assessment — built for your exact curriculum.",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${inter.variable} ${inter.className} flex min-h-screen flex-col bg-mml-navy font-sans text-mml-text antialiased`}
    >
      <Navbar />
      <main className="main-content flex min-h-0 flex-1 flex-col pt-16">
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
