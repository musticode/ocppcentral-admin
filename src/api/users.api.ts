import { apiClient } from "./axios";
import { extractArray } from "./utils";
import type { User, CreateUserRequest } from "@/types/api";

// Swagger serves /users/* outside the /api prefix
const usersBaseURL = (apiClient.defaults.baseURL || "").replace(/\/?api\/?$/, "") || "/";

export const usersApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<unknown>("/users/listAllUsers", {
      baseURL: usersBaseURL,
    });
    return extractArray<User>(response.data);
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<User>("/users/createNewUser", data, {
      baseURL: usersBaseURL,
    });
    return response.data;
  },
};
