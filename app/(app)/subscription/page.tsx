import { redirect } from "next/navigation";

/** Legacy app billing path — purchases live on marketing `/pricing`. */
export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") qs.set(key, value);
    else if (Array.isArray(value)) value.forEach((v) => qs.append(key, v));
  }
  const suffix = qs.toString();
  redirect(suffix ? `/pricing?${suffix}` : "/pricing");
}


