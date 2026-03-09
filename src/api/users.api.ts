import { apiClient } from "./axios";
import type { User, CreateUserRequest } from "@/types/api";

export const usersApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>("/users/listAllUsers");
    return response.data;
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<User>("/users/createNewUser", data);
    return response.data;
  },
};
