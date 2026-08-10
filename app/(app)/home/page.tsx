import { redirect } from "next/navigation";

import { ROUTES } from "@/lib/urls";

/** Legacy in-app home — removed; always land on Stage 1. */
export default function HomePage() {
  redirect(ROUTES.stage1);
}
