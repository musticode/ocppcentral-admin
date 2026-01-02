import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface LocationStatsCardProps {
  stats?: {
    activeSessions: number;
    totalSessions: number;
    totalKwh: number;
    totalRevenue: number;
  };
  isLoading: boolean;
  period: "1W" | "1M" | "3M" | "1Y" | "ALL";
  onPeriodChange: (period: "1W" | "1M" | "3M" | "1Y" | "ALL") => void;
}

const periods = ["1W", "1M", "3M", "1Y", "ALL"] as const;

export const LocationStatsCard = ({
  stats,
  isLoading,
  period,
  onPeriodChange,
}: LocationStatsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Charger Summary</CardTitle>
          <div className="flex gap-2">
            {periods.map((p) => (
              <Button
                key={p}
                variant={period === p ? "default" : "outline"}
                size="sm"
                onClick={() => onPeriodChange(p)}
                className={cn(
                  period === p && "bg-primary text-primary-foreground"
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
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded bg-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Active sessions</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.activeSessions ?? 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Session</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalSessions ?? 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total kWh</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalKwh ?? 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalRevenue ?? 0}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
