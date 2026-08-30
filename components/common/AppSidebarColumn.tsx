import { cn } from "@/lib/utils";

/** Sticky right column (tips + Ayla) — scrolls independently on desktop; scrollbar hidden. */
export function AppSidebarColumn({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "app-sidebar-column w-full shrink-0 lg:w-80 xl:w-96",
        className,
      )}
    >
      {children}
    </aside>
  );
}
