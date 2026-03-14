import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/api";
import { Calendar, User, Shield, Clock } from "lucide-react";

interface RFIDTag {
  idTag: string;
  userId?: string;
  userName?: string;
  status: "active" | "inactive" | "blocked";
  expiryDate?: string;
  description?: string;
  sessions?: number;
  totalKwh?: number;
  lastSeen?: string;
}

interface EditRFIDTagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag: RFIDTag | null;
  onSuccess?: () => void;
}

export const EditRFIDTagModal = ({
  open,
  onOpenChange,
  tag,
  onSuccess,
}: EditRFIDTagModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    status: "active" as "active" | "inactive" | "blocked",
    expiryDate: "",
    description: "",
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAllUsers(),
    enabled: open,
  });

  useEffect(() => {
    if (tag && open) {
      setFormData({
        userId: tag.userId || "",
        status: tag.status || "active",
        expiryDate: tag.expiryDate || "",
        description: tag.description || "",
      });
    }
  }, [tag, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag) return;

    setIsSubmitting(true);

    try {
      // TODO: Implement actual API call to update RFID tag
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: t("common.success"),
        description: t("rfidTags.tagUpdated"),
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("errors.somethingWentWrong"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tag) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("rfidTags.editTag")}</DialogTitle>
          <DialogDescription>
            {t("rfidTags.editTagDesc")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* RFID Tag ID (Read-only) */}
          <div className="rounded-lg border bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {t("rfidTags.tagId")}
                </p>
                <p className="mt-1 font-mono text-lg font-semibold">
                  {tag.idTag}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{t("sessions.sessions")}</p>
                <p className="text-lg font-semibold">{tag.sessions || 0}</p>
              </div>
            </div>
            {tag.lastSeen && (
              <p className="mt-2 text-xs text-gray-500">
                {t("chargePoints.lastHeartbeat")}: {new Date(tag.lastSeen).toLocaleString()}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Assign User */}
            <div className="space-y-2">
              <Label htmlFor="userId" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t("rfidTags.assignedUser")}
              </Label>
              <Select
                value={formData.userId}
                onValueChange={(v) =>
                  handleInputChange("userId", v === "__unassigned__" ? "" : v)
                }
              >
                <SelectTrigger id="userId">
                  <SelectValue placeholder={t("rfidTags.selectUser")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__unassigned__">
                    {t("rfidTags.unassigned")}
                  </SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {t("rfidTags.assignUserDesc")}
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {t("common.status")}
              </Label>
              <Select
                value={formData.status}
                onValueChange={(v: "active" | "inactive" | "blocked") =>
                  handleInputChange("status", v)
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      {t("rfidTags.statusActive")}
                    </span>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-gray-400" />
                      {t("rfidTags.statusInactive")}
                    </span>
                  </SelectItem>
                  <SelectItem value="blocked">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      {t("rfidTags.statusBlocked")}
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {t("rfidTags.statusDesc")}
              </p>
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t("rfidTags.expiryDate")}
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="expiryDate"
                  type="date"
                  className="pl-10"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t("rfidTags.expiryDateDesc")}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">{t("common.description")}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder={t("rfidTags.descriptionPlaceholder")}
                rows={3}
              />
            </div>
          </div>

          {/* Summary of Changes */}
          <div className="rounded-lg border bg-blue-50 p-4">
            <h4 className="mb-2 text-sm font-semibold text-blue-900">
              {t("rfidTags.changesSummary")}
            </h4>
            <div className="space-y-1 text-sm text-blue-800">
              {formData.userId !== (tag.userId || "") && (
                <p>
                  • {t("rfidTags.userWillChange")}:{" "}
                  <span className="font-medium">
                    {formData.userId
                      ? users.find((u) => u.id === formData.userId)?.name || t("rfidTags.unassigned")
                      : t("rfidTags.unassigned")}
                  </span>
                </p>
              )}
              {formData.status !== tag.status && (
                <p>
                  • {t("rfidTags.statusWillChange")}:{" "}
                  <span className="font-medium capitalize">{formData.status}</span>
                </p>
              )}
              {formData.expiryDate !== (tag.expiryDate || "") && (
                <p>
                  • {t("rfidTags.expiryWillChange")}:{" "}
                  <span className="font-medium">
                    {formData.expiryDate || t("rfidTags.noExpiry")}
                  </span>
                </p>
              )}
              {formData.userId === (tag.userId || "") &&
                formData.status === tag.status &&
                formData.expiryDate === (tag.expiryDate || "") &&
                formData.description === (tag.description || "") && (
                  <p className="text-gray-600">{t("rfidTags.noChanges")}</p>
                )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("settings.saving") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
