import { Badge } from "@/components/ui/badge";
import type { Status } from "@/lib/constants";

const STATUS_VARIANT: Record<
  Status,
  "info" | "purple" | "warning" | "success"
> = {
  New: "info",
  Contacted: "purple",
  "In Progress": "warning",
  Completed: "success",
};

export function StatusBadge({ status }: { status: Status }) {
  return <Badge variant={STATUS_VARIANT[status] ?? "default"}>{status}</Badge>;
}
