import {
  Bot,
  Briefcase,
  CalendarClock,
  Layers,
  MessageSquare,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatsCard } from "@/components/admin/StatsCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { getDashboardData } from "@/lib/analytics";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();
  const { totals } = data;

  const stats = [
    {
      label: "Customer inquiries",
      value: totals.inquiries,
      icon: MessageSquare,
      accent: "bg-brand-gradient",
    },
    {
      label: "Demo requests",
      value: totals.demoRequests,
      icon: CalendarClock,
      accent: "bg-blue-500",
    },
    {
      label: "Event registrations",
      value: totals.eventRegistrations,
      icon: Users,
      accent: "bg-cyan-500",
    },
    {
      label: "AI assistant inquiries",
      value: totals.aiAssistantInquiries,
      icon: Bot,
      accent: "bg-violet-500",
    },
    {
      label: "Prototyping inquiries",
      value: totals.prototypingInquiries,
      icon: Layers,
      accent: "bg-emerald-500",
    },
    {
      label: "Sales rep inquiries",
      value: totals.salesRepInquiries,
      icon: Briefcase,
      accent: "bg-amber-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back 👋
        </h2>
        <p className="text-sm text-muted-foreground">
          Here&apos;s an overview of customer engagement, calculated live from
          your JSON data files.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatsCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            accent={stat.accent}
          />
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts
        inquiryTypeDistribution={data.inquiryTypeDistribution}
        countryDistribution={data.countryDistribution}
        monthlyInquiries={data.monthlyInquiries}
        serviceInterest={data.serviceInterest}
      />

      {/* Latest inquiries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Latest inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Inquiry type</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.latestInquiries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    No inquiries yet. Submissions from the contact form will
                    appear here.
                  </TableCell>
                </TableRow>
              ) : (
                data.latestInquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>
                      <div className="font-medium">{inquiry.fullName}</div>
                      <div className="text-xs text-muted-foreground">
                        {inquiry.email}
                      </div>
                    </TableCell>
                    <TableCell>{inquiry.companyName}</TableCell>
                    <TableCell className="text-sm">
                      {inquiry.inquiryType}
                    </TableCell>
                    <TableCell className="text-sm">
                      {inquiry.interestedService}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={inquiry.status} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(inquiry.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
