import { create } from "zustand";
import type { User } from "@/types/api";

const USER_KEY = "auth_user";

const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
};

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  initializeFromStorage: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
    set({ user });
  },
  initializeFromStorage: () => {
    set({ user: getStoredUser() });
  },
}));
