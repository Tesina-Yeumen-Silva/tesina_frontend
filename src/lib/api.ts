import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_URL, AUTH_COOKIE } from "./config";
import type { ApiResponse } from "@/models";

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;

  skipAuth?: boolean;
}

async function request<T>(
  path: string,
  { body, skipAuth, headers, ...init }: RequestOptions = {},
): Promise<T> {
  const finalHeaders = new Headers(headers);
  finalHeaders.set("Content-Type", "application/json");

  if (!skipAuth) {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "No se pudo conectar con el servidor. Verifique que el backend esté en ejecución.",
      503,
    );
  }

  const text = await res.text();
  const payload = text ? JSON.parse(text) : null;

  if (!res.ok) {
    if (res.status === 401 && !skipAuth) redirect("/login");
    const message =
      payload?.message ?? "Ocurrió un error al comunicarse con el servidor.";

    let mappedFieldErrors: Record<string, string[]> | undefined = undefined;
    if (payload?.errors && Array.isArray(payload.errors)) {
      mappedFieldErrors = {};
      for (const item of payload.errors) {
        if (item.campo && item.error) {
          if (!mappedFieldErrors[item.campo]) {
            mappedFieldErrors[item.campo] = [];
          }
          mappedFieldErrors[item.campo].push(item.error);
        }
      }
    }

    throw new ApiError(message, res.status, mappedFieldErrors);
  }

  return (payload as ApiResponse<T>)?.data ?? (payload as T);
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "POST", body }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "DELETE" }),
};
