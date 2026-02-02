import { apiClient } from "./axios";
import type { Location } from "@/types/ocpp";

export interface CreateLocationInput {
  name: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateLocationInput {
  name?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}

export const locationApi = {
  getLocations: async (): Promise<Location[]> => {
    const response = await apiClient.get<Location[]>(
      "/locations/listAllLocations"
    );
    return response.data;
  },

  getLocation: async (locationId: string): Promise<Location> => {
    const response = await apiClient.get<Location>(
      `/charge-points/locations/${locationId}`
    );
    return response.data;
  },

  createLocation: async (data: CreateLocationInput): Promise<Location> => {
    const response = await apiClient.post<Location>(
      "/charge-points/locations",
      data
    );
    return response.data;
  },

  updateLocation: async (
    locationId: string,
    data: UpdateLocationInput
  ): Promise<Location> => {
    const response = await apiClient.patch<Location>(
      `/charge-points/locations/${locationId}`,
      data
    );
    return response.data;
  },
};
