import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectorStatus } from "@/types/ocpp";
import type { Location } from "@/types/ocpp";

interface ConnectorStatusChartProps {
  location: Location;
}

const COLORS: Record<string, string> = {
  [ConnectorStatus.AVAILABLE]: "#10b981", // green
  [ConnectorStatus.RESERVED]: "#3b82f6", // blue
  [ConnectorStatus.CHARGING]: "#a855f7", // purple
  [ConnectorStatus.FINISHING]: "#c084fc", // light purple
  [ConnectorStatus.FAULTED]: "#ef4444", // red
  [ConnectorStatus.UNAVAILABLE]: "#9ca3af", // grey
};

export const ConnectorStatusChart = ({
  location,
}: ConnectorStatusChartProps) => {
  // Count connectors by status
  const statusCounts = location.chargePoints.reduce((acc, cp) => {
    cp.connectors.forEach((connector) => {
      acc[connector.status] = (acc[connector.status] || 0) + 1;
    });
    return acc;
  }, {} as Record<ConnectorStatus, number>);

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const legendItems = [
    { name: "Available", color: COLORS[ConnectorStatus.AVAILABLE] },
    { name: "Reserved", color: COLORS[ConnectorStatus.RESERVED] },
    { name: "Charging", color: COLORS[ConnectorStatus.CHARGING] },
    { name: "Finishing", color: COLORS[ConnectorStatus.FINISHING] },
    { name: "Faulted", color: COLORS[ConnectorStatus.FAULTED] },
    { name: "Offline/Unavailable", color: COLORS[ConnectorStatus.UNAVAILABLE] },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connectors Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name] || "#9ca3af"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {legendItems.map((item) => (
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
