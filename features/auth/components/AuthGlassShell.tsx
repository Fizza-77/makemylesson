import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/urls";

export function AuthGlassShell({
  children,
  className,
  shellClassName,
  wide,
  title,
  subtitle,
  headerAction,
}: {
  children: ReactNode;
  className?: string;
  shellClassName?: string;
  /** Full-width card with outer margins on large screens. */
  wide?: boolean;
  title?: string;
  subtitle?: string;
  /** Optional action shown in the header (e.g. Sign in link on signup). */
  headerAction?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-dvh max-h-dvh flex-col justify-center overflow-hidden bg-gradient-to-br from-[#1A2138] via-[#1E2235] to-[#28C2C0]/30",
        wide
          ? "p-1.5 lg:h-auto lg:min-h-screen lg:max-h-none lg:p-[0.5in]"
          : "overflow-y-auto px-4 py-6 sm:py-8",
        shellClassName,
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/95 shadow-xl backdrop-blur sm:rounded-3xl",
          wide
            ? "max-w-none p-2.5 lg:overflow-visible lg:p-10 xl:p-12"
            : "max-w-md overflow-visible p-8",
          className,
        )}
      >
        <div
          className={cn(
            wide
              ? "mb-1.5 flex shrink-0 flex-wrap items-center justify-between gap-x-2 gap-y-0.5 lg:mb-8 lg:justify-start lg:gap-x-6"
              : "mb-6 flex flex-col items-center text-center",
          )}
        >
          {wide ? (
            <>
              <Link
                href={ROUTES.stage1}
                className="inline-flex shrink-0 items-center gap-2 no-underline lg:gap-3"
              >
                <Image
                  src="/logo.png"
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-md lg:h-12 lg:w-12 lg:rounded-xl"
                />
                <span className="text-xs font-bold tracking-tight text-[#1A1C30] lg:text-2xl">
                  Make My Lesson
                </span>
              </Link>
              {subtitle ? (
                <p className="hidden min-w-0 flex-1 text-center text-[#666666] lg:block lg:text-base">
                  {subtitle}
                </p>
              ) : null}
              <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-4">
                {headerAction}
                {title ? (
                  <h1 className="shrink-0 text-xs font-bold text-[#1A1C30] lg:text-2xl">
                    {title}
                  </h1>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <Link href={ROUTES.stage1} className="mb-4">
                <Image
                  src="/logo.png"
                  alt="Make My Lesson"
                  width={48}
                  height={48}
                  className="rounded-xl"
                />
              </Link>
              {title ? (
                <h1 className="text-2xl font-bold text-[#1A1C30]">{title}</h1>
              ) : null}
              {subtitle ? (
                <p className="mt-2 text-sm text-[#666666]">{subtitle}</p>
              ) : null}
              {headerAction ? (
                <div className="mt-3">{headerAction}</div>
              ) : null}
            </>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto lg:overflow-visible">{children}</div>
      </div>
    </div>
  );
}
