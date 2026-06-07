import type { NextRequest } from "next/server";
import { statusUpdateSchema } from "@/lib/validations";
import { deleteRecord, FILES, findById, updateRecord } from "@/lib/json-db";
import {
  badRequest,
  notFound,
  ok,
  requireAdmin,
  serverError,
  unauthorized,
  zodErrors,
} from "@/lib/api";
import type { EventRegistration } from "@/lib/types";

export const runtime = "nodejs";

type Context = { params: { id: string } };

/** GET /api/event-registrations/[id] — fetch a single registration. */
export async function GET(_request: NextRequest, { params }: Context) {
  if (!(await requireAdmin())) return unauthorized();
  const record = await findById<EventRegistration>(
    FILES.eventRegistrations,
    params.id,
  );
  if (!record) return notFound("Registration not found");
  return ok(record);
}

/** PATCH /api/event-registrations/[id] — update status (admin only). */
export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    if (!(await requireAdmin())) return unauthorized();
    const body = await request.json().catch(() => null);
    const parsed = statusUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Invalid status", zodErrors(parsed.error));
    }
    const updated = await updateRecord<EventRegistration>(
      FILES.eventRegistrations,
      params.id,
      { status: parsed.data.status },
    );
    if (!updated) return notFound("Registration not found");
    return ok(updated);
  } catch (error) {
    console.error("[api/event-registrations PATCH]", error);
    return serverError();
  }
}

/** DELETE /api/event-registrations/[id] — remove a registration (admin only). */
export async function DELETE(_request: NextRequest, { params }: Context) {
  try {
    if (!(await requireAdmin())) return unauthorized();
    const removed = await deleteRecord<EventRegistration>(
      FILES.eventRegistrations,
      params.id,
    );
    if (!removed) return notFound("Registration not found");
    return ok({ id: params.id });
  } catch (error) {
    console.error("[api/event-registrations DELETE]", error);
    return serverError();
  }
}
