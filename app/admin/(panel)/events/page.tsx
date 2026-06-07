import { EventsManager } from "@/components/admin/EventsManager";
import { FILES, readJsonFile } from "@/lib/json-db";
import type { EventItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await readJsonFile<EventItem>(FILES.events);
  const sorted = [...events].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Event management
        </h2>
        <p className="text-sm text-muted-foreground">
          Create promotional events with an uploaded image. Events appear on the
          public Events page immediately.
        </p>
      </div>
      <EventsManager initialEvents={sorted} />
    </div>
  );
}
