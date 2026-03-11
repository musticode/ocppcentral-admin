import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fleetApi } from "@/api";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Mail, CreditCard } from "lucide-react";
import { AssignDriverModal } from "./AssignDriverModal";

interface FleetDriversTableProps {
  fleetId: string;
}

export const FleetDriversTable = ({ fleetId }: FleetDriversTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const { data: drivers, isLoading } = useQuery({
    queryKey: ["fleet-drivers", fleetId],
    queryFn: () => fleetApi.getFleetDrivers(fleetId),
  });

  const removeMutation = useMutation({
    mutationFn: (driverId: string) =>
      fleetApi.removeDriverFromFleet(fleetId, driverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleet-drivers", fleetId] });
      queryClient.invalidateQueries({ queryKey: ["fleet", fleetId] });
      toast({
        title: "Success",
        description: "Driver removed from fleet",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove driver",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Inactive":
        return "secondary";
      case "On Leave":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fleet Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Loading drivers...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Fleet Drivers</CardTitle>
        <Button onClick={() => setAssignModalOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Assign Driver
        </Button>
      </CardHeader>
      <CardContent>
        {!drivers || drivers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No drivers assigned to this fleet. Click "Assign Driver" to add one.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </TableHead>
                <TableHead>
                  <CreditCard className="inline h-4 w-4 mr-1" />
                  License
                </TableHead>
                <TableHead>Assigned Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sessions</TableHead>
                <TableHead>Energy (kWh)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell>
                    <div className="font-medium">{driver.userName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {driver.userEmail}
                    </div>
                  </TableCell>
                  <TableCell>
                    {driver.licenseNumber ? (
                      <div>
                        <div className="text-sm">{driver.licenseNumber}</div>
                        {driver.licenseExpiry && (
                          <div className="text-xs text-gray-500">
                            Exp: {new Date(driver.licenseExpiry).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {driver.assignedVehicleName ? (
                      <div className="text-sm">{driver.assignedVehicleName}</div>
                    ) : (
                      <span className="text-sm text-gray-400">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(driver.status)}>
                      {driver.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{driver.totalSessions ?? 0}</TableCell>
                  <TableCell>
                    {driver.totalEnergyConsumed?.toFixed(1) ?? 0}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMutation.mutate(driver.id)}
                      disabled={removeMutation.isPending}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <AssignDriverModal
        fleetId={fleetId}
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
      />
    </Card>
  );
};
