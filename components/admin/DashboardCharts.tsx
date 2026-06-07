"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_COLORS } from "@/lib/constants";
import type { NameValue } from "@/lib/analytics";

function ChartCard({
  title,
  data,
  children,
}: {
  title: string;
  data: NameValue[];
  children: React.ReactNode;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
            No data yet — submissions will appear here.
          </div>
        ) : (
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {children as React.ReactElement}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid hsl(214 32% 91%)",
  fontSize: 12,
};

export function DashboardCharts({
  inquiryTypeDistribution,
  countryDistribution,
  monthlyInquiries,
  serviceInterest,
}: {
  inquiryTypeDistribution: NameValue[];
  countryDistribution: NameValue[];
  monthlyInquiries: NameValue[];
  serviceInterest: NameValue[];
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ChartCard
        title="Inquiry type distribution"
        data={inquiryTypeDistribution}
      >
        <PieChart>
          <Pie
            data={inquiryTypeDistribution}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={45}
            paddingAngle={2}
          >
            {inquiryTypeDistribution.map((_, index) => (
              <Cell
                key={index}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ChartCard>

      <ChartCard title="Monthly inquiries (last 6 months)" data={monthlyInquiries}>
        <LineChart data={monthlyInquiries} margin={{ left: -20, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line
            type="monotone"
            dataKey="value"
            name="Inquiries"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartCard>

      <ChartCard title="Country-wise inquiries" data={countryDistribution}>
        <BarChart
          data={countryDistribution}
          layout="vertical"
          margin={{ left: 20, right: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fontSize: 12 }}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" name="Inquiries" radius={[0, 6, 6, 0]}>
            {countryDistribution.map((_, index) => (
              <Cell
                key={index}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartCard>

      <ChartCard title="Service interest comparison" data={serviceInterest}>
        <BarChart data={serviceInterest} margin={{ left: -20, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10 }}
            interval={0}
            angle={-12}
            textAnchor="end"
            height={60}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" name="Interest" radius={[6, 6, 0, 0]}>
            {serviceInterest.map((_, index) => (
              <Cell
                key={index}
                fill={CHART_COLORS[(index + 2) % CHART_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartCard>
    </div>
  );
}
