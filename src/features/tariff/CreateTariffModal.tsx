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
import { Textarea } from "@/components/ui/textarea";
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
    chargePointId: "",
    connector: "",
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

  const handleClose = () => {
    console.log("handleClose");
    onOpenChange(false);
    setFormData({
      name: "",
      chargePointId: "",
      connector: "",
      description: "",
      currency: "USD",
      energyPrice: "",
      parkingPrice: "",
      transactionPrice: "",
      startFee: "",
    });
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
    // Reset form
    setFormData({
      name: "",
      chargePointId: "",
      connector: "",
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

            <div className="space-y-2">
              <Label htmlFor="chargePointId">
                Charge Point ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="chargePointId"
                required
                type="text"
                value={formData.chargePointId}
                onChange={(e) =>
                  handleInputChange("chargePointId", e.target.value)
                }
                placeholder="e.g., CP123456789"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="connector">
                Connector <span className="text-red-500">*</span>
              </Label>
              <Input
                id="connector"
                type="number"
                value={formData.connector}
                onChange={(e) => handleInputChange("connector", e.target.value)}
                placeholder="Connector ID..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
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
              <Select
                value={formData.currency}
                onValueChange={(v) => handleInputChange("currency", v)}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="SEK">SEK</SelectItem>
                </SelectContent>
              </Select>
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
              onClick={handleClose}
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
