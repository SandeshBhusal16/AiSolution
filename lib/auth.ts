import "server-only";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { addRecord, FILES, readJsonFile } from "@/lib/json-db";
import type { Admin } from "@/lib/types";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/session";

/**
 * lib/auth.ts
 * -----------------------------------------------------------------------------
 * Server-side authentication helpers: password hashing (bcrypt), default admin
 * seeding, and reading/writing the session cookie. Import only from server code
 * (route handlers / server components) — never from middleware (use
 * lib/session.ts there instead).
 */

export const DEFAULT_ADMIN = {
  name: "AI-Solution Admin",
  email: "admin@aisolution.com",
  password: "Admin@123",
};

export interface CurrentAdmin {
  id: string;
  email: string;
  name: string;
}

const SALT_ROUNDS = 10;

/** Hash a plain-text password with bcrypt. */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/** Compare a plain-text password against a stored bcrypt hash. */
export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

/**
 * Make sure at least one admin exists. On first run (empty admins.json) this
 * seeds the default admin with a hashed password so the demo login works out of
 * the box. Safe to call repeatedly — it only seeds when no admins are present.
 */
export async function ensureDefaultAdmin(): Promise<void> {
  const admins = await readJsonFile<Admin>(FILES.admins);
  if (admins.length > 0) return;

  const passwordHash = await hashPassword(DEFAULT_ADMIN.password);
  await addRecord<Admin>(FILES.admins, {
    name: DEFAULT_ADMIN.name,
    email: DEFAULT_ADMIN.email.toLowerCase(),
    passwordHash,
  });
  console.info(
    `[auth] Seeded default admin: ${DEFAULT_ADMIN.email} / ${DEFAULT_ADMIN.password}`,
  );
}

/** Look up an admin by email (case-insensitive). */
export async function getAdminByEmail(email: string): Promise<Admin | null> {
  const admins = await readJsonFile<Admin>(FILES.admins);
  const normalised = email.trim().toLowerCase();
  return admins.find((admin) => admin.email.toLowerCase() === normalised) ?? null;
}

/** Create the session JWT for an admin and store it in an httpOnly cookie. */
export async function createSession(admin: Admin): Promise<void> {
  const token = await createSessionToken({
    sub: admin.id,
    email: admin.email,
    name: admin.name,
  });

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/** Remove the session cookie (logout). */
export function destroySession(): void {
  cookies().delete(SESSION_COOKIE);
}

/** Read + verify the current session from the cookie. Returns null if absent. */
export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/** Convenience wrapper returning the current admin in a friendly shape. */
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const session = await getSession();
  if (!session) return null;
  return { id: session.sub, email: session.email, name: session.name };
}
