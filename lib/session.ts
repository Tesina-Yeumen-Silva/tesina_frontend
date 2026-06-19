import "server-only";
import { cookies } from "next/headers";
import {
  AUTH_COOKIE,
  REFRESH_COOKIE,
  USER_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from "./config";
import type { Role } from "@/models/role";

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: Role;
}

export async function createSession(
  token: string,
  refreshToken: string,
  user: SessionUser,
) {
  const store = await cookies();
  const secure = process.env.NODE_ENV === "production";

  store.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  store.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });

  store.set(USER_COOKIE, JSON.stringify(user), {
    httpOnly: false,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
  store.delete(REFRESH_COOKIE);
  store.delete(USER_COOKIE);
}

export async function getAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  if (!store.get(REFRESH_COOKIE)?.value) return null;

  const raw = store.get(USER_COOKIE)?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<SessionUser>;
    if (!parsed.id || !parsed.email || !parsed.name || !parsed.role) {
      return null;
    }
    return parsed as SessionUser;
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return Boolean(store.get(REFRESH_COOKIE)?.value);
}
