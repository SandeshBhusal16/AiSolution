import { FILES, readJsonFile } from "@/lib/json-db";
import { INQUIRY_TYPES, SERVICES, STATUSES } from "@/lib/constants";
import type { DemoRequest, EventRegistration, Inquiry } from "@/lib/types";

/**
 * lib/analytics.ts
 * -----------------------------------------------------------------------------
 * Every dashboard figure is derived live from the JSON files — there is no
 * pre-aggregated data. This module reads the raw records and produces the
 * totals, distributions and time-series the dashboard charts consume.
 */

export interface NameValue {
  name: string;
  value: number;
}

export interface DashboardData {
  totals: {
    inquiries: number;
    demoRequests: number;
    eventRegistrations: number;
    aiAssistantInquiries: number;
    prototypingInquiries: number;
    salesRepInquiries: number;
  };
  inquiryTypeDistribution: NameValue[];
  countryDistribution: NameValue[];
  monthlyInquiries: NameValue[];
  serviceInterest: NameValue[];
  statusBreakdown: NameValue[];
  latestInquiries: Inquiry[];
}

/** Build a window of the last `n` calendar months (oldest -> newest). */
function lastNMonths(n: number): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-GB", {
      month: "short",
      year: "2-digit",
    });
    out.push({ key, label });
  }
  return out;
}

function monthKey(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function getDashboardData(): Promise<DashboardData> {
  const [inquiries, demoRequests, eventRegistrations] = await Promise.all([
    readJsonFile<Inquiry>(FILES.inquiries),
    readJsonFile<DemoRequest>(FILES.demoRequests),
    readJsonFile<EventRegistration>(FILES.eventRegistrations),
  ]);

  // --- Totals ---
  const aiAssistantInquiries = inquiries.filter(
    (i) => i.interestedService === "AI-powered virtual assistant",
  ).length;
  const prototypingInquiries = inquiries.filter(
    (i) => i.interestedService === "Prototyping solution",
  ).length;
  const salesRepInquiries = inquiries.filter(
    (i) => i.interestedService === "Sales representative",
  ).length;

  // --- Inquiry type distribution (include zero-count types) ---
  const inquiryTypeDistribution: NameValue[] = INQUIRY_TYPES.map((type) => ({
    name: type,
    value: inquiries.filter((i) => i.inquiryType === type).length,
  }));

  // --- Country-wise inquiries (top 8 by volume) ---
  const countryCounts = new Map<string, number>();
  for (const i of inquiries) {
    countryCounts.set(i.country, (countryCounts.get(i.country) ?? 0) + 1);
  }
  const countryDistribution: NameValue[] = [...countryCounts.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // --- Monthly inquiries (last 6 months) ---
  const months = lastNMonths(6);
  const monthlyInquiries: NameValue[] = months.map((m) => ({
    name: m.label,
    value: inquiries.filter((i) => monthKey(i.createdAt) === m.key).length,
  }));

  // --- Service interest (inquiries + demo requests combined) ---
  const serviceInterest: NameValue[] = SERVICES.map((service) => ({
    name: service,
    value:
      inquiries.filter((i) => i.interestedService === service).length +
      demoRequests.filter((d) => d.interestedService === service).length,
  }));

  // --- Inquiry status breakdown ---
  const statusBreakdown: NameValue[] = STATUSES.map((status) => ({
    name: status,
    value: inquiries.filter((i) => i.status === status).length,
  }));

  // --- Latest inquiries (newest first) ---
  const latestInquiries = [...inquiries]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return {
    totals: {
      inquiries: inquiries.length,
      demoRequests: demoRequests.length,
      eventRegistrations: eventRegistrations.length,
      aiAssistantInquiries,
      prototypingInquiries,
      salesRepInquiries,
    },
    inquiryTypeDistribution,
    countryDistribution,
    monthlyInquiries,
    serviceInterest,
    statusBreakdown,
    latestInquiries,
  };
}
