import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportApi, type ReportPeriod } from "@/api/report.api";
import { ReportSummaryCards } from "./components/ReportSummaryCards";
import { EnergyConsumptionChart } from "./components/EnergyConsumptionChart";
import { UsageChart } from "./components/UsageChart";
import { ConsumptionByLocationChart } from "./components/ConsumptionByLocationChart";
import { HourlyUsageChart } from "./components/HourlyUsageChart";

export const ReportsOverview = () => {
  const [period, setPeriod] = useState<ReportPeriod>("3M");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["report-stats", period],
    queryFn: () => reportApi.getReportStats(period),
  });

  const { data: energyData, isLoading: energyLoading } = useQuery({
    queryKey: ["report-energy", period],
    queryFn: () => reportApi.getEnergyConsumption(period),
  });

  const { data: usageData, isLoading: usageLoading } = useQuery({
    queryKey: ["report-usage", period],
    queryFn: () => reportApi.getUsageByPeriod(period),
  });

  const { data: locationData, isLoading: locationLoading } = useQuery({
    queryKey: ["report-consumption-by-location", period],
    queryFn: () => reportApi.getConsumptionByLocation(period),
  });

  const { data: hourlyData, isLoading: hourlyLoading } = useQuery({
    queryKey: ["report-hourly", period],
    queryFn: () => reportApi.getHourlyUsage(period),
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="mt-1 text-muted-foreground">
          Electric usage, consumption analytics, and performance metrics
        </p>
      </div>

      {/* Summary Cards */}
      <ReportSummaryCards
        stats={
          stats ?? {
            totalEnergyKwh: 0,
            totalSessions: 0,
            totalRevenue: 0,
            avgSessionDuration: 0,
            activeSessions: 0,
            peakPowerKw: 0,
          }
        }
        period={period}
        onPeriodChange={setPeriod}
        isLoading={statsLoading}
      />

      {/* Energy Consumption Chart */}
      <EnergyConsumptionChart
        data={energyData || []}
        isLoading={energyLoading}
      />

      {/* Usage & Hourly Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UsageChart data={usageData || []} isLoading={usageLoading} />
        <HourlyUsageChart data={hourlyData || []} isLoading={hourlyLoading} />
      </div>

      {/* Consumption by Location */}
      <ConsumptionByLocationChart
        data={locationData || []}
        isLoading={locationLoading}
      />
    </div>
  );
};
