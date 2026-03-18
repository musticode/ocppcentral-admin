import { create } from "zustand";
import type { Company } from "@/types/api";

const COMPANY_ID_KEY = "company_id";
const COMPANY_NAME_KEY = "company_name";
const COMPANY_EMAIL_KEY = "company_email";
const COMPANY_KEY = "company";

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
  setCompany: (company) => {
    try {
      localStorage.setItem(COMPANY_KEY, JSON.stringify(company));
    } catch {
      // ignore
    }
    set({ company });
  },
  setEmail: (email) => {
    const value = email ?? null;
    if (value) {
      localStorage.setItem(COMPANY_EMAIL_KEY, value);
    } else {
      localStorage.removeItem(COMPANY_EMAIL_KEY);
    }
    set({ email: value });
  },
  setCompanyName: (companyName) => {
    const value = companyName ?? null;
    if (value) {
      localStorage.setItem(COMPANY_NAME_KEY, value);
    } else {
      localStorage.removeItem(COMPANY_NAME_KEY);
    }
    set({ companyName: value });
  },
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
    const companyName = localStorage.getItem(COMPANY_NAME_KEY);
    const email = localStorage.getItem(COMPANY_EMAIL_KEY);
    let company: Company | null = null;
    try {
      const stored = localStorage.getItem(COMPANY_KEY);
      company = stored ? (JSON.parse(stored) as Company) : null;
    } catch {
      company = null;
    }
    if (companyId) {
      set({ companyId });
    }
    if (companyName) {
      set({ companyName });
    }
    if (email) {
      set({ email });
    }
    if (company) {
      set({ company });
    }
  },
  getCompanyId: () => get().companyId,
  getCompanyName: () => get().companyName,
  getCompany: () => get().company,
  getEmail: () => get().email,
}));
