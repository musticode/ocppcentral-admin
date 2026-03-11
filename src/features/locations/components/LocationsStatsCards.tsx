import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { chargePointApi, locationApi, transactionApi } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Truck, Cable, Activity, DollarSign } from "lucide-react";

export const LocationsStatsCards = () => {
  const { data: apiLocations, isLoading: locationsLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: () => locationApi.getLocations(),
  });

  const { data: ocppLocations, isLoading: ocppLocationsLoading } = useQuery({
    queryKey: ["charge-point-locations"],
    queryFn: () => chargePointApi.getLocations(),
  });

  const { data: locationStats } = useQuery({
    queryKey: ["locations-stats-aggregate"],
    queryFn: async () => {
      const locs = await chargePointApi.getLocations();
      const stats = await Promise.all(
        locs.map((l) => transactionApi.getLocationStats(l.id, "1M"))
      );
      return stats;
    },
    enabled: !!ocppLocations && (ocppLocations?.length ?? 0) > 0,
  });

  const totals = useMemo(() => {
    const locList = ocppLocations ?? [];
    const totalLocations = (apiLocations ?? []).length || locList.length;
    const totalStations = locList.reduce((sum, l) => sum + (l.totalStations ?? 0), 0);
    const totalConnectors = locList.reduce((sum, l) => sum + (l.totalConnectors ?? 0), 0);

    const activeSessions = (locationStats ?? []).reduce(
      (sum, s) => sum + (s?.activeSessions ?? 0),
      0
    );
    const totalSessions = (locationStats ?? []).reduce(
      (sum, s) => sum + (s?.totalSessions ?? 0),
      0
    );
    const totalRevenue = (locationStats ?? []).reduce(
      (sum, s) => sum + (s?.totalRevenue ?? 0),
      0
    );

    return {
      totalLocations,
      totalStations,
      totalConnectors,
      activeSessions,
      totalSessions,
      totalRevenue,
    };
  }, [apiLocations, ocppLocations, locationStats]);

  const isLoading = locationsLoading || ocppLocationsLoading;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Locations</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totals.totalLocations}</div>
          <p className="text-xs text-muted-foreground">Charging sites</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stations</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totals.totalStations}</div>
          <p className="text-xs text-muted-foreground">Total charge points</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Connectors</CardTitle>
          <Cable className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totals.totalConnectors}</div>
          <p className="text-xs text-muted-foreground">Total connectors</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totals.activeSessions}</div>
          <p className="text-xs text-muted-foreground">Last 1M</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totals.totalRevenue.toFixed(0)}</div>
          <p className="text-xs text-muted-foreground">Total (1M)</p>
        </CardContent>
      </Card>
    </div>
  );
};
