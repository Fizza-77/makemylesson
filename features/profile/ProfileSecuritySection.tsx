"use client";

import { useRef, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ProfileCardShell,
  ProfileDialogShell,
} from "@/features/profile/ProfileMenuPrimitives";
import { mapFirebaseAuthError, mapFunctionsError } from "@/lib/auth-errors";
import { authLog } from "@/lib/auth-logger";
import { passwordStrengthIssues } from "@/lib/auth-validation";
import { cn } from "@/lib/utils";
import {
  completeEmailChangeVerification,
  deleteAccountAndData,
  updateAccountEmail,
  updateAccountPassword,
} from "@/services/account-security.service";
import {
  updateDisplayName,
  updateUserProfileFields,
  uploadAndSetSchoolLogo,
  type UserAccountView,
} from "@/services/user-account.service";
import { toast } from "@/store/toast-store";

type Dialog =
  | "name"
  | "password"
  | "email"
  | "school"
  | "delete"
  | null;

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
      <rect
        x="5"
        y="10"
        width="14"
        height="11"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 10V7.5a4 4 0 0 1 8 0V10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={cn("size-4", className)}
      fill="currentColor"
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

function UserRowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5.5 18.5c1.4-2.4 3.6-3.6 6.5-3.6s5.1 1.2 6.5 3.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <rect
        x="5"
        y="10"
        width="14"
        height="11"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 10V7.5a4 4 0 0 1 8 0V10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SchoolIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5.5v-5.5h-3V21H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="8.5" cy="10" r="1.4" fill="currentColor" />
      <path
        d="m7 16 3.2-3.2a1 1 0 0 1 1.3 0L14 15l1.4-1.4a1 1 0 0 1 1.3 0L19 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <path
        d="M9 4h6M5 7h14M8 7l.8 12.2A1.5 1.5 0 0 0 10.3 20.5h3.4a1.5 1.5 0 0 0 1.5-1.3L16 7M10 11v6M14 11v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function fileNameFromUrl(url: string | null, fallback: string | null): string {
  if (fallback?.trim()) return fallback.trim();
  if (!url?.trim()) return "not available";
  const cleaned = url.split("?")[0]?.replace(/\\/g, "/") ?? url;
  const idx = cleaned.lastIndexOf("/");
  if (idx < 0 || idx === cleaned.length - 1) return cleaned;
  return cleaned.slice(idx + 1);
}

function LockerRow({
  icon,
  title,
  description,
  danger,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-2xl border px-4 py-4 text-left transition",
        danger
          ? "border-[rgba(232,120,120,0.35)] bg-white/5 hover:bg-white/[0.08]"
          : "border-white/10 bg-white/5 hover:bg-white/[0.08]",
      )}
    >
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl",
          danger ? "bg-[#E88787] text-white" : "bg-[#20AAA7] text-black",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="mt-0.5 block text-xs leading-snug text-white/55">
          {description}
        </span>
      </span>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#12182E] text-white">
        {danger ? <TrashIcon /> : <ChevronIcon className="size-3.5" />}
      </span>
    </button>
  );
}

