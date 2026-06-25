import { apiClient } from "./axios";
import { extractArray, normalizeUser } from "./utils";
import type { User, CreateUserRequest, UpdateUserRequest } from "@/types/api";
import { useCompanyStore } from "@/store/company.store";

// Swagger serves /users/* outside the /api prefix
const usersBaseURL = (apiClient.defaults.baseURL || "").replace(/\/?api\/?$/, "") || "/";

export const usersApi = {
  fetchCompanyUsers: async (): Promise<User[]> => {
    let companyId = useCompanyStore.getState().companyId;
    if (!companyId) {
      companyId = localStorage.getItem("companyId") || "";
    }

    const response = await apiClient.get<unknown>("/users/fetchCompanyUsers", {
      baseURL: usersBaseURL,
      params: { companyId },
    });
    return extractArray<User>(response.data).map(normalizeUser);
  },
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<unknown>("/users/listAllUsers", {
      baseURL: usersBaseURL,
    });
    return extractArray<User>(response.data).map(normalizeUser);
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<{ success: boolean; data: User }>(`/users/${id}`, {
      baseURL: usersBaseURL,
    });
    return normalizeUser(response.data.data);
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<User>("/users/createNewUser", data, {
      baseURL: usersBaseURL,
    });
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.patch<{ success: boolean; data: User }>("/users/updateUser", { id, ...data }, {
      baseURL: usersBaseURL,
    });
    return normalizeUser(response.data.data);
  },
};
