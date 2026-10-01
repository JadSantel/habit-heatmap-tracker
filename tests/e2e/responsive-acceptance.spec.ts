import { expect, test, type Page } from "@playwright/test";
import { removeTestUsers } from "./database";

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const email = `responsive-${runId}@example.test`;
const password = "Mapabit-test-123";

async function register(page: Page) {
  await page.goto("/register");
  await page.getByLabel("Name").fill("Responsive Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/habits$/);
}

async function createHabit(page: Page, name: string, measurable = false) {
  await page.getByRole("button", { name: "Add a new habit" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Habit name").fill(name);
  if (measurable) {
    await dialog.getByLabel("Measurable").check();
    await dialog.getByLabel("Unit label").fill("minutes");
  }
  await dialog.getByRole("button", { name: "Create habit" }).click();
  await expect(dialog).toBeHidden();
}

async function expectNoPageOverflow(page: Page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
}

test.afterAll(async () => {
  await removeTestUsers([email]);
});

test("desktop and 390px mobile keep the complete habit flow usable", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await register(page);
  await createHabit(page, "Stretch", false);
  await createHabit(page, "Study", true);

  const stretchArticle = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Stretch", exact: true }) });
  const studyArticle = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Study", exact: true }) });

  await expectNoPageOverflow(page);
  await expect(page.getByRole("button", { name: "Add a new habit" })).toBeVisible();
  await expect(stretchArticle.getByRole("button", { name: "Done today" })).toBeVisible();
  await expect(studyArticle.getByLabel("Study value")).toBeVisible();
  await expect(studyArticle.getByRole("button", { name: "Log" })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expectNoPageOverflow(page);

  const mobileStretch = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Stretch", exact: true }) });
  const mobileStudy = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Study", exact: true }) });
  await expect(mobileStretch.getByRole("button", { name: "Done today" })).toBeVisible();
  await expect(mobileStudy.getByLabel("Study value")).toBeVisible();

  const heatmapScroller = mobileStretch.locator(".overflow-x-auto");
  await expect.poll(() => heatmapScroller.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);

  await mobileStretch.getByRole("button", { name: "Open actions for Stretch" }).click();
  const actions = page.getByRole("dialog", { name: "Stretch actions" });
  await expect(actions.getByRole("button", { name: "Edit habit" })).toBeVisible();
  await expect(actions.getByRole("button", { name: "Delete habit" })).toBeVisible();
  const bounds = await actions.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(844);
  await page.keyboard.press("Escape");
  await expect(actions).toBeHidden();
  await expect(mobileStretch.getByRole("button", { name: "Open actions for Stretch" })).toBeFocused();

  await mobileStudy.getByLabel("Study value").fill("0");
  await mobileStudy.getByRole("button", { name: "Log" }).click();
  await expect(mobileStudy.getByText("Enter a value greater than zero.")).toBeVisible();

  await mobileStretch.getByRole("button", { name: "Done today" }).click();
  await expect(mobileStretch.getByRole("button", { name: "Logged today" })).toBeDisabled();
});
