import type { LucideIcon } from "lucide-react";
import {
  Apple,
  Atom,
  Award,
  Backpack,
  Blocks,
  BookOpen,
  Calculator,
  Clock,
  Compass,
  FlaskConical,
  Globe,
  GraduationCap,
  Lightbulb,
  Microscope,
  NotebookPen,
  Palette,
  PencilRuler,
  Ruler,
  Shapes,
  Sigma,
  SquareFunction,
  Star,
} from "lucide-react";

/** Decorative outline marks; `wide` items only appear once there is room beside the cards. */
const MARKS: { key: string; Icon: LucideIcon; wide?: boolean }[] = [
  { key: "cap", Icon: GraduationCap },
  { key: "book", Icon: BookOpen },
  { key: "pencil-ruler", Icon: PencilRuler },
  { key: "globe", Icon: Globe },
  { key: "atom", Icon: Atom },
  { key: "calculator", Icon: Calculator },
  { key: "flask", Icon: FlaskConical, wide: true },
  { key: "notebook", Icon: NotebookPen, wide: true },
  { key: "ruler", Icon: Ruler, wide: true },
  { key: "microscope", Icon: Microscope, wide: true },
  { key: "palette", Icon: Palette, wide: true },
  { key: "backpack", Icon: Backpack, wide: true },
  { key: "sigma", Icon: Sigma, wide: true },
  { key: "blocks", Icon: Blocks, wide: true },
  { key: "compass", Icon: Compass, wide: true },
  { key: "apple", Icon: Apple, wide: true },
  { key: "bulb", Icon: Lightbulb, wide: true },
  { key: "shapes", Icon: Shapes, wide: true },
  { key: "award", Icon: Award, wide: true },
  { key: "clock", Icon: Clock, wide: true },
  { key: "function", Icon: SquareFunction, wide: true },
  { key: "star", Icon: Star, wide: true },
];

export default function HeroBackdrop() {
  return (
    <div className="mml-hero-backdrop" aria-hidden>
      {MARKS.map(({ key, Icon, wide }) => (
        <span
          key={key}
          className={`mml-hero-backdrop-mark mml-hero-backdrop-mark--${key}${
            wide ? " mml-hero-backdrop-mark--wide" : ""
          }`}
        >
          <Icon strokeWidth={1.5} absoluteStrokeWidth />
        </span>
      ))}
    </div>
  );
}
