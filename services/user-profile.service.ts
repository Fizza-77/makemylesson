import { getDoc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";

import { userDocRef, fetchUserProfile } from "@/lib/firebase/firestore";
import { uploadUserFile } from "@/lib/firebase/storage";
import { UserFirestoreProfile } from "@/types/user-profile";
import { useAuthStore } from "@/store/auth-store";

function guessMime(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

export async function uploadSchoolLogoFromFile(uid: string, file: File): Promise<string> {
  return uploadUserFile(uid, "school_logo", file, file.type || guessMime(file.name));
}

export async function uploadSchoolLogoFromDataUrl(
  uid: string,
  dataUrl: string,
  mimeType?: string,
): Promise<string> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return uploadUserFile(uid, "school_logo", blob, mimeType || blob.type || "image/jpeg");
}

export async function saveCompletedProfile(params: {
  uid: string;
  dateOfBirth?: Date | null;
  ageConfirmed?: boolean;
  schoolName?: string | null;
  schoolLogoUrl?: string | null;
}): Promise<UserFirestoreProfile | null> {
  const trimmedSchool = params.schoolName?.trim();
  const payload: Record<string, unknown> = {
    schoolName: trimmedSchool ? trimmedSchool : null,
    schoolLogoUrl: params.schoolLogoUrl ?? null,
    profileComplete: true,
    updatedAt: serverTimestamp(),
  };
  if (params.dateOfBirth) {
    const d = params.dateOfBirth;
    payload.dateOfBirth = Timestamp.fromDate(
      new Date(d.getFullYear(), d.getMonth(), d.getDate()),
    );
  }
  if (params.ageConfirmed && !params.dateOfBirth) {
    payload.ageConfirmedAt = serverTimestamp();
  }

  await setDoc(userDocRef(params.uid), payload, { merge: true });
  const profile = await fetchUserProfile(params.uid);
  useAuthStore.getState().setProfile(profile);
  return profile;
}


