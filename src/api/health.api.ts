import { apiClient } from "./axios";

export interface HealthResponse {
  status?: string;
  uptime?: number;
  timestamp?: string;
  [key: string]: any;
}

export const healthApi = {
  check: async (): Promise<HealthResponse> => {
    const response = await apiClient.get<HealthResponse>("/health", {
      baseURL: (apiClient.defaults.baseURL || "").replace(/\/?api\/?$/, ""),
    });
    return response.data;
  },
};
