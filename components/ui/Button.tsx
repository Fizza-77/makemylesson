import { type ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[#28C2C0] text-white hover:bg-[#3DC0BF] disabled:opacity-50 shadow-sm",
  secondary: "bg-[#1E2235] text-white hover:bg-[#1A2138] disabled:opacity-50",
  ghost: "bg-transparent text-[#1A1C30] hover:bg-[#F5F6FA]",
  outline:
    "border border-[#E5E7EB] bg-white text-[#1A1C30] hover:bg-[#F5F6FA]",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  isLoading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#28C2C0] lg:rounded-xl lg:px-6 lg:py-3.5 lg:text-base",
          variantClasses[variant],
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span
            className={cn(
              "size-4 animate-spin rounded-full border-2",
              variant === "outline" || variant === "ghost"
                ? "border-[#28C2C0]/25 border-t-[#28C2C0]"
                : "border-white/30 border-t-white",
            )}
            aria-hidden
          />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";


