"use client";

import Link from "next/link";

import { ROUTES } from "@/lib/urls";
import { useAccountStore } from "@/store/account-store";

/** Reminder to enable branding toggles used in AI / exports. */
export function PersonalizationBanner() {
  const account = useAccountStore((s) => s.account);
  if (!account) return null;

  const missing: string[] = [];
  if (!account.useSchoolNameInAi || !account.schoolName?.trim()) {
    missing.push("school name");
  }
  if (!account.useSchoolLogoInAi || !account.schoolLogoUrl) {
    missing.push("school logo");
  }
  if (!account.useOwnPicInAi || !account.profilePhotoUrl) {
    missing.push("teacher photo");
  }

  if (missing.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#E8F8F7] bg-[#F5FBFB] px-3 py-2.5 text-xs leading-relaxed text-[#1A1C30]">
      Personalize exports with your{" "}
      <span className="font-semibold">{missing.join(", ")}</span>.{" "}
      <Link
        href={ROUTES.profile}
        className="font-semibold text-[#28C2C0] hover:underline"
      >
        Update profile
      </Link>
    </div>
  );
}


