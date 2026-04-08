import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { carsApi, fleetApi, transactionApi, usersApi } from "@/api";
import { isDemoMode } from "@/demo/demoMode";
import { useCompanyStore } from "@/store/company.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  BadgeCheck,
  CarFront,
  CreditCard,
  Activity,
  Battery,
  DollarSign,
  Users,
  Edit,
} from "lucide-react";
import { EditUserModal } from "./EditUserModal";

export const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const companyId = useCompanyStore((s) => s.companyId);
  const queryClient = useQueryClient();
  const [sessionsLimit, setSessionsLimit] = useState(100);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => usersApi.getUserById(userId!),
    enabled: !!userId,
  });

  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["user-vehicles", userId],
    queryFn: () => carsApi.getCars({ userId: userId ?? undefined }),
    enabled: !!userId,
  });

  const { data: sessionsResp, isLoading: sessionsLoading } = useQuery({
    queryKey: ["user-sessions", companyId, userId, sessionsLimit],
    queryFn: () => transactionApi.getSessionsByCompany(companyId ?? ""),
    enabled: (isDemoMode || !!companyId) && !!userId,
  });

  const { data: fleets, isLoading: fleetsLoading } = useQuery({
    queryKey: ["fleets", companyId],
    queryFn: () => fleetApi.getAllFleets(companyId ?? ""),
    enabled: isDemoMode || !!companyId,
  });

  const { data: fleetMemberships, isLoading: membershipsLoading } = useQuery({
    queryKey: ["user-fleet-memberships", (fleets ?? []).map((f) => f.id).join(","), userId],
    queryFn: async () => {
      const list = fleets ?? [];
      const results = await Promise.all(
        list.map(async (fleet) => {
          const drivers = await fleetApi.getFleetDrivers(fleet.id);
          const match = drivers.find((d) => d.userId === userId);
          if (!match) return null;
          return {
            fleetId: fleet.id,
            fleetName: fleet.name,
            fleetStatus: fleet.status,
            driverStatus: match.status,
            licenseNumber: match.licenseNumber,
            licenseExpiry: match.licenseExpiry,
          };
        })
      );
      return results.filter(Boolean) as Array<{
        fleetId: string;
        fleetName: string;
        fleetStatus: string;
        driverStatus: string;
        licenseNumber: string;
        licenseExpiry: string;
      }>;
    },
    enabled: !!userId && (fleets?.length ?? 0) > 0,
  });

  const sessions = useMemo(() => {
    const list = (sessionsResp?.data ?? []) as any[];

    const byUserId = list.filter((s) => s.userId === userId);

    // If backend doesn't return userId reliably, also match by RFID tags present for this user.
    // In demo data, userId and idTag are present.
    return byUserId
      .sort(
        (a, b) =>
          new Date(b.startTimestamp).getTime() - new Date(a.startTimestamp).getTime()
      )
      .slice(0, sessionsLimit);
  }, [sessionsResp, userId, sessionsLimit]);

  const rfidTags = useMemo(() => {
    const set = new Set<string>();
    for (const s of sessions) {
      if (s.idTag) set.add(String(s.idTag));
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [sessions]);

  const usage = useMemo(() => {
    const totalSessions = sessions.length;
    const activeSessions = sessions.filter((s) => s.status === "Active").length;

    const totalKwh = sessions.reduce((sum, s) => {
      if (s.meterStop != null && s.meterStart != null) {
        return sum + (s.meterStop - s.meterStart) / 1000;
      }
      return sum;
    }, 0);

    const totalCost = sessions.reduce((sum, s) => sum + (s.totalCost ?? 0), 0);

    return {
      totalSessions,
      activeSessions,
      totalKwh,
      totalCost,
    };
  }, [sessions]);

  const isLoading =
    userLoading || vehiclesLoading || sessionsLoading || fleetsLoading || membershipsLoading;

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!userId || !user) {
    return (
      <div className="p-6">
        <p className="text-gray-600">User not found</p>
        <Link to="/users" className="mt-4 inline-block text-primary hover:underline">
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-3 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to="/users"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>

          <div className="flex items-start gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{user.name}</h1>
              <p className="mt-1 text-gray-600">{user.email}</p>
            </div>
            <Badge variant="outline" className="capitalize">
              {user.role}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditModalOpen(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/rfid-tags">
              <CreditCard className="mr-2 h-4 w-4" />
              RFID Tags
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/sessions">
              <Activity className="mr-2 h-4 w-4" />
              Sessions
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RFID Cards</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rfidTags.length}</div>
            <p className="text-xs text-muted-foreground">Detected from sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles</CardTitle>
            <CarFront className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(vehicles ?? []).length}</div>
            <p className="text-xs text-muted-foreground">Owned vehicles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage.totalKwh.toFixed(1)} kWh</div>
            <p className="text-xs text-muted-foreground">
              {usage.totalSessions} sessions ({usage.activeSessions} active)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${usage.totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total charging cost</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">RFID Cards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rfidTags.length === 0 ? (
              <p className="text-sm text-gray-500">No RFID tags found for this user.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {rfidTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-mono">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <Separator />

            <div className="text-sm text-gray-500">
              RFID tags are derived from charging sessions (`idTag`). If you manage
              RFID tags explicitly, link them here.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fleet Membership</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!fleetMemberships || fleetMemberships.length === 0 ? (
              <p className="text-sm text-gray-500">User is not assigned to any fleet.</p>
            ) : (
              <div className="space-y-3">
                {fleetMemberships.map((m) => (
                  <div
                    key={m.fleetId}
                    className="flex items-start justify-between rounded-md border p-3"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{m.fleetName}</div>
                      <div className="text-xs text-gray-500">
                        License: {m.licenseNumber} · Expires: {m.licenseExpiry}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={m.fleetStatus === "Active" ? "default" : "secondary"}>
                        {m.fleetStatus}
                      </Badge>
                      <Badge variant="outline">{m.driverStatus}</Badge>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/fleet/${m.fleetId}`}>
                          <Users className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Charging Sessions (RFID)</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSessionsLimit((v) => Math.min(500, v + 100))}
            >
              Load more
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-sm text-gray-500">No sessions found for this user.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Charge Point</TableHead>
                    <TableHead>RFID</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Energy</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((s) => {
                    const durationMin =
                      s.startTimestamp && s.stopTimestamp
                        ? Math.max(
                          0,
                          Math.floor(
                            (new Date(s.stopTimestamp).getTime() -
                              new Date(s.startTimestamp).getTime()) /
                            (1000 * 60)
                          )
                        )
                        : s.startTimestamp && s.status === "Active"
                          ? Math.max(
                            0,
                            Math.floor(
                              (Date.now() - new Date(s.startTimestamp).getTime()) /
                              (1000 * 60)
                            )
                          )
                          : null;

                    const kwh =
                      s.meterStop != null && s.meterStart != null
                        ? (s.meterStop - s.meterStart) / 1000
                        : null;

                    return (
                      <TableRow key={String(s.transactionId)}>
                        <TableCell className="font-medium">#{s.transactionId}</TableCell>
                        <TableCell className="font-mono text-sm">{s.chargePointId}</TableCell>
                        <TableCell className="font-mono text-sm">{s.idTag ?? "-"}</TableCell>
                        <TableCell>{new Date(s.startTimestamp).toLocaleString()}</TableCell>
                        <TableCell>
                          {durationMin != null ? `${durationMin} min` : "-"}
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

          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div>
              Showing {sessions.length} sessions
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4" />
              <span>Filtered by user</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Owned Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          {!vehicles || vehicles.length === 0 ? (
            <p className="text-sm text-gray-500">No vehicles linked to this user.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((v) => (
                <Link
                  key={v.id}
                  to={`/vehicles/${v.id}`}
                  className="rounded-md border p-3 hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-900">
                    {v.make} {v.model}
                  </div>
                  <div className="text-sm text-gray-600">{v.licensePlate}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant={v.isActive ? "default" : "secondary"}>
                      {v.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">{v.chargingPort ?? "-"}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EditUserModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        user={user ?? null}
        onSuccess={() => {
          setEditModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ["user", userId] });
          queryClient.invalidateQueries({ queryKey: ["users"] });
        }}
      />
    </div>
  );
};
