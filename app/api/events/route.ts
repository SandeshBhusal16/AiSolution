import type { NextRequest } from "next/server";
import { eventTextSchema } from "@/lib/validations";
import { addRecord, FILES, readJsonFile } from "@/lib/json-db";
import { saveEventImage, validateImageFile } from "@/lib/uploads";
import {
  badRequest,
  created,
  ok,
  requireAdmin,
  serverError,
  unauthorized,
  zodErrors,
} from "@/lib/api";
import type { EventItem } from "@/lib/types";

export const runtime = "nodejs";

/** GET /api/events — list all events (public). */
export async function GET() {
  const events = await readJsonFile<EventItem>(FILES.events);
  return ok(events);
}

/**
 * POST /api/events — create an event with an uploaded image (admin only).
 * Expects multipart/form-data: title, description, eventDate, location, image.
 */
export async function POST(request: NextRequest) {
  try {
    if (!(await requireAdmin())) return unauthorized();

    const formData = await request.formData();
    const fields = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      eventDate: String(formData.get("eventDate") ?? ""),
      location: String(formData.get("location") ?? ""),
    };

    const parsed = eventTextSchema.safeParse(fields);
    if (!parsed.success) {
      return badRequest(
        "Please correct the highlighted fields",
        zodErrors(parsed.error),
      );
    }

    const file = formData.get("image");
    const imageError = validateImageFile(file);
    if (imageError) {
      return badRequest(imageError, { image: imageError });
    }

    // Save to /public/uploads and store the public path in events.json.
    const imageUrl = await saveEventImage(file as File);
    const record = await addRecord<EventItem>(FILES.events, {
      ...parsed.data,
      imageUrl,
    });
    return created(record);
  } catch (error) {
    console.error("[api/events POST]", error);
    return serverError("Could not create the event. Please try again.");
  }
}
