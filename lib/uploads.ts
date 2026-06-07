import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from "@/lib/constants";

/**
 * lib/uploads.ts
 * -----------------------------------------------------------------------------
 * Local image upload handling for event images. Files are written to
 * /public/uploads with a unique name; the returned path (e.g. /uploads/x.jpg)
 * is stored in events.json and served by Next.js as a normal static asset.
 * No cloud storage is used — this is a local file-based prototype.
 */

export const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const MIME_EXTENSION: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

/** Returns an error message if the file is not a valid image, else null. */
export function validateImageFile(file: unknown): string | null {
  if (!(file instanceof File) || file.size === 0) {
    return "Event image is required";
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPG, JPEG, PNG or WEBP images are allowed";
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "Image must be 5 MB or smaller";
  }
  return null;
}

/** Save an uploaded image to /public/uploads and return its public path. */
export async function saveEventImage(file: File): Promise<string> {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const ext = MIME_EXTENSION[file.type] ?? ".jpg";
  const uniqueName = `event-${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOADS_DIR, uniqueName), buffer);
  return `/uploads/${uniqueName}`;
}

/** Best-effort removal of an uploaded file when its event is deleted. */
export async function deleteUploadByUrl(imageUrl: string): Promise<void> {
  if (!imageUrl || !imageUrl.startsWith("/uploads/")) return;
  const fileName = path.basename(imageUrl);
  try {
    await fs.unlink(path.join(UPLOADS_DIR, fileName));
  } catch {
    // File already removed or never existed — safe to ignore for a prototype.
  }
}
