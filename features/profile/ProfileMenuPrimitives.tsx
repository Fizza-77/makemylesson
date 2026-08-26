"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export function ProfileCardShell({
  icon,
  title,
  description,
  badge,
  children,
  className,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-3xl border border-[#EEF5F5] bg-white shadow-[0_8px_24px_-12px_rgba(13,20,48,0.08)]",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-4 px-5 py-5 sm:px-6">
        <div className="flex min-w-0 items-start gap-3.5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#E7F6F5] text-[#128C89]">
            {icon}
          </span>
          <div className="min-w-0">
            <h2 className="text-[17px] font-semibold text-[#0D1430]">{title}</h2>
            <p className="mt-0.5 text-[13px] text-[#78848D]">{description}</p>
          </div>
        </div>
        {badge ? (
          <span className="hidden shrink-0 rounded-full border border-[#A7E7E4] bg-[#F3FBFA] px-3 py-1 text-xs font-medium text-[#128C89] sm:inline-block">
            {badge}
          </span>
        ) : null}
      </header>
      <div className="border-t border-[#EEF5F5] px-5 py-5 sm:px-6">{children}</div>
    </section>
  );
}

export function ProfileSectionHeader({
  title,
  icon,
}: {
  title: string;
  icon: ReactNode;
}) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E8F8F7] text-[#28C2C0]"
        aria-hidden
      >
        {icon}
      </span>
      <h2 className="text-base font-semibold text-[#1E2235]">{title}</h2>
    </div>
  );
}

export function ProfileMenuRow({
  title,
  subtitle,
  onClick,
  href,
  external,
  trailing,
  danger,
  last,
}: {
  title: string;
  subtitle?: string;
  onClick?: () => void;
  href?: string;
  external?: boolean;
  trailing?: ReactNode;
  danger?: boolean;
  last?: boolean;
}) {
  const content = (
    <>
      <div className="min-w-0 flex-1 text-left">
        <p
          className={cn(
            "text-sm font-medium",
            danger ? "text-red-700" : "text-[#1A1C30]",
          )}
        >
          {title}
        </p>
        {subtitle ? (
          <p className="mt-0.5 text-xs leading-snug text-[#666666]">{subtitle}</p>
        ) : null}
      </div>
      {trailing ?? (
        <ChevronRight className={danger ? "text-red-700" : "text-[#9CA3AF]"} />
      )}
    </>
  );

  const className = cn(
    "flex w-full items-center gap-3 py-3.5 transition-colors",
    !last && "border-b border-[#E5E7EB]",
    "hover:bg-[#F9FAFB]",
  );

  if (href) {
    return (
      <a
        href={href}
        className={className}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={cn("size-5 shrink-0", className)}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={cn("size-4 shrink-0 text-[#9CA3AF]", className)}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function ProfileDialogShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative z-[1] w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3
            id="profile-dialog-title"
            className="text-base font-semibold text-[#1A1C30]"
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#666666] hover:bg-[#F5F6FA]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function ProfileToggleSwitch({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full p-0.5 transition",
        checked ? "bg-[#20AAA7]" : "bg-[#DDE6E8]",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <span
        className={cn(
          "block size-5 rounded-full bg-white shadow transition",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}
