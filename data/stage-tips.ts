export type StageSidebarContext = "stage1" | "stage2" | "stage3" | "stage4";

export type StageTipSlide = {
  title: string;
  body: string;
  /** Small outline pill in the tips header (e.g. CHECK) */
  badge?: string;
  /** Single footer line (legacy / carousel slides) */
  footer?: string;
  /** Checklist bullets shown under the body (preferred when present) */
  bullets?: string[];
};

export type StageTipsContent = {
  slides: StageTipSlide[];
  /** @deprecated kept for any leftover callers */
  tipsTitle: string;
  tipsBody: string;
  proTipTitle: string;
  proTipBody: string;
  previewTitle: string;
  previewBody: string;
  previewFrom: string;
  previewTo: string;
};

function pack(
  slides: StageTipSlide[],
  previewFrom: string,
  previewTo: string,
): StageTipsContent {
  const [a, b, c] = slides;
  return {
    slides,
    tipsTitle: a.title,
    tipsBody: a.body,
    proTipTitle: b?.title ?? a.title,
    proTipBody: b?.body ?? a.body,
    previewTitle: c?.title ?? a.title,
    previewBody: c?.body ?? a.body,
    previewFrom,
    previewTo,
  };
}

export const STAGE_TIPS: Record<StageSidebarContext, StageTipsContent> = {
  stage1: pack(
    [
      {
        title: "Plan with intent",
        body: "Be specific when describing your topic. Include the grade level, subject and key objectives so Ayla can match the plan to your curriculum.",
        footer: "A clear topic gives you better slides in Stage 2.",
      },
      {
        title: "Pro tip",
        body: "Every generated plan is fully editable — tweak vocabulary, examples or pacing after creation to match your teaching style.",
        footer: "Edit anytime before you continue to the next stage.",
      },
      {
        title: "Stage 1 walkthrough",
        body: "Craft a complete lesson plan in under a minute with curriculum, grade, subject and topic.",
        footer: "Uses 1 credit when you create your lesson plan.",
      },
    ],
    "#1FB8A8",
    "#5E72E4",
  ),
  stage2: pack(
    [
      {
        title: "Present with clarity",
        body: "Choose a slide count that matches your lesson duration. Keep one clear teaching purpose per slide and use speaker notes for richer guidance.",
        bullets: [
          "Use one main teaching idea per slide.",
          "Speaker notes can hold prompts, examples and questions.",
        ],
      },
      {
        title: "Pro tip",
        body: "Open Speaker Notes while presenting. They turn each slide into a smooth, ready-to-deliver classroom moment.",
        bullets: [
          "Speaker notes keep delivery consistent across classes.",
          "Review notes before you export or present.",
        ],
      },
      {
        title: "Stage 2 walkthrough",
        body: "Watch how a polished slide deck and speaker notes are built directly from your lesson plan.",
        bullets: [
          "Pick a theme that fits your subject.",
          "Export or present when your deck looks right.",
        ],
      },
    ],
    "#5E72E4",
    "#8B5CF6",
  ),
  stage3: pack(
    [
      {
        title: "Check understanding",
        badge: "Check",
        body: "Keep formative assessments focused on the learning objective. Use a short mix of question types.",
        bullets: [
          "Quick Checks work well during or immediately after instruction.",
          "Exit Tickets help identify what to revisit next lesson.",
        ],
      },
      {
        title: "Pro tip",
        badge: "Tip",
        body: "Keep the Stage 2 deck as your source when possible so vocabulary and examples stay consistent across the lesson.",
        bullets: [
          "Consistent language helps students stay focused.",
          "Reuse slide examples in your question stems.",
        ],
      },
      {
        title: "Stage 3 walkthrough",
        badge: "Guide",
        body: "Generate student activities and answer keys in seconds, then edit before you print or share.",
        bullets: [
          "Toggle student and key views before exporting.",
          "Edit text anytime before you download or share.",
        ],
      },
    ],
    "#28C2C0",
    "#1FB8A8",
  ),
  stage4: pack(
    [
      {
        title: "Set duration and marks",
        body: "Duration drives mark bounds. Pick quiz or test style, then generate a student paper with a teacher mark scheme.",
        footer: "Mark schemes save time when you grade.",
      },
      {
        title: "Pro tip",
        body: "Use your Stage 3 activity as the source so summative items build on what students already practiced.",
        footer: "Build on practice before the summative check.",
      },
      {
        title: "Stage 4 walkthrough",
        body: "Create a full assessment pack with mark scheme ready for class or export.",
        footer: "Export the student paper and key together.",
      },
    ],
    "#F59E0B",
    "#5E72E4",
  ),
};

export function stageTipsContext(stage: number): StageSidebarContext {
  if (stage === 2) return "stage2";
  if (stage === 3) return "stage3";
  if (stage === 4) return "stage4";
  return "stage1";
}
