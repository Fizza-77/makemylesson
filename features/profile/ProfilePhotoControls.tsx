"use client";

import { useCallback, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

import { Button } from "@/components/ui/Button";
import { ProfileDialogShell } from "@/features/profile/ProfileMenuPrimitives";
import { getCroppedImageBlob } from "@/lib/crop-image";
import {
  avatarDataUrlForSeed,
  avatarSeedsForUser,
  pickRandomAvatarSeed,
} from "@/lib/profile-avatar";
import { cn } from "@/lib/utils";
import {
  removeProfilePhoto,
  setRandomAvatar,
  uploadAndSetProfilePhoto,
  type UserAccountView,
} from "@/services/user-account.service";
import { toast } from "@/store/toast-store";

type Step = "closed" | "options" | "avatars" | "crop";

export function ProfilePhotoControls({ account }: { account: UserAccountView }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("closed");
  const [busy, setBusy] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropFileName, setCropFileName] = useState("profile.jpg");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const hasPhoto = Boolean(account.profilePhotoUrl?.trim());
  const seeds = avatarSeedsForUser(account.uid);

  const closeAll = useCallback(() => {
    setStep("closed");
    setCropSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  }, []);

  async function uploadCroppedBlob(blob: Blob, fileName: string) {
    setBusy(true);
    try {
      await uploadAndSetProfilePhoto(account.uid, blob, fileName);
      toast.success("Profile photo updated.");
      closeAll();
    } catch {
      toast.error("Could not update profile photo.");
    } finally {
      setBusy(false);
    }
  }

  function onFileChosen(file: File | null) {
    if (!file) return;
    setCropFileName(file.name);
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    setStep("crop");
  }

  async function confirmCrop() {
    if (!cropSrc || !croppedAreaPixels) return;
    try {
      const blob = await getCroppedImageBlob(cropSrc, croppedAreaPixels);
      await uploadCroppedBlob(blob, cropFileName);
    } catch {
      toast.error("Could not crop profile photo.");
    }
  }

  async function cropExistingPhoto() {
    if (!account.profilePhotoUrl) return;
    setBusy(true);
    try {
      const res = await fetch(account.profilePhotoUrl);
      const blob = await res.blob();
      setCropFileName(account.ownPicName ?? "profile.jpg");
      setCropSrc(URL.createObjectURL(blob));
      setStep("crop");
    } catch {
      toast.error("Could not load photo for cropping.");
    } finally {
      setBusy(false);
    }
  }

  async function applyAvatarSeed(seed: string) {
    setBusy(true);
    try {
      await setRandomAvatar(account.uid, seed);
      toast.success("Avatar updated.");
      closeAll();
    } catch {
      toast.error("Could not update avatar.");
    } finally {
      setBusy(false);
    }
  }

  async function pickRandomAvatar() {
    await applyAvatarSeed(pickRandomAvatarSeed(account.uid));
  }

  async function deletePhoto() {
    setBusy(true);
    try {
      await removeProfilePhoto(account.uid);
      toast.success("Profile photo removed.");
      closeAll();
    } catch {
      toast.error("Could not remove profile photo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="text-sm"
        onClick={() => setStep("options")}
      >
        {hasPhoto ? "Change photo" : "Add photo"}
      </Button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onFileChosen(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />

      {step === "options" ? (
        <ProfileDialogShell title="Profile photo" onClose={closeAll}>
          <ul className="divide-y divide-[#E5E7EB] rounded-xl border border-[#E5E7EB]">
            <li>
              <button
                type="button"
                className="flex w-full flex-col items-start px-4 py-3 text-left hover:bg-[#F9FAFB]"
                onClick={() => fileRef.current?.click()}
              >
                <span className="text-sm font-medium text-[#1A1C30]">
                  {hasPhoto ? "Update image" : "Add image"}
                </span>
                <span className="text-xs text-[#666666]">
                  Choose from your device, then crop to a square
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="flex w-full flex-col items-start px-4 py-3 text-left hover:bg-[#F9FAFB]"
                onClick={() => setStep("avatars")}
              >
                <span className="text-sm font-medium text-[#1A1C30]">
                  Use avatar
                </span>
                <span className="text-xs text-[#666666]">
                  Pick a random avatar from the gallery
                </span>
              </button>
            </li>
            {hasPhoto && account.avatarSource === "photo" ? (
              <li>
                <button
                  type="button"
                  className="flex w-full flex-col items-start px-4 py-3 text-left hover:bg-[#F9FAFB]"
                  onClick={() => void cropExistingPhoto()}
                  disabled={busy}
                >
                  <span className="text-sm font-medium text-[#1A1C30]">
                    Crop image
                  </span>
                  <span className="text-xs text-[#666666]">
                    Adjust your current profile photo
                  </span>
                </button>
              </li>
            ) : null}
            {hasPhoto ? (
              <li>
                <button
                  type="button"
                  className="flex w-full flex-col items-start px-4 py-3 text-left hover:bg-[#F9FAFB]"
                  onClick={() => void deletePhoto()}
                  disabled={busy}
                >
                  <span className="text-sm font-medium text-red-700">
                    Delete image (use avatar)
                  </span>
                  <span className="text-xs text-[#666666]">
                    Remove your uploaded photo
                  </span>
                </button>
              </li>
            ) : null}
          </ul>
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" onClick={closeAll}>
              Cancel
            </Button>
          </div>
        </ProfileDialogShell>
      ) : null}

      {step === "avatars" ? (
        <ProfileDialogShell title="Choose an avatar" onClose={() => setStep("options")}>
          <div className="mb-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="px-3 py-1.5 text-xs"
              onClick={() => void pickRandomAvatar()}
              isLoading={busy}
            >
              Pick random avatar
            </Button>
          </div>
          <div className="grid max-h-[min(50vh,360px)] grid-cols-4 gap-3 overflow-y-auto sm:grid-cols-6">
            {seeds.map((seed) => (
              <button
                key={seed}
                type="button"
                disabled={busy}
                className={cn(
                  "overflow-hidden rounded-full border-2 border-transparent bg-[#E8F8F7] p-0.5 transition hover:border-[#28C2C0]",
                  account.avatarSeed === seed && "border-[#28C2C0]",
                )}
                onClick={() => void applyAvatarSeed(seed)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarDataUrlForSeed(seed)}
                  alt=""
                  className="size-12 rounded-full sm:size-14"
                />
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setStep("options")}>
              Back
            </Button>
            <Button variant="ghost" onClick={closeAll}>
              Cancel
            </Button>
          </div>
        </ProfileDialogShell>
      ) : null}

      {step === "crop" && cropSrc ? (
        <ProfileDialogShell title="Crop photo" onClose={closeAll}>
          <div className="relative h-64 w-full overflow-hidden rounded-xl bg-[#1A1C30]/5">
            <Cropper
              image={cropSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, area) => setCroppedAreaPixels(area)}
            />
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm text-[#666666]">
            Zoom
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1"
            />
          </label>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={closeAll}>
              Cancel
            </Button>
            <Button onClick={() => void confirmCrop()} isLoading={busy}>
              Save
            </Button>
          </div>
        </ProfileDialogShell>
      ) : null}
    </>
  );
}
