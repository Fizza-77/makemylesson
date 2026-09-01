import type { ReactNode } from "react";
import { Poppins } from "next/font/google";

import "@marketing/home-landing/marketing-page.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/** Homepage-only styles and Poppins — keeps teaching-method pages leaner. */
export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link
        rel="preload"
        as="image"
        type="image/webp"
        href="/hero-visual-stage-sm.webp"
        imageSrcSet="/hero-visual-stage-sm.webp 860w, /hero-visual-stage.webp 1718w"
        imageSizes="(max-width: 1199px) min(100vw, 44rem), 50vw"
        fetchPriority="high"
      />
      <div className={poppins.variable}>{children}</div>
    </>
  );
}
