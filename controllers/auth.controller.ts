import { createSession, destroySession } from "@/lib/session";
import { validate, toFailure, field } from "@/lib/validation";
import { ActionResult } from "@/models/common";
import { PANEL_ROLES } from "@/models/role";
import { loginLocalSchema } from "@/models/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { redirect } from "next/navigation";

export async function loginAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = validate(loginLocalSchema, {
    email: field(formData, "email"),
    password: field(formData, "password"),
  });

  if (!parsed.ok) return parsed;

  try {
    const { token, refreshToken, user } = await authService.login(parsed.data);

    if (!PANEL_ROLES.includes(user.role)) {
      return {
        ok: false,
        error:
          "Acceso denegado. Este portal es exclusivo para administradores.",
      };
    }

    await createSession(token, refreshToken, user);
  } catch (error) {
    return toFailure(error);
  }

  const redirectTo = field(formData, "redirect") ?? "/";
  redirect(redirectTo);
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
