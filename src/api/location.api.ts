import type {
  CreateLocationRequest,
  Location as ApiLocation,
  UpdateLocationRequest,
} from "@/types/api";

import type { ChargePoint, Location as OcppLocation } from "@/types/ocpp";
import { apiClient } from "./axios";
import { extractArray, normalizeLocation, normalizeChargePoint } from "./utils";

export const locationApi = {
  getLocations: async (): Promise<ApiLocation[]> => {
    const response = await apiClient.get<unknown>(
      "/locations/listAllLocations"
    );
    return extractArray<ApiLocation>(response.data).map(normalizeLocation);
  },

  getLocation: async (locationId: string): Promise<OcppLocation> => {
    const response = await apiClient.get<OcppLocation>(
      `/locations/${locationId}`
    );
    return normalizeLocation(response.data);
  },

  getChargePointsForLocation: async (locationId: string): Promise<ChargePoint[]> => {
    const response = await apiClient.get<unknown>(
      `/locations/${locationId}/charge-points`
    );
    return extractArray<ChargePoint>(response.data).map(normalizeChargePoint);
  },

  createLocation: async (data: CreateLocationRequest): Promise<OcppLocation> => {
    const response = await apiClient.post<OcppLocation>(
      "/locations/createLocation",
      data
    );
    return normalizeLocation(response.data);
  },

  updateLocation: async (
    locationId: string,
    data: UpdateLocationRequest
  ): Promise<OcppLocation> => {
    const response = await apiClient.put<OcppLocation>(
      `/locations/${locationId}`,
      data
    );
    return normalizeLocation(response.data);
  },

  deleteLocation: async (locationId: string): Promise<void> => {
    await apiClient.delete(`/locations/${locationId}`);
  },
};
