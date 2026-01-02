import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConnectorsStatusChartCardProps {
  data: {
    available: number;
    charging: number;
    finishing: number;
  };
}

const COLORS = {
  available: "#3b82f6", // blue
  charging: "#a855f7", // purple
  finishing: "#10b981", // green
};

export const ConnectorsStatusChartCard = ({
  data,
}: ConnectorsStatusChartCardProps) => {
  const chartData = [
    { name: "Available", value: data.available, color: COLORS.available },
    { name: "Charging", value: data.charging, color: COLORS.charging },
    { name: "Finishing", value: data.finishing, color: COLORS.finishing },
  ].filter((item) => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connectors status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ value }) => `${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
