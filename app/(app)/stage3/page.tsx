import type { Metadata } from "next";

import { Stage3View } from "@/features/stage3/Stage3View";

export const metadata: Metadata = {
  title: "Stage 3",
  robots: { index: false, follow: false },
};

export default function Stage3Page() {
  return <Stage3View />;
}
