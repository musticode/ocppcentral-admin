import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Save,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Image,
  FileText,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCompanyStore } from "@/store/company.store";
import { companyApi } from "@/api/company.api";
import type { Company } from "@/types/api";

export const CompanySettingsPage = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const companyId = useCompanyStore((state) => state.companyId);
  const [companyData, setCompanyData] = useState<Company | null>(null);

  const fetchCompanyData = async () => {
    try {
      let response = await companyApi.getCompanyById(companyId ?? "");
      setCompanyData(response);
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [companyId]);

  const handleInputChange = (field: string, value: string) => {
    if (companyData) {
      setCompanyData({ ...companyData, [field]: value } as Company);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    if (companyData) {
      await companyApi.updateCompany(companyData.id, companyData);
      toast({
        title: "Settings saved",
        description: "Company settings have been updated successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Company data not found.",
      });
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Company Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your company information and preferences
        </p>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle>Company Information</CardTitle>
          </div>
          <CardDescription>
            Update your company details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={companyData?.name ?? ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  value={companyData?.email ?? ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  className="pl-10"
                  value={companyData?.phone ?? ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="website"
                  type="url"
                  className="pl-10"
                  value={companyData?.website ?? ""}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="logo">Logo URL</Label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="logo"
                  type="url"
                  placeholder="https://..."
                  className="pl-10"
                  value={companyData?.logo ?? ""}
                  onChange={(e) => handleInputChange("logo", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  id="description"
                  placeholder="Company description..."
                  className="min-h-[100px] pl-10"
                  value={companyData?.description ?? ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle>Address</CardTitle>
          </div>
          <CardDescription>Company physical address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              value={companyData?.address ?? ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={companyData?.city ?? ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={companyData?.state ?? ""}
                onChange={(e) => handleInputChange("state", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP/Postal Code</Label>
              <Input
                id="zipCode"
                value={companyData?.zipCode ?? ""}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={companyData?.country ?? ""}
              onChange={(e) => handleInputChange("country", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Legal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Legal Information</CardTitle>
          <CardDescription>Tax ID and registration details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                value={companyData?.taxId ?? ""}
                onChange={(e) => handleInputChange("taxId", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                value={companyData?.registrationNumber ?? ""}
                onChange={(e) =>
                  handleInputChange("registrationNumber", e.target.value)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {(companyData?.createdAt ?? companyData?.updatedAt) && (
          <p className="text-xs text-muted-foreground">
            {companyData?.createdAt && (
              <>Created: {new Date(companyData.createdAt).toLocaleString()}</>
            )}
            {companyData?.createdAt && companyData?.updatedAt && " · "}
            {companyData?.updatedAt && (
              <>Updated: {new Date(companyData.updatedAt).toLocaleString()}</>
            )}
          </p>
        )}
        <Button
          onClick={handleSave}
          disabled={isSaving || !companyId}
          size="lg"
          className="sm:ml-auto"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
