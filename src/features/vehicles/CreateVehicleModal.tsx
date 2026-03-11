import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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

interface CreateVehicleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export const CreateVehicleModal = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateVehicleModalProps) => {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setFormData({
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await carsApi.createCar({
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
        chargingPort: (formData.chargingPort || undefined) as any,
        notes: formData.notes || undefined,
      });

      toast({
        title: "Vehicle created",
        description: "The vehicle has been created successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      onSuccess?.();
      onOpenChange(false);
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create vehicle.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Vehicle</DialogTitle>
          <DialogDescription>
            Add a new vehicle to your fleet. Fill in all required fields.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="make">
                Make <span className="text-red-500">*</span>
              </Label>
              <Input
                id="make"
                required
                value={formData.make}
                onChange={(e) => handleInputChange("make", e.target.value)}
                placeholder="e.g., Tesla"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">
                Model <span className="text-red-500">*</span>
              </Label>
              <Input
                id="model"
                required
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                placeholder="e.g., Model 3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">
                Year <span className="text-red-500">*</span>
              </Label>
              <Input
                id="year"
                type="number"
                required
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
                placeholder="e.g., 2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licensePlate">
                License Plate <span className="text-red-500">*</span>
              </Label>
              <Input
                id="licensePlate"
                required
                value={formData.licensePlate}
                onChange={(e) =>
                  handleInputChange("licensePlate", e.target.value)
                }
                placeholder="e.g., ABC-123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                placeholder="e.g., White"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vin">VIN</Label>
              <Input
                id="vin"
                value={formData.vin}
                onChange={(e) => handleInputChange("vin", e.target.value)}
                placeholder="Vehicle identification number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batteryCapacity">Battery Capacity (kWh)</Label>
              <Input
                id="batteryCapacity"
                type="number"
                value={formData.batteryCapacity}
                onChange={(e) =>
                  handleInputChange("batteryCapacity", e.target.value)
                }
                placeholder="e.g., 75"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="range">Range (km)</Label>
              <Input
                id="range"
                type="number"
                value={formData.range}
                onChange={(e) => handleInputChange("range", e.target.value)}
                placeholder="e.g., 450"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chargingPort">Charging Port</Label>
              <Select
                value={formData.chargingPort}
                onValueChange={(v) => handleInputChange("chargingPort", v)}
              >
                <SelectTrigger id="chargingPort">
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
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Optional internal notes"
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
              {isSubmitting ? "Creating..." : "Create Vehicle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
