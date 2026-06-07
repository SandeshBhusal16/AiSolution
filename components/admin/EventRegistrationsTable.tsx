"use client";

import { useMemo } from "react";
import {
  RecordsManager,
  type Column,
  type DetailField,
} from "@/components/admin/RecordsManager";
import { formatDate } from "@/lib/utils";
import type { EventRegistration } from "@/lib/types";

const columns: Column<EventRegistration>[] = [
  {
    header: "Attendee",
    cell: (r) => (
      <div>
        <div className="font-medium">{r.fullName}</div>
        <div className="text-xs text-muted-foreground">{r.email}</div>
      </div>
    ),
  },
  { header: "Company", cell: (r) => r.companyName },
  {
    header: "Event",
    cell: (r) => <span className="text-sm">{r.eventName}</span>,
  },
  {
    header: "Submitted",
    cell: (r) => (
      <span className="whitespace-nowrap text-sm text-muted-foreground">
        {formatDate(r.createdAt)}
      </span>
    ),
  },
];

const detailFields: DetailField<EventRegistration>[] = [
  { label: "Email", value: (r) => r.email },
  { label: "Phone", value: (r) => r.phone },
  { label: "Company", value: (r) => r.companyName },
  { label: "Country", value: (r) => r.country },
  { label: "Event", value: (r) => r.eventName },
  { label: "Message", value: (r) => r.message },
];

export function EventRegistrationsTable({
  initialRecords,
}: {
  initialRecords: EventRegistration[];
}) {
  // Build the event filter options from the data we actually have.
  const eventOptions = useMemo(
    () =>
      Array.from(
        new Set(initialRecords.map((r) => r.eventName).filter(Boolean)),
      ),
    [initialRecords],
  );

  return (
    <RecordsManager<EventRegistration>
      initialRecords={initialRecords}
      resourcePath="/api/event-registrations"
      entityLabel="registration"
      entityLabelPlural="registrations"
      columns={columns}
      detailFields={detailFields}
      searchKeys={["fullName", "email", "companyName", "country", "eventName"]}
      typeFilter={{ label: "events", field: "eventName", options: eventOptions }}
    />
  );
}
