"use client";

import { stage2ThemeById, type Stage2SlideTheme } from "@/data/stage2-themes";
import { plainMarkdown } from "@/services/document-export-core";
import {
  stage2SlideExpectsImage,
  type Stage2Slide,
} from "@/types/stage2";

function themeGradient(theme: Stage2SlideTheme): string {
  const [a, b, c] = theme.backgroundGradient;
  return `linear-gradient(135deg, ${a} 0%, ${b} 55%, ${c} 100%)`;
}

export function Stage2SlideCanvas({
  slide,
  themeId,
  className,
  fill,
}: {
  slide: Stage2Slide;
  themeId: string;
  className?: string;
  /** Fill parent bounds (e.g. slidemonitor screen) instead of 16:9. */
  fill?: boolean;
}) {
  const theme = stage2ThemeById(themeId);
  const expectsImage = stage2SlideExpectsImage(slide);
  const imageSrc =
    slide.imageUrl.trim() ||
    (slide.imageDataUrl.trim().startsWith("data:")
      ? slide.imageDataUrl.trim()
      : "");
  const imageStatus = slide.imageStatus.trim().toLowerCase();

  return (
    <div
      className={className}
      style={{
        ...(fill
          ? { width: "100%", height: "100%", borderRadius: 0 }
          : { aspectRatio: "16 / 9", borderRadius: 16 }),
        background: themeGradient(theme),
        color: theme.bodyColor,
        overflow: "hidden",
        border: fill
          ? "none"
          : theme.isLight
            ? "1px solid #E5E7EB"
            : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex h-full min-h-0 flex-col p-4 sm:p-6">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span
            className="text-[10px] font-semibold uppercase tracking-wider sm:text-xs"
            style={{ color: theme.mutedColor }}
          >
            {slide.slideType || `Slide ${slide.slideNumber}`}
          </span>
          <span
            className="text-[10px] sm:text-xs"
            style={{ color: theme.mutedColor }}
          >
            {slide.estimatedTimeMinutes} min
          </span>
        </div>

        <h3
          className="mb-3 text-base font-bold leading-snug sm:text-xl"
          style={{ color: theme.titleColor }}
        >
          {plainMarkdown(slide.slideTitle) || `Slide ${slide.slideNumber}`}
        </h3>

        <div className="flex min-h-0 flex-1 flex-col gap-3 sm:flex-row">
          <ul className="min-w-0 flex-1 space-y-1.5 overflow-y-auto text-xs [-ms-overflow-style:none] [scrollbar-width:none] sm:text-sm [&::-webkit-scrollbar]:hidden">
            {slide.slideContent
              .filter((l) => l.trim())
              .map((line, i) => (
                <li key={i} className="flex gap-2">
                  <span style={{ color: theme.accentPrimary }}>•</span>
                  <span style={{ color: theme.bodyColor }}>
                    {plainMarkdown(line)}
                  </span>
                </li>
              ))}
          </ul>

          {expectsImage ? (
            <div
              className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl sm:aspect-auto sm:h-full sm:w-[42%]"
              style={{ background: theme.overlayPanelColor }}
            >
              {imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element -- remote Storage URLs vary
                <img
                  src={imageSrc}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-full min-h-[88px] flex-col items-center justify-center gap-1 px-3 text-center text-[11px] sm:text-xs"
                  style={{ color: theme.mutedColor }}
                >
                  {imageStatus === "failed" ? (
                    <>
                      <span style={{ color: theme.accentSecondary }}>
                        Image failed
                      </span>
                      <span className="line-clamp-3">
                        {slide.imageError || "Could not generate image"}
                      </span>
                    </>
                  ) : (
                    <span>Generating image…</span>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}


