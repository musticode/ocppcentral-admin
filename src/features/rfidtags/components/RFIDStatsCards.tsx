import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { transactionApi, usersApi } from "@/api";
import { isDemoMode } from "@/demo/demoMode";
import { useCompanyStore } from "@/store/company.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Users, Activity, Clock } from "lucide-react";

export const RFIDStatsCards = () => {
  const companyId = useCompanyStore((s) => s.companyId);

  const { data: sessionsResp, isLoading: sessionsLoading } = useQuery({
    queryKey: ["rfid-sessions", companyId],
    queryFn: () => transactionApi.getSessionsByCompany(companyId ?? ""),
    enabled: isDemoMode || !!companyId,
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAllUsers(),
  });

  const sessions = useMemo(() => (sessionsResp?.data ?? []) as any[], [sessionsResp]);

  const stats = useMemo(() => {
    const now = Date.now();
    const tags = new Set<string>();
    const usersWithTags = new Set<string>();

    let sessionsLast24h = 0;

    for (const s of sessions) {
      if (s.idTag) tags.add(String(s.idTag));
      if (s.userId) usersWithTags.add(String(s.userId));

      if (s.startTimestamp) {
        const t = new Date(s.startTimestamp).getTime();
        if (now - t <= 1000 * 60 * 60 * 24) sessionsLast24h += 1;
      }
    }

    // Active tag heuristic: seen in last 30 days
    let activeTags = 0;
    for (const tag of tags) {
      const last = sessions
        .filter((s) => String(s.idTag ?? "") === tag)
        .sort((a, b) => new Date(b.startTimestamp).getTime() - new Date(a.startTimestamp).getTime())[0];
      if (last?.startTimestamp) {
        const t = new Date(last.startTimestamp).getTime();
        if (now - t <= 1000 * 60 * 60 * 24 * 30) activeTags += 1;
      }
    }

    return {
      totalTags: tags.size,
      activeTags,
      assignedUsers: usersWithTags.size,
      sessionsLast24h,
      totalUsers: users?.length ?? 0,
    };
  }, [sessions, users]);

  if (sessionsLoading || usersLoading) {
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
          <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTags}</div>
          <p className="text-xs text-muted-foreground">{stats.activeTags} active (30d)</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assigned Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.assignedUsers}</div>
          <p className="text-xs text-muted-foreground">Out of {stats.totalUsers} users</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sessions (24h)</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.sessionsLast24h}</div>
          <p className="text-xs text-muted-foreground">Recent usage</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sessions (Total)</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sessions.length}</div>
          <p className="text-xs text-muted-foreground">All recorded sessions</p>
        </CardContent>
      </Card>
    </div>
  );
};
