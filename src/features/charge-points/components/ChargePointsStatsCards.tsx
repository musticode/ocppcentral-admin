import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Cable, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { ChargePoint } from "@/types/ocpp";

interface ChargePointsStatsCardsProps {
  chargePoints: ChargePoint[];
}

export const ChargePointsStatsCards = ({ chargePoints }: ChargePointsStatsCardsProps) => {
  const list = chargePoints ?? [];

  const total = list.length;
  const available = list.filter((cp) => cp.status === "Available").length;
  const charging = list.filter((cp) => cp.status === "Charging").length;
  const faulted = list.filter((cp) => cp.status === "Faulted").length;
  const unavailable = list.filter((cp) => cp.status === "Unavailable").length;

  const totalConnectors = list.reduce((sum, cp) => sum + (cp.connectors?.length ?? 0), 0);
  const chargingConnectors = list.reduce(
    (sum, cp) => sum + (cp.connectors ?? []).filter((c) => c.status === "Charging").length,
    0
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Charge Points</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground">Across all locations</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{available}</div>
          <p className="text-xs text-muted-foreground">Ready to charge</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Charging</CardTitle>
          <Cable className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{charging}</div>
          <p className="text-xs text-muted-foreground">Active sessions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Issues</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{unavailable}</div>
          <p className="text-xs text-muted-foreground">Unavailable</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Faulted</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{faulted}</div>
          <p className="text-xs text-muted-foreground">
            <Badge variant="outline" className="mt-1">
              {chargingConnectors}/{totalConnectors} connectors charging
            </Badge>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
