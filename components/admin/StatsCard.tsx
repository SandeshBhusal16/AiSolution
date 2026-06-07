import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  /** Tailwind gradient/utility classes for the icon chip. */
  accent?: string;
  hint?: string;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  accent = "bg-brand-gradient",
  hint,
}: StatsCardProps) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-soft",
          accent,
        )}
      >
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-muted-foreground">
          {label}
        </p>
        <p className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </Card>
  );
}
