import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/urls";

function AuthBrandMark({ large = false }: { large?: boolean }) {
  return (
    <Link
      href={ROUTES.stage1}
      className={cn(
        "inline-flex items-center no-underline",
        large ? "gap-3.5" : "gap-2.5",
      )}
    >
      <Image
        src="/logo.png"
        alt=""
        width={large ? 56 : 52}
        height={large ? 56 : 52}
        className={cn(
          "rounded-xl shadow-sm",
          large ? "h-14 w-14" : "h-[52px] w-[52px]",
        )}
        priority
      />
      <span
        className={cn(
          "font-bold tracking-tight text-[#1A1C30]",
          large ? "text-2xl" : "text-sm",
        )}
      >
        Make My Lesson
      </span>
    </Link>
  );
}

export function AuthGlassShell({
  children,
  className,
  shellClassName,
  wide,
  split,
  title,
  subtitle,
  headerAction,
}: {
  children: ReactNode;
  className?: string;
  shellClassName?: string;
  /** Full-width card with outer margins on large screens. */
  wide?: boolean;
  /** Landscape card: branding left, form right. */
  split?: boolean;
  title?: string;
  subtitle?: string;
  /** Optional action shown in the header (e.g. Sign in link on signup). */
  headerAction?: ReactNode;
}) {
  const isWideLayout = wide || split;

  return (
    <div
      className={cn(
        "flex min-h-dvh flex-col bg-gradient-to-br from-[#1A2138] via-[#1E2235] to-[#28C2C0]/30",
        isWideLayout
          ? "items-center justify-center p-4 sm:p-6 lg:p-[0.5in]"
          : "items-center justify-center px-4 py-8 sm:py-10",
        shellClassName,
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full flex-col rounded-2xl border border-white/10 bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.45)] sm:rounded-3xl",
          split
            ? "max-w-[54rem] p-6 sm:p-8 lg:p-10"
            : wide
              ? "max-w-none p-2.5 lg:p-5 xl:p-6"
              : "max-w-[26rem] p-6 sm:p-8",
          className,
        )}
      >
        {split ? (
          <div className="grid items-center gap-8 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] sm:gap-8 lg:gap-10 xl:gap-12">
            <div className="flex flex-col justify-center border-b border-[#E8ECF0] pb-8 sm:border-r sm:border-b-0 sm:pr-8 sm:pb-0 lg:pr-10 xl:pr-12">
              <AuthBrandMark large />
              {title ? (
                <h1 className="mt-6 text-[1.75rem] font-bold tracking-tight text-[#1A1C30] sm:text-[2rem]">
                  {title}
                </h1>
              ) : null}
              {subtitle ? (
                <p className="mt-2 max-w-[22ch] text-[15px] leading-relaxed text-[#666666] sm:text-base">
                  {subtitle}
                </p>
              ) : null}
              {headerAction ? <div className="mt-4">{headerAction}</div> : null}
            </div>
            <div className="flex min-w-0 flex-col justify-center sm:pl-1">
              {children}
            </div>
          </div>
        ) : (
          <>
        <div
          className={cn(
            wide
              ? "mb-1.5 flex shrink-0 flex-wrap items-center justify-between gap-x-2 gap-y-0.5 lg:mb-3 lg:justify-start lg:gap-x-4"
              : "mb-6 flex flex-col items-center text-center sm:mb-7",
          )}
        >
          {wide ? (
            <>
              <Link
                href={ROUTES.stage1}
                className="inline-flex shrink-0 items-center gap-2 no-underline lg:gap-2.5"
              >
                <Image
                  src="/logo.png"
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-md lg:h-9 lg:w-9 lg:rounded-lg"
                />
                <span className="text-xs font-bold tracking-tight text-[#1A1C30] lg:text-lg">
                  Make My Lesson
                </span>
              </Link>
              {subtitle ? (
                <p className="hidden min-w-0 flex-1 text-center text-[#666666] lg:block lg:text-sm">
                  {subtitle}
                </p>
              ) : null}
              <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-4">
                {headerAction}
                {title ? (
                  <h1 className="shrink-0 text-xs font-bold text-[#1A1C30] lg:text-lg">
                    {title}
                  </h1>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <Link
                href={ROUTES.stage1}
                className="mb-4 inline-flex flex-col items-center gap-2.5 no-underline"
              >
                <Image
                  src="/logo.png"
                  alt="Make My Lesson"
                  width={52}
                  height={52}
                  className="rounded-xl shadow-sm"
                  priority
                />
                <span className="text-sm font-bold tracking-tight text-[#1A1C30]">
                  Make My Lesson
                </span>
              </Link>
              {title ? (
                <h1 className="text-[1.375rem] font-bold tracking-tight text-[#1A1C30] sm:text-2xl">
                  {title}
                </h1>
              ) : null}
              {subtitle ? (
                <p className="mt-1.5 max-w-sm text-sm leading-snug text-[#666666]">
                  {subtitle}
                </p>
              ) : null}
              {headerAction ? (
                <div className="mt-3">{headerAction}</div>
              ) : null}
            </>
          )}
        </div>
        <div className={cn(wide && "min-h-0 flex-1 lg:overflow-visible")}>
          {children}
        </div>
          </>
        )}
      </div>
    </div>
  );
}
