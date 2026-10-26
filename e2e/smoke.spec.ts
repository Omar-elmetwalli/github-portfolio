import { test, expect, type Page } from "@playwright/test";

const MOCK_AI = "https://ai.mock.test";

// Fail any test that logs a console error or throws in the page.
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  (page as Page & { __errors?: string[] }).__errors = errors;
});

test.afterEach(async ({ page }) => {
  expect((page as Page & { __errors?: string[] }).__errors ?? [], "console errors").toEqual([]);
});

test("home page loads with real stats and no horizontal scroll", async ({ page }) => {
  await page.goto("./");
  await expect(page).toHaveTitle(/Omar Elmetwalli/);
  await expect(page.getByRole("heading", { level: 1, name: "Omar Elmetwalli" })).toBeVisible();
  await expect(page.getByText("12,000", { exact: false }).first()).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("project filters show matching projects", async ({ page }) => {
  await page.goto("./#projects");
  const group = page.getByRole("group", { name: "Filter projects by category" });
  const cards = page.locator("#project-grid > li:visible");
  const total = await cards.count();
  expect(total).toBeGreaterThan(10);

  const filter = group.getByRole("button", { name: /Dynamics & Controls/ });
  const expected = Number(await filter.locator("span").last().textContent());
  await filter.click();
  await expect(filter).toHaveAttribute("aria-pressed", "true");
  await expect(cards).toHaveCount(expected);

  await group.getByRole("button", { name: /^All/ }).click();
  await expect(cards).toHaveCount(total);
});

test("a project page opens from the grid and renders math", async ({ page }) => {
  await page.goto("./#projects");
  await page.getByRole("link", { name: /Joukowski Airfoil Aerodynamics/ }).first().click();
  await expect(page).toHaveURL(/\/projects\/joukowski-airfoil-aerodynamics\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Joukowski");
  await expect(page.locator(".katex").first()).toBeVisible();
  await expect(page.getByRole("navigation", { name: "More projects" })).toBeVisible();
});

test("theme toggle switches and persists", async ({ page }) => {
  await page.goto("./");
  const html = page.locator("html");
  const wasDark = ((await html.getAttribute("class")) ?? "").includes("dark");
  await page.getByRole("button", { name: /Switch to (light|dark) theme/ }).click();
  await expect(html).toHaveClass(wasDark ? /\blight\b/ : /\bdark\b/);
  await page.reload();
  await expect(html).toHaveClass(wasDark ? /\blight\b/ : /\bdark\b/);
});

test("command palette finds and opens a project", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard shortcut is a desktop feature");
  await page.goto("./");
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox").fill("ramjet");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/projects\/ramjet-engine-inlet-optimization\/$/);
});

test("chat widget opens and streams an answer (mocked endpoint)", async ({ page }) => {
  await page.goto("./");
  const launcher = page.getByRole("button", { name: "Ask Omar's AI" });
  test.skip((await launcher.count()) === 0, "AI disabled in this build; run `pnpm test:e2e:build` first");

  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  await page.route(`${MOCK_AI}/chat`, (route) =>
    route.request().method() === "OPTIONS"
      ? route.fulfill({ status: 204, headers: cors })
      : route.fulfill({
      status: 200,
      headers: { ...cors, "Content-Type": "text/event-stream" },
      body:
        `data: ${JSON.stringify({ text: "Omar ran 81 RANS cases in the " })}\n\n` +
        `data: ${JSON.stringify({ text: "[OpenFOAM airfoil study](/projects/openfoam-parametric-airfoil-study/)." })}\n\n` +
        `event: done\ndata: {}\n\n`,
    })
  );

  await launcher.click();
  const panel = page.getByRole("dialog", { name: "Ask Omar's AI" });
  await expect(panel).toBeVisible();
  await panel.getByRole("button", { name: "What did he do with OpenFOAM?" }).click();
  const link = panel.getByRole("link", { name: "OpenFOAM airfoil study" });
  await expect(link).toHaveAttribute("href", "/github-portfolio/projects/openfoam-parametric-airfoil-study/");
  await expect(panel.getByText("AI-generated, based on site content", { exact: false })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
});

test("skip link moves focus to main content", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard navigation");
  await page.goto("./");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});
