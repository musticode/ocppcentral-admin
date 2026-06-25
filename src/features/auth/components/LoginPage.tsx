import React, { useState, useEffect } from "react";
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
import { Loader2, Zap } from "lucide-react";
import { isDemoMode } from "@/demo/demoMode";
import { useTranslation } from "react-i18next";

declare global {
  interface Window {
    google?: any;
  }
}

export const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false);
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);

  // Load Google SDK Script
  useEffect(() => {
    if (window.google?.accounts?.id) {
      setIsGoogleScriptLoaded(true);
      return;
    }

    const scriptId = "google-gsi-client";
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      const handleLoad = () => setIsGoogleScriptLoaded(true);
      existingScript.addEventListener("load", handleLoad);
      return () => {
        existingScript.removeEventListener("load", handleLoad);
      };
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Fetch Google Client ID from backend config
  useEffect(() => {
    if (isDemoMode) return;

    const fetchConfig = async () => {
      try {
        const data = await authApi.getGoogleConfig();
        if (
          data.success &&
          data.googleClientId &&
          !data.googleClientId.startsWith("your-google-client-id")
        ) {
          setGoogleClientId(data.googleClientId);
        }
      } catch (err) {
        console.warn("Could not fetch Google client ID from backend configuration:", err);
      }
    };

    fetchConfig();
  }, []);

  // Initialize and render Google Login Button
  useEffect(() => {
    if (!isGoogleScriptLoaded || !googleClientId) return;

    try {
      const handleCredentialResponse = async (response: any) => {
        setIsGoogleLoggingIn(true);
        try {
          const result = await authApi.loginWithGoogle(response.credential);
          if (result.success) {
            setAuth(result.user, result.token);
            toast({
              title: "Success",
              description: result.message || "Logged in successfully with Google",
            });
            navigate("/dashboard");
          } else {
            toast({
              title: "Authentication Failed",
              description: result.message || "Could not log in with Google",
              variant: "destructive",
            });
          }
        } catch (error: any) {
          toast({
            title: "Error",
            description:
              error.response?.data?.message ||
              error.message ||
              "Failed to log in with Google",
            variant: "destructive",
          });
        } finally {
          setIsGoogleLoggingIn(false);
        }
      };

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse,
      });

      const buttonContainer = document.getElementById("google-signin-button");
      if (buttonContainer) {
        window.google.accounts.id.renderButton(buttonContainer, {
          theme: "filled_black",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: 380, // width in pixels
        });

        // Prompt Google One Tap
        window.google.accounts.id.prompt();
      }
    } catch (err) {
      console.error("Failed to initialize Google Sign-In:", err);
    }
  }, [isGoogleScriptLoaded, googleClientId, navigate, setAuth, toast]);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      console.log("Login response data:", data);
      console.log("Token:", data.token);
      console.log("User:", data.user);
      
      setAuth(data.user, data.token);
      
      toast({
        title: "Success",
        description: data.message || "Logged in successfully",
      });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to login",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  const handleGoogleLogin = () => {
    if (isDemoMode) {
      setIsGoogleLoggingIn(true);
      // In demo mode, simulate redirecting to Google and returning to callback page
      setTimeout(() => {
        const mockGoogleUser = {
          id: "google-demo-user",
          email: "demo.admin@ocppcentral.com",
          name: "Alex Rivera",
          role: "SuperAdmin",
          companyId: "company-demo",
          companyName: "OCPP Demo Enterprise"
        };
        const encodedUser = encodeURIComponent(JSON.stringify(mockGoogleUser));
        navigate(`/auth/callback?token=demo-google-oauth-token&user=${encodedUser}`);
        setIsGoogleLoggingIn(false);
      }, 1000);
    } else {
      toast({
        title: "Configuration Missing",
        description: "Google Sign-In is not configured on the backend. Please check the GOOGLE_CLIENT_ID environment variable.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Left panel: Info & mockups (lg only) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-slate-950 p-16 text-white lg:flex overflow-hidden">
        {/* Glow decorations */}
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-500/20 blur-[120px]" />
        
        {/* Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white shadow-inner">
            <Zap className="h-6 w-6 text-white fill-white/10" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">ChargeOPS</span>
        </div>

        {/* Content Mockup */}
        <div className="relative z-10 space-y-8 my-auto">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight xl:text-5xl leading-tight text-white">
              {t("auth.loginTitle")}
            </h1>
            <p className="text-slate-400 text-lg">
              {t("auth.loginSubtitle")}
            </p>
          </div>

          {/* Charger Status Widget */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md shadow-2xl space-y-4 max-w-lg">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-semibold text-slate-200">Station CP-001 (Port A)</span>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                {t("chargePoints.charging")}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{t("auth.loginEnergyDelivered")}</p>
                <p className="text-xl font-bold text-white mt-1">42.58 kWh</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{t("auth.loginActivePower")}</p>
                <p className="text-xl font-bold text-white mt-1">120.4 kW</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{t("sessions.duration")}</p>
                <p className="text-xl font-bold text-white mt-1">45m 12s</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{t("auth.loginEstimatedCost")}</p>
                <p className="text-xl font-bold text-white mt-1">$18.73</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{t("auth.loginBatterySoC")}</span>
                <span className="font-semibold text-emerald-400">82%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500">
          <span>© 2026 ChargeOPS Operations Inc.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">{t("auth.loginPrivacy")}</a>
            <a href="#" className="hover:underline">{t("auth.loginTerms")}</a>
          </div>
        </div>
      </div>

      {/* Right panel: Login form */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile only branding */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-primary fill-primary/10" />
            <span className="text-xl font-bold text-gray-900">ChargeOPS</span>
          </div>

          <Card className="border-gray-200 bg-white shadow-xl rounded-2xl">
            <CardHeader className="space-y-2 text-center pb-4 pt-8">
              <CardTitle className="text-3xl font-extrabold tracking-tight text-gray-900">
                {t("auth.signIn")}
              </CardTitle>
              <CardDescription className="text-gray-500">
                {t("auth.signInDesc")}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 pb-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">{t("auth.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:ring-primary focus-visible:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700 font-medium">{t("auth.password")}</Label>
                    <Link
                      to="#"
                      className="text-xs text-primary hover:underline underline-offset-4 font-semibold"
                    >
                      {t("auth.forgotPassword")}
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:ring-primary focus-visible:border-primary"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full font-medium shadow-md shadow-primary/15 transition-all text-white bg-primary hover:bg-primary/95"
                  disabled={loginMutation.isPending || isGoogleLoggingIn}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                      {t("auth.signingIn")}
                    </>
                  ) : (
                    t("auth.signIn")
                  )}
                </Button>
              </form>

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-150" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-400 font-semibold tracking-wider">
                    {t("auth.orContinueWith")}
                  </span>
                </div>
              </div>

              {googleClientId ? (
                <div className="flex flex-col items-center justify-center w-full min-h-[44px]">
                  <div
                    id="google-signin-button"
                    className="w-full flex justify-center hover:opacity-90 transition-opacity"
                  />
                  {isGoogleLoggingIn && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 animate-pulse">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                      {t("auth.verifyingGoogle")}
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-3 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                  onClick={handleGoogleLogin}
                  disabled={loginMutation.isPending || isGoogleLoggingIn}
                >
                  {isGoogleLoggingIn ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>{t("auth.continueWithGoogle")}</span>
                </Button>
              )}

              <p className="text-center text-sm text-gray-500">
                {t("auth.dontHaveAccount")}{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-primary hover:underline underline-offset-4"
                >
                  {t("auth.signup")}
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

