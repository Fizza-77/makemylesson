import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Bookmark,
  ClipboardList,
  FileCheck,
  FileStack,
  FileText,
  Files,
  FolderOpen,
  LayoutTemplate,
  ListChecks,
  NotebookPen,
  PenLine,
  Presentation,
  ScrollText,
  Sheet,
  StickyNote,
} from "lucide-react";

type Mark = {
  key: string;
  Icon: LucideIcon;
  /** Extra marks once the section is wide enough to show them. */
  wide?: boolean;
};

const MARKS: Mark[] = [
  { key: "plan-doc", Icon: FileText },
  { key: "slides-doc", Icon: Presentation },
  { key: "activity-doc", Icon: ClipboardList },
  { key: "assess-doc", Icon: FileCheck },
  { key: "book", Icon: BookOpen },
  { key: "pen", Icon: PenLine },
  { key: "checks", Icon: ListChecks },
  { key: "bookmark", Icon: Bookmark },
  { key: "folder", Icon: FolderOpen },
  { key: "sticky", Icon: StickyNote },
  { key: "field-a", Icon: FileText },
  { key: "field-b", Icon: Presentation },
  { key: "field-c", Icon: ClipboardList },
  { key: "field-d", Icon: FileCheck },
  { key: "field-e", Icon: NotebookPen },
  { key: "field-f", Icon: FileStack },
  { key: "stack-a", Icon: FileStack, wide: true },
  { key: "stack-b", Icon: Files, wide: true },
  { key: "notebook", Icon: NotebookPen, wide: true },
  { key: "scroll", Icon: ScrollText, wide: true },
  { key: "sheet", Icon: Sheet, wide: true },
  { key: "layout", Icon: LayoutTemplate, wide: true },
];

export default function BeforeAfterBackdrop() {
  return (
    <div className="mml-ba-backdrop" aria-hidden>
      {MARKS.map(({ key, Icon, wide }) => (
        <span
          key={key}
          className={`mml-ba-backdrop-mark mml-ba-backdrop-mark--${key}${
            wide ? " mml-ba-backdrop-mark--wide" : ""
          }`}
        >
          <Icon strokeWidth={1.35} absoluteStrokeWidth />
        </span>
      ))}
    </div>
  );
}


