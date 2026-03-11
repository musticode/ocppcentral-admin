import { useQuery } from "@tanstack/react-query";
import { fleetApi } from "@/api";
import { useCompanyStore } from "@/store/company.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Users, Battery, Activity } from "lucide-react";

export const FleetStatsCards = () => {
  const companyId = useCompanyStore((state) => state.companyId);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["fleet-stats", companyId],
    queryFn: () => fleetApi.getFleetStats(companyId ?? ""),
    enabled: !!companyId,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Fleets</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalFleets ?? 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats?.activeFleets ?? 0} active
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
          <Battery className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalVehicles ?? 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats?.availableVehicles ?? 0} available
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalDrivers ?? 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats?.activeDrivers ?? 0} active
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Energy Consumed</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.totalEnergyConsumed?.toFixed(0) ?? 0} kWh
          </div>
          <p className="text-xs text-muted-foreground">
            {stats?.totalSessions ?? 0} sessions
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
