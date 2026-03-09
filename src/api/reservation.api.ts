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

export const reservationApi = {
  getReservations: async (
    filters?: ReservationFilters
  ): Promise<PaginatedResponse<Reservation>> => {
    const response = await apiClient.get<PaginatedResponse<Reservation>>(
      "/reservations",
      { params: filters }
    );
    return response.data;
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
    const response = await apiClient.get<Reservation[]>(
      `/reservations/charge-point/${chargePointId}`
    );
    return response.data;
  },

  getReservationsByIdTag: async (idTag: string): Promise<Reservation[]> => {
    const response = await apiClient.get<Reservation[]>(
      `/reservations/id-tag/${idTag}`
    );
    return response.data;
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
