import type { Metadata } from "next";

import { Stage2View } from "@/features/stage2/Stage2View";

export const metadata: Metadata = {
  title: "Stage 2",
  robots: { index: false, follow: false },
};

export default function Stage2Page() {
  return <Stage2View />;
}
