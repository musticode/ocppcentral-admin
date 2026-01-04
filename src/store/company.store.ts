import { create } from "zustand";
import type { Company } from "@/types/api";

interface CompanyState {
  company: Company | null;
  email: string | null;

  setCompany: (company: Company) => void;
  setEmail: (email: string) => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  company: null,
  email: null,
  setCompany: (company) => set({ company }),
  setEmail: (email) => set({ email }),
}));
