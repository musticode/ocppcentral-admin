import { apiClient } from "./axios";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  User,
} from "@/types/api";

export const authApi = {
  signup: async (data: SignupRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/signup", data);
    return response.data;
  },

  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials,
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },
};
