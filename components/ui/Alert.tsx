import { cn } from "@/lib/utils";

export function Alert({
  variant = "info",
  children,
  className,
}: {
  variant?: "info" | "error" | "success";
  children: React.ReactNode;
  className?: string;
}) {
  const styles = {
    info: "bg-[#FFF4D3] text-[#D97706] border-amber-200",
    error: "bg-red-50 text-red-800 border-red-200",
    success: "bg-emerald-50 text-emerald-900 border-emerald-200",
  };
  return (
    <div
      className={cn("rounded-xl border px-4 py-3 text-sm", styles[variant], className)}
      role="alert"
    >
      {children}
    </div>
  );
}
