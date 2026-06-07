import type { NextRequest } from "next/server";
import { eventTextSchema } from "@/lib/validations";
import { deleteRecord, FILES, findById, updateRecord } from "@/lib/json-db";
import { deleteUploadByUrl } from "@/lib/uploads";
import {
  badRequest,
  notFound,
  ok,
  requireAdmin,
  serverError,
  unauthorized,
  zodErrors,
} from "@/lib/api";
import type { EventItem } from "@/lib/types";

export const runtime = "nodejs";

type Context = { params: { id: string } };

/** GET /api/events/[id] — fetch a single event (public). */
export async function GET(_request: NextRequest, { params }: Context) {
  const record = await findById<EventItem>(FILES.events, params.id);
  if (!record) return notFound("Event not found");
  return ok(record);
}

/** PATCH /api/events/[id] — update event text fields (admin only). */
export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    if (!(await requireAdmin())) return unauthorized();
    const body = await request.json().catch(() => null);
    const parsed = eventTextSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(
        "Please correct the highlighted fields",
        zodErrors(parsed.error),
      );
    }
    const updated = await updateRecord<EventItem>(
      FILES.events,
      params.id,
      parsed.data,
    );
    if (!updated) return notFound("Event not found");
    return ok(updated);
  } catch (error) {
    console.error("[api/events PATCH]", error);
    return serverError();
  }
}

/** DELETE /api/events/[id] — remove an event and its uploaded image (admin). */
export async function DELETE(_request: NextRequest, { params }: Context) {
  try {
    if (!(await requireAdmin())) return unauthorized();
    const record = await findById<EventItem>(FILES.events, params.id);
    if (!record) return notFound("Event not found");

    await deleteRecord<EventItem>(FILES.events, params.id);
    // Best-effort cleanup of the uploaded image file.
    await deleteUploadByUrl(record.imageUrl);

    return ok({ id: params.id });
  } catch (error) {
    console.error("[api/events DELETE]", error);
    return serverError();
  }
}
