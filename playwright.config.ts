import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.test.local", override: true });
loadEnv({ path: ".env.test", override: false });

const testDatabaseUrl = process.env.E2E_DATABASE_URL;
const resetAllowed = process.env.E2E_ALLOW_DATABASE_RESET === "true";

if (!testDatabaseUrl) {
  throw new Error("E2E_DATABASE_URL is required. Copy .env.test.example to .env.test.local and use a dedicated test database.");
}

const databaseName = new URL(testDatabaseUrl).pathname.slice(1).toLowerCase();

if (!resetAllowed || (!databaseName.includes("test") && !databaseName.includes("e2e"))) {
  throw new Error("Refusing to run: E2E_DATABASE_URL must name a test/e2e database and E2E_ALLOW_DATABASE_RESET must be true.");
}

const prismaDatabaseUrl = new URL(testDatabaseUrl);
// Neon includes channel_binding by default, but Prisma's migration engine does
// not accept that libpq parameter. TLS remains enabled through sslmode.
prismaDatabaseUrl.searchParams.delete("channel_binding");
process.env.DATABASE_URL = prismaDatabaseUrl.toString();
process.env.BETTER_AUTH_URL = "http://127.0.0.1:3100";
process.env.BETTER_AUTH_SECRET = process.env.E2E_BETTER_AUTH_SECRET ?? "e2e-only-secret-at-least-32-characters-long";
process.env.GITHUB_CLIENT_ID ??= "e2e-github-client";
process.env.GITHUB_CLIENT_SECRET ??= "e2e-github-secret";
process.env.GOOGLE_CLIENT_ID ??= "e2e-google-client";
process.env.GOOGLE_CLIENT_SECRET ??= "e2e-google-secret";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  globalSetup: "./tests/e2e/global-setup.ts",
  globalTeardown: "./tests/e2e/global-teardown.ts",
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100/login",
    reuseExistingServer: false,
    timeout: 120_000,
    env: process.env as Record<string, string>,
  },
});
