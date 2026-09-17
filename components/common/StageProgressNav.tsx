"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/urls";

const STAGES = [
  { n: 1, label: "Plan", href: ROUTES.stage1 },
  { n: 2, label: "Present", href: ROUTES.stage2 },
  { n: 3, label: "Practise", href: ROUTES.stage3 },
  { n: 4, label: "Assess", href: ROUTES.stage4 },
] as const;

function stageFromPath(pathname: string | null): number {
  if (!pathname) return 1;
  if (pathname.startsWith(ROUTES.stage4)) return 4;
  if (pathname.startsWith(ROUTES.stage3)) return 3;
  if (pathname.startsWith(ROUTES.stage2)) return 2;
  return 1;
}

export function StageProgressNav({
  currentStage,
  className,
}: {
  currentStage?: number;
  className?: string;
}) {
  const pathname = usePathname();
  const active = currentStage ?? stageFromPath(pathname);

  return (
    <nav
      aria-label="Lesson stages"
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-2 shadow-sm",
        className,
      )}
    >
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STAGES.map((stage) => {
          const isCurrent = stage.n === active;
          return (
            <li key={stage.n}>
              <Link
                href={stage.href}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-3 transition",
                  isCurrent
                    ? "bg-gradient-to-r from-teal-400 to-teal-200 shadow-sm"
                    : "border border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/40",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                    isCurrent
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-500",
                  )}
                >
                  {stage.n}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-sm font-semibold",
                      isCurrent ? "text-slate-900" : "text-slate-800",
                    )}
                  >
                    {stage.label}
                  </span>
                  <span
                    className={cn(
                      "block text-[11px]",
                      isCurrent ? "font-medium text-teal-800" : "text-slate-400",
                    )}
                  >
                    {isCurrent ? "Current stage" : `Stage ${stage.n}`}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


