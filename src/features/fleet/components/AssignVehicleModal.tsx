import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fleetApi, carsApi } from "@/api";
import { useCompanyStore } from "@/store/company.store";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AssignVehicleToFleetRequest } from "@/types/api";

interface AssignVehicleModalProps {
  fleetId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AssignVehicleModal = ({
  fleetId,
  open,
  onOpenChange,
}: AssignVehicleModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const companyId = useCompanyStore((state) => state.companyId);

  const [formData, setFormData] = useState<AssignVehicleToFleetRequest>({
    carId: "",
    status: "Available",
  });

  const { data: vehicles } = useQuery({
    queryKey: ["cars", companyId],
    queryFn: () => carsApi.getCarsByCompany(companyId ?? ""),
    enabled: !!companyId && open,
  });

  const assignMutation = useMutation({
    mutationFn: (data: AssignVehicleToFleetRequest) =>
      fleetApi.assignVehicleToFleet(fleetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleet-vehicles", fleetId] });
      queryClient.invalidateQueries({ queryKey: ["fleet", fleetId] });
      toast({
        title: "Success",
        description: "Vehicle assigned to fleet successfully",
      });
      onOpenChange(false);
      setFormData({ carId: "", status: "Available" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to assign vehicle",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.carId) {
      toast({
        title: "Error",
        description: "Please select a vehicle",
        variant: "destructive",
      });
      return;
    }
    assignMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Vehicle to Fleet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="carId">Select Vehicle *</Label>
            <Select
              value={formData.carId}
              onValueChange={(value) =>
                setFormData({ ...formData, carId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles?.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Initial Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "Available" | "In Use" | "Maintenance" | "Charging") =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="In Use">In Use</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Charging">Charging</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={assignMutation.isPending}>
              {assignMutation.isPending ? "Assigning..." : "Assign Vehicle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
