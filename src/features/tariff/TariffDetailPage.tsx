import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { tariffApi } from "@/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  MapPin,
  Zap,
  FileText,
  Percent,
} from "lucide-react";

export const TariffDetailPage = () => {
  const { tariffId } = useParams<{ tariffId: string }>();

  const { data: tariff, isLoading } = useQuery({
    queryKey: ["tariff", tariffId],
    queryFn: () => tariffApi.getTariffById(tariffId ?? ""),
    enabled: !!tariffId,
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!tariff) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Tariff not found</p>
        <Link to="/tariff" className="mt-4 inline-block text-primary hover:underline">
          Back to Tariffs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to="/tariff"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tariffs
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{tariff.name}</h1>
            <Badge variant={tariff.isActive ? "default" : "secondary"}>
              {tariff.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          {tariff.description && (
            <p className="mt-1 text-sm text-gray-500">{tariff.description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/tariff">Manage Tariffs</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price per kWh</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tariff.pricePerKwh !== undefined
                ? `${tariff.currency} ${tariff.pricePerKwh.toFixed(3)}`
                : "-"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price per Minute</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tariff.pricePerMinute !== undefined
                ? `${tariff.currency} ${tariff.pricePerMinute.toFixed(3)}`
                : "-"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Fee</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tariff.pricePerSession !== undefined
                ? `${tariff.currency} ${tariff.pricePerSession.toFixed(2)}`
                : "-"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tariff.taxRate !== undefined ? `${(tariff.taxRate * 100).toFixed(1)}%` : "-"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Validity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div className="text-sm">
                <div className="text-gray-500">Valid From</div>
                <div className="font-medium text-gray-900">
                  {new Date(tariff.validFrom).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div className="text-sm">
                <div className="text-gray-500">Valid To</div>
                <div className="font-medium text-gray-900">
                  {tariff.validTo ? new Date(tariff.validTo).toLocaleString() : "No end date"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scope</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Company</span>
              </div>
              <span className="text-sm text-gray-600">{tariff.companyId ?? "-"}</span>
            </div>

            <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Charge Point</span>
              </div>
              <span className="text-sm text-gray-600">{tariff.chargePointId ?? "Company-wide"}</span>
            </div>

            <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Connector</span>
              </div>
              <span className="text-sm text-gray-600">{tariff.connectorId ?? "All"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Tariff ID</span>
            <span className="font-mono text-gray-900">{tariff.id}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Created</span>
            <span className="text-gray-900">{new Date(tariff.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Updated</span>
            <span className="text-gray-900">{new Date(tariff.updatedAt).toLocaleString()}</span>
          </div>
          {tariff.description && (
            <>
              <Separator />
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500">Description</span>
              </div>
              <div className="text-gray-700">{tariff.description}</div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TariffDetailPage;
