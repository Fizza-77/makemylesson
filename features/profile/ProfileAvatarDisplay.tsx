"use client";

import Image from "next/image";

import { avatarDataUrlForSeed } from "@/lib/profile-avatar";
import { cn } from "@/lib/utils";
import type { UserAccountView } from "@/services/user-account.service";

export function ProfileAvatarDisplay({
  account,
  sizeClass = "size-20",
  className,
}: {
  account: UserAccountView;
  sizeClass?: string;
  className?: string;
}) {
  const { avatarSource, avatarSeed, profilePhotoUrl, displayName } = account;

  if (avatarSource === "random" && avatarSeed?.trim()) {
    const src = avatarDataUrlForSeed(avatarSeed.trim());
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full bg-[#E8F8F7]",
          sizeClass,
          className,
        )}
      >
        <Image src={src} alt="" fill className="object-cover" unoptimized />
      </div>
    );
  }

  if (profilePhotoUrl?.trim()) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full bg-[#E8F8F7]",
          sizeClass,
          className,
        )}
      >
        <Image
          src={profilePhotoUrl}
          alt=""
          fill
          className="object-cover"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8F8F7] text-2xl font-bold text-[#28C2C0]",
        sizeClass,
        className,
      )}
    >
      {displayName.slice(0, 1).toUpperCase()}
    </div>
  );
}

export function accountHasUploadedPhoto(account: UserAccountView): boolean {
  return Boolean(account.profilePhotoUrl?.trim() && account.avatarSource === "photo");
}


