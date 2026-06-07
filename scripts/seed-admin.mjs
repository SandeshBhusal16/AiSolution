/**
 * scripts/seed-admin.mjs
 * -----------------------------------------------------------------------------
 * Seeds the default admin account into data/admins.json with a bcrypt-hashed
 * password. Run with:  npm run seed
 *
 * The password is stored ONLY as a bcrypt hash — never in plain text.
 * Safe to run repeatedly: it will not create a duplicate admin.
 */
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const DEFAULT_ADMIN = {
  name: "AI-Solution Admin",
  email: "admin@aisolution.com",
  password: "Admin@123",
};

const DATA_DIR = path.join(process.cwd(), "data");
const ADMINS_FILE = path.join(DATA_DIR, "admins.json");

async function readAdmins() {
  try {
    const raw = await fs.readFile(ADMINS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function main() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const admins = await readAdmins();

  const email = DEFAULT_ADMIN.email.toLowerCase();
  const exists = admins.some((a) => (a.email || "").toLowerCase() === email);

  if (exists) {
    console.log(`✔ Admin "${email}" already exists — nothing to do.`);
    return;
  }

  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 10);

  admins.push({
    id: crypto.randomUUID(),
    name: DEFAULT_ADMIN.name,
    email,
    passwordHash,
    createdAt: now,
    updatedAt: now,
  });

  await fs.writeFile(ADMINS_FILE, JSON.stringify(admins, null, 2), "utf-8");

  console.log("✔ Seeded default admin account:");
  console.log(`  Email:    ${DEFAULT_ADMIN.email}`);
  console.log(`  Password: ${DEFAULT_ADMIN.password}`);
  console.log(`  File:     ${ADMINS_FILE}`);
}

main().catch((error) => {
  console.error("Failed to seed admin:", error);
  process.exit(1);
});
