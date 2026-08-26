"use client";

import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  error?: string;
  labelClassName?: string;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, labelClassName, error, id, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const generatedId = useId();
    const inputId = id ?? props.name ?? generatedId;

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
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            className={cn(
              "w-full rounded-md border border-[#E5E7EB] bg-white py-1.5 pl-2.5 text-[11px] text-[#1A1C30] placeholder:text-[#666666] focus:border-[#28C2C0] focus:outline-none focus:ring-2 focus:ring-[#28C2C0]/25 lg:rounded-xl lg:py-3.5 lg:pl-5 lg:text-base",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/25",
              className,
              // Keep space for the eye toggle even if callers pass `px-*`.
              "pr-9 lg:pr-11",
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#1A1C30] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#28C2C0]/40 lg:right-3 lg:size-8"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
          >
            {visible ? (
              <EyeOff className="size-4 lg:size-[18px]" aria-hidden />
            ) : (
              <Eye className="size-4 lg:size-[18px]" aria-hidden />
            )}
          </button>
        </div>
        {error ? (
          <p className="text-[10px] text-red-600 lg:text-sm" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
