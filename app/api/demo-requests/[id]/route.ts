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
import type { DemoRequest } from "@/lib/types";

export const runtime = "nodejs";

type Context = { params: { id: string } };

/** GET /api/demo-requests/[id] — fetch a single demo request (admin only). */
export async function GET(_request: NextRequest, { params }: Context) {
  if (!(await requireAdmin())) return unauthorized();
  const record = await findById<DemoRequest>(FILES.demoRequests, params.id);
  if (!record) return notFound("Demo request not found");
  return ok(record);
}

/** PATCH /api/demo-requests/[id] — update status (admin only). */
export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    if (!(await requireAdmin())) return unauthorized();
    const body = await request.json().catch(() => null);
    const parsed = statusUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Invalid status", zodErrors(parsed.error));
    }
    const updated = await updateRecord<DemoRequest>(
      FILES.demoRequests,
      params.id,
      { status: parsed.data.status },
    );
    if (!updated) return notFound("Demo request not found");
    return ok(updated);
  } catch (error) {
    console.error("[api/demo-requests PATCH]", error);
    return serverError();
  }
}

/** DELETE /api/demo-requests/[id] — remove a demo request (admin only). */
export async function DELETE(_request: NextRequest, { params }: Context) {
  try {
    if (!(await requireAdmin())) return unauthorized();
    const removed = await deleteRecord<DemoRequest>(
      FILES.demoRequests,
      params.id,
    );
    if (!removed) return notFound("Demo request not found");
    return ok({ id: params.id });
  } catch (error) {
    console.error("[api/demo-requests DELETE]", error);
    return serverError();
  }
}
