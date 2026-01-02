import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface ChargersSummaryCardProps {
  stats: {
    activeSessions: number;
    totalSessions: number;
    totalKwh: number;
    totalRevenue: number;
  };
  period: "1W" | "1M" | "3M" | "1Y" | "ALL";
  onPeriodChange: (period: "1W" | "1M" | "3M" | "1Y" | "ALL") => void;
}

const periods = ["1W", "1M", "3M", "1Y", "ALL"] as const;

export const ChargersSummaryCard = ({
  stats,
  period,
  onPeriodChange,
}: ChargersSummaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Chargers</CardTitle>
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
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Active sessions</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.activeSessions}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Session</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalSessions}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total kWh</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalKwh}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ${stats.totalRevenue}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
