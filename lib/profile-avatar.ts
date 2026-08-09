import multiavatar from "@multiavatar/multiavatar";

/**
 * Same Multiavatar engine + seed pattern as Flutter `random_avatar` /
 * `RandomAvatar(seed)` in `profile_screen.dart`.
 */
export function avatarSeedsForUser(uid: string, count = 24): string[] {
  return Array.from({ length: count }, (_, i) => `${uid}_avatar_${i + 1}`);
}

export function pickRandomAvatarSeed(uid: string): string {
  const seeds = avatarSeedsForUser(uid);
  return seeds[Math.floor(Math.random() * seeds.length)] ?? `${uid}_avatar_1`;
}

/** SVG string — deterministic from seed, matches mobile app for the same `avatarSeed`. */
export function avatarSvgForSeed(seed: string): string {
  return multiavatar(seed.trim());
}

export function avatarDataUrlForSeed(seed: string): string {
  const svg = avatarSvgForSeed(seed);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
