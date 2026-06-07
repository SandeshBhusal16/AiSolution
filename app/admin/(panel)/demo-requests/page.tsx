import { DemoRequestsTable } from "@/components/admin/DemoRequestsTable";
import { FILES, readJsonFile } from "@/lib/json-db";
import type { DemoRequest } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DemoRequestsPage() {
  const requests = await readJsonFile<DemoRequest>(FILES.demoRequests);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Demo requests</h2>
        <p className="text-sm text-muted-foreground">
          Manage scheduled demo requests submitted from the website.
        </p>
      </div>
      <DemoRequestsTable initialRecords={requests} />
    </div>
  );
}
