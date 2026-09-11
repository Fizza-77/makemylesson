/** Mirrors Flutter `Stage2SlideThemes` registry (IDs = backend presentationStyle). */

export type Stage2SlideTheme = {
  id: string;
  name: string;
  tagline: string;
  isLight: boolean;
  /** 3 CSS color stops for background gradient */
  backgroundGradient: [string, string, string];
  accentPrimary: string;
  accentSecondary: string;
  titleColor: string;
  bodyColor: string;
  mutedColor: string;
  overlayPanelColor: string;
  imageMood: string;
};

export const STAGE2_THEMES: Stage2SlideTheme[] = [
  {
    id: "classic_navy",
    name: "Classic Navy",
    tagline: "Professional teal & navy — the signature look",
    isLight: false,
    backgroundGradient: ["#0D1117", "#1A213E", "#243552"],
    accentPrimary: "#28C2C0",
    accentSecondary: "#CDEB7B",
    titleColor: "#FFFFFF",
    bodyColor: "#FFFFFF",
    mutedColor: "#B0B3C6",
    overlayPanelColor: "#1A213E",
    imageMood: "clean modern editorial photography, cool teal and navy tones",
  },
  {
    id: "clean_light",
    name: "Clean Light",
    tagline: "Crisp white & ink — minimal and academic",
    isLight: true,
    backgroundGradient: ["#FFFFFF", "#F4F6FB", "#E7EEF9"],
    accentPrimary: "#2563EB",
    accentSecondary: "#0EA5E9",
    titleColor: "#0F172A",
    bodyColor: "#1E293B",
    mutedColor: "#64748B",
    overlayPanelColor: "#FFFFFF",
    imageMood: "bright airy minimal photography, soft daylight, white background",
  },
  {
    id: "warm_sunrise",
    name: "Warm Sunrise",
    tagline: "Amber & coral warmth — friendly and inviting",
    isLight: false,
    backgroundGradient: ["#431407", "#9A3412", "#C2410C"],
    accentPrimary: "#F59E0B",
    accentSecondary: "#FB7185",
    titleColor: "#FFF7ED",
    bodyColor: "#FFEDD5",
    mutedColor: "#FED7AA",
    overlayPanelColor: "#431407",
    imageMood: "warm golden-hour photography, soft amber and coral light",
  },
  {
    id: "forest_scholar",
    name: "Forest Scholar",
    tagline: "Deep green & serif — natural and studious",
    isLight: false,
    backgroundGradient: ["#052E16", "#14532D", "#166534"],
    accentPrimary: "#34D399",
    accentSecondary: "#A3E635",
    titleColor: "#ECFDF5",
    bodyColor: "#D1FAE5",
    mutedColor: "#86EFAC",
    overlayPanelColor: "#14532D",
    imageMood: "lush natural photography, botanical greens, soft daylight",
  },
  {
    id: "vibrant_playful",
    name: "Vibrant Playful",
    tagline: "Bright & rounded — energetic for young learners",
    isLight: false,
    backgroundGradient: ["#6D28D9", "#BE185D", "#DB2777"],
    accentPrimary: "#FDE047",
    accentSecondary: "#22D3EE",
    titleColor: "#FFFFFF",
    bodyColor: "#FDF4FF",
    mutedColor: "#F5D0FE",
    overlayPanelColor: "#4C1D95",
    imageMood: "playful vibrant illustration style, bright cheerful colours",
  },
  {
    id: "midnight_gradient",
    name: "Midnight Gradient",
    tagline: "Indigo & cyan — sleek, modern, high-tech",
    isLight: false,
    backgroundGradient: ["#0F0524", "#312E81", "#4C1D95"],
    accentPrimary: "#818CF8",
    accentSecondary: "#22D3EE",
    titleColor: "#FFFFFF",
    bodyColor: "#E0E7FF",
    mutedColor: "#A5B4FC",
    overlayPanelColor: "#1E1B4B",
    imageMood: "sleek modern tech photography, neon indigo and cyan accents",
  },
  {
    id: "chalkboard",
    name: "Chalkboard",
    tagline: "Handwritten chalk — the timeless classroom",
    isLight: false,
    backgroundGradient: ["#1B2620", "#22332B", "#2A3F34"],
    accentPrimary: "#FBBF24",
    accentSecondary: "#F87171",
    titleColor: "#F8FAFC",
    bodyColor: "#E2E8F0",
    mutedColor: "#CBD5E1",
    overlayPanelColor: "#1B2620",
    imageMood: "hand-drawn chalk illustration on a dark green board",
  },
];

export function stage2ThemeById(id: string | null | undefined): Stage2SlideTheme {
  const key = (id ?? "").trim();
  return STAGE2_THEMES.find((t) => t.id === key) ?? STAGE2_THEMES[0]!;
}


