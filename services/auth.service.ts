import "server-only";
import { api } from "@/lib/api";
import type { SessionUser } from "@/lib/session";

export interface AuthPayload {
  token: string;
  refreshToken: string;
  user: SessionUser;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  login: (data: LoginInput) =>
    api.post<AuthPayload>("/auth/login", data, { skipAuth: true }),
};
