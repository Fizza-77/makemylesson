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
  return <div className={poppins.variable}>{children}</div>;
}
