import { EventRegistrationsTable } from "@/components/admin/EventRegistrationsTable";
import { FILES, readJsonFile } from "@/lib/json-db";
import type { EventRegistration } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EventRegistrationsPage() {
  const registrations = await readJsonFile<EventRegistration>(
    FILES.eventRegistrations,
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Event registrations
        </h2>
        <p className="text-sm text-muted-foreground">
          View participant details, update statuses and remove registrations.
        </p>
      </div>
      <EventRegistrationsTable initialRecords={registrations} />
    </div>
  );
}
