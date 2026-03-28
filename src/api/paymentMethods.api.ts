import { apiClient } from "./axios";
import { extractArray } from "./utils";
import type {
  PaymentMethod,
  PaymentMethodFilters,
  CreatePaymentMethodRequest,
  UpdatePaymentMethodRequest,
  PaymentMethodStats,
  PaymentEligibility,
} from "@/types/api";

export const paymentMethodsApi = {
  getPaymentMethods: async (
    filters?: PaymentMethodFilters
  ): Promise<PaymentMethod[]> => {
    const response = await apiClient.get<unknown>("/payment-methods", {
      params: filters,
    });
    return extractArray<PaymentMethod>(response.data);
  },

  createPaymentMethod: async (
    data: CreatePaymentMethodRequest
  ): Promise<PaymentMethod> => {
    const response = await apiClient.post<PaymentMethod>(
      "/payment-methods",
      data
    );
    return response.data;
  },

  getMyPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const response = await apiClient.get<unknown>(
      "/payment-methods/my-methods"
    );
    return extractArray<PaymentMethod>(response.data);
  },

  getActivePaymentMethod: async (): Promise<PaymentMethod | null> => {
    const response = await apiClient.get<PaymentMethod | null>(
      "/payment-methods/active"
    );
    return response.data;
  },

  checkPaymentEligibility: async (): Promise<PaymentEligibility> => {
    const response = await apiClient.get<PaymentEligibility>(
      "/payment-methods/check-payment"
    );
    return response.data;
  },

  getPaymentMethodStats: async (params?: {
    userId?: string;
  }): Promise<PaymentMethodStats> => {
    const response = await apiClient.get<PaymentMethodStats>(
      "/payment-methods/stats",
      { params }
    );
    return response.data;
  },

  getPaymentMethodsByUser: async (userId: string): Promise<PaymentMethod[]> => {
    const response = await apiClient.get<unknown>(
      `/payment-methods/user/${userId}`
    );
    return extractArray<PaymentMethod>(response.data);
  },

  expireOldPaymentMethods: async (): Promise<{ count: number }> => {
    const response = await apiClient.post<{ count: number }>(
      "/payment-methods/expire-old"
    );
    return response.data;
  },

  getPaymentMethodById: async (
    paymentMethodId: string
  ): Promise<PaymentMethod> => {
    const response = await apiClient.get<PaymentMethod>(
      `/payment-methods/${paymentMethodId}`
    );
    return response.data;
  },

  updatePaymentMethod: async (
    paymentMethodId: string,
    data: UpdatePaymentMethodRequest
  ): Promise<PaymentMethod> => {
    const response = await apiClient.put<PaymentMethod>(
      `/payment-methods/${paymentMethodId}`,
      data
    );
    return response.data;
  },

  deletePaymentMethod: async (paymentMethodId: string): Promise<void> => {
    await apiClient.delete(`/payment-methods/${paymentMethodId}`);
  },

  setActive: async (paymentMethodId: string): Promise<PaymentMethod> => {
    const response = await apiClient.post<PaymentMethod>(
      `/payment-methods/${paymentMethodId}/set-active`
    );
    return response.data;
  },

  verify: async (paymentMethodId: string): Promise<PaymentMethod> => {
    const response = await apiClient.post<PaymentMethod>(
      `/payment-methods/${paymentMethodId}/verify`
    );
    return response.data;
  },

  deactivate: async (paymentMethodId: string): Promise<PaymentMethod> => {
    const response = await apiClient.post<PaymentMethod>(
      `/payment-methods/${paymentMethodId}/deactivate`
    );
    return response.data;
  },
};
