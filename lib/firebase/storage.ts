import { ref, uploadBytes, getDownloadURL, deleteObject, type UploadMetadata } from "firebase/storage";

import { getFirebaseStorage } from "./config";

export async function uploadUserFile(
  uid: string,
  path: string,
  data: Blob | Uint8Array,
  contentType?: string,
) {
  const storageRef = ref(getFirebaseStorage(), `users/${uid}/${path}`);
  const meta: UploadMetadata = contentType ? { contentType } : {};
  await uploadBytes(storageRef, data, meta);
  return getDownloadURL(storageRef);
}

/** Same Storage path as Flutter `UserProfileRepository._profilePhotoRef`. */
export async function deleteUserFile(uid: string, path: string) {
  try {
    await deleteObject(ref(getFirebaseStorage(), `users/${uid}/${path}`));
  } catch {
    /* object may not exist */
  }
}


