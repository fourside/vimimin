import { expect, openFixture, test } from "./helpers/extension.js";

test.describe("bookmark-toggle tests", () => {
  test("a adds bookmark, second a removes it", async ({ page }) => {
    await openFixture(page, "scroll-test.html");
    const pageUrl = page.url();

    // Add bookmark
    await page.keyboard.press("a");
    await page.waitForTimeout(300);

    // Open bookmark finder and verify the page appears
    await page.keyboard.press("b");
    const finder = page.locator("#vimimin-tab-finder");
    await expect(finder).toBeVisible();
    const input = finder.locator("input");
    await input.fill(pageUrl);
    const items = finder.locator("ul li");
    await expect(items).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(finder).not.toBeAttached();

    // Remove bookmark
    await page.keyboard.press("a");
    await page.waitForTimeout(300);

    // Open bookmark finder again and verify it's gone
    await page.keyboard.press("b");
    await expect(finder).toBeVisible();
    const input2 = finder.locator("input");
    await input2.fill(pageUrl);
    await expect(items).toHaveCount(0);
    await page.keyboard.press("Escape");
  });
});
