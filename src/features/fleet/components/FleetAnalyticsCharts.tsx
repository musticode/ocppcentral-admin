import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { FleetAnalytics } from "@/types/api";

interface FleetAnalyticsChartsProps {
  fleetId: string;
  analytics?: FleetAnalytics;
  period: "1W" | "1M" | "3M" | "1Y";
  onPeriodChange: (period: "1W" | "1M" | "3M" | "1Y") => void;
}

export const FleetAnalyticsCharts = ({
  analytics,
  period,
  onPeriodChange,
}: FleetAnalyticsChartsProps) => {
  if (!analytics) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button
          variant={period === "1W" ? "default" : "outline"}
          size="sm"
          onClick={() => onPeriodChange("1W")}
        >
          1W
        </Button>
        <Button
          variant={period === "1M" ? "default" : "outline"}
          size="sm"
          onClick={() => onPeriodChange("1M")}
        >
          1M
        </Button>
        <Button
          variant={period === "3M" ? "default" : "outline"}
          size="sm"
          onClick={() => onPeriodChange("3M")}
        >
          3M
        </Button>
        <Button
          variant={period === "1Y" ? "default" : "outline"}
          size="sm"
          onClick={() => onPeriodChange("1Y")}
        >
          1Y
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Energy Consumption Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.energyConsumption}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="energyKwh"
                stroke="#3b82f6"
                name="Energy (kWh)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="sessions"
                stroke="#10b981"
                name="Sessions"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.vehicleUtilization}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vehicleName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="utilizationPercent" fill="#3b82f6" name="Utilization %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Driver Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.driverPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="driverName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sessions" fill="#10b981" name="Sessions" />
                <Bar dataKey="efficiency" fill="#f59e0b" name="Efficiency (km/kWh)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-600">Total Cost</div>
              <div className="text-2xl font-bold text-blue-900">
                ${analytics.costAnalysis.totalCost.toFixed(2)}
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-600">Cost per kWh</div>
              <div className="text-2xl font-bold text-green-900">
                ${analytics.costAnalysis.costPerKwh.toFixed(2)}
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm font-medium text-yellow-600">Cost per Session</div>
              <div className="text-2xl font-bold text-yellow-900">
                ${analytics.costAnalysis.costPerSession.toFixed(2)}
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm font-medium text-purple-600">Cost per Vehicle</div>
              <div className="text-2xl font-bold text-purple-900">
                ${analytics.costAnalysis.costPerVehicle.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
