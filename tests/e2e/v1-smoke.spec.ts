import { expect, test, type Page, type Request } from "@playwright/test";
import { countHabitEntries, findHabit, findUserId, getHabitName, removeTestUsers } from "./database";

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const ownerEmail = `owner-${runId}@example.test`;
const intruderEmail = `intruder-${runId}@example.test`;
const password = "Mapabit-test-123";
const createdEmails = [ownerEmail, intruderEmail];

type CapturedAction = {
  url: string;
  body: Buffer;
  headers: Record<string, string>;
};

async function register(page: Page, name: string, email: string) {
  await page.goto("/register");
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/habits$/);
}

async function createHabit(page: Page, name: string, type: "boolean" | "measurable", unit?: string) {
  await page.getByRole("button", { name: "Add a new habit" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Habit name").fill(name);

  if (type === "measurable") {
    await dialog.getByLabel("Measurable").check();
    await dialog.getByLabel("Unit label").fill(unit ?? "units");
  }

  await dialog.getByRole("button", { name: "Create habit" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
}

test.afterAll(async () => {
  await removeTestUsers(createdEmails);
});

test("unauthenticated users are redirected to login", async ({ page }) => {
  await page.goto("/habits");
  await expect(page).toHaveURL(/\/login$/);
});

test("registration, login, CRUD, logging, and heatmap positioning work", async ({ page }) => {
  await register(page, "Smoke Owner", ownerEmail);

  await createHabit(page, "Read", "boolean");
  const readArticle = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Read", exact: true }) });
  await expect(readArticle.locator("[data-heatmap-cell]")).toHaveCount(365);

  const today = new Date().toISOString().slice(0, 10);
  const todayCell = readArticle.locator(`[data-heatmap-cell="${today}"]`);
  await expect(todayCell).toHaveAttribute("data-entry-state", "empty");
  await readArticle.getByRole("button", { name: "Done today" }).click();
  await expect(readArticle.getByRole("button", { name: "Logged today" })).toBeDisabled();
  await expect(todayCell).toHaveAttribute("data-entry-state", "logged");
  await expect(todayCell).toHaveAttribute("aria-label", `${today}: Logged`);

  let capturedUpdate: CapturedAction | undefined;
  const captureUpdate = (request: Request) => {
    const actionHeader = request.headers()["next-action"];
    const body = request.postDataBuffer();
    if (request.method() === "POST" && actionHeader && body) {
      capturedUpdate = {
        url: request.url(),
        body,
        headers: {
          "content-type": request.headers()["content-type"],
          "next-action": actionHeader,
          accept: request.headers().accept,
        },
      };
    }
  };
  page.on("request", captureUpdate);

  await readArticle.getByRole("button", { name: "Open actions for Read" }).click();
  await page.getByRole("button", { name: "Edit habit" }).click();
  await page.getByLabel("Habit name").fill("Read daily");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("heading", { name: "Read daily", exact: true })).toBeVisible();
  page.off("request", captureUpdate);
  expect(capturedUpdate, "the update Server Action request should be captured").toBeTruthy();

  await createHabit(page, "Run", "measurable", "km");
  const runArticle = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Run", exact: true }) });
  const valueInput = runArticle.getByLabel("Run value");
  await valueInput.fill("0");
  await runArticle.getByRole("button", { name: "Log" }).click();
  await expect(runArticle.getByText("Enter a value greater than zero.")).toBeVisible();

  await valueInput.fill("5");
  await runArticle.getByRole("button", { name: "Log" }).click();
  await expect(runArticle.locator(`[data-heatmap-cell="${today}"]`)).toHaveAttribute("data-entry-value", "5");
  await valueInput.fill("8");
  await runArticle.getByRole("button", { name: "Log" }).click();
  await expect(runArticle.locator(`[data-heatmap-cell="${today}"]`)).toHaveAttribute("data-entry-value", "8");

  const ownerId = await findUserId(ownerEmail);
  const readHabit = await findHabit(ownerId, "Read daily");
  const runHabit = await findHabit(ownerId, "Run");
  await expect.poll(() => countHabitEntries(readHabit.id)).toBe(1);
  await expect.poll(() => countHabitEntries(runHabit.id)).toBe(1);

  await runArticle.getByRole("button", { name: "Open actions for Run" }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete habit" }).click();
  await expect(page.getByRole("heading", { name: "Run", exact: true })).toBeHidden();

  await page.getByRole("button", { name: "Profile menu" }).click();
  await page.getByRole("menuitem", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto("/login");
  await page.getByLabel("Email").fill(ownerEmail);
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("alert")).toBeVisible();

  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/habits$/);
  await expect(page.getByRole("heading", { name: "Read daily", exact: true })).toBeVisible();

  const intruderContext = await page.context().browser()!.newContext();
  const intruderPage = await intruderContext.newPage();
  await register(intruderPage, "Smoke Intruder", intruderEmail);
  await expect(intruderPage.getByRole("heading", { name: "Read daily", exact: true })).toHaveCount(0);

  const replay = capturedUpdate!;
  const maliciousBody = Buffer.from(replay.body.toString("utf8").replace("Read daily", "Intruded!!"), "utf8");
  await intruderContext.request.fetch(replay.url, {
    method: "POST",
    headers: replay.headers,
    data: maliciousBody,
  });

  await expect.poll(async () => {
    return getHabitName(readHabit.id);
  }).toBe("Read daily");

  await intruderContext.close();
});
