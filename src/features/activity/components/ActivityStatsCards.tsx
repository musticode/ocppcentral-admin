import { useQuery } from "@tanstack/react-query";
import { transactionApi } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Activity, Info, XCircle } from "lucide-react";

export const ActivityStatsCards = () => {
  const companyId = localStorage.getItem("company_id") || undefined;

  const { data: events, isLoading } = useQuery({
    queryKey: ["events", "activity-overview"],
    queryFn: () => transactionApi.getEvents({ companyId, limit: 200 }),
  });

  const list = events ?? [];
  const total = list.length;
  const infoCount = list.filter((e) => (e.severity ?? "info") === "info").length;
  const warningCount = list.filter((e) => e.severity === "warning").length;
  const errorCount = list.filter((e) => e.severity === "error").length;

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
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground">Last 200 events</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Info</CardTitle>
          <Info className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{infoCount}</div>
          <p className="text-xs text-muted-foreground">Normal operations</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Warnings</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
          <p className="text-xs text-muted-foreground">Attention required</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Errors</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{errorCount}</div>
          <p className="text-xs text-muted-foreground">Issues detected</p>
        </CardContent>
      </Card>
    </div>
  );
};
