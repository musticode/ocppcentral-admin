import type { Company, RFIDTag, Tariff, CompanySettings } from "@/types/api";
import { apiClient } from "./axios";
import { extractArray } from "./utils";

export interface CreateCompanyRequest {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  description?: string;
  paymentNeeded?: boolean;
}

export const companyApi = {
  getAllCompanies: async (): Promise<Company[]> => {
    const response = await apiClient.get<unknown>("/companies/listAllCompanies");
    return extractArray<Company>(response.data);
  },

  getCompanyByName: async (name: string): Promise<Company> => {
    const response = await apiClient.get<Company>(`/companies/${name}`);
    return response.data;
  },

  getCompanyById: async (companyId: string): Promise<Company> => {
    const response = await apiClient.get<Company>(`/companies/${companyId}`);
    return response.data;
  },

  createCompany: async (data: CreateCompanyRequest): Promise<Company> => {
    const response = await apiClient.post<Company>("/companies/createCompany", data);
    return response.data;
  },

  updateCompany: async (companyId: string, data: Partial<Company>): Promise<Company> => {
    const response = await apiClient.put<Company>(
      `/companies/${companyId}`,
      data
    );
    return response.data;
  },

  fetchCompanyRfidTags: async (companyId: string): Promise<RFIDTag[]> => {
    const response = await apiClient.get<unknown>(
      `/companies/${companyId}/rfidTags`
    );
    return extractArray<RFIDTag>(response.data);
  },

  fetchCompanyTariffs: async (companyId: string): Promise<Tariff[]> => {
    const response = await apiClient.get<unknown>(
      `/companies/${companyId}/tariffs`
    );
    return extractArray<Tariff>(response.data);
  },

  fetchCompanySettings: async (companyId: string): Promise<CompanySettings> => {
    const response = await apiClient.get<CompanySettings>(
      `/companies/${companyId}/settings`
    );
    return response.data;
  },
};
