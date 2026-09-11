export type AylaFaqEntry = {
  question: string;
  answer: string;
};

/** Mirrors Flutter `kAylaFaqEntries` for local FAQ fallback matching. */
export const AYLA_FAQ_ENTRIES: AylaFaqEntry[] = [
  {
    question: "What is Make My Lesson?",
    answer:
      "Make My Lesson is an AI lesson planning platform for teachers that generates curriculum-aligned teaching packs. From one curriculum selection and one topic, it can generate lesson plans, presentations, classroom activities with answer keys, and summative assessments with mark schemes.",
  },
  {
    question: "What does Make My Lesson generate?",
    answer:
      "It generates four stages: Stage 1 Lesson Plan, Stage 2 Classroom Presentation, Stage 3 Classroom Activity (student sheet + teacher answer key), and Stage 4 Summative Assessment (student paper + teacher mark scheme).",
  },
  {
    question: "Is Make My Lesson just a lesson plan generator?",
    answer:
      "No. It is a complete planning workflow that combines planning, presentation creation, activity generation, assessment creation, exports, and library management in one platform.",
  },
  {
    question: "How does Make My Lesson save teachers time?",
    answer:
      "A complete pack that usually takes 2.5 to 5 hours across multiple tools can be generated in under 10 minutes with coherent curriculum alignment across all stages.",
  },
  {
    question: "Do I have to generate all four stages?",
    answer:
      "No. Every stage is independent and can be generated standalone. If you generate in sequence, curriculum context carries across stages automatically.",
  },
  {
    question: "What makes Make My Lesson different from generic AI tools?",
    answer:
      "Generic tools output broad text. Make My Lesson outputs route-specific, curriculum-aligned resources, including separate student and teacher documents and structured stage workflows.",
  },
  {
    question: "Is Make My Lesson available globally?",
    answer:
      "Yes. It is available globally. Pricing is set in USD, and local equivalents are shown at checkout based on location.",
  },
  {
    question: "Which curricula are supported?",
    answer:
      "Make My Lesson supports 71 curriculum routes across Australia, United Kingdom, Canada, International Baccalaureate (PYP, MYP, DP), and United States pathways including AP.",
  },
  {
    question: "Who is Ayla?",
    answer:
      "Ayla is the built-in teaching assistant that helps teachers refine and adapt generated content at any stage.",
  },
  {
    question: "Does using Ayla consume credits?",
    answer:
      "No. Ayla refinements are free. Credits are used only for full stage generation or regeneration.",
  },
  {
    question: "What is a credit?",
    answer:
      "One credit equals one stage generation: lesson plan, presentation, activity set, or assessment.",
  },
  {
    question: "How many free credits do new users get?",
    answer:
      "New users receive 5 free generation credits with no credit card required.",
  },
  {
    question: "How many credits does a complete teaching pack use?",
    answer:
      "A complete four-stage teaching pack uses 4 credits total, at 1 credit per stage.",
  },
  {
    question: "When are credits deducted?",
    answer:
      "Credits are deducted only after successful generation and save. Failed generations do not consume credits.",
  },
  {
    question: "What does the monthly plan cost?",
    answer:
      "Individual Monthly is USD 14.99 per month with 30 credits per month.",
  },
  {
    question: "What does the annual plan cost?",
    answer:
      "Individual Annual is USD 99.99 per year, around USD 8.33 per month equivalent, with 30 credits per month.",
  },
  {
    question: "What is the one-time top-up?",
    answer: "A one-time top-up of 50 credits costs USD 29.99, with no expiry.",
  },
  {
    question: "Is there a school or department plan?",
    answer:
      "Yes. Department Plan is USD 349/year for up to 5 seats, and School Plan is USD 599/year for up to 10 seats.",
  },
  {
    question: "What file formats can I export?",
    answer:
      "Documents export as PDF or DOCX. Presentations export as PPTX with notes and images. Complete packs can be downloaded as a ZIP.",
  },
  {
    question: "Can I post directly to Google Classroom or Microsoft Teams?",
    answer:
      "Yes. Documents can be posted directly to Google Classroom and Microsoft Teams with student/teacher routing as appropriate.",
  },
  {
    question: "Can I use Make My Lesson on mobile?",
    answer:
      "Yes. Make My Lesson is available on web, iOS, and Android, with sync across devices.",
  },
  {
    question: "Does Make My Lesson guarantee grades or official papers?",
    answer:
      "No. It does not generate official past papers and does not guarantee grade outcomes. Teachers should verify and adapt outputs to learner needs.",
  },
];

export function buildAylaFaqTextFromEntries(
  entries: AylaFaqEntry[] = AYLA_FAQ_ENTRIES,
): string {
  const lines = [
    "Frequently Asked Questions",
    "Make My Lesson · Master FAQ Document · v2.0",
    "",
  ];
  for (const entry of entries) {
    lines.push(`Q: ${entry.question}`);
    lines.push(`A: ${entry.answer}`);
    lines.push("");
  }
  return lines.join("\n").trimEnd();
}

/** Mirrors Flutter `_findBestFaqMatch`. */
export function findBestFaqMatch(
  query: string,
  entries: AylaFaqEntry[] = AYLA_FAQ_ENTRIES,
): AylaFaqEntry | null {
  const normalize = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const tokens = new Set(
    normalize(query)
      .split(/\s+/)
      .filter((token) => token.length >= 4),
  );
  if (tokens.size === 0) return null;

  let best: AylaFaqEntry | null = null;
  let bestScore = 0;
  for (const entry of entries) {
    const questionTokens = new Set(
      normalize(entry.question)
        .split(/\s+/)
        .filter((token) => token.length >= 4),
    );
    if (questionTokens.size === 0) continue;
    let overlap = 0;
    for (const t of questionTokens) {
      if (tokens.has(t)) overlap++;
    }
    if (overlap === 0) continue;
    const score = overlap / questionTokens.size;
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }
  return bestScore >= 0.3 ? best : null;
}


