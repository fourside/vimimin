import { expect, openFixture, test } from "./helpers/extension.js";

test.describe("hint mode tests", () => {
  test.beforeEach(async ({ page }) => {
    await openFixture(page, "hint-test.html");
  });

  test("f shows hint overlay with label spans", async ({ page }) => {
    await page.keyboard.press("f");
    const container = page.locator("#vimimin-hint-container");
    await expect(container).toBeAttached();
    const spans = container.locator("span[data-hint-label]");
    expect(await spans.count()).toBeGreaterThan(0);
  });

  test("hidden elements do not get hints", async ({ page }) => {
    await page.keyboard.press("f");
    const container = page.locator("#vimimin-hint-container");
    await expect(container).toBeAttached();
    const spans = container.locator("span[data-hint-label]");
    const count = await spans.count();
    // 6 visible targets: link-1, link-2, link-3, btn-1, btn-2, role-btn
    // hidden link and hidden button should be excluded
    expect(count).toBe(6);
  });

  test("typing a label removes the overlay", async ({ page }) => {
    await page.keyboard.press("f");
    const container = page.locator("#vimimin-hint-container");
    await expect(container).toBeAttached();

    // Get the first hint label
    const firstLabel = await container
      .locator("span[data-hint-label]")
      .first()
      .getAttribute("data-hint-label");
    expect(firstLabel).toBeTruthy();

    // Type each character of the label
    if (firstLabel) {
      for (const ch of firstLabel) {
        await page.keyboard.press(ch);
      }
    }

    await expect(container).not.toBeAttached();
  });

  test("Escape cancels hint mode", async ({ page }) => {
    await page.keyboard.press("f");
    const container = page.locator("#vimimin-hint-container");
    await expect(container).toBeAttached();
    await page.keyboard.press("Escape");
    await expect(container).not.toBeAttached();
  });

  test("non-hint character cancels hint mode", async ({ page }) => {
    await page.keyboard.press("f");
    const container = page.locator("#vimimin-hint-container");
    await expect(container).toBeAttached();
    // 'z' is not in the hint alphabet (a-z single chars for small sets)
    // but labels use [a-z] letters; pressing a letter that doesn't match any label prefix cancels
    // Let's find a character that is NOT in any label
    const labels = await container
      .locator("span[data-hint-label]")
      .evaluateAll((els) => els.map((e) => e.dataset.hintLabel ?? ""));
    const usedChars = new Set(labels.map((l) => l[0]));
    const cancelChar = "zxwvutsrqponm".split("").find((c) => !usedChars.has(c));
    expect(cancelChar).toBeDefined();
    if (cancelChar) {
      await page.keyboard.press(cancelChar);
    }
    await expect(container).not.toBeAttached();
  });

  test("all hint labels are unique", async ({ page }) => {
    await page.keyboard.press("f");
    const container = page.locator("#vimimin-hint-container");
    await expect(container).toBeAttached();
    const labels = await container
      .locator("span[data-hint-label]")
      .evaluateAll((els) => els.map((e) => e.dataset.hintLabel));
    const unique = new Set(labels);
    expect(unique.size).toBe(labels.length);
  });

  test(";y enters copy-url hint mode", async ({ page }) => {
    await page.keyboard.press(";");
    await page.keyboard.press("y");
    const container = page.locator("#vimimin-hint-container");
    await expect(container).toBeAttached();
    // Cancel it
    await page.keyboard.press("Escape");
    await expect(container).not.toBeAttached();
  });
});
