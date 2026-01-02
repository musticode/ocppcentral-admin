import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { chargePointApi, transactionApi } from "@/api";
import { LocationStatsCard } from "./LocationStatsCard";
import { ConnectorStatusChart } from "./ConnectorStatusChart";
import { SessionsChart } from "./SessionsChart";
import { LastEvents } from "./LastEvents";
import { ChargerListTable } from "./ChargerListTable";
import { LiveFeed } from "./LiveFeed";

export const LocationDetail = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const [period, setPeriod] = useState<"1W" | "1M" | "3M" | "1Y" | "ALL">("3M");

  const { data: location, isLoading: locationLoading } = useQuery({
    queryKey: ["location", locationId],
    queryFn: () => chargePointApi.getLocation(locationId!),
    enabled: !!locationId,
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

  if (locationLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!location) {
    return <div className="p-6">Location not found</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <Link
          to="/chargers"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Chargers
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{location.name}</h1>
        <p className="mt-1 text-gray-600">
          {location.totalStations} stations {location.totalConnectors}{" "}
          connectors
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Address: {location.country}, {location.city}, {location.zipCode},{" "}
          {location.address}
        </p>
      </div>

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
