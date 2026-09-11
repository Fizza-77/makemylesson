"use client";

import { STAGE2_THEMES, type Stage2SlideTheme } from "@/data/stage2-themes";
import { cn } from "@/lib/utils";

function themeGradient(theme: Stage2SlideTheme): string {
  const [a, b, c] = theme.backgroundGradient;
  return `linear-gradient(135deg, ${a} 0%, ${b} 50%, ${c} 100%)`;
}

export function Stage2ThemeGallery({
  themeId,
  disabled,
  onSelect,
}: {
  themeId: string;
  disabled?: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-[#1A1C30]">Slide theme</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {STAGE2_THEMES.map((theme) => {
          const isActive = theme.id === themeId;
          return (
            <button
              key={theme.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(theme.id)}
              aria-pressed={isActive}
              aria-label={theme.name}
              className={cn(
                "group text-left outline-none transition duration-200",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "focus-visible:ring-2 focus-visible:ring-[#28C2C0] focus-visible:ring-offset-2",
              )}
            >
              <div
                className={cn(
                  "aspect-[16/10] overflow-hidden rounded-lg transition duration-200",
                  isActive
                    ? "ring-2 ring-[#28C2C0] ring-offset-2"
                    : "ring-1 ring-[#E5E7EB] group-hover:ring-[#28C2C0]/50",
                )}
                style={{ background: themeGradient(theme) }}
              >
                <div className="flex h-full flex-col justify-between p-3">
                  <span
                    className="h-0.5 w-6 rounded-full"
                    style={{ background: theme.accentPrimary }}
                  />
                  <div>
                    <span
                      className="block text-[11px] font-semibold tracking-tight"
                      style={{ color: theme.titleColor }}
                    >
                      {theme.name}
                    </span>
                    <span
                      className={cn(
                        "mt-1 block overflow-hidden text-[10px] leading-snug transition-all duration-200",
                        isActive
                          ? "max-h-12 opacity-90"
                          : "max-h-0 opacity-0 group-hover:max-h-12 group-hover:opacity-90 group-focus-visible:max-h-12 group-focus-visible:opacity-90",
                      )}
                      style={{ color: theme.mutedColor }}
                    >
                      {theme.tagline}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}


