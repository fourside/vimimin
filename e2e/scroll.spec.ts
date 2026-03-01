import { expect, openFixture, test } from "./helpers/extension.js";

test.describe("scroll and mode tests", () => {
  test.beforeEach(async ({ page }) => {
    await openFixture(page, "scroll-test.html");
  });

  test("j scrolls down", async ({ page }) => {
    await page.keyboard.press("j");
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });

  test("k scrolls up after scrolling down", async ({ page }) => {
    await page.keyboard.press("j");
    await page.keyboard.press("j");
    const afterDown = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("k");
    const afterUp = await page.evaluate(() => window.scrollY);
    expect(afterUp).toBeLessThan(afterDown);
  });

  test("gg scrolls to top", async ({ page }) => {
    await page.keyboard.press("j");
    await page.keyboard.press("j");
    await page.keyboard.press("j");
    await page.keyboard.press("g");
    await page.keyboard.press("g");
    await page.waitForFunction(() => window.scrollY === 0);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0);
  });

  test("G scrolls to bottom", async ({ page }) => {
    await page.keyboard.press("G");
    await page.waitForFunction(
      () =>
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >= document.body.scrollHeight - 1,
    );
    const atBottom = await page.evaluate(
      () =>
        window.scrollY + window.innerHeight >= document.body.scrollHeight - 1,
    );
    expect(atBottom).toBe(true);
  });

  test("input focus enters insert mode, j does not scroll", async ({
    page,
  }) => {
    await page.click("#text-input");
    const beforeScroll = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("j");
    const afterScroll = await page.evaluate(() => window.scrollY);
    expect(afterScroll).toBe(beforeScroll);
  });

  test("Escape exits insert mode, j scrolls again", async ({ page }) => {
    await page.click("#text-input");
    await page.keyboard.press("Escape");
    await page.keyboard.press("j");
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });

  test("Shift+Escape disables extension", async ({ page }) => {
    await page.keyboard.press("Shift+Escape");
    const beforeScroll = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("j");
    const afterScroll = await page.evaluate(() => window.scrollY);
    expect(afterScroll).toBe(beforeScroll);
  });

  test("Shift+Escape twice re-enables extension", async ({ page }) => {
    await page.keyboard.press("Shift+Escape");
    await page.keyboard.press("Shift+Escape");
    await page.keyboard.press("j");
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });

  test("consumed keys do not reach page listeners", async ({ page }) => {
    await page.evaluate(() => {
      const keys: string[] = [];
      Object.defineProperty(window, "__receivedKeys", { value: keys });
      document.addEventListener("keydown", (e) => {
        keys.push(e.key);
      });
    });

    await page.keyboard.press("j");

    const receivedKeys = await page.evaluate(
      () => (window as unknown as { __receivedKeys: string[] }).__receivedKeys,
    );
    expect(receivedKeys).not.toContain("j");
  });
});
