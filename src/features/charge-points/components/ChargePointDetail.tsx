import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { chargePointApi, reservationApi, transactionApi } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Activity, Calendar, DollarSign, PlugZap, Zap } from "lucide-react";
import type { Session, Transaction, Event, ChargePoint } from "@/types/ocpp";

export const ChargePointDetail = () => {
  const { chargerId } = useParams<{ chargerId: string }>();

  const [activeTab, setActiveTab] = useState<"sessions" | "transactions" | "reservations" | "logs">(
    "sessions"
  );

  const { data: charger, isLoading: chargerLoading } = useQuery({
    queryKey: ["charge-point", chargerId],
    queryFn: () => chargePointApi.getChargePointById(chargerId ?? ""),
    enabled: !!chargerId,
  });

  const { data: sessionsResp, isLoading: sessionsLoading } = useQuery({
    queryKey: ["charger-sessions", charger?.chargePointId],
    queryFn: () => transactionApi.getSessions({ chargePointId: charger?.chargePointId, limit: 100 }),
    enabled: !!charger?.chargePointId,
  });

  const { data: transactionsResp, isLoading: transactionsLoading } = useQuery({
    queryKey: ["charger-transactions", charger?.chargePointId],
    queryFn: () => transactionApi.getTransactions({ chargePointId: charger?.chargePointId, limit: 100 }),
    enabled: !!charger?.chargePointId,
  });

  const { data: reservations, isLoading: reservationsLoading } = useQuery({
    queryKey: ["charger-reservations", charger?.chargePointId],
    queryFn: () => reservationApi.getReservationsByChargePoint(charger?.chargePointId ?? ""),
    enabled: !!charger?.chargePointId,
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["charger-events", charger?.chargePointId],
    queryFn: () => transactionApi.getEvents({ chargePointId: charger?.chargePointId, limit: 200 }),
    enabled: !!charger?.chargePointId,
  });

  const sessions = useMemo(() => {
    const raw = (sessionsResp?.data ?? []) as Session[];
    return raw
      .filter((s) => s.chargePointId === charger?.chargePointId)
      .sort(
        (a, b) =>
          new Date(b.startTimestamp).getTime() - new Date(a.startTimestamp).getTime()
      );
  }, [sessionsResp, charger?.chargePointId]);

  const transactions = useMemo(() => {
    const raw = (transactionsResp?.data ?? []) as Transaction[];
    return raw
      .filter((t) => t.chargePointId === charger?.chargePointId)
      .sort(
        (a, b) =>
          new Date(b.startTimestamp).getTime() - new Date(a.startTimestamp).getTime()
      );
  }, [transactionsResp, charger?.chargePointId]);

  const logs = useMemo(() => {
    const raw = (events ?? []) as Event[];
    return raw
      .filter((e) => e.chargePointId === charger?.chargePointId)
      .sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }, [events, charger?.chargePointId]);

  const stats = useMemo(() => {
    const totalSessions = sessions.length;
    const activeSessions = sessions.filter((s) => s.status === "Active").length;

    const totalKwh = sessions.reduce((sum, s) => {
      if (s.meterStop != null && s.meterStart != null) {
        return sum + (s.meterStop - s.meterStart) / 1000;
      }
      return sum;
    }, 0);

    const revenue = sessions.reduce((sum, s) => sum + (s.totalCost ?? 0), 0);
    const connectors = charger?.connectors?.length ?? 0;
    const availableConnectors = (charger?.connectors ?? []).filter(
      (c) => c.status === "Available"
    ).length;

    return {
      totalSessions,
      activeSessions,
      totalKwh,
      revenue,
      connectors,
      availableConnectors,
    };
  }, [sessions, charger]);

  const isLoading =
    chargerLoading ||
    sessionsLoading ||
    transactionsLoading ||
    reservationsLoading ||
    eventsLoading;

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!chargerId || !charger) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Charger not found</p>
        <Link to="/chargers" className="mt-4 inline-block text-primary hover:underline">
          Back to Chargers
        </Link>
      </div>
    );
  }

  const chargerTyped = charger as ChargePoint;

  return (
    <div className="space-y-6 p-3 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to="/chargers"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Chargers
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{chargerTyped.name}</h1>
            <Badge variant={chargerTyped.status === "Available" ? "default" : "secondary"}>
              {chargerTyped.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {chargerTyped.vendor ?? "-"} · {chargerTyped.model ?? "-"} · OCPP {chargerTyped.ocppVersion}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {chargerTyped.locationName}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/locations/${chargerTyped.locationId}`}>View Location</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connectors</CardTitle>
            <PlugZap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.connectors}</div>
            <p className="text-xs text-muted-foreground">
              {stats.availableConnectors} available
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">{stats.activeSessions} active</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalKwh.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">kWh</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From session totals</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Connectors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(chargerTyped.connectors ?? []).map((c) => {
              const activeSession = sessions.find(
                (s) => s.connectorId === c.connectorId && s.status === "Active"
              );

              return (
                <Card key={c.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <PlugZap className="h-5 w-5 text-primary" />
                            <span className="font-semibold text-lg">
                              Connector {c.connectorId}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            ID: {c.id.split("-").pop()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            c.status === "Available"
                              ? "default"
                              : c.status === "Charging"
                                ? "secondary"
                                : c.status === "Faulted"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {c.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 border-t pt-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Type</span>
                          <span className="font-medium">{c.type ?? "-"}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Power</span>
                          <span className="font-medium">
                            {c.powerKw != null ? `${c.powerKw} kW` : "-"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Tariff</span>
                          <span className="font-medium text-primary">
                            {c.tariffName ?? "Default"}
                          </span>
                        </div>
                      </div>

                      {activeSession && (
                        <div className="rounded-md bg-blue-50 p-2 border border-blue-200">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-600" />
                            <div className="flex-1">
                              <p className="text-xs font-medium text-blue-900">
                                Active Session
                              </p>
                              <p className="text-xs text-blue-700">
                                {activeSession.userName ?? activeSession.idTag}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {c.transactionId && !activeSession && (
                        <div className="text-xs text-gray-500">
                          Transaction: #{c.transactionId}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="flex w-full overflow-x-auto">
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="reservations">Reservations</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="sessions" className="mt-4">
              {sessions.length === 0 ? (
                <p className="text-sm text-gray-500">No sessions found.</p>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction</TableHead>
                        <TableHead>Connector</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>RFID</TableHead>
                        <TableHead>Start</TableHead>
                        <TableHead>Stop</TableHead>
                        <TableHead>Energy</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessions.slice(0, 50).map((s) => {
                        const kwh =
                          s.meterStop != null && s.meterStart != null
                            ? (s.meterStop - s.meterStart) / 1000
                            : null;

                        return (
                          <TableRow key={s.id}>
                            <TableCell className="font-medium">#{s.transactionId}</TableCell>
                            <TableCell>{s.connectorId}</TableCell>
                            <TableCell>
                              {s.userId ? (
                                <Link to={`/users/${s.userId}`} className="text-primary hover:underline">
                                  {s.userName ?? s.userId}
                                </Link>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-sm">{s.idTag}</TableCell>
                            <TableCell>{new Date(s.startTimestamp).toLocaleString()}</TableCell>
                            <TableCell>
                              {s.stopTimestamp ? new Date(s.stopTimestamp).toLocaleString() : "-"}
                            </TableCell>
                            <TableCell>{kwh != null ? `${kwh.toFixed(2)} kWh` : "-"}</TableCell>
                            <TableCell>
                              {s.totalCost != null ? `$${Number(s.totalCost).toFixed(2)}` : "-"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={s.status === "Active" ? "default" : "secondary"}>
                                {s.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="transactions" className="mt-4">
              {transactions.length === 0 ? (
                <p className="text-sm text-gray-500">No transactions found.</p>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction</TableHead>
                        <TableHead>Connector</TableHead>
                        <TableHead>RFID</TableHead>
                        <TableHead>Start</TableHead>
                        <TableHead>Stop</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.slice(0, 50).map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">#{t.transactionId}</TableCell>
                          <TableCell>{t.connectorId}</TableCell>
                          <TableCell className="font-mono text-sm">{t.idTag}</TableCell>
                          <TableCell>{new Date(t.startTimestamp).toLocaleString()}</TableCell>
                          <TableCell>
                            {t.stopTimestamp ? new Date(t.stopTimestamp).toLocaleString() : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={t.status === "Active" ? "default" : "secondary"}>
                              {t.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="reservations" className="mt-4">
              {!reservations || reservations.length === 0 ? (
                <p className="text-sm text-gray-500">No reservations found.</p>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reservation</TableHead>
                        <TableHead>Connector</TableHead>
                        <TableHead>RFID</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservations.slice(0, 50).map((r) => (
                        <TableRow key={r.reservationId}>
                          <TableCell className="font-medium">#{r.reservationId}</TableCell>
                          <TableCell>{r.connectorId}</TableCell>
                          <TableCell className="font-mono text-sm">{r.idTag}</TableCell>
                          <TableCell>
                            {r.expiryDate ? new Date(r.expiryDate).toLocaleString() : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={r.status === "Active" ? "default" : "secondary"}>
                              {r.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="logs" className="mt-4">
              {logs.length === 0 ? (
                <p className="text-sm text-gray-500">No logs found.</p>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Connector</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Severity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.slice(0, 80).map((e) => (
                        <TableRow key={e.id}>
                          <TableCell>
                            {new Date(e.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell className="font-medium">{e.type}</TableCell>
                          <TableCell>{e.connectorId ?? "-"}</TableCell>
                          <TableCell className="max-w-[520px] truncate">{e.message}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                e.severity === "error"
                                  ? "destructive"
                                  : e.severity === "warning"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {e.severity ?? "info"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Device Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Charge Point ID</span>
              <span className="font-mono">{chargerTyped.chargePointId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Vendor</span>
              <span>{chargerTyped.vendor ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Model</span>
              <span>{chargerTyped.model ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Firmware</span>
              <span>{chargerTyped.firmwareVersion ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Last Heartbeat</span>
              <span>
                {chargerTyped.lastHeartbeat
                  ? new Date(chargerTyped.lastHeartbeat).toLocaleString()
                  : "-"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              Showing latest {Math.min(50, sessions.length)} sessions / {Math.min(80, logs.length)} logs
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Zap className="h-4 w-4" />
              Energy is estimated from meter start/stop where available
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              Revenue is summed from session `totalCost`
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

