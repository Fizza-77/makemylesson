import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-[#1A1C30]">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#1A1C30] placeholder:text-[#666666] focus:border-[#28C2C0] focus:outline-none focus:ring-2 focus:ring-[#28C2C0]/25",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/25",
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
