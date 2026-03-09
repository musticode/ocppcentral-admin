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
import { reservationApi, chargePointApi } from "@/api";
import { useQuery } from "@tanstack/react-query";
import type { CreateReservationRequest } from "@/types/api";

interface CreateReservationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreateReservationModal = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateReservationModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    chargePointId: "",
    connectorId: "1",
    idTag: "",
    expiryDate: "",
  });

  const { data: chargePoints = [] } = useQuery({
    queryKey: ["chargePoints"],
    queryFn: async () => {
      const response = await chargePointApi.getChargePoints();
      return response.data || [];
    },
    enabled: open,
  });

  const selectedChargePoint = chargePoints.find(
    (cp) => cp.id === formData.chargePointId
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const requestData: CreateReservationRequest = {
        chargePointId: formData.chargePointId,
        connectorId: parseInt(formData.connectorId, 10),
        idTag: formData.idTag,
        expiryDate: new Date(formData.expiryDate).toISOString(),
      };

      const validationResponse = await reservationApi.validateReservation({
        chargePointId: requestData.chargePointId,
        connectorId: requestData.connectorId,
        expiryDate: requestData.expiryDate,
      });

      if (!validationResponse.valid) {
        toast({
          title: "Validation Failed",
          description: validationResponse.message || "Cannot create reservation",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      await reservationApi.createReservation(requestData);
      
      toast({
        title: "Reservation created",
        description: "The reservation has been created successfully.",
      });
      
      onSuccess?.();
      onOpenChange(false);
      setFormData({
        chargePointId: "",
        connectorId: "1",
        idTag: "",
        expiryDate: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to create reservation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Reservation</DialogTitle>
          <DialogDescription>
            Reserve a connector for a specific ID tag
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chargePointId">Charge Point *</Label>
            <Select
              value={formData.chargePointId}
              onValueChange={(value) => handleInputChange("chargePointId", value)}
              required
            >
              <SelectTrigger id="chargePointId">
                <SelectValue placeholder="Select a charge point" />
              </SelectTrigger>
              <SelectContent>
                {chargePoints.map((cp) => (
                  <SelectItem key={cp.id} value={cp.id}>
                    {cp.name} ({cp.chargePointId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="connectorId">Connector *</Label>
            <Select
              value={formData.connectorId}
              onValueChange={(value) => handleInputChange("connectorId", value)}
              required
              disabled={!formData.chargePointId}
            >
              <SelectTrigger id="connectorId">
                <SelectValue placeholder="Select a connector" />
              </SelectTrigger>
              <SelectContent>
                {selectedChargePoint?.connectors?.map((connector) => (
                  <SelectItem
                    key={connector.connectorId}
                    value={connector.connectorId.toString()}
                  >
                    Connector {connector.connectorId} - {connector.status}
                  </SelectItem>
                )) || (
                  <SelectItem value="1">Connector 1</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="idTag">ID Tag *</Label>
            <Input
              id="idTag"
              value={formData.idTag}
              onChange={(e) => handleInputChange("idTag", e.target.value)}
              placeholder="Enter ID tag"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date & Time *</Label>
            <Input
              id="expiryDate"
              type="datetime-local"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange("expiryDate", e.target.value)}
              min={getMinDateTime()}
              required
            />
            <p className="text-xs text-muted-foreground">
              Reservation must expire at least 5 minutes from now
            </p>
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
              {isSubmitting ? "Creating..." : "Create Reservation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
