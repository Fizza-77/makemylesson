import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  labelClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, labelClassName, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-0.5 lg:gap-2">
        {label ? (
          <label
            htmlFor={inputId}
            className={cn(
              "text-[11px] font-medium leading-tight text-[#1A1C30] lg:text-base",
              labelClassName,
            )}
          >
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-[11px] text-[#1A1C30] placeholder:text-[#666666] focus:border-[#28C2C0] focus:outline-none focus:ring-2 focus:ring-[#28C2C0]/25 lg:rounded-xl lg:px-5 lg:py-3.5 lg:text-base",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/25",
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="text-[10px] text-red-600 lg:text-sm" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
