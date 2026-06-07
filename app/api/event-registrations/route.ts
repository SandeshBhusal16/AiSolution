import type { NextRequest } from "next/server";
import { eventRegistrationSchema } from "@/lib/validations";
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
import type { EventRegistration } from "@/lib/types";

export const runtime = "nodejs";

/** GET /api/event-registrations — list all registrations (admin only). */
export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  const registrations = await readJsonFile<EventRegistration>(
    FILES.eventRegistrations,
  );
  return ok(registrations);
}

/** POST /api/event-registrations — register for an event (public). */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = eventRegistrationSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(
        "Please correct the highlighted fields",
        zodErrors(parsed.error),
      );
    }

    const record = await addRecord<EventRegistration>(
      FILES.eventRegistrations,
      {
        ...parsed.data,
        message: parsed.data.message ?? "",
        status: DEFAULT_STATUS,
      },
    );
    return created(record);
  } catch (error) {
    console.error("[api/event-registrations POST]", error);
    return serverError("Could not save your registration. Please try again.");
  }
}
