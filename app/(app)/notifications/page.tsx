import { redirect } from "next/navigation";

/** Legacy URL — open the alerts overlay on home (client-only UI; no backend change). */
export default function NotificationsPage() {
  redirect("/?alerts=1");
}
