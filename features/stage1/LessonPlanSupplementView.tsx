"use client";

import { LESSON_PLAN_SECTION_HEADING } from "@/components/common/MarkdownContentView";
import { buildLessonPlanSupplement } from "@/lib/lesson-plan-supplement";
import { cn } from "@/lib/utils";

/**
 * Standard sections appended below every generated lesson plan (Flutter parity).
 * Rendered separately from the editable markdown so the boilerplate is never
 * saved into the library copy.
 */
export function LessonPlanSupplementView({
  curriculumRoute,
  grade,
  subject,
  className,
}: {
  curriculumRoute: string;
  grade: string;
  subject: string;
  className?: string;
}) {
  const supplement = buildLessonPlanSupplement({
    curriculumRoute,
    grade,
    subject,
  });
  const { successCriteria, curriculumAlignment, learningResources, rubric, teacherReflection } =
    supplement;

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <Section heading={successCriteria.heading}>
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {successCriteria.items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span
                className="mt-[0.2rem] size-3.5 shrink-0 rounded-[3px] border-[1.5px] border-[#28C2C0]"
                aria-hidden
              />
              <span className="text-[13px] leading-relaxed text-[#1A1C30]">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section heading={curriculumAlignment.heading}>
        <p className="m-0 text-[13px] leading-relaxed text-[#1A1C30]">
          {curriculumAlignment.body}
        </p>
      </Section>

      <Section heading={learningResources.heading}>
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {learningResources.items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span
                className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-[#28C2C0]"
                aria-hidden
              />
              <span className="text-[13px] leading-relaxed text-[#1A1C30]">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section heading={rubric.heading}>
        <p className="mb-2 text-[12px] leading-relaxed text-[#64748B] italic">
          {rubric.note}
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr>
                {rubric.columns.map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className="border border-slate-200 bg-[#F1F5F9] px-2.5 py-1.5 text-left font-bold whitespace-nowrap text-[#151B35]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rubric.rows.map((row) => (
                <tr key={row[0]} className="even:bg-[#FAFCFC]">
                  {row.map((cell, i) => (
                    <td
                      key={`${row[0]}-${i}`}
                      className={cn(
                        "border border-slate-200 px-2.5 py-1.5 align-top text-[13px] leading-relaxed text-[#1A1C30]",
                        i === 0 && "font-semibold",
                      )}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section heading={teacherReflection.heading}>
        <p className="mb-2 text-[12px] leading-relaxed text-[#64748B] italic">
          {teacherReflection.note}
        </p>
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {teacherReflection.questions.map((q) => (
            <li key={q}>
              <p className="m-0 text-[13px] font-semibold leading-relaxed text-[#1A1C30]">
                {q}
              </p>
              <span
                className="mt-1 block h-px w-full bg-slate-200"
                aria-hidden
              />
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col">
      <h3 className={LESSON_PLAN_SECTION_HEADING}>
        {heading}
      </h3>
      {children}
    </section>
  );
}


