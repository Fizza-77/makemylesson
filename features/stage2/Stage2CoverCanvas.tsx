"use client";

import { stage2ThemeById } from "@/data/stage2-themes";
import { cn } from "@/lib/utils";

export type Stage2CoverData = {
  topic: string;
  grade: string;
  subject: string;
  curriculum: string;
  schoolName?: string | null;
  teacherName?: string | null;
  schoolLogoUrl?: string | null;
  ownPictureUrl?: string | null;
};

export function Stage2CoverCanvas({
  data,
  themeId,
  totalSlides,
  className,
  fill,
}: {
  data: Stage2CoverData;
  themeId: string;
  totalSlides: number;
  className?: string;
  fill?: boolean;
}) {
  const theme = stage2ThemeById(themeId);
  const school = data.schoolName?.trim() || "";
  const teacher = data.teacherName?.trim() || "";
  const logo = data.schoolLogoUrl?.trim() || "";
  const photo = data.ownPictureUrl?.trim() || "";
  const topic = data.topic.trim() || "Lesson presentation";
  const meta = [data.grade, data.subject, data.curriculum]
    .map((v) => v.trim())
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      className={cn(className)}
      style={{
        ...(fill
          ? { width: "100%", height: "100%", borderRadius: 0 }
          : { aspectRatio: "16 / 9", borderRadius: 16 }),
        background: `linear-gradient(135deg, ${theme.backgroundGradient[0]} 0%, ${theme.backgroundGradient[1]} 55%, ${theme.backgroundGradient[2]} 100%)`,
        color: theme.bodyColor,
        overflow: "hidden",
        border: fill
          ? "none"
          : theme.isLight
            ? "1px solid #E5E7EB"
            : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="relative flex h-full min-h-0 flex-col px-5 py-4 sm:px-7 sm:py-5">
        <div
          className="pointer-events-none absolute -top-10 -right-8 size-36 rounded-full opacity-30 blur-2xl"
          style={{ background: theme.accentPrimary }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-10 size-40 rounded-full opacity-20 blur-2xl"
          style={{ background: theme.accentSecondary }}
          aria-hidden
        />

        <div className="relative z-[1] flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className="text-[10px] font-semibold tracking-[0.14em] uppercase sm:text-[11px]"
              style={{ color: theme.mutedColor }}
            >
              Cover slide
            </p>
            {logo || photo ? (
              <div className="mt-2 flex items-center gap-2">
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo}
                    alt=""
                    className="size-8 rounded-full object-cover sm:size-9"
                    style={{
                      border: `1px solid ${theme.isLight ? "#E5E7EB" : "rgba(255,255,255,0.2)"}`,
                    }}
                  />
                ) : null}
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo}
                    alt=""
                    className="size-8 rounded-full object-cover sm:size-9"
                    style={{
                      border: `1px solid ${theme.isLight ? "#E5E7EB" : "rgba(255,255,255,0.2)"}`,
                    }}
                  />
                ) : null}
              </div>
            ) : null}
            {school ? (
              <p
                className="mt-1 truncate text-sm font-semibold sm:text-base"
                style={{ color: theme.titleColor }}
              >
                {school}
              </p>
            ) : null}
          </div>
          {teacher ? (
            <p
              className="max-w-[40%] truncate text-right text-xs font-medium sm:text-sm"
              style={{ color: theme.mutedColor }}
            >
              {teacher}
            </p>
          ) : null}
        </div>

        <div className="relative z-[1] flex flex-1 flex-col items-center justify-center px-2 text-center">
          <span
            className="mb-3 h-1.5 w-12 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
            }}
            aria-hidden
          />
          <h3
            className="max-w-[22ch] text-xl font-bold leading-tight sm:text-2xl md:text-3xl"
            style={{ color: theme.titleColor }}
          >
            {topic}
          </h3>
          {meta ? (
            <p
              className="mt-3 max-w-[36ch] text-xs leading-snug sm:text-sm"
              style={{ color: theme.mutedColor }}
            >
              {meta}
            </p>
          ) : null}
        </div>

        <p
          className="relative z-[1] text-center text-[10px] font-semibold tracking-[0.12em] uppercase"
          style={{ color: theme.mutedColor }}
        >
          Slide 1 of {totalSlides}
        </p>
      </div>
    </div>
  );
}


