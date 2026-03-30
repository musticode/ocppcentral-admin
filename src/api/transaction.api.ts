import type { Event, Session, Transaction } from "@/types/ocpp";

import type { PaginatedResponse } from "@/types/api";
import { apiClient } from "./axios";
import { extractArray } from "./utils";

export const transactionApi = {
  listAllTransactions: async (): Promise<Transaction[]> => {
    const response = await apiClient.get<unknown>(
      "/transactions/listAllTransactions"
    );
    return extractArray<Transaction>(response.data);
  },

  fetchTransactionsByCompanyName: async (
    companyName: string
  ): Promise<Transaction[]> => {
    const response = await apiClient.get<unknown>(
      "/transactions/fetchTransactionsByCompanyName",
      { params: { companyName } }
    );
    return extractArray<Transaction>(response.data);
  },

  getTransactions: async (params?: {
    chargePointId?: string;
    status?: "Active" | "Completed";
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get<unknown>(
      "/transactions/listAllTransactions",
      { params }
    );
    const payload = response.data;
    if (Array.isArray(payload)) {
      return { data: payload as Transaction[], total: payload.length, page: 1, limit: payload.length, totalPages: 1 };
    }
    if (payload && typeof payload === "object" && Array.isArray((payload as any).data)) {
      return payload as PaginatedResponse<Transaction>;
    }
    return { data: extractArray<Transaction>(payload), total: 0, page: 1, limit: 20, totalPages: 0 };
  },

  getTransaction: async (transactionId: string): Promise<Transaction> => {
    const response = await apiClient.get<Transaction>(
      `/transactions/${transactionId}`
    );
    return response.data;
  },

  getSessionsByCompany: async (
    companyId: string,
    signal?: AbortSignal
  ): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get<unknown>(
      `/transactions/fetchTransactionsByCompanyName`,
      { params: { companyName: companyId }, signal }
    );

    const payload = response.data;

    // Backend may return a plain array or a paginated wrapper
    if (Array.isArray(payload)) {
      return {
        data: payload as Transaction[],
        total: payload.length,
        page: 1,
        limit: payload.length,
        totalPages: 1,
      };
    }

    if (payload && typeof payload === "object") {
      const obj = payload as Record<string, unknown>;
      // Already a paginated response
      if (Array.isArray(obj.data)) {
        return payload as PaginatedResponse<Transaction>;
      }
      // Some APIs nest under a different key
      if (Array.isArray(obj.sessions)) {
        const sessions = obj.sessions as Transaction[];
        return {
          data: sessions,
          total: sessions.length,
          page: 1,
          limit: sessions.length,
          totalPages: 1,
        };
      }
    }

    return { data: [], total: 0, page: 1, limit: 20, totalPages: 0 };
  },

  getSessions: async (params?: {
    locationId?: string;
    chargePointId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Session>> => {
    const response = await apiClient.get<unknown>(
      "/transactions/listAllTransactions",
      { params }
    );
    const payload = response.data;
    if (Array.isArray(payload)) {
      return { data: payload as Session[], total: payload.length, page: 1, limit: payload.length, totalPages: 1 };
    }
    if (payload && typeof payload === "object" && Array.isArray((payload as any).data)) {
      return payload as PaginatedResponse<Session>;
    }
    return { data: extractArray<Session>(payload), total: 0, page: 1, limit: 20, totalPages: 0 };
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
    companyId?: string;
    limit?: number;
  }): Promise<Event[]> => {
    const response = await apiClient.get<unknown>("/transactions/events", {
      params,
    });
    return extractArray<Event>(response.data);
  },
};
