import { apiClient } from "./axios";
import type { Consumption } from "@/types/api";

export const consumptionApi = {
  getAllConsumption: async (): Promise<Consumption[]> => {
    const response = await apiClient.get<Consumption[]>("/consumption");
    return response.data;
  },

  getConsumptionById: async (id: string): Promise<Consumption> => {
    const response = await apiClient.get<Consumption>(`/consumption/${id}`);
    return response.data;
  },
};
