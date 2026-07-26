import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  API_URL,
  AUTH_COOKIE,
  REFRESH_COOKIE,
  USER_COOKIE,
} from "./lib/config";
import { PANEL_ROLES } from "./models/role";

export async function proxy(request: NextRequest) {
  // Ignorar peticiones de Server Actions de Next.js para que no interfiera con sus respuestas internas
  if (request.headers.has("next-action")) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  const response = NextResponse.next();

  const authToken = request.cookies.get(AUTH_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  const isAsset = pathname.startsWith("/_next") || pathname.includes(".");
  const isLoginPage = pathname === "/login";

  if (isAsset) return response;

  if (!authToken && refreshToken) {
    try {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const payload = await refreshResponse.json();
        const newAccessToken = payload?.data?.accessToken;

        if (newAccessToken) {
          const secure = process.env.NODE_ENV === "production";
          const maxAge = 15 * 60;

          response.cookies.set(AUTH_COOKIE, newAccessToken, {
            httpOnly: true,
            secure,
            sameSite: "lax",
            path: "/",
            maxAge,
          });

          request.cookies.set(AUTH_COOKIE, newAccessToken);

          if (isLoginPage) {
            return NextResponse.redirect(new URL("/reportMap", request.url));
          }

          return response;
        }
      }
    } catch (err) {
      console.error(
        "Error intentando refrescar el token en el middleware:",
        err,
      );
    }

    const redirectResponse = NextResponse.redirect(
      new URL("/login", request.url),
    );
    redirectResponse.cookies.delete(AUTH_COOKIE);
    redirectResponse.cookies.delete(REFRESH_COOKIE);
    redirectResponse.cookies.delete(USER_COOKIE);
    return redirectResponse;
  }

  const isUserAuthenticated = Boolean(authToken || refreshToken);

  const userCookie = request.cookies.get(USER_COOKIE)?.value;
  let userRole: string | undefined;
  if (userCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(userCookie));
      userRole = parsed?.role;
    } catch {}
  }

  if (
    isUserAuthenticated &&
    userRole &&
    !PANEL_ROLES.includes(userRole as any)
  ) {
    const redirectResponse = NextResponse.redirect(
      new URL("/login", request.url),
    );
    redirectResponse.cookies.delete(AUTH_COOKIE);
    redirectResponse.cookies.delete(REFRESH_COOKIE);
    redirectResponse.cookies.delete(USER_COOKIE);
    return redirectResponse;
  }

  if (!isUserAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isUserAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/reportMap", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
