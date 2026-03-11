import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, Briefcase, UserCog } from "lucide-react";

export const UsersStatsCards = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAllUsers(),
  });

  const list = users ?? [];
  const total = list.length;
  const admins = list.filter((u) => (u.role ?? "").toLowerCase() === "admin").length;
  const operators = list.filter((u) => (u.role ?? "").toLowerCase() === "operator").length;
  const managers = list.filter((u) => (u.role ?? "").toLowerCase() === "manager").length;

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
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground">All accounts</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Admins</CardTitle>
          <Shield className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{admins}</div>
          <p className="text-xs text-muted-foreground">Full access</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Operators</CardTitle>
          <UserCog className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{operators}</div>
          <p className="text-xs text-muted-foreground">Operational staff</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Managers</CardTitle>
          <Briefcase className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{managers}</div>
          <p className="text-xs text-muted-foreground">Business users</p>
        </CardContent>
      </Card>
    </div>
  );
};
