import { create } from "zustand";
import type { Company } from "@/types/api";

interface CompanyState {
  company: Company | null;
  email: string | null;
  companyName: string | null;
  companyId: string | null;

  setCompany: (company: Company) => void;
  setEmail: (email: string) => void;
  setCompanyName: (companyName: string) => void;
  setCompanyId: (companyId: string) => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  company: null,
  email: null,
  companyName: null,
  companyId: null,
  setCompany: (company) => set({ company }),
  setEmail: (email) => set({ email }),
  setCompanyName: (companyName) => set({ companyName }),
  setCompanyId: (companyId) => set({ companyId }),
}));
