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
import { Plus, Battery, MapPin } from "lucide-react";
import { AssignVehicleModal } from "./AssignVehicleModal";

interface FleetVehiclesTableProps {
  fleetId: string;
}

export const FleetVehiclesTable = ({ fleetId }: FleetVehiclesTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["fleet-vehicles", fleetId],
    queryFn: () => fleetApi.getFleetVehicles(fleetId),
  });

  const removeMutation = useMutation({
    mutationFn: (vehicleId: string) =>
      fleetApi.removeVehicleFromFleet(fleetId, vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleet-vehicles", fleetId] });
      queryClient.invalidateQueries({ queryKey: ["fleet", fleetId] });
      toast({
        title: "Success",
        description: "Vehicle removed from fleet",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove vehicle",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "default";
      case "In Use":
        return "secondary";
      case "Charging":
        return "outline";
      case "Maintenance":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fleet Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Loading vehicles...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Fleet Vehicles</CardTitle>
        <Button onClick={() => setAssignModalOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Assign Vehicle
        </Button>
      </CardHeader>
      <CardContent>
        {!vehicles || vehicles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No vehicles assigned to this fleet. Click "Assign Vehicle" to add one.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <Battery className="inline h-4 w-4 mr-1" />
                  Battery
                </TableHead>
                <TableHead>
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location
                </TableHead>
                <TableHead>Sessions</TableHead>
                <TableHead>Energy (kWh)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {vehicle.car?.make} {vehicle.car?.model}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vehicle.car?.licensePlate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {vehicle.assignedDriverName ? (
                      <div className="text-sm">{vehicle.assignedDriverName}</div>
                    ) : (
                      <span className="text-sm text-gray-400">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(vehicle.status)}>
                      {vehicle.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {vehicle.batteryLevel !== undefined ? (
                      <div className="flex items-center gap-2">
                        <div className="text-sm">{vehicle.batteryLevel}%</div>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${vehicle.batteryLevel > 50
                                ? "bg-green-500"
                                : vehicle.batteryLevel > 20
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            style={{ width: `${vehicle.batteryLevel}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {vehicle.currentLocation || "-"}
                    </div>
                  </TableCell>
                  <TableCell>{vehicle.totalSessions ?? 0}</TableCell>
                  <TableCell>
                    {vehicle.totalEnergyConsumed?.toFixed(1) ?? 0}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMutation.mutate(vehicle.id)}
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

      <AssignVehicleModal
        fleetId={fleetId}
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
      />
    </Card>
  );
};
