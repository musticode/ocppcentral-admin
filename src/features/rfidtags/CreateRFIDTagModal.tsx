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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface CreateRFIDTagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreateRFIDTagModal = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateRFIDTagModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    idTag: "",
    parentIdTag: "",
    expiryDate: "",
    blocked: false,
    description: "",
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    toast({
      title: "RFID Tag created",
      description: "The RFID tag has been created successfully.",
    });
    onSuccess?.();
    onOpenChange(false);
    // Reset form
    setFormData({
      idTag: "",
      parentIdTag: "",
      expiryDate: "",
      blocked: false,
      description: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New RFID Tag</DialogTitle>
          <DialogDescription>
            Create a new RFID tag for user authentication. Fill in all required
            fields.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="idTag">
                RFID Tag ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="idTag"
                required
                value={formData.idTag}
                onChange={(e) => handleInputChange("idTag", e.target.value)}
                placeholder="e.g., TAG123456789"
                pattern="[A-Z0-9]+"
                title="Alphanumeric characters only"
              />
              <p className="text-xs text-gray-500">
                Alphanumeric characters only (uppercase)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentIdTag">Parent Tag ID</Label>
              <Input
                id="parentIdTag"
                value={formData.parentIdTag}
                onChange={(e) =>
                  handleInputChange("parentIdTag", e.target.value)
                }
                placeholder="Optional parent tag"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  handleInputChange("expiryDate", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blocked">Status</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="blocked"
                  checked={formData.blocked}
                  onCheckedChange={(checked) =>
                    handleInputChange("blocked", checked === true)
                  }
                />
                <Label htmlFor="blocked" className="cursor-pointer font-normal">
                  Blocked
                </Label>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Tag description or notes..."
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
              {isSubmitting ? "Creating..." : "Create RFID Tag"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
