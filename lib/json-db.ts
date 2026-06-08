import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import type { BaseRecord } from "@/lib/types";

// Committed seed data. Importing the JSON guarantees it is bundled into the
// serverless build (a runtime fs read of /data is NOT reliable on Vercel), so
// production starts with the same records you have locally.
import adminsSeed from "@/data/admins.json";
import inquiriesSeed from "@/data/inquiries.json";
import demoRequestsSeed from "@/data/demoRequests.json";
import eventRegistrationsSeed from "@/data/eventRegistrations.json";
import eventsSeed from "@/data/events.json";

/**
 * lib/json-db.ts
 * -----------------------------------------------------------------------------
 * A tiny, reusable "database" for the prototype with TWO storage backends that
 * share one identical API:
 *
 *   • Production (Vercel): Upstash Redis. Vercel's filesystem is read-only at
 *     runtime, so writing JSON files there fails — every collection is stored
 *     as a single JSON value in Redis instead. On first access a collection is
 *     auto-seeded from the committed JSON above, so live data appears with no
 *     manual migration.
 *
 *   • Local development: plain JSON files in /data (when no Redis env vars are
 *     set), so you keep the readable, inspectable files during a demo.
 *
 * The backend is chosen automatically from the environment. Only ever import
 * this from server-side code (API routes / server actions).
 */

/** Absolute path to the /data folder, resolved from the project root. */
export const DATA_DIR = path.join(process.cwd(), "data");

/** Canonical JSON file names — keeps spelling consistent everywhere. */
export const FILES = {
  admins: "admins.json",
  inquiries: "inquiries.json",
  demoRequests: "demoRequests.json",
  eventRegistrations: "eventRegistrations.json",
  events: "events.json",
} as const;

export type FileName = (typeof FILES)[keyof typeof FILES];

/** Committed seed records, keyed by file name, used to initialise Redis. */
const SEED_DATA: Record<string, unknown[]> = {
  [FILES.admins]: adminsSeed as unknown[],
  [FILES.inquiries]: inquiriesSeed as unknown[],
  [FILES.demoRequests]: demoRequestsSeed as unknown[],
  [FILES.eventRegistrations]: eventRegistrationsSeed as unknown[],
  [FILES.events]: eventsSeed as unknown[],
};

// --- Backend selection ------------------------------------------------------

const REDIS_URL =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const REDIS_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

/** True when Upstash/Vercel KV credentials are configured. */
export const usingRedis = Boolean(REDIS_URL && REDIS_TOKEN);

const redis = usingRedis
  ? new Redis({ url: REDIS_URL as string, token: REDIS_TOKEN as string })
  : null;

/** Redis key for a given collection, e.g. "aisolution:events.json". */
function redisKey(fileName: string): string {
  return `aisolution:${fileName}`;
}

// --- Filesystem helpers (local development backend) -------------------------

/** Ensure the /data directory exists before any file operation. */
async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

/** Build the absolute path for a data file. */
export function dataFilePath(fileName: string): string {
  return path.join(DATA_DIR, fileName);
}

/**
 * Create the JSON file with default contents (an empty array) if it does not
 * already exist. Returns the absolute file path. (Filesystem backend only.)
 */
export async function ensureFileExists(
  fileName: string,
  defaultData: unknown = [],
): Promise<string> {
  await ensureDataDir();
  const filePath = dataFilePath(fileName);
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), "utf-8");
  }
  return filePath;
}

// --- Public read/write API (backend-agnostic) ------------------------------

/**
 * Read and parse a collection as an array of T. Missing or corrupted data fails
 * safe by returning an empty array. With Redis, a missing key is auto-seeded
 * from the committed JSON the first time it is read.
 */
export async function readJsonFile<T>(fileName: string): Promise<T[]> {
  if (redis) {
    const key = redisKey(fileName);
    const stored = await redis.get<T[]>(key);
    if (stored === null || stored === undefined) {
      // First access: seed Redis from the committed JSON, then return it.
      const seed = (SEED_DATA[fileName] ?? []) as T[];
      await redis.set(key, seed);
      return seed;
    }
    return Array.isArray(stored) ? stored : [];
  }

  // Filesystem backend.
  const filePath = await ensureFileExists(fileName, []);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    if (!raw.trim()) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    console.error(`[json-db] Failed to read/parse ${fileName}:`, error);
    return [];
  }
}

/** Write an array to a collection (Redis value, or pretty-printed JSON file). */
export async function writeJsonFile<T>(
  fileName: string,
  data: T[],
): Promise<void> {
  if (redis) {
    await redis.set(redisKey(fileName), data);
    return;
  }
  await ensureDataDir();
  const filePath = dataFilePath(fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

/** Find a single record by id, or null. */
export async function findById<T extends BaseRecord>(
  fileName: string,
  id: string,
): Promise<T | null> {
  const records = await readJsonFile<T>(fileName);
  return records.find((record) => record.id === id) ?? null;
}

/**
 * Add a new record. The caller supplies the data fields; id, createdAt and
 * updatedAt are generated automatically. Newest records are stored first.
 */
export async function addRecord<T extends BaseRecord>(
  fileName: string,
  input: Omit<T, "id" | "createdAt" | "updatedAt">,
): Promise<T> {
  const records = await readJsonFile<T>(fileName);
  const now = new Date().toISOString();
  const record = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  } as T;
  records.unshift(record);
  await writeJsonFile(fileName, records);
  return record;
}

/**
 * Update an existing record by id. id and createdAt are preserved; updatedAt is
 * refreshed. Returns the updated record, or null if no record matched.
 */
export async function updateRecord<T extends BaseRecord>(
  fileName: string,
  id: string,
  updates: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>,
): Promise<T | null> {
  const records = await readJsonFile<T>(fileName);
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return null;

  const updated = {
    ...records[index],
    ...updates,
    id: records[index].id,
    createdAt: records[index].createdAt,
    updatedAt: new Date().toISOString(),
  } as T;

  records[index] = updated;
  await writeJsonFile(fileName, records);
  return updated;
}

/** Delete a record by id. Returns true if a record was removed. */
export async function deleteRecord<T extends BaseRecord>(
  fileName: string,
  id: string,
): Promise<boolean> {
  const records = await readJsonFile<T>(fileName);
  const next = records.filter((record) => record.id !== id);
  if (next.length === records.length) return false;
  await writeJsonFile(fileName, next);
  return true;
}
