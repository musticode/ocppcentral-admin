import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { transactionApi } from "@/api";
import { isDemoMode } from "@/demo/demoMode";
import { useCompanyStore } from "@/store/company.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export const SessionAnalytics = () => {
  const companyId = useCompanyStore((state) => state.companyId);
  const [period, setPeriod] = useState<"1W" | "1M" | "3M" | "1Y">("1M");

  const { data: sessions } = useQuery({
    queryKey: ["sessions", companyId],
    queryFn: () => transactionApi.getSessionsByCompany(companyId ?? ""),
    enabled: isDemoMode || !!companyId,
  });

  const sessionData = sessions?.data || [];

  // Group sessions by date
  const sessionsByDate = sessionData.reduce((acc: any, session: any) => {
    const date = new Date(session.startTimestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { date, sessions: 0, energy: 0, revenue: 0 };
    }
    acc[date].sessions += 1;
    const energy = session.meterStop && session.meterStart
      ? (session.meterStop - session.meterStart) / 1000
      : 0;
    acc[date].energy += energy;
    acc[date].revenue += session.totalCost || 0;
    return acc;
  }, {});

  const chartData = Object.values(sessionsByDate).slice(-30);

  // Status distribution
  const statusData = [
    { name: "Active", value: sessionData.filter((s: any) => s.status === "Active").length },
    { name: "Completed", value: sessionData.filter((s: any) => s.status === "Completed").length },
    { name: "Failed", value: sessionData.filter((s: any) => s.status === "Failed").length },
  ].filter(item => item.value > 0);

  // Top charge points by usage
  const chargePointUsage = sessionData.reduce((acc: any, session: any) => {
    const cpId = session.chargePointId;
    if (!acc[cpId]) {
      acc[cpId] = { name: cpId, sessions: 0, energy: 0 };
    }
    acc[cpId].sessions += 1;
    const energy = session.meterStop && session.meterStart
      ? (session.meterStop - session.meterStart) / 1000
      : 0;
    acc[cpId].energy += energy;
    return acc;
  }, {});

  const topChargePoints = Object.values(chargePointUsage)
    .sort((a: any, b: any) => b.sessions - a.sessions)
    .slice(0, 5);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sessions Over Time</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={period === "1W" ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod("1W")}
              >
                1W
              </Button>
              <Button
                variant={period === "1M" ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod("1M")}
              >
                1M
              </Button>
              <Button
                variant={period === "3M" ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod("3M")}
              >
                3M
              </Button>
              <Button
                variant={period === "1Y" ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod("1Y")}
              >
                1Y
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sessions"
                stroke="#3b82f6"
                name="Sessions"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="energy"
                stroke="#10b981"
                name="Energy (kWh)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Top Charge Points by Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topChargePoints}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="sessions" fill="#3b82f6" name="Sessions" />
              <Bar yAxisId="right" dataKey="energy" fill="#10b981" name="Energy (kWh)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
