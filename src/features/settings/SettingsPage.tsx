import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Building2,
  Settings as SettingsIcon,
  LogOut,
  Mail,
  Phone,
  Shield,
  Bell,
  Globe,
  Save,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/store/auth.store";
import { useCompanyStore } from "@/store/company.store";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const SettingsPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const companyId = useCompanyStore((state) => state.companyId);

  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  // User profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    role: user?.role || "",
  });

  // App settings state
  const [appSettings, setAppSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    sessionAlerts: true,
    maintenanceAlerts: true,
  });

  const handleProfileSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement actual API call to update user profile
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: t("common.success"),
        description: t("settings.profileUpdated"),
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("errors.somethingWentWrong"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAppSettingsSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement actual API call to update app settings
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: t("common.success"),
        description: t("settings.preferencesUpdated"),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    toast({
      title: t("settings.loggedOut"),
      description: t("settings.loggedOutMessage"),
    });
    navigate("/login");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("settings.title")}</h1>
          <p className="mt-1 text-sm text-gray-600">
            {t("settings.description")}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="gap-2">
              <LogOut className="h-4 w-4" />
              {t("auth.logout")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("settings.confirmLogout")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("settings.confirmLogoutMessage")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                {t("auth.logout")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            {t("settings.profile")}
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            {t("settings.preferences")}
          </TabsTrigger>
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="h-4 w-4" />
            {t("settings.company")}
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>{t("settings.userInformation")}</CardTitle>
              </div>
              <CardDescription>
                {t("settings.userInformationDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("common.name")}</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("auth.email")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("settings.phone")}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-10"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t("users.role")}</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="role"
                      className="pl-10"
                      value={profileData.role}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleProfileSave} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? t("settings.saving") : t("common.save")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("settings.security")}</CardTitle>
              <CardDescription>
                {t("settings.securityDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                {t("settings.changePassword")}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                {t("settings.twoFactorAuth")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle>{t("settings.language")}</CardTitle>
              </div>
              <CardDescription>
                {t("settings.languageDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("settings.selectLanguage")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.selectLanguageDesc")}
                  </p>
                </div>
                <LanguageSwitcher />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>{t("settings.notifications")}</CardTitle>
              </div>
              <CardDescription>
                {t("settings.notificationsDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">
                    {t("settings.emailNotifications")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.emailNotificationsDesc")}
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={appSettings.emailNotifications}
                  onCheckedChange={(checked: boolean) =>
                    setAppSettings({ ...appSettings, emailNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">
                    {t("settings.pushNotifications")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.pushNotificationsDesc")}
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={appSettings.pushNotifications}
                  onCheckedChange={(checked: boolean) =>
                    setAppSettings({ ...appSettings, pushNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="session-alerts">
                    {t("settings.sessionAlerts")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.sessionAlertsDesc")}
                  </p>
                </div>
                <Switch
                  id="session-alerts"
                  checked={appSettings.sessionAlerts}
                  onCheckedChange={(checked: boolean) =>
                    setAppSettings({ ...appSettings, sessionAlerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-alerts">
                    {t("settings.maintenanceAlerts")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.maintenanceAlertsDesc")}
                  </p>
                </div>
                <Switch
                  id="maintenance-alerts"
                  checked={appSettings.maintenanceAlerts}
                  onCheckedChange={(checked: boolean) =>
                    setAppSettings({ ...appSettings, maintenanceAlerts: checked })
                  }
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleAppSettingsSave} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? t("settings.saving") : t("common.save")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>{t("settings.companyInformation")}</CardTitle>
              </div>
              <CardDescription>
                {t("settings.companyInformationDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t("settings.companyId")}</span>
                    <span className="font-mono text-sm">{companyId || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t("settings.companyName")}</span>
                    <span className="text-sm font-medium">{user?.companyName || "-"}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("settings.companySettingsNote")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("settings.accountInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("settings.userId")}</span>
                <span className="font-mono">{user?.id}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("common.status")}</span>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                  {t("stats.active")}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
