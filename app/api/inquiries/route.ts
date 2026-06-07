import type { NextRequest } from "next/server";
import { inquirySchema } from "@/lib/validations";
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
import type { Inquiry } from "@/lib/types";

export const runtime = "nodejs";

/** GET /api/inquiries — list all inquiries (admin only). */
export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  const inquiries = await readJsonFile<Inquiry>(FILES.inquiries);
  return ok(inquiries);
}

/** POST /api/inquiries — submit a new inquiry (public). */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(
        "Please correct the highlighted fields",
        zodErrors(parsed.error),
      );
    }

    const record = await addRecord<Inquiry>(FILES.inquiries, {
      ...parsed.data,
      status: DEFAULT_STATUS,
    });
    return created(record);
  } catch (error) {
    console.error("[api/inquiries POST]", error);
    return serverError("Could not save your inquiry. Please try again.");
  }
}
