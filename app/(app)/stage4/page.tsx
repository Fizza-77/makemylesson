import type { Metadata } from "next";

import { Stage4View } from "@/features/stage4/Stage4View";

export const metadata: Metadata = {
  title: "Stage 4",
  robots: { index: false, follow: false },
};

export default function Stage4Page() {
  return <Stage4View />;
}


