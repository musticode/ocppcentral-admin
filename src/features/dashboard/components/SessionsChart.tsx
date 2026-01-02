import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SessionsChartProps {
  data?: Array<{ time: string; activeSessions: number }>;
  isLoading: boolean;
}

export const SessionsChart = ({ data, isLoading }: SessionsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] animate-pulse rounded bg-gray-200" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="activeSessions" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
