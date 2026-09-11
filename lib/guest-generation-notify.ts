import { toast } from "@/store/toast-store";

type GenerationSaveResult = {
  savedToLibrary?: boolean;
  saveError?: string;
};

/** Registered users only — guests rely on GenerationBusyOverlay (no library toasts). */
export function notifyStage1GenerationComplete(
  isGuest: boolean,
  result: GenerationSaveResult,
) {
  if (isGuest) return;
  if (result.savedToLibrary) {
    toast.success("Lesson plan generated and saved to library.");
    return;
  }
  toast.success("Lesson plan generated.");
  if (result.saveError) toast.error(result.saveError);
}

export function notifyStage2GenerationComplete(
  isGuest: boolean,
  result: GenerationSaveResult,
  options: { hasUsableDeck: boolean; slideCount: number },
) {
  if (isGuest) return;
  if (result.savedToLibrary) {
    toast.success("Presentation generated and saved to library.");
  } else if (result.saveError) {
    toast.info(result.saveError);
  } else if (options.hasUsableDeck) {
    toast.success("Presentation ready.");
  } else if (options.slideCount) {
    toast.info(
      "Slides generated but incomplete for library save. You can edit or regenerate.",
    );
  }
}

export function notifyStage3GenerationComplete(
  isGuest: boolean,
  result: GenerationSaveResult,
  hasResult: boolean,
) {
  if (isGuest) return;
  if (result.savedToLibrary) {
    toast.success("Activity generated and saved to library.");
  } else if (result.saveError) {
    toast.info(result.saveError);
  } else if (hasResult) {
    toast.success("Activity ready.");
  }
}

export function notifyStage4GenerationComplete(
  isGuest: boolean,
  result: GenerationSaveResult,
  hasResult: boolean,
) {
  if (isGuest) return;
  if (result.savedToLibrary) {
    toast.success("Assessment generated and saved to library.");
  } else if (result.saveError) {
    toast.info(result.saveError);
  } else if (hasResult) {
    toast.success("Assessment ready.");
  }
}


