"use client";

import { useEffect, useRef, useState } from "react";

import {
  STAGE_TIPS,
  stageTipsContext,
  type StageSidebarContext,
} from "@/data/stage-tips";
import { cn } from "@/lib/utils";

function TipCheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="mt-0.5 size-3.5 shrink-0" fill="none" aria-hidden>
      <path
        d="M3.2 8.2 6.3 11.2 12.8 4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Tips content — sits inside its own sidebar card; slides scroll horizontally. */
export function TipsResourcesCard({
  stage,
  context,
  className,
}: {
  stage?: number;
  context?: StageSidebarContext;
  className?: string;
}) {
  const resolved = context ?? stageTipsContext(stage ?? 1);
  const slides = STAGE_TIPS[resolved].slides;
  const [index, setIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIndex(0);
    const el = scrollerRef.current;
    if (el) el.scrollTo({ left: 0, behavior: "auto" });
  }, [resolved]);

  function scrollToIndex(next: number) {
    const el = scrollerRef.current;
    if (!el) return;
    const width = el.clientWidth;
    el.scrollTo({ left: next * width, behavior: "smooth" });
    setIndex(next);
  }

  function onScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    const width = el.clientWidth || 1;
    const next = Math.round(el.scrollLeft / width);
    setIndex(Math.max(0, Math.min(slides.length - 1, next)));
  }

  return (
    <section
      className={cn("bg-transparent", className)}
      aria-label="Tips and resources"
      aria-roledescription="carousel"
    >
      <p className="text-[10px] font-semibold tracking-wide text-[#28C2C0] uppercase">
        Tips & resources
      </p>

      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="mt-2.5 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => {
          const bullets =
            slide.bullets && slide.bullets.length > 0
              ? slide.bullets
              : slide.footer
                ? [slide.footer]
                : [];

          return (
            <article
              key={`${resolved}-${i}`}
              className="w-full min-w-full shrink-0 basis-full snap-center snap-always px-0.5"
              aria-label={`Tip ${i + 1} of ${slides.length}`}
              aria-hidden={i !== index}
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-base font-bold text-[#151B35]">
                  {slide.title}
                </h2>
                {slide.badge ? (
                  <span className="shrink-0 rounded-md border border-[#28C2C0]/70 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#28C2C0] uppercase">
                    {slide.badge}
                  </span>
                ) : null}
              </div>

              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {slide.body}
              </p>

              {bullets.length > 0 ? (
                <ul className="mt-3 space-y-2.5 border-t border-slate-200 pt-3">
                  {bullets.map((line, bi) => (
                    <li key={bi} className="flex items-start gap-2">
                      <span className="text-[#28C2C0]">
                        <TipCheckIcon />
                      </span>
                      <p className="text-xs leading-relaxed text-slate-500">
                        {line}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>

      {slides.length > 1 ? (
        <div className="mt-3.5 flex items-center justify-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Tip ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => scrollToIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index
                  ? "w-5 bg-teal-400"
                  : "w-1.5 bg-slate-300/80 hover:bg-slate-400",
              )}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
