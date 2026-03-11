import { useQuery } from "@tanstack/react-query";
import { transactionApi } from "@/api";
import { isDemoMode } from "@/demo/demoMode";
import { useCompanyStore } from "@/store/company.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Zap, DollarSign, TrendingUp, Clock, Battery } from "lucide-react";

export const SessionStatsCards = () => {
  const companyId = useCompanyStore((state) => state.companyId);

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["sessions", companyId],
    queryFn: () => transactionApi.getSessionsByCompany(companyId ?? ""),
    enabled: isDemoMode || !!companyId,
  });

  const sessionData = sessions?.data || [];
  const activeSessions = sessionData.filter((s: any) => s.status === "Active").length;
  const completedSessions = sessionData.filter((s: any) => s.status === "Completed").length;

  const totalEnergy = sessionData.reduce((sum: number, s: any) => {
    const energy = s.meterStop && s.meterStart
      ? (s.meterStop - s.meterStart) / 1000
      : 0;
    return sum + energy;
  }, 0);

  const totalRevenue = sessionData.reduce((sum: number, s: any) => {
    return sum + (s.totalCost || 0);
  }, 0);

  const avgDuration = sessionData.length > 0
    ? sessionData.reduce((sum: number, s: any) => {
      if (s.startTimestamp && s.stopTimestamp) {
        const duration = (new Date(s.stopTimestamp).getTime() - new Date(s.startTimestamp).getTime()) / (1000 * 60);
        return sum + duration;
      }
      return sum;
    }, 0) / completedSessions || 0
    : 0;

  const avgEnergyPerSession = completedSessions > 0 ? totalEnergy / completedSessions : 0;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          <Activity className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeSessions}</div>
          <p className="text-xs text-muted-foreground">
            Currently charging
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sessionData.length}</div>
          <p className="text-xs text-muted-foreground">
            {completedSessions} completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Energy</CardTitle>
          <Battery className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEnergy.toFixed(1)} kWh</div>
          <p className="text-xs text-muted-foreground">
            Energy delivered
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            From all sessions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgDuration.toFixed(0)} min</div>
          <p className="text-xs text-muted-foreground">
            Per session
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Energy</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgEnergyPerSession.toFixed(1)} kWh</div>
          <p className="text-xs text-muted-foreground">
            Per session
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
