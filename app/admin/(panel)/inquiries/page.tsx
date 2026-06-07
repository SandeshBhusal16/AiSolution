import { InquiriesTable } from "@/components/admin/InquiriesTable";
import { FILES, readJsonFile } from "@/lib/json-db";
import type { Inquiry } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const inquiries = await readJsonFile<Inquiry>(FILES.inquiries);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Customer inquiries
        </h2>
        <p className="text-sm text-muted-foreground">
          Search, filter, review, update statuses and delete general inquiries.
        </p>
      </div>
      <InquiriesTable initialRecords={inquiries} />
    </div>
  );
}
