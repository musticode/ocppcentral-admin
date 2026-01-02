import { useAuthInit } from "@/hooks/useAuthInit";

/**
 * Component to initialize auth state on app mount
 */
export const AuthInit = () => {
  useAuthInit();
  return null;
};
