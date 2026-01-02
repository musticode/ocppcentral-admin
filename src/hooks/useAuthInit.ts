import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/api";

/**
 * Initialize auth state from localStorage and validate token
 */
export const useAuthInit = () => {
  const { setAuth, clearAuth } = useAuthStore();
  const token = localStorage.getItem("auth_token");

  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: authApi.getCurrentUser,
    enabled: !!token,
    retry: false,
    onError: () => {
      clearAuth();
    },
  });

  useEffect(() => {
    if (token && user) {
      setAuth(user, token);
    }
  }, [token, user, setAuth]);
};
