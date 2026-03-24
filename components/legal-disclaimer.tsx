import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

export function LegalDisclaimer({
  variant = "card",
  className,
}: {
  variant?: "card" | "compact";
  className?: string;
}) {
  return (
    <div
      role="note"
      className={cn(
        "rounded-lg border border-amber-500/25 bg-amber-500/[0.06] text-amber-950 dark:border-amber-500/20 dark:bg-amber-500/[0.08] dark:text-amber-100/95",
        variant === "card" ? "p-4 text-sm leading-relaxed" : "p-3 text-xs leading-snug",
        className
      )}
    >
      <div className="flex gap-2.5">
        <Scale
          className={cn(
            "shrink-0 text-amber-700 dark:text-amber-400/90",
            variant === "card" ? "size-5" : "size-4 mt-0.5"
          )}
          aria-hidden
        />
        <div>
          <p className="font-medium text-amber-900 dark:text-amber-50/95">
            Not legal advice
          </p>
          <p className={cn("mt-1 text-amber-900/85 dark:text-amber-100/85", variant === "compact" && "text-[13px]")}>
            ClearContract uses AI for general information only. It is not a substitute for advice from a licensed
            attorney. Consult a lawyer before signing, negotiating, or relying on any contract decision.
          </p>
        </div>
      </div>
    </div>
  );
}
