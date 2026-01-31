import { useState, useEffect } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { locationApi } from "@/api";
import type { Location } from "@/types/ocpp";

interface EditLocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: Location | null;
  onSuccess?: () => void;
}

export const EditLocationModal = ({
  open,
  onOpenChange,
  location,
  onSuccess,
}: EditLocationModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    if (location && open) {
      setFormData({
        name: location.name,
        address: location.address,
        city: location.city,
        country: location.country,
        zipCode: location.zipCode,
        latitude: location.latitude != null ? String(location.latitude) : "",
        longitude: location.longitude != null ? String(location.longitude) : "",
      });
    }
  }, [location, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;
    setIsSubmitting(true);

    try {
      await locationApi.updateLocation(location.id, {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        zipCode: formData.zipCode,
        latitude: formData.latitude
          ? parseFloat(formData.latitude)
          : undefined,
        longitude: formData.longitude
          ? parseFloat(formData.longitude)
          : undefined,
      });
      toast({
        title: "Location updated",
        description: "The location has been updated successfully.",
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update location.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!location) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Location</DialogTitle>
          <DialogDescription>
            Update location details. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-name">
                Location Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Downtown Station"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-address">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-address"
                required
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="e.g., 123 Main Street"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-city">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-city"
                required
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="e.g., San Francisco"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-country">
                Country <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-country"
                required
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                placeholder="e.g., USA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-zipCode">
                Zip / Postal Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-zipCode"
                required
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                placeholder="e.g., 94102"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-latitude">Latitude (optional)</Label>
              <Input
                id="edit-latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => handleInputChange("latitude", e.target.value)}
                placeholder="e.g., 37.7749"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-longitude">Longitude (optional)</Label>
              <Input
                id="edit-longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => handleInputChange("longitude", e.target.value)}
                placeholder="e.g., -122.4194"
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
