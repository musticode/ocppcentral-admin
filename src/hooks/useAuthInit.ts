import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { useCompanyStore } from "@/store/company.store";
import { authApi } from "@/api";
import type { AxiosError } from "axios";

/**
 * Initialize auth state from localStorage and validate token
 */
export const useAuthInit = () => {
  const { setAuth, clearAuth, initializeFromStorage, token } = useAuthStore();
  const initializeCompanyFromStorage = useCompanyStore(
    (state) => state.initializeFromStorage
  );

  // Immediately hydrate from localStorage for faster initial render
  useEffect(() => {
    initializeFromStorage();
    initializeCompanyFromStorage();
  }, [initializeFromStorage, initializeCompanyFromStorage]);

  // Validate token with server and refresh user data
  const { data: user, isError, error } = useQuery({
    queryKey: ["current-user"],
    queryFn: authApi.getCurrentUser,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      const status = (error as AxiosError | undefined)?.response?.status;
      if (status === 401) {
        clearAuth();
      }
    } else if (token && user) {
      // Update with fresh user data from server
      setAuth(user, token);
    }
  }, [token, user, isError, error, setAuth, clearAuth]);
};