export function ProfileSecuritySection({
  account,
  onSignedOutAfterDelete,
}: {
  account: UserAccountView;
  onSignedOutAfterDelete: () => void | Promise<void>;
}) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [busy, setBusy] = useState(false);

  const [nameDraft, setNameDraft] = useState(account.displayName);
  const [schoolDraft, setSchoolDraft] = useState(account.schoolName ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);

  const hasSchoolName = Boolean(account.schoolName?.trim());
  const hasSchoolLogo = Boolean(account.schoolLogoUrl?.trim());
  const schoolLogoFileName = fileNameFromUrl(
    account.schoolLogoUrl,
    account.schoolLogoName,
  );

  function openDialog(next: Dialog) {
    setNameDraft(account.displayName);
    setSchoolDraft(account.schoolName ?? "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setNewEmail("");
    setEmailOtp("");
    setEmailOtpSent(false);
    setDialog(next);
  }

  async function saveName() {
    setBusy(true);
    try {
      await updateDisplayName(account.uid, nameDraft);
      toast.success("Name updated.");
      setDialog(null);
    } catch (e) {
      authLog.error("profile.name_failed", e);
      toast.error(e instanceof Error ? e.message : "Could not update name.");
    } finally {
      setBusy(false);
    }
  }

  async function saveSchoolName() {
    setBusy(true);
    try {
      const schoolName = schoolDraft.trim() || null;
      await updateUserProfileFields(account.uid, {
        schoolName,
        ...(schoolName ? {} : { useSchoolNameInAi: false }),
      });
      toast.success(schoolName ? "School name saved." : "School name cleared.");
      setDialog(null);
    } catch (e) {
      authLog.error("profile.school_name_failed", e);
      toast.error(
        e instanceof Error ? e.message : "Could not save school name.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function onSchoolLogo(file: File | null) {
    if (!file) return;
    setBusy(true);
    try {
      await uploadAndSetSchoolLogo(account.uid, file);
      toast.success("School logo updated.");
    } catch (e) {
      authLog.error("profile.school_logo_failed", e);
      toast.error("Could not update school logo.");
    } finally {
      setBusy(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  }

  async function savePassword() {
    const strength = passwordStrengthIssues(newPassword);
    if (strength) {
      toast.error(strength);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match. Please check and try again.");
      return;
    }
    setBusy(true);
    try {
      await updateAccountPassword({ currentPassword, newPassword });
      toast.success("Password updated.");
      setDialog(null);
    } catch (e) {
      authLog.error("password_change.failed", e);
      toast.error(mapFirebaseAuthError(e));
    } finally {
      setBusy(false);
    }
  }

  async function startEmailChange() {
    setBusy(true);
    try {
      await updateAccountEmail({ currentPassword, newEmail });
      setEmailOtpSent(true);
      toast.success("Verification code sent to your new email.");
    } catch (e) {
      authLog.error("email_change.start_failed", e);
      toast.error(mapFunctionsError(e) || mapFirebaseAuthError(e));
    } finally {
      setBusy(false);
    }
  }

  async function completeEmailChange() {
    setBusy(true);
    try {
      await completeEmailChangeVerification({ newEmail, otp: emailOtp });
      toast.success("Email updated. Please sign in again with your new email.");
      setDialog(null);
      await onSignedOutAfterDelete();
    } catch (e) {
      authLog.error("email_change.verify_failed", e);
      toast.error(mapFunctionsError(e));
    } finally {
      setBusy(false);
    }
  }

  async function deleteAccount() {
    if (!currentPassword.trim()) {
      toast.info("Enter your password to confirm account deletion.");
      return;
    }
    setBusy(true);
    try {
      await deleteAccountAndData(currentPassword);
      toast.success(
        "Your account has been deleted. We're sorry to see you go.",
      );
      setDialog(null);
      await onSignedOutAfterDelete();
    } catch (e) {
      authLog.error("account_delete.failed", e);
      const isFn =
        typeof e === "object" &&
        e !== null &&
        "code" in e &&
        String((e as { code?: string }).code ?? "").startsWith("functions/");
      toast.error(
        isFn
          ? mapFunctionsError(e)
          : mapFirebaseAuthError(e) ||
              "Could not delete account right now. Please verify your password and try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <ProfileCardShell
      icon={<LockIcon />}
      title="Security Locker"
      description="Account information, identity fields, and profile security."
      badge="Secure"
      className="border-[#D5DCE3] shadow-[0_10px_28px_-16px_rgba(13,20,48,0.12)]"
    >
      <div className="rounded-2xl bg-[#0D1430] p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <LockerRow
            icon={<UserRowIcon />}
            title="Change Name"
            description="Update how your name appears in the app."
            onClick={() => openDialog("name")}
          />
          <LockerRow
            icon={<KeyIcon />}
            title="Change Password"
            description="Update your current password."
            onClick={() => openDialog("password")}
          />
          <LockerRow
            icon={<MailIcon />}
            title="Change Email Address"
            description="Verification email will be sent to your new address."
            onClick={() => openDialog("email")}
          />
          <LockerRow
            icon={<SchoolIcon />}
            title={hasSchoolName ? "Change School Name" : "Add School Name"}
            description={
              hasSchoolName
                ? `Current: ${account.schoolName!.trim()}`
                : "Optional profile field for AI content personalization."
            }
            onClick={() => openDialog("school")}
          />
          <LockerRow
            icon={<ImageIcon />}
            title={hasSchoolLogo ? "Change School Logo" : "Add School Logo"}
            description={
              hasSchoolLogo
                ? `Current file: ${schoolLogoFileName}`
                : "Optional profile field used in AI exports."
            }
            onClick={() => logoInputRef.current?.click()}
          />
          <LockerRow
            icon={<TrashIcon />}
            title="Delete Account"
            description="Permanently remove your account and lesson data."
            danger
            onClick={() => openDialog("delete")}
          />
        </div>
      </div>

      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void onSchoolLogo(e.target.files?.[0] ?? null)}
      />

      {dialog === "name" ? (
        <ProfileDialogShell
          title="How your name appears"
          onClose={() => setDialog(null)}
        >
          <Input
            label="Your name"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            autoComplete="name"
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button onClick={saveName} isLoading={busy}>
              Save
            </Button>
          </div>
        </ProfileDialogShell>
      ) : null}

      {dialog === "school" ? (
        <ProfileDialogShell title="School name" onClose={() => setDialog(null)}>
          <Input
            label="School name"
            value={schoolDraft}
            onChange={(e) => setSchoolDraft(e.target.value)}
            autoComplete="organization"
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button onClick={saveSchoolName} isLoading={busy}>
              Save
            </Button>
          </div>
        </ProfileDialogShell>
      ) : null}

      {dialog === "password" ? (
        <ProfileDialogShell
          title="Change password"
          onClose={() => setDialog(null)}
        >
          <div className="space-y-3">
            <Input
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Input
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            <Input
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button onClick={savePassword} isLoading={busy}>
              Save password
            </Button>
          </div>
        </ProfileDialogShell>
      ) : null}

      {dialog === "email" ? (
        <ProfileDialogShell title="Change email" onClose={() => setDialog(null)}>
          {!emailOtpSent ? (
            <div className="space-y-3">
              <Input
                label="Current password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
              <Input
                label="New email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                autoComplete="email"
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="ghost" onClick={() => setDialog(null)}>
                  Cancel
                </Button>
                <Button onClick={startEmailChange} isLoading={busy}>
                  Send verification code
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                label="Verification code"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setDialog(null)}>
                  Cancel
                </Button>
                <Button onClick={completeEmailChange} isLoading={busy}>
                  Confirm new email
                </Button>
              </div>
            </div>
          )}
        </ProfileDialogShell>
      ) : null}

      {dialog === "delete" ? (
        <ProfileDialogShell
          title="Delete account"
          onClose={() => setDialog(null)}
        >
          <div>
            <Input
              label="Confirm with password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button
              className="bg-red-700 hover:bg-red-800"
              onClick={deleteAccount}
              isLoading={busy}
            >
              Delete permanently
            </Button>
          </div>
        </ProfileDialogShell>
      ) : null}
    </ProfileCardShell>
  );
}
