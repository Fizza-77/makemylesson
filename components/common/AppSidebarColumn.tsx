import { cn } from "@/lib/utils";

/** Sticky right column (tips + Ayla) — scrolls independently on desktop; scrollbar hidden. */
export function AppSidebarColumn({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <aside className={cn("app-sidebar-column", className)}>{children}</aside>;
}
