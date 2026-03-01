import { expect, openFixture, test } from "./helpers/extension.js";

test.describe("tab-finder tests", () => {
  test("b opens tab-finder modal", async ({ page }) => {
    await openFixture(page, "scroll-test.html");
    await page.keyboard.press("b");
    const finder = page.locator("#vimimin-tab-finder");
    await expect(finder).toBeVisible();
  });

  test("tab-finder input is focused", async ({ page }) => {
    await openFixture(page, "scroll-test.html");
    await page.keyboard.press("b");
    const input = page.locator("#vimimin-tab-finder input");
    await expect(input).toBeFocused();
  });

  test("tab-finder lists at least one tab", async ({ page }) => {
    await openFixture(page, "scroll-test.html");
    await page.keyboard.press("b");
    const items = page.locator("#vimimin-tab-finder ul li");
    await expect(items.first()).toBeVisible();
    expect(await items.count()).toBeGreaterThanOrEqual(1);
  });

  test("Escape closes tab-finder", async ({ page }) => {
    await openFixture(page, "scroll-test.html");
    await page.keyboard.press("b");
    const finder = page.locator("#vimimin-tab-finder");
    await expect(finder).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(finder).not.toBeAttached();
  });

  test("after closing tab-finder, j scrolls (normal mode)", async ({
    page,
  }) => {
    await openFixture(page, "scroll-test.html");
    await page.keyboard.press("b");
    await page.keyboard.press("Escape");
    await page.keyboard.press("j");
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });

  test("tab-finder filters tabs by query", async ({
    page,
    extensionContext,
  }) => {
    await openFixture(page, "scroll-test.html");

    // Open a second tab in the same window via window.open
    const [page2] = await Promise.all([
      extensionContext.waitForEvent("page"),
      page.evaluate(() =>
        window.open("http://localhost:8932/search-test.html", "_blank"),
      ),
    ]);
    await page2.waitForSelector("html[data-vimimin-loaded]", {
      timeout: 5000,
    });

    // Open tab-finder on page2
    await page2.keyboard.press("b");
    const items = page2.locator("#vimimin-tab-finder ul li");
    // Wait for tab list to be populated (at least 2 tabs)
    await expect(items.nth(1)).toBeVisible();

    const input = page2.locator("#vimimin-tab-finder input");
    // Type a query that matches only the scroll page's title
    await input.fill("Scroll");
    // Wait for filter to reduce list to 1 item
    await expect(items).toHaveCount(1);

    await page2.keyboard.press("Escape");
    await page2.close();
  });

  test("ArrowDown moves selection", async ({ page, extensionContext }) => {
    await openFixture(page, "scroll-test.html");

    // Open a second tab in the same window via window.open
    const [page2] = await Promise.all([
      extensionContext.waitForEvent("page"),
      page.evaluate(() =>
        window.open("http://localhost:8932/search-test.html", "_blank"),
      ),
    ]);
    await page2.waitForSelector("html[data-vimimin-loaded]", {
      timeout: 5000,
    });

    await page2.keyboard.press("b");
    const items = page2.locator("#vimimin-tab-finder ul li");
    // Wait for at least 2 items to appear
    await expect(items.nth(1)).toBeVisible();

    await page2.keyboard.press("ArrowDown");

    // After ArrowDown, second item should be selected (border-left-color set)
    const secondLi = items.nth(1);
    await expect(secondLi).toHaveCSS("border-left-color", "rgb(233, 69, 96)");

    await page2.keyboard.press("Escape");
    await page2.close();
  });
});
