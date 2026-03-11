import { useQuery } from "@tanstack/react-query";
import { tariffApi } from "@/api";
import { useCompanyStore } from "@/store/company.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, TrendingUp, Calendar } from "lucide-react";

export const TariffStatsCards = () => {
  const companyId = useCompanyStore((state) => state.companyId);

  const { data: tariffs, isLoading } = useQuery({
    queryKey: ["tariffs", companyId],
    queryFn: () => tariffApi.getTariffsByCompany(companyId ?? ""),
    enabled: !!companyId,
  });

  const activeTariffs = tariffs?.filter((t) => t.isActive) ?? [];
  const avgPricePerKwh =
    tariffs && tariffs.length > 0
      ? tariffs.reduce((sum, t) => sum + (t.pricePerKwh ?? 0), 0) / tariffs.length
      : 0;
  const avgPricePerMinute =
    tariffs && tariffs.length > 0
      ? tariffs.reduce((sum, t) => sum + (t.pricePerMinute ?? 0), 0) / tariffs.length
      : 0;

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
          <CardTitle className="text-sm font-medium">Total Tariffs</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tariffs?.length ?? 0}</div>
          <p className="text-xs text-muted-foreground">
            {activeTariffs.length} active
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Price/kWh</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${avgPricePerKwh.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            Average energy rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Price/Min</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${avgPricePerMinute.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            Average time rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeTariffs.length}</div>
          <p className="text-xs text-muted-foreground">
            Currently in use
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
