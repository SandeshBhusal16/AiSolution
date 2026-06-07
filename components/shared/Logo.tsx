import Link from "next/link";
import { cn } from "@/lib/utils";

/** Brand wordmark used in the navbar, footer and admin sidebar. */
export function Logo({
  className,
  href = "/",
  invert = false,
}: {
  className?: string;
  href?: string;
  invert?: boolean;
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white shadow-soft">
        AI
      </span>
      <span
        className={cn(
          "text-lg font-bold tracking-tight",
          invert ? "text-white" : "text-foreground",
        )}
      >
        AI-Solution
      </span>
    </Link>
  );
}
