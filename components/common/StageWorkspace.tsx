"use client";

import { TipsResourcesCard } from "@/components/common/TipsResourcesCard";
import { Stage4FinalChecklist } from "@/components/common/Stage4FinalChecklist";
import { AylaChatPanel } from "@/features/ayla/AylaChatPanel";
import type { StageSidebarContext } from "@/data/stage-tips";
import { cn } from "@/lib/utils";

/**
 * Stage body: main content left; tips (or Stage 4 checklist) + Ayla on the right.
 * Right column is sticky on desktop and scrolls independently so touch / wheel
 * on the sidebar does not scroll the left column.
 */
export function StageWorkspace({
  context,
  children,
  className,
}: {
  context: StageSidebarContext;
  children: React.ReactNode;
  className?: string;
}) {
  const isStage4 = context === "stage4";

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col gap-6 lg:flex-row lg:items-start lg:gap-8",
        className,
      )}
    >
      <div className="min-w-0 flex-1">{children}</div>

      <aside
        className={cn(
          "relative w-full shrink-0",
          "lg:sticky lg:top-[5.25rem] lg:w-80 lg:self-start xl:w-96",
          "lg:max-h-[calc(100dvh-5.25rem-1.25rem)] lg:overflow-y-auto lg:overscroll-y-contain",
          "lg:touch-pan-y lg:[-webkit-overflow-scrolling:touch]",
          "lg:[scrollbar-width:none] lg:[-ms-overflow-style:none] lg:[&::-webkit-scrollbar]:hidden",
        )}
      >
        <div className="flex flex-col gap-4 pb-1">
          {isStage4 ? (
            <Stage4FinalChecklist />
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              {context !== "stage3" ? (
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-[5px] bg-teal-400"
                  aria-hidden
                />
              ) : null}
              <TipsResourcesCard
                context={context}
                className={context !== "stage3" ? "pt-1" : undefined}
              />
            </div>
          )}

          <AylaChatPanel
            context={context}
            className="rounded-2xl border border-slate-200 shadow-sm"
          />
        </div>
      </aside>
    </div>
  );
}
