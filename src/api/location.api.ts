import type {
  CreateLocationRequest,
  Location as ApiLocation,
  UpdateLocationRequest,
} from "@/types/api";

import type { ChargePoint, Location as OcppLocation } from "@/types/ocpp";
import { apiClient } from "./axios";

export const locationApi = {
  getLocations: async (): Promise<ApiLocation[]> => {
    const response = await apiClient.get<unknown>("/locations/listAllLocations");

    const payload = response.data as unknown;

    if (Array.isArray(payload)) return payload as ApiLocation[];

    if (payload && typeof payload === "object") {
      const maybeData = (payload as { data?: unknown }).data;
      if (Array.isArray(maybeData)) return maybeData as ApiLocation[];
    }

    return [];
  },

  getLocationsByCompanyId: async (companyId: string): Promise<ApiLocation[]> => {
    const response = await apiClient.get<unknown>(`/fetchCompanyLocations?companyId=${companyId}`);

    const payload = response.data as unknown;

    if (Array.isArray(payload)) return payload as ApiLocation[];

    if (payload && typeof payload === "object") {
      const maybeData = (payload as { data?: unknown }).data;
      if (Array.isArray(maybeData)) return maybeData as ApiLocation[];
    }

    return [];
  },

  getLocation: async (locationId: string): Promise<OcppLocation> => {
    const response = await apiClient.get<OcppLocation>(
      `/locations/${locationId}`
    );
    return response.data;
  },

  getChargePointsForLocation: async (locationId: string): Promise<ChargePoint[]> => {
    const response = await apiClient.get<ChargePoint[]>(
      `/locations/${locationId}/charge-points`
    );
    return response.data;
  },

  createLocation: async (data: CreateLocationRequest): Promise<OcppLocation> => {
    const response = await apiClient.post<OcppLocation>(
      "/locations/createLocation",
      data
    );
    return response.data;
  },

  updateLocation: async (
    locationId: string,
    data: UpdateLocationRequest
  ): Promise<OcppLocation> => {
    const response = await apiClient.put<OcppLocation>(
      `/locations/${locationId}`,
      data
    );
    return response.data;
  },

  deleteLocation: async (locationId: string): Promise<void> => {
    await apiClient.delete(`/locations/${locationId}`);
  },
};
