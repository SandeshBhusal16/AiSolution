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
import type { Inquiry } from "@/lib/types";

export const runtime = "nodejs";

type Context = { params: { id: string } };

/** GET /api/inquiries/[id] — fetch a single inquiry (admin only). */
export async function GET(_request: NextRequest, { params }: Context) {
  if (!(await requireAdmin())) return unauthorized();
  const record = await findById<Inquiry>(FILES.inquiries, params.id);
  if (!record) return notFound("Inquiry not found");
  return ok(record);
}

/** PATCH /api/inquiries/[id] — update inquiry status (admin only). */
export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    if (!(await requireAdmin())) return unauthorized();
    const body = await request.json().catch(() => null);
    const parsed = statusUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Invalid status", zodErrors(parsed.error));
    }
    const updated = await updateRecord<Inquiry>(FILES.inquiries, params.id, {
      status: parsed.data.status,
    });
    if (!updated) return notFound("Inquiry not found");
    return ok(updated);
  } catch (error) {
    console.error("[api/inquiries PATCH]", error);
    return serverError();
  }
}

/** DELETE /api/inquiries/[id] — remove an inquiry (admin only). */
export async function DELETE(_request: NextRequest, { params }: Context) {
  try {
    if (!(await requireAdmin())) return unauthorized();
    const removed = await deleteRecord<Inquiry>(FILES.inquiries, params.id);
    if (!removed) return notFound("Inquiry not found");
    return ok({ id: params.id });
  } catch (error) {
    console.error("[api/inquiries DELETE]", error);
    return serverError();
  }
}
