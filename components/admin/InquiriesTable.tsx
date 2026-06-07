"use client";

import {
  RecordsManager,
  type Column,
  type DetailField,
} from "@/components/admin/RecordsManager";
import { INQUIRY_TYPES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { Inquiry } from "@/lib/types";

const columns: Column<Inquiry>[] = [
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
    header: "Type",
    cell: (r) => <span className="text-sm">{r.inquiryType}</span>,
  },
  {
    header: "Service",
    cell: (r) => <span className="text-sm">{r.interestedService}</span>,
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

const detailFields: DetailField<Inquiry>[] = [
  { label: "Email", value: (r) => r.email },
  { label: "Phone", value: (r) => r.phone },
  { label: "Company", value: (r) => r.companyName },
  { label: "Country", value: (r) => r.country },
  { label: "Inquiry type", value: (r) => r.inquiryType },
  { label: "Service", value: (r) => r.interestedService },
  { label: "Project details", value: (r) => r.projectDetails },
  { label: "Message", value: (r) => r.message },
];

export function InquiriesTable({
  initialRecords,
}: {
  initialRecords: Inquiry[];
}) {
  return (
    <RecordsManager<Inquiry>
      initialRecords={initialRecords}
      resourcePath="/api/inquiries"
      entityLabel="inquiry"
      entityLabelPlural="inquiries"
      columns={columns}
      detailFields={detailFields}
      searchKeys={["fullName", "email", "companyName", "country"]}
      typeFilter={{
        label: "inquiry types",
        field: "inquiryType",
        options: [...INQUIRY_TYPES],
      }}
    />
  );
}
