import { apiClient } from "./axios";
import type { Company } from "@/types/api";

export const companyApi = {
  getCompanyById: async (companyId: string): Promise<Company> => {
    const response = await apiClient.get<Company>(`/companies/${companyId}`);
    return response.data;
  },
  updateCompany: async (companyId: string, data: Company): Promise<Company> => {
    const response = await apiClient.put<Company>(
      `/companies/${companyId}`,
      data
    );
    return response.data;
  },
};
