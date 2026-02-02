import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import type { SignupRequest } from "@/types/api";
import { Building2, User } from "lucide-react";

export const SignupPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState<SignupRequest>({
    user: {
      name: "",
      email: "",
      password: "",
    },
    company: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      website: "",
      taxId: "",
      registrationNumber: "",
    },
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUserChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      user: { ...prev.user, [field]: value },
    }));
  };

  const handleCompanyChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      company: { ...prev.company, [field]: value },
    }));
  };

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      console.log("Signup response data:", data);
      console.log("Token:", data.token);
      console.log("User:", data.user);
      
      setAuth(data.user, data.token);
      
      toast({
        title: "Success",
        description: data.message || "Account created successfully. Welcome!",
      });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.user.password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    if (formData.user.password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }
    const payload: SignupRequest = {
      ...formData,
      company: {
        ...formData.company,
        website: formData.company.website || undefined,
        taxId: formData.company.taxId || undefined,
        registrationNumber: formData.company.registrationNumber || undefined,
      },
    };
    signupMutation.mutate(payload);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>OCPP Central Admin</CardTitle>
          <CardDescription>
            Create your account and company to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* User / Account Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Account Details</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.user.name}
                    onChange={(e) => handleUserChange("name", e.target.value)}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.user.email}
                    onChange={(e) => handleUserChange("email", e.target.value)}
                    required
                    placeholder="name@example.com"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.user.password}
                    onChange={(e) =>
                      handleUserChange("password", e.target.value)
                    }
                    required
                    minLength={8}
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-muted-foreground">
                    At least 8 characters
                  </p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Company Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Company Information</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    value={formData.company.name}
                    onChange={(e) =>
                      handleCompanyChange("name", e.target.value)
                    }
                    required
                    placeholder="Acme Inc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">
                    Company Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={formData.company.email}
                    onChange={(e) =>
                      handleCompanyChange("email", e.target.value)
                    }
                    required
                    placeholder="contact@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.company.phone}
                    onChange={(e) =>
                      handleCompanyChange("phone", e.target.value)
                    }
                    required
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.company.website}
                    onChange={(e) =>
                      handleCompanyChange("website", e.target.value)
                    }
                    placeholder="https://www.company.com"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    value={formData.company.address}
                    onChange={(e) =>
                      handleCompanyChange("address", e.target.value)
                    }
                    required
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={formData.company.city}
                    onChange={(e) =>
                      handleCompanyChange("city", e.target.value)
                    }
                    required
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">
                    State/Province <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="state"
                    value={formData.company.state}
                    onChange={(e) =>
                      handleCompanyChange("state", e.target.value)
                    }
                    required
                    placeholder="NY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">
                    ZIP/Postal Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="zipCode"
                    value={formData.company.zipCode}
                    onChange={(e) =>
                      handleCompanyChange("zipCode", e.target.value)
                    }
                    required
                    placeholder="10001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="country"
                    value={formData.company.country}
                    onChange={(e) =>
                      handleCompanyChange("country", e.target.value)
                    }
                    required
                    placeholder="United States"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    value={formData.company.taxId}
                    onChange={(e) =>
                      handleCompanyChange("taxId", e.target.value)
                    }
                    placeholder="TAX-123456789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">
                    Registration Number
                  </Label>
                  <Input
                    id="registrationNumber"
                    value={formData.company.registrationNumber}
                    onChange={(e) =>
                      handleCompanyChange("registrationNumber", e.target.value)
                    }
                    placeholder="REG-987654321"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending
                  ? "Creating account..."
                  : "Create account"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
