import type {
  CreateTariffRequest,
  Tariff,
  TariffFilters,
} from "@/types/api";

import { apiClient } from "./axios";

export const tariffApi = {
  getTariffs: async (filters?: TariffFilters): Promise<Tariff[]> => {
    const response = await apiClient.get<Tariff[]>("/tariff", {
      params: filters,
    });
    return response.data;
  },

  getTariffById: async (id: string): Promise<Tariff> => {
    const response = await apiClient.get<Tariff>(`/tariff/${id}`);
    return response.data;
  },

  getTariffsByCompany: async (
    companyId: string,
    filters?: Omit<TariffFilters, "companyId">
  ): Promise<Tariff[]> => {
    const response = await apiClient.get<Tariff[]>(
      `/tariff/company/${companyId}`,
      { params: filters }
    );
    return response.data;
  },

  getActiveTariffForConnector: async (
    chargePointId: string,
    connectorId: number,
    dateTime?: string
  ): Promise<Tariff | null> => {
    const response = await apiClient.get<Tariff | null>(
      `/tariff/connector/${chargePointId}/${connectorId}`,
      { params: { dateTime } }
    );
    return response.data;
  },

  getPriceForConnector: async (
    chargePointId: string,
    connectorId: number,
    dateTime?: string
  ): Promise<{
    pricePerKwh?: number;
    pricePerMinute?: number;
    pricePerSession?: number;
    currency: string;
  }> => {
    const response = await apiClient.get(
      `/tariff/price/${chargePointId}/${connectorId}`,
      { params: { dateTime } }
    );
    return response.data;
  },

  createTariff: async (data: CreateTariffRequest): Promise<Tariff> => {
    const response = await apiClient.post<Tariff>("/tariff", data);
    return response.data;
  },

  updateTariff: async (
    id: string,
    data: Partial<CreateTariffRequest>
  ): Promise<Tariff> => {
    const response = await apiClient.put<Tariff>(`/tariff/${id}`, data);
    return response.data;
  },

  updateTariffForConnector: async (
    chargePointId: string,
    connectorId: string,
    data: Partial<CreateTariffRequest>
  ): Promise<Tariff> => {
    const response = await apiClient.put<Tariff>(
      `/tariff/connector/${chargePointId}/${connectorId}`,
      data
    );
    return response.data;
  },

  deleteTariff: async (id: string): Promise<void> => {
    await apiClient.delete(`/tariff/${id}`);
  },

  deactivateTariff: async (id: string): Promise<Tariff> => {
    const response = await apiClient.patch<Tariff>(`/tariff/${id}/deactivate`);
    return response.data;
  },
};
