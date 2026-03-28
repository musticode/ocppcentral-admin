import type {
  ApiResponse,
  CreateReservationRequest,
  PaginatedResponse,
  Reservation,
  ReservationFilters,
  ValidateReservationRequest,
  ValidateReservationResponse,
} from "@/types/api";

import { apiClient } from "./axios";
import { extractArray } from "./utils";

export const reservationApi = {
  getReservations: async (
    filters?: ReservationFilters
  ): Promise<PaginatedResponse<Reservation>> => {
    const response = await apiClient.get<unknown>(
      "/reservations",
      { params: filters }
    );
    const payload = response.data;
    if (Array.isArray(payload)) {
      return { data: payload as Reservation[], total: payload.length, page: 1, limit: payload.length, totalPages: 1 };
    }
    if (payload && typeof payload === "object" && Array.isArray((payload as any).data)) {
      return payload as PaginatedResponse<Reservation>;
    }
    return { data: extractArray<Reservation>(payload), total: 0, page: 1, limit: 20, totalPages: 0 };
  },

  getReservation: async (reservationId: number): Promise<Reservation> => {
    const response = await apiClient.get<Reservation>(
      `/reservations/${reservationId}`
    );
    return response.data;
  },

  createReservation: async (
    data: CreateReservationRequest
  ): Promise<Reservation> => {
    const response = await apiClient.post<Reservation>("/reservations", data);
    return response.data;
  },

  cancelReservation: async (
    reservationId: number
  ): Promise<ApiResponse<Reservation>> => {
    const response = await apiClient.post<ApiResponse<Reservation>>(
      `/reservations/${reservationId}/cancel`
    );
    return response.data;
  },

  deleteReservation: async (reservationId: number): Promise<void> => {
    await apiClient.delete(`/reservations/${reservationId}`);
  },

  getReservationsByChargePoint: async (
    chargePointId: string
  ): Promise<Reservation[]> => {
    const response = await apiClient.get<unknown>(
      `/reservations/charge-point/${chargePointId}`
    );
    return extractArray<Reservation>(response.data);
  },

  getReservationsByIdTag: async (idTag: string): Promise<Reservation[]> => {
    const response = await apiClient.get<unknown>(
      `/reservations/id-tag/${idTag}`
    );
    return extractArray<Reservation>(response.data);
  },

  validateReservation: async (
    data: ValidateReservationRequest
  ): Promise<ValidateReservationResponse> => {
    const response = await apiClient.post<ValidateReservationResponse>(
      "/reservations/validate",
      data
    );
    return response.data;
  },

  expireOldReservations: async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await apiClient.post<ApiResponse<{ count: number }>>(
      "/reservations/expire-old"
    );
    return response.data;
  },
};
