import "server-only";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/models";
import type { User } from "@/models/user";

export interface GetUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  roleId: number;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  roleId?: number;
}

export interface RoleOption {
  id: number;
  name: string;
}

export const userService = {
  getAllUsers: (query: GetUsersQuery) => {
    const params = new URLSearchParams();
    if (query.page) params.append("page", String(query.page));
    if (query.limit) params.append("limit", String(query.limit));
    if (query.search) params.append("search", query.search);
    if (query.role) params.append("role", query.role);

    return api.get<ApiResponse<User[]>>(`/users?${params.toString()}`, {
      returnFullResponse: true,
    });
  },

  createUser: (data: CreateUserData) => {
    return api.post<User>("/users", data);
  },

  updateUser: (id: number, data: UpdateUserData) => {
    return api.put<User>(`/users/${id}`, data);
  },

  deleteUser: (id: number) => {
    return api.delete<{ message: string }>(`/users/${id}`);
  },

  updateUserPassword: (id: number, password: string) => {
    return api.put<{ message: string }>(`/users/${id}/password`, { password });
  },

  getRoles: () => {
    return api.get<RoleOption[]>("/roles");
  },
};
