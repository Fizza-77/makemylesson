import type { UserAccountView } from "@/services/user-account.service";

/**
 * Export branding from profile toggles (Use School Name / Logo / OwnPic).
 * Mirrors Flutter `ExportPersonalizationService.resolveFromProfile` —
 * images are loaded from Storage/HTTP URLs on the client (no dedicated CF).
 */

export type ExportPersonalization = {
  teacherName: string | null;
  schoolName: string | null;
  includeSchoolLogo: boolean;
  includeOwnPicture: boolean;
  schoolLogoDataUrl: string | null;
  ownPictureDataUrl: string | null;
};

export function emptyExportPersonalization(): ExportPersonalization {
  return {
    teacherName: null,
    schoolName: null,
    includeSchoolLogo: false,
    includeOwnPicture: false,
    schoolLogoDataUrl: null,
    ownPictureDataUrl: null,
  };
}

export function personalizationHasAny(p: ExportPersonalization): boolean {
  return Boolean(
    (p.schoolName && p.schoolName.trim()) ||
      p.includeSchoolLogo ||
      p.includeOwnPicture ||
      p.schoolLogoDataUrl ||
      p.ownPictureDataUrl,
  );
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    const value = src.trim();
    if (value.startsWith("data:")) {
      img.src = value;
      return;
    }
    img.src = value.includes("?")
      ? `${value}&_cb=${Date.now()}`
      : `${value}?_cb=${Date.now()}`;
  });
}

/** Fetch remote/storage URL (or data URL) as a circular PNG for PDF avatars. */
async function fetchCircleImageDataUrl(src: string): Promise<string | null> {
  const value = src.trim();
  if (!value) return null;

  let dataUrl = value.startsWith("data:image") ? value : null;

  if (!dataUrl) {
    try {
      const res = await fetch(value, { mode: "cors" });
      if (res.ok) {
        const blob = await res.blob();
        dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(blob);
        });
      }
    } catch {
      // Fall through to canvas decode.
    }
  }

  const img = await loadImage(dataUrl || value);
  if (!img) return null;

  try {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = "#F3F4F6";
    ctx.fillRect(0, 0, size, size);
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    if (iw <= 0 || ih <= 0) return null;
    const scale = Math.max(size / iw, size / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.drawImage(img, (size - dw) / 2, (size - dh) / 2, dw, dh);
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

export async function resolveExportPersonalization(
  account: UserAccountView | null | undefined,
): Promise<ExportPersonalization> {
  if (!account) return emptyExportPersonalization();

  const teacherName = account.displayName?.trim() || null;
  const schoolName =
    account.useSchoolNameInAi && account.schoolName?.trim()
      ? account.schoolName.trim()
      : null;
  const includeSchoolLogo = account.useSchoolLogoInAi === true;
  const includeOwnPicture = account.useOwnPicInAi === true;

  const [schoolLogoDataUrl, ownPictureDataUrl] = await Promise.all([
    includeSchoolLogo && account.schoolLogoUrl?.trim()
      ? fetchCircleImageDataUrl(account.schoolLogoUrl.trim())
      : Promise.resolve(null),
    includeOwnPicture && account.profilePhotoUrl?.trim()
      ? fetchCircleImageDataUrl(account.profilePhotoUrl.trim())
      : Promise.resolve(null),
  ]);

  return {
    teacherName,
    schoolName,
    includeSchoolLogo,
    includeOwnPicture,
    schoolLogoDataUrl,
    ownPictureDataUrl,
  };
}


