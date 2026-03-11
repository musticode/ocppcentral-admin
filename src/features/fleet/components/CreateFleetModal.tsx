import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fleetApi } from "@/api";
import { useCompanyStore } from "@/store/company.store";
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
import type { CreateFleetRequest } from "@/types/api";

interface CreateFleetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateFleetModal = ({
  open,
  onOpenChange,
}: CreateFleetModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const companyId = useCompanyStore((state) => state.companyId);

  const [formData, setFormData] = useState<CreateFleetRequest>({
    name: "",
    description: "",
    manager: "",
    managerEmail: "",
    managerPhone: "",
    status: "Active",
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateFleetRequest) =>
      fleetApi.createFleet(companyId ?? "", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleets"] });
      queryClient.invalidateQueries({ queryKey: ["fleet-stats"] });
      toast({
        title: "Success",
        description: "Fleet created successfully",
      });
      onOpenChange(false);
      setFormData({
        name: "",
        description: "",
        manager: "",
        managerEmail: "",
        managerPhone: "",
        status: "Active",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create fleet",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Fleet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Fleet Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Corporate Fleet"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "Active" | "Inactive") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
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
              placeholder="Fleet description and purpose"
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="manager">Manager Name</Label>
              <Input
                id="manager"
                value={formData.manager}
                onChange={(e) =>
                  setFormData({ ...formData, manager: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerEmail">Manager Email</Label>
              <Input
                id="managerEmail"
                type="email"
                value={formData.managerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, managerEmail: e.target.value })
                }
                placeholder="manager@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerPhone">Manager Phone</Label>
              <Input
                id="managerPhone"
                type="tel"
                value={formData.managerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, managerPhone: e.target.value })
                }
                placeholder="+1 555 0100"
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
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Fleet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
