import { apiClient } from "./axios";
import { extractArray, normalizeFleet } from "./utils";
import { isDemoMode } from "@/demo/demoMode";

import type {
  Fleet,
  CreateFleetRequest,
  UpdateFleetRequest,
  FleetVehicle,
  AssignVehicleToFleetRequest,
  UpdateFleetVehicleRequest,
  FleetDriver,
  AssignDriverToFleetRequest,
  UpdateFleetDriverRequest,
  FleetStats,
  FleetAnalytics,
} from "@/types/api";

export const fleetApi = {
  // Fleet CRUD
  getAllFleets: async (companyId: string): Promise<Fleet[]> => {
    if (isDemoMode) {
      return [];
    }
    const response = await apiClient.get<unknown>(`/fleets`, {
      params: { companyId },
    });
    return extractArray<Fleet>(response.data).map(normalizeFleet);
  },

  getFleetById: async (id: string): Promise<Fleet> => {
    if (isDemoMode) {
      throw new Error("Fleet not found");
    }
    const response = await apiClient.get<Fleet>(`/fleets/${id}`);

    //    const response = await apiClient.get<Car>(`/cars/${carId}`);
    //return normalizeCar(response.data);

    return normalizeFleet(response.data);
    //return response.data;
  },

  createFleet: async (
    companyId: string,
    data: CreateFleetRequest,
  ): Promise<Fleet> => {
    if (isDemoMode) {
      throw new Error("Cannot create fleet in demo mode");
    }
    const response = await apiClient.post<Fleet>(`/fleets`, {
      ...data,
      companyId,
    });
    return normalizeFleet(response.data);
  },

  updateFleet: async (id: string, data: UpdateFleetRequest): Promise<Fleet> => {
    if (isDemoMode) {
      throw new Error("Cannot update fleet in demo mode");
    }
    const response = await apiClient.put<Fleet>(`/fleets/${id}`, data);
    return normalizeFleet(response.data);
  },

  deleteFleet: async (id: string): Promise<void> => {
    if (isDemoMode) {
      throw new Error("Cannot delete fleet in demo mode");
    }
    await apiClient.delete(`/fleets/${id}`);
  },

  // Fleet Vehicles
  getFleetVehicles: async (fleetId: string): Promise<FleetVehicle[]> => {
    if (isDemoMode) {
      return [];
    }
    const response = await apiClient.get<unknown>(
      `/fleets/${fleetId}/vehicles`,
    );
    return extractArray<FleetVehicle>(response.data);
  },

  assignVehicleToFleet: async (
    fleetId: string,
    data: AssignVehicleToFleetRequest,
  ): Promise<FleetVehicle> => {
    if (isDemoMode) {
      throw new Error("Cannot assign vehicle in demo mode");
    }
    const response = await apiClient.post<FleetVehicle>(
      `/fleets/${fleetId}/vehicles`,
      data,
    );
    return response.data;
  },

  updateFleetVehicle: async (
    fleetId: string,
    vehicleId: string,
    data: UpdateFleetVehicleRequest,
  ): Promise<FleetVehicle> => {
    if (isDemoMode) {
      throw new Error("Cannot update fleet vehicle in demo mode");
    }
    const response = await apiClient.put<FleetVehicle>(
      `/fleets/${fleetId}/vehicles/${vehicleId}`,
      data,
    );
    return response.data;
  },

  removeVehicleFromFleet: async (
    fleetId: string,
    vehicleId: string,
  ): Promise<void> => {
    if (isDemoMode) {
      throw new Error("Cannot remove vehicle in demo mode");
    }
    await apiClient.delete(`/fleets/${fleetId}/vehicles/${vehicleId}`);
  },

  // Fleet Drivers
  getFleetDrivers: async (fleetId: string): Promise<FleetDriver[]> => {
    if (isDemoMode) {
      return [];
    }
    const response = await apiClient.get<unknown>(
      `/fleets/${fleetId}/drivers`,
    );
    return extractArray<FleetDriver>(response.data);
  },

  assignDriverToFleet: async (
    fleetId: string,
    data: AssignDriverToFleetRequest,
  ): Promise<FleetDriver> => {
    if (isDemoMode) {
      throw new Error("Cannot assign driver in demo mode");
    }
    const response = await apiClient.post<FleetDriver>(
      `/fleets/${fleetId}/drivers`,
      data,
    );
    return response.data;
  },

  updateFleetDriver: async (
    fleetId: string,
    driverId: string,
    data: UpdateFleetDriverRequest,
  ): Promise<FleetDriver> => {
    if (isDemoMode) {
      throw new Error("Cannot update fleet driver in demo mode");
    }
    const response = await apiClient.put<FleetDriver>(
      `/fleets/${fleetId}/drivers/${driverId}`,
      data,
    );
    return response.data;
  },

  removeDriverFromFleet: async (
    fleetId: string,
    driverId: string,
  ): Promise<void> => {
    if (isDemoMode) {
      throw new Error("Cannot remove driver in demo mode");
    }
    await apiClient.delete(`/fleets/${fleetId}/drivers/${driverId}`);
  },

  // Fleet Stats & Analytics
  getFleetStats: async (companyId: string): Promise<FleetStats> => {
    if (isDemoMode) {
      return {
        totalFleets: 0,
        activeFleets: 0,
        totalVehicles: 0,
        availableVehicles: 0,
        vehiclesInUse: 0,
        vehiclesCharging: 0,
        vehiclesInMaintenance: 0,
        totalDrivers: 0,
        activeDrivers: 0,
        totalEnergyConsumed: 0,
        totalSessions: 0,
        averageEfficiency: 0,
      };
    }
    const response = await apiClient.get<FleetStats>(`/fleets/stats`, {
      params: { companyId },
    });
    return response.data;
  },

  getFleetAnalytics: async (
    fleetId: string,
    period: "1W" | "1M" | "3M" | "1Y",
  ): Promise<FleetAnalytics> => {
    if (isDemoMode) {
      return {
        fleetId,
        period,
        energyConsumption: [],
        vehicleUtilization: [],
        driverPerformance: [],
        costAnalysis: {
          totalCost: 0,
          costPerKwh: 0,
          costPerSession: 0,
          costPerVehicle: 0,
        },
      };
    }
    const response = await apiClient.get<FleetAnalytics>(
      `/fleets/${fleetId}/analytics`,
      {
        params: { period },
      },
    );
    return response.data;
  },
};
