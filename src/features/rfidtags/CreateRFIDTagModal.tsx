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
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blocked">Status</Label>
              <div className="flex items-center gap-2">
                <input
                  id="blocked"
                  type="checkbox"
                  checked={formData.blocked}
                  onChange={(e) => handleInputChange("blocked", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="blocked" className="cursor-pointer">
                  Blocked
                </Label>
              </div>
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

