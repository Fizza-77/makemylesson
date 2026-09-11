import Image from "next/image";
import type { ReactNode } from "react";

function ZipIcon() {
  return (
    <svg className="mml-shelf-tag-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="3" y="2" width="10" height="12" rx="1.5" fill="#F59E0B" />
      <path d="M7 2v2h2V2M7 5v1.5h2V5M7 7.5V9h2V7.5M7 10.5V12h2v-1.5" fill="#92400E" />
      <rect x="6.25" y="11.25" width="3.5" height="1.75" rx="0.4" fill="#78350F" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg className="mml-shelf-tag-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 1.5h6.2L12.5 4.3V14a.75.75 0 0 1-.75.75h-8.5A.75.75 0 0 1 2.5 14V2.25c0-.41.34-.75.75-.75Z"
        fill="#E53935"
      />
      <path d="M9.7 1.5V4.2h2.8" fill="#B71C1C" />
      <path
        d="M4.6 10.9V7.4h1.35c.85 0 1.4.45 1.4 1.2 0 .74-.55 1.2-1.4 1.2H5.55v1.1H4.6Zm.95-1.85h.35c.32 0 .52-.16.52-.42s-.2-.43-.52-.43h-.35v.85Zm2.55 1.85V7.4h1.1c1.15 0 1.85.7 1.85 1.75S10.35 10.9 9.2 10.9H8.1Zm.95-2.75v1.95h.2c.55 0 .9-.35.9-.97 0-.63-.35-.98-.9-.98h-.2Zm2.7 2.75V7.4h2.35v.75h-1.4v.7h1.25v.7H11.9v1.35h-.95Z"
        fill="#fff"
      />
    </svg>
  );
}

function DocxIcon() {
  return (
    <svg className="mml-shelf-tag-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 1.5h6.2L12.5 4.3V14a.75.75 0 0 1-.75.75h-8.5A.75.75 0 0 1 2.5 14V2.25c0-.41.34-.75.75-.75Z"
        fill="#2B579A"
      />
      <path d="M9.7 1.5V4.2h2.8" fill="#1E3F73" />
      <path
        d="M4.35 11.1 5.7 7.35h.95l.95 2.55.95-2.55h.95l1.35 3.75h-.95l-.7-2.05-.85 2.05h-.85l-.85-2.05-.7 2.05h-.95Z"
        fill="#fff"
      />
    </svg>
  );
}

function PptxIcon() {
  return (
    <svg className="mml-shelf-tag-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 1.5h6.2L12.5 4.3V14a.75.75 0 0 1-.75.75h-8.5A.75.75 0 0 1 2.5 14V2.25c0-.41.34-.75.75-.75Z"
        fill="#C43E1C"
      />
      <path d="M9.7 1.5V4.2h2.8" fill="#9A2E14" />
      <path
        d="M5 11.1V7.35h1.55c1.05 0 1.7.55 1.7 1.45 0 .9-.65 1.45-1.7 1.45H5.9v.85H5Zm.9-2.55h.55c.45 0 .75-.22.75-.6s-.3-.6-.75-.6H5.9v1.2Z"
        fill="#fff"
      />
    </svg>
  );
}

function ClassroomIcon() {
  return (
    <svg className="mml-shelf-tag-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1.5" y="2.5" width="13" height="11" rx="2" fill="#0F9D58" />
      <circle cx="8" cy="6.4" r="1.65" fill="#fff" />
      <circle cx="4.6" cy="7.1" r="1.15" fill="#E8F5E9" />
      <circle cx="11.4" cy="7.1" r="1.15" fill="#E8F5E9" />
      <path
        d="M3.4 12.2c.45-1.45 1.7-2.2 3-2.2h3.2c1.3 0 2.55.75 3 2.2"
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TeamsIcon() {
  return (
    <svg className="mml-shelf-tag-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="5.2" y="3.2" width="7.6" height="9.6" rx="1.6" fill="#6264A7" />
      <circle cx="9" cy="5.6" r="1.35" fill="#fff" />
      <path
        d="M6.7 11.4c.35-1.15 1.25-1.7 2.3-1.7s1.95.55 2.3 1.7"
        stroke="#fff"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <rect x="2.4" y="5.4" width="4.4" height="6.2" rx="1" fill="#464775" />
      <path
        d="M3.35 9.7V7.1h.7l.7 1.55L5.45 7.1h.7v2.6h-.6V8.15l-.7 1.55h-.4l-.7-1.55V9.7h-.6Z"
        fill="#fff"
      />
    </svg>
  );
}

const CREDIT_TAG = "THE FULL SHELF COSTS 4 CREDITS";

const EXPORT_TAGS: { label: string; icon: ReactNode }[] = [
  { label: "ZIP", icon: <ZipIcon /> },
  { label: "PDF", icon: <PdfIcon /> },
  { label: "DOCX", icon: <DocxIcon /> },
  { label: "PPTX", icon: <PptxIcon /> },
  { label: "GOOGLE CLASSROOM", icon: <ClassroomIcon /> },
  { label: "MICROSOFT TEAMS", icon: <TeamsIcon /> },
];

function ShelfUnderline() {
  return (
    <svg
      className="mml-shelf-underline"
      viewBox="0 0 280 18"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
    >
      <path
        d="M6 11c48 5 110 6 168 2 36-2.2 72-5.5 100-2"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ShelfSection() {
  return (
    <section className="mml-shelf" aria-labelledby="mml-shelf-heading">
      <div className="mml-shelf-inner">
        <p className="mml-shelf-eyebrow">
          <span className="mml-shelf-eyebrow-dot" aria-hidden />
          THE COMPLETE TEACHING PACK
        </p>

        <h2 id="mml-shelf-heading" className="mml-shelf-title">
          One topic fills a{" "}
          <span className="mml-shelf-title-accent">
            whole shelf.
            <ShelfUnderline />
          </span>
        </h2>

        <p className="mml-shelf-sub">
          Every generation creates a coordinated set of classroom-ready resources{' '}
          <br className="mml-shelf-sub-break" />
          for the teacher, the class and the student.
        </p>

        <div className="mml-shelf-visual">
          <Image
            src="/Group 54.svg"
            alt="Teaching pack shelf with lesson plan, presentation, speaker notes, activity sheet, answer keys, assessment paper and mark scheme"
            width={1272}
            height={622}
            className="mml-shelf-img"
            priority={false}
          />
        </div>

        <ul className="mml-shelf-tags">
          <li>
            <span className="mml-shelf-tag mml-shelf-tag--accent">{CREDIT_TAG}</span>
          </li>
          {EXPORT_TAGS.map(({ label, icon }) => (
            <li key={label}>
              <span className="mml-shelf-tag mml-shelf-tag--export">
                {icon}
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}


