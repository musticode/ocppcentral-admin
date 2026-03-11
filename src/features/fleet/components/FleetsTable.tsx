import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fleetApi } from "@/api";
import { isDemoMode } from "@/demo/demoMode";
import { useCompanyStore } from "@/store/company.store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Users, Activity } from "lucide-react";

export const FleetsTable = () => {
  const navigate = useNavigate();
  const companyId = useCompanyStore((state) => state.companyId);

  const { data: fleets, isLoading } = useQuery({
    queryKey: ["fleets", companyId],
    queryFn: () => fleetApi.getAllFleets(companyId ?? ""),
    enabled: isDemoMode || !!companyId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fleets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Loading fleets...</div>
        </CardContent>
      </Card>
    );
  }

  if (!fleets || fleets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fleets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No fleets found. Create your first fleet to get started.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleets</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">
                <Truck className="inline h-4 w-4 mr-1" />
                Vehicles
              </TableHead>
              <TableHead className="text-center">
                <Users className="inline h-4 w-4 mr-1" />
                Drivers
              </TableHead>
              <TableHead className="text-center">
                <Activity className="inline h-4 w-4 mr-1" />
                Sessions
              </TableHead>
              <TableHead className="text-right">Energy (kWh)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fleets.map((fleet) => (
              <TableRow
                key={fleet.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/fleet/${fleet.id}`)}
              >
                <TableCell>
                  <div>
                    <div className="font-medium">{fleet.name}</div>
                    {fleet.description && (
                      <div className="text-sm text-gray-500">
                        {fleet.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    {fleet.manager && (
                      <div className="text-sm">{fleet.manager}</div>
                    )}
                    {fleet.managerEmail && (
                      <div className="text-xs text-gray-500">
                        {fleet.managerEmail}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={fleet.status === "Active" ? "default" : "secondary"}
                  >
                    {fleet.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">{fleet.vehicleCount}</TableCell>
                <TableCell className="text-center">{fleet.driverCount}</TableCell>
                <TableCell className="text-center">
                  {fleet.totalSessions ?? 0}
                </TableCell>
                <TableCell className="text-right">
                  {fleet.totalEnergyConsumed?.toFixed(1) ?? 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
