import type { ReactNode } from "react";

import "../../marketing-home.css";
import HomeMarketingShell from "@marketing/components/HomeMarketingShell";
import { HOME_CRITICAL_CSS } from "@marketing/home-landing/homeCriticalCss";

/** Homepage: lean server shell + single CSS bundle (no app globals / mega-menus / Poppins). */
export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <HomeMarketingShell>
      <style dangerouslySetInnerHTML={{ __html: HOME_CRITICAL_CSS }} />
      <link
        rel="preload"
        as="image"
        href="/svgs/lessonplan.svg"
        type="image/svg+xml"
        fetchPriority="high"
      />
      {children}
    </HomeMarketingShell>
  );
}
