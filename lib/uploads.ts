import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { put, del } from "@vercel/blob";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from "@/lib/constants";

/**
 * lib/uploads.ts
 * -----------------------------------------------------------------------------
 * Event image upload handling with two backends sharing one API:
 *
 *   • Production (Vercel): Vercel Blob. Vercel's filesystem is read-only at
 *     runtime, so files cannot be written into /public/uploads — images are
 *     uploaded to Blob storage and the returned absolute URL is stored in
 *     events. Used automatically when BLOB_READ_WRITE_TOKEN is set.
 *
 *   • Local development: writes to /public/uploads (when no Blob token is set)
 *     and returns a /uploads/... path served by Next.js as a static asset.
 */

export const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

/** True when Vercel Blob storage is configured. */
export const usingBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

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

/** Save an uploaded image and return its public URL/path. */
export async function saveEventImage(file: File): Promise<string> {
  const ext = MIME_EXTENSION[file.type] ?? ".jpg";
  const uniqueName = `event-${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`;

  if (usingBlob) {
    const blob = await put(`uploads/${uniqueName}`, file, {
      access: "public",
      contentType: file.type,
    });
    return blob.url;
  }

  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOADS_DIR, uniqueName), buffer);
  return `/uploads/${uniqueName}`;
}

/** Best-effort removal of an uploaded image when its event is deleted. */
export async function deleteUploadByUrl(imageUrl: string): Promise<void> {
  if (!imageUrl) return;

  // Vercel Blob URLs are absolute (https://...blob.vercel-storage.com/...).
  if (imageUrl.startsWith("http")) {
    try {
      await del(imageUrl);
    } catch {
      // Already removed, not a Blob URL we own, or no token — safe to ignore.
    }
    return;
  }

  // Local /uploads/... file (also covers committed sample images).
  if (!imageUrl.startsWith("/uploads/")) return;
  const fileName = path.basename(imageUrl);
  try {
    await fs.unlink(path.join(UPLOADS_DIR, fileName));
  } catch {
    // File already removed or never existed — safe to ignore for a prototype.
  }
}
