import { create } from "zustand";
import type { User } from "@/types/api";
import { useCompanyStore } from "./company.store";

const AUTH_TOKEN_KEY = "auth_token";
const COMPANY_ID_KEY = "company_id";
const USER_KEY = "auth_user";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  initializeFromStorage: () => void;
}

// Helper to safely parse JSON from localStorage
const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// Get companyId from login/signup response (supports camelCase and snake_case from API)
const getCompanyIdFromUser = (user: User): string | null => {
  const id =
    user.companyId ?? (user as User & { company_id?: string }).company_id;
  return id && typeof id === "string" ? id : null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    console.log("setAuth called with:", { user, token });

    // Save to localStorage when login or signup succeeds
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    const companyId = getCompanyIdFromUser(user);
    console.log("Extracted companyId:", companyId);

    if (companyId) {
      localStorage.setItem(COMPANY_ID_KEY, companyId);
      console.log(
        "companyId from localStorage:",
        localStorage.getItem(COMPANY_ID_KEY)
      );
      useCompanyStore.getState().setCompanyId(companyId);
      console.log(
        "Saved companyId to localStorage and company store:",
        companyId
      );
    } else {
      console.warn("No companyId found in user object:", user);
    }

    set({ user, token, isAuthenticated: true });
    console.log("Auth state updated. localStorage keys:", {
      auth_token: localStorage.getItem(AUTH_TOKEN_KEY) ? "✓" : "✗",
      auth_user: localStorage.getItem(USER_KEY) ? "✓" : "✗",
      company_id: localStorage.getItem(COMPANY_ID_KEY) ? "✓" : "✗",
    });
  },
  clearAuth: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(COMPANY_ID_KEY);
    localStorage.removeItem(USER_KEY);
    useCompanyStore.getState().setCompanyId(null);
    set({ user: null, token: null, isAuthenticated: false });
  },
  initializeFromStorage: () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const user = getStoredUser();
    if (token && user) {
      if (user.companyId) {
        useCompanyStore.getState().setCompanyId(user.companyId);
      }
      set({ user, token, isAuthenticated: true });
    }
  },
}));
