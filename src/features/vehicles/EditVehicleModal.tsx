import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Car } from "@/types/api";
import { carsApi } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface EditVehicleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Car | null;
  onSuccess?: () => void;
}

const chargingPorts = [
  "Type 1",
  "Type 2",
  "CCS",
  "CHAdeMO",
  "Tesla",
  "Other",
] as const;

export const EditVehicleModal = ({
  open,
  onOpenChange,
  vehicle,
  onSuccess,
}: EditVehicleModalProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    color: "",
    licensePlate: "",
    vin: "",
    batteryCapacity: "",
    range: "",
    chargingPort: "",
    notes: "",
  });

  useEffect(() => {
    if (!vehicle || !open) return;

    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: String(vehicle.year),
      color: vehicle.color ?? "",
      licensePlate: vehicle.licensePlate,
      vin: vehicle.vin ?? "",
      batteryCapacity:
        vehicle.batteryCapacity != null ? String(vehicle.batteryCapacity) : "",
      range: vehicle.range != null ? String(vehicle.range) : "",
      chargingPort: vehicle.chargingPort ?? "",
      notes: vehicle.notes ?? "",
    });
  }, [vehicle, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;

    setIsSubmitting(true);
    try {
      await carsApi.updateCar(vehicle.id, {
        make: formData.make,
        model: formData.model,
        year: Number(formData.year),
        color: formData.color || undefined,
        licensePlate: formData.licensePlate,
        vin: formData.vin || undefined,
        batteryCapacity: formData.batteryCapacity
          ? Number(formData.batteryCapacity)
          : undefined,
        range: formData.range ? Number(formData.range) : undefined,
        chargingPort: formData.chargingPort || undefined,
        notes: formData.notes || undefined,
      });

      toast({
        title: "Vehicle updated",
        description: "The vehicle has been updated successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle", vehicle.id] });
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update vehicle.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
          <DialogDescription>
            Update vehicle details. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-make">
                Make <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-make"
                required
                value={formData.make}
                onChange={(e) => handleInputChange("make", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-model">
                Model <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-model"
                required
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-year">
                Year <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-year"
                type="number"
                required
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-licensePlate">
                License Plate <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-licensePlate"
                required
                value={formData.licensePlate}
                onChange={(e) =>
                  handleInputChange("licensePlate", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-color">Color</Label>
              <Input
                id="edit-color"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-vin">VIN</Label>
              <Input
                id="edit-vin"
                value={formData.vin}
                onChange={(e) => handleInputChange("vin", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-batteryCapacity">Battery Capacity (kWh)</Label>
              <Input
                id="edit-batteryCapacity"
                type="number"
                value={formData.batteryCapacity}
                onChange={(e) =>
                  handleInputChange("batteryCapacity", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-range">Range (km)</Label>
              <Input
                id="edit-range"
                type="number"
                value={formData.range}
                onChange={(e) => handleInputChange("range", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-chargingPort">Charging Port</Label>
              <Select
                value={formData.chargingPort}
                onValueChange={(v) => handleInputChange("chargingPort", v)}
              >
                <SelectTrigger id="edit-chargingPort">
                  <SelectValue placeholder="Select charging port" />
                </SelectTrigger>
                <SelectContent>
                  {chargingPorts.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
