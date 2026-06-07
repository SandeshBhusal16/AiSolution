import { SignJWT, jwtVerify } from "jose";

/**
 * lib/session.ts
 * -----------------------------------------------------------------------------
 * Edge-safe session token primitives built on `jose`. This module intentionally
 * imports nothing from Node-only packages (bcrypt, fs, next/headers) so it can
 * be used from both API route handlers (Node runtime) and middleware (Edge
 * runtime).
 */

export const SESSION_COOKIE = "ai_solution_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  sub: string; // admin id
  email: string;
  name: string;
}

function getSecretKey(): Uint8Array {
  const secret =
    process.env.JWT_SECRET ||
    "ai-solution-prototype-dev-secret-change-me-in-production";
  return new TextEncoder().encode(secret);
}

/** Sign a short session JWT for an authenticated admin. */
export async function createSessionToken(
  payload: SessionPayload,
): Promise<string> {
  return new SignJWT({ email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

/** Verify a session JWT and return its payload, or null when invalid/expired. */
export async function verifySessionToken(
  token: string | undefined | null,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub === "string" && typeof payload.email === "string") {
      return {
        sub: payload.sub,
        email: payload.email,
        name: typeof payload.name === "string" ? payload.name : "",
      };
    }
    return null;
  } catch {
    return null;
  }
}
