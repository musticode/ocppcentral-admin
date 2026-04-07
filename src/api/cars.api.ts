import { apiClient } from "./axios";
import { extractArray, normalizeCar } from "./utils";
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
    return extractArray<Car>(response.data).map(normalizeCar);
  },

  getMyCars: async (): Promise<Car[]> => {
    const response = await apiClient.get<unknown>("/cars/my-cars");
    return extractArray<Car>(response.data).map(normalizeCar);
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
    return extractArray<Car>(response.data).map(normalizeCar);
  },

  getCarsByCompany: async (companyId: string): Promise<Car[]> => {
    const response = await apiClient.get<unknown>(`/cars/company/${companyId}`);
    return extractArray<Car>(response.data).map(normalizeCar);
  },

  getCarByLicensePlate: async (licensePlate: string): Promise<Car> => {
    const response = await apiClient.get<Car>(
      `/cars/license-plate/${licensePlate}`
    );
    return normalizeCar(response.data);
  },

  getCarById: async (carId: string): Promise<Car> => {
    const response = await apiClient.get<Car>(`/cars/${carId}`);
    return normalizeCar(response.data);
  },

  createCar: async (data: CreateCarRequest): Promise<Car> => {
    const response = await apiClient.post<Car>("/cars", data);
    return normalizeCar(response.data);
  },

  updateCar: async (carId: string, data: UpdateCarRequest): Promise<Car> => {
    const response = await apiClient.put<Car>(`/cars/${carId}`, data);
    return normalizeCar(response.data);
  },

  deleteCar: async (carId: string): Promise<void> => {
    await apiClient.delete(`/cars/${carId}`);
  },

  deactivateCar: async (carId: string): Promise<Car> => {
    const response = await apiClient.post<Car>(`/cars/${carId}/deactivate`);
    return normalizeCar(response.data);
  },

  activateCar: async (carId: string): Promise<Car> => {
    const response = await apiClient.post<Car>(`/cars/${carId}/activate`);
    return normalizeCar(response.data);
  },
};
