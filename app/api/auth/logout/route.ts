import { destroySession } from "@/lib/auth";
import { ok } from "@/lib/api";

export const runtime = "nodejs";

export async function POST() {
  destroySession();
  return ok({ message: "Logged out" });
}
