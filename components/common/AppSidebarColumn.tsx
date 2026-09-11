import { cn } from "@/lib/utils";

/** Sticky right column — scrolls independently on desktop; scrollbar hidden. */
export function AppSidebarColumn({
  children,
  className,
  /** Pinned below a scrollable upper section (library: map + tips scroll, Ayla stays visible). */
  footer,
}: {
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}) {
  const split = Boolean(footer);

  return (
    <aside
      className={cn(
        "app-sidebar-column w-full shrink-0 lg:w-80 xl:w-96",
        split && "app-sidebar-column--split",
        className,
      )}
    >
      {split ? (
        <>
          <div className="app-sidebar-column-scroll flex flex-col gap-5">
            {children}
          </div>
          <div className="app-sidebar-column-footer shrink-0 pt-5">
            {footer}
          </div>
        </>
      ) : (
        <div className="app-sidebar-column-body flex flex-col gap-4 pb-1">
          {children}
        </div>
      )}
    </aside>
  );
}


