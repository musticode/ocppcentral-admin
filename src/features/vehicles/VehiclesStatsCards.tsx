import { useQuery } from "@tanstack/react-query";
import { carsApi } from "@/api";
import { useCompanyStore } from "@/store/company.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CarFront, CheckCircle2, XCircle, PlugZap } from "lucide-react";

export const VehiclesStatsCards = () => {
  const companyId = useCompanyStore((s) => s.companyId);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["vehicle-stats", companyId],
    queryFn: () => carsApi.getCarStats({ companyId: companyId ?? undefined }),
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

  const totalCars = stats?.totalCars ?? 0;
  const activeCars = stats?.activeCars ?? 0;
  const inactiveCars = stats?.inactiveCars ?? 0;

  const topPort = (() => {
    const byPort = stats?.byChargingPort ?? {};
    const entries = Object.entries(byPort);
    if (entries.length === 0) return "-";
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0]?.[0] ?? "-";
  })();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
          <CarFront className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCars}</div>
          <p className="text-xs text-muted-foreground">Fleet vehicles</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeCars}</div>
          <p className="text-xs text-muted-foreground">Enabled vehicles</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          <XCircle className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inactiveCars}</div>
          <p className="text-xs text-muted-foreground">Disabled vehicles</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Charging Port</CardTitle>
          <PlugZap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topPort}</div>
          <p className="text-xs text-muted-foreground">Most common connector</p>
        </CardContent>
      </Card>
    </div>
  );
};
