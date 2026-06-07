import type { NextRequest } from "next/server";
import { demoRequestSchema } from "@/lib/validations";
import { addRecord, FILES, readJsonFile } from "@/lib/json-db";
import { DEFAULT_STATUS } from "@/lib/constants";
import {
  badRequest,
  created,
  ok,
  requireAdmin,
  serverError,
  unauthorized,
  zodErrors,
} from "@/lib/api";
import type { DemoRequest } from "@/lib/types";

export const runtime = "nodejs";

/** GET /api/demo-requests — list all demo requests (admin only). */
export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  const requests = await readJsonFile<DemoRequest>(FILES.demoRequests);
  return ok(requests);
}

/** POST /api/demo-requests — submit a new demo request (public). */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = demoRequestSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(
        "Please correct the highlighted fields",
        zodErrors(parsed.error),
      );
    }

    const record = await addRecord<DemoRequest>(FILES.demoRequests, {
      ...parsed.data,
      message: parsed.data.message ?? "",
      status: DEFAULT_STATUS,
    });
    return created(record);
  } catch (error) {
    console.error("[api/demo-requests POST]", error);
    return serverError("Could not save your demo request. Please try again.");
  }
}
