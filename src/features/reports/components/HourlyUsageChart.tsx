import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HourlyUsageDataPoint } from "@/api/report.api";

interface HourlyUsageChartProps {
  data: HourlyUsageDataPoint[];
  isLoading?: boolean;
}

export const HourlyUsageChart = ({
  data,
  isLoading = false,
}: HourlyUsageChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Usage Pattern</CardTitle>
        <p className="text-sm text-muted-foreground">
          Typical energy consumption and session count by hour of day
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[320px] animate-pulse rounded bg-muted" />
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={1} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{ borderRadius: "8px" }}
                formatter={(value: number, name: string) => [
                  value.toLocaleString(),
                  name === "energyKwh" ? "Energy (kWh)" : "Sessions",
                ]}
                labelFormatter={(label) => `Hour: ${label}`}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="energyKwh"
                stroke="#a855f7"
                strokeWidth={2}
                dot={false}
                name="Energy (kWh)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="sessions"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="Sessions"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
