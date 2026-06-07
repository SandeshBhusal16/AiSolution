import { promises as fs } from "fs";
import path from "path";
import type { BaseRecord } from "@/lib/types";

/**
 * lib/json-db.ts
 * -----------------------------------------------------------------------------
 * A tiny, reusable file-based "database" for the prototype. All data lives in
 * readable JSON arrays inside the /data folder at the project root. These
 * helpers create files on demand, read/parse them safely and write them back
 * with pretty-printing so they are easy to inspect during a demo.
 *
 * Only ever import this from server-side code (API routes / server actions).
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
 * already exist. Returns the absolute file path.
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

/**
 * Read and parse a JSON file as an array of T. Missing or corrupted files fail
 * safe by returning an empty array (and recreating the file when missing).
 */
export async function readJsonFile<T>(fileName: string): Promise<T[]> {
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

/** Write an array to a JSON file using safe, pretty-printed formatting. */
export async function writeJsonFile<T>(
  fileName: string,
  data: T[],
): Promise<void> {
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
