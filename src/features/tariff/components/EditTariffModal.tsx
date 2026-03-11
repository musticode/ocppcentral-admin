import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tariffApi } from "@/api";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tariff } from "@/types/api";

interface EditTariffModalProps {
  tariff: Tariff;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditTariffModal = ({
  tariff,
  open,
  onOpenChange,
}: EditTariffModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: tariff.name,
    description: tariff.description || "",
    currency: tariff.currency,
    pricePerKwh: tariff.pricePerKwh?.toString() || "",
    pricePerMinute: tariff.pricePerMinute?.toString() || "",
    pricePerSession: tariff.pricePerSession?.toString() || "",
    taxRate: tariff.taxRate ? (tariff.taxRate * 100).toString() : "",
    validFrom: tariff.validFrom.split("T")[0] || "",
    validTo: tariff.validTo?.split("T")[0] || "",
  });

  useEffect(() => {
    setFormData({
      name: tariff.name,
      description: tariff.description || "",
      currency: tariff.currency,
      pricePerKwh: tariff.pricePerKwh?.toString() || "",
      pricePerMinute: tariff.pricePerMinute?.toString() || "",
      pricePerSession: tariff.pricePerSession?.toString() || "",
      taxRate: tariff.taxRate ? (tariff.taxRate * 100).toString() : "",
      validFrom: tariff.validFrom.split("T")[0] || "",
      validTo: tariff.validTo?.split("T")[0] || "",
    });
  }, [tariff]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => tariffApi.updateTariff(tariff.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tariffs"] });
      toast({
        title: "Success",
        description: "Tariff updated successfully",
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update tariff",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData: any = {
      name: formData.name,
      description: formData.description || undefined,
      currency: formData.currency,
      validFrom: formData.validFrom,
      validTo: formData.validTo || undefined,
    };

    if (formData.pricePerKwh) {
      updateData.pricePerKwh = parseFloat(formData.pricePerKwh);
    }
    if (formData.pricePerMinute) {
      updateData.pricePerMinute = parseFloat(formData.pricePerMinute);
    }
    if (formData.pricePerSession) {
      updateData.pricePerSession = parseFloat(formData.pricePerSession);
    }
    if (formData.taxRate) {
      updateData.taxRate = parseFloat(formData.taxRate) / 100;
    }

    updateMutation.mutate(updateData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Tariff</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Tariff Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Standard Rate"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) =>
                  setFormData({ ...formData, currency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="TRY">TRY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Tariff description"
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="pricePerKwh">Price per kWh</Label>
              <Input
                id="pricePerKwh"
                type="number"
                step="0.001"
                value={formData.pricePerKwh}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerKwh: e.target.value })
                }
                placeholder="0.250"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerMinute">Price per Minute</Label>
              <Input
                id="pricePerMinute"
                type="number"
                step="0.001"
                value={formData.pricePerMinute}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerMinute: e.target.value })
                }
                placeholder="0.050"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerSession">Price per Session</Label>
              <Input
                id="pricePerSession"
                type="number"
                step="0.01"
                value={formData.pricePerSession}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerSession: e.target.value })
                }
                placeholder="2.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              step="0.1"
              value={formData.taxRate}
              onChange={(e) =>
                setFormData({ ...formData, taxRate: e.target.value })
              }
              placeholder="20.0"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="validFrom">Valid From *</Label>
              <Input
                id="validFrom"
                type="date"
                value={formData.validFrom}
                onChange={(e) =>
                  setFormData({ ...formData, validFrom: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validTo">Valid To</Label>
              <Input
                id="validTo"
                type="date"
                value={formData.validTo}
                onChange={(e) =>
                  setFormData({ ...formData, validTo: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Tariff"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
