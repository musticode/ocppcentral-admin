import type { CreateLocationRequest, Location, UpdateLocationRequest } from "@/types/api";

import type { ChargePoint } from "@/types/ocpp";
import { apiClient } from "./axios";

export const locationApi = {
  getLocations: async (): Promise<Location[]> => {
    const response = await apiClient.get<Location[]>(
      "/locations/listAllLocations"
    );
    return response.data;
  },

  getLocation: async (locationId: string): Promise<Location> => {
    const response = await apiClient.get<Location>(
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

  createLocation: async (data: CreateLocationRequest): Promise<Location> => {
    const response = await apiClient.post<Location>(
      "/locations/createLocation",
      data
    );
    return response.data;
  },

  updateLocation: async (
    locationId: string,
    data: UpdateLocationRequest
  ): Promise<Location> => {
    const response = await apiClient.put<Location>(
      `/locations/${locationId}`,
      data
    );
    return response.data;
  },

  deleteLocation: async (locationId: string): Promise<void> => {
    await apiClient.delete(`/locations/${locationId}`);
  },
};
