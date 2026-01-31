import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UsageDataPoint } from "@/api/report.api";

interface UsageChartProps {
  data: UsageDataPoint[];
  isLoading?: boolean;
}

export const UsageChart = ({ data, isLoading = false }: UsageChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Sessions and energy consumption by period
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[320px] animate-pulse rounded bg-muted" />
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{ borderRadius: "8px" }}
                formatter={(value: number, name: string) => [
                  name === "revenue"
                    ? `$${value.toLocaleString()}`
                    : value.toLocaleString(),
                  name === "sessions"
                    ? "Sessions"
                    : name === "energyKwh"
                      ? "Energy (kWh)"
                      : "Revenue",
                ]}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="sessions"
                fill="#a855f7"
                radius={[4, 4, 0, 0]}
                name="Sessions"
              />
              <Bar
                yAxisId="left"
                dataKey="energyKwh"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                name="Energy (kWh)"
              />
              <Bar
                yAxisId="right"
                dataKey="revenue"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                name="Revenue ($)"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
