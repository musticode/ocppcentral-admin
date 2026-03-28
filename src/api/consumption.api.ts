import { apiClient } from "./axios";
import { extractArray } from "./utils";
import type { Consumption } from "@/types/api";

export const consumptionApi = {
  getAllConsumption: async (): Promise<Consumption[]> => {
    const response = await apiClient.get<unknown>("/consumption");
    return extractArray<Consumption>(response.data);
  },

  getConsumptionById: async (id: string): Promise<Consumption> => {
    const response = await apiClient.get<Consumption>(`/consumption/${id}`);
    return response.data;
  },
};
