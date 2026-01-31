import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EnergyConsumptionDataPoint } from "@/api/report.api";

interface EnergyConsumptionChartProps {
  data: EnergyConsumptionDataPoint[];
  isLoading?: boolean;
}

export const EnergyConsumptionChart = ({
  data,
  isLoading = false,
}: EnergyConsumptionChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Consumption</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total kWh delivered over the selected period
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[320px] animate-pulse rounded bg-muted" />
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{ value: "kWh", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{ borderRadius: "8px" }}
                formatter={(value: number) => [
                  `${value.toLocaleString()} kWh`,
                  "Energy",
                ]}
                labelFormatter={(label) => `Period: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="energyKwh"
                stroke="#a855f7"
                strokeWidth={2}
                fill="url(#energyGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
