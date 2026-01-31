import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ConsumptionByLocation } from "@/api/report.api";

interface ConsumptionByLocationChartProps {
  data: ConsumptionByLocation[];
  isLoading?: boolean;
}

const CHART_COLORS = [
  "#a855f7", // purple
  "#10b981", // emerald
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#ef4444", // red
];

export const ConsumptionByLocationChart = ({
  data,
  isLoading = false,
}: ConsumptionByLocationChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumption by Location</CardTitle>
        <p className="text-sm text-muted-foreground">
          Energy distribution across charging locations
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[320px] animate-pulse rounded bg-muted" />
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
                horizontal={false}
              />
              <XAxis type="number" tick={{ fontSize: 12 }} unit=" kWh" />
              <YAxis
                type="category"
                dataKey="locationName"
                tick={{ fontSize: 11 }}
                width={75}
              />
              <Tooltip
                contentStyle={{ borderRadius: "8px" }}
                formatter={(
                  value: number,
                  _name: string,
                  props: { payload?: ConsumptionByLocation },
                ) => [
                  `${value.toLocaleString()} kWh${props.payload ? ` (${props.payload.percentage}%)` : ""}`,
                  props.payload?.locationName ?? "Location",
                ]}
                labelFormatter={() => ""}
              />
              <Bar
                dataKey="energyKwh"
                radius={[0, 4, 4, 0]}
                name="Energy (kWh)"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
