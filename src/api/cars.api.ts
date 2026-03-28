import { apiClient } from "./axios";
import { extractArray } from "./utils";
import type {
  Car,
  CreateCarRequest,
  UpdateCarRequest,
  CarFilters,
  CarStats,
} from "@/types/api";

export const carsApi = {
  getCars: async (filters?: CarFilters): Promise<Car[]> => {
    const response = await apiClient.get<unknown>("/cars", {
      params: filters,
    });
    return extractArray<Car>(response.data);
  },

  getMyCars: async (): Promise<Car[]> => {
    const response = await apiClient.get<unknown>("/cars/my-cars");
    return extractArray<Car>(response.data);
  },

  getCarStats: async (filters?: {
    userId?: string;
    companyId?: string;
  }): Promise<CarStats> => {
    const response = await apiClient.get<CarStats>("/cars/stats", {
      params: filters,
    });
    return response.data;
  },

  getCarsByUser: async (userId: string): Promise<Car[]> => {
    const response = await apiClient.get<unknown>(`/cars/user/${userId}`);
    return extractArray<Car>(response.data);
  },

  getCarsByCompany: async (companyId: string): Promise<Car[]> => {
    const response = await apiClient.get<unknown>(`/cars/company/${companyId}`);
    return extractArray<Car>(response.data);
  },

  getCarByLicensePlate: async (licensePlate: string): Promise<Car> => {
    const response = await apiClient.get<Car>(
      `/cars/license-plate/${licensePlate}`
    );
    return response.data;
  },

  getCarById: async (carId: string): Promise<Car> => {
    const response = await apiClient.get<Car>(`/cars/${carId}`);
    return response.data;
  },

  createCar: async (data: CreateCarRequest): Promise<Car> => {
    const response = await apiClient.post<Car>("/cars", data);
    return response.data;
  },

  updateCar: async (carId: string, data: UpdateCarRequest): Promise<Car> => {
    const response = await apiClient.put<Car>(`/cars/${carId}`, data);
    return response.data;
  },

  deleteCar: async (carId: string): Promise<void> => {
    await apiClient.delete(`/cars/${carId}`);
  },

  deactivateCar: async (carId: string): Promise<Car> => {
    const response = await apiClient.post<Car>(`/cars/${carId}/deactivate`);
    return response.data;
  },

  activateCar: async (carId: string): Promise<Car> => {
    const response = await apiClient.post<Car>(`/cars/${carId}/activate`);
    return response.data;
  },
};
