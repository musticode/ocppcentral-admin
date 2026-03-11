import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Power, Trash2 } from "lucide-react";
import { carsApi } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { EditVehicleModal } from "@/features/vehicles/EditVehicleModal";

export const VehicleDetail = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editOpen, setEditOpen] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => carsApi.getCarById(vehicleId!),
    enabled: !!vehicleId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    queryClient.invalidateQueries({ queryKey: ["vehicle", vehicleId] });
  };

  const handleToggleActive = async () => {
    if (!vehicleId || !vehicle) return;

    setIsWorking(true);
    try {
      if (vehicle.isActive) {
        await carsApi.deactivateCar(vehicleId);
      } else {
        await carsApi.activateCar(vehicleId);
      }

      toast({
        title: vehicle.isActive ? "Vehicle deactivated" : "Vehicle activated",
        description: "The vehicle status has been updated.",
      });
      invalidate();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update vehicle status.",
        variant: "destructive",
      });
    } finally {
      setIsWorking(false);
    }
  };

  const handleDelete = async () => {
    if (!vehicleId) return;

    const ok = window.confirm("Delete this vehicle? This action cannot be undone.");
    if (!ok) return;

    setIsWorking(true);
    try {
      await carsApi.deleteCar(vehicleId);
      toast({
        title: "Vehicle deleted",
        description: "The vehicle has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      navigate("/vehicles", { replace: true });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete vehicle.",
        variant: "destructive",
      });
    } finally {
      setIsWorking(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!vehicle) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Vehicle not found</p>
        <Link to="/vehicles" className="mt-4 inline-block text-primary hover:underline">
          Back to Vehicles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to="/vehicles"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Vehicles
          </Link>
          <div className="flex items-start gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="mt-1 text-gray-600">{vehicle.licensePlate}</p>
            </div>
            <Badge variant={vehicle.isActive ? "default" : "secondary"}>
              {vehicle.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
            disabled={isWorking}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Vehicle
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleActive}
            disabled={isWorking}
          >
            <Power className="mr-2 h-4 w-4" />
            {vehicle.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isWorking}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <EditVehicleModal
        open={editOpen}
        onOpenChange={setEditOpen}
        vehicle={vehicle}
        onSuccess={invalidate}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between gap-6">
              <span className="text-gray-500">Make</span>
              <span className="font-medium text-gray-900">{vehicle.make}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-gray-500">Model</span>
              <span className="font-medium text-gray-900">{vehicle.model}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-gray-500">Year</span>
              <span className="font-medium text-gray-900">{vehicle.year}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-gray-500">License Plate</span>
              <span className="font-mono text-gray-900">{vehicle.licensePlate}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-gray-500">Charging Port</span>
              <span className="font-medium text-gray-900">
                {vehicle.chargingPort ?? "-"}
              </span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-gray-500">Battery Capacity</span>
              <span className="font-medium text-gray-900">
                {vehicle.batteryCapacity != null ? `${vehicle.batteryCapacity} kWh` : "-"}
              </span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-gray-500">Range</span>
              <span className="font-medium text-gray-900">
                {vehicle.range != null ? `${vehicle.range} km` : "-"}
              </span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-gray-500">VIN</span>
              <span className="font-mono text-gray-900">{vehicle.vin ?? "-"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            {vehicle.notes ? (
              <div className="whitespace-pre-wrap">{vehicle.notes}</div>
            ) : (
              <div className="text-gray-500">No notes</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
