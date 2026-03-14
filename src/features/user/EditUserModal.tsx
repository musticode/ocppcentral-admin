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
import { useToast } from "@/components/ui/use-toast";
import { Mail, Shield, User as UserIcon, Building2 } from "lucide-react";
import type { User } from "@/types/api";

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSuccess?: () => void;
}

const AVAILABLE_ROLES = [
  { value: "User", label: "User", variant: "outline" as const },
  { value: "Operator", label: "Operator", variant: "secondary" as const },
  { value: "Manager", label: "Manager", variant: "default" as const },
  { value: "Admin", label: "Admin", variant: "destructive" as const },
];

export const EditUserModal = ({
  open,
  onOpenChange,
  user,
  onSuccess,
}: EditUserModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "User",
  });

  useEffect(() => {
    if (user && open) {
      setFormData({
        email: user.email || "",
        role: user.role || "User",
      });
    }
  }, [user, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: t("common.error"),
        description: t("users.invalidEmail"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement actual API call to update user
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: t("common.success"),
        description: t("users.userUpdated"),
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

  if (!user) return null;

  const hasChanges = formData.email !== user.email || formData.role !== user.role;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("users.editUser")}</DialogTitle>
          <DialogDescription>
            {t("users.editUserDesc")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Info Display */}
          <div className="rounded-lg border bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <UserIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{t("users.userId")}: {user.id}</p>
              </div>
            </div>
            {user.companyName && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="h-4 w-4" />
                <span>{user.companyName}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Email Field */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t("auth.email")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="user@example.com"
              />
              <p className="text-xs text-muted-foreground">
                {t("users.emailDesc")}
              </p>
            </div>

            {/* Role Field */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="role" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {t("users.role")} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(v) => handleInputChange("role", v)}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex items-center gap-2">
                        <span className="capitalize">{role.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {t("users.roleDesc")}
              </p>
            </div>
          </div>

          {/* Role Descriptions */}
          <div className="rounded-lg border bg-blue-50 p-4">
            <h4 className="mb-2 text-sm font-semibold text-blue-900">
              {t("users.rolePermissions")}
            </h4>
            <div className="space-y-1 text-xs text-blue-800">
              <p>• <strong>{t("users.admin")}:</strong> {t("users.adminDesc")}</p>
              <p>• <strong>{t("users.manager")}:</strong> {t("users.managerDesc")}</p>
              <p>• <strong>{t("users.operator")}:</strong> {t("users.operatorDesc")}</p>
              <p>• <strong>User:</strong> {t("users.userDesc")}</p>
            </div>
          </div>

          {/* Changes Summary */}
          {hasChanges && (
            <div className="rounded-lg border bg-amber-50 p-4">
              <h4 className="mb-2 text-sm font-semibold text-amber-900">
                {t("rfidTags.changesSummary")}
              </h4>
              <div className="space-y-1 text-sm text-amber-800">
                {formData.email !== user.email && (
                  <p>
                    • {t("users.emailWillChange")}: <span className="font-medium">{formData.email}</span>
                  </p>
                )}
                {formData.role !== user.role && (
                  <p>
                    • {t("users.roleWillChange")}: <span className="font-medium capitalize">{formData.role}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting || !hasChanges}>
              {isSubmitting ? t("settings.saving") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
