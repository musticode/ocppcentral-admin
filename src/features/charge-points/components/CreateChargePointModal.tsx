import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { useToast } from "@/components/ui/use-toast";
import { chargePointApi } from "@/api";
import { useQuery } from "@tanstack/react-query";

interface CreateChargePointModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreateChargePointModal = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateChargePointModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    chargePointId: "",
    locationId: "",
    model: "",
    vendor: "",
    ocppVersion: "1.6",
    connectorCount: "1",
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: () => chargePointApi.getLocations(),
    enabled: open,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await chargePointApi.createChargePoint({
        name: formData.name,
        chargePointId: formData.chargePointId,
        locationId: formData.locationId,
        model: formData.model || undefined,
        vendor: formData.vendor || undefined,
        ocppVersion: formData.ocppVersion,
        connectorCount: parseInt(formData.connectorCount, 10),
      });
      toast({
        title: "Charge point created",
        description: "The charge point has been created successfully.",
      });
      onSuccess?.();
      onOpenChange(false);
      setFormData({
        name: "",
        chargePointId: "",
        locationId: "",
        model: "",
        vendor: "",
        ocppVersion: "1.6",
        connectorCount: "1",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create charge point.",
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
          <DialogTitle>Create New Charge Point</DialogTitle>
          <DialogDescription>
            Register a new charge point. Fill in all required fields.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Charger 1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chargePointId">
                Charge Point ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="chargePointId"
                required
                value={formData.chargePointId}
                onChange={(e) =>
                  handleInputChange("chargePointId", e.target.value)
                }
                placeholder="e.g., CP-001"
              />
              <p className="text-xs text-gray-500">
                Unique identifier used in OCPP communication
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="locationId">
                Location <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.locationId}
                onValueChange={(v) => handleInputChange("locationId", v)}
                required
              >
                <SelectTrigger id="locationId">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.length > 0 &&
                    locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="connectorCount">
                Connector Count <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.connectorCount}
                onValueChange={(v) => handleInputChange("connectorCount", v)}
              >
                <SelectTrigger id="connectorCount">
                  <SelectValue placeholder="Select count" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 4, 8].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ocppVersion">OCPP Version</Label>
              <Select
                value={formData.ocppVersion}
                onValueChange={(v) => handleInputChange("ocppVersion", v)}
              >
                <SelectTrigger id="ocppVersion">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.6">OCPP 1.6</SelectItem>
                  <SelectItem value="2.0.1">OCPP 2.0.1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                placeholder="e.g., AC Wallbox"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                value={formData.vendor}
                onChange={(e) => handleInputChange("vendor", e.target.value)}
                placeholder="e.g., ChargePoint Inc"
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
              {isSubmitting ? "Creating..." : "Create Charge Point"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
