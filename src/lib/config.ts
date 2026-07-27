export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4500";

// Nombres de las cookies
export const AUTH_COOKIE = "auth_token";
export const REFRESH_COOKIE = "refresh_token";
export const USER_COOKIE = "user_data";

export const ACCESS_TOKEN_MAX_AGE = 15 * 60;
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;
