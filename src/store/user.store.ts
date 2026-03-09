import type { User } from "@/types/api";
import { create } from "zustand";

const AUTH_TOKEN_KEY = "auth_token";
const COMPANY_ID_KEY = "company_id";
const USER_KEY = "auth_user";


const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};
