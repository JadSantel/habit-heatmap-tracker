import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { Client } from "pg";

export default async function globalSetup() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL was not initialized by playwright.config.ts.");
  }

  const migrationsRoot = path.resolve("prisma/migrations");
  const migrationDirectories = (await readdir(migrationsRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const client = new Client({ connectionString });

  await client.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "_e2e_migrations" (
        "name" TEXT PRIMARY KEY,
        "appliedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const appliedResult = await client.query<{ name: string }>(`SELECT "name" FROM "_e2e_migrations"`);
    const applied = new Set(appliedResult.rows.map((row) => row.name));

    for (const migrationName of migrationDirectories) {
      if (applied.has(migrationName)) continue;

      const sql = await readFile(path.join(migrationsRoot, migrationName, "migration.sql"), "utf8");

      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(`INSERT INTO "_e2e_migrations" ("name") VALUES ($1)`, [migrationName]);
        await client.query("COMMIT");
        console.log(`Applied E2E migration ${migrationName}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
  } finally {
    await client.end();
  }
}
