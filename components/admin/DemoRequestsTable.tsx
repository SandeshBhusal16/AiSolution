"use client";

import {
  RecordsManager,
  type Column,
  type DetailField,
} from "@/components/admin/RecordsManager";
import { SERVICES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { DemoRequest } from "@/lib/types";

const columns: Column<DemoRequest>[] = [
  {
    header: "Customer",
    cell: (r) => (
      <div>
        <div className="font-medium">{r.fullName}</div>
        <div className="text-xs text-muted-foreground">{r.email}</div>
      </div>
    ),
  },
  { header: "Company", cell: (r) => r.companyName },
  {
    header: "Service",
    cell: (r) => <span className="text-sm">{r.interestedService}</span>,
  },
  {
    header: "Preferred date",
    cell: (r) => (
      <span className="whitespace-nowrap text-sm">
        {formatDate(r.preferredDemoDate)}
      </span>
    ),
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

const detailFields: DetailField<DemoRequest>[] = [
  { label: "Email", value: (r) => r.email },
  { label: "Phone", value: (r) => r.phone },
  { label: "Company", value: (r) => r.companyName },
  { label: "Country", value: (r) => r.country },
  { label: "Service", value: (r) => r.interestedService },
  { label: "Preferred date", value: (r) => formatDate(r.preferredDemoDate) },
  { label: "Message", value: (r) => r.message },
];

export function DemoRequestsTable({
  initialRecords,
}: {
  initialRecords: DemoRequest[];
}) {
  return (
    <RecordsManager<DemoRequest>
      initialRecords={initialRecords}
      resourcePath="/api/demo-requests"
      entityLabel="demo request"
      entityLabelPlural="demo requests"
      columns={columns}
      detailFields={detailFields}
      searchKeys={["fullName", "email", "companyName", "country"]}
      typeFilter={{
        label: "services",
        field: "interestedService",
        options: [...SERVICES],
      }}
    />
  );
}
