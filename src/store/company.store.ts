import { create } from "zustand";
import type { Company } from "@/types/api";

const COMPANY_ID_KEY = "company_id";

interface CompanyState {
  company: Company | null;
  email: string | null;
  companyName: string | null;
  companyId: string | null;

  setCompany: (company: Company) => void;
  setEmail: (email: string) => void;
  setCompanyName: (companyName: string) => void;
  setCompanyId: (companyId: string | null) => void;
  initializeFromStorage: () => void;
  getCompanyId: () => string | null;
  getCompanyName: () => string | null;
  getCompany: () => Company | null;
  getEmail: () => string | null;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  company: null,
  email: null,
  companyName: null,
  companyId: null,
  setCompany: (company) => set({ company }),
  setEmail: (email) => set({ email }),
  setCompanyName: (companyName) => set({ companyName }),
  setCompanyId: (companyId) => {
    const value = companyId ?? null;
    if (value) {
      localStorage.setItem(COMPANY_ID_KEY, value);
    } else {
      localStorage.removeItem(COMPANY_ID_KEY);
    }
    set({ companyId: value });
  },
  initializeFromStorage: () => {
    const companyId = localStorage.getItem(COMPANY_ID_KEY);
    if (companyId) {
      set({ companyId });
    }
  },
  getCompanyId: () => get().companyId,
  getCompanyName: () => get().companyName,
  getCompany: () => get().company,
  getEmail: () => get().email,
}));
