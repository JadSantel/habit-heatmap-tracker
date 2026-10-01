import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL was not initialized by playwright.config.ts.");
}

export const e2eDb = new Pool({ connectionString });

export async function removeTestUsers(emails: string[]) {
  if (emails.length === 0) return;
  await e2eDb.query(`DELETE FROM "User" WHERE "email" = ANY($1::text[])`, [emails]);
}

export async function findUserId(email: string) {
  const result = await e2eDb.query<{ id: string }>(`SELECT "id" FROM "User" WHERE "email" = $1`, [email]);
  if (!result.rows[0]) throw new Error(`Test user ${email} was not found.`);
  return result.rows[0].id;
}

export async function findHabit(userId: string, name: string) {
  const result = await e2eDb.query<{ id: string; name: string }>(
    `SELECT "id", "name" FROM "Habit" WHERE "userId" = $1 AND "name" = $2`,
    [userId, name],
  );
  if (!result.rows[0]) throw new Error(`Test habit ${name} was not found.`);
  return result.rows[0];
}

export async function countHabitEntries(habitId: string) {
  const result = await e2eDb.query<{ count: string }>(
    `SELECT COUNT(*)::text AS "count" FROM "HabitEntry" WHERE "habitId" = $1`,
    [habitId],
  );
  return Number(result.rows[0]?.count ?? 0);
}

export async function getHabitName(habitId: string) {
  const result = await e2eDb.query<{ name: string }>(`SELECT "name" FROM "Habit" WHERE "id" = $1`, [habitId]);
  return result.rows[0]?.name;
}
