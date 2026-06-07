import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getCurrentAdmin, type CurrentAdmin } from "@/lib/auth";

/**
 * lib/api.ts
 * -----------------------------------------------------------------------------
 * Small helpers for consistent JSON API responses and admin authorisation in
 * route handlers. Every response uses the shape:
 *   { success: boolean, data?, message?, errors? }
 */

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function created<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function badRequest(message: string, errors?: unknown) {
  return NextResponse.json(
    { success: false, message, errors },
    { status: 400 },
  );
}

export function unauthorized(message = "You must be signed in to do that") {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

export function notFound(message = "Record not found") {
  return NextResponse.json({ success: false, message }, { status: 404 });
}

export function serverError(message = "Something went wrong") {
  return NextResponse.json({ success: false, message }, { status: 500 });
}

/** Turn a ZodError into a flat { field: message } map for the client. */
export function zodErrors(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.errors) {
    const key = issue.path.join(".") || "form";
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

/**
 * Guard a route handler so only authenticated admins can proceed. Returns the
 * admin when authorised, or null (the caller should return `unauthorized()`).
 */
export async function requireAdmin(): Promise<CurrentAdmin | null> {
  return getCurrentAdmin();
}
