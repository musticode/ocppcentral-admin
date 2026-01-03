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
import { useToast } from "@/components/ui/use-toast";

interface CreateTariffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreateTariffModal = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateTariffModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    currency: "USD",
    energyPrice: "",
    parkingPrice: "",
    transactionPrice: "",
    startFee: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    toast({
      title: "Tariff created",
      description: "The tariff has been created successfully.",
    });
    onSuccess?.();
    onOpenChange(false);
    // Reset form
    setFormData({
      name: "",
      description: "",
      currency: "USD",
      energyPrice: "",
      parkingPrice: "",
      transactionPrice: "",
      startFee: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Tariff</DialogTitle>
          <DialogDescription>
            Create a new tariff plan for charging sessions. Fill in all required
            fields.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">
                Tariff Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Standard Tariff"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Tariff description..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">
                Currency <span className="text-red-500">*</span>
              </Label>
              <select
                id="currency"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="SEK">SEK</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="energyPrice">
                Energy Price (per kWh) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="energyPrice"
                type="number"
                step="0.01"
                required
                value={formData.energyPrice}
                onChange={(e) =>
                  handleInputChange("energyPrice", e.target.value)
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parkingPrice">Parking Price (per hour)</Label>
              <Input
                id="parkingPrice"
                type="number"
                step="0.01"
                value={formData.parkingPrice}
                onChange={(e) =>
                  handleInputChange("parkingPrice", e.target.value)
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionPrice">Transaction Price</Label>
              <Input
                id="transactionPrice"
                type="number"
                step="0.01"
                value={formData.transactionPrice}
                onChange={(e) =>
                  handleInputChange("transactionPrice", e.target.value)
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startFee">Start Fee</Label>
              <Input
                id="startFee"
                type="number"
                step="0.01"
                value={formData.startFee}
                onChange={(e) => handleInputChange("startFee", e.target.value)}
                placeholder="0.00"
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
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Creating..." : "Create Tariff"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
