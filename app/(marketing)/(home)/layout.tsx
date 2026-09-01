import type { ReactNode } from "react";
import { Poppins } from "next/font/google";

import "../../marketing-home.css";
import MarketingChrome from "@marketing/components/MarketingChrome";
import { HOME_CRITICAL_CSS } from "@marketing/home-landing/homeCriticalCss";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/** Homepage: single CSS bundle + inlined critical hero rules for faster LCP. */
export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <MarketingChrome
      siteClassName="flex min-h-screen flex-col bg-white font-sans text-[#1a1e3a] antialiased"
      homeClassName="mml-marketing-page"
    >
      <style dangerouslySetInnerHTML={{ __html: HOME_CRITICAL_CSS }} />
      <link
        rel="preload"
        as="image"
        type="image/webp"
        href="/svgs/lessonplan-sm.webp"
        fetchPriority="high"
      />
      <div className={poppins.variable}>{children}</div>
    </MarketingChrome>
  );
}
