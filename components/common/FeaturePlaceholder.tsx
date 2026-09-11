import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { ROUTES } from "@/lib/urls";

export function FeaturePlaceholder({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <Card className="mx-auto max-w-lg text-center">
      <h1 className="text-xl font-bold text-[#1A1C30]">{title}</h1>
      {description ? <p className="mt-2 text-sm text-[#666666]">{description}</p> : null}
      <p className="mt-6 text-sm">
        <Link href={ROUTES.stage1} className="font-semibold text-[#28C2C0] hover:underline">
          Back to Stage 1
        </Link>
      </p>
    </Card>
  );
}


