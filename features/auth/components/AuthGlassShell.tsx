import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/urls";

export function AuthGlassShell({
  children,
  className,
  title,
  subtitle,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A2138] via-[#1E2235] to-[#28C2C0]/30 px-4 py-10">
      <div
        className={cn(
          "mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-8 shadow-xl backdrop-blur",
          className,
        )}
      >
        <div className="mb-6 flex flex-col items-center text-center">
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
        </div>
        {children}
      </div>
    </div>
  );
}
