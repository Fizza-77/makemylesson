import type { Metadata } from "next";

import { Stage1View } from "@/features/stage1/Stage1View";

export const metadata: Metadata = {
  title: "Stage 1",
  robots: { index: false, follow: false },
};

export default function Stage1Page() {
  return <Stage1View />;
}
