import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import {
  Zap,
  Activity,
  DollarSign,
  Clock,
  Plug,
  TrendingUp,
} from "lucide-react";
import type { ReportPeriod } from "@/api/report.api";

interface ReportStats {
  totalEnergyKwh: number;
  totalSessions: number;
  totalRevenue: number;
  avgSessionDuration: number;
  activeSessions: number;
  peakPowerKw: number;
}

interface ReportSummaryCardsProps {
  stats: ReportStats;
  period: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
  isLoading?: boolean;
}

const periods: ReportPeriod[] = ["1W", "1M", "3M", "1Y", "ALL"];

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

export const ReportSummaryCards = ({
  stats,
  period,
  onPeriodChange,
  isLoading = false,
}: ReportSummaryCardsProps) => {
  const cards = [
    {
      label: "Total Energy",
      value: `${stats.totalEnergyKwh.toLocaleString()} kWh`,
      icon: Zap,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Total Sessions",
      value: stats.totalSessions.toLocaleString(),
      icon: Activity,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Avg. Session Duration",
      value: formatDuration(stats.avgSessionDuration),
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Active Sessions",
      value: stats.activeSessions.toString(),
      icon: Plug,
      color: "text-violet-600",
      bgColor: "bg-violet-500/10",
    },
    {
      label: "Peak Power",
      value: `${stats.peakPowerKw} kW`,
      icon: TrendingUp,
      color: "text-rose-600",
      bgColor: "bg-rose-500/10",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Report Summary</h2>
          <div className="flex gap-2">
            {periods.map((p) => (
              <Button
                key={p}
                variant={period === p ? "default" : "outline"}
                size="sm"
                onClick={() => onPeriodChange(p)}
                className={cn(
                  period === p && "bg-primary text-primary-foreground",
                )}
              >
                {p}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {cards.map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {cards.map(({ label, value, icon: Icon, color, bgColor }) => (
              <div
                key={label}
                className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <div
                  className={cn(
                    "mb-2 inline-flex rounded-lg p-2",
                    bgColor,
                    color,
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  {label}
                </p>
                <p className="text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
