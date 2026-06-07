import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex h-64 items-center justify-center text-muted-foreground">
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      Loading…
    </div>
  );
}
