// Apply only the additive service-image migration to an existing installation.
// Its legacy schema may already exist without a populated Drizzle migration ledger.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import nextEnv from "@next/env";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

nextEnv.loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
const url = new URL(process.env.DATABASE_URL);
url.hostname = url.hostname.replace(/-pooler(?=\.)/, "");
const journal = JSON.parse(await readFile("migrations/meta/_journal.json", "utf8"));
const entry = journal.entries.find(({ tag }) => tag === "0006_service_hero_images");
if (!entry) throw new Error("Service-image migration is missing from the journal.");
const folder = resolve(".next/service-image-migration");
await mkdir(resolve(folder, "meta"), { recursive: true });
await writeFile(resolve(folder, "meta/_journal.json"), JSON.stringify({ ...journal, entries: [entry] }));
await writeFile(resolve(folder, `${entry.tag}.sql`), await readFile(`migrations/${entry.tag}.sql`));
try {
  await migrate(drizzle(url.toString()), { migrationsFolder: folder });
  console.log("Service-image migration applied (or already recorded).");
} catch (error) {
  console.error("Service-image migration failed:", error instanceof Error ? error.name : "Unknown error");
  process.exitCode = 1;
}
