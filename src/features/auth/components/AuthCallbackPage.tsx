import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();
  const processedRef = useRef(false);

  useEffect(() => {
    // Avoid double processing in React StrictMode
    if (processedRef.current) return;
    processedRef.current = true;

    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      toast({
        title: "Authentication Failed",
        description: decodeURIComponent(errorParam),
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (token && userParam) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(userParam));
        setAuth(decodedUser, token);

        toast({
          title: "Welcome Back",
          description: `Logged in successfully as ${decodedUser.name || decodedUser.email}`,
        });

        navigate("/dashboard");
      } catch (err) {
        console.error("Failed to parse user data from Google OAuth redirect:", err);
        toast({
          title: "Authentication Error",
          description: "Invalid user data received from Google login",
          variant: "destructive",
        });
        navigate("/login");
      }
    } else {
      // If accessed directly without params, redirect to login
      toast({
        title: "Session Expired",
        description: "Google login session could not be established. Please try again.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [searchParams, setAuth, navigate, toast]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 font-sans">
      {/* Decorative premium ambient glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none animate-bounce duration-[10000ms]" />
      
      {/* Glassmorphic Loader Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl text-center">
        <div className="relative flex items-center justify-center mx-auto mb-6 w-20 h-20 rounded-full bg-primary/10 border border-primary/20 shadow-inner">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          {/* Subtle surrounding pulse animation */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary/5 animate-ping opacity-75" />
        </div>
        
        <h2 className="text-xl font-bold tracking-tight text-white mb-2">
          Securing your session
        </h2>
        <p className="text-sm text-slate-400">
          Completing authentication with Google. Please do not close this window.
        </p>

        {/* Dynamic decorative loading bars */}
        <div className="mt-8 overflow-hidden h-1.5 w-full bg-white/5 rounded-full">
          <div className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full animate-[loading-bar_1.5s_infinite_ease-in-out]" style={{ width: "40%" }} />
        </div>
      </div>
      
      {/* Inject custom animation keyframe for the loader bar */}
      <style>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(150%);
          }
          100% {
            transform: translateX(250%);
          }
        }
      `}</style>
    </div>
  );
};
