import { getDownloadURL, ref } from "firebase/storage";

import { getFirebaseAuth, getFirebaseStorage } from "@/firebase/config";
import {
  stage2SlideExpectsImage,
  type Stage2Slide,
} from "@/types/stage2";

/** Parses `{jobId}` from backend `image_asset_id` (`{jobId}_slide_{n}`). */
export function jobIdFromImageAssetId(imageAssetId: string): string | null {
  const match = /^(.+)_slide_(\d+)$/.exec(imageAssetId.trim());
  return match?.[1]?.trim() || null;
}

export async function downloadUrlForStoredSlide(params: {
  uid: string;
  jobId: string;
  slideNumber: number;
}): Promise<string | null> {
  const j = params.jobId.trim();
  if (!j) return null;
  const storage = getFirebaseStorage();
  for (const ext of ["png", "jpg"] as const) {
    try {
      const path = `users/${params.uid}/stage2/${j}/slide_${params.slideNumber}.${ext}`;
      return await getDownloadURL(ref(storage, path));
    } catch {
      /* try next ext */
    }
  }
  return null;
}

export async function hydrateSlideForLibrary(
  slide: Stage2Slide,
  fallbackJobId?: string | null,
): Promise<Stage2Slide> {
  const dataUrl = slide.imageDataUrl.trim();
  if (slide.imageUrl.trim()) {
    return { ...slide, imageStatus: "success", imageDataUrl: "" };
  }
  if (dataUrl.startsWith("data:")) {
    return { ...slide, imageStatus: "success" };
  }
  if (!stage2SlideExpectsImage(slide)) return slide;

  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) {
    return finalizeHydrationFailure(slide);
  }

  const jobFromAsset = jobIdFromImageAssetId(slide.imageAssetId);
  const fallback = fallbackJobId?.trim() || "";
  const candidates = [fallback, jobFromAsset || ""].filter(Boolean);
  const effectiveSlideNumber = slide.slideNumber;

  const seen = new Set<string>();
  for (const jobId of candidates) {
    if (!seen.add(jobId)) continue;
    const url = await downloadUrlForStoredSlide({
      uid,
      jobId,
      slideNumber: effectiveSlideNumber,
    });
    if (url) {
      return {
        ...slide,
        imageAssetId:
          slide.imageAssetId.trim() ||
          `${jobId}_slide_${effectiveSlideNumber}`,
        imageUrl: url,
        imageStatus: "success",
        imageError: "",
        imageDataUrl: "",
      };
    }
  }

  return finalizeHydrationFailure(slide);
}

function finalizeHydrationFailure(slide: Stage2Slide): Stage2Slide {
  if (!slide.imagePrompt.trim()) return slide;
  if (slide.imageStatus.trim().toLowerCase() === "success") return slide;
  return {
    ...slide,
    imageStatus: "failed",
    imageError:
      slide.imageError.trim() || "Image unavailable in library.",
    imageDataUrl: "",
  };
}

export async function hydrateSlidesForLibrary(
  slides: Stage2Slide[],
  fallbackJobId?: string | null,
): Promise<Stage2Slide[]> {
  return Promise.all(
    slides.map((s) => hydrateSlideForLibrary(s, fallbackJobId)),
  );
}


