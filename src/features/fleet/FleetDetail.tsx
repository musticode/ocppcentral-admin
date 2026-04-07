import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fleetApi } from "@/api";
import { safeAddress } from "@/api/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Truck, Users, Activity, TrendingUp } from "lucide-react";
import { FleetVehiclesTable } from "./components/FleetVehiclesTable";
import { FleetDriversTable } from "./components/FleetDriversTable";
import { FleetAnalyticsCharts } from "./components/FleetAnalyticsCharts";
import { EditFleetModal } from "./components/EditFleetModal";

export const FleetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [period, setPeriod] = useState<"1W" | "1M" | "3M" | "1Y">("1M");

  const { data: fleet, isLoading } = useQuery({
    queryKey: ["fleet", id],
    queryFn: () => fleetApi.getFleetById(id ?? ""),
    enabled: !!id,
  });

  const { data: analytics } = useQuery({
    queryKey: ["fleet-analytics", id, period],
    queryFn: () => fleetApi.getFleetAnalytics(id ?? "", period),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">Loading fleet details...</div>
      </div>
    );
  }

  if (!fleet) {
    return (
      <div className="p-6">
        <div className="text-center py-12">Fleet not found</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/fleet")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{fleet.name}</h1>
              <Badge variant={fleet.status === "Active" ? "default" : "secondary"}>
                {fleet.status}
              </Badge>
            </div>
            {fleet.description && (
              <p className="mt-1 text-sm text-gray-500">{fleet.description}</p>
            )}
          </div>
        </div>
        <Button onClick={() => setEditModalOpen(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Fleet
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleet.totalVehicles ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {fleet.activeVehicles ?? 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drivers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleet.driverCount ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              Assigned drivers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleet.totalSessions ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              Charging sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Consumed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fleet.totalEnergyConsumed?.toFixed(0) ?? 0} kWh
            </div>
            <p className="text-xs text-muted-foreground">
              Avg efficiency: {fleet.averageEfficiency?.toFixed(1) ?? 0} km/kWh
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Fleet Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-500">Fleet Type</div>
              <div className="mt-1">{fleet.fleetType ?? '-'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Status</div>
              <div className="mt-1">
                <Badge variant={fleet.status === 'Active' ? 'default' : 'secondary'}>
                  {fleet.status}
                </Badge>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Created</div>
              <div className="mt-1">
                {fleet.createdAt ? new Date(fleet.createdAt).toLocaleString() : '-'}
              </div>
            </div>
          </CardContent>
        </Card>

        {fleet.location && (
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-500">Address</div>
                <div className="mt-1">{safeAddress(fleet.location.address) || '-'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">City</div>
                <div className="mt-1">{fleet.location.city ?? '-'}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">State</div>
                  <div className="mt-1">{fleet.location.state ?? '-'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Country</div>
                  <div className="mt-1">{fleet.location.country ?? '-'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {fleet.contactInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-500">Email</div>
                <div className="mt-1">{fleet.contactInfo.email ?? '-'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Phone</div>
                <div className="mt-1">{fleet.contactInfo.phone ?? '-'}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {fleet.settings && (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Auto Assignment</div>
                  <div className="mt-1">
                    <Badge variant={fleet.settings.autoAssignment ? 'default' : 'secondary'}>
                      {fleet.settings.autoAssignment ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Maintenance Alerts</div>
                  <div className="mt-1">
                    <Badge variant={fleet.settings.maintenanceAlerts ? 'default' : 'secondary'}>
                      {fleet.settings.maintenanceAlerts ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Charging Alerts</div>
                  <div className="mt-1">
                    <Badge variant={fleet.settings.chargingAlerts ? 'default' : 'secondary'}>
                      {fleet.settings.chargingAlerts ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Low Battery Threshold</div>
                  <div className="mt-1">{fleet.settings.lowBatteryThreshold ?? 20}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="vehicles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles">
          <FleetVehiclesTable fleetId={fleet.id} />
        </TabsContent>

        <TabsContent value="drivers">
          <FleetDriversTable fleetId={fleet.id} />
        </TabsContent>

        <TabsContent value="analytics">
          <FleetAnalyticsCharts
            fleetId={fleet.id}
            analytics={analytics}
            period={period}
            onPeriodChange={setPeriod}
          />
        </TabsContent>
      </Tabs>

      <EditFleetModal
        fleet={fleet}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
    </div>
  );
};
