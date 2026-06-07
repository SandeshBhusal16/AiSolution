import type { NextRequest } from "next/server";
import { loginSchema } from "@/lib/validations";
import {
  createSession,
  ensureDefaultAdmin,
  getAdminByEmail,
  verifyPassword,
} from "@/lib/auth";
import { badRequest, ok, serverError, unauthorized, zodErrors } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Guarantees the demo admin exists on a fresh checkout.
    await ensureDefaultAdmin();

    const body = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Please check your details", zodErrors(parsed.error));
    }

    const admin = await getAdminByEmail(parsed.data.email);
    if (!admin) {
      return unauthorized("Invalid email or password");
    }

    const valid = await verifyPassword(parsed.data.password, admin.passwordHash);
    if (!valid) {
      return unauthorized("Invalid email or password");
    }

    await createSession(admin);
    return ok({ id: admin.id, name: admin.name, email: admin.email });
  } catch (error) {
    console.error("[api/auth/login]", error);
    return serverError("Could not sign you in. Please try again.");
  }
}
