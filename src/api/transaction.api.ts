import { apiClient } from "./axios";
import type { Transaction, Session, Event } from "@/types/ocpp";
import type { PaginatedResponse } from "@/types/api";

export const transactionApi = {
  getTransactions: async (params?: {
    chargePointId?: string;
    status?: "Active" | "Completed";
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get<PaginatedResponse<Transaction>>(
      "/transactions",
      { params }
    );
    return response.data;
  },

  getTransaction: async (transactionId: string): Promise<Transaction> => {
    const response = await apiClient.get<Transaction>(
      `/transactions/${transactionId}`
    );
    return response.data;
  },

  getSessions: async (params?: {
    locationId?: string;
    chargePointId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Session>> => {
    const response = await apiClient.get<PaginatedResponse<Session>>(
      "/transactions/sessions",
      { params }
    );
    return response.data;
  },

  getLocationStats: async (
    locationId: string,
    period: "1W" | "1M" | "3M" | "1Y" | "ALL"
  ): Promise<{
    activeSessions: number;
    totalSessions: number;
    totalKwh: number;
    totalRevenue: number;
  }> => {
    const response = await apiClient.get(
      `/transactions/locations/${locationId}/stats`,
      {
        params: { period },
      }
    );
    return response.data;
  },

  getLocationSessionsChart: async (
    locationId: string,
    period: "1W" | "1M" | "3M" | "1Y" | "ALL"
  ): Promise<Array<{ time: string; activeSessions: number }>> => {
    const response = await apiClient.get(
      `/transactions/locations/${locationId}/sessions-chart`,
      {
        params: { period },
      }
    );
    return response.data;
  },

  getEvents: async (params?: {
    chargePointId?: string;
    limit?: number;
  }): Promise<Event[]> => {
    const response = await apiClient.get<Event[]>("/transactions/events", {
      params,
    });
    return response.data;
  },
};
