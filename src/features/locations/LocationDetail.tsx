import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { locationApi, chargePointApi, transactionApi } from "@/api";
import { LocationStatsCard } from "@/features/dashboard/components/LocationStatsCard";
import { ConnectorStatusChart } from "@/features/dashboard/components/ConnectorStatusChart";
import { SessionsChart } from "@/features/dashboard/components/SessionsChart";
import { LastEvents } from "@/features/dashboard/components/LastEvents";
import { ChargerListTable } from "@/features/dashboard/components/ChargerListTable";
import { LiveFeed } from "@/features/dashboard/components/LiveFeed";
import { EditLocationModal } from "./EditLocationModal";

export const LocationDetail = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [period, setPeriod] = useState<"1W" | "1M" | "3M" | "1Y" | "ALL">("3M");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [assignChargePointId, setAssignChargePointId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);

  const { data: location, isLoading: locationLoading } = useQuery({
    queryKey: ["location", locationId],
    queryFn: () => locationApi.getLocation(locationId!),
    enabled: !!locationId,
  });

  const { data: allChargePoints } = useQuery({
    queryKey: ["charge-points-all"],
    queryFn: () => chargePointApi.getChargePoints({ limit: 500 }),
    enabled: !!locationId && !!location,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["location-stats", locationId, period],
    queryFn: () => transactionApi.getLocationStats(locationId!, period),
    enabled: !!locationId,
  });

  const { data: sessionsChart, isLoading: chartLoading } = useQuery({
    queryKey: ["location-sessions-chart", locationId, period],
    queryFn: () => transactionApi.getLocationSessionsChart(locationId!, period),
    enabled: !!locationId,
  });

  const chargePointsNotHere =
    allChargePoints?.data?.filter(
      (cp) => cp.locationId !== locationId && cp.locationId !== location?.id
    ) ?? [];

  const handleAssignChargePoint = async () => {
    if (!assignChargePointId || !locationId) return;
    setIsAssigning(true);
    try {
      await chargePointApi.updateChargePoint(assignChargePointId, {
        locationId,
      });
      toast({
        title: "Charge point assigned",
        description: "The charge point has been assigned to this location.",
      });
      setAssignChargePointId("");
      queryClient.invalidateQueries({ queryKey: ["location", locationId] });
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["charge-points"] });
      queryClient.invalidateQueries({ queryKey: ["charge-points-all"] });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to assign charge point.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const invalidateLocation = () => {
    queryClient.invalidateQueries({ queryKey: ["location", locationId] });
    queryClient.invalidateQueries({ queryKey: ["locations"] });
  };

  if (locationLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!location) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Location not found</p>
        <Link to="/locations" className="mt-4 inline-block text-primary hover:underline">
          Back to Locations
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to="/locations"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Locations
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{location.name}</h1>
          <p className="mt-1 text-gray-600">
            {location.totalStations} stations · {location.totalConnectors}{" "}
            connectors
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {location.country}, {location.city}, {location.zipCode},{" "}
            {location.address}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditModalOpen(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Location
          </Button>
        </div>
      </div>

      <EditLocationModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        location={location}
        onSuccess={invalidateLocation}
      />

      {/* Assign charge point */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Link2 className="h-4 w-4" />
            Assign Charge Point
          </CardTitle>
          <p className="text-sm text-gray-500">
            Assign an existing charge point to this location. Charge points
            already at this location are not listed.
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1 space-y-2">
            <Select
              value={assignChargePointId}
              onValueChange={setAssignChargePointId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select charge point" />
              </SelectTrigger>
              <SelectContent>
                {chargePointsNotHere.map((cp) => (
                  <SelectItem key={cp.id} value={cp.id}>
                    {cp.name} ({cp.chargePointId})
                    {cp.locationName ? ` · ${cp.locationName}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleAssignChargePoint}
            disabled={!assignChargePointId || isAssigning || chargePointsNotHere.length === 0}
          >
            {isAssigning ? "Assigning..." : "Assign to this location"}
          </Button>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <LocationStatsCard
        stats={stats}
        isLoading={statsLoading}
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ConnectorStatusChart location={location} />
        <SessionsChart data={sessionsChart} isLoading={chartLoading} />
      </div>

      {/* Live Feed */}
      <LiveFeed locationId={locationId!} />

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LastEvents locationId={locationId!} />
        <ChargerListTable location={location} />
      </div>
    </div>
  );
};
