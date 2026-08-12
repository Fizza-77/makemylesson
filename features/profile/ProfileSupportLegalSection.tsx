"use client";

import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import {
  ProfileCardShell,
  ProfileDialogShell,
} from "@/features/profile/ProfileMenuPrimitives";
import { AppUrls } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { toast } from "@/store/toast-store";

/** Matches web package version; Flutter shows its own build string separately. */
const APP_VERSION = "1.0.1+13";

function HelpHeaderIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M9.8 9.4a2.4 2.4 0 0 1 4.4 1.2c0 1.4-1.4 1.9-2.2 2.4-.5.3-.8.7-.8 1.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(
        "size-5 text-[#28C2C0] transition-colors group-hover:text-red-700",
        className,
      )}
      fill="currentColor"
      aria-hidden
    >
      <path d="M16 13v-2H7V8l-5 4 5 4v-3h9Z" />
      <path d="M20 3h-8v2h8v14h-8v2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M18 16a3 3 0 0 0-2.24 1.04L8.9 13.5a3.1 3.1 0 0 0 0-3L15.76 6.96A3 3 0 1 0 15 5a3 3 0 0 0 .1.7L8.9 9.5a3 3 0 1 0 0 5l6.2 3.8A3 3 0 1 0 18 16Z" />
    </svg>
  );
}

function HelpCardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M9.8 9.4a2.4 2.4 0 0 1 4.4 1.2c0 1.4-1.4 1.9-2.2 2.4-.5.3-.8.7-.8 1.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <path
        d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H10l-4 3.2V6.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <path
        d="M12 3 5 6.2v5.3c0 4.2 2.8 8.1 7 9.5 4.2-1.4 7-5.3 7-9.5V6.2L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <path
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v5h5M9 13h6M9 17h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

async function shareApp() {
  const url = AppUrls.smartLink;
  try {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({
        title: "Make My Lesson",
        text: "Create curriculum-aligned lesson packs with Make My Lesson.",
        url,
      });
      return;
    }
  } catch {
    /* user cancelled or share failed — fall through to clipboard */
  }
  try {
    await navigator.clipboard.writeText(url);
    toast.success("App link copied to clipboard.");
  } catch {
    toast.info(url);
  }
}

function ShelfCard({
  tone,
  heightClass,
  icon,
  title,
  description,
  onClick,
  href,
  external,
}: {
  tone: "teal" | "navy" | "tealLight";
  heightClass: string;
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  href?: string;
  external?: boolean;
}) {
  const className = cn(
    "flex w-full flex-col justify-between rounded-2xl p-3.5 text-left shadow-[0_10px_24px_-14px_rgba(13,20,48,0.45)] transition hover:opacity-95 sm:p-4",
    heightClass,
    tone === "teal" && "bg-[#20AAA7] text-white",
    tone === "navy" &&
      "bg-gradient-to-b from-[#202B52] to-[#0D1430] text-white",
    tone === "tealLight" &&
      "bg-gradient-to-b from-[#9FE3E0] to-[#68D3D0] text-[#0D1430]",
  );

  const body = (
    <>
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-[10px]",
          tone === "tealLight" ? "bg-white/45 text-[#0D1430]" : "bg-white/20 text-white",
        )}
      >
        <span className="flex size-4 items-center justify-center [&>svg]:block [&>svg]:size-4">
          {icon}
        </span>
      </span>
      <span>
        <span className="block text-[13px] leading-tight font-semibold sm:text-sm">
          {title}
        </span>
        <span
          className={cn(
            "mt-1 block text-[11px] leading-snug sm:text-xs",
            tone === "tealLight" ? "text-[#0D1430]/70" : "text-white/75",
          )}
        >
          {description}
        </span>
      </span>
    </>
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
        {body}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {body}
    </button>
  );
}

export function ProfileSupportLegalSection() {
  return (
    <ProfileCardShell
      icon={<HelpHeaderIcon />}
      title="Teacher Resource Shelf"
      description="Support, legal information, and useful account resources."
      badge="Support & Legal"
      className="border-[#D5DCE3] shadow-[0_10px_28px_-16px_rgba(13,20,48,0.12)]"
    >
      <div className="rounded-2xl bg-[#F3F6F8] px-3 pt-8 pb-5 sm:px-5 sm:pt-10 sm:pb-6">
        <div>
          <div className="grid grid-cols-2 items-stretch gap-2 sm:gap-3">
            <div className="flex h-full min-h-0 flex-col gap-2 sm:gap-3">
              <ShelfCard
                tone="teal"
                heightClass="min-h-[7.25rem] flex-1 sm:min-h-[7.75rem]"
                icon={<ShareIcon />}
                title="Share App"
                description="Invite another teacher"
                onClick={() => void shareApp()}
              />
              <ShelfCard
                tone="tealLight"
                heightClass="min-h-[7.25rem] flex-1 sm:min-h-[7.75rem]"
                icon={<ChatIcon />}
                title="Contact Support"
                description="Send us a message"
                href={`mailto:${AppUrls.supportEmail}`}
              />
              <ShelfCard
                tone="tealLight"
                heightClass="min-h-[7.25rem] flex-1 sm:min-h-[7.75rem]"
                icon={<DocIcon />}
                title="Terms of Service"
                description="App terms and conditions"
                href={AppUrls.termsOfService}
                external
              />
            </div>

            <div className="flex h-full min-h-0 flex-col gap-2 sm:gap-3">
              <ShelfCard
                tone="navy"
                heightClass="min-h-0 flex-1"
                icon={<HelpCardIcon />}
                title="Help Centre"
                description="Guides and answers"
                href={`mailto:${AppUrls.helpEmail}`}
              />
              <ShelfCard
                tone="navy"
                heightClass="min-h-0 flex-1"
                icon={<ShieldIcon />}
                title="Privacy Policy"
                description="Data handling policy"
                href={AppUrls.privacyPolicy}
                external
              />
            </div>
          </div>
          <div
            className="mx-1 mt-3 h-3 rounded-full bg-[#0D1430] sm:mx-2 sm:mt-4 sm:h-3.5"
            aria-hidden
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[#E8EEF0] pt-4 text-xs text-[#9AA2A8]">
        <span>Make My Lesson version</span>
        <span className="font-semibold text-[#0D1430]">{APP_VERSION}</span>
      </div>
    </ProfileCardShell>
  );
}

export function ProfileVersionBar() {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#D5DCE3] bg-white px-6 py-3.5 text-xs text-[#9AA2A8]">
      <span>Make My Lesson version</span>
      <span className="font-semibold text-[#0D1430]">{APP_VERSION}</span>
    </div>
  );
}

export function ProfileSignOutButton({
  onSignOut,
  className,
  fullWidth = true,
}: {
  onSignOut: () => void | Promise<void>;
  className?: string;
  fullWidth?: boolean;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    try {
      await onSignOut();
    } finally {
      setBusy(false);
      setConfirmOpen(false);
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "group gap-2 py-2.5 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700",
          fullWidth ? "w-full py-3" : "shrink-0",
          className,
        )}
        onClick={() => setConfirmOpen(true)}
      >
        <LogoutIcon />
        Sign Out
      </Button>

      {confirmOpen ? (
        <ProfileDialogShell
          title="Sign out?"
          onClose={() => setConfirmOpen(false)}
        >
          <p className="text-sm text-[#666666]">
            You will need to sign in again to use your account.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-700 hover:bg-red-800"
              onClick={() => void confirm()}
              isLoading={busy}
            >
              Sign out
            </Button>
          </div>
        </ProfileDialogShell>
      ) : null}
    </>
  );
}
