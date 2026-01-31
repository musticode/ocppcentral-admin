import { create } from "zustand";
import type { User } from "@/types/api";

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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (user.companyId) {
      localStorage.setItem(COMPANY_ID_KEY, user.companyId);
    }
    set({ user, token, isAuthenticated: true });
  },
  clearAuth: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(COMPANY_ID_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },
  initializeFromStorage: () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const user = getStoredUser();
    if (token && user) {
      set({ user, token, isAuthenticated: true });
    }
  },
}));
